import { calculateCoinsHtml } from './utils.js';
import { getPlayerCardsHtml } from './utils.js';
import { getPlayerHtml } from './utils.js';

// display slider value
document.addEventListener('DOMContentLoaded', function () {
    setupEventListeners();
    setupRaiseSlider();
    // startActionTimer();
});

function setupEventListeners() {
    var checkButton = document.getElementById('checkButton');

    if (checkButton == null) {
        document.getElementById('callButton').addEventListener('click', function () {
            window.location.href = 'http://localhost:9000/call';
        });
    }
    else {
        checkButton.addEventListener('click', function () {
            window.location.href = 'http://localhost:9000/check';
        });
    }

    document.getElementById('foldButton').addEventListener('click', function () {
        window.location.href = 'http://localhost:9000/fold';
    });

    document.getElementById('raiseButton').addEventListener('click', function () {
        var amount = document.getElementById('customRange3').value
        window.location.href = 'http://localhost:9000/bet/' + amount;
    });
}

function startActionTimer() {
    let progressBar = document.querySelector('.progress-bar');
    let width = 100;
    let interval = setInterval(function () {
        if (width <= 0) {
            clearInterval(interval);
            if (document.getElementById('checkButton') !== null) {
                document.getElementById('checkButton').click();
            } else {
                document.getElementById('foldButton').click();
            }
        } else {
            width--;
            progressBar.style.width = width + '%';
        }
    }, 100);
}

function setupRaiseSlider() {
    var slider = document.getElementById('customRange3');
    var output = document.getElementById('sliderValue');

    output.innerText = "$ " + slider.value;

    slider.addEventListener('input', function () {
        output.innerText = "$ " + slider.value;
    });
}

function loadJson() {
    console.log("trying to load json");
    $.ajax({
        method: "GET",
        url: "/get",
        dataType: "json",

        success: function (json) {
            updateGame(json)
            console.log("successfully loaded json and updatedGame");
        }
    });
}

function updateGame(json) {
    updateBoard(json.board)
    updatePlayers(json.players, json.playerAtTurn)
    updatePot(json.pot)
}

$(document).ready(function () {
    console.log("Document is ready, filling Game");
    loadJson();
});

function updateBoard(board) {
    let boardDiv = $("#board");
    boardDiv.empty();

    board.forEach(function (card) {
        let color;
        switch (card.suit) {
            case "Clubs":
            case "Spades":
                color = "black-text";
                break;
            case "Hearts":
            case "Diamonds":
                color = "red-text";
                break;
        }

        let cardHtml = `<div class="card responsive-cards">
                        <div class="card-icon ${card.suit} ${color} responsive-card-suit"></div>
                        <div class="card-text ${color} responsive-card-text">${card.rank}</div>
                    </div>`;
        boardDiv.append(cardHtml);
    });
}

function updatePlayers(players, playerAtTurn) {
    players.forEach(function (player, index) {
        let playerDiv = $("#player-" + index);
        let playerCardsDiv = $("#playercards-" + index);
        let playerCoinsDiv = $("#playercoins-" + index);

        playerDiv.empty();
        playerCardsDiv.empty();
        playerCoinsDiv.empty();

        let playerHtml = getPlayerHtml(player.player.playername, player.player.balance, index, player.player.folded)
        let playerCardsHtml = getPlayerCardsHtml(index, playerAtTurn, player.player.card1rank, player.player.card2rank, player.player.card1suit, player.player.card2suit,)
        let playerCoinsHtml = calculateCoinsHtml(player.player.currentAmountBetted)

        playerDiv.html(playerHtml)
        playerCardsDiv.html(playerCardsHtml)
        playerCoinsDiv.html(playerCoinsHtml)
    });
}

function updatePot(pot) {
    let potDiv = $("#pot");
    potDiv.empty();
    potDiv.text("$ " + pot)
}
