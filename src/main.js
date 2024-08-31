import { createApp, defineAsyncComponent } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import standardPlugin from "./plugins/standard-plugin";
import FontAwesomeIcon from "./utilities/font-awesome";

import BaseCard from "./components/ui/BaseCard.vue";
import BaseButton from "./components/ui/BaseButton.vue";
import BaseBadge from "./components/ui/BaseBadge.vue";
import BaseSpinner from "./components/ui/BaseSpinner.vue";

// defineAsyncComponent - 필요할때만 import
const BaseDialog = defineAsyncComponent(
  () => import("./components/ui/BaseDialog.vue"),
);
const BaseSpiiner2 = defineAsyncComponent(
  () => import("./components/ui/BaseSpinner2.vue"),
);

const app = createApp(App);

app.use(store);
app.use(router);
app.use(standardPlugin);

// 공용 컴포넌트
app.component("base-card", BaseCard);
app.component("base-button", BaseButton);
app.component("base-badge", BaseBadge);
app.component("base-spinner", BaseSpinner);
app.component("base-spinner2", BaseSpiiner2);
app.component("base-dialog", BaseDialog);

// 폰트어썸
app.component("font-awesome-icon", FontAwesomeIcon);

app.mount("#app");
