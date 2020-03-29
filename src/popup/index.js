import Vue from "vue";
import AppComponent from "./App/App.vue";

import { Card, Button, Link, Input } from "element-ui";
Vue.use(Card);
Vue.use(Button);
Vue.use(Link);
Vue.use(Input);

Vue.component("app-component", AppComponent);

new Vue({
  el: "#app",
  render: createElement => {
    return createElement(AppComponent);
  }
});
