<script setup>
import { ref } from "vue";
import { getAuth, sendPasswordResetEmail, signOut } from "firebase/auth";
import axios from "axios";

const showPopup = ref(false);
const user = ref(null);
const feedbackMessage = ref("");

const auth = getAuth();
auth.onAuthStateChanged((currentUser) => {
  user.value = currentUser;
});

function togglePopup() {
  showPopup.value = !showPopup.value;
}

async function getBalance() {
  try {
    const response = await axios.get("https://your-api-endpoint.com/balance", {
      params: { uid: user.value.uid },
    });
    return response.data.balance;
  } catch (error) {
    console.error("Failed to fetch balance:", error);
    return -1;
  }
}

async function sendPasswordReset() {
  if (user.value?.email) {
    try {
      await sendPasswordResetEmail(auth, user.value.email);
      feedbackMessage.value = "Password reset email sent! Check your inbox.";
    } catch (error) {
      feedbackMessage.value =
        "Failed to send password reset email. Please try again.";
    }
  } else {
    feedbackMessage.value = "No user email found.";
  }
}

async function logout() {
  try {
    await signOut(auth);
    feedbackMessage.value = "Successfully logged out.";
    user.value = null; // Reset the user state after logout
    togglePopup(); // Close the popup
  } catch (error) {
    feedbackMessage.value = "Logout failed. Please try again.";
  }
}
</script>

<template>
  <div>
    <v-avatar
      size="50"
      color="grey"
      class="cursor-pointer"
      @click="togglePopup"
      icon="mdi mdi-account"
    >
    </v-avatar>

    <v-dialog v-model="showPopup" persistent max-width="400">
      <template #activator="{ props }"> </template>
      <v-card>
        <v-card-title>Profile</v-card-title>
        <v-card-text>
          <p><strong>Email:</strong> {{ user?.email }}</p>
          <p class="feedback-message">{{ feedbackMessage }}</p>
        </v-card-text>
        <v-card-text>
          <p><strong>Balance:</strong> {{ getBalance() }}</p>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="sendPasswordReset">
            Change Password
          </v-btn>
          <v-btn color="error" @click="logout"> Logout </v-btn>
          <v-btn color="secondary" @click="togglePopup">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.feedback-message {
  color: #4caf50; /* Success color */
  margin-top: 10px;
}

.feedback-message.error {
  color: #f44336; /* Error color */
}
</style>
