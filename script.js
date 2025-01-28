// utility functions
const expandBody = function (idString) {
  const bodyID = idString.split("-")[0] + "-body";
  $(bodyID).toggle();
  $(idString).children().eq(0).children().eq(1).toggleClass("flip")
  $(idString).toggleClass("roundtop rounded");
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