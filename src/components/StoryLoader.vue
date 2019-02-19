<template>
  <div class="StoryLoader">
    <Story
      v-bind:title="title"
      v-bind:author="author"
      v-bind:text="text"
     />
    <pre>{{ storyUrl }}</pre>
  </div>
</template>


<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Story from '@/components/Story.vue';

@Component({
  components: {
    Story,
  },
})
export default class StoryLoader extends Vue {
  public title: string;
  public author: string;
  public text: string;

  @Prop() private storyUrl!: string;

  constructor() {
    super();
    this.title = 'Gibberish';
    this.author = 'J.S. Rando';
    this.text = this.gibberish(10000);
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
