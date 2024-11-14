<script setup>
import { defineProps, computed, ref,watch } from "vue";
import Player from "../components/Player.vue";
import PlayerCards from "../components/PlayerCards.vue";
import Coins from "../components/Coins.vue";
import Card from "../components/Card.vue";
import { sendActionToServer } from "../scripts/script.js";

const props = defineProps(
  {
    gameState: Object,
  }
);

const gamestate = ref(props.gameState);
console.log("Gamestate updated:", gamestate.value);

watch(() => props.gameState, (newGameState) => {
  gamestate.value = newGameState;
  console.log("Gamestate updated:", gamestate.value);
});

const indexedPlayers = computed(() =>
  props.gameState.players.map((player, index) => ({ ...player, index }))
);
const playerAtTurn = computed(() => props.gameState.playerAtTurn);
const board = computed(() => props.gameState.board);
const pot = computed(() => props.gameState.pot);
const highestBetSize = computed(() => props.gameState.highestBetSize);

const sliderValue = ref(0);
function updateSliderValue(event) {
  sliderValue.value = event.target.value;
}
function handleAction(action) {
  try {
    let response;
    if (action === "callCheck") {
      const actionType =
        document.getElementById("callCheckButtonText").innerText === "CALL"
          ? "call"
          : "check";
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
  <div class="d-flex w-100 h-100" v-if="gameState !== {}">
    <div class="d-flex flex-column justify-evenly container-fluid">
      <!-- Current Hand Info & Leave Button -->
      <div class="container-fluid">
        <div class="d-flex align-items-center justify-space-around row">
          <div class="col text-white">Your current hand: {{ "handInfo" }}</div>
          <div class="col d-flex justify-end">
            <button
              type="button"
              class="btn btn-secondary rounded-pill responsive-button d-flex align-items-center justify-center button"
            >
              <h5 class="responsive-button-text">LEAVE</h5>
            </button>
          </div>
        </div>
      </div>

      <!-- Players and Board Layout -->
      <div class="d-flex flex-column">
        <div
          class="d-flex justify-center align-items-center mb-2"
          v-for="player in indexedPlayers.slice(0, 2)"
          :key="player.index"
        >
          <div
            :class="player.index === 0 ? 'top-left-player' : 'top-right-player'"
            :id="'player-' + player.index"
          >
            <Player
              :name="player.playername"
              :balance="player.balance"
              :folded="player.folded"
              :position="
                player.index === 0 ? 'top-left-player' : 'top-right-player'
              "
            />
          </div>
        </div>

        <div class="d-flex justify-center align-items-center">
          <!-- Left, Center, and Right Players and Board -->
          <div
            v-for="player in indexedPlayers.slice(5, 6)"
            :key="player.index"
            id="player-5"
          >
            <Player
              :name="player.playername"
              :balance="player.balance"
              :folded="player.folded"
              position="left-player"
            />
          </div>

          <div class="d-flex justify-center align-items-center">
            <div class="table responsive-table">
              <div class="d-flex justify-around align-items-center">
                <div
                  v-for="player in indexedPlayers.slice(0, 2)"
                  :key="'coins-' + player.index"
                  class="d-flex justify-center align-items-center"
                >
                  <Coins :amount="player.currentAmountBetted" />
                  <PlayerCards
                    :playerIndex="player.index"
                    :playerAtTurn="playerAtTurn"
                    :gameState="gameState"
                  />
                </div>
              </div>

              <!-- Pot and Board Cards -->
              <div
                class="d-flex justify-between align-items-center responsive-table-middle-row-margin-top"
              >
                <div
                  class="d-flex flex-column justify-center align-items-center"
                >
                  <div id="pot" class="pot responsive-pot">
                    {{ "$ " + pot }}
                  </div>
                  <div
                    id="board"
                    class="d-flex justify-center align-items-center bg-transparent"
                  >
                    <Card
                      v-for="(boardCard, index) in board"
                      :key="index"
                      :rank="boardCard.rank.toString()"
                      :suitID="boardCard.suit.id"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Player -->
          <div v-if="indexedPlayers.length >= 3" id="player-2">
            <Player
              :name="indexedPlayers[2].playername"
              :balance="indexedPlayers[2].balance"
              :folded="indexedPlayers[2].folded"
              position="right-player"
            />
          </div>
        </div>

        <!-- Bottom Players -->
        <div
          class="d-flex justify-center align-items-center mt-2"
          v-for="player in indexedPlayers.slice(4, 6)"
          :key="player.index"
        >
          <div
            :class="player.index === 4 ? 'top-left-player' : 'top-right-player'"
            :id="'player-' + player.index"
          >
            <Player
              :name="player.playername"
              :balance="player.balance"
              :folded="player.folded"
              :position="
                player.index === 4 ? 'top-left-player' : 'top-right-player'
              "
            />
          </div>
        </div>
      </div>

      <!-- Slider Value Display -->
      <div class="container-fluid">
        <div
          class="col d-flex justify-end text-white mr-4 mb-4 font fs-2"
          id="sliderValue"
        >
          ${{ sliderValue }}
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="container-fluid">
        <div class="d-flex align-items-center justify-end row">
          <div class="col d-flex gap-3 justify-end mr-3">
            <button
              type="button"
              class="button btn btn-danger rounded-pill responsive-button"
              @click="handleAction('fold')"
            >
              <h5 class="mt-1 responsive-button-text">FOLD</h5>
            </button>
            <button
              type="button"
              class="button btn btn-success rounded-pill responsive-button"
              @click="handleAction('callCheck')"
            >
              <h5 id="callCheckButtonText" class="mt-1 responsive-button-text">
                CALL
              </h5>
            </button>
            <button
              type="button"
              class="button btn btn-primary rounded-pill responsive-button"
              @click="handleAction('raise')"
            >
              <h5 class="mt-1 responsive-button-text">RAISE</h5>
            </button>
          </div>
        </div>
      </div>

      <!-- Range Slider -->
      <div
        class="d-flex flex-column justify-end align-items-center"
        style="width: 100px"
      >
        <input
          type="range"
          class="form-range mr-5 responsive-slider-size"
          style="margin-bottom: 230px"
          orient="vertical"
          min="0"
          max="1000"
          step="10"
          v-model="sliderValue"
        />
      </div>
    </div>
  </div>
</template>
