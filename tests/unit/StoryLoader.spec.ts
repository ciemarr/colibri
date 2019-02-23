import { expect } from 'chai';
import sinon from 'sinon';
import { shallowMount } from '@vue/test-utils';
import StoryLoader from '@/components/StoryLoader.vue';
import Story from '@/components/Story.vue';

describe('StoryLoader', () => {
  it('loads a story', async () => {
    const data = 'Hello, world!';
    const storyUrl = 'http://www.example.com/story/42';
    const proxiedUrl = `${StoryLoader.PROXY_URL}/${storyUrl}`;

    const axios = {
      get: sinon.stub().withArgs(proxiedUrl).returns(Promise.resolve({data}))
    };

    const subject = shallowMount(StoryLoader, { propsData: { axios } });

    subject.find('.StoryLoader-title').setValue('A Greeting');
    subject.find('.StoryLoader-author').setValue('CS Tradition');
    subject.find('.StoryLoader-url').setValue(storyUrl);

    subject.find('.StoryLoader-read-button').trigger('click');

    await subject.vm.$nextTick();

    const storyLoader = subject.vm as StoryLoader;
    const story = subject.find(Story).vm as Story;

    expect(storyLoader.loadingStatus).to.eq('succeeded');
    expect(story.title).to.eq('A Greeting');
    expect(story.author).to.eq('CS Tradition');
    expect(story.text).to.eq(data);
    expect(axios.get).to.have.been.calledOnceWith(proxiedUrl);
  });

  it('shows a loading indicator', () => {
    const axios = {
      get: sinon.stub().returns(new Promise(() => {}))
    };

    const subject = shallowMount(StoryLoader, { propsData: { axios } });

    subject.find('.StoryLoader-read-button').trigger('click');

    const storyLoader = subject.vm as StoryLoader;
    expect(storyLoader.loadingStatus).to.eq('loading');
  });

  it('disables "Read Story" button if there is no story URL', () => {
    const axios = {
      get: sinon.stub().returns(new Promise(() => {}))
    };

    const subject = shallowMount(StoryLoader, { propsData: { axios } });

    subject.find('.StoryLoader-read-button').trigger('click');

    const storyLoader = subject.vm as StoryLoader;
    expect(storyLoader.loadingStatus).to.eq('no-url');
  });

  /*
  it('shows a failure indicator', async () => {
    const axios = {
      get: sinon.stub().returns(Promise.reject()) // does not work in test??
    };

    const subject = shallowMount(StoryLoader, { propsData: { axios } });

    subject.find('.StoryLoader-read-button').trigger('click');

    const storyLoader = subject.vm as StoryLoader;
    expect(storyLoader.loadingStatus).to.eq('failed');
  });
  */
});
