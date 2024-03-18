import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";
import store from "@/store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/login",
    name: "login",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Login.vue"),
  },
  {
    path: "/history",
    name: "history",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/HistoryView.vue"),
  },
  {
    path: "/analytics",
    name: "analytics",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AnalyticsView.vue"),
  },
  {
    path: "/income-expense-creation",
    name: "income-expense-creation",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "about" */ "../views/IncomeExpenseCreateView.vue"
      ),
  },
];

const router = new VueRouter({
  routes,
});

// Setup beforeEach
router.beforeEach(async (to, from, next) => {
  // get login state using whoami and axios
  let response = await Vue.axios.get("/api/whoami");
  // response.data is our payload
  await store.dispatch("setLoggedInUser", response.data);
  let isLoggedIn = store.state.isLoggedIn;
  // make sure that once the user is logged in, they will not be able to see the login page
  if (to.name === "login" && isLoggedIn) {
    next({ name: "home" });
  }
  // if the name of the router is not login, it needs authorization to access the page
  if (to.name !== "login" && !isLoggedIn) {
    // redirect to login page
    next({ name: "login" });
  } else {
    // otherwise, let go
    next();
  }
});

export default router;
