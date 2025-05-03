<script setup>
import { ref } from "vue";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";

import axios from "axios";

const isAuthenticated = ref(false);
const user = ref(null);
const isSignUp = ref(false); // Toggle between Login and Signup
const email = ref("");
const password = ref("");
const errorMessage = ref("");
const feedbackMessage = ref("");

const auth = getAuth();

// Handle Authentication State
auth.onAuthStateChanged((currentUser) => {
  user.value = currentUser;
  isAuthenticated.value = !!currentUser;
});

// Handle Login
async function handleLogin() {
  errorMessage.value = "";
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      user.value = userCredential.user;
      isAuthenticated.value = true; // Set authenticated immediately
    })
    .catch((error) => {
      errorMessage.value = error.message;
    });

  const uid = user.value.uid;

  const response = await axios.post(
    "https://127.0.0.1:8084/core/insertPlayer",
    {
      playerID: uid,
    }
  );

  console.log(response.data.status);
}

async function handleSignup() {
  errorMessage.value = "";
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );
    user.value = userCredential.user;
    isAuthenticated.value = true;

    const uid = user.value.uid;

    const response = await axios.post(
      "https://127.0.0.1:8084/db/insertPlayer",
      {
        playerID: uid,
      }
    );

    console.log(response.data.status);
  } catch (error) {
    errorMessage.value = error.message;
  }
}

// Handle Logout
function handleLogout() {
  signOut(auth).then(() => {
    user.value = null;
    isAuthenticated.value = false;
  });
}

async function handleForgotPassword() {
  if (email.value) {
    try {
      await sendPasswordResetEmail(auth, email.value);
      feedbackMessage.value = "Password reset email sent! Check your inbox.";
    } catch (error) {
      feedbackMessage.value =
        "Failed to send password reset email. Please try again.";
    }
  } else {
    feedbackMessage.value = "Enter your email to reset your password.";
  }
}
</script>

<template>
  <div class="body">
    <v-container>
      <v-row justify="center" class="mt-10">
        <v-col cols="12" sm="8" md="6">
          <v-card class="pa-6">
            <v-card-title class="text-h5">Welcome</v-card-title>
            <v-card-text>
              <div v-if="!isAuthenticated">
                <!-- Toggle between Login and Signup -->
                <v-btn-toggle color="primary" v-model="isSignUp" mandatory>
                  <v-btn :value="false">Log In</v-btn>
                  <v-btn :value="true">Sign Up</v-btn>
                </v-btn-toggle>
                <!-- Login or Signup Form -->
                <v-form class="mt-4">
                  <v-text-field
                    v-model="email"
                    label="Email"
                    type="email"
                    required
                    outlined
                  ></v-text-field>
                  <v-text-field
                    v-model="password"
                    label="Password"
                    type="password"
                    required
                    outlined
                  ></v-text-field>
                  <v-alert
                    v-if="errorMessage"
                    type="error"
                    class="mt-2"
                    outlined
                  >
                    {{ errorMessage }}
                  </v-alert>
                  <v-btn
                    class="mt-4"
                    block
                    color="primary"
                    @click="isSignUp ? handleSignup() : handleLogin()"
                  >
                    {{ isSignUp ? "Sign Up" : "Log In" }}
                  </v-btn>
                  <v-btn
                    v-if="!isSignUp"
                    class="mt-2"
                    block
                    color="secondary"
                    @click="handleForgotPassword()"
                  >
                    Forgot Password?
                  </v-btn>
                  <p class="feedback-message">{{ feedbackMessage }}</p>
                </v-form>
              </div>
              <!-- Show when authenticated -->
              <div v-else>
                <p>Welcome, {{ user?.email || "User" }}!</p>
                <v-btn class="mt-4" block color="error" @click="handleLogout">
                  Log Out
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
