<template>
  <div class="Story" v-resize.initial="onResize">

    <div class="Story-metadata">
      <span class="Story-title">{{ title }}</span>
      <span class="Story-author">{{ author }}</span>
    </div>

    <div class="Story-text-container" ref="storyTextContainer">
      <div class="Story-text" ref="storyText">
        <p>{{ text }}</p>
      </div>
    </div>

    <div class="Story-pages-container">
      <span class="Story-pages">
        <span class="Story-pages-total">{{ totalPages }}</span>
        pages
      </span>
    </div>

  </div>
</template>


<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import resize from 'vue-resize-directive';

@Component({
  directives: { resize }
})
export default class Story extends Vue {
  @Prop() private text!: string;
  @Prop() private title!: string;
  @Prop() private author!: string;

  private currentPage: number;
  private totalPages: number;

  private DEFAULT_LINE_HEIGHT = '16px';

  constructor() {
    super();
    this.currentPage = 1;
    this.totalPages = 0;
  }

  onResize() {
    this.totalPages = this.calculateTotalPages();
  }

  calculateTotalPages(): number {
    const storyTextContainer = this.$refs.storyTextContainer as Element;
    const storyTextContainerHeight = storyTextContainer.clientHeight;

    const storyTextEl = this.$refs.storyText as Element;
    const storyTextHeight = storyTextEl.clientHeight;

    const lineHeightStr = window.getComputedStyle(storyTextEl).lineHeight;
    const lineHeight = parseInt(lineHeightStr || this.DEFAULT_LINE_HEIGHT, 10);

    const totalLines = storyTextHeight / lineHeight;
    const visibleLines = storyTextContainerHeight / lineHeight;

    const totalPages = Math.floor(totalLines / visibleLines) + 1;
    return totalPages;
  }
}
</script>


<style lang="scss">
.Story {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-y: hidden;
}

%Story-header-footer {
  background-color: #ccc;
  padding: 1em 1em 2em 1em;
  display: flex;
}

.Story-metadata {
  @extend %Story-header-footer;
}

.Story-title {
  flex-grow: 1;
  font-weight: bold;
}

.Story-author {
  font-style: italic;
}

.Story-text-container {
  flex-grow: 1;
  padding: 0.5rem 1rem;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch; // iOS momentum scrolling
}

.Story-text {
  max-width: 27rem;
  margin: 0 auto;
  line-height: 1em;
}

.Story-pages-container {
  @extend %Story-header-footer;
  font-size: 0.75rem;
  font-style: italic;
}

.Story-pages {
  margin: 0 auto;
}

.Story-pages-current {
  font-weight: bold;
}

</style>