import React from 'react';
import { mount, shallow, ReactWrapper, ShallowWrapper } from 'enzyme';
import { expect } from 'chai';
import Story, { Props } from './Story';
import { sanityCheckInstantiation } from '../_support/testHelpers';

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

  // tslint:disable: no-empty
  xit('resize happens on load', () => {});

  xdescribe('calculates total pages', () => {
    xit('when full text is equal to one screenful', () => {});
    xit('when full text is less than one screenful', () => {});
    xit('when full text is greater than one screenful', () => {});
    xit('when full text is not evenly divisible by screenfuls', () => {});
  });

  xdescribe('calculates current page', () => {
    xit('when at the top of the window', () => {});
    xit('when at the bottom of the window', () => {});
    xit('when on the first half of the first page', () => {});
    xit('when on the second half of the first page', () => {});
    xit('when on the first half a middle page', () => {});
    xit('when on the second half a middle page', () => {});
    xit('when on the second half of the second-to-last page', () => {});
    xit('when on the first half of the last page', () => {});
    xit('when on the second half of the last page', () => {});
    xit('when on the end of the last page', () => {});
    // tslint:enable: no-empty
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
      ...props
    };
  }
});
