<script setup>
import { defineProps, onMounted, onUnmounted, ref, watch } from "vue";

const props = defineProps({
  name: String,
  balance: Number,
  folded: Boolean,
  position: String,
  isAtTurn: Boolean,
  newRoundStarted: Boolean,
  offline: Boolean,
});

const name = ref(props.name);
const balance = ref(props.balance);
const folded = ref(props.folded);
const position = ref(props.position);
const isAtTurn = ref(props.isAtTurn);
const offline = ref(props.offline);

watch(
  () => props.name,
  (newName) => {
    name.value = newName;
  }
);
watch(
  () => props.balance,
  (newBalance) => {
    balance.value = newBalance;
  }
);
watch(
  () => props.folded,
  (newFolded) => {
    console.log("PLAYER NEW FOLDED", name.value, newFolded);
    folded.value = newFolded;
  }
);
watch(
  () => props.position,
  (newPosition) => {
    position.value = newPosition;
  }
);
watch(
  () => props.isAtTurn,
  (newIsAtTurn) => {
    isAtTurn.value = newIsAtTurn;
  }
);
watch(
  () => props.offline,
  (newOffline) => {
    offline.value = newOffline;
  }
);
</script>

<template>
  <div :class="['player', position]">
    <div class="d-flex">
      <div
        :class="[
          isAtTurn ? 'text-blue-accent-4' : 'text-grey',
          { 'opacity-50': folded },
        ]"
      >
        {{ name }}
      </div>
      <v-icon v-if="offline" class="text-red">mdi-power-plug-off</v-icon>
    </div>
    <div
      :class="[
        'player-circle',
        'responsive-player-circle',
        'mr-1',
        { 'opacity-50': folded },
      ]"
    >
      <div
        :class="[
          'mdi mdi-account',
          'player-icon',
          'responsive-player-icon',
          { 'opacity-50': folded },
        ]"
      ></div>
    </div>

    <div
      :class="[
        'player-balance',
        'responsive-player-balance',
        { 'opacity-50': folded },
      ]"
    >
      $ {{ balance }}
    </div>
  </div>
</template>
