import axios from 'axios';


var playerID = "";
var currentViewIsLobby = true;
const serverAdress = "http://localhost:9000";

//Cookie stuff
export function setCookie(name, value, days) {
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
            return c.substring(name.length + 1, c.length);
        }
    }
    return "";
}

export function generatePlayerID() {
    return "player-" + Math.random().toString(36).substr(2, 9);
}


//Get and Post Requests
export function sendActionToServer(action) {
    console.log("sendActionToServer() Called: ", action);

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
        axios.post(`${serverAdress}/${action}`, {}, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        })
            .then(response => {
                console.log(response.data);
                return response.data;
            })
            .catch(error => {
                console.error(`Fehler bei der Anfrage für action "${action}": ${error}`);
            });
    }
}

export function newGame(smallBlindValue, bigBlindValue, players) {
    console.log("newGame() Called");

    axios.post(`${serverAdress}/newGame`, {
        players: players,
        smallBlind: smallBlindValue,
        bigBlind: bigBlindValue,
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    })
        .then(response => {
            console.log(response.data);
            updateView(response.data);
            console.log("successfully rendered Game View");
        })
        .catch(error => {
            console.error("Error:", error);
        });
}


function join(playerID) {
    console.log("joining Lobby");

    axios.get(`${serverAdress}/join`, {
        headers: {
            playerID: playerID,
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    })
        .then(response => {
            console.log(response.data);
            console.log("successfully loaded lobby");
            return response.data;
        })
        .catch(error => {
            console.error("Error:", error);
        });
}
async function loadWebSocket() {
    console.log("trying to load websocket");

    await axios.get(`${serverAdress}/websocket`, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Accept': 'application/json',
        }
    })
        .then(response => {
            console.log(response.data);
            updateGame(response.data);
            console.log("successfully loaded json and updatedGame");
        })
        .catch(error => {
            console.error("Error:", error);
        });
}


function updateView(json) {
    if (json.isLobby) {
        if (!currentViewIsLobby) {
            $("body").load("/loadLobby");
            setupLobbyEventListeners();
            currentViewIsLobby = true;
        }
        return json;
    } else {
        if (currentViewIsLobby) {
            $("body").load("/loadGame");
            currentViewIsLobby = false;
            setTimeout(setupGameEventListeners, 100);
            setTimeout(setupRaiseSlider, 100);
        }
        return json;
    }
}

//update Lobby View
function updateLobby(json) {
    console.log("updateLobby() Called");
    updateLobbyPlayers(json.lobbyPlayers);
}

//update Game View
function updateGame(json) {
    console.log("updateGame() Called");

}


export async function connectWebSocket() {
    const socket = new WebSocket("ws://" + window.location.host + "/websocket");
    await loadWebSocket();

    socket.onopen = function (e) {
        console.log("[open] Connection established");
        return join(playerID);
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
        return updateView(json);
    };
}