import { createRouter, createWebHistory } from "vue-router";
import SideMenu from "../layouts/side-menu/Main.vue";
import PanelOverview from "../views/panel-overview/Main.vue";
import UserHandlers from "../views/users-handlers/Main.vue";
import UserGroups from "../views/users-groups/Main.vue";
import Login from "../views/login/Main.vue";
import ErrorPage from "../views/error-page/Main.vue";
import { isAuthenticated } from "@/utils/auth";

const routes = [
  {
    path: "/",
    component: SideMenu,
    children: [
      {
        path: "/panel",
        name: "side-menu-panel",
        component: PanelOverview
      },
      {
        path: "/handlers",
        name: "side-menu-users-handlers",
        component: UserHandlers
      },
      {
        path: "/groups",
        name: "side-menu-users-groups",
        component: UserGroups
      }
    ]
  },
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/error-page",
    name: "error-page",
    component: ErrorPage
  },
  {
    path: "/:pathMatch(.*)*",
    component: ErrorPage
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 };
  }
});

router.beforeEach((to, from, next) => {
  const authenticated = isAuthenticated();

  if (to.name === "login") {
    if (authenticated) {
      return next({ name: "" });
    }

    return next();
  }

  if (authenticated) {
    return next();
  }

  return next({ name: "login" });
});

export default router;
