<template>
  <div id="app">
    <Story text="Hello, world!" />
  </div>
</template>


<script lang="ts">
import Story from '@/components/Story.vue';

export default {
  components: {
    Story,
  },
};
</script>


<style lang="scss">
#app {
  padding: 1rem;
}
</style>
