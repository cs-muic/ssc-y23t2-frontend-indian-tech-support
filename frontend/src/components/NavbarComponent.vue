<template>
  <nav class="navbar">
    <div class="nav-links">
      <router-link to="/" class="nav-link">Home</router-link>
      <router-link to="/" class="nav-link">New Income/Expenditure</router-link>
      <router-link to="/history" class="nav-link">History</router-link>
      <router-link to="/" class="nav-link">Analytics</router-link>
    </div>
    <div class="nav-actions">
      <a href="#" class="nav-action">Logout</a>
    </div>
  </nav>
</template>

<script>
export default {
  name: "NavbarComponent",
  // Any JavaScript or component-specific logic goes here
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

.nav-actions {
  /* To align the logout or other actions to the right */
  margin-left: auto;
}

.router-link-exact-active {
  color: #4caf50; /* Highlight color for active menu item */
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
