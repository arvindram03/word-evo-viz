var chart = {};
var is_playing = false;
var curYear = 1900;
var interval;

fetchTextClassData("god");
fetchWords();

function fetchTextClassData(word) {
  // var word = "god"
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
        // togglePlay();
    }
  };
  xhttp.open("GET", "/word?q="+word, true);
  xhttp.send();

}

function wordInput() {
  // var textField = d3.select("#word-input");
  word = document.getElementById("word-input").value;
  fetchTextClassData(word);
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
  xhttp.open("GET", "/word_cloud", true);
  xhttp.send();

}

function togglePlay() {
  if(is_playing) {
    reset();
    document.getElementById("play-button").className = "glyphicon glyphicon-play";
  } else {
    play();
    document.getElementById("play-button").className = "glyphicon glyphicon-refresh";
  }
}

function reset() {
  d3.select(".plot").selectAll(".trace").remove();
  stopAnimation();
  is_playing = false;
  curYear = 1900;
  gSlider.value(curYear);
  change(curYear);
}

function play() {
  d3.select(".plot").selectAll(".trace").remove();
  if (curYear < 2005) {
    startAnimation();
  }else {
    curYear = 1900;
    d3.select(".plot").selectAll(".trace").remove();
    play();
  }
}

function startAnimation() {
  is_playing = true;
  interval = setInterval(function() {
                                  increment();
                                }, timeDuration);
}

function stopAnimation() {
  clearInterval(interval);
}

function increment() {
  curYear += 5;
  
  var event = document.getElementById("eventWrap");
  var leftV = document.getElementById("handle-one").style.left;
  leftV = leftV.slice(0,-1);
  event.style.left = leftV/1.45 + "%";
  gSlider.value(curYear);
  if (curYear % 10 == 5) {
    $("#eventWrap").animate({opacity:1},timeDuration/3);
    $("#eventWrap").animate({opacity:1},timeDuration/3);
    $("#eventWrap").animate({opacity:0.001},timeDuration/3);
  }
  
  change(curYear);
  if(curYear == 2005) {
    stopAnimation();
  }
}
function draw(words) {
    var div = d3.select(".wordCloud");
    var dim = {height: div.style("height").slice(0,-2), width: div.style("width").slice(0,-2)};
    var fill = d3.scale.category20();
    d3.select(".wordCloud").append("svg")
        .attr("width", dim.width)
        .attr("height", dim.height)
      .append("g")
        .attr("transform", "translate("+dim.width/2+","+dim.height/2+")")
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
        .on("click",function(d){
            fetchTextClassData(d.text)
        })
        .text(function(d) { return d.text; });
}

function generateWordCloud(word_list) {
  var fill = d3.scale.category20();
  var div = d3.select(".wordCloud");
  var dim = {height: div.style("height").slice(0,-2), width: div.style("width").slice(0,-2)};
  d3.layout.cloud()
      .size([dim.width, dim.height])
      // .canvas(function() { return new Canvas(1, 1); })
      .words(word_list)
      .rotate(function() { return ~~(Math.random() * 2) * 90; })
      .font("Impact")
      .fontSize(function(d) { return d.size; })
      .on("end", draw)
      .start();
  }
