<script setup>
import { computed, ref, watch } from "vue";
import Player from "../components/Player.vue";
import PlayerCards from "../components/PlayerCards.vue";
import Coins from "../components/Coins.vue";
import Card from "../components/Card.vue";
import { sendActionToServer, getCookie } from "../scripts/script.js";

const props = defineProps({
  gameState: Object,
});

const sliderValue = ref(0);
const gamestate = ref(props.gameState);

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

const selfIsAtTurn = computed(
  () =>
    getCookie("playerID") ===
    gamestate.value.players[gamestate.value.playerAtTurn]?.player.id
);

const callCheckButtonText = computed(() =>
  gamestate.value.players[gamestate.value.playerAtTurn]?.player
    .currentAmountBetted === highestBetSize.value
    ? "CHECK"
    : "CALL"
);

function handleAction(action) {
  try {
    let response;
    if (action === "callCheck") {
      const actionType = callCheckButtonText.value.toLowerCase();
      response = sendActionToServer(actionType);
    } else if (action === "fold") {
      response = sendActionToServer("fold");
    } else if (action === "raise") {
      response = sendActionToServer(`bet/${sliderValue.value}`);
    }
    gamestate.value = response;
  } catch (error) {
    console.error("Error handling action:", error);
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
          <div class="col text-white">Your current hand: {{ "handInfo" }}</div>
          <div class="col d-flex justify-end">
            <v-btn
              class="responsive-button d-flex align-center justify-center"
              color="secondary"
              rounded
            >
              <h5 class="responsive-button-text">LEAVE</h5>
            </v-btn>
          </div>
        </div>
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
              :position="
                player.index === 0 ? 'top-left-player' : 'top-right-player'
              "
            />
          </div>
        </div>

        <div class="d-flex justify-center align-center">
          <!-- Left, Center, and Right Players and Board -->
          <div
            v-for="player in indexedPlayers.slice(5, 6)"
            :key="player.index"
            id="player-5"
          >
            <Player
              :name="player.player.playername"
              :balance="player.player.balance"
              :folded="player.player.folded"
              position="left-player"
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
                    :playerAtTurn="playerAtTurn"
                    :gameState="gameState"
                  />
                </div>
              </div>

              <!-- Pot and Board Cards -->
              <div
                class="d-flex justify-center align-center responsive-table-middle-row-margin-top"
              >
                <div class="d-flex flex-column justify-center align-center">
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
            />
          </div>
        </div>

        <!-- Bottom Players -->
        <div
          class="d-flex justify-center align-center mt-2"
          v-for="player in indexedPlayers.slice(4, 6)"
          :key="player.index"
        >
          <div
            :class="
              player.index === 4 ? 'bottom-left-player' : 'bottom-right-player'
            "
            :id="'player-' + player.index"
          >
            <Player
              :name="player.player.playername"
              :balance="player.player.balance"
              :folded="player.player.folded"
              :position="
                player.index === 4
                  ? 'bottom-left-player'
                  : 'bottom-right-player'
              "
            />
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="container-fluid w-100 mt-16">
          <div class="d-flex align-center justify-end row">
            <div class="col d-flex gap-3 align-end mr-3">
              <v-btn
                class="btn btn-danger rounded-pill responsive-button"
                color="error"
                @click="handleAction('fold')"
                :disabled="!selfIsAtTurn"
              >
                <h5 class="mt-1 responsive-button-text">FOLD</h5>
              </v-btn>

              <v-btn
                class="btn btn-success rounded-pill responsive-button"
                color="success"
                @click="handleAction('callCheck')"
                :disabled="!selfIsAtTurn"
              >
                <h5 class="mt-1 responsive-button-text">
                  {{ callCheckButtonText }}
                </h5>
              </v-btn>

              <v-btn
                class="btn btn-primary rounded-pill responsive-button"
                color="primary"
                @click="handleAction('raise')"
                :disabled="!selfIsAtTurn"
              >
                <h5 class="mt-1 responsive-button-text">RAISE</h5>
              </v-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="d-flex flex-row justify-center align-end"
      style="width: 100px; margin-bottom: 100px"
    >
      <v-slider
        class="mr-5 responsive-slider-size"
        v-model="sliderValue"
        min="0"
        max="1000"
        step="10"
        color="primary"
        direction="vertical"
      />
      <div>
        <div
          class="col d-flex justify-end text-white mr-4 mb-4 font"
          id="sliderValue"
        >
          ${{ sliderValue }}
        </div>
      </div>
    </div>
  </div>
</template>
