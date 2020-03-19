<template>
  <div class="hello">
    <h1>{{ object.msg }}</h1>
  </div>
</template>

<script>
import { reactive } from "@vue/composition-api";


export default {
  setup() {
    const object = reactive({ msg: "你好啊" });
    return {
      object
    };
  }

  // name: "HelloWorld",
  // props: {
  //   msg: String
  // }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  color: aqua;
}
</style>
