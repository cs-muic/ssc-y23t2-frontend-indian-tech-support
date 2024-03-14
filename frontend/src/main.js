// import Vue from "vue";
// import App from "./App.vue";
// import router from "./router";
// import store from "./store";
// import vuetify from "./plugins/vuetify";
// import "./plugins/vue-axios";
// import VueTailwind from "vue-tailwind";
//
// import {
//   TInput,
//   TTextarea,
//   // TSelect,
//   // TRadio,
//   // TCheckbox,
//   // TButton,
//   // TInputGroup,
//   // TCard,
//   // TAlert,
//   // TModal,
//   TDropdown,
//   // TRichSelect,
//   TPagination,
//   // TTag,
//   // TRadioGroup,
//   // TCheckboxGroup,
//   TTable,
//   // TDatepicker,
//   // TToggle,
//   // TDialog,
// } from "vue-tailwind/dist/components";
//
// Vue.config.productionTip = false;
//
// new Vue({
//   router,
//   store,
//   vuetify,
//   render: (h) => h(App),
// }).$mount("#app");
//
// const components = {
//   //...
// };
//
// const settings = {
//   // Use the following syntax
//   // {component-name}: {
//   //   component: {importedComponentObject},
//   //   props: {
//   //     {propToOverride}: {newDefaultValue}
//   //     {propToOverride2}: {newDefaultValue2}
//   //   }
//   // }
//   "t-input": {
//     component: TInput,
//   },
//   "t-textarea": {
//     component: TTextarea,
//   },
//   "t-table": {
//     component: TTable,
//   },
//   "t-pagination": {
//     component: TPagination,
//   },
//   "t-dropdown": {
//     component: TDropdown,
//   },
//   // ...Rest of the components
// };
//
// Vue.use(VueTailwind, components);
// Vue.use(VueTailwind, settings);
// Vue.component("t-table", TTable);
// Vue.component("t-pagination", TPagination);
// Vue.component("t-dropdown", TDropdown);

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import "./plugins/vue-axios";
import VueTailwind from "vue-tailwind";

import {
  TInput,
  TTextarea,
  TSelect,
  TRadio,
  TCheckbox,
  TButton,
  TInputGroup,
  TCard,
  TAlert,
  TModal,
  TDropdown,
  TRichSelect,
  TPagination,
  TTag,
  TRadioGroup,
  TCheckboxGroup,
  TTable,
  TDatepicker,
  TToggle,
  TDialog,
} from "vue-tailwind/dist/components";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");

const components = {
  TInput,
  TTextarea,
  TSelect,
  TRadio,
  TCheckbox,
  TButton,
  TInputGroup,
  TCard,
  TAlert,
  TModal,
  TDropdown,
  TRichSelect,
  TPagination,
  TTag,
  TRadioGroup,
  TCheckboxGroup,
  TTable,
  TDatepicker,
  TToggle,
  TDialog,
};

const settings = {
  "t-input": {
    component: TInput,
  },
  "t-textarea": {
    component: TTextarea,
  },
  "t-select": {
    component: TSelect,
  },
  "t-radio": {
    component: TRadio,
  },
  "t-checkbox": {
    component: TCheckbox,
  },
  "t-button": {
    component: TButton,
  },
  "t-input-group": {
    component: TInputGroup,
  },
  "t-card": {
    component: TCard,
  },
  "t-alert": {
    component: TAlert,
  },
  "t-modal": {
    component: TModal,
  },
  "t-dropdown": {
    component: TDropdown,
  },
  "t-rich-select": {
    component: TRichSelect,
  },
  "t-pagination": {
    component: TPagination,
  },
  "t-tag": {
    component: TTag,
  },
  "t-radio-group": {
    component: TRadioGroup,
  },
  "t-checkbox-group": {
    component: TCheckboxGroup,
  },
  "t-table": {
    component: TTable,
  },
  "t-datepicker": {
    component: TDatepicker,
  },
  "t-toggle": {
    component: TToggle,
  },
  "t-dialog": {
    component: TDialog,
  },
};

Vue.use(VueTailwind, components);
Vue.use(VueTailwind, settings);
