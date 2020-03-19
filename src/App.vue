<template>
  <div id="app">
    <qt-header></qt-header>
    <router-view></router-view>
    <qt-footer></qt-footer>
  </div>
</template>

<script>
import QtHeader from "./components/portal/QtHeader";
import QtFooter from "./components/portal/QtFooter";
// import { provideRoute } from "./router";
export default {
  components: {
    QtHeader,
    QtFooter
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
