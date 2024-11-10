<script setup>
import { defineProps } from "vue";

const props = defineProps({
  name: String,
  balance: Number,
  folded: Boolean,
  position: String,
});
</script>

<template>
  <div :class="['player', position]">
    <div class="text-secondary">{{ name }}</div>
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
          'bi-person-fill',
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
