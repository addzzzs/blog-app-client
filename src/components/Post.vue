<script setup>
import api from "@/api";
import { onBeforeMount, ref } from "vue";
import { useGlobalStore } from "@/store/global";

const { user } = useGlobalStore();
const props = defineProps({ post: { type: Object, required: true } });
const emit = defineEmits(["view", "edit", "delete"]);

const author = ref("");

const getUsername = async () => {
  try {
    const res = await api.get(`/posts/comment/user/${props.post.author}`);
    if (res.status == 200) {
      author.value = res.data.username;
    }
  } catch (error) {
    console.log(error.response?.data);
  }
};

onBeforeMount(() => {
  getUsername();
});
</script>

<template>
  <div class="card shadow border-primary mb-3 text-decoration-none">
    <div
      class="card-header bg-primary text-white d-flex justify-content-between align-items-center"
    >
      <router-link
        :to="`/profile/${post.author}`"
        class="fw-semibold text-white text-decoration-none"
      >
        <i class="bi bi-person-circle me-2"></i>{{ author || "Unknown" }}
      </router-link>
      <small>{{ new Date(post.creationDate).toLocaleDateString() }}</small>
    </div>

    <div class="card-body text-decoration-none">
      <router-link :to="`/viewPost/${post._id}`" class="text-decoration-none"
        ><h5 class="card-title">{{ post.title }}</h5>
        <p class="card-text text-truncate">{{ post.content }}</p></router-link
      >

      <div class="d-flex justify-content-between align-items-center mt-3">
        <router-link
          :to="`/viewPost/${post._id}`"
          class="text-muted small text-decoration-none"
        >
          <i class="bi bi-chat-left-text me-1"></i
          >{{ post.comments?.length || 0 }} comments
        </router-link>

        <div
          class="dropdown shadow rounded-lg rounded"
          v-if="user.id == post.author"
        >
          <button
            class="btn btn-secondary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            . . .
          </button>
          <ul class="dropdown-menu p-0">
            <li>
              <button
                class="btn btn-sm btn-outline-primary h-100 w-100"
                data-bs-toggle="modal"
                data-bs-target="#addModal"
                @click="emit('edit', post)"
              >
                <i class="bi bi-pencil"></i> <span class="ms-1">Edit</span>
              </button>
            </li>
            <li>
              <button
                v-if="user.isAdmin || user.id == post.author"
                class="btn btn-sm btn-outline-danger h-100 w-100"
                @click="emit('delete', post._id)"
              >
                <i class="bi bi-trash"></i> Delete
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
