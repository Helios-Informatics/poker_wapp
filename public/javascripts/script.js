import { calculateCoinsHtml } from "./utils.js";
import { getPlayerCardsHtml } from "./utils.js";
import { getPlayerHtml } from "./utils.js";
import { getLobbyPlayerHtml } from "./utils.js";

var playerID = "";
var currentViewIsLobby = true;

// display slider value
document.addEventListener('DOMContentLoaded', function () {
    connectWebSocket();
    setupLobbyEventListeners();

  playerID = getCookie("playerID");
  if (!playerID) {
    playerID = generatePlayerID();
    setCookie("playerID", playerID, 1);
  }
  console.log("PlayerID:", playerID);

});

function setupLobbyEventListeners() {
    document.getElementById('startButton').addEventListener('click', function () {
        newGame();
    });

    document.getElementById('copyLinkButton').addEventListener('click', function () {
        const lobbyUrl = window.location.origin;
        navigator.clipboard.writeText(lobbyUrl)
            .then(() => {
                console.log('Lobby link copied to clipboard:', lobbyUrl);
                alert('Invite link copied to clipboard!');
            })
            .catch(err => {
                console.error('Error copying lobby link:', err);
            });
    });
}
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

    document.getElementById('leaveButton').addEventListener('click', function () {
        sendActionToServer("leave");
    });
}

function setupRaiseSlider() {
    var slider = document.getElementById("customRange3");
    var output = document.getElementById("sliderValue");

    output.innerText = "$ " + slider.value;

    slider.addEventListener("input", function () {
        output.innerText = "$ " + slider.value;
    });
}

//Cookie stuff
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

export function getCookie(name) {
  console.log("getCookie() Called");
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookies = decodedCookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    let c = cookies[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name + "=") == 0) {
        console.log("Cookie found: ", c);
        return c.substring(name.length + 1, c.length);
    }
}
    console.log("Cookie not found");
    return "";
}

function generatePlayerID() {
    return "player-" + Math.random().toString(36).substr(2, 9);
}


//Get and Post Requests
function sendActionToServer(action) {
    console.log("sendActionToServer() Called: ", action);
    if (
        !(
            action == "call" ||
            action == "check" ||
            action == "fold" ||
            action == "restartGame" ||
            action == "allIn" ||
            action == "leave" ||
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

function newGame() {
    console.log("newGame() Called");

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
            console.log("successfully rendered Game View");
        },
        error: function (error) {
            console.error("Error:", error);
        },
    });
}


function join(playerID) {
  console.log("joining Lobby");
  $.ajax({
    method: "GET",
    url: "/join",
    headers: {
      playerID: playerID,
    },
    dataType: "json",

    success: function (json) {
      console.log(json);
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
            console.log("successfully loaded json and updatedGame");
        }
    });
}


function updateView(json) {
    console.log("updateView() Called", json);
    if (json.isLobby) {
        if (!currentViewIsLobby) {
            $("body").load("/loadLobby", function() {
                setupLobbyEventListeners();
                currentViewIsLobby = true;
                updateLobby(json);
            });
        } else {
            updateLobby(json);
        }
    } else {
        if(currentViewIsLobby) {
            console.log("loading Game View");
            $("body").load("/loadGame", function() {
                currentViewIsLobby = false;
                setupGameEventListeners();
                setupRaiseSlider();
                updateGame(json);
            });
        } else {
            updateGame(json);
        }

    }
}

//update Lobby View
function updateLobby(json) {
    console.log("updateLobby() Called");
    updateLobbyPlayers(json.lobbyPlayers);
}

function updateLobbyPlayers(players) {
    let playersDiv = $("#players");
    let playersAmountDiv = $("#playersAmount");

    if (!playersDiv.length || !playersAmountDiv.length) {
        return;
    }

    playersDiv.empty();

    for (const [playerName, _] of Object.entries(players)) {
        let playerHtml = getLobbyPlayerHtml(playerName);
        playersDiv.append(playerHtml);
      }

    playersAmountDiv.text("(" + Object.keys(players).length +"/6)");
}

//update Game View
function updateGame(json) {
    console.log("updateGame", json);
    updateBoard(json.board);
    updatePlayers(json.players, json.playerAtTurn);
    updatePot(json.pot);
    updateButtons(json.highestBetSize, json.players, json.playerAtTurn);
}

function updateButtons(highestBetSize, players, playerAtTurn) {
    let callCheckButtonText = $("#callCheckButtonText");
    let callCheckButton = $("#callCheckButton");
    let foldButton = $("#foldButton");
    let raiseButton = $("#raiseButton");

    if (!callCheckButtonText || !callCheckButton || !foldButton || !raiseButton) {
        return;
    }

    console.log("update Buttons")
    console.log("own cookie: ", getCookie("playerID"));
    console.log("player at turn: ", players[playerAtTurn].player.id);

    let selfIsAtTurn = getCookie("playerID") == players[playerAtTurn].player.id;

    if (!selfIsAtTurn) {
        callCheckButton.prop("disabled", true).addClass("disabled-button");
        foldButton.prop("disabled", true).addClass("disabled-button");
        raiseButton.prop("disabled", true).addClass("disabled-button");
    } else {
        callCheckButton.prop("disabled", false).removeClass("disabled-button");
        foldButton.prop("disabled", false).removeClass("disabled-button");
        raiseButton.prop("disabled", false).removeClass("disabled-button");
    }

    if (players[playerAtTurn].player.currentAmountBetted == highestBetSize) {
        callCheckButtonText.text("CHECK");
    } else {
        callCheckButtonText.text("CALL");
    }
}

function updateBoard(board) {
    console.log("updateBoard called:", board)
    let boardDiv = $("#board");

    boardDiv.empty();

    let color;
    let suit;

    board.forEach(function (card) {
        switch (card.card.suit) {
            case 1:
                color = "black-text";
                suit = "bi-suit-club-fill";
                break;
            case 2:
                color = "black-text";
                suit = "bi-suit-spade-fill";
                break;
            case 4:
                color = "red-text";
                suit = "bi-suit-heart-fill";
                break;
            case 3:
                color = "red-text";
                suit = "bi-suit-diamond-fill";
                break;
        }

        let cardHtml = `<div class="card responsive-cards">
                        <div class="card-icon ${suit} ${color} responsive-card-suit"></div>
                        <div class="card-text ${color} responsive-card-text">${card.card.rank}</div>
                    </div> `;
        boardDiv.append(cardHtml);
    });
}

function updatePlayers(players, playerAtTurn) {
    console.log("updatePlayers() Called", players, playerAtTurn);
    console.log("updatePlayers() Called with playerAtTurn: ", playerAtTurn);
    
    players.forEach(function (player, index) {

        let playerDiv = $("#player-" + index);
        let playerCardsDiv = $("#playercards-" + index);
        let playerCoinsDiv = $("#playercoins-" + index);

        if (!playerDiv || !playerCardsDiv || !playerCoinsDiv) {
            return;
        }

        playerDiv.empty();
        playerCardsDiv.empty();
        playerCoinsDiv.empty();

        let atTurn = index == playerAtTurn;

        let playerHtml = getPlayerHtml(
            player.player.playername,
            player.player.balance,
            atTurn,
            player.player.folded
        );
        let playerCardsHtml = getPlayerCardsHtml(
            player.player.id,
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
    let potDiv = $("#pot");

    if (!potDiv || !pot) {
        return;
    }

    potDiv.empty();
    potDiv.text("$ " + pot);
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

function connectWebSocket() {
    const socket = new WebSocket("ws://" + window.location.host + "/websocket");
    loadWebSocket();

    socket.onopen = function (e) {
        console.log("[open] Connection established");
        join(playerID);
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
        console.log(`[message] Data received from server: ${event.data}`);
        var json = JSON.parse(event.data);
            updateView(json);
        };
}
