<script setup>
import { defineProps, computed } from "vue";
import { getSuitStyle } from "de.htwg.poker.util.WappFunctions";

const props = defineProps({
  rank: String,
  suitID: Number,
});

const suitStyle = computed(() => getSuitStyle(props.suitID));
const suit = computed(() => suitStyle.value[0]);
const color = computed(() => suitStyle.value[1]);
</script>
<template>
  <div class="card responsive-cards">
    <div :class="['card-icon', suit, color, 'responsive-card-suit']"></div>
    <div :class="['card-text', color, 'responsive-card-text']">{{ rank }}</div>
  </div>
</template>
