<template :key="loadingStatus">
  <div class="StoryLoader">

    <p v-if="'loading' === loadingStatus">
      Loading...
    </p>

    <Story v-if="'succeeded' === loadingStatus"
      v-bind:title="title"
      v-bind:author="author"
      v-bind:text="text"
     />

    <p v-if="'failed' === loadingStatus">
      Failed to load.
    </p>

    <pre>{{ storyUrl }}</pre>
  </div>
</template>


<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { AxiosInstance } from 'axios';
import Story from '@/components/Story.vue';

@Component({
  components: {
    Story,
  }
})
export default class StoryLoader extends Vue {
  public title: string | null = null;
  public author: string | null = null;
  public text: string | null = null;
  private loadingStatus: 'loading' | 'succeeded' | 'failed';

  @Prop() private storyUrl!: string;
  @Prop() private axios!: AxiosInstance;

  constructor() {
    super();
    this.loadingStatus = 'loading';
  }

  private async created() {
    if (this.storyUrl && this.axios) {
      try {
        const response = await this.axios.get(this.storyUrl);
        this.text = response.data;
        this.loadingStatus = 'succeeded';
      } catch (error) {
        this.loadingStatus = 'failed';
      }
    }
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
