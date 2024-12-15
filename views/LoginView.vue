<script setup>
import { onMounted } from "vue";
import ui, { uiConfig } from "../src/firebaseui";

onMounted(() => {
  console.log("LoginView mounted");
  ui.start("#firebaseui-auth-container", uiConfig);
});
</script>

<template>
  <div>
    <h1>Login</h1>
    <div id="firebaseui-auth-container"></div>
  </div>
</template>

<style>
/* FirebaseUI-Styles */
@import "firebaseui/dist/firebaseui.css";
</style>
