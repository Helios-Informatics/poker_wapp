<script setup>
import { ref, onMounted } from "vue";
import LobbyView from "./views/LobbyView.vue";
import PokerView from "./views/PokerView.vue";
import LoginView from "./views/LoginView.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  connectWebSocket,
  getCookie,
  setCookie,
  generatePlayerID,
} from "./scripts/script.js";

const currentViewIsLobby = ref(true);
const playerID = ref("");
const gameState = ref({});
const lobbyState = ref({});
const isAuthenticated = ref(false);
const isLoading = ref(true);

const auth = getAuth();

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User is authenticated:", user);
      isAuthenticated.value = true;
      initializeGame(); // Immediately initialize the game
    } else {
      console.log("User is not authenticated");
      isAuthenticated.value = false;
      isLoading.value = false;
    }
  });
});

// Initialize game for authenticated users
async function initializeGame() {
  isLoading.value = true; // Set loading while initializing
  playerID.value = getCookie("playerID");
  if (!playerID.value) {
    playerID.value = generatePlayerID();
    setCookie("playerID", playerID.value, 1);
  }

  const onUpdate = (data) => {
    console.log("Data received:", data);
    lobbyState.value = { ...data };
    currentViewIsLobby.value = data.isLobby;

    const { isLobby, ...gameData } = data;
    gameState.value = gameData;
  };

  try {
    const response = await connectWebSocket(playerID.value, onUpdate);
    console.log("Initial response:", response);

    lobbyState.value = { ...response };
    currentViewIsLobby.value = response.isLobby;

    const { isLobby, ...gameData } = response;
    gameState.value = gameData;
  } catch (error) {
    console.error("WebSocket connection error:", error);
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div v-if="isLoading">
    <p>Loading...</p>
  </div>

  <LoginView v-else-if="!isAuthenticated" />

  <div v-else>
    <LobbyView v-if="currentViewIsLobby" :lobbyState="lobbyState" />
    <PokerView v-else :gameState="gameState" />
  </div>
</template>

<style>
.body {
  background: #293342;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

@media (min-width: 0px) {
  .responsive-progress-bar {
    width: 120px;
  }

  .responsive-button {
    width: 110px;
    height: 35px;
  }

  .responsive-button-text {
    font-size: 16px;
  }

  .responsive-round-button {
    width: 35px;
    height: 35px;
  }

  .responsive-player-circle {
    width: 50px;
    height: 50px;
  }

  .responsive-player-icon {
    font-size: 20px;
  }

  .responsive-table {
    width: 300px;
    height: 150px;
    border: 5px solid #2dd4bf;
    box-shadow: 6px 6px 4px 4px rgba(0, 0, 0, 0.25),
      4px 6px 1px 1px rgba(0, 0, 0, 0.25) inset;
  }

  .responsive-player-balance {
    width: 80px;
    height: 20px;
    font-size: 15px;
  }

  .responsive-pot {
    width: 70px;
    height: 17px;
    font-size: 15px;
  }

  .responsive-cards {
    width: 16px;
    height: 25px;
  }

  .responsive-card-text {
    font-size: 9px;
  }

  .responsive-card-suit {
    font-size: 8px;
  }

  .responsive-hiddencard {
    width: 22px;
    height: 40px;
  }

  .responsive-coins {
    width: 10px;
    height: 10px;
  }

  .responsive-amount {
    font-size: 11px;
    top: 16px;
  }

  .top-left-player {
    margin-right: 120px;
  }

  .responsive-slider-size {
    width: 280px;
  }

  .responsive-table-middle-row-margin-top {
    margin-top: -10px;
  }

  .responsive-table-lower-row-margin-top {
    margin-top: -10px;
  }
}

/* Small devices (landscape phones, less than 576px) */
@media (min-width: 576px) {
  .responsive-progress-bar {
    width: 140px;
  }

  .responsive-button {
    width: 110px;
    height: 35px;
  }

  .responsive-button-text {
    font-size: 18px;
  }

  .responsive-round-button {
    width: 35px;
    height: 35px;
  }

  .responsive-player-circle {
    width: 50px;
    height: 50px;
  }

  .responsive-player-icon {
    font-size: 25px;
  }

  .responsive-player-balance {
    width: 80px;
    height: 20px;
    font-size: 15px;
  }

  .responsive-pot {
    width: 70px;
    height: 17px;
    font-size: 15px;
  }

  .responsive-table {
    width: 400px;
    height: 200px;
    border: 7px solid #2dd4bf;
    box-shadow: 6px 6px 4px 4px rgba(0, 0, 0, 0.25),
      5px 7px 1px 1px rgba(0, 0, 0, 0.25) inset;
  }

  .responsive-cards {
    width: 20px;
    height: 30px;
  }

  .responsive-card-text {
    font-size: 10px;
  }

  .responsive-card-suit {
    font-size: 10px;
  }

  .responsive-hiddencard {
    width: 26px;
    height: 50px;
  }

  .responsive-coins {
    width: 10px;
    height: 10px;
  }

  .responsive-amount {
    font-size: 13px;
    top: 17px;
  }

  .top-left-player {
    margin-right: 160px;
  }

  .responsive-slider-size {
    width: 350px;
  }

  .responsive-table-middle-row-margin-top {
    margin-top: -7px;
  }

  .responsive-table-lower-row-margin-top {
    margin-top: -7px;
  }
}

/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) {
  .responsive-progress-bar {
    width: 160px;
  }

  .responsive-button {
    width: 110px;
    height: 40px;
  }

  .responsive-round-button {
    width: 40px;
    height: 40px;
  }

  .responsive-button-text {
    font-size: 20px;
  }

  .responsive-player-circle {
    width: 70px;
    height: 70px;
  }

  .responsive-player-icon {
    font-size: 30px;
  }

  .responsive-player-balance {
    width: 90px;
    height: 30px;
    font-size: 20px;
  }

  .responsive-pot {
    width: 80px;
    height: 20px;
    font-size: 17px;
  }

  .responsive-table {
    width: 500px;
    height: 250px;
    border: 8px solid #2dd4bf;
    box-shadow: 6px 6px 4px 4px rgba(0, 0, 0, 0.25),
      6px 9px 1px 2px rgba(0, 0, 0, 0.25) inset;
  }

  .responsive-cards {
    width: 26px;
    height: 32px;
  }

  .responsive-card-text {
    font-size: 12px;
  }

  .responsive-card-suit {
    font-size: 10px;
  }

  .responsive-hiddencard {
    width: 32px;
    height: 60px;
  }

  .responsive-coins {
    width: 15px;
    height: 15px;
  }

  .responsive-amount {
    font-size: 14px;
    top: 16px;
  }

  .top-left-player {
    margin-right: 200px;
  }

  .responsive-slider-size {
    width: 350px;
  }

  .responsive-table-middle-row-margin-top {
    margin-top: 0px;
  }

  .responsive-table-lower-row-margin-top {
    margin-top: 0px;
  }
}

/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) {
  .responsive-progress-bar {
    width: 180px;
  }

  .responsive-button {
    width: 120px;
    height: 40px;
  }

  .responsive-round-button {
    width: 40px;
    height: 40px;
  }

  .responsive-button-text {
    font-size: 20px;
  }

  .responsive-player-circle {
    width: 80px;
    height: 80px;
  }

  .responsive-player-icon {
    font-size: 40px;
  }

  .responsive-player-balance {
    width: 90px;
    height: 26px;
    font-size: 20px;
  }

  .responsive-pot {
    width: 90px;
    height: 20px;
    font-size: 19px;
  }

  .responsive-table {
    width: 600px;
    height: 300px;
    border: 10px solid #2dd4bf;
    box-shadow: 6px 6px 4px 4px rgba(0, 0, 0, 0.25),
      8px 12px 1px 2px rgba(0, 0, 0, 0.25) inset;
  }

  .responsive-cards {
    width: 26px;
    height: 32px;
  }

  .responsive-card-text {
    font-size: 12px;
  }

  .responsive-card-suit {
    font-size: 10px;
  }

  .responsive-hiddencard {
    width: 36px;
    height: 70px;
  }

  .responsive-coins {
    width: 20px;
    height: 20px;
  }

  .responsive-amount {
    font-size: 14px;
    top: 16px;
  }

  .top-left-player {
    margin-right: 230px;
  }

  .responsive-slider-size {
    width: 350px;
  }

  .responsive-table-middle-row-margin-top {
    margin-top: 10px;
  }

  .responsive-table-lower-row-margin-top {
    margin-top: 10px;
  }

  .responsive-chat {
    height: 400px;
  }
}

/* Extra large devices (large desktops, 1200px and up) */
@media (min-width: 1200px) {
  .responsive-progress-bar {
    width: 200px;
  }

  .responsive-button {
    width: 140px;
    height: 50px;
  }

  .responsive-button-text {
    font-size: 20px;
  }

  .responsive-round-button {
    width: 50px;
    height: 50px;
  }

  .responsive-player-circle {
    width: 80px;
    height: 80px;
  }

  .responsive-player-icon {
    font-size: 40px;
  }

  .responsive-player-balance {
    width: 90px;
    height: 26px;
    font-size: 20px;
  }

  .responsive-pot {
    width: 100px;
    height: 20px;
    font-size: 19px;
  }

  .responsive-table {
    width: 700px;
    height: 342px;
    border: 12px solid #2dd4bf;
    box-shadow: 6px 6px 4px 4px rgba(0, 0, 0, 0.25),
      8px 12px 1px 2px rgba(0, 0, 0, 0.25) inset;
  }

  .responsive-cards {
    width: 30px;
    height: 42px;
  }

  .responsive-card-text {
    font-size: 14px;
  }

  .responsive-card-suit {
    font-size: 14px;
  }

  .responsive-hiddencard {
    width: 44px;
    height: 80px;
  }

  .responsive-coins {
    width: 25px;
    height: 25px;
  }

  .responsive-amount {
    font-size: 18px;
    top: 22px;
  }

  .top-left-player {
    margin-right: 230px;
  }

  .responsive-slider-size {
    width: 400px;
  }

  .responsive-table-middle-row-margin-top {
    margin-top: 13px;
  }

  .responsive-table-lower-row-margin-top {
    margin-top: 13px;
  }
}

@media (min-width: 1400px) {
  .responsive-progress-bar {
    width: 220px;
  }

  .responsive-button {
    width: 160px;
    height: 50px;
  }

  .responsive-round-button {
    width: 50px;
    height: 50px;
  }

  .responsive-button-text {
    font-size: 20px;
  }

  .responsive-player-circle {
    width: 90px;
    height: 90px;
  }

  .responsive-player-icon {
    font-size: 50px;
  }

  .responsive-player-balance {
    width: 90px;
    height: 26px;
    font-size: 20px;
  }

  .responsive-pot {
    width: 100px;
    height: 20px;
    font-size: 19px;
  }

  .responsive-table {
    width: 700px;
    height: 342px;
    border: 12px solid #2dd4bf;
    box-shadow: 6px 6px 4px 4px rgba(0, 0, 0, 0.25),
      8px 12px 1px 2px rgba(0, 0, 0, 0.25) inset;
  }

  .responsive-cards {
    width: 30px;
    height: 42px;
  }

  .responsive-card-text {
    font-size: 18px;
  }

  .responsive-card-suit {
    font-size: 14px;
  }

  .responsive-hiddencard {
    width: 44px;
    height: 80px;
  }

  .responsive-coins {
    width: 25px;
    height: 25px;
  }

  .responsive-amount {
    font-size: 18px;
    top: 22px;
  }

  .top-left-player {
    margin-right: 250px;
  }

  .responsive-slider-size {
    width: 400px;
  }

  .responsive-table-middle-row-margin-top {
    margin-top: 13px;
  }

  .responsive-table-lower-row-margin-top {
    margin-top: 13px;
  }
}

.logo {
  font-size: 40px;
  font-weight: bolder;
  color: #af4d4d;
}

.button {
  flex-shrink: 0;
  border-radius: 200px;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 4px 4px 2px 2px rgba(0, 0, 0, 0.25);
}

.round-button {
  flex-shrink: 0;
  border-radius: 200px;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 4px 4px 2px 2px rgba(0, 0, 0, 0.25);
}

.button-text {
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 2px;
  color: white;
}

.call-button {
  margin-right: 10px;
  background: #3da466;
}

.fold-button {
  margin-right: 10px;
  background: #af4d4d;
}

.raise-button {
  background: #3a62c9;
}

.leave-button {
  background: #4b4b4b;
}

.card {
  flex-shrink: 0;
  flex-direction: column;
  border-radius: 7px;
  background: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 4px 4px 2px 2px rgba(0, 0, 0, 0.25);
}

.card-text {
  text-align: center;
  font-family: Arial, Helvetica, sans-serif;
  font-style: normal;
  line-height: normal;
}

.lol {
  margin-bottom: 22px;
}

.card-icon {
  text-align: center;
  font-style: normal;
  line-height: normal;
}

.red {
  background: rgba(255, 0, 0, 0.2);
}

.blue {
  background: rgba(0, 71, 255, 0.2);
}

.green {
  background: rgba(0, 255, 102, 0.2);
}

.grey {
  background: #404040;
}

.red-text {
  color: #ff0000;
}

.black-text {
  color: #000000;
}

.right-player {
  margin-left: 20px;
}

.left-player {
  margin-right: 20px;
}

.player {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.player-circle {
  flex-shrink: 0;
  border-radius: 304px;
  background: #4b5563;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 5px;
  box-shadow: 4px 4px 2px 2px rgba(0, 0, 0, 0.25);
}

.player-balance {
  margin-top: 8px;
  flex-shrink: 0;
  border-radius: 300px;
  background: #d2d2d2;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #4b5563;
  font-family: Arial, Helvetica, sans-serif;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}

.player-icon {
  font-style: normal;
  font-weight: 500;
  color: white;
}

.stack-amount-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}

.coin-stack {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}

.coin {
  position: absolute;
}

.amount {
  position: relative;
}

.table {
  position: relative;
  flex-shrink: 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 270px;
  background: var(--Color, #0d9488);
}

.pot {
  border-radius: 300px;
  background: rgba(0, 0, 0, 0.2) !important;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Arial, Helvetica, sans-serif;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}

input[type="range"][orient="vertical"] {
  position: absolute;
  transform: rotate(270deg);
}

canvas {
  display: block;
  margin: auto;
  background-color: white;
}
</style>
