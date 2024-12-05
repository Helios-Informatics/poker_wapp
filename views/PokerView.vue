<script setup>
import { computed, onMounted, ref, watch } from "vue";
import Player from "../components/Player.vue";
import PlayerCards from "../components/PlayerCards.vue";
import Coins from "../components/Coins.vue";
import Card from "../components/Card.vue";
import { sendActionToServer, getCookie } from "../scripts/script.js";
import { pl } from "vuetify/locale";

const props = defineProps({
  gameState: Object,
});

const sliderValue = ref(0);
const gamestate = ref(props.gameState);
const playerOffline = ref(false);

onMounted(() => {
  window.addEventListener("offline", () => {
    playerOffline.value = true;
    console.log("Offline event detected. Showing message.");
  });

  window.addEventListener("online", () => {
    playerOffline.value = false;
    handleAction("reconnect");
    console.log("Back online. Hiding message.");
  });
});
watch(
  () => props.gameState,
  (newGameState) => {
    gamestate.value = newGameState;
    console.log("Gamestate updated:", gamestate.value, gamestate.value.board);
  },
  { immediate: true }
);

const indexedPlayers = computed(() =>
  gamestate.value.players.map((player, index) => ({ ...player, index }))
);

const playerAtTurn = computed(() => gamestate.value.playerAtTurn);
const board = computed(() => gamestate.value.board);
const pot = computed(() => gamestate.value.pot);
const highestBetSize = computed(() => gamestate.value.highestBetSize);
const currentPlayerBetSize = computed(
  () =>
    gamestate.value.players[gamestate.value.playerAtTurn]?.player
      .currentAmountBetted
);
const newRoundStarted = computed(() => gamestate.value.newRoundStarted);

const selfIsAtTurn = computed(
  () =>
    getCookie("playerID") ===
    gamestate.value.players[gamestate.value.playerAtTurn]?.player.id
);

const handInfo = computed(() => {
  console.log("handInfo called");
  for (const player of indexedPlayers.value) {
    console.log("handInfo: checking Player: ", player);
    if (getCookie("playerID") === player.player.id) {
      console.log("found own player:", player.player.id);
      console.log("handEval: ", player.player.handEval);
      return player.player.handEval;
    }
  }
  return "Error";
});

const callCheckButtonText = computed(() =>
  gamestate.value.players[gamestate.value.playerAtTurn]?.player
    .currentAmountBetted === highestBetSize.value
    ? "Check"
    : "Call"
);

function handleAction(action) {
  if (
    !(
      getCookie("playerID") ===
      indexedPlayers.value[playerAtTurn.value].player.id
    )
  ) {
    return;
  }

  try {
    if (action === "callCheck") {
      const actionType = callCheckButtonText.value.toLowerCase();
      sendActionToServer(actionType);
    } else if (action === "fold") {
      sendActionToServer("fold");
    } else if (action === "raise") {
      sendActionToServer(`bet/${sliderValue.value}`);
    } else if (action === "leave") {
      sendActionToServer("leave");
    } else if (action === "reconnect") {
      response = reconnect();
      const { isLobby, lobbyPlayers, smallBlind, bigBlind, ...gameData } =
        response;
      gamestate.value = gameData;
    }
  } catch (error) {
    console.error("Error handling action:", error);
  }
}

function handleExpiredTurn() {
  if (highestBetSize.value - currentPlayerBetSize.value > 0) {
    console.log("Folding due to expired turn");
    handleAction("fold");
  } else {
    console.log("Checking due to expired turn");
    handleAction("callCheck");
  }
}
</script>

<template>
  <div class="d-flex w-100 body" v-if="gameState !== {}">
    <div
      class="d-flex flex-column container-fluid w-100 h-100 align-center justify-space-evenly"
    >
      <!-- Current Hand Info & Leave Button -->
      <div class="container-fluid w-100">
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center justify-start">
            <div class="text-white ml-4 text-h6">Your current hand:</div>
            <div class="col ml-4 text-red text-h6">
              {{ handInfo }}
            </div>
          </div>
          <div class="col d-flex justify-end">
            <v-btn
              class="responsive-button mr-4 font-weight-bold text-none text-h6"
              color="#4b4b4b"
              rounded
              variant="flat"
              text="Leave"
              height="50"
              prepend-icon="mdi-arrow-collapse-left"
              @click="handleAction('leave')"
              :disabled="!selfIsAtTurn"
            >
            </v-btn>
          </div>
        </div>
      </div>

      <!-- Offline-message -->
      <div v-if="playerOffline" class="offline-banner">
        You are offline! Reconnecting...
      </div>

      <!-- Players and Board Layout -->
      <div class="d-flex flex-column">
        <div class="d-flex justify-center align-center mb-2">
          <div v-for="player in indexedPlayers.slice(0, 2)" :key="player.index">
            <Player
              :id="'player-' + player.index"
              :name="player.player.playername"
              :balance="player.player.balance"
              :folded="player.player.folded"
              :isAtTurn="playerAtTurn === player.index"
              :position="
                player.index === 0 ? 'top-left-player' : 'top-right-player'
              "
              :newRoundStarted="newRoundStarted"
              @turnCountdownExpired="handleExpiredTurn"
            />
          </div>
        </div>

        <div class="d-flex justify-center align-center">
          <!-- Left, Center, and Right Players and Board -->
          <div
            v-for="player in indexedPlayers.slice(3, 4)"
            :key="player.index"
            id="player-5"
          >
            <Player
              :name="player.player.playername"
              :balance="player.player.balance"
              :folded="player.player.folded"
              position="left-player"
              :isAtTurn="playerAtTurn === player.index"
              :newRoundStarted="newRoundStarted"
              @turnCountdownExpired="handleExpiredTurn"
            />
          </div>

          <div class="d-flex justify-center align-center">
            <div class="table responsive-table">
              <div class="d-flex justify-space-around align-center">
                <div
                  v-for="player in indexedPlayers.slice(0, 2)"
                  :key="'coins-' + player.index"
                  class="d-flex justify-center align-center"
                >
                  <Coins :amount="player.player.currentAmountBetted" />
                  <PlayerCards
                    :showCards="player.player.id === getCookie('playerID')"
                    :playerIndex="player.index"
                    :folded="player.player.folded"
                    :playerAtTurn="false"
                    :gameState="gameState"
                  />
                </div>
              </div>
              <div class="d-flex justify-space-between align-center mt-6">
                <!-- Left Player (if present) -->
                <div
                  v-if="indexedPlayers[5]"
                  class="d-flex justify-center align-center"
                >
                  <Coins
                    :amount="indexedPlayers[5].player.currentAmountBetted"
                  />
                  <PlayerCards
                    :showCards="
                      indexedPlayers[5].player.id === getCookie('playerID')
                    "
                    :playerIndex="indexedPlayers[5].index"
                    :playerAtTurn="playerAtTurn"
                    :folded="indexedPlayers[5].player.folded"
                    :gameState="gameState"
                  />
                </div>

                <!-- Pot and Board Cards -->
                <div
                  class="d-flex flex-column justify-center align-center mx-auto"
                >
                  <div id="pot" class="pot responsive-pot">
                    {{ "$ " + pot }}
                  </div>
                  <div
                    id="board"
                    class="d-flex justify-center align-center bg-transparent"
                  >
                    <Card
                      v-for="(boardCard, index) in board"
                      :key="index"
                      :rank="boardCard.card.rank.toString()"
                      :suitID="boardCard.card.suit"
                    />
                  </div>
                </div>

                <!-- Right Player (if present) -->
                <div
                  v-if="indexedPlayers[2]"
                  class="d-flex justify-center align-center"
                >
                  <Coins
                    :amount="indexedPlayers[2].player.currentAmountBetted"
                  />
                  <PlayerCards
                    :showCards="
                      indexedPlayers[2].player.id === getCookie('playerID')
                    "
                    :playerIndex="indexedPlayers[2].index"
                    :playerAtTurn="playerAtTurn"
                    :folded="indexedPlayers[2].player.folded"
                    :gameState="gameState"
                  />
                </div>
              </div>

              <div class="d-flex justify-space-around align-end">
                <div
                  v-for="player in indexedPlayers.slice(4, 6)"
                  :key="'coins-' + player.index"
                  class="d-flex justify-center align-center"
                >
                  <Coins :amount="player.player.currentAmountBetted" />
                  <PlayerCards
                    :showCards="player.player.id === getCookie('playerID')"
                    :playerIndex="player.index"
                    :playerAtTurn="playerAtTurn"
                    :folded="player.player.folded"
                    :gameState="gameState"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Right Player -->
          <div v-if="indexedPlayers.length >= 3" id="player-2">
            <Player
              :name="indexedPlayers[2].player.playername"
              :balance="indexedPlayers[2].player.balance"
              :folded="indexedPlayers[2].player.folded"
              position="right-player"
              :isAtTurn="playerAtTurn === indexedPlayers[2].index"
              :newRoundStarted="newRoundStarted"
              @turnCountdownExpired="handleExpiredTurn"
            />
          </div>
        </div>
        <!-- Bottom Players -->

        <div class="d-flex justify-center align-center mb-2">
          <div v-for="player in indexedPlayers.slice(4, 6)" :key="player.index">
            <Player
              :id="'player-' + player.index"
              :name="player.player.playername"
              :balance="player.player.balance"
              :folded="player.player.folded"
              :isAtTurn="playerAtTurn === player.index"
              :position="
                player.index === 4 ? 'top-left-player' : 'top-right-player'
              "
              :newRoundStarted="newRoundStarted"
              @turnCountdownExpired="handleExpiredTurn"
            />
          </div>
        </div>
      </div>
      <!-- Action Buttons -->
      <div class="container-fluid w-100">
        <div class="d-flex align-center justify-end row">
          <div class="col d-flex gap-3 align-end">
            <v-btn
              class="responsive-button mr-4 font-weight-bold text-none text-h6"
              color="#af4d4d"
              rounded
              variant="flat"
              text="Fold"
              height="50"
              prepend-icon="mdi-close"
              @click="handleAction('fold')"
              :disabled="!selfIsAtTurn"
            >
            </v-btn>
            <v-btn
              class="responsive-button mr-4 font-weight-bold text-none text-h6"
              color="#3da466"
              rounded
              variant="flat"
              :text="callCheckButtonText"
              height="50"
              prepend-icon="mdi-check"
              @click="handleAction('callCheck')"
              :disabled="!selfIsAtTurn"
            >
            </v-btn>
            <div class="d-flex flex-column">
              <div
                class="col d-flex justify-end text-white mr-4 mb-4 font text-h4"
                id="sliderValue"
              >
                ${{ sliderValue }}
              </div>
              <v-btn
                class="responsive-button font-weight-bold text-none text-h6"
                color="#3a62c9"
                rounded
                variant="flat"
                text="Raise"
                height="50"
                prepend-icon="mdi-arrow-up-thin"
                @click="handleAction('raise')"
                :disabled="!selfIsAtTurn"
              >
              </v-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="d-flex flex-row justify-center align-end mb-4"
      style="width: 100px"
    >
      <v-slider
        class="mr-5 responsive-slider-size mb-8"
        v-model="sliderValue"
        min="0"
        max="1000"
        step="10"
        color="#3a62c9"
        direction="vertical"
      />
    </div>
  </div>
</template>

<style scoped>
.offline-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: transparent;
  color: #f44336;
  text-align: center;
  padding: 10px;
  z-index: 1000;
}
</style>
