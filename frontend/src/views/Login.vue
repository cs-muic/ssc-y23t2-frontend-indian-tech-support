<template>
  <v-container>
    <v-form ref="form">
      <v-text-field
        v-model="username"
        :rules="usernameRules"
        label="Username"
        required
      ></v-text-field>

      <v-text-field
        v-model="password"
        :rules="passwordRules"
        label="Password"
        type="password"
        required
      ></v-text-field>

      <v-btn color="success" class="mr-4" @click="validate"> Login</v-btn>

      <v-btn color="error" class="mr-4" @click="reset"> Reset</v-btn>
    </v-form>
  </v-container>
</template>

<script>
import Vue from "vue";

export default {
  data: () => ({
    username: "",
    usernameRules: [(v) => !!v || "Username is required"],
    password: "",
    passwordRules: [(v) => !!v || "Password is required"],
  }),

  methods: {
    async validate() {
      if (this.$refs.form.validate()) {
        let formData = new FormData();
        formData.append("username", this.username);
        formData.append("password", this.password);
        let response = await Vue.axios.post("/api/login", formData);
        if (response.data.success) {
          this.$router.push({ path: "/" });
        }
      }
    },
    reset() {
      this.username = "";
      this.password = "";
    },
  },
};
</script>
