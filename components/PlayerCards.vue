<script setup>
import { defineProps, computed, watch, ref } from "vue";
import Card from "./Card.vue";
import HiddenCard from "./HiddenCard.vue";

const props = defineProps({
  showCards: Boolean,
  playerIndex: Number,
  folded: Boolean,
  playerAtTurn: Number,
  gameState: Object,
});

const playerIndex = ref(props.playerIndex);
const playerAtTurn = ref(props.playerAtTurn);
const gameState = ref(props.gameState);
const showCards = ref(props.showCards);
const folded = ref(props.folded)

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
  () => props.folded,
  (newFolded) => {
    folded.value = newFolded;
    console.log("folded updated", folded.value)
  }
)
watch(
  () => props.gameState,
  (newGameState) => {
    gameState.value = newGameState;
    console.log("GameState updated:", gameState.value);
  }
);
watch(
  () => props.showCards,
  (newShowCards) => {
    showCards.value = newShowCards;
    console.log("ShowCards updated:", showCards.value);
  }
);

const indexedPlayers = computed(() =>
  gameState.value.players.map((player, index) => ({ ...player, index }))
);
</script>
<template>
  <div :class="['d-flex', {'opacity-50': folded}]">
    <Card
      v-if="showCards"
      :rank="indexedPlayers[playerIndex].player.card1rank.toString()"
      :suitID="indexedPlayers[playerIndex].player.card1suit"
    />
    <Card
      v-if="showCards"
      :rank="indexedPlayers[playerIndex].player.card2rank.toString()"
      :suitID="indexedPlayers[playerIndex].player.card2suit"
    />
    <HiddenCard v-else />
    <HiddenCard v-else />
  </div>
</template>
