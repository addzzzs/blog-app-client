<script setup>
import { onBeforeMount, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Nav from "@/components/Nav.vue";
import api from "@/api";
import { useGlobalStore } from "@/store/global";
import { Notyf } from "notyf";

const notyf = new Notyf();
const route = useRoute();
const router = useRouter();
const { user } = useGlobalStore();

const post = ref(null);
const author = ref("");
const isLoading = ref(true);
const commentText = ref("");
const commentAuthors = ref({}); // maps userId -> username, so we don't refetch repeatedly

const getPost = async () => {
  try {
    const res = await api.get(`/posts/${route.params.id}`);

    if (res.status == 200) {
      post.value = res.data.post;
      await getAuthorName(post.value.author, "post");
      await getCommentAuthors();
    }
  } catch (error) {
    notyf.error(error.response?.data?.error || "Post not found");
    router.push("/");
  } finally {
    isLoading.value = false;
  }
};

const getAuthorName = async (userId) => {
  try {
    const res = await api.get(`/posts/comment/user/${userId}`);
    if (res.status == 200) {
      author.value = res.data.username;
    }
  } catch (error) {
    console.log(error.response?.data);
  }
};

const getCommentAuthors = async () => {
  if (!post.value?.comments?.length) return;

  for (const comment of post.value.comments) {
    if (!commentAuthors.value[comment.user]) {
      try {
        const res = await api.get(`/posts/comment/user/${comment.user}`);
        if (res.status == 200) {
          commentAuthors.value[comment.user] = res.data.username;
        }
      } catch (error) {
        commentAuthors.value[comment.user] = "Unknown";
      }
    }
  }
};

const addComment = async () => {
  if (!commentText.value.trim()) return;

  try {
    const res = await api.post(`/posts/comment/${post.value._id}`, {
      comment: commentText.value,
    });

    if (res.status == 201) {
      commentText.value = "";
      notyf.success("Comment added");
      getPost();
    }
  } catch (error) {
    notyf.error(error.response?.data?.error || "Failed to add comment");
  }
};

onBeforeMount(() => {
  const token = localStorage.getItem("token");
  if (!token) router.push("/login");
  getPost();
});
</script>

<template>
  <Nav />

  <main class="container">
    <div class="row justify-content-center">
      <div class="col-10 col-md-8 pt-5">
        <button class="btn btn-outline-primary mb-4" @click="router.back()">
          <i class="bi bi-arrow-left"></i> Back
        </button>

        <div v-if="isLoading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status"></div>
        </div>

        <div v-else-if="post" class="card shadow border-primary mb-4">
          <div
            class="card-header bg-primary text-white d-flex justify-content-between align-items-center"
          >
            <span class="fw-semibold">
              <i class="bi bi-person-circle me-2"></i>{{ author || "Unknown" }}
            </span>
            <small>{{
              new Date(post.creationDate).toLocaleDateString()
            }}</small>
          </div>

          <div class="card-body">
            <h3 class="card-title">{{ post.title }}</h3>
            <p class="card-text">{{ post.content }}</p>
          </div>
        </div>

        <div v-if="post" class="mb-4">
          <h5 class="mb-3">
            <i class="bi bi-chat-left-text me-2"></i>Comments ({{
              post.comments?.length || 0
            }})
          </h5>

          <div v-if="post.comments?.length">
            <div
              v-for="(comment, index) in post.comments"
              :key="index"
              class="card mb-2 shadow-sm"
            >
              <div class="card-body py-2">
                <div class="d-flex justify-content-between">
                  <span class="fw-semibold small">
                    <i class="bi bi-person-circle me-1"></i
                    >{{ commentAuthors[comment.user] || "Unknown" }}
                  </span>
                </div>
                <p class="mb-0">{{ comment.comment }}</p>
              </div>
            </div>
          </div>

          <p v-else class="text-muted text-center">No comments yet</p>

          <form
            v-if="!user.isAdmin"
            class="d-flex gap-2 mb-4"
            @submit.prevent="addComment"
          >
            <input
              type="text"
              v-model="commentText"
              class="form-control rounded-2"
              placeholder="Write a comment..."
            />
            <button type="submit" class="btn btn-primary text-nowrap">
              Add Comment
            </button>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>
