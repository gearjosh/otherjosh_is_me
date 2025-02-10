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
  const cardSlots = ["1", "2", "3", "4", "5"];
  const cardsHeld = $("#dealOrDraw").text().split("");
  const emptyCardSlots = cardSlots.filter((val) => !cardsHeld.includes(val));
  return emptyCardSlots;
};

const drawCards = async function () {
  const deckID = $("#deckID").text();
  const dealOrDraw = $("#dealOrDraw").text();
  const emptyCardSlots = getEmptyCardSlots();

  let num = NaN;
  if (dealOrDraw == "deal") {
    num = 5;
  } else {
    num = 5 - $("#dealOrDraw").text().length;
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
  if (dealOrDraw == "deal") {
    $("#dealOrDraw").text("");
  } else {
    $("#dealOrDraw").text("deal");
    scoreHand(getHand());
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
    } else {
      val = Number(val);
    }
    if (val == 0) {
      val = 10;
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
  let pairCount = 0;
  for (const val of valArray) {
    valCounts[val] = (valCounts[val] || 0) + 1;
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
    const string = $("#card" + i + " > img").attr("data-code") || "";
    const stringArray = string.split("");
    const card = {
      value: stringArray[0],
      suit: stringArray[1],
    };
    cards.push(card);
  }
  return cards;
};

const resetChips = function () {
  $("#chips").text("100");
};

const updateChips = function (num) {
  let chips = Number($("#chips").text());
  let delay = 250;
  if (num == 2000) {
    delay = 25;
  } else if (num >= 125) {
    delay = 100;
  }
  if (num > 0) {
    $("#dealDrawButton").addClass("unclickable");
    let left = num;
    let interval = setInterval(function () {
      if (left > 0) {
        chips += 5;
        left -= 5;
        $("#chips").text(chips);
      } else {
        $("#" + num).removeClass("glow");
        $("#dealDrawButton").removeClass("unclickable");
        clearInterval(interval);
        interval = null;
      }
    }, delay);
    interval;
  } else {
    chips += num;
    $("#chips").text(chips);
  }
};

const scoreHand = function (cards) {
  console.log("cards: ", cards);
  let score = 0;
  const suits = getCardSuits(cards);
  const vals = getCardValues(cards);
  console.log("suits: ", suits);
  console.log("vals: ", vals);
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
  if (score > 0) {
    if (score == 2000) {
      $("#payouts").addClass("jackpot");
    }
    updateChips(score);
    const hand = $("#" + score).text();
    $("#hand").text(hand);
  } else {
    if (Number($("#chips").text()) < 5) {
      $("#hand").text("Oh no! You're out of money. Want to play again?");
      $("#dealDrawButton").text("Start New Game");
    } else {
      $("#hand").text("Bad luck. Try again.");
    }
  }
};

const shuffleDeck = async function (deckID) {
  const response = await fetch(
    `https://deckofcardsapi.com/api/deck/${deckID}/shuffle/`
  );
};

const getMemes = async function () {
  const response = await fetch("https://api.imgflip.com/get_memes");
  const json = await response.json();
  if (json.success == true) {
    const memes = json.data.memes;
    let grid = "<div class='flex flexcolumn flexspaced'>";
    let row = "<div class='flex flexrow flexspaced'>";
    memes.forEach(function(meme, i) {
      let memeDiv =
        "<div class='meme flex flexcolumn flexspaced pointer color3 rounded width5 bottommargin'><img class='imgfit' src='" +
        meme["url"] +
        "'><p class='liltext whitetext centertext lilbottommargin'>" +
        meme["name"] +
        "</p></div>";
      row += memeDiv;
      if ((i + 1) % 10 == 0) {
        row += "</div>";
        grid += row;
        row = "<div class='flex flexrow flexspaced'>";
      }
    });
    grid += "</div>";
    $("#memeThumbs").html(grid);
  } else {
    $("#memeThumbs").html("<p>Uh, oh... Something went wrong.</p>");
  }
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

$("#radica").click(function (event) {
  event.preventDefault();
  document.getElementById("radicaModal").showModal();
});

$(".coolstuff").click(function () {
  expandBody($(this).attr("id"));
});

$("#pixelDimensions").submit(function (event) {
  event.preventDefault();

  const values = $(this).serializeArray();
  const w = values[1].value;
  const h = values[0].value;
  const pixelSize = 60 / Number(w) + "vw";
  const grid = createGrid(w, h);
  if (w && h) {
    $("#pixelGrid").html(grid);
    $(".pixel").css({
      height: pixelSize,
      width: pixelSize,
    });
    $("#pixelMaker").show();
  }
  $(this).trigger("reset");
});

$("#pixelArtDownload").submit(function (event) {
  event.preventDefault();

  const fileName = $("#pixelArtName").val() + ".jpg";
  html2canvas(document.querySelector("#pixelGrid")).then((canvas) => {
    canvas.toBlob(function (blob) {
      window.saveAs(blob, fileName);
    });
  });
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
  $(".button").css({
    "box-shadow": "0 0.125rem " + themes[3],
  });
});

$(".hold").click(function () {
  if ($("#dealOrDraw").text() != "deal") {
    const cardID = $(this).parent().attr("id").slice(-1);
    let cardsHeld = $("#dealOrDraw").text();
    if ($(this).text() != "Held") {
      cardsHeld += cardID;
      $("#dealOrDraw").text(cardsHeld);
      $(this).parent().children(1).addClass("glow");
      $(this).text("Held");
    } else {
      const cardArray = cardsHeld.split("");
      const newCardsHeld = cardArray.filter((val) => val != cardID).join("");
      $("#dealOrDraw").text(newCardsHeld);
      $(this).parent().children(1).removeClass("glow");
      $(this).text("Hold");
    }
  }
});

$("#dealDrawButton").click(function () {
  if ($(this).text() == "Start New Game") {
    for (let i = 1; i <= 5; i++) {
      $("#card" + i + " > img").attr({
        src: "https://deckofcardsapi.com/static/img/back.png",
        alt: "the back of a playing card",
        "data-code": "",
      });
      $("#hand").text("");
    }
    resetChips();
    shuffleDeck($("#deckID").text());
    $(this).text("Deal");
  } else if ($(this).text() == "Draw") {
    $(".hold").parent().children(1).removeClass("glow");
    $(".hold").text("Hold");
    drawCards();
    $(this).text("Deal");
  } else if ($(this).text() == "Deal") {
    $("#hand").text("");
    updateChips(-5);
    shuffleDeck($("#deckID").text());
    drawCards();
    $(this).text("Draw");
  } else {
    alert(
      "Something went wrong with Video Poker. Refresh the page and try again."
    );
  }
  if ($("#payouts").hasClass("jackpot")) {
    $("#payouts").removeClass("jackpot");
  }
});

$("#memeThumbs").on("click", "div.meme", function () {
  const memeUrl = $(this).children(1).attr("src")
  const memeName = $(this).children(2).text();
  // $("#memeImg").html(memeContent + "<img src='" + memeUrl + "' alt='" + memeName + "' class='imgfit'>")
  $("#memeImg > img").attr("src", memeUrl)
  $("#memeImg > img").attr("alt", memeName);
  $(".memeimgcontainer").css({
    background: "no-repeat url(" + memeUrl + ") 50% / 100%"
  })
  $("#memeThumbs").hide();
  $("#memeEditor").show()
});



// Initial Page Load

getDeck();
getMemes();
getDadJoke();
