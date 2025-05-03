import axios from "axios";
import { pl } from "vuetify/locale";

var playerID = "";
var currentViewIsLobby = true;
const serverAdress = "http://127.0.0.1:8080/core";

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
    console.log("sending action to server: ", action);

    axios
      .post(
        `${serverAdress}/${action}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        return response.data;
      })
      .catch((error) => {
        console.error(
          `Fehler bei der Anfrage für action "${action}": ${error}`
        );
      });
  }
}

export function newGame(smallBlindValue, bigBlindValue, players) {
  console.log("newGame() Called");

  axios
    .post(
      `${serverAdress}/newGame`,
      {
        players: players,
        smallBlind: smallBlindValue,
        bigBlind: bigBlindValue,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    )
    .then((response) => {
      console.log(response.data);
      updateView(response.data);
      console.log("successfully rendered Game View");
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function join(playerID,authID) {
  console.log("joining Lobby", playerID);

  return axios
    .get(`${serverAdress}/join`, {
      headers: {
        playerID: playerID,
        authID: authID,
        Accept: "application/json",
      },
    })
    .then((response) => {
      console.log(response.data);
      console.log("successfully loaded lobby");
      return response.data;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

export function fetch() {
  axios
    .get(`${serverAdress}/get`, {
      headers: {
        Accept: "application/json",
      },
    })
    .then((response) => {
      console.log(response.data);
      return response.data;
    })
    .catch((error) => {
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

let socket;
let onUpdateFunction;
let reconnectInterval;
var playerOffline = false;

export async function connectWebSocket(newPlayerID, onUpdate,authID) {
  console.log("connectWebSocket() Called", newPlayerID);
  onUpdateFunction = onUpdate;

  playerID = newPlayerID;
  console.log("connectWebSocket() Called", newPlayerID);

  return new Promise((resolve, reject) => {
    socket = new WebSocket(
      "ws://" + "127.0.0.1:8080" + `/core/websocket?playerID=${playerID}`
    );

    socket.onopen = function (e) {
      console.log("[open] Connection established");
      join(playerID,authID)
        .then((response) => {
          resolve(response); // Resolve promise with the response after joining
        })
        .catch((err) => {
          reject(err); // Reject if joining fails
        });
    };

    socket.onerror = function (error) {
      console.log(`[error] ${error.message}`);
      reject(new Error("WebSocket error"));
    };

    socket.onmessage = function (event) {
      if (playerOffline) {
        return;
      }
      if (event.data === "ping") {
        console.log("Ping received from server");
        socket.send("pong");
        console.log("Pong sent to server");
      } else {
        console.log(`[message] Data received from server: ${event.data}`);
        var json = JSON.parse(event.data);
        onUpdate(json);
      }
    };

    socket.onclose = function (event) {
      if (event.wasClean) {
        console.log(
          `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`
        );
        socket.close();
      } else {
        console.log("[close] Connection died");
      }
    };
  });
}

// Funktion zum Schließen des Sockets
function closeWebSocket() {
  if (socket) {
    console.log("Closing WebSocket connection");
    //close WebSocket here when internet connection is actually gone
    playerOffline = true;
  }
}

// Funktion zur Verwaltung der Wiederverbindung
function scheduleReconnect(onUpdate) {
  console.log("scheduleReconnect() Called");
  if (!reconnectInterval) {
    console.log("Scheduling WebSocket reconnect...");
    reconnectInterval = setInterval(() => {
      if (navigator.onLine) {
        console.log("Reconnecting WebSocket...");
        clearInterval(reconnectInterval);
        reconnectInterval = null;
        //reconnect WebSocket here when internet connection is actually gone
        playerOffline = false;
        fetch();
      }
    }, 5000); // Versuche alle 5 Sekunden eine Wiederverbindung
  }
}

window.addEventListener("offline", () => {
  console.log("Offline detected");
  closeWebSocket();
});

window.addEventListener("online", () => {
  console.log("Online detected");
  if (playerOffline) {
    scheduleReconnect(onUpdateFunction);
  }
});
