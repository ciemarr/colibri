import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { sanityCheckInstantiation } from './_support/testHelpers';
import { shallow, ShallowWrapper, ReactWrapper, mount } from 'enzyme';
import StoryLoader, { Props, LoadingStatus } from '../Story/StoryLoader';
import { Props as StoryProps} from '../Story/StoryView';
import { MinimalAxiosStub } from './_support/MinimalAxiosStub';
import { MinimalLocalForageStub } from './_support/MinimalLocalForageStub';
import { MinimalLocalForage } from '../_support/MinimalLocalForage';
import { MinimalAxios } from '../_support/MinimalAxios';

describe('StoryLoader', () => {
  sanityCheckInstantiation(<StoryLoader {...defaultProps()} />, '.StoryLoader');

  const data = 'Hello, world!';
  const storyUrl = 'http://www.example.com/story/42';
  const proxiedUrl = `${StoryLoader.PROXY_URL}/${storyUrl}`;

  let storagePromise: Promise<string | null>;
  let storyPromise: Promise<{data: string}>;

  let mockStorage: MinimalLocalForage;
  let mockAxios: MinimalAxios;

  beforeEach(() => {
    storagePromise = Promise.resolve(null);
    mockStorage = new MinimalLocalForageStub();
    mockStorage.getItem = sinon.stub().withArgs(storyUrl).returns(storagePromise);

    storyPromise = Promise.resolve({data});
    mockAxios = new MinimalAxiosStub();
    mockAxios.get = sinon.stub().withArgs(proxiedUrl).returns(storyPromise);
  });

  describe('loads a story', () => {
    it('from props', async () => {
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
      await storyPromise;

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
      const subject = fullMount({
        axios: mockAxios,
        storage: mockStorage,
      });

      setInputValue(subject, 'title', 'A Greeting');
      setInputValue(subject, 'author', 'CS Tradition');
      setInputValue(subject, 'url', storyUrl);
      subject.find('.StoryLoader-read-button').simulate('click');

      await storagePromise;
      await storyPromise;

      const storyLoader = subject.instance() as StoryLoader;
      expect(mockStorage.getItem).to.have.been.calledWith(storyUrl);
      expect(mockAxios.get).to.have.been.calledOnceWith(proxiedUrl);
      // TODO: better test! doesn't have to be hampered by Vue version
      expect(storyLoader.state.loadingStatus).to.eq(LoadingStatus.Succeeded);
      expect(storyLoader.state.story.title).to.eq('A Greeting');
      expect(storyLoader.state.story.author).to.eq('CS Tradition');
      expect(storyLoader.state.story.text).to.eq(data);
    });

    it('from local storage', async () => {
      storagePromise = Promise.resolve(data);
      mockStorage.getItem = sinon.stub().withArgs(storyUrl).returns(storagePromise);

      const subject = shallowMount({ storage: mockStorage });

      setInputValue(subject, 'url', storyUrl);
      subject.find('.StoryLoader-read-button').simulate('click');

      await storagePromise;

      const storyLoader = subject.instance() as StoryLoader;
      expect(mockStorage.getItem).to.have.been.calledWith(storyUrl);
      // TODO: better test! doesn't have to be hampered by Vue version
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
      story: { url: 'some url', text: '', storage: mockStorage }
    });

    expect(subject.find('.StoryLoader').text()).to.eq('Loading...');
  });

  it('disables "Read Story" button when url is missing', async () => {
    mockAxios.get = sinon.stub().returns(new Promise(() => {/* */}));

    const subject = shallowMount({
      axios: mockAxios,
      storage: mockStorage,
      story: { text: 'some story text', storage: mockStorage },
    });

    subject.find('.StoryLoader-read-button').simulate('click');
    await mockAxios.get;

    const storyLoader = subject.instance() as StoryLoader;
    // TODO: better test! doesn't have to be hampered by Vue version
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
