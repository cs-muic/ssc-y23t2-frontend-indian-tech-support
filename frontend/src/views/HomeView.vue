<template>
  <v-container>
    <h2>Home</h2>
    <ul>
      <li>
        <router-link to="/">Go to Home</router-link>
      </li>
      <li>
        <router-link to="/about">Go to About</router-link>
      </li>
      <li>
        <router-link to="/login">Go to Login</router-link>
      </li>
    </ul>
  </v-container>
</template>

<script>
export default {
  name: "Home",

  components: {},
};
</script>
