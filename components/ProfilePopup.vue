<script setup>
import { ref, onMounted } from "vue";
import { getAuth, sendPasswordResetEmail, signOut } from "firebase/auth";
import axios from "axios";

// Props
const props = defineProps({
  name: String,
});

console.log("ProfilePopup props:", props);

// Emits
const emit = defineEmits(["usernameUpdated"]);

// States
const showPopup = ref(false);
const editUsernameDialog = ref(false);

const user = ref(null);
const feedbackMessage = ref("");
const balance = ref(0);
const username = ref(props.name);

// Temporärer Username für Bearbeitung
const editableUsername = ref(props.name);

// Funktionen
function togglePopup() {
  showPopup.value = !showPopup.value;
}

function openEditUsername() {
  editableUsername.value = username.value;
  editUsernameDialog.value = true;
}

async function getBalance() {
  try {
    const response = await axios.post(
      "http://127.0.0.1:8080/core/fetchBalance",
      {
        playerID: user.value.uid,
      }
    );
    return response.data.balance;
  } catch (error) {
    console.error("Failed to fetch balance:", error);
    return -1;
  }
}

async function updateName() {
  console.log("Updating name to:", editableUsername.value);
  username.value = editableUsername.value;
  editUsernameDialog.value = false;
  try {
    const response = await axios.post("http://127.0.0.1:8080/core/updateName", {
      playerID: user.value.uid,
      name: username.value,
    });
    emit("usernameUpdated", { newName: username.value });
    console.log("Name update response:", response.data);
  } catch (error) {
    console.error("Failed to update name:", error);
    return -1;
  }
}

async function sendPasswordReset() {
  const auth = getAuth();
  if (user.value?.email) {
    try {
      await sendPasswordResetEmail(auth, user.value.email);
      feedbackMessage.value = "Password reset email sent! Check your inbox.";
    } catch (error) {
      feedbackMessage.value = "Failed to send password reset email.";
    }
  } else {
    feedbackMessage.value = "No user email found.";
  }
}

async function logout() {
  try {
    const auth = getAuth();
    await signOut(auth);
    feedbackMessage.value = "Successfully logged out.";
    user.value = null;
    togglePopup();
  } catch (error) {
    feedbackMessage.value = "Logout failed.";
    console.error("Logout error:", error);
  }
}

// Initiale Daten holen
onMounted(() => {
  const auth = getAuth();
  auth.onAuthStateChanged(async (currentUser) => {
    user.value = currentUser;
    if (user.value) {
      balance.value = await getBalance();
    }
  });
});
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

    <!-- Profil-Dialog -->
    <v-dialog v-model="showPopup" persistent max-width="400">
      <v-card>
        <v-card-title>Profile</v-card-title>

        <v-card-text>
          <div class="info-block">
            <p><strong>Email:</strong> {{ user?.email }}</p>

            <div class="d-flex align-center justify-space-between">
              <span><strong>Username:</strong> {{ username }}</span>
              <v-btn icon @click="openEditUsername" variant="text">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </div>

            <p><strong>Balance:</strong> {{ balance }}</p>

            <p class="feedback-message">{{ feedbackMessage }}</p>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-btn color="primary" @click="sendPasswordReset"
            >Change Password</v-btn
          >
          <v-btn color="error" @click="logout">Logout</v-btn>
          <v-btn color="secondary" @click="togglePopup">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Edit Username Dialog -->
    <v-dialog v-model="editUsernameDialog" max-width="300">
      <v-card>
        <v-card-title>Edit Username</v-card-title>
        <v-card-text>
          <v-text-field v-model="editableUsername" label="New Username" dense />
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="updateName">Save</v-btn>
          <v-btn text @click="editUsernameDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.info-block > * {
  margin-bottom: 10px;
}

.feedback-message {
  color: #4caf50;
  margin-top: 10px;
}

.feedback-message.error {
  color: #f44336;
}
</style>
