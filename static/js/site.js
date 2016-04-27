fetchTextClassData();

function fetchTextClassData() {
  var word = "accident"
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      var chart = {
                "data":JSON.parse(xhttp.responseText),
                "selector":".cluster-plot",
                "xAxisTitle":"newX",
                "yAxisTitle":"newY",
                "title":"Word Evolution ScatterPlot",
              };
      // console.log(xhttp.responseText);
        drawScatter(chart);
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
}