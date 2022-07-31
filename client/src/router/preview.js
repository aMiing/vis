import NotFound from "@/views/404.vue";
import Preview from "@/views/preview/index.vue";

const previewRoute = [
  {
    path: "/",
    name: "",
    redirect: { name: "404" },
  },
  {
    path: "/page",
    name: "page",
    component: Preview,
  },
  {
    path: "/404",
    name: "404",
    component: NotFound,
  },
];
export default previewRoute;
