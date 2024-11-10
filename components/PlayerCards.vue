<script setup>
import { defineProps, computed } from "vue";
import Card from "./Card.vue";
import HiddenCard from "./HiddenCard.vue";

const props = defineProps({
  playerIndex: Number,
  playerAtTurn: Number,
  gameState: Object,
});

const indexedPlayers = computed(() =>
  props.gameState.getPlayers().map((player, index) => ({ ...player, index }))
);
</script>
<template>
  <div>
    <Card
      v-if="playerAtTurn === playerIndex"
      :rank="indexedPlayers[playerIndex].card1.rank.toString()"
      :suitID="indexedPlayers[playerIndex].card1.suit.id"
    />
    <Card
      v-if="playerAtTurn === playerIndex"
      :rank="indexedPlayers[playerIndex].card2.rank.toString()"
      :suitID="indexedPlayers[playerIndex].card2.suit.id"
    />
    <HiddenCard v-else />
    <HiddenCard v-else />
  </div>
</template>
