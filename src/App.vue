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

const testStoryText = `
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
  condimentum, nisi malesuada iaculis ornare, nunc lacus varius justo, et
  congue lacus ante ac turpis. Donec vel vulputate tellus, viverra commodo
  orci. Curabitur purus erat, varius quis lorem sed, mattis suscipit dui.
  Aenean dui est, pharetra in turpis eget, porttitor laoreet diam. Curabitur
  ac accumsan odio. Phasellus vel ligula libero. Nam vel feugiat lorem.

  Nam quis mi consectetur, pretium enim at, molestie massa. Etiam tortor
  libero, placerat in turpis id, tincidunt iaculis mauris. Sed mi sapien,
  fringilla vel eleifend ut, gravida in nunc. Sed volutpat lorem lobortis
  metus ultrices rhoncus. Duis tempus id metus a sodales. Pellentesque sed
  tincidunt erat. Nunc dui nisl, mattis id suscipit vitae, interdum in erat.
  Proin dictum sem sed condimentum viverra. Donec condimentum, tortor nec
  pretium elementum, sem elit faucibus lectus, non venenatis lacus urna
  mattis odio. Curabitur urna arcu, consequat sed ante eget, imperdiet
  egestas diam. Mauris dignissim, mi ut maximus eleifend, nunc augue gravida
  felis, id tristique ante ex non elit.

  Integer in metus nec velit euismod malesuada. Vivamus dapibus vulputate
  odio rutrum ultrices. Lorem ipsum dolor sit amet, consectetur adipiscing
  elit. Aenean a neque id mauris dictum porta at et urna. Suspendisse
  potenti. Praesent varius augue lectus, vitae pellentesque purus lacinia
  non. Sed tincidunt vulputate neque et sollicitudin.

  Mauris vel libero tincidunt, suscipit est at, porta augue. Cras ac leo vel
  metus aliquet pharetra eu consectetur elit. In tempus lorem neque, sed
  dignissim purus interdum in. Vestibulum tincidunt accumsan tempus. Quisque
  non sapien non justo fringilla condimentum. Ut at luctus arcu, vel tempor
  ipsum. In ultricies luctus sapien a pellentesque. Pellentesque hendrerit
  felis magna, ut placerat mauris semper id. Nulla a diam et nibh rutrum
  rhoncus. Donec imperdiet imperdiet lacus eget tempor. Praesent tristique
  rutrum tortor consequat varius. Etiam hendrerit et sapien in tempor. Sed
  eget turpis sed odio rutrum gravida quis id mi.
`;

export default {
  data: () => {
    return {
      title: 'Lorem Ipsum',
      author: 'Cicero',
      text: testStoryText,
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
