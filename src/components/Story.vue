<template>
  <div class="Story" v-resize.initial="onResize">

    <div class="Story-metadata" v-if="title && author">
        <span class="Story-title">{{ title }}</span>
        <span class="Story-author">{{ author }}</span>
    </div>
    <div class="Story-metadata" v-else>
        <span class="Story-url">{{ storyUrl }}</span>
    </div>

    <div class="Story-text-container" ref="storyTextContainer">
      <div class="Story-text" ref="storyText">
        <p v-html="$sanitize(text)"></p>
      </div>
      <div class="Story-fin">❧</div>
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
  public currentPage: number = 1;
  public totalPages: number = 0;

  @Prop() public readonly text!: string;
  @Prop() public readonly title!: string;
  @Prop() public readonly author!: string;
  @Prop() public readonly storyUrl!: string;

  private DEFAULT_LINE_HEIGHT = '16px';

  public calculateTotalPages(
    visibleHeight: number,
    fullStoryTextHeight: number,
    lineHeight: number
  ): number {
    const totalLines = fullStoryTextHeight / lineHeight;
    const visibleLines = visibleHeight / lineHeight;

    const floatPages = totalLines / visibleLines;
    const integerPages = Math.floor(floatPages);
    const maybeExtraPage = (floatPages > integerPages ? 1 : 0);

    return integerPages + maybeExtraPage;
  }

  private onResize(): void {
    this.updateTotalPages();
  }

  private updateTotalPages(): void {
    const storyTextEl = this.$refs.storyText as Element;
    const lineHeightStr = window.getComputedStyle(storyTextEl).lineHeight;
    const lineHeight = parseInt(lineHeightStr || this.DEFAULT_LINE_HEIGHT, 10);

    const totalPages = this.calculateTotalPages(
      window.innerHeight,
      storyTextEl.clientHeight,
      lineHeight
    );

    this.totalPages = totalPages;
  }
}
</script>


<style lang="scss">
.Story {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

%Story-header-footer {
  background-color: #ccc;
  padding: 1em;
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

.Story-url {
  font-family: monospace;
  margin: 0 auto;
}

.Story-text-container {
  flex-grow: 1;
  padding: 0.5rem 1rem;
}

.Story-text {
  max-width: 27rem;
  margin: 0 auto;
  line-height: 1em;
}

.Story-pages-container {
  @extend %Story-header-footer;
  position: sticky;
  bottom: 0;
  font-size: 0.75rem;
  font-style: italic;
}

.Story-pages {
  margin: 0 auto;
}

.Story-pages-current {
  font-weight: bold;
}

.Story-fin {
  text-align: center;
}
</style>