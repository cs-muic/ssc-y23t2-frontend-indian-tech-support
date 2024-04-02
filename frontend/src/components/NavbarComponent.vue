<template>
  <nav class="navbar">
    <div class="nav-links">
      <router-link to="/" class="nav-link">Home</router-link>
      <router-link to="/income-expense-creation" class="nav-link"
        >New Income/Expenditure
      </router-link>
      <router-link to="/history" class="nav-link">History</router-link>
      <router-link to="/analytics" class="nav-link">Analytics</router-link>
    </div>
    <div class="profile-pic">
      <router-link to="/profile" class="nav-link">
        <img
          :src="`https://ssc-proj-user-avatar.sgp1.digitaloceanspaces.com/${userInfo.avatarId}`"
          width="40"
          alt="Profile"
          title="Profile"
        />
      </router-link>
      <button class="nav-action" @click="logout">Logout</button>
      <!-- Changed to button -->
    </div>
  </nav>
</template>
<script setup>
import { onMounted, ref, watchEffect } from "vue";
import axios from "axios";

let userInfo = ref(null);
onMounted(async () => {
  try {
    const response = await axios.get("/api/whoami");
    userInfo.value = response.data;
  } catch (error) {
    console.error(error);
  }
  // Wait for userInfo to be computed
  const fetchUserInfo = async () => {
    try {
      const response = await axios.get("/api/whoami");
      userInfo.value = response.data;
    } catch (error) {
      userInfo.value = error.data;
    }
  };
  watchEffect(fetchUserInfo);
});
</script>
<script>
import Vue from "vue";
export default {
  name: "NavbarComponent",
  methods: {
    async logout() {
      let response = await Vue.axios.get("/api/logout");
      if (response.data.success) {
        this.$router.push({ path: "/login" });
      }
    },
  },
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8f9fa;
}

.nav-links {
  /* If you want the links to be horizontally aligned */
  display: flex;
}

.nav-link {
  margin-right: 20px;
  text-decoration: none;
  color: #333;
  font-weight: 500;
}

.nav-link:hover {
  text-decoration: underline;
}

.profile-pic {
  display: flex;
  align-items: center;
  margin-right: 10px;
}

.nav-action {
  text-decoration: none;
  color: #333;
  font-weight: 500;
}

.nav-action:hover {
  text-decoration: underline;
}
</style>
