import { expect } from 'chai';
import sinon from 'sinon';
import { shallowMount } from '@vue/test-utils';
import Story from '@/components/Story.vue';
import { DirectiveOptions, VNode } from 'vue';
import { DirectiveBinding } from 'vue/types/options';

describe('Story', () => {
  it('renders basic story data', () => {
    const text = 'Hello, world!';
    const title = 'Greeting';
    const author = 'CS Tradition';

    const subject = shallow({ propsData: { text, title, author } });

    expect(subject.find('.Story-text').text()).to.equal(text);
    expect(subject.find('.Story-title').text()).to.equal(title);
    expect(subject.find('.Story-author').text()).to.equal(author);
  });

  it('shows story url if there is no author or title', () => {
    const storyUrl = 'http://example.com/story/42';
    const subject = shallow({ propsData: { storyUrl, title: null, author: null }});
    expect(subject.find('.Story-metadata').text()).to.eq(storyUrl);
  });

  it('renders sanitized HTML', () => {
    const html = '<p>html <b>bold</b> <script>no script</script></p>';
    const subject = shallow({ propsData: { text: html }});
    expect(subject.find('.Story-text').text()).to.eq('html bold');
  });

  it('renders an end-of-story marker', () => {
    const subject = shallow();
    expect(subject.find('.Story-fin')).to.exist;
  });

  it('resize happens on mount', () => {
    const resizeDirective: DirectiveOptions = {
      inserted: sinon.spy(),
    };

    const _subject = shallow({ directives: { resize: resizeDirective } });

    expect(resizeDirective.inserted).to.have.been.calledOnce;
  });

  describe('calculates total pages', () => {
    const lineHeight = 10;

    it('when full text is equal to one screenful', () => {
      const subject = shallow();
      const pages = subject.vm.calculateTotalPages(
        lineHeight, lineHeight, lineHeight
      );
      expect(pages).to.eq(1);
    });

    it('when full text is less than one screenful', () => {
      const subject = shallow();

      const fullStoryTextHeight = 20;
      const visibleHeight = 200;

      const pages = subject.vm.calculateTotalPages(
        visibleHeight, fullStoryTextHeight, lineHeight
      );

      expect(pages).to.eq(1);
    });

    it('when full text is greater than one screenful', () => {
      const subject = shallow();

      const fullStoryTextHeight = 200;
      const visibleHeight = 20;

      const pages = subject.vm.calculateTotalPages(
        visibleHeight, fullStoryTextHeight, lineHeight
      );

      expect(pages).to.eq(10);
    });

    it('when full text is not evenly divisible by screenfuls', () => {
      const subject = shallow();

      const fullStoryTextHeight = 25;
      const visibleHeight = 20;

      const pages = subject.vm.calculateTotalPages(
        visibleHeight, fullStoryTextHeight, lineHeight
      );

      expect(pages).to.eq(2);
    });
  });

  describe('calculates current page', () => {
    let story: Story;
    const totalPages = 5;
    const totalHeight = 25;

    beforeEach(() => {
      const subject = shallow();
      story = subject.vm;
      story.totalPages = totalPages;
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

  function shallow(optionalProps: any = {}) {
    const props: any = {};

    props.propsData = defaultValue(optionalProps.propsData, {});
    props.propsData.author = defaultValue(props.propsData.author, 'myAuthor');
    props.propsData.title = defaultValue(props.propsData.title, 'myTitle');
    props.propsData.text = defaultValue(props.propsData.text, 'myText');
    props.propsData.storyUrl = defaultValue(props.propsData.storyUrl, 'http://example.com');

    props.directives = defaultValue(optionalProps.directives, {});
    props.directives.resize = defaultValue(props.directives.resize, {});

    return shallowMount(Story, props);
  }

  function defaultValue(variable: any, value: any): any {
    return (typeof variable === 'undefined') ? value : variable;
  }
});
