export function getPlayerHtml(name, balance, index, folded) {

  return folded ? `<div class="player ">
        <div class="text-secondary">${name}</div>
        <div class="player-circle responsive-player-circle mr-1 opacity-25">
            <div class="bi-person-fill player-icon responsive-player-icon opacity-25"></div>
        </div>
        <div class="player-balance responsive-player-balance opacity-25">$ ${balance}</div>
        </div>` : `<div class="player">
        <div class="text-secondary">${name}</div>
        <div class="player-circle responsive-player-circle mr-1">
        <div class="bi-person-fill player-icon responsive-player-icon"></div>
        </div>
        <div class="player-balance responsive-player-balance">$  ${balance}</div>
        </div>`
}

export function getPlayerCardsHtml(index, playerAtTurn, rank1, rank2, suit1, suit2) {

  let cardColor1;
  let suitstyle1;
  let cardColor2;
  let suitstyle2;

  switch (suit1) {
    case 1:
      cardColor1 = "black-text";
      suitstyle1 = "bi-suit-club-fill"
    case 2:
      cardColor1 = "black-text";
      suitstyle1 = "bi-suit-spade-fill"
      break;
    case 4:
      cardColor1 = "red-text";
      suitstyle1 = "bi-suit-heart-fill"
    case 3:
      cardColor1 = "red-text";
      suitstyle1 = "bi-suit-diamond-fill";
      break;
  }

  switch (suit2) {
    case 1:
      cardColor2 = "black-text";
      suitstyle2 = "bi-suit-club-fill"
    case 2:
      cardColor2 = "black-text";
      suitstyle2 = "bi-suit-spade-fill"
      break;
    case 4:
      cardColor2 = "red-text";
      suitstyle2 = "bi-suit-heart-fill"
    case 3:
      cardColor2 = "red-text";
      suitstyle2 = "bi-suit-diamond-fill";
      break;
  }

  return playerAtTurn == index ? `<div class="card responsive-cards">
    <div class="card-icon ${suitstyle1} ${cardColor1} responsive-card-suit"></div>
    <div class="card-text ${cardColor1} responsive-card-text">${rank1}</div>
    </div>
    <div class="card responsive-cards">
    <div class="card-icon ${suitstyle2} ${cardColor2} responsive-card-suit"></div>
    <div class="card-text ${cardColor2} responsive-card-text">${rank2}</div>
    </div>` : `<div class="bg-transparent">
    <svg class="responsive-hiddencard" viewBox="0 0 305 318" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="123.661" width="192" height="268" rx="25" transform="rotate(20 123.661 0)" fill="#2DD4BF" />
        <path fill-rule="evenodd" clip-rule="evenodd"
            d="M95.6109 33H25C11.1929 33 0 44.1929 0 58V276C0 289.807 11.1929 301 25 301H125.372L36.4511 268.635C23.4767 263.913 16.787 249.567 21.5093 236.593L95.6109 33Z"
            fill="#2DD4BF" />
    </svg>
    </div>`
}

export function calculateCoinsData(amount) {
  let amountLeft = amount;
  const coinValues = [1000, 500, 100, 50, 10];
  const coins = [];

  coinValues.forEach(coinValue => {
    const amountOfCoins = Math.floor(amountLeft / coinValue);
    amountLeft -= amountOfCoins * coinValue;

    let outlineColor, fillColor;

    switch (coinValue) {
      case 1000:
        fillColor = "#5F5F5F";
        outlineColor = "#FFFFFF";
        break;
      case 500:
        fillColor = "#763968";
        outlineColor = "#FFFFFF";
        break;
      case 100:
        fillColor = "#242424";
        outlineColor = "#FFFFFF";
        break;
      case 50:
        fillColor = "#286343";
        outlineColor = "#FFFFFF";
        break;
      case 10:
        fillColor = "#1E5FBF";
        outlineColor = "#FFFFFF";
        break;
    }

    for (let i = 0; i < amountOfCoins; i++) {
      coins.push({ fillColor, outlineColor });
    }
  });

  return coins;
}
