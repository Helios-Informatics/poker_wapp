<script setup>
import { defineProps, onMounted, onUnmounted, ref, watch } from "vue";

const props = defineProps({
  name: String,
  balance: Number,
  folded: Boolean,
  position: String,
  isAtTurn: Boolean,
  newRoundStarted: Boolean,
});

const emit = defineEmits(["turnCountdownExpired"]);

const name = ref(props.name);
const balance = ref(props.balance);
const folded = ref(props.folded);
const position = ref(props.position);
const isAtTurn = ref(props.isAtTurn);
const turnCountdown = ref(100);
const turnCountdownActive = ref(false);
const newRoundStarted = ref(props.newRoundStarted);

const timerIntervalID = ref(null);

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
    turnCountdownActive.value = false;
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
    if (!turnCountdownActive.value && newIsAtTurn) {
      startTurnCountdown();
    } else {
      turnCountdownActive.value = false;
    }
  }
);
watch(
  () => props.newRoundStarted,
  (newRoundStartedValue) => {
    newRoundStarted.value = newRoundStartedValue;
    //setTimeout
    setTimeout(() => {
      if (newRoundStartedValue && isAtTurn.value) {
        clearInterval(timerIntervalID.value);
        startTurnCountdown();
      }
    }, 200);
  }
);

onMounted(() => {
  if (!turnCountdownActive.value && isAtTurn.value) {
    startTurnCountdown();
  }
});

onUnmounted(() => {
  clearInterval(timerIntervalID.value);
});

function startTurnCountdown() {
  turnCountdownActive.value = true;
  let duration = 13;
  let time = duration;
  turnCountdown.value = 100;
  timerIntervalID.value = setInterval(() => {
    if (!turnCountdownActive.value) {
      clearInterval(timerIntervalID.value);
      return;
    }
    time--;
    turnCountdown.value = (time / duration) * 100;
    if (time === -1) {
      turnCountdownActive.value = false;
      emit("turnCountdownExpired");
      clearInterval(timerIntervalID.value);
    }
  }, 1000);
}
</script>

<template>
  <div :class="['player', position]">
    <div
      :class="[isAtTurn ? 'text-white' : 'text-grey', { 'opacity-50': folded }]"
    >
      {{ name }}
    </div>
    <div
      :class="[
        'player-circle',
        'responsive-player-circle',
        'mr-1',
        { 'opacity-50': folded },
      ]"
    >
      <v-progress-circular
        :model-value="turnCountdown"
        :size="100"
        color="white"
        bg-color="transparent"
        :width="2"
        v-if="isAtTurn"
      >
        <div
          :class="[
            'mdi mdi-account',
            'player-icon',
            'responsive-player-icon',
            { 'opacity-50': folded },
          ]"
        ></div>
      </v-progress-circular>
      <div
        v-else
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
