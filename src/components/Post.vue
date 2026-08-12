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
  <div class="card shadow border-primary mb-3">
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

    <div class="card-body">
      <h5 class="card-title">{{ post.title }}</h5>
      <p class="card-text text-truncate">{{ post.content }}</p>

      <div class="d-flex justify-content-between align-items-center mt-3">
        <span class="text-muted small">
          <i class="bi bi-chat-left-text me-1"></i
          >{{ post.comments?.length || 0 }} comments
        </span>

        <div class="d-flex gap-2">
          <router-link
            :to="`/viewPost/${post._id}`"
            class="btn btn-sm btn-outline-primary"
            @click="emit('view', post._id)"
          >
            <i class="bi bi-eye"></i> View
          </router-link>
          <button
            v-if="user.id == post.author"
            class="btn btn-sm btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#addModal"
            @click="emit('edit', post)"
          >
            <i class="bi bi-pencil"></i> Edit
          </button>
          <button
            v-if="user.isAdmin || user.id == post.author"
            class="btn btn-sm btn-danger"
            @click="emit('delete', post._id)"
          >
            <i class="bi bi-trash"></i> Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
