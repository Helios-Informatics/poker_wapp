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
    case 1:
      return ["mdi mdi-cards-club", "black"];
    case 2:
      return ["mdi mdi-cards-spade", "black"];
    case 3:
      return ["mdi mdi-cards-diamond", "red"];
    case 4:
      return ["mdi mdi-cards-heart", "red"];
    default:
      return [null, null];
  }
}
</script>
<template>
  <div class="card responsive-cards">
    <div :class="['card-icon', 'responsive-card-suit']">
      <v-icon :color="color">{{ suit }}</v-icon>
    </div>
    <div :class="['card-text', `text-${color}`, 'responsive-card-text']">
      {{ rank }}
    </div>
  </div>
</template>
