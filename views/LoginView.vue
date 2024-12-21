<script setup>
import { ref, onMounted } from "vue";
import { getAuth } from "firebase/auth";
import ui, { uiConfig } from "../src/firebaseui";

const isAuthenticated = ref(false);
const user = ref(null);
const isSignUp = ref(false);

const auth = getAuth();

const startFirebaseUI = () => {
  uiConfig.signInOptions = isSignUp.value
    ? [
        {
          provider: "password",
          requireDisplayName: true,
        },
      ]
    : [
        {
          provider: "password",
        },
      ];
  ui.start("#firebaseui-auth-container", uiConfig);
};

onMounted(() => {
  auth.onAuthStateChanged((currentUser) => {
    user.value = currentUser;
    isAuthenticated.value = !!currentUser;
  });

  if (!isAuthenticated.value) {
    startFirebaseUI();
  }
});
</script>

<template>
  <v-container>
    <v-row justify="center" class="mt-10">
      <v-col cols="12" sm="8" md="6">
        <v-card class="pa-6">
          <v-card-title class="text-h5">Welcome</v-card-title>
          <v-card-text>
            <div v-if="!isAuthenticated">
              <v-btn-toggle
                v-model="isSignUp"
                mandatory
                @change="startFirebaseUI"
              >
                <v-btn value="false">Log In</v-btn>
                <v-btn value="true">Sign Up</v-btn>
              </v-btn-toggle>

              <div id="firebaseui-auth-container" class="mt-4"></div>
            </div>
            <div v-else>
              <p>Welcome, {{ user?.displayName || "User" }}!</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style>
@import "firebaseui/dist/firebaseui.css";
</style>
