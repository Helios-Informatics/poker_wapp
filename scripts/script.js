import { calculateCoinsHtml } from "./utils.js";
import { getPlayerCardsHtml } from "./utils.js";
import { getPlayerHtml } from "./utils.js";

// display slider value
document.addEventListener('DOMContentLoaded', function () {
    connectWebSocket();
    loadGame();
    setupLobbyEventListeners();

    let playerID = getCookie("playerID");
    if (!playerID) {
        playerID = generatePlayerID();
        setCookie("playerID", playerID, 1);
    }
    console.log("PlayerID:", playerID);

    join(playerID);
});

function setupGameEventListeners() {
    document.getElementById('callCheckButton').addEventListener('click', function () {
        console.log(callCheckButton.innerText);
        if (callCheckButton.innerText === "CALL") {
            sendActionToServer("call");
        } else {
            sendActionToServer("check");
        }
    });

    document.getElementById('foldButton').addEventListener('click', function () {
        sendActionToServer("fold");
    });

    document.getElementById('raiseButton').addEventListener('click', function () {
        const amount = document.getElementById('customRange3').value;
        sendActionToServer("bet/" + amount);
    });
}
//Cookie stuff
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    console.log("getCookie() Called");
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
        let c = cookies[i];
        while (c.charAt(0) == " ") {
            c = c.substring(1);
        }
        return "";
    }
}

function generatePlayerID() {
    return "player-" + Math.random().toString(36).substr(2, 9);
}


function setupRaiseSlider() {
    var slider = document.getElementById("customRange3");
    var output = document.getElementById("sliderValue");

    output.innerText = "$ " + slider.value;

    slider.addEventListener("input", function () {
        output.innerText = "$ " + slider.value;
    });
}

function sendActionToServer(action) {
    console.log("sendActionToServer() Called");
    if (
        !(
            action == "call" ||
            action == "check" ||
            action == "fold" ||
            action == "restartGame" ||
            action == "allIn" ||
            action.startsWith("bet")
        )
    ) {
        console.error(`action ${action} not supported`);
    } else {
        $.ajax({
            type: "POST",
            url: "/" + action,
            contentType: "application/json",
            accept: "application/json",
            success: function (json) {
                console.log(json);
                updateGame(json);
                console.log("successfully loaded json and updatedGame");
            },
            error: function (_jqXHR, _textStatus, errorThrown) {
                console.error(
                    `Fehler bei der Anfrage für action "${action}":`,
                    errorThrown
                );
            },
        });
    }
}

export function newGame() {
    const bigBlindValue = $("#bigBlind").val();
    const smallBlindValue = $("#smallBlind").val();
    const players = getPlayerNames();

    $.ajax({
        type: "POST",
        url: "/newGame",
        data: JSON.stringify({
            players: players,
            smallBlind: smallBlindValue,
            bigBlind: bigBlindValue,
        }),
        contentType: "application/json",
        dataType: "json",
        success: function (json) {
            console.log(json);
            updateGame(json);
            console.log("successfully loaded json and updatedGame");
        },
        error: function (error) {
            console.error("Error:", error);
        },
    });
}

function getPlayerNames() {
    let playerNames = [];

    $(".player-name").each(function () {
        const name = $(this).val();
        playerNames.push(name);
    });

    console.log(playerNames);
    return playerNames;
}

function loadGame() {
    console.log("trying to load json");
    $.ajax({
        method: "GET",
        url: "/get",
        dataType: "json",

        success: function (json) {
            console.log(json)
            updateGame(json)
            console.log("successfully loaded json and updatedGame");
            setupGameEventListeners();
            setupRaiseSlider();
        }
    });
}

function join(playerID) {
    console.log("loading Lobby");
    $.ajax({
        method: "GET",
        url: "/join",
        headers: {
            playerID: playerID,
        },
        dataType: "json",

        success: function (json) {
            console.log(json);
            updateLobby(json);
            console.log("successfully loaded lobby");
        },
    });
}

function loadWebSocket() {
    console.log("trying to load websocket");
    $.ajax({
        method: "GET",
        url: "/websocket",
        dataType: "json",

        success: function (json) {
            console.log(json)
            updateGame(json)
            console.log("successfully loaded json and updatedGame");
        }
    });
}


//update Lobby View
function updateLobby(json) {

}

//update Game View
function updateGame(json) {
    updateBoard(json.board);
    updatePlayers(json.players, json.playerAtTurn);
    updatePot(json.pot);
    updateButtons(json.highestBetSize, json.players, json.playerAtTurn);
}

function updateButtons(highestBetSize, players, playerAtTurn) {
    let callCheckButtonText = $("#callCheckButtonText");

    if (players[playerAtTurn].player.currentAmountBetted == highestBetSize) {
        callCheckButtonText.text("CHECK");
    } else {
        callCheckButtonText.text("CALL");
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

        console.log("COLOR:" + color);

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

        let playerHtml = getPlayerHtml(
            player.player.playername,
            player.player.balance,
            index,
            player.player.folded
        );
        let playerCardsHtml = getPlayerCardsHtml(
            index,
            playerAtTurn,
            player.player.card1rank,
            player.player.card2rank,
            player.player.card1suit,
            player.player.card2suit
        );
        let playerCoinsHtml = calculateCoinsHtml(player.player.currentAmountBetted);

        playerDiv.html(playerHtml);
        playerCardsDiv.html(playerCardsHtml);
        playerCoinsDiv.html(playerCoinsHtml);
    });
}

function updatePot(pot) {
    console.log("POT: ");
    console.log(pot);
    let potDiv = $("#pot");
    potDiv.empty();
    potDiv.text("$ " + pot);
}

function connectWebSocket() {
    const socket = new WebSocket("ws://" + window.location.host + "/websocket");
    loadWebSocket();

    socket.onopen = function (e) {
        console.log("[open] Connection established");
    };
    socket.onclose = function (event) {
        if (event.wasClean) {
            console.log(
                `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`
            );
        } else {
            console.log("[close] Connection died");
        }
    };
    socket.onerror = function (error) {
        console.log(`[error] ${error.message}`);
    };

    socket.onmessage = function (event) {
        var json = JSON.parse(event.data);
        updateGame(json);
    };
}
