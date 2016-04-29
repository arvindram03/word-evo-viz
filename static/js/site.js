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
  if (curYear < 2005) {
    var i;
    for (i=1;i<=21;i++) {
      setTimeout(function() {
        increment();
      },i*1000);
    }
  }else {
    curYear = 1900;
  }
}

function increment() {

  curYear += 5;
  console.log("here", curYear);
  // var timeSlider = document.getElementById("timeSlider");
  // timeSlider.value = curYear;
  // document.getElementById("timeSlider").onchange();
  // timeSlider.onchange();
  // console.log(document.getElementById("timeSlider"));
  // change(curYear);
  var slid = d3.select('#slider');
  slid.selectAll("*").remove();
  slid.call(
  d3.slider()
  .axis(d3.svg.axis().ticks(20).tickFormat(d3.format("d")))
  .min(1900)
  .max(2005)
  .step(5)
  .value(curYear)
  .on("slide", function(evt, value) {
     change(value); 
  }));
  change(curYear);
  // d3.select("#timeSlider").each(function() {change(curYear)});
  // $("#timeSlider").val(curYear).change();
}