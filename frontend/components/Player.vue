<script setup>
import { defineProps, ref, watch } from "vue";

const props = defineProps({
  name: String,
  balance: Number,
  folded: Boolean,
  position: String,
  isAtTurn: Boolean,
});

const name = ref(props.name);
const balance = ref(props.balance);
const folded = ref(props.folded);
const position = ref(props.position);
const isAtTurn = ref(props.isAtTurn);

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
</script>

<template>
  <div :class="['player', position]">
    <div :class="isAtTurn ? 'text-secondary' : 'text-grey'">{{ name }}</div>
    <div
      :class="[
        'player-circle',
        'responsive-player-circle',
        'mr-1',
        { 'opacity-25': folded },
      ]"
    >
      <div
        :class="[
          'mdi mdi-account',
          'player-icon',
          'responsive-player-icon',
          { 'opacity-25': folded },
        ]"
      ></div>
    </div>
    <div
      :class="[
        'player-balance',
        'responsive-player-balance',
        { 'opacity-25': folded },
      ]"
    >
      $ {{ balance }}
    </div>
  </div>
</template>
