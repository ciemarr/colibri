<template :key="loadingStatus">
  <div class="StoryLoader">

    <Story v-if="'succeeded' === loadingStatus"
      v-bind:title="title"
      v-bind:author="author"
      v-bind:text="text"
      v-bind:storyUrl="storyUrl"
     />

    <div v-if="'no-url' === loadingStatus">
      <input class="StoryLoader-url" v-model="storyUrl" placeholder="story URL" type="text" />
      <input class="StoryLoader-title" v-model="title" placeholder="story title" type="text" />
      <input class="StoryLoader-author" v-model="author" placeholder="story author" type="text" />
      <button class="StoryLoader-read-button" @click="onReadButtonClick">
        Read Story
      </button>
    </div>

    <p v-if="'loading' === loadingStatus">
      Loading...
    </p>

    <p v-if="'failed' === loadingStatus">
      Failed to load.
    </p>
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

  @Prop() private readonly axios!: AxiosInstance;

  public title: string | null = null;
  public author: string | null = null;
  public text: string | null = null;
  public storyUrl: string | null = null;
  public loadingStatus: 'loading' | 'succeeded' | 'failed' | 'no-url' = 'no-url';

  private readonly storage: Storage = getStorage();

  private async created() {
    if (!this.storyUrl || !this.storage) return;

    const url = this.storyUrl;
    const storyText = this.storage.getItem(url) || await this.loadStory(url);
    this.updateStoryText(storyText);
  }

  private async onReadButtonClick() {
    if (!this.storyUrl) return;

    const storyText = await this.loadStory(this.storyUrl);
    this.updateStoryText(storyText);
  }

  private async loadStory(storyUrl: string): Promise<string | null> {
    try {
      const proxiedUrl = `${StoryLoader.PROXY_URL}/${storyUrl}`;
      const response = await this.axios.get(proxiedUrl);
      return response.data;
    } catch (error) {
      this.loadingStatus = 'failed';
      return null;
    }
  }

  private updateStoryText(storyText: string | null): void {
    if (!storyText) return;

    this.text = storyText;
    this.loadingStatus = 'succeeded';

    if (this.storyUrl) {
      this.storage.setItem(this.storyUrl, storyText);
    }
  }
}
</script>


<style lang="scss">
html, body {
  padding: 0;
  margin: 0;
}
</style>
