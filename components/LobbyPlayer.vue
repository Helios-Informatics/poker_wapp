<script setup>
import { defineProps, ref } from "vue";

const props = defineProps({
  name: String,
});

const name = ref(props.name);
</script>
<template>
  <div
    class="player bg-primary flex-row justify-start align-center rounded-lg"
    style="width: 40%"
  >
    <div class="player-circle player-circle my-2">
      <v-icon icon="mdi mdi-account"></v-icon>
    </div>

    <v-text-field
      hide-details
      class="player-name"
      v-model="name"
      color="white"
      variant=""
      dense
      outlined
    ></v-text-field>
  </div>
</template>
<style scoped>
.player-circle {
  width: 50px;
  height: 50px;
}

.player-circle {
  flex-shrink: 0;
  border-radius: 304px;
  background: #4b5563;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 5px;
  box-shadow: 2px 1px 1px 1px rgba(0, 0, 0, 0.25);
}

.my-player-icon {
  font-size: 25px;
}
</style>
