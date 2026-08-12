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
const username = ref("");
const password = ref("");
const confirm = ref("");
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

const register = async () => {
  isLoading.value = true;
  try {
    const res = await api.post("/users/register", {
      email: email.value,
      username: username.value,
      password: password.value,
      confirm: confirm.value,
    });

    if (res.status == 201) {
      notyf.success("Register Successful");
      router.push("/login");
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
        <form @submit.prevent="register()">
          <h1 class="text-center">Register</h1>
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
          </div>
          <div class="mb-3">
            <label for="username" class="form-label">Username</label>
            <input
              type="text"
              class="form-control"
              id="username"
              v-model="username"
            />
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

          <div class="mb-3">
            <label for="confirmPass" class="form-label">Confirm Password</label>
            <input
              type="password"
              class="form-control"
              id="confirmPass"
              v-model="confirm"
            />
          </div>

          <button
            v-if="isAvailable"
            type="submit"
            class="btn w-100 btn-primary"
          >
            {{ isLoading ? "Registering in..." : "Register" }}
          </button>

          <button v-else type="button" disabled class="btn w-100 btn-primary">
            Register
          </button>

          <p class="text-center mt-3">OR</p>

          <router-link to="/register" class="btn btn-outline-primary w-100"
            >Login</router-link
          >
        </form>
      </div>
    </div>
  </div>
</template>
