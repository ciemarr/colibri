import { expect } from 'chai';
import sinon from 'sinon';
import { shallowMount } from '@vue/test-utils';
import StoryLoader from '@/components/StoryLoader.vue';
import Story from '@/components/Story.vue';

describe('StoryLoader', () => {
  it('loads a story by URL', async () => {
    const data = 'Hello, world!';
    const storyUrl = 'http://www.example.com/story/42';
    const proxiedUrl = `${StoryLoader.PROXY_URL}/${storyUrl}`;

    const axios = {
      get: sinon.stub().withArgs(proxiedUrl).returns(Promise.resolve({data}))
    };

    const subject = shallowMount(StoryLoader, {
      propsData: { storyUrl, axios },
    });
    await subject.vm.$nextTick();

    const story = subject.find(Story).vm as Story;
    expect(story.text).to.eq(data);
    expect(axios.get).to.have.been.calledOnceWith(proxiedUrl);
  });

  it('shows a loading indicator', async () => {
    const axios = {
      get: sinon.stub().returns(new Promise(() => {}))
    };

    const subject = shallowMount(StoryLoader,
      { propsData: { axios, storyUrl: 'some-url' } });
    await subject.vm.$nextTick();

    expect(subject.find('.StoryLoader').text()).to.contain('Loading...');
  });

  it('shows instructions when no story URL is given', () => {
    const subject = shallowMount(StoryLoader);
    const expectedMsg = 'http://localhost/story/https://example.com/url/of/a/story/to/load';
    expect(subject.find('.StoryLoader').text()).to.contain(expectedMsg);
  });

  /*
  it('shows a failure indicator', async () => {
    const axios = {
      get: sinon.stub().returns(Promise.reject()) // does not work in test??
    };

    const subject = shallowMount(StoryLoader, { propsData: { axios } });
    await subject.vm.$nextTick();

    expect(subject.find('.StoryLoader').text()).to.contain('Failed to load.');
  });
  */
});
