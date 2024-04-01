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
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="confirmPassword"
            >Confirm</v-btn
          >
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
          <br />
          <v-icon
            class="edit-icon"
            @click="editProfileToggle"
            style="position: absolute; right: 0; top: 10px"
            >mdi-pencil
          </v-icon>
        </div>
        <div class="profile-picture">
          <img src="https://via.placeholder.com/150" alt="Profile Picture" />
        </div>
        <div class="edit-icon" v-if="editProfile">
          <button>Change Profile Picture</button>
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
                class="password-text"
                type="password"
                placeholder="New Password"
              /><br />
              <input
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
let showPassword = ref(false);
let newDisplayNameConfirm = ref("");
let newUsernameConfirm = ref("");
const editProfile = ref(false);
const changePassword = ref(false);
const message = ref("");

const editProfileToggle = () => {
  showPasswordDialog.value = true;
  editProfile.value = !editProfile.value;
};

const changePasswordToggle = () => {
  changePassword.value = !changePassword.value;
};

const confirmPassword = () => {
  showPasswordDialog.value = false;
};

const submitChanges = async () => {
  if (newUsernameConfirm.value !== userInfo.value.username) {
    try {
      const response = await axios.put("/api/user/update-username", null, {
        params: {
          newUsername: newUsernameConfirm.value,
        },
      });

      if (response.data.success) {
        userInfo.value.username = newUsernameConfirm.value;
        message.value = response.data.message;
        let formData = new FormData();
        formData.append("username", newUsernameConfirm.value);
        formData.append("password"); // Assuming you have the current password in userInfo
        let loginResponse = await axios.post("/api/login", formData);

        if (loginResponse.data.success) {
          userInfo.value.username = newUsernameConfirm.value;
          message.value = response.data.message;
        } else {
          message.value = "Re-authentication failed. Please login again.";
        }
      }
    } catch (error) {
      message.value = error.data;
    }
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
        message.value = response.data.message;
      }
    } catch (error) {
      message.value = error.data;
    }
  }
  editProfile.value = false;
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

.alert {
  background-color: #0a196e; /* Red background */
  color: white; /* White text */
  margin-bottom: 15px; /* Some bottom margin */
  padding: 20px; /* Some padding */
  border-radius: 4px; /* Little rounded corners */
}
</style>
