var chart = {};
fetchTextClassData();
function fetchTextClassData() {
  var word = "mouse"
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      chart = {
                "data":JSON.parse(xhttp.responseText),
                "selector":".cluster-plot",
                "xAxisTitle":"newX",
                "yAxisTitle":"newY",
                "title":"Word Evolution ScatterPlot",
              };
      // console.log(xhttp.responseText);
        drawScatter();
    }
  };
  xhttp.open("GET", "/word?q="+word, true);
  xhttp.send();

}
var curYear = 1900;
function play() {
  if (timeSlider.value < 2005) {
    var i;
    for (i=1;i<=21;i++) {
      setTimeout(function() {
        increment();
      },i*1000);
    }
  }
}

function increment() {
  curYear += 5;
  var timeSlider = document.getElementById("timeSlider");
  timeSlider.value = curYear;
  // document.getElementById("timeSlider").onchange();
  // timeSlider.onchange();
  // console.log(document.getElementById("timeSlider"));
  d3.select("#timeSlider").each(function() {change(curYear)});
  // $("#timeSlider").val(curYear).change();
}