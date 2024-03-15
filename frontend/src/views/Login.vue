<template>
  <v-container fluid fill-height class="d-flex justify-center align-center">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="4">
        <!-- Flip card container -->
        <transition name="flip" mode="out-in">
          <div :key="flipKey">
            <!-- Login Form -->
            <v-form v-if="!showSignup" ref="form" class="py-5">
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
            <v-form v-else ref="signupForm" class="py-5">
              <v-text-field
                v-model="newName"
                :rules="[(v) => !!v || 'Display name is required']"
                label="Display Name"
                required
              ></v-text-field>
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
              <v-text-field
                v-model="confirmPassword"
                :rules="[(v) => v === newPassword || 'Passwords must match']"
                label="Confirm Password"
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
    newName: "",
    newUsername: "",
    newEmail: "",
    newPassword: "",
    confirmPassword: "",
    usernameRules: [(v) => !!v || "Username is required"],
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    passwordRules: [(v) => !!v || "Password is required"],
  }),
  methods: {
    async validate() {
      if (this.$refs.form.validate()) {
        let formData = new FormData();
        formData.append("username", this.username);
        formData.append("password", this.password);
        // Assume an endpoint "/api/login" for login
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
        formData.append("display_name", this.newName);
        // Assume an endpoint "/api/signup" for signup
        // let response = await Vue.axios.post("/api/signup", formData);
        // Handle the signup response here
      }
    },
    reset() {
      this.username = "";
      this.password = "";
    },
    resetSignupForm() {
      this.newName = "";
      this.newUsername = "";
      this.newEmail = "";
      this.newPassword = "";
      this.confirmPassword = "";
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

.flip-enter,
.flip-leave-to {
  transform: rotateY(180deg);
}
</style>
