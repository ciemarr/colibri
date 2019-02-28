import React from 'react';
import { mount, shallow, ReactWrapper, ShallowWrapper } from 'enzyme';
import { expect } from 'chai';
import Story, { Props } from '../Story/Story';
import { sanityCheckInstantiation } from './_support/testHelpers';
import { MinimalLocalForageStub } from './_support/MinimalLocalForageStub';

describe('Story', () => {
  sanityCheckInstantiation(<Story {...defaultProps()} />, '.Story');

  describe('renders', () => {
    it('basic story data', () => {
      const subject = fullMount({
        text: 'myText',
        title: 'myTitle',
        author: 'myAuthor',
        url: 'myUrl',
      });

      expect(subject.find('.Story-text').text()).to.equal('myText');
      expect(subject.find('.Story-title').text()).to.equal('myTitle');
      expect(subject.find('.Story-author').text()).to.equal('myAuthor');
      expect(subject.find('.Story-pages-current').text()).to.equal('1');
      expect(subject.find('.Story-url').length).to.equal(0);
    });

    it('header shows story url when author & title are missing', () => {
      const subject = shallowMount({
        url: 'myUrl',
        title: undefined,
        author: undefined,
      });


      expect(subject.find('.Story-url').text()).to.equal('myUrl');
      expect(subject.find('.Story-title').length).to.equal(0);
      expect(subject.find('.Story-author').length).to.equal(0);
    });

    it('end-of-story marker', () => {
      const subject = shallowMount();
      expect(subject.find('.Story-fin').length).to.equal(1);
    });

    it('text is sanitized HTML', () => {
      const html = '<p>html <b>bold</b> <script>no script</script></p>';
      const subject = fullMount({ text: html });
      expect(subject.find('.Story-text').text()).to.eq('html bold ');
    });
  });

  describe('page counts', () => {
    const lineHeight = 10;
    let subject: ShallowWrapper<Story>;
    let story: Story;

    beforeEach(() => {
      subject = shallowMount();
      story = subject.instance() as Story;
    });

    describe('calculates total pages', () => {
      it('when full text is equal to one screenful', () => {
        const pages = story.calculateTotalPages(lineHeight, lineHeight, lineHeight);
        expect(pages).to.eq(1);
      });

      it('when full text is less than one screenful', () => {
        const fullStoryTextHeight = 20;
        const visibleHeight = 200;

        const pages = story.calculateTotalPages(
          visibleHeight, fullStoryTextHeight, lineHeight
        );

        expect(pages).to.eq(1);
      });

      it('when full text is greater than one screenful', () => {
        const fullStoryTextHeight = 200;
        const visibleHeight = 20;

        const pages = story.calculateTotalPages(
          visibleHeight, fullStoryTextHeight, lineHeight
        );

        expect(pages).to.eq(10);
      });

      it('when full text is not evenly divisible by screenfuls', () => {
        const fullStoryTextHeight = 25;
        const visibleHeight = 20;

        const pages = story.calculateTotalPages(
          visibleHeight, fullStoryTextHeight, lineHeight
        );

        expect(pages).to.eq(2);
      });
    });

    describe('calculates current page', () => {
      const totalPages = 5;
      const totalHeight = 25;

      beforeEach(() => {
        story.setState({ totalPages });
      });

      /*

      0    5   10   15   20   25     pixels
      |----|----|----|----|----|     scroll position (vertical in real life)
         1    2    3    4    5       page

       0.0 to  2.5 px = page 1
       2.5 to  7.5 px = page 2 (becomes "next page" when halfway thru prev page)
       7.5 to 12.5 px = page 3
      12.5 to 17.5 px = page 4
      17.5 to 22.5 px = page 5
      22.5 to 25.0 px = page 5 (still last page at the very end)

      */

      it('when at the top of the window', () => {
        const page = story.calculateCurrentPage(0, totalHeight);
        expect(page).to.eq(1);
      });

      it('when at the bottom of the window', () => {
        const page = story.calculateCurrentPage(totalHeight, totalHeight);
        expect(page).to.eq(totalPages);
      });

      it('when on the first half of the first page', () => {
        const page = story.calculateCurrentPage(2.49, totalHeight);
        expect(page).to.eq(1);
      });

      it('when on the second half of the first page', () => {
        const page = story.calculateCurrentPage(2.5, totalHeight);
        expect(page).to.eq(2);
      });

      it('when on the first half of a middle page', () => {
        const page = story.calculateCurrentPage(7.5, totalHeight);
        expect(page).to.eq(3);
      });

      it('when on the second half of a middle page', () => {
        const page = story.calculateCurrentPage(12.49, totalHeight);
        expect(page).to.eq(3);
      });

      it('when on the second half of the second-to-last page', () => {
        const page = story.calculateCurrentPage(17.49, totalHeight);
        expect(page).to.eq(totalPages - 1);
      });

      it('when on the first half of the last page', () => {
        const page = story.calculateCurrentPage(17.5, totalHeight);
        expect(page).to.eq(totalPages);
      });
      it('when on the second half of the last page', () => {
        const page = story.calculateCurrentPage(22.49, totalHeight);
        expect(page).to.eq(totalPages);
      });

      it('when on the end of the last page', () => {
        const page = story.calculateCurrentPage(22.5, totalHeight);
        expect(page).to.eq(totalPages);
      });
    });
  });

  function shallowMount(props: Partial<Props> = {}): ShallowWrapper<Story> {
    return shallow(<Story {...defaultProps(props)} />);
  }

  function fullMount(props: Partial<Props> = {}): ReactWrapper<Story> {
    return mount(<Story {...defaultProps(props)} />);
  }

  function defaultProps(props: Partial<Props> = {}): Props {
    return {
      text: 'default test text',
      title: 'default test title',
      author: 'default test author',
      url: 'default test url',
      storage: new MinimalLocalForageStub(),
      ...props
    };
  }
});
