import React, { Component } from 'react';

type Props = {
  text: string,
  title?: string,
  author?: string,
  url?: string,
};

class Story extends Component<Props> {
  render() {
    return (
      <div className="Story">
        {this.props.text}
      </div>
    );
  }
}

export default Story;
