<script setup>
import { defineProps } from "vue";

const props = defineProps({
  buttonType: String,
  buttonText: String,
  buttonIcon: String,
});
</script>

<template>
  <button :class="buttonType">
    <div :class="['button-text', buttonIcon]"></div>
    <div class="button-text">{{ buttonText }}</div>
  </button>
</template>
