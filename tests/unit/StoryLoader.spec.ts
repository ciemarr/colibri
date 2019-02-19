import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import StoryLoader from '@/components/StoryLoader.vue';
import Story from '@/components/Story.vue';

describe('StoryLoader', () => {
  it('renders a default story', () => {
    const subject = shallowMount(StoryLoader);
    expect(subject.find(Story)).to.exist;
  });

  it('loads a story by URL'); /*, () => {
    const storyUrl = 'http://www.example.com/story/42';
    const subject = shallowMount(StoryLoader, { propsData: { storyUrl } })
    assert.fail('TODO');
  });*/
});
