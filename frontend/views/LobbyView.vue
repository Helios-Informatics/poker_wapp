<script setup>
import { onMounted, ref, watch } from "vue";
import LobbyPlayer from "../components/LobbyPlayer.vue";
import { newGame } from "../scripts/script.js";
import { pl } from "vuetify/locale";

const props = defineProps({
  lobbyState: Object,
});

const lobbyState = ref(props.lobbyState);
const players = ref(lobbyState.value.lobbyPlayers);
const bigBlind = ref(lobbyState.value.bigBlind);
const smallBlind = ref(lobbyState.value.smallBlind);

const playerKeys = ref(Object.keys(players.value));

watch(
  () => props.lobbyState,
  (newLobbyState) => {
    lobbyState.value = newLobbyState;
    console.log("Lobby state updated:", lobbyState.value);
    players.value = lobbyState.value.lobbyPlayers;
    bigBlind.value = lobbyState.value.bigBlind;
    smallBlind.value = lobbyState.value.smallBlind;

    playerKeys.value = Object.keys(players.value);
  },
  { immediate: true, deep: true }
);

function copyLobbyLink() {
  const lobbyUrl = window.location.origin;
  navigator.clipboard
    .writeText(lobbyUrl)
    .then(() => {
      console.log("Lobby link copied to clipboard:", lobbyUrl);
      alert("Invite link copied to clipboard!");
    })
    .catch((err) => {
      console.error("Error copying lobby link:", err);
    });
}
</script>
<template>
  <div class="body">
    <div
      class="d-flex flex-column align-center mt-5"
      style="height: 90vh; width: 100vw"
    >
      <h1 class="d-flex justify-center mb-10 text-white">Welcome to Poker!</h1>
      <div class="d-flex justify-center w-100 mt-10">
        <div class="d-flex flex-column" style="width: 50%">
          <div class="d-flex flex-row justify-center">
            <h2 class="text-white mb-5">Players</h2>
          </div>
          <div>
            <div
              v-for="(key, index) in playerKeys"
              :key="index"
              class="d-flex justify-center"
            >
              <LobbyPlayer :name="key" />
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex justify-end align-end mt-auto w-100 px-10 mb-5">
        <v-btn color="primary" class="mr-2" @click="copyLobbyLink">
          Copy Invite Link
        </v-btn>
        <v-btn color="success" @click="newGame(smallBlind, bigBlind, players)"
          >Start Game</v-btn
        >
      </div>
    </div>
  </div>
</template>
