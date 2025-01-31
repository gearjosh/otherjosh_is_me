// utility functions

const expandBody = function (idString) {
  const headID = "#" + idString;
  const bodyID = "#" + idString.split("-")[0] + "-body";
  $(bodyID).toggle();
  $(headID).children().eq(0).children().eq(1).toggleClass("flip");
  $(headID).toggleClass("roundtop rounded");
};

const createGrid = function (width, height) {
  let pixelGrid = "<div class='flex flexcolumn'>";
  let row = '<div class="flex flexrow">';
  for (let index = 0; index < width; index++) {
    row += "<div class='pixel pointer'></div>";
  }
  row += "</div>";
  for (let index = 0; index < height; index++) {
    pixelGrid += row;
  }
  pixelGrid += "</div>";
  return pixelGrid;
};

const getDeck = async function () {
  const response = await fetch(
    "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
  );
  const json = await response.json();
  $("#deckID").text(json.deck_id);
};

const getEmptyCardSlots = function () {
  const cardSlots = ["1", "2", "3", "4", "5"]
  const cardsHeld = $("#dealOrDraw").text().split("");
  const emptyCardSlots = cardSlots.filter(val => !cardsHeld.includes(val));
  return emptyCardSlots;
}

const drawCards = async function () {
  const deckID = $("#deckID").text();
  const dealOrDraw = $("#dealOrDraw").text();
  const emptyCardSlots = getEmptyCardSlots();

  let num = NaN;
  if (dealOrDraw == "deal") {
    num = 5;
    $("#dealOrDraw").text("");
  } else {
    num = 5 - $("#dealOrDraw").text().length;
    $("#dealOrDraw").text("deal");
  }
  if (num > 0) {
    const response = await fetch(
      `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=${num}`
    );
    const json = await response.json();
    const cards = json.cards;

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const slot = emptyCardSlots[i];
      $("#card" + slot + " > img").attr({
        src: card.image,
        alt: card.value + " of " + card.suit,
        "data-code": card.code,
      });
    }
  }
};

const getCardSuits = function (cardArray) {
  const suits = [];
  for (let i = 0; i < cardArray.length; i++) {
    suits.push(cardArray[i].suit);
  }
  return suits;
};

const getCardValues = function (cardArray) {
  const values = [];
  for (let i = 0; i < cardArray.length; i++) {
    let val = cardArray[i].value;
    if (val == "A") {
      val = 14;
    } else if (val == "K") {
      val = 13;
    } else if (val == "Q") {
      val = 12;
    } else if (val == "J") {
      val = 11;
    } else if (val = "0") {
      val = 10
    } else {
      val = Number(val);
    }
    values.push(val);
  }
  values.sort((a, b) => b - a);
  return values;
};

const checkFlush = function (suitArray) {
  return new Set(suitArray).size == 1;
};

const checkStraight = function (valArray) {
  if (valArray[0] == 14) {
    const lowStraight = [14, 5, 4, 3, 2];
    if (valArray.every((val, i) => val == lowStraight[i])) {
      return true;
    }
  }
  for (let i = 1; i < valArray.length; i++) {
    if (valArray[i] != valArray[i - 1] - 1) {
      return false;
    }
  }
  return true;
};

const checkFullHouse = function (valArray) {
  const valCounts = {};
  let hasThree = false;
  let hasPair = false;
  for (const val of valArray) {
    valCounts[val] = (valCounts[val] || 0) + 1;
  }
  for (const val in valCounts) {
    if (valCounts[val] == 3) {
      hasThree = true;
    } else if (valCounts[val] == 2) {
      hasPair = true;
    }
  }
  return hasThree && hasPair;
};

const checkFourOfKind = function (valArray) {
  const valCounts = {};
  let hasFour = false;
  for (const val of valArray) {
    valCounts[val] = (valCounts[val] || 0) + 1;
  }
  for (const val in valCounts) {
    if (valCounts[val] == 4) {
      hasFour = true;
    }
  }
  return hasFour;
};

const checkThreeOfKind = function (valArray) {
  const valCounts = {};
  let hasThree = false;
  for (const val of valArray) {
    valCounts[val] = (valCounts[val] || 0) + 1;
  }
  for (const val in valCounts) {
    if (valCounts[val] == 3) {
      hasThree = true;
    }
  }
  return hasThree;
};

const checkTwoPair = function (valArray) {
  const valCounts = {};
  let hasTwoPair = false;
  let pairCount = 0;
  for (const val of valArray) {
    if (val > 10) {
      valCounts[val] = (valCounts[val] || 0) + 1;
    }
  }
  for (const val in valCounts) {
    if (valCounts[val] == 2) {
      pairCount += 1;
    }
  }
  return pairCount > 1;
};

const checkPair = function (valArray) {
  const valCounts = {};
  let hasPair = false;
  for (const val of valArray) {
    if (val > 10) {
      valCounts[val] = (valCounts[val] || 0) + 1;
    }
  }
  for (const val in valCounts) {
    if (valCounts[val] == 2) {
      hasPair = true;
    }
  }
  return hasPair;
};

const getHand = function () {
  const cards = [];

  for (let i = 1; i <= 5; i++) {
    const string = $("#card" + i + " > img").attr("data-code");
    const stringArray = string.split("");
    const card = {
      value: stringArray[0],
      suit: stringArray[1],
    };
    cards.push(card);
  }
  return cards;
};

const scoreHand = function (cards) {
  let score = 0;
  const suits = getCardSuits(cards);
  const vals = getCardValues(cards)
  if (checkFlush(suits) && checkStraight(vals)) {
    if (vals[-1] == 10) {
      score = 2000;
    } else {
      score = 250;
    }
  } else if (checkFourOfKind(vals)) {
    score = 125;
  } else if (checkFullHouse(vals)) {
    score = 40;
  } else if (checkFlush(suits)) {
    score = 25;
  } else if (checkStraight(vals)) {
    score = 20;
  } else if (checkThreeOfKind(vals)) {
    score = 15;
  } else if (checkTwoPair(vals)) {
    score = 10;
  } else if (checkPair(vals)) {
    score = 5;
  }
  return score;
};

const shuffleDeck = async function (deckID) {
  const response = await fetch(
    `https://deckofcardsapi.com/api/deck/${deckID}/shuffle/`
  );
  const json = await response.json();
};

const getDadJoke = async function () {
  const response = await fetch("https://icanhazdadjoke.com/", {
    headers: {
      Accept: "application/json",
      "User-Agent": "otherjosh-is-me 1.0.0 Personal Website",
    },
  });

  const json = await response.json();
  $("#dadJoke").text(json.joke);
};

// click/event listeners

$(".coolstuff").click(function () {
  expandBody($(this).attr("id"));
});

$("#pixelDimensions").submit(function (event) {
  event.preventDefault();

  const values = $(this).serializeArray();
  const w = values[1].value;
  const h = values[0].value;
  const pixelSize = 50 / Number(w) + "vw";
  const grid = createGrid(w, h);

  $("#pixelGrid").html(grid);
  $(".pixel").css({
    height: pixelSize,
    width: pixelSize,
  });
  $("#pixelMaker").show();
  $(this).trigger("reset");
});

$(".palette").click(function () {
  $(".palette").removeClass("grow");
  $(this).addClass("grow");
});

$(".pixelgrid").on("click", "div", function () {
  const color = $(".grow").css("background-color");
  $(this).css({
    "background-color": color,
  });
});

$(".colorchange").click(function () {
  const theme = $(this).attr("id");
  const themes = [];

  if (theme == "mono") {
    $(".greytext").css("color", "#BFAE99");
    $(".header > h1, .header > h4").css("color", "#B7A692");
    $(".whitetext").css("color", "aliceblue");
    $("#me").addClass("bw");
  } else if (theme == "pastel") {
    $(".greytext").css("color", "#505050");
    $(".whitetext").css("color", "darkmagenta");
    $(".header > h1, .header > h4").css("color", "lightcyan");
    $(".footer p").css("color", "lightcyan");
    $("#me").removeClass("bw");
  } else {
    $(".greytext").css("color", "#505050");
    $(".header > h1, .header > h4").css("color", "aliceblue");
    $(".whitetext").css("color", "aliceblue");
    $("#me").removeClass("bw");
  }

  for (let i = 1; i <= 5; i++) {
    themes.push($("." + theme + i).css("background-color"));
  }
  for (let i = 1; i <= 5; i++) {
    $(".color" + i).css("background-color", themes[i - 1]);
  }

  $(".header").css("background-image", "url('./img/" + theme + "-header.png')");
  $(".footer").css("background-image", "url('./img/" + theme + "-footer.png')");

  $(".bigshadow").css({
    "text-shadow": themes[4] + " 0 .25rem",
  });
  $(".mediumshadow").css({
    "text-shadow": themes[4] + " 0 .125rem",
  });
  $(".lilshadow").css({
    "text-shadow": themes[4] + " 0 .0625rem",
  });
});

$(".hold").click(function () {
  if ($("#dealOrDraw").text() != "deal") {
    const cardID = $(this).parent().attr("id").slice(-1);
    let cardsHeld = $("#dealOrDraw").text();
    cardsHeld += cardID;
    $("#dealOrDraw").text(cardsHeld);
  }
});

//draw/deal button logic here

// Initial Page Load
getDeck();
getDadJoke();
