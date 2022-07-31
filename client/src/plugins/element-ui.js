import Vue from "vue";
import ElementUI, { Message, Notification } from "element-ui";
import {
  GMessageBox,
  GPageHeader,
  GQueryBox,
  GLoading,
  GBadge,
  GTextEllipsis,
  GEmpty,
  GDragBox,
  GOperationGroup,
  GCard,
  GCardList,
} from "@/femc";

[
  ElementUI,
  GMessageBox,
  GPageHeader,
  GQueryBox,
  GLoading,
  GBadge,
  GPageHeader,
  GTextEllipsis,
  GEmpty,
  GDragBox,
  GOperationGroup,
  GCard,
  GCardList,
].forEach(component => Vue.use(component));

// TODO 以下是原来的代码，后面看看能不能删
Vue.prototype.$message = Message;
Vue.prototype.$notify = Notification;
