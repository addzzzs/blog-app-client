<script setup>
import { useGlobalStore } from "@/store/global";

const { user, unsetUser } = useGlobalStore();
</script>
<template>
  <nav class="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
    <div class="container-fluid">
      <a class="navbar-brand ms-2" href="#">Postklng</a>

      <div class="d-block ms-auto shadow" id="navbarColor01">
        <ul class="navbar-nav flex-row align-items-center ms-auto">
          <li class="nav-item">
            <router-link
              :to="`/profile/${user.id}`"
              class="nav-link active d-flex align-items-center gap-2"
              href="#"
            >
              <div class="rounded-circle ratio-1x1 bg-white p-1 px-2 fw-bold">
                <i class="bi bi-person text-primary"></i>
              </div>
              <span class="d-none d-md-inline">{{ user.email }}</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              @click="unsetUser()"
              to="/login"
              class="btn btn-sm rounded-3 p-1 px-3 btn-danger active d-flex align-items-center gap-2"
              href="#"
            >
              Logout
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
