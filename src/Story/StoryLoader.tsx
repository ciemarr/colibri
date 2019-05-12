import React, { Component, ReactNode } from 'react';
import { MinimalAxios } from '../_support/MinimalAxios';
import StoryView, { Props as StoryProps } from './StoryView';
import { Story } from './Story';
import './StoryLoader.scss';

export enum LoadingStatus {
  Loading,
  Succeeded,
  Failed,
  MissingRequiredData,
}

export interface Props extends StoryProps {
  readonly axios: MinimalAxios;
}

export interface State {
  loadingStatus: LoadingStatus;
  story: Partial<Story>;
}

class StoryLoader extends Component<Props, State> {
  public static readonly PROXY_URL: string = 'https://cors-anywhere.herokuapp.com';

  public state: State = {
    loadingStatus: (!!this.props.url) ? LoadingStatus.Loading : LoadingStatus.MissingRequiredData,
    story: this.defaultStoryState(),
  };

  private defaultStoryState(): Partial<Story> {
    return { ...this.props };
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
        return <StoryView {...this.state.story} storage={this.props.storage} />;

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
          disabled={!this.state.story.url}
          onClick={this.updateStoryText}
        >
          Read Story
        </button>
      </React.Fragment>
    );
  }

  private renderInput(attr: keyof Story): ReactNode {
    return (
      <input
        className={`StoryLoader-${attr}`}
        placeholder={`story ${attr}`}
        name={attr}
        defaultValue={this.state.story[attr]}
        onChange={this.onInputChange}
      />
    );
  }

  private async updateStoryText() {
    if (!this.state.story.url) return;
    const storyUrl = this.state.story.url;

    this.setState({ loadingStatus: LoadingStatus.Loading }, async () => {

      const savedStoryText = await this.props.storage.getItem<string>(storyUrl);
      let storyText = savedStoryText;

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

      if (savedStoryText !== storyText) {
        this.props.storage.setItem<string>(storyUrl, storyText);
      }

      const story = {...this.state.story, text: storyText || ''};
      this.setState({ story, loadingStatus: LoadingStatus.Succeeded });

    });
  }

  private onInputChange(event: any) {
    const target = event.target;
    const story = this.state.story;
    (story as any)[target.name] = target.value;
    this.setState({ story });
  }
}

export default StoryLoader;
