<template>
  <v-container
    fluid
    fill-height
    class="d-flex justify-center align-center bg-logo-test"
  >
    <v-row justify="center">
      <v-col cols="12" sm="8" md="4">
        <transition name="flip" mode="out-in">
          <div :key="flipKey" class="form-container">
            <v-form v-if="!showSignup" ref="form" class="py-5">
              <v-text-field
                v-model="username"
                :rules="usernameRules"
                label="Username"
                required
                dark
                class="text-white"
              ></v-text-field>
              <v-text-field
                v-model="password"
                :rules="passwordRules"
                label="Password"
                type="password"
                required
                dark
                class="text-white"
              ></v-text-field>
              <v-btn color="success" class="mr-4" @click="validate"
                >Login</v-btn
              >
              <v-btn color="error" class="mr-4" @click="reset">Reset</v-btn>
              <v-btn text @click="toggleForm">Sign Up</v-btn>
            </v-form>
            <!-- Signup Form -->
            <v-form v-else ref="signupForm" class="py-5">
              <v-alert
                v-if="signupError"
                type="error"
                dismissible
                @click="signupError = ''"
              >
                {{ signupError }}
              </v-alert>
              <!-- Signup Form Fields -->
              <v-text-field
                v-model="newName"
                :rules="[(v) => !!v || 'Display name is required']"
                label="Display Name"
                required
                dark
                class="text-white"
              ></v-text-field>
              <v-text-field
                v-model="newUsername"
                :rules="usernameRules"
                label="Username"
                required
                dark
                class="text-white"
              ></v-text-field>
              <v-text-field
                v-model="newPassword"
                :rules="passwordRules"
                label="Password"
                type="password"
                required
                dark
                class="text-white"
              ></v-text-field>
              <v-text-field
                v-model="confirmPassword"
                :rules="[(v) => v === newPassword || 'Passwords must match']"
                label="Confirm Password"
                type="password"
                required
                dark
                class="text-white"
              ></v-text-field>
              <v-row>
                <v-col cols="12">
                  <v-sheet
                    class="d-flex justify-center align-center position-relative"
                    outlined
                    tile
                    color="grey lighten-2"
                    style="
                      height: 250px;
                      cursor: pointer;
                      border-style: dashed;
                      border-width: 2px;
                      border-radius: 5px;
                    "
                    @click="openFilePicker"
                    @drop.prevent="onDrop"
                    @dragover.prevent
                    @dragenter.prevent
                    @dragleave.prevent
                    v-bind:class="{ 'bg-light-blue': dragActive }"
                  >
                    <input
                      type="file"
                      ref="fileInput"
                      style="display: none"
                      @change="onFileChange"
                      accept="image/*"
                    />
                    <v-icon x-large color="primary">mdi-upload</v-icon>
                    <div v-if="avatarName" class="mt-2 text-h6">
                      {{ avatarName }}
                    </div>
                    <div v-else class="mt-2 text-h6">
                      Click or drag an image here to upload
                    </div>
                  </v-sheet>
                </v-col>
              </v-row>
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
    // Initial data setup
    password: "",
    signupError: "",
    showSignup: false,
    flipKey: 0,
    username: "",
    newName: "",
    newUsername: "",
    newPassword: "",
    confirmPassword: "",
    usernameRules: [(v) => !!v || "Username is required"],
    passwordRules: [(v) => !!v || "Password is required"],
    dragActive: false,
    avatarName: null,
    avatarFile: null, // To store the uploaded file
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
    openFilePicker() {
      this.$refs.fileInput.click();
    },
    onFileChange(e) {
      const files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.avatarFile = files[0]; // Store the file
      this.avatarName = files[0].name;
    },
    async signup() {
      if (this.$refs.signupForm.validate()) {
        let formData = new FormData();
        formData.append("username", this.newUsername);
        formData.append("password", this.newPassword);
        formData.append("display_name", this.newName);
        if (this.avatarFile) {
          formData.append("avatar", this.avatarFile);
        } else {
          formData.append("avatar", ""); // Ensure backend receives an avatar key even if no file is selected
        }

        try {
          let response = await Vue.axios.post("/api/signup", formData);
          if (response.data.success) {
            console.log("Signup successful");
            this.$router.push({ path: "/" });
          } else {
            this.signupError = response.data.message;
            console.error("Signup failed:", response.data.message);
          }
        } catch (error) {
          this.signupError = "An unexpected error occurred. Please try again.";
          console.error("Signup request failed:", error);
        }
      }
    },
    reset() {
      this.username = "";
      this.password = "";
    },
    resetSignupForm() {
      this.newName = "";
      this.newUsername = "";
      this.newPassword = "";
      this.confirmPassword = "";
      this.avatarFile = null;
      this.avatarName = null;
    },
    toggleForm() {
      this.showSignup = !this.showSignup;
      this.flipKey++; // Trigger flip animation
      this.reset();
      this.resetSignupForm();
    },
  },
};
</script>

<style scoped>
.flip-enter-active,
.flip-leave-active {
  transition: transform 0.5s;
}

.flip-enter,
.flip-leave-to {
  transform: rotateY(180deg);
}
.bg-logo-test {
  background-image: url("../assets/TestBG.webp");
  background-size: cover; /* Cover the entire container */
  background-position: center; /* Center the background image */
}
.form-container {
  background-color: rgba(
    245,
    245,
    245,
    0.6
  ); /* Adjust opacity for transparency */
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  color: white; /* Ensure fallback text color is white */
}
/* For labels, placeholders, and input text, since they might not inherit white color correctly */
.v-label,
.v-input__slot {
  color: white !important;
}

.v-text-field__slot input,
.v-text-field__slot textarea {
  color: white !important;
}

.v-btn:not(.v-btn--dark) {
  color: white !important;
}
</style>
