<template>
  <v-container>
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="8" md="4">
        <!-- Flip card container -->
        <transition name="flip" mode="out-in">
          <div :key="flipKey">
            <!-- Login Form -->
            <v-form v-if="!showSignup" ref="form" class="pt-6">
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
              <v-btn color="success" class="mr-4" @click="validate"
                >Login</v-btn
              >
              <v-btn color="error" class="mr-4" @click="reset">Reset</v-btn>
              <v-btn text @click="toggleForm">Sign Up</v-btn>
            </v-form>
            <!-- Signup Form -->
            <v-form v-else ref="signupForm" class="pt-6">
              <v-text-field
                v-model="newUsername"
                :rules="usernameRules"
                label="Username"
                required
              ></v-text-field>
              <v-text-field
                v-model="newEmail"
                :rules="emailRules"
                label="Email"
                required
              ></v-text-field>
              <v-text-field
                v-model="newPassword"
                :rules="passwordRules"
                label="Password"
                type="password"
                required
              ></v-text-field>
              <v-btn color="primary" class="mr-4" @click="signup"
                >Sign Up</v-btn
              >
              <v-btn color="error" class="mr-4" @click="resetSignupForm"
                >Reset</v-btn
              >
              <v-btn text @click="toggleForm">Back to Login</v-btn>
            </v-form>
          </div>
        </transition>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Vue from "vue";

export default {
  data: () => ({
    showSignup: false,
    flipKey: 0,
    username: "",
    newUsername: "",
    newEmail: "",
    newPassword: "",
    usernameRules: [(v) => !!v || "Username is required"],
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+/.test(v) || "E-mail must be valid",
    ],
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
    async signup() {
      if (this.$refs.signupForm.validate()) {
        let formData = new FormData();
        formData.append("username", this.newUsername);
        formData.append("email", this.newEmail);
        formData.append("password", this.newPassword);
        // let response = await Vue.axios.post("/api/signup", formData);
        // Handle signup response here (e.g., show a success message, redirect, etc.)
      }
    },
    reset() {
      this.username = "";
      this.password = "";
    },
    resetSignupForm() {
      this.newUsername = "";
      this.newEmail = "";
      this.newPassword = "";
    },
    toggleForm() {
      this.showSignup = !this.showSignup;
      this.flipKey++; // Increment key to trigger flip animation
      this.reset();
      this.resetSignupForm();
    },
  },
};
</script>

<style>
.flip-enter-active,
.flip-leave-active {
  transition: transform 0.5s;
}
.flip-enter, .flip-leave-to /* .flip-leave-active in <2.1.8 */ {
  transform: rotateY(180deg);
}
</style>
