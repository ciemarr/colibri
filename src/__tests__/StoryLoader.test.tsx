import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { sanityCheckInstantiation } from './_support/testHelpers';
import { shallow, ShallowWrapper, ReactWrapper, mount } from 'enzyme';
import axios from 'axios';
import localforage from 'localforage';
import StoryLoader, { Props, LoadingStatus } from '../Story/StoryLoader';
import { Props as StoryProps} from '../Story/Story';
import { MinimalAxiosStub } from './_support/MinimalAxiosStub';
import { MinimalLocalForageStub } from './_support/MinimalLocalForageStub';

describe('StoryLoader', () => {
  afterEach(() => {
    sinon.restore();
  });

  sanityCheckInstantiation(<StoryLoader {...defaultProps()} />, '.StoryLoader');

  describe('loads a story', () => {
    const data = 'Hello, world!';
    const storyUrl = 'http://www.example.com/story/42';
    const proxiedUrl = `${StoryLoader.PROXY_URL}/${storyUrl}`;

    afterEach(() => {
      sinon.restore();
    });

    it('from props', async () => {
      const storagePromise = Promise.resolve();
      const mockStorage = new MinimalLocalForageStub();
      mockStorage.getItem = sinon.stub().withArgs(storyUrl).returns(storagePromise);

      const storyPromise = Promise.resolve({data});
      const mockAxios = new MinimalAxiosStub();
      mockAxios.get = sinon.stub().withArgs(proxiedUrl).returns(storyPromise);

      const subject = fullMount({
        axios: mockAxios,
        storage: mockStorage,
        story: {
          text: '',
          title: 'A Greeting',
          author: 'CS Tradition',
          url: storyUrl,
          storage: mockStorage,
        },
      });

      await storagePromise;
      subject.update();
      await storyPromise;
      subject.update();
      subject.update();

      const storyLoader = subject.instance() as StoryLoader;
      expect(mockStorage.getItem).to.have.been.calledWith(storyUrl);
      expect(mockAxios.get).to.have.been.calledOnceWith(proxiedUrl);
      // TODO: better test! doesn't have to be hampered by Vue version
      expect(storyLoader.state.loadingStatus).to.eq(LoadingStatus.Succeeded);
      expect(storyLoader.state.story.title).to.eq('A Greeting');
      expect(storyLoader.state.story.author).to.eq('CS Tradition');
      expect(storyLoader.state.story.text).to.eq(data);
    });

    it('from the form', async () => {
      const storagePromise = Promise.resolve();
      const mockStorage = new MinimalLocalForageStub();
      mockStorage.getItem = sinon.stub().withArgs(storyUrl).returns(storagePromise);

      const storyPromise = Promise.resolve({data});
      const mockAxios = new MinimalAxiosStub();
      mockAxios.get = sinon.stub().withArgs(proxiedUrl).returns(storyPromise);

      const subject = fullMount({
        axios: mockAxios,
        storage: mockStorage,
      });

      setInputValue(subject, 'title', 'A Greeting');
      setInputValue(subject, 'author', 'CS Tradition');
      setInputValue(subject, 'url', storyUrl);
      subject.find('.StoryLoader-read-button').simulate('click');
      subject.update();

      await storagePromise;
      subject.update();
      await storyPromise;
      subject.update();
      subject.update();

      const storyLoader = subject.instance() as StoryLoader;
      expect(mockStorage.getItem).to.have.been.calledWith(storyUrl);
      expect(mockAxios.get).to.have.been.calledOnceWith(proxiedUrl);
      // TODO: better test! doesn't have to be hampered by Vue version
      expect(storyLoader.state.loadingStatus).to.eq(LoadingStatus.Succeeded);
      expect(storyLoader.state.story.title).to.eq('A Greeting');
      expect(storyLoader.state.story.author).to.eq('CS Tradition');
      expect(storyLoader.state.story.text).to.eq(data);
    });

    function setInputValue(
      subject: ReactWrapper | ShallowWrapper,
      name: string,
      value: string) {
      const input = subject.find(`.StoryLoader-${name}`);
      input.simulate('change', { target: { name, value } });
      subject.update();
    }
  });

  it('shows a loading indicator', async () => {
    const storagePromise = Promise.resolve();
    const mockStorage = new MinimalLocalForageStub();
    mockStorage.getItem = sinon.stub().returns(storagePromise);

    const mockAxios = new MinimalAxiosStub();
    const storyPromise = new Promise(() => {/* unresolved */});
    mockAxios.get = sinon.stub().returns(storyPromise);

    const subject = fullMount({
      axios: mockAxios,
      storage: mockStorage,
      story: { url: 'some url', text: '', storage: mockStorage }
    });

    subject.update();

    expect(subject.find('.StoryLoader').text()).to.eq('Loading...');
  });

  it('disables "Read Story" button when url is missing', async () => {
    const storagePromise = Promise.resolve();
    const mockStorage = new MinimalLocalForageStub();
    mockStorage.getItem = sinon.stub().returns(storagePromise);

    const mockAxios = new MinimalAxiosStub();
    mockAxios.get = sinon.stub().returns(new Promise(() => {/* */}));

    const subject = shallowMount({
      axios: mockAxios,
      storage: mockStorage,
      story: { text: 'some story text', storage: mockStorage },
    });

    subject.find('.StoryLoader-read-button').simulate('click');
    await mockAxios.get;
    subject.update();

    const storyLoader = subject.instance() as StoryLoader;
    // TODO: better test! doesn't have to be hampered by Vue version
    expect(storyLoader.state.loadingStatus).to.eq(LoadingStatus.MissingRequiredData);
  });

  function shallowMount(props: Partial<Props> = {}): ShallowWrapper {
    return shallow(<StoryLoader {...defaultProps(props)} />);
  }

  function fullMount(props: Partial<Props> = {}): ReactWrapper {
    return mount(<StoryLoader {...defaultProps(props)} />);
  }

  function defaultProps(props: Partial<Props> = {}): Props {
    const storage = props.storage || new MinimalLocalForageStub();

    const storyProps: StoryProps = {
      text: 'default test text',
      storage,
    };

    return {
      story: {...storyProps, ...props.story},
      axios: props.axios || new MinimalAxiosStub(),
      storage,
    };
  }
});
