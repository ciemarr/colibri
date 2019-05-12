import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { sanityCheckInstantiation } from './_support/testHelpers';
import { shallow, ShallowWrapper, ReactWrapper, mount } from 'enzyme';
import StoryLoader, { Props, LoadingStatus } from '../Story/StoryLoader';
import { MinimalAxiosStub } from './_support/MinimalAxiosStub';
import { MinimalLocalForageStub } from './_support/MinimalLocalForageStub';
import { MinimalLocalForage } from '../_support/MinimalLocalForage';
import { MinimalAxios } from '../_support/MinimalAxios';

describe('StoryLoader', () => {
  sanityCheckInstantiation(<StoryLoader {...defaultProps()} />, '.StoryLoader');

  const data = 'Hello, world!';
  const storyUrl = 'http://www.example.com/story/42';
  const proxiedUrl = `${StoryLoader.PROXY_URL}/${storyUrl}`;

  let getItemPromise: Promise<string | null>;
  let setItemPromise: Promise<void>;
  let storyPromise: Promise<{data: string}>;

  let mockStorage: MinimalLocalForage;
  let mockAxios: MinimalAxios;

  beforeEach(() => {
    getItemPromise = Promise.resolve(null);
    setItemPromise = Promise.resolve();

    mockStorage = new MinimalLocalForageStub();
    mockStorage.getItem = sinon.stub()
      .withArgs(storyUrl)
      .returns(getItemPromise);

    mockStorage.setItem = sinon.stub()
      .withArgs(storyUrl, sinon.match.string)
      .returns(setItemPromise);

    storyPromise = Promise.resolve({data});
    mockAxios = new MinimalAxiosStub();
    mockAxios.get = sinon.stub().withArgs(proxiedUrl).returns(storyPromise);
  });

  describe('loads a story', () => {
    it('from props', async () => {
      const subject = fullMount({
        axios: mockAxios,
        storage: mockStorage,
        text: '',
        title: 'A Greeting',
        author: 'C.S. Tradition',
        url: storyUrl,
      });

      await getItemPromise;
      await setItemPromise;
      await storyPromise;

      expect(mockStorage.getItem).to.have.been.calledWith(storyUrl);
      expect(mockStorage.setItem).to.have.been.calledWith(storyUrl, data);
      expect(mockAxios.get).to.have.been.calledOnceWith(proxiedUrl);

      // TODO: better test! doesn't have to be hampered by Vue version
      const storyLoader = subject.instance() as StoryLoader;
      expect(storyLoader.state.loadingStatus).to.eq(LoadingStatus.Succeeded);
      expect(storyLoader.state.story.title).to.eq('A Greeting');
      expect(storyLoader.state.story.author).to.eq('C.S. Tradition');
      expect(storyLoader.state.story.text).to.eq(data);
    });

    it('from the form', async () => {
      const subject = fullMount({
        axios: mockAxios,
        storage: mockStorage,
      });

      setInputValue(subject, 'title', 'A Greeting');
      setInputValue(subject, 'author', 'C.S. Tradition');
      setInputValue(subject, 'url', storyUrl);
      subject.find('.StoryLoader-read-button').simulate('click');

      await getItemPromise;
      await setItemPromise;
      await storyPromise;

      expect(mockStorage.getItem).to.have.been.calledWith(storyUrl);
      expect(mockStorage.setItem).to.have.been.calledWith(storyUrl, data);
      expect(mockAxios.get).to.have.been.calledOnceWith(proxiedUrl);

      // TODO: better test! doesn't have to be hampered by Vue version
      const storyLoader = subject.instance() as StoryLoader;
      expect(storyLoader.state.loadingStatus).to.eq(LoadingStatus.Succeeded);
      expect(storyLoader.state.story.title).to.eq('A Greeting');
      expect(storyLoader.state.story.author).to.eq('C.S. Tradition');
      expect(storyLoader.state.story.text).to.eq(data);
    });

    it('from local storage', async () => {
      getItemPromise = Promise.resolve(data);
      mockStorage.getItem = sinon.stub().withArgs(storyUrl).returns(getItemPromise);

      const subject = shallowMount({ storage: mockStorage });

      setInputValue(subject, 'url', storyUrl);
      subject.find('.StoryLoader-read-button').simulate('click');

      await getItemPromise;

      expect(mockStorage.getItem).to.have.been.calledWith(storyUrl);
      expect(mockStorage.setItem).not.to.have.been.called;
      expect(mockAxios.get).not.to.have.been.called;

      // TODO: better test! doesn't have to be hampered by Vue version
      const storyLoader = subject.instance() as StoryLoader;
      expect(storyLoader.state.loadingStatus).to.eq(LoadingStatus.Succeeded);
      expect(storyLoader.state.story.url).to.eq(storyUrl);
      expect(storyLoader.state.story.text).to.eq(data);
    });
  });

  it('shows a loading indicator', async () => {
    storyPromise = new Promise(() => {/* unresolved */});
    mockAxios.get = sinon.stub().returns(storyPromise);

    const subject = fullMount({
      axios: mockAxios,
      storage: mockStorage,
      url: 'some url',
      text: '',
    });

    expect(subject.find('.StoryLoader').text()).to.eq('Loading...');
  });

  it('disables "Read Story" button when url is missing', async () => {
    const subject = shallowMount({
      axios: mockAxios,
      storage: mockStorage,
      text: 'some story text',
    });

    subject.find('.StoryLoader-read-button').simulate('click');

    expect(mockAxios.get).not.to.have.been.called;

    // TODO: better test! doesn't have to be hampered by Vue version
    const storyLoader = subject.instance() as StoryLoader;
    expect(storyLoader.state.loadingStatus).to.eq(LoadingStatus.MissingRequiredData);
  });

  function setInputValue(
    subject: ReactWrapper | ShallowWrapper,
    name: string,
    value: string)
  {
    const input = subject.find(`.StoryLoader-${name}`);
    input.simulate('change', { target: { name, value } });
  }

  function shallowMount(props: Partial<Props> = {}): ShallowWrapper {
    return shallow(<StoryLoader {...defaultProps(props)} />);
  }

  function fullMount(props: Partial<Props> = {}): ReactWrapper {
    return mount(<StoryLoader {...defaultProps(props)} />);
  }

  function defaultProps(props: Partial<Props> = {}): Props {
    return {
      axios: props.axios || new MinimalAxiosStub(),
      storage: props.storage || new MinimalLocalForageStub(),
      text: 'default test text',
      ...props
    };
  }
});
