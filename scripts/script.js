import axios from 'axios';
import { pl } from 'vuetify/locale';


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
            console.log("Cookie found: ", c);
            return c.substring(name.length + 1, c.length);
        }
    }
    console.log("Cookie not found");
    return "";
}

export function generatePlayerID() {
    console.log("generatePlayerID() Called");
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
            action == "leave" ||
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
    console.log("joining Lobby", playerID);

    return axios.get(`${serverAdress}/join`, {
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

function updateView(json) {
    if (json.isLobby) {
        if (!currentViewIsLobby) {

            currentViewIsLobby = true;
        }
        return json;
    } else {
        if (currentViewIsLobby) {

            currentViewIsLobby = false;
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


export async function connectWebSocket(newPlayerID, onUpdate) {
    playerID = newPlayerID;
    console.log("connectWebSocket() Called", newPlayerID);

    return new Promise((resolve, reject) => {
        const socket = new WebSocket("ws://" + window.location.host + "/websocket");

        socket.onopen = function (e) {
            console.log("[open] Connection established");
            join(playerID)
                .then(response => {
                    resolve(response); // Resolve promise with the response after joining
                })
                .catch(err => {
                    reject(err); // Reject if joining fails
                });
        };

        socket.onerror = function (error) {
            console.log(`[error] ${error.message}`);
            reject(new Error("WebSocket error"));
        };

        socket.onmessage = function (event) {
            console.log(`[message] Data received from server: ${event.data}`);
            var json = JSON.parse(event.data);
            onUpdate(json);
            //updateView(json);
        }

        socket.onclose = function (event) {
            if (event.wasClean) {
                console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
            } else {
                console.log("[close] Connection died");
            }
        };
    });
}