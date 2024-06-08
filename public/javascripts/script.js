// display slider value
document.addEventListener('DOMContentLoaded', function () {

    connectWebSocket();
    loadJson();
    setupEventListeners();
    setupRaiseSlider();
    startActionTimer();
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
    $.ajax({
        method: "GET",
        url: "/get",
        dataType: "json",

        success: function (json) {
            updateGame(json)
        }
    });
}

function updateGame(json) {
    updateBoard(json.board)
    updatePlayers(json.players, json.playerAtTurn)
    updatePot(json.pot)
}

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

        let position;
        switch (index) {
            case 0: position = "top-left-player"
            case 1: position = "top-right-player"
            case 2: position = "right-player"
            case 3: position = "bottom-right-player"
            case 4: position = "bottom-left-player"
            case 5: position = "left-player"
        }

        let playerHtml = player.folded ? `<div class="player ${position}">
        <div class="text-secondary">${player.name}</div>
        <div class="player-circle responsive-player-circle me-1 opacity-25">
            <div class="bi-person-fill player-icon responsive-player-icon opacity-25"></div>
        </div>
        <div class="player-balance responsive-player-balance opacity-25">$ ${player.balance}</div>
        </div>` : `<div class="player ${position}">
        <div class="text-secondary">${player.name}</div>
        <div class="player-circle responsive-player-circle me-1">
        <div class="bi-person-fill player-icon responsive-player-icon"></div>
        </div>
        <div class="player-balance responsive-player-balance">$  ${player.balance}</div>
        </div>`

        let cardColor;
        switch (card.suit) {
            case "Clubs":
            case "Spades":
                cardColor = "black-text";
                break;
            case "Hearts":
            case "Diamonds":
                cardColor = "red-text";
                break;
        }

        let playerCardsHtml = playerAtTurn == index ? `<div class="card responsive-cards">
        <div class="card-icon ${player.card1.suit} ${cardColor} responsive-card-suit"></div>
        <div class="card-text ${cardColor} responsive-card-text">${player.card1.rank}</div>
        </div>
        <div class="card responsive-cards">
        <div class="card-icon ${player.card2.suit} ${cardColor} responsive-card-suit"></div>
        <div class="card-text ${cardColor} responsive-card-text">${player.card2.rank}</div>
        </div>` : `<div class="bg-transparent">
        <svg class="responsive-hiddencard" viewBox="0 0 305 318" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="123.661" width="192" height="268" rx="25" transform="rotate(20 123.661 0)" fill="#2DD4BF" />
            <path fill-rule="evenodd" clip-rule="evenodd"
                d="M95.6109 33H25C11.1929 33 0 44.1929 0 58V276C0 289.807 11.1929 301 25 301H125.372L36.4511 268.635C23.4767 263.913 16.787 249.567 21.5093 236.593L95.6109 33Z"
                fill="#2DD4BF" />
        </svg>
        </div>`

        playerDiv.html(playerHtml)
        playerCardsDiv.html(playerCardsHtml)
    });
}

function updatePot(pot) {
    let potDiv = $("#pot");
    potDiv.empty();
    potDiv.text("$ " + pot)
}

function connectWebSocket() {
    const socket = new WebSocket("ws://localhost:9000/ws");

    socket.onopen = function (e) {
        console.log("[open] Connection established");
    };
    socket.onclose = function (event) {
        if (event.wasClean) {
            console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
        } else {
            console.log('[close] Connection died');
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