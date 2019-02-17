<template>
  <div id="app">
    <Story
      v-bind:title="title"
      v-bind:author="author"
      v-bind:text="text"
     />
  </div>
</template>


<script lang="ts">
import Story from '@/components/Story.vue';

function gibberish(len: number) {
  // https://stackoverflow.com/questions/10726909/random-alpha-numeric-string-in-javascript
  const letters = "abc def ghi jkl mno pqr stu vwx yz";
  return [...Array(len)].reduce(a => {
    return a + letters[~~(Math.random() * letters.length)];
  }, '');
}

export default {
  data: () => {
    return {
      title: 'Gibberish',
      author: 'J.S. Rando',
      text: gibberish(10000),
     };
  },

  components: {
    Story,
  },
};
</script>


<style lang="scss">
html, body {
  padding: 0;
  margin: 0;
}
</style>
