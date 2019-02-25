import { ReactElement } from 'react';
import ReactDOM from 'react-dom';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';

// Appease jest + react-scripts: "Your test suite must contain at least one test."
it('loads test helpers', () => { /* */ });

export function sanityCheckInstantiation(component: ReactElement, cssSelector: string) {

  describe('sanity check: make sure it can instatiate', () => {
    it('with ReactDOM', () => {
      const div = document.createElement('div');
      ReactDOM.render(component, div);
      const story = div.querySelector(cssSelector) as Element;
      expect(story).to.not.be.null;
    });

    it('with shallow', () => {
      const subject = shallow(component);
      expect(subject.find(cssSelector).length).to.equal(1);
    });

    it('with mount', () => {
      const subject = mount(component);
      expect(subject.find(cssSelector).length).to.equal(1);
    });
  });

}
