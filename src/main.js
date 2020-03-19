import Vue from 'vue'
import VueCompositionApi from '@vue/composition-api'
import ViewUI from 'iview'
import 'iview/dist/styles/iview.css';
import { router } from './router';
import store from './vuex/store';
import App from './App.vue'

Vue.config.productionTip = false
Vue.use(VueCompositionApi);
Vue.use(ViewUI);
// Vue.use
new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app');
