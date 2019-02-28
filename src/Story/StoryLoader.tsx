import React, { Component, ReactNode } from 'react';
import { MinimalAxios } from '../_support/MinimalAxios';
import { MinimalLocalForage } from '../_support/MinimalLocalForage';
import Story, { Props as StoryProps } from './Story';
import './StoryLoader.scss';

export enum LoadingStatus {
  Loading,
  Succeeded,
  Failed,
  MissingRequiredData,
}

export interface Props {
  readonly story?: StoryProps;
  readonly axios: MinimalAxios;
  readonly storage: MinimalLocalForage;
}

export interface State {
  loadingStatus: LoadingStatus;
  story: StoryProps;
}

class StoryLoader extends Component<Props, State> {
  public static readonly PROXY_URL: string = 'https://cors-anywhere.herokuapp.com';

  public state: State = {
    loadingStatus: (this.props.story && !!this.props.story.url)
      ? LoadingStatus.Loading : LoadingStatus.MissingRequiredData,
    story: this.defaultStoryState(),
  };

  private defaultStoryState(): StoryProps {
    const defaultProps: StoryProps = {
      url: '',
      text: '',
      storage: this.props.storage,
    };
    return { ...defaultProps, ...this.props.story };
  }

  constructor(props: Props) {
    super(props);
    this.updateStoryText = this.updateStoryText.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }

  public componentDidMount() {
    this.updateStoryText();
  }

  public render() {
    return (
      <div className="StoryLoader">
        {this.renderContent()}
      </div>
    );
  }

  private renderContent(): ReactNode {
    switch (this.state.loadingStatus) {
      case LoadingStatus.MissingRequiredData:
        return this.renderForm();

      case LoadingStatus.Loading:
        return <p>Loading...</p>;

      case LoadingStatus.Failed:
        return <p>Failed to load.</p>;

      case LoadingStatus.Succeeded:
        return <Story {...this.state.story} />;

      default:
        return <p>Unknown error!</p>;
    }
  }

  private renderForm(): ReactNode {
    return (
      <React.Fragment>
        {this.renderInput('url')}
        {this.renderInput('title')}
        {this.renderInput('author')}

        <button
          className="StoryLoader-read-button"
          disabled={!this.hasRequiredData()}
          onClick={this.updateStoryText}
        >
          Read Story
        </button>
      </React.Fragment>
    );
  }

  private renderInput(attr: keyof StoryProps): ReactNode {
    return (
      <input
        className={`StoryLoader-${attr}`}
        placeholder={`story ${attr}`}
        name={attr}
        defaultValue={this.state.story[attr] as string}
        onChange={this.onInputChange}
      />
    );
  }

  private async updateStoryText() {
    if (!this.hasRequiredData()) return;

    this.setState({ loadingStatus: LoadingStatus.Loading }, async () => {

      const storyUrl = this.state.story.url!;
      let storyText = await this.props.storage.getItem<string>(storyUrl);

      if (!storyText) {
        try {
          const proxiedUrl = `${StoryLoader.PROXY_URL}/${storyUrl}`;
          const response = await this.props.axios.get(proxiedUrl);
          storyText = response.data;
        } catch (error) {
          return this.setState({ loadingStatus: LoadingStatus.Failed });
        }
      }

      if (!storyText) {
        return this.setState({ loadingStatus: LoadingStatus.Failed });
      }

      this.props.storage.setItem<string>(storyUrl, storyText);
      const story = this.state.story;
      story.text = storyText || '';
      this.setState({ story, loadingStatus: LoadingStatus.Succeeded });

    });
  }

  private onInputChange(event: any) {
    const target = event.target;
    const story = this.state.story;
    (story as any)[target.name] = target.value;
    this.setState({ story });
  }

  private hasRequiredData(): boolean {
    return !!this.state.story.url;
  }
}

export default StoryLoader;
