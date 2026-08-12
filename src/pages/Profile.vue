<script setup>
import { onBeforeMount, ref, watch, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import Nav from "@/components/Nav.vue";
import Post from "@/components/Post.vue";
import api from "@/api";
import { useGlobalStore } from "@/store/global";
import { Notyf } from "notyf";

const route = useRoute();
const username = ref("");
const userId = computed(() => route.params.id);
const isEmpty = ref(false);
const notyf = new Notyf();
const { user } = useGlobalStore();
const router = useRouter();
const title = ref("");
const content = ref("");
const posts = ref([]);
const adding = ref(true);
const postId = ref("");

onBeforeMount(() => {
  const token = localStorage.getItem("token");
  if (!token) router.push("/login");
  getPosts();
});

const getPosts = async () => {
  try {
    const res = await api.get(`/posts/user/${userId.value}`);
    if (res.status == 200) {
      posts.value = res.data.posts;
      isEmpty.value = !res.data.posts.length;
      getUsername();
    }
  } catch (error) {
    console.log(error.response?.data?.error);
  }
};

const addPost = async () => {
  try {
    const res = await api.post("/posts/add", {
      title: title.value,
      content: content.value,
    });
    if (res.status == 201) {
      getPosts();
      resetValue();
      notyf.success("Post added successfully");
    }
  } catch (error) {
    notyf.error(error.response.data.error);
  }
};

const updatePost = async (id) => {
  try {
    const res = await api.patch(`/posts/update/${id}`, {
      title: title.value,
      content: content.value,
    });
    if (res.status == 200) {
      getPosts();
      resetValue();
      notyf.success("Post updated successfully");
    }
  } catch (error) {
    notyf.error(error.response.data.error);
  }
};

const deletePost = async (id) => {
  try {
    const res = await api.delete(`/posts/delete/${id}`);
    if (res.status == 200) {
      getPosts();
      notyf.success("Post deleted successfully");
    }
  } catch (error) {
    notyf.error(error.response.data.error);
  }
};

const resetValue = () => {
  title.value = "";
  content.value = "";
  postId.value = "";
};

const addModal = (isAdding, ptitle = "", pcontent = "", pid = "") => {
  resetValue();
  adding.value = isAdding;
  if (!isAdding) {
    title.value = ptitle;
    content.value = pcontent;
    postId.value = pid;
  }
};

const getUsername = async () => {
  try {
    const res = await api.get(`/posts/comment/user/${userId.value}`);
    console.log(res);
    if (res.status == 200) {
      username.value = res.data.username;
    }
  } catch (error) {
    console.log(error.response?.data);
  }
};
// receives the whole post object emitted from Post.vue
const openEditModal = (post) => {
  addModal(false, post.title, post.content, post._id);
};

watch(userId, (current) => {
  getPosts();
});
</script>

<template>
  <Nav />

  <div
    class="modal fade"
    id="addModal"
    tabindex="-1"
    aria-labelledby="addModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered shadow-none">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="addModalLabel">
            {{ adding ? "Add" : "Update" }} Post
          </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="mb-2">
            <label for="title">Title</label>
            <input
              type="text"
              id="title"
              v-model="title"
              class="form-control rounded-2"
            />
          </div>
          <div>
            <label for="content">Content</label>
            <textarea
              id="content"
              v-model="content"
              class="form-control rounded-2"
              rows="6"
            ></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
          <button
            type="button"
            data-bs-dismiss="modal"
            class="btn btn-primary"
            @click="adding ? addPost() : updatePost(postId)"
          >
            {{ adding ? "Add Post" : "Update Post" }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <main class="container">
    <div class="row justify-content-center">
      <div
        class="col-10 col-md-8 shadow pt-5 px-1 px-md-5"
        style="min-height: 100vh"
      >
        <button class="btn btn-outline-primary mb-4" @click="router.back()">
          <i class="bi bi-arrow-left"></i> Back
        </button>
        <div v-if="user.id == userId">
          <h3>Your Profile</h3>
          <input
            readonly
            data-bs-toggle="modal"
            data-bs-target="#addModal"
            @click="addModal(true)"
            type="text"
            class="form-control card rounded cursor-pointer mb-5 active focus shadow"
            :placeholder="`What's on your mind, ${user.username}?`"
          />
        </div>

        <div v-else>
          <h3>{{ username }}'s Profile</h3>
        </div>

        <div v-if="!isEmpty">
          <Post
            v-for="(post, index) in posts"
            :post="post"
            :key="index"
            @edit="openEditModal"
            @delete="deletePost"
          />
        </div>

        <p v-else class="text-center">No Available Post</p>
      </div>
    </div>
  </main>
</template>
