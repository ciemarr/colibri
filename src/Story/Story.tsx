import React, { Component, ReactNode, RefObject } from 'react';
import { HeadProvider, Title } from 'react-head';
import localforage from 'localforage';
import SanitizedHTML from 'react-sanitized-html';
import sanitizeHtml from 'sanitize-html';
import './Story.scss';

export interface Props {
  text: string;
  title?: string;
  author?: string;
  url?: string;
}

interface State {
  currentPage: number;
  totalPages: number;
}

class Story extends Component<Readonly<Props>, State> {
  private static readonly DEFAULT_LINE_HEIGHT = '16px';

  public state: State = {
    currentPage: 1,
    totalPages: 0,
  };

  private storyTextEl: HTMLDivElement | null = null;

  private storageKey = `currentScrollPosition-${this.props.url}`;

  public async componentDidMount() {
    this.setTotalPages();

    const savedScrollPosition = await localforage.getItem<number>(this.storageKey);
    if (savedScrollPosition) {
      const options: ScrollToOptions = { top: savedScrollPosition };
      window.scrollTo(options);
    }

    window.addEventListener('resize', this.setTotalPages);
    window.addEventListener('scroll', this.setCurrentPage);
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.setTotalPages);
    window.removeEventListener('scroll', this.setCurrentPage);
  }

  public render() {
    return (

      <div className="Story">

        <HeadProvider>
          <Title>{this.htmlTitle()}</Title>
        </HeadProvider>

        <div className="Story-metadata">
          {this.renderMetadata()}
        </div>

        <div className="Story-text-container">
          {this.renderText()}
        </div>

        <div className="Story-pages-container">
          {this.renderPageCounts()}
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

        <div
          className="Story-text"
          ref={(el) => { this.storyTextEl = el; }}
        >
          <SanitizedHTML
            allowedTags={allowedTags}
            html={this.props.text}
          />
        </div>

        <div className="Story-fin">❧</div>
      </React.Fragment>
    );
  }

  private renderPageCounts(): ReactNode {
    // Shenanigans to preserve space between the rendered words.
    const page = <span>page</span>;
    const current = <span className="Story-pages-current">{this.state.currentPage}</span>;
    const of = <span>of</span>;
    const total = <span className="Story-pages-total">{this.state.totalPages}</span>;

    return (
      <span className="Story-pages">
        {page} {current} {of} {total}
      </span>
    );
  }

  private htmlTitle(): string {
    let title: string;
    if (this.props.title && this.props.author) {
      title = `${this.props.title} — ${this.props.author}`;
    } else {
      title = this.props.url || '';
    }
    return `Colibri: ${title}`;
  }

  private setTotalPages = (): void => {
    if (!this.storyTextEl) return;

    const storyTextStyle = window.getComputedStyle(this.storyTextEl);
    const lineHeightStr = storyTextStyle.lineHeight;
    const lineHeight = parseInt(lineHeightStr || Story.DEFAULT_LINE_HEIGHT, 10);

    const totalPages = this.calculateTotalPages(
      window.innerHeight,
      this.storyTextEl.clientHeight,
      lineHeight
    );

    if (totalPages !== this.state.totalPages) {
      this.setState({ totalPages });
    }
  }

  public calculateTotalPages(
    visibleHeight: number,
    fullStoryTextHeight: number,
    lineHeight: number
  ): number {
    const totalLines = fullStoryTextHeight / lineHeight;
    const visibleLines = visibleHeight / lineHeight;

    const floatPages = totalLines / visibleLines;
    const integerPages = Math.floor(floatPages);
    const maybeExtraPage = (floatPages > integerPages ? 1 : 0);

    return integerPages + maybeExtraPage;
  }

  private setCurrentPage = (): void => {
    if (!this.storyTextEl) return;

    localforage.setItem<number>(this.storageKey, window.scrollY);

    const currentPage = this.calculateCurrentPage(
      window.scrollY,
      this.storyTextEl.scrollHeight
    );

    if (currentPage !== this.state.currentPage) {
      this.setState({ currentPage });
    }
  }

  public calculateCurrentPage(scrollPosition: number, scrollHeight: number): number {
    const pageSize = scrollHeight / this.state.totalPages;
    const adjustedScrollPosition = scrollPosition + (pageSize / 2);
    const floatCurrentPage = adjustedScrollPosition / scrollHeight * this.state.totalPages;
    const integerCurrentPage = Math.floor(floatCurrentPage) + 1;
    return Math.min(Math.max(1, integerCurrentPage), this.state.totalPages);
  }
}

export default Story;
