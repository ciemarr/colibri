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

  function shallow(optionalProps: any = {}) {
    const props: any = {};

    props.propsData = defaultValue(optionalProps.propsData, {});
    props.propsData.author = defaultValue(props.propsData.author, 'myAuthor');
    props.propsData.title = defaultValue(props.propsData.title, 'myTitle');
    props.propsData.text = defaultValue(props.propsData.text, 'myText');

    props.directives = defaultValue(optionalProps.directives, {});
    props.directives.resize = defaultValue(props.directives.resize, {});

    return shallowMount(Story, props);
  }

  function defaultValue(variable: any, value: any): any {
    return (typeof variable === 'undefined') ? value : variable;
  }
});
