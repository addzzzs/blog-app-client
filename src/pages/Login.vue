<script setup>
import { Notyf } from "notyf";
import { onBeforeMount, ref, watch } from "vue";
import { useGlobalStore } from "@/store/global";
import api from "@/api";
import { useRouter } from "vue-router";

const router = useRouter();
const { setUser } = useGlobalStore();
const notyf = new Notyf();
const email = ref("");
const password = ref("");
const isAvailable = ref(false);
const isLoading = ref(false);

onBeforeMount(() => {
  const token = localStorage.getItem("token");
  if (token) router.push("/");
});
watch([email, password], (current) => {
  if (
    current.every((input) => input.trim() !== "") &&
    current[0].includes("@")
  ) {
    isAvailable.value = true;
  } else {
    isAvailable.value = false;
  }
});

const login = async () => {
  isLoading.value = true;
  try {
    const res = await api.post("/users/login", {
      email: email.value,
      password: password.value,
    });

    if (res.status == 200) {
      localStorage.setItem("token", res.data.access);
      const getDetails = await api.get("/users/");

      setUser(getDetails.data.user);

      notyf.success("Login Successful");
      router.push("/");
    }
  } catch (error) {
    notyf.error(error.response.data.error);
  } finally {
    isLoading.value = false;
  }
};
</script>
<template>
  <div class="container" style="height: 100vh">
    <div class="row justify-content-center h-100 align-items-center">
      <div class="col-10 col-md-4 shadow-lg rounded-5 p-5">
        <form @submit.prevent="login()">
          <h1 class="text-center">Login</h1>
          <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label"
              >Email address</label
            >
            <input
              type="email"
              class="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              v-model="email"
            />
            <div id="emailHelp" class="form-text">
              We'll never share your email with anyone else.
            </div>
          </div>
          <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label"
              >Password</label
            >
            <input
              type="password"
              class="form-control"
              id="exampleInputPassword1"
              v-model="password"
            />
          </div>

          <button
            v-if="isAvailable"
            type="submit"
            class="btn w-100 btn-primary"
          >
            {{ isLoading ? "Loging in..." : "Login" }}
          </button>

          <button v-else type="button" disabled class="btn w-100 btn-primary">
            Login
          </button>

          <p class="text-center mt-3">OR</p>

          <router-link to="/register" class="btn btn-outline-primary w-100"
            >Register</router-link
          >
        </form>
      </div>
    </div>
  </div>
</template>
