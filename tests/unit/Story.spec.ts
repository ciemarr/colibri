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

    props.propsData = optionalProps.propsData || {};
    props.propsData.author = props.propsData.author || 'myAuthor';
    props.propsData.title = props.propsData.title || 'myTitle';
    props.propsData.text = props.propsData.text || 'myText';

    props.directives = optionalProps.directives || {};
    props.directives.resize = props.directives.resize || {};

    return shallowMount(Story, props);
  }
});
