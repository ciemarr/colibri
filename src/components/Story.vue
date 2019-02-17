<template>
  <div class="Story">

    <div class="Story-metadata">
      <span class="Story-title">{{ title }}</span>
      <span class="Story-author">{{ author }}</span>
    </div>

    <div class="Story-text">
      <p>{{ text }}</p>
    </div>

  </div>
</template>


<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Story extends Vue {
  @Prop() private text!: string;
  @Prop() private title!: string;
  @Prop() private author!: string;
}
</script>


<style lang="scss">
.Story {
  display: flex;
  flex-direction: column;
}

.Story-metadata {
  background-color: #ccc;
  padding: 1rem;
  display: flex;
}

.Story-title {
  flex-grow: 1;
  font-weight: bold;
}

.Story-author {
  font-style: italic;
}

.Story-text {
  flex-grow: 1;
  padding: 0.5rem 1rem;
}
</style>