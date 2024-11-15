<script setup>
import { defineProps, computed, watch, ref } from "vue";
import Card from "./Card.vue";
import HiddenCard from "./HiddenCard.vue";

const props = defineProps({
  playerIndex: Number,
  playerAtTurn: Number,
  gameState: Object,
});

const playerIndex = ref(props.playerIndex);
const playerAtTurn = ref(props.playerAtTurn);
const gameState = ref(props.gameState);

watch(
  () => props.playerIndex,
  (newPlayerIndex) => {
    playerIndex.value = newPlayerIndex;
    console.log("PlayerIndex updated:", playerIndex.value);
  }
);
watch(
  () => props.playerAtTurn,
  (newPlayerAtTurn) => {
    playerAtTurn.value = newPlayerAtTurn;
    console.log("PlayerAtTurn updated:", playerAtTurn.value);
  }
);
watch(
  () => props.gameState,
  (newGameState) => {
    gameState.value = newGameState;
    console.log("GameState updated:", gameState.value);
  }
);

const indexedPlayers = computed(() =>
  gameState.value.players.map((player, index) => ({ ...player, index }))
);
</script>
<template>
  <div class="d-flex">
    <Card
      v-if="playerAtTurn === playerIndex"
      :rank="indexedPlayers[playerIndex].player.card1rank.toString()"
      :suitID="indexedPlayers[playerIndex].player.card1suit"
    />
    <Card
      v-if="playerAtTurn === playerIndex"
      :rank="indexedPlayers[playerIndex].player.card2rank.toString()"
      :suitID="indexedPlayers[playerIndex].player.card2suit"
    />
    <HiddenCard v-else />
    <HiddenCard v-else />
  </div>
</template>
