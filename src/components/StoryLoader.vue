<template :key="loadingStatus">
  <div class="StoryLoader">

    <p v-if="'loading' === loadingStatus">
      Loading...
    </p>

    <Story v-if="'succeeded' === loadingStatus"
      v-bind:title="title"
      v-bind:author="author"
      v-bind:text="text"
      v-bind:storyUrl="storyUrl"
     />

    <p v-if="'failed' === loadingStatus">
      Failed to load.
    </p>

    <div v-if="'no-url' === loadingStatus">
      <p>Add the story's URL to the address bar!</p>
      <pre>{{ baseUrl }}/?url=https://example.com/url/of/a/story/to/load</pre>
    </div>
  </div>
</template>


<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { AxiosInstance } from 'axios';
import Story from '@/components/Story.vue';
import { getStorage } from '@/helpers';

@Component({
  components: {
    Story,
  }
})
export default class StoryLoader extends Vue {
  public static readonly PROXY_URL: string = 'https://cors-anywhere.herokuapp.com';

  public title: string | null = null;
  public author: string | null = null;
  public text: string | null = null;

  private loadingStatus: 'loading' | 'succeeded' | 'failed' | 'no-url';
  private baseUrl: string = window.location.origin;
  private readonly storage: Storage;

  @Prop() private readonly storyUrl!: string;
  @Prop() private readonly axios!: AxiosInstance;

  constructor() {
    super();
    this.loadingStatus = this.storyUrl ? 'loading' : 'no-url';
    this.storage = getStorage();
  }

  private async created() {
    if (!this.storyUrl) {
      this.loadingStatus = 'no-url';
      return;
    }

    const savedStoryText = this.storage.getItem(this.storyUrl);
    if (savedStoryText) {
      this.updateStoryText(savedStoryText);
      return;
    }

    try {
      const proxiedUrl = `${StoryLoader.PROXY_URL}/${this.storyUrl}`;
      const response = await this.axios.get(proxiedUrl);
      this.updateStoryText(response.data);
    } catch (error) {
      this.loadingStatus = 'failed';
    }
  }

  private updateStoryText(storyText: string): void {
    this.text = storyText;
    this.loadingStatus = 'succeeded';
    this.storage.setItem(this.storyUrl, storyText);
  }

  private gibberish(len: number): string {
    // https://stackoverflow.com/questions/10726909/random-alpha-numeric-string-in-javascript
    const letters = "abc def ghi jkl mno pqr stu vwx yz";
    return [...Array(len)].reduce(a => {
      return a + letters[~~(Math.random() * letters.length)];
    }, '');
  }
}
</script>


<style lang="scss">
html, body {
  padding: 0;
  margin: 0;
}
</style>
