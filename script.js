// utility functions

const expandBody = function (idString) {
  const headID = "#" + idString
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
  $("#deckID").text(json.deck_id)
};

const drawCards = async function (num) {
  const deckID = $("#deckID").text();
  const response = await fetch(
    `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=${num}`
  );
  const json = await response.json();

};

const shuffleDeck = async function (deckID) {
  const response = await fetch(
    `https://deckofcardsapi.com/api/deck/${deckID}/shuffle/`
  );
  const json = await response.json();

}

const getDadJoke = async function () {
  const response = await fetch("https://icanhazdadjoke.com/", {
    headers: {
      "Accept": "application/json",
      "User-Agent": "otherjosh-is-me 1.0.0 Personal Website",
    }
  })

  const json = await response.json()
  $("#dadJoke").text(json.joke)
}

// event listeners

$('.coolstuff').click(function () {
  expandBody($(this).attr('id'))
})

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
  $(this).trigger('reset');
});

$(".palette").click(function () {
  $(".palette").removeClass("grow");
  $(this).addClass("grow")
});

$(".pixelgrid").on("click", "div", function () {
  const color = $(".grow").css("background-color");
  $(this).css({
    "background-color": color
  });
});

$(".colorchange").click(function () {
  const theme = $(this).attr("id");
  const themes = [];

  if (theme == "mono") {
    $(".greytext").css("color", "#BFAE99");
    $(".header > h1, .header > h4").css("color", "#B7A692");
  } else {
    $(".greytext").css("color", "#505050");
    $(".header > h1, .header > h4").css("color", "aliceblue");
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

// Initial Page Load
getDeck();
getDadJoke();