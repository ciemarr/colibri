import React, { Component, ReactNode } from 'react';
import './Story.scss';

interface Props {
  text: string;
  title?: string;
  author?: string;
  url: string;
}

class Story extends Component<Props> {
  public render() {
    let metadata: ReactNode;
    if (this.props.title && this.props.author) {
      metadata = (
        <React.Fragment>
          <span className="Story-title">{this.props.title}</span>
          <span className="Story-author">{this.props.author}</span>
        </React.Fragment>
      );
    } else {
      metadata = <span className="Story-url">{this.props.url}</span>;
    }

    return (
      <div className="Story">

        <div className="Story-metadata">
          {metadata}
        </div>

        <div className="Story-text-container">
          <div className="Story-text">
            {this.props.text}
          </div>
          <div className="Story-fin">❧</div>
        </div>

      </div>
    );
  }
}

export default Story;
