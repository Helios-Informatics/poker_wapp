<script setup>
import { defineProps, computed } from "vue";

const props = defineProps({
  rank: String,
  suitID: Number,
});

const suitStyle = computed(() => getSuitStyle(props.suitID));
const suit = computed(() => suitStyle.value[0]);
const color = computed(() => suitStyle.value[1]);


function getSuitStyle(suitID) {
  switch (suitID) {
    case 0:
      return ["♠", "black"];
    case 1:
      return ["♣", "black"];
    case 2:
      return ["♦", "red"];
    case 3:
      return ["♥", "red"];
    default:
      return ["", ""];
  }
}
</script>
<template>
  <div class="card responsive-cards">
    <div :class="['card-icon', suit, color, 'responsive-card-suit']"></div>
    <div :class="['card-text', color, 'responsive-card-text']">{{ rank }}</div>
  </div>
</template>
