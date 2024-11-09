<script setup>
  import { ref } from 'vue';
  
  const players = ref(['Julian']);
  const bigBlind = ref('');
  const smallBlind = ref('');
  
  function copyLobbyLink() {
    const lobbyUrl = window.location.origin;
    navigator.clipboard.writeText(lobbyUrl)
      .then(() => {
        console.log('Lobby link copied to clipboard:', lobbyUrl);
        alert('Invite link copied to clipboard!');
      })
      .catch(err => {
        console.error('Error copying lobby link:', err);
      });
  }
  
  function newGame() {
    const playersList = players.value;
    const smallBlindValue = smallBlind.value;
    const bigBlindValue = bigBlind.value;
  
    fetch('/newGame', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        players: playersList,
        smallBlind: smallBlindValue,
        bigBlind: bigBlindValue,
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      updateGame(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }
  
  function updateGame(json) {
    console.log('Game updated:', json);
  }
  </script>
<template>
    <div class="h-90 w-100 d-flex flex-row px-4 mt-5">
      <div class="h-100 w-50 d-flex flex-column align-content-center">
        <div class="d-flex flex-row">
          <h2 class="text-white mb-5">Players</h2>
          <h2 class="text-white ms-3"> (1/6)</h2>
        </div>
        <div>
          <div v-for="player in players" :key="player">
            <span>{{ player }}</span>
          </div>
        </div>
      </div>
      <div class="h-100 w-50 d-flex flex-column align-content-center">
        <h2 class="text-white mb-5">Settings</h2>
        <div class="form-group w-50">
          <label for="bigBlind" class="form-label text-white">Big Blind</label>
          <input v-model="bigBlind" type="number" class="form-control" placeholder="Enter big blind amount">
        </div>
        <div class="form-group mt-3 w-50">
          <label for="smallBlind" class="form-label text-white">Small Blind</label>
          <input v-model="smallBlind" type="number" class="form-control" placeholder="Enter small blind amount">
        </div>
      </div>
    </div>
    <div class="fixed-bottom w-100 h-10 d-flex flex-row justify-content-end align-items-end mb-5 pe-5">
      <button type="button" class="btn btn-primary me-2" @click="copyLobbyLink">Copy Invite Link</button>
      <button type="button" class="btn btn-success" @click="newGame">Start Game</button>
    </div>
  </template>
  

  