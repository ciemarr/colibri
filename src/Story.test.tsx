import React from 'react';
import ReactDOM from 'react-dom';
import Story from './Story';

describe('Story', () => {
  describe('renders', () => {
    it('basic story data', () => {
      const div = document.createElement('div');
      ReactDOM.render(<Story text='Hello, world!' />, div);
      ReactDOM.unmountComponentAtNode(div);
    });

    xit('header shows story url when author & title are missing', () => {});
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
  });
});
