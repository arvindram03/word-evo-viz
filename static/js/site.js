var chart = {};
fetchTextClassData();
fetchWords();
function fetchTextClassData() {
  var word = "god"
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

function fetchWords() {
  var word = "god"
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      words = JSON.parse(xhttp.responseText)
      generateWordCloud(words);
    }
  };
  xhttp.open("GET", "/word_cloud"+word, true);
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
  gSlider.value(curYear);
  change(curYear);  
}
function draw(words) {
    var fill = d3.scale.category20();
    d3.select("#wordCloud").append("svg")
        .attr("width", 300)
        .attr("height", 300)
      .append("g")
        .attr("transform", "translate(150,150)")
      .selectAll("text")
        .data(words)
      .enter().append("text")
        .style("font-size", function(d) { return d.size + "px"; })
        .style("font-family", "Impact")
        .style("fill", function(d, i) { return fill(i); })
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; });
}

function generateWordCloud(word_list) {
  var fill = d3.scale.category20();

  d3.layout.cloud().size([300, 300])
      .words(word_list)
      .rotate(function() { return ~~(Math.random() * 2) * 90; })
      .font("Impact")
      .fontSize(function(d) { return d.size; })
      .on("end", draw)
      .start();
  }

  