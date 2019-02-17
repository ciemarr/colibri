import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import Story from '@/components/Story.vue';

describe('Story', () => {
  it('renders text passed', () => {
    const text = 'Hello, world!';
    const title = 'Greeting';
    const author = 'CS Tradition';

    const subject = shallowMount(Story, {
      propsData: { text, title, author },
    });

    expect(subject.find('.Story-text').text()).to.equal(text);
    expect(subject.find('.Story-title').text()).to.equal(title);
    expect(subject.find('.Story-author').text()).to.equal(author);
  });
});
