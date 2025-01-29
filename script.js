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
    row += "<div class='pixel'></div>";
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
