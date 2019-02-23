import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import Story from './Story';

describe('Story', () => {
  describe('sanity check', () => {
    it('shallowRender', () => {
      shallow(<Story text="Hello, world!" url="myUrl" />);
    });

    it('mountRender', () => {
      mount(<Story text="Hello, world!" url="myUrl" />);
    });
  });

  describe('renders', () => {
    it('basic story data', () => {
      const subject = shallow(
        <Story text="myText" title="myTitle" author="myAuthor" url="myUrl" />
      );

      expect(subject.find('.Story-text').text()).to.equal('myText');
      expect(subject.find('.Story-title').text()).to.equal('myTitle');
      expect(subject.find('.Story-author').text()).to.equal('myAuthor');
      expect(subject.find('.Story-url').length).to.equal(0);
    });

    it('header shows story url when author & title are missing', () => {
      const subject = shallow(<Story text="myText" url="myUrl" />);

      expect(subject.find('.Story-url').text()).to.equal('myUrl');
      expect(subject.find('.Story-title').length).to.equal(0);
      expect(subject.find('.Story-author').length).to.equal(0);
    });

    // tslint:disable: no-empty
    xit('text is sanitized HTML', () => {});
    xit('end-of-story marker', () => {});
  });

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
});
