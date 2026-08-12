import { defineStore } from "pinia";
import { ref } from "vue";

export const useGlobalStore = defineStore("user", () => {
  const user = ref({
    id: localStorage.getItem("id") || null,
    username: localStorage.getItem("username") || null,
    email: localStorage.getItem("email") || null,
    isAdmin: localStorage.getItem("isAdmin") == "true",
    token: localStorage.getItem("token") || null,
  });

  function setUser(userData) {
    localStorage.setItem("id", userData.id);
    localStorage.setItem("username", userData.username);
    localStorage.setItem("email", userData.email);
    localStorage.setItem("isAdmin", userData.isAdmin);
    user.value.id = userData.id;
    user.value.username = userData.username;
    user.value.email = userData.email;
    user.value.isAdmin = userData.isAdmin;
  }

  function unsetUser() {
    user.value.username = null;
    user.value.email = null;
    user.value.isAdmin = null;
    user.value.token = null;
    localStorage.clear();
  }
  return { user, setUser, unsetUser };
});
