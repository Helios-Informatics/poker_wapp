<script setup>
import { ref } from "vue";
import LobbyPlayer from "../components/LobbyPlayer.vue";
import { newGame } from "../scripts/script.js";

const players = ref(["Julian"]);
const bigBlind = ref("");
const smallBlind = ref("");

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
      style="height: 90vh; width: 100vw;"
    >
      <div class="d-flex flex-row justify-space-between w-100 px-5">
        <div class="d-flex flex-column" style="width: 45%;">
          <div class="d-flex flex-row">
            <h2 class="text-white mb-5">Players</h2>
            <h2 class="text-white ms-3">(1/6)</h2>
          </div>
          <div>
            <div v-for="player in players" :key="player">
              <LobbyPlayer :name="player" />
            </div>
          </div>
        </div>
        <div class="d-flex flex-column text-white" style="width: 45%;">
          <h2 class="text-white mb-5">Settings</h2>
          <v-text-field
            v-model="bigBlind"
            label="Big Blind"
            type="number"
            outlined
            color="white"
            class="mb-3"
            placeholder="Enter big blind amount"
          ></v-text-field>
          <v-text-field
            v-model="smallBlind"
            label="Small Blind"
            type="number"
            outlined
            color="white"
            placeholder="Enter small blind amount"
          ></v-text-field>
        </div>
      </div>
      <div class="d-flex justify-end align-end mt-auto w-100 px-5 mb-5">
        <v-btn color="primary" class="mr-2" @click="copyLobbyLink">
          Copy Invite Link
        </v-btn>
        <v-btn color="success" @click="newGame">Start Game</v-btn>
      </div>
    </div>
  </div>
</template>
