// utility functions

const expandBody = function (idString) {
  const bodyID = idString.split("-")[0] + "-body";
  $(bodyID).toggle();
  $(idString).children().eq(0).children().eq(1).toggleClass("flip");
  $(idString).toggleClass("roundtop rounded");
};

const createGrid = function (width, height) {
  const pixelSize = 50 / Number(width);
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
  $('.pixel').css({
    height: pixelSize + "vw",
    width: pixelSize + "vw"
  })
  return pixelGrid;
};

// event listeners

$("#walkertreker-head").click(function () {
  expandBody("#walkertreker-head");
});

$("#pixelart-head").click(function () {
  expandBody("#pixelart-head");
});

$("#changecolors-head").click(function () {
  expandBody("#changecolors-head");
});
