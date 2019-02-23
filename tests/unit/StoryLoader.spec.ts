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
    const storyPromise = Promise.resolve({data});

    const axios = {
      get: sinon.stub().withArgs(proxiedUrl).returns(storyPromise)
    };

    const subject = shallowMount(StoryLoader, { propsData: { axios } });

    subject.find('.StoryLoader-title').setValue('A Greeting');
    subject.find('.StoryLoader-author').setValue('CS Tradition');
    subject.find('.StoryLoader-url').setValue(storyUrl);

    subject.find('.StoryLoader-read-button').trigger('click');

    await storyPromise;
    await subject.vm.$nextTick();

    const storyLoader = subject.vm as StoryLoader;
    expect(axios.get).to.have.been.calledOnceWith(proxiedUrl);
    expect(storyLoader.loadingStatus).to.eq('succeeded');
    expect(storyLoader.title).to.eq('A Greeting');
    expect(storyLoader.author).to.eq('CS Tradition');
    expect(storyLoader.text).to.eq(data);
  });

  it('shows a loading indicator', () => {
    const axios = {
      get: sinon.stub().returns(new Promise(() => {}))
    };

    const subject = shallowMount(StoryLoader, { propsData: { axios } });

    subject.find('.StoryLoader-url').setValue('some unmocked url');
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
