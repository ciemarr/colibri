import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import Story from '@/components/Story.vue';

describe('Story', () => {
  it('renders text passed', () => {
    const text = 'Hello, world!';
    const subject = shallowMount(Story, {
      propsData: { text },
    });
    expect(subject.text()).to.include(text);
  });
});
