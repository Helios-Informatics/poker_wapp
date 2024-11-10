<script setup>
import { defineProps, computed, onMounted } from "vue";
import Player from "../components/Player.vue";
import PlayerCards from "../components/PlayerCards.vue";
import Coins from "../components/Coins.vue";
import Card from "../components/Card.vue";
import { HandInfo } from "de.htwg.poker.model";

const props = defineProps({
  gameState: Object,
});

const indexedPlayers = computed(() =>
  props.gameState.getPlayers().map((player, index) => ({ ...player, index }))
);
const playerAtTurn = computed(() => props.gameState.getPlayerAtTurn());
const board = computed(() => props.gameState.getBoard());
const pot = computed(() => props.gameState.getPot());
const handInfo = computed(() =>
  HandInfo.evaluate(
    [
      props.gameState.getPlayers()[playerAtTurn.value].card1,
      props.gameState.getPlayers()[playerAtTurn.value].card2,
    ],
    props.gameState.getBoard()
  ).toUpperCase()
);

onMounted(() => {
  const slider = document.getElementById("customRange3");
  const output = document.getElementById("sliderValue");

  output.innerText = "$ " + slider.value;

  slider.addEventListener("input", function () {
    output.innerText = "$ " + slider.value;
  });

  document
    .getElementById("callCheckButton")
    .addEventListener("click", function () {
      const callCheckButton = document.getElementById("callCheckButtonText");
      if (callCheckButton.innerText === "CALL") {
        sendActionToServer("call");
      } else {
        sendActionToServer("check");
      }
    });

  document.getElementById("foldButton").addEventListener("click", function () {
    sendActionToServer("fold");
  });

  document.getElementById("raiseButton").addEventListener("click", function () {
    const amount = document.getElementById("customRange3").value;
    sendActionToServer("bet/" + amount);
  });
});
</script>
<template>
  <div class="d-flex w-100 h-100">
    <div class="d-flex flex-column justify-content-evenly container-fluid">
      <div class="container-fluid">
        <div class="d-flex align-items-center justify-space-around row">
          <div class="col text-white">your current hand: {{ handInfo }}</div>
          <div class="col d-flex justify-content-end">
            <button
              type="button"
              class="btn btn-secondary rounded-pill responsive-button d-flex align-items-center justify-content-center button"
            >
              <h5 class="responsive-button-text">LEAVE</h5>
            </button>
          </div>
        </div>
      </div>
      <div class="d-flex flex-column">
        <div class="d-flex justify-content-center align-items-center mb-2">
          <div
            v-if="indexedPlayers.length >= 1"
            class="top-left-player"
            id="player-0"
          >
            <Player
              :name="indexedPlayers[0].playername"
              :balance="indexedPlayers[0].balance"
              :folded="indexedPlayers[0].folded"
              position="top-left-player"
            />
          </div>
          <div
            v-if="indexedPlayers.length >= 2"
            class="top-right-player"
            id="player-1"
          >
            <Player
              :name="indexedPlayers[1].playername"
              :balance="indexedPlayers[1].balance"
              :folded="indexedPlayers[1].folded"
              position="top-right-player"
            />
          </div>
        </div>
        <div class="d-flex justify-content-center align-items-center">
          <div v-if="indexedPlayers.length >= 6" id="player-5">
            <Player
              :name="indexedPlayers[5].playername"
              :balance="indexedPlayers[5].balance"
              :folded="indexedPlayers[5].folded"
              position="left-player"
            />
          </div>
          <div class="d-flex justify-content-center align-items-center">
            <div class="table responsive-table">
              <div class="d-flex justify-content-around align-items-center">
                <div class="d-flex justify-content-center align-items-center">
                  <div
                    v-if="indexedPlayers.length >= 1"
                    class="bg-transparent"
                    id="playercoins-0"
                  >
                    <Coins :amount="indexedPlayers[0].currentAmountBetted" />
                  </div>
                  <div
                    v-if="indexedPlayers.length >= 1"
                    class="bg-transparent d-flex justify-content-center align-items-center"
                    id="playercards-0"
                  >
                    <PlayerCards
                      :playerIndex="0"
                      :playerAtTurn="playerAtTurn"
                      :gameState="gameState"
                    />
                  </div>
                </div>
                <div class="d-flex justify-content-center align-items-center">
                  <div
                    v-if="indexedPlayers.length >= 2"
                    class="bg-transparent"
                    id="playercoins-1"
                  >
                    <Coins :amount="indexedPlayers[1].currentAmountBetted" />
                  </div>
                  <div
                    v-if="indexedPlayers.length >= 2"
                    class="bg-transparent d-flex justify-content-center align-items-center"
                    id="playercards-1"
                  >
                    <PlayerCards
                      :playerIndex="1"
                      :playerAtTurn="playerAtTurn"
                      :gameState="gameState"
                    />
                  </div>
                </div>
              </div>
              <div
                class="d-flex justify-content-between align-items-center responsive-table-middle-row-margin-top"
              >
                <div class="d-flex justify-content-center align-items-center">
                  <div
                    v-if="indexedPlayers.length >= 6"
                    class="bg-transparent d-flex justify-content-center align-items-center"
                    id="playercards-5"
                  >
                    <PlayerCards
                      :playerIndex="5"
                      :playerAtTurn="playerAtTurn"
                      :gameState="gameState"
                    />
                  </div>
                  <div
                    v-if="indexedPlayers.length >= 6"
                    class="bg-transparent"
                    id="playercoins-5"
                  >
                    <Coins :amount="indexedPlayers[5].currentAmountBetted" />
                  </div>
                </div>
                <div
                  class="d-flex flex-column justify-content-center align-items-center"
                >
                  <div id="pot" class="pot responsive-pot">
                    {{ "$ " + pot }}
                  </div>
                  <div
                    id="board"
                    class="d-flex justify-content-center align-items-center bg-transparent"
                  >
                    <Card
                      v-for="(boardCard, index) in board"
                      :key="index"
                      :rank="boardCard.rank.toString()"
                      :suitID="boardCard.suit.id"
                    />
                  </div>
                </div>
                <div class="d-flex justify-content-center align-items-center">
                  <div
                    v-if="indexedPlayers.length >= 3"
                    class="bg-transparent"
                    id="playercoins-2"
                  >
                    <Coins :amount="indexedPlayers[2].currentAmountBetted" />
                  </div>
                  <div
                    v-if="indexedPlayers.length >= 3"
                    class="bg-transparent d-flex justify-content-center align-items-center"
                    id="playercards-2"
                  >
                    <PlayerCards
                      :playerIndex="2"
                      :playerAtTurn="playerAtTurn"
                      :gameState="gameState"
                    />
                  </div>
                </div>
              </div>
              <div
                class="d-flex justify-content-around align-items-center responsive-table-lower-row-margin-top"
              >
                <div class="d-flex justify-content-center align-items-center">
                  <div
                    v-if="indexedPlayers.length >= 5"
                    class="bg-transparent"
                    id="playercoins-4"
                  >
                    <Coins :amount="indexedPlayers[4].currentAmountBetted" />
                  </div>
                  <div
                    v-if="indexedPlayers.length >= 5"
                    class="bg-transparent d-flex justify-content-center align-items-center"
                    id="playercards-4"
                  >
                    <PlayerCards
                      :playerIndex="4"
                      :playerAtTurn="playerAtTurn"
                      :gameState="gameState"
                    />
                  </div>
                </div>
                <div class="d-flex justify-content-center align-items-center">
                  <div
                    v-if="indexedPlayers.length >= 4"
                    class="bg-transparent"
                    id="playercoins-3"
                  >
                    <Coins :amount="indexedPlayers[3].currentAmountBetted" />
                  </div>
                  <div
                    v-if="indexedPlayers.length >= 4"
                    class="bg-transparent d-flex justify-content-center align-items-center"
                    id="playercards-3"
                  >
                    <PlayerCards
                      :playerIndex="3"
                      :playerAtTurn="playerAtTurn"
                      :gameState="gameState"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="indexedPlayers.length >= 3" id="player-2">
            <Player
              :name="indexedPlayers[2].playername"
              :balance="indexedPlayers[2].balance"
              :folded="indexedPlayers[2].folded"
              position="right-player"
            />
          </div>
        </div>
        <div class="d-flex justify-content-center align-items-center mt-2">
          <div
            v-if="indexedPlayers.length >= 5"
            class="top-left-player"
            id="player-4"
          >
            <Player
              :name="indexedPlayers[4].playername"
              :balance="indexedPlayers[4].balance"
              :folded="indexedPlayers[4].folded"
              position="top-left-player"
            />
          </div>
          <div
            v-if="indexedPlayers.length >= 4"
            class="top-right-player"
            id="player-3"
          >
            <Player
              :name="indexedPlayers[3].playername"
              :balance="indexedPlayers[3].balance"
              :folded="indexedPlayers[3].folded"
              position="top-right-player"
            />
          </div>
        </div>
      </div>
      <div class="container-fluid">
        <div
          class="col d-flex justify-content-end text-white me-4 mb-4 font fs-2"
          id="sliderValue"
        >
          $0
        </div>
      </div>
      <div class="container-fluid">
        <div class="d-flex align-items-center justify-content-end row">
          <div class="col d-flex gap-3 justify-content-end me-3">
            <button
              type="button"
              id="foldButton"
              class="button btn btn-danger rounded-pill d-flex justify-content-center align-content-center responsive-button"
            >
              <h5 class="mt-1 responsive-button-text">FOLD</h5>
            </button>
            <button
              type="button"
              id="callCheckButton"
              class="button btn btn-success rounded-pill d-flex justify-content-center align-content-center responsive-button"
            >
              <h5 id="callCheckButtonText" class="mt-1 responsive-button-text">
                CALL
              </h5>
            </button>
            <button
              type="button"
              id="raiseButton"
              class="button btn btn-primary rounded-pill d-flex justify-content-center align-content-center responsive-button"
            >
              <h5 class="mt-1 responsive-button-text">RAISE</h5>
            </button>
          </div>
        </div>
      </div>
      <div
        class="d-flex flex-column justify-content-end align-items-center"
        style="width: 100px"
      >
        <input
          type="range"
          class="form-range me-5 responsive-slider-size"
          style="margin-bottom: 230px"
          orient="vertical"
          min="0"
          max="1000"
          step="10"
          id="customRange3"
        />
      </div>
    </div>
  </div>
</template>
