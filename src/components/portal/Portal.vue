<template>
  <div>
    <banner></banner>
    <model-feature></model-feature>
    <guide></guide>
  </div>
</template>
<script>
import { onMounted, reactive } from "@vue/composition-api";
import banner from "./Banner";
import ModelFeature from "./ModelFeature";
import guide from "./Guide";
export default {
  setup() {
    const state = reactive({
      modal: false
    });
    onMounted(() => {
      state.modal = true;
    });
    return {
      state
    };
  },
  components: {
    banner,
    ModelFeature,
    guide
  }
};
</script>
