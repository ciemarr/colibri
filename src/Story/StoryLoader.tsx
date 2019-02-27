import React, { Component, ReactNode } from 'react';
import { MinimalAxios } from '../_support/MinimalAxios';
import localForage from 'localforage';
import Story, { Props as StoryProps } from './Story';
import './StoryLoader.scss';

export enum LoadingStatus {
  Loading,
  Succeeded,
  Failed,
  MissingRequiredData,
}

export interface Props {
  readonly axios: MinimalAxios;
  readonly story?: StoryProps;
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
    story: this.props.story || { url: '', text: '' },
  };

  constructor(props: Props) {
    super(props);
    this.updateStoryText = this.updateStoryText.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }

  public componentDidMount() {
    this.updateStoryText();
  }

  public render() {
    let content: ReactNode;
    if (LoadingStatus.MissingRequiredData === this.state.loadingStatus) {
      content = this.renderForm();
    } else if (LoadingStatus.Loading === this.state.loadingStatus) {
      content = <p>Loading...</p>;
    } else if (LoadingStatus.Failed === this.state.loadingStatus) {
      content = <p>Failed to load.</p>;
    } else if (LoadingStatus.Succeeded === this.state.loadingStatus) {
      content = <Story {...this.state.story} />;
    } else {
      content = <p>Unknown error!</p>;
    }

    return (
      <div className="StoryLoader">
        {content}
      </div>
    );
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
        defaultValue={this.state.story[attr]}
        onChange={this.onInputChange}
      />
    );
  };

  private async updateStoryText() {
    if (!this.hasRequiredData()) return;

    this.setState({ loadingStatus: LoadingStatus.Loading }, async () => {

      const storyUrl = this.state.story.url!;
      const proxiedUrl = `${StoryLoader.PROXY_URL}/${storyUrl}`;

      try {
        const storyText = await localForage.getItem<string>(storyUrl) || (await this.props.axios.get(proxiedUrl)).data;
        localForage.setItem<string>(storyUrl, storyText);
        const story = this.state.story;
        story.text = storyText || '';
        this.setState({ story, loadingStatus: LoadingStatus.Succeeded });
      } catch (error) {
        this.setState({ loadingStatus: LoadingStatus.Failed });
      }

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