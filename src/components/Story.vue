<template>
  <p>{{ text }}</p>
</template>


<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Story extends Vue {
  @Prop() private text!: string;
}
</script>


<style scoped lang="scss">
p {
  margin-bottom: 0.5rem;
}
</style>