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
  
  for (let i = 1; i <= 5; i++) {
    themes.push($("." + theme + i).css("background-color"));
  }
  for (let i = 1; i <= 5; i++) {
    $(".color" + i).css("background-color", themes[i - 1]);
  }
});