import Vue from "vue";
import AppComponent from "./App/App.vue";

import { Input, Button, Row, Col } from "element-ui";
Vue.use(Input);
Vue.use(Button);
Vue.use(Row);
Vue.use(Col);

Vue.component("app-component", AppComponent);

new Vue({
  el: "#app",
  render: createElement => {
    return createElement(AppComponent);
  }
});
