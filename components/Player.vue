<script setup>
import { defineProps, onMounted, ref, watch } from "vue";

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
      console.log(
        "LUL: Starting turn countdown because of NEW IS AT TURN for player",
        name.value
      );
      startTurnCountdown();
    } else {
      turnCountdownActive.value = false;
    }
  }
);
watch(
  () => props.newRoundStarted,
  (newRoundStartedValue) => {
    console.log("LUL: NEW ROUND STARTED", newRoundStartedValue);
    newRoundStarted.value = newRoundStartedValue;
    //setTimeout
    setTimeout(() => {
      if (
        !turnCountdownActive.value &&
        newRoundStartedValue &&
        isAtTurn.value
      ) {
        console.log(
          "LUL: Starting turn countdown because of NEWROUNDSTARTED AND IS AT TURN for player",
          name.value
        );
        startTurnCountdown();
      }
    }, 100);
  }
);

onMounted(() => {
  if (!turnCountdownActive.value && isAtTurn.value) {
    console.log(
      "LUL: Starting turn countdown because of ONMOUNTED for player",
      name.value
    );
    startTurnCountdown();
  }
});

function startTurnCountdown() {
  turnCountdownActive.value = true;
  let duration = 13;
  let time = duration;
  turnCountdown.value = 100;
  const interval = setInterval(() => {
    if (!turnCountdownActive.value) {
      clearInterval(interval);
      return;
    }
    time--;
    turnCountdown.value = (time / duration) * 100;
    if (time === -1) {
      console.log("LUL: Turn countdown expired for player", name.value);
      clearInterval(interval);
      turnCountdownActive.value = false;
      emit("turnCountdownExpired");
    }
  }, 1000);
}
</script>

<template>
  <div :class="['player', position]">
    <div
      :class="[
        isAtTurn ? 'text-secondary' : 'text-grey',
        { 'opacity-50': folded },
      ]"
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
