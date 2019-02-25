import React, { Component, ReactNode } from 'react';
import SanitizedHTML from 'react-sanitized-html';
import sanitizeHtml from 'sanitize-html';
import './Story.scss';

export interface Props {
  readonly text: string;
  readonly title?: string;
  readonly author?: string;
  readonly url: string;
}

class Story extends Component<Props> {
  public render() {
    return (
      <div className="Story">
        <div className="Story-metadata">
          {this.renderMetadata()}
        </div>
        <div className="Story-text-container">
          {this.renderText()}
        </div>
      </div>
    );
  }

  private renderMetadata(): ReactNode {
    if (this.props.title && this.props.author) {
      return (
        <React.Fragment>
          <span className="Story-title">{this.props.title}</span>
          <span className="Story-author">{this.props.author}</span>
        </React.Fragment>
      );
    }

    return <span className="Story-url">{this.props.url}</span>;
  }

  private renderText(): ReactNode {
    const allowedTags = sanitizeHtml.defaults.allowedTags.concat([
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    ]);

    return (
      <React.Fragment>

        <div className="Story-text">
          <SanitizedHTML
            allowedTags={allowedTags}
            html={ this.props.text }
          />
        </div>

        <div className="Story-fin">❧</div>
      </React.Fragment>
    );
  }
}

export default Story;
