<template>
  <div class="profile">
    <nav class="navbar">
      <NavbarComponent />
    </nav>
    <v-dialog v-model="showPasswordDialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Confirm Password</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="passwordConfirm"
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            counter
            @keyup.enter="confirmPassword"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="confirmPassword"
            >Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div class="main-content">
      <div v-if="message" class="alert">
        {{ message }}
      </div>
      <div class="center-content">
        <div
          class="header"
          style="position: relative; display: flex; justify-content: center"
        >
          <h1>Profile</h1>
          <v-icon
            class="edit-icon"
            @click="editProfileToggle"
            style="position: absolute; right: 0; top: 10px"
            >mdi-pencil
          </v-icon>
        </div>
        <div class="profile-picture" v-if="!editProfilePicture">
          <img
            :src="`https://ssc-proj-user-avatar.sgp1.digitaloceanspaces.com/${userInfo.avatarId}`"
            alt="Profile Picture"
            width="150"
          />
        </div>
        <div v-else>
          <v-row>
            <v-col cols="12">
              <v-sheet
                class="d-flex justify-center align-center position-relative upload-box"
                outlined
                tile
                color="grey lighten-2"
                style="
                  height: 200px; /* Adjusted height */
                  cursor: pointer;
                  border-style: dashed;
                  border-width: 2px;
                  border-radius: 5px;
                  margin-bottom: 20px;
                  width: 350px;
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
        </div>
        <div v-if="editProfile" class="change-profile-picture-button">
          <button @click="changeProfilePicture">Change Profile Picture</button>
        </div>
        <div class="profile-details">
          <div class="detail">
            <span class="label">Username:</span>
            <span class="value" v-if="!editProfile">
              {{ userInfo.username }}
            </span>
            <input
              v-if="editProfile"
              v-model="newUsernameConfirm"
              class="edit-input"
              :placeholder="newUsernameConfirm"
            />
          </div>
          <div class="detail">
            <span class="label">Display Name:</span>
            <span class="value" v-if="!editProfile">
              {{ userInfo.displayName }}
            </span>
            <input
              v-if="editProfile"
              v-model="newDisplayNameConfirm"
              class="edit-input"
              :placeholder="newUsernameConfirm"
            />
          </div>
          <div v-if="editProfile">
            <div class="detail">
              <span class="change-password-label" @click="changePasswordToggle"
                >Change Password</span
              >
            </div>
            <div v-if="changePassword">
              <input
                v-model="newPassword"
                class="password-text"
                type="password"
                placeholder="New Password"
              /><br />
              <input
                v-model="confirmNewPassword"
                class="password-text"
                type="password"
                placeholder="Confirm New Password"
              />
              <br />
            </div>
            <v-btn
              @click="submitChanges"
              color="green"
              class="white--text"
              style="margin-top: 10px"
              >Submit
            </v-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import NavbarComponent from "@/components/NavbarComponent.vue";
import axios from "axios";
import { onMounted, ref, watchEffect } from "vue";
import "vuetify/dist/vuetify.min.css";

let userInfo = ref(null);

let showPasswordDialog = ref(false);
let passwordConfirm = ref("");
let passwordForRelogin = ref("");
let showPassword = ref(false);
let newDisplayNameConfirm = ref("");
let newUsernameConfirm = ref("");
let newPassword = ref("");
let confirmNewPassword = ref("");
const editProfile = ref(false);
const changePassword = ref(false);
const message = ref("");
let editProfilePicture = ref(false);
let fileInput = ref(null);
let avatarFile = ref(null);
let avatarName = ref(null);
let dragActive = ref(false);

const openFilePicker = () => {
  fileInput.value.click();
};

const onFileChange = (e) => {
  const files = e.target.files || e.dataTransfer.files;
  if (!files.length) return;
  avatarFile.value = files[0]; // Store the file temporarily
  avatarName.value = files[0].name;
  processImage(files[0]); // Process the image for cropping
};

const processImage = async (file) => {
  const reader = new FileReader();
  reader.onload = async (e) => {
    const img = new Image();
    img.onload = async () => {
      // Determine the size of the square canvas based on the smaller dimension of the image
      const size = Math.min(img.width, img.height);
      const offsetX = (img.width - size) / 2;
      const offsetY = (img.height - size) / 2;

      // Create a canvas that matches the size of the circular crop
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = size;
      canvas.height = size;

      // Begin path for circular clipping region
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();

      // Draw the image onto the canvas, centered within the clipping region
      ctx.drawImage(
        img,
        offsetX,
        offsetY,
        img.width - offsetX * 2,
        img.height - offsetY * 2,
        0,
        0,
        size,
        size
      );

      // Convert the canvas content back to a Blob and then to a File
      canvas.toBlob((blob) => {
        avatarFile.value = new File([blob], "cropped_" + file.name, {
          type: "image/png",
        });
        avatarName.value = avatarFile.value.name; // Update the avatar name to reflect the cropped file
      }, "image/png");
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
};

const changeProfilePicture = () => {
  editProfilePicture.value = !editProfilePicture.value;
};
const editProfileToggle = () => {
  editProfile.value = !editProfile.value;
  showPasswordDialog.value = editProfile.value;
};

const changePasswordToggle = () => {
  changePassword.value = !changePassword.value;
};

const confirmPassword = async () => {
  message.value = "";
  try {
    const response = await axios.get("/api/user/password-check", {
      params: {
        password: passwordConfirm.value,
      },
    });

    if (response.data.success) {
      // Password matches, close the dialog
      showPasswordDialog.value = false;
      passwordForRelogin.value = passwordConfirm.value;
    } else {
      editProfileToggle();
      message.value += "\n" + response.data.message;
    }
  } catch (error) {
    console.error(error);
  }
  passwordConfirm.value = "";
};

const submitChanges = async () => {
  message.value = "";
  if (avatarFile.value) {
    try {
      const formData = new FormData();
      formData.append("avatar", avatarFile.value);
      const response = await axios.post("/api/user/update-avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      message.value += "\n" + response.data.message;
    } catch (error) {
      message.value += "\n" + error.data;
    }
  }
  if (newPassword.value) {
    try {
      // Send newPassword and confirmNewPassword to the /api/user/update-password endpoint
      const passwordResponse = await axios.put(
        "/api/user/update-password",
        null,
        {
          params: {
            newPassword: newPassword.value,
            confirmPassword: confirmNewPassword.value,
          },
        }
      );

      if (passwordResponse.data.success) {
        passwordForRelogin.value = newPassword.value;
      }
      message.value += "\n" + passwordResponse.data.message;
    } catch (error) {
      message.value += "\n" + error.data;
    }
  }
  if (newUsernameConfirm.value) {
    try {
      const response = await axios.put("/api/user/update-username", null, {
        params: {
          newUsername: newUsernameConfirm.value,
        },
      });

      if (response.data.success) {
        message.value += "\n" + response.data.message;
        let formData = new FormData();
        formData.append("username", newUsernameConfirm.value);
        formData.append("password", passwordForRelogin.value); // Assuming you have the current password in userInfo
        let loginResponse = await axios.post("/api/login", formData);

        if (loginResponse.data.success) {
          userInfo.value.username = newUsernameConfirm.value;
        } else {
          message.value +=
            "\n" + "Re-authentication failed. Please login again.";
        }
      }
    } catch (error) {
      message.value += "\n" + error.data;
    }
    userInfo.value.username = newUsernameConfirm.value;
  } else {
    message.value += "\n" + "Username cannot be empty.";
  }
  if (newDisplayNameConfirm.value !== userInfo.value.displayName) {
    try {
      const response = await axios.put("/api/user/update-display-name", null, {
        params: {
          newDisplayName: newDisplayNameConfirm.value,
        },
      });

      if (response.data.success) {
        userInfo.value.displayName = newDisplayNameConfirm.value;
      }
      message.value += "\n" + response.data.message;
    } catch (error) {
      message.value += "\n" + error.data;
    }
  } else {
    message.value += "\n" + "Display Name cannot be empty.";
  }
  editProfilePicture.value = false;
  editProfile.value = false;
  newPassword.value = "";
  confirmNewPassword.value = "";
};
const fetchUserInfo = async () => {
  try {
    const response = await axios.get("/api/whoami");
    userInfo.value = response.data;
  } catch (error) {
    userInfo.value = error.data;
  }
};

onMounted(async () => {
  try {
    const response = await axios.get("/api/whoami");
    userInfo.value = response.data;

    // Initialize newDisplayNameConfirm and newUsernameConfirm with fetched data
    newDisplayNameConfirm.value = userInfo.value.displayName;
    newUsernameConfirm.value = userInfo.value.username;
  } catch (error) {
    console.error(error);
  }
  // Wait for userInfo to be computed
  watchEffect(fetchUserInfo);
});
</script>

<style scoped>
.navbar {
  padding: 20px;
  background-color: #f8f9fa;
}

.main-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 50px;
  height: auto;
}

.center-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1; /* Takes up remaining space */
  background-color: #f8f9fa;
  padding-right: 100px;
  padding-left: 100px;
  padding-top: 50px;
  border-radius: 10px; /* Rounded corners */
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
}

.header {
  margin-bottom: 20px;
  text-align: center;
}

.profile-picture {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  margin-bottom: 20px;
}

.profile-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 10px;
  margin-bottom: 20px;
}

.profile-details .detail {
  display: flex;
  justify-content: space-between;
  width: 300px; /* Adjust as needed */
  margin-bottom: 10px;
}

.profile-details .detail:last-child {
  margin-bottom: 0;
}

.profile-details .label {
  font-size: 18px;
  color: #333;
  font-weight: bold;
  margin-right: 10px;
}

.profile-details .value {
  font-size: 18px;
  color: #333;
}

.change-password-label {
  font-size: 18px;
  text-decoration: underline;
  cursor: pointer;
  color: #333;
  font-weight: bold;
}

.password-text {
  background-color: white;
  color: black;
  text-align: left;
  padding: 4px;
  margin-bottom: 5px;
  border: 1px solid black;
  border-radius: 5px;
}

.edit-icon {
  text-align: center;
}

.change-profile-picture-button {
  font-weight: bold;
  color: black;
  border: none;
  cursor: pointer;
  text-align: center;
  justify-content: center;
  background-color: orange;
}

.edit-input {
  background-color: white;
  color: black;
  text-align: right;
  padding: 4px;
  margin-bottom: 5px;
  border: 1px solid black;
  border-radius: 5px;
  width: 150px;
}

.mt-2.text-h6 {
  font-size: 12px; /* Adjust as needed */
}

.alert {
  background-color: #0a196e; /* Red background */
  color: white; /* White text */
  margin-bottom: 15px; /* Some bottom margin */
  padding: 20px; /* Some padding */
  border-radius: 4px; /* Little rounded corners */
}
</style>
