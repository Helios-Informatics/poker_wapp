import { calculateCoinsHtml } from './utils.js';
import { getPlayerCardsHtml } from './utils.js';
import { getPlayerHtml } from './utils.js';

$(document).ready(function () {
    console.log("Document is ready, filling Game");
    setupRaiseSlider();
    setupEventListeners();

    loadJson();
});

function setupEventListeners() {
    var callCheckButton = document.getElementById('callCheckButton');

    callCheckButton.addEventListener('click', function () {
        console.log(callCheckButton.innerText)
        if (callCheckButton.innerText == "CALL") {
            sendActionToServer("call")
        } else {
            sendActionToServer("check")
        }
    });

    document.getElementById('foldButton').addEventListener('click', function () {
        sendActionToServer("fold")
    });

    document.getElementById('raiseButton').addEventListener('click', function () {
        var amount = document.getElementById('customRange3').value
        sendActionToServer("bet/" + amount);
    });
}

function setupRaiseSlider() {
    var slider = document.getElementById('customRange3');
    var output = document.getElementById('sliderValue');

    output.innerText = "$ " + slider.value;

    slider.addEventListener('input', function () {
        output.innerText = "$ " + slider.value;
    });
}

function sendActionToServer(action) {
    console.log('sendActionToServer() Called')
    if (!(action == "call" || action == "check" || action == "fold" || action == "restartGame" || action == "allIn" || action.startsWith("bet"))) {
        console.error(`action ${action} not supported`)
    } else {
        $.ajax({
            type: "POST",
            url: "/" + action,
            contentType: 'application/json',
            accept: "application/json",
            success: function (json) {
                console.log(json)
                updateGame(json)
                console.log("successfully loaded json and updatedGame");
            },
            error: function (_jqXHR, _textStatus, errorThrown) {
                console.error(`Fehler bei der Anfrage für action "${action}":`, errorThrown);
            },
        });
    }
}

function loadJson() {
    console.log("trying to load json");
    $.ajax({
        method: "GET",
        url: "/get",
        dataType: "json",

        success: function (json) {
            console.log(json)
            updateGame(json)
            console.log("successfully loaded json and updatedGame");
        }
    });
}

function updateGame(json) {
    updateBoard(json.board)
    updatePlayers(json.players, json.playerAtTurn)
    updatePot(json.pot)
    updateButtons(json.highestBetSize, json.players, json.playerAtTurn)
}

function updateButtons(highestBetSize, players, playerAtTurn) {
    let callCheckButtonText = $("#callCheckButtonText");


    if (players[playerAtTurn].player.currentAmountBetted == highestBetSize) {
        callCheckButtonText.text("CHECK")
    } else {
        callCheckButtonText.text("CALL")
    }
}

function updateBoard(board) {
    let boardDiv = $("#board");
    boardDiv.empty();
    let color;
    let suit;

    board.forEach(function (card) {
        switch (card.card.suit) {
            case 1:
                color = "black-text";
                suit = "bi-suit-club-fill";
            case 2:
                color = "black-text";
                suit = "bi-suit-spade-fill";
                break;
            case 4:
                color = "red-text";
                suit = "bi-suit-heart-fill";
            case 3:
                color = "red-text";
                suit = "bi-suit-diamond-fill";
                break;
        }

        console.log("COLOR:" + color)

        let cardHtml = `<div class="card responsive-cards">
                        <div class="card-icon ${suit} ${color} responsive-card-suit"></div>
                        <div class="card-text ${color} responsive-card-text">${card.card.rank}</div>
                    </div> `;
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
    console.log("POT: ")
    console.log(pot)
    let potDiv = $("#pot");
    potDiv.empty();
    potDiv.text("$ " + pot)
}
