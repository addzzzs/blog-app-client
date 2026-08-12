import Home from "@/pages/Home.vue";
import Login from "@/pages/Login.vue";
import Register from "@/pages/Register.vue";
import ViewPost from "@/pages/ViewPost.vue";
import Profile from "@/pages/Profile.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
    },
    {
      path: "/login",
      name: "Login",
      component: Login,
    },
    {
      path: "/register",
      name: "Register",
      component: Register,
    },
    {
      path: "/viewPost/:id",
      name: "ViewPost",
      component: ViewPost,
    },
    {
      path: "/profile/:id",
      name: "Profile",
      component: Profile,
    },
  ],
});

export default router;
