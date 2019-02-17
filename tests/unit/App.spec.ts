import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import App from '@/App.vue';
import Story from '@/components/Story.vue';

describe('App', () => {
  it('renders a Story', () => {
    const subject = shallowMount(App);
    expect(subject.find(Story)).to.exist;
  });
});
