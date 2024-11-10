<script setup>
import { defineProps } from "vue";

const props = defineProps({
  name: String,
});

function makeEditable(event) {
  event.target.removeAttribute("readonly");
}
</script>
<template>
  <div
    class="player bg-primary flex-row justify-content-start rounded-4"
    style="width: 70%"
  >
    <div class="player-circle player-circle me-1 my-2">
      <div class="bi-person-fill my-player-icon text-white"></div>
    </div>
    <div class="text-secondary text-white ms-3">
      <input
        type="text"
        class="form-control-lg form-control-plaintext text-white player-name"
        :value="name"
        @click="makeEditable"
        readonly
      />
    </div>
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
