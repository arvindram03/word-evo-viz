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
  gSlider.value(curYear);
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

function generateSparkline() {
  // create an SVG element inside the #graph div that fills 100% of the div
var graph = d3.select("#graph").append("svg:svg").attr("width", "100%").attr("height", "100%");

// create a simple data array that we'll plot with a line (this array represents only the Y values, X will just be the index location)
var data = [3, 6, 2, 7, 5, 2, 1, 3, 8, 9, 2, 5, 9, 3, 6, 3, 6, 2, 7, 5, 2, 1, 3, 8, 9, 2, 5, 9, 2, 7, 5, 2, 1, 3, 8, 9, 2, 5, 9, 3, 6, 2, 7, 5, 2, 1, 3, 8, 9, 2, 5, 9];

// X scale will fit values from 0-10 within pixels 0-100
var x = d3.scale.linear().domain([0, 10]).range([0, 50]);
// Y scale will fit values from 0-10 within pixels 0-100
var y = d3.scale.linear().domain([0, 10]).range([0, 30]);

// create a line object that represents the SVN line we're creating
var line = d3.svg.line()
  // assign the X function to plot our line as we wish
  .x(function(d,i) {
    // verbose logging to show what's actually being done
    console.log('Plotting X value for data point: ' + d + ' using index: ' + i + ' to be at: ' + x(i) + ' using our xScale.');
    // return the X coordinate where we want to plot this datapoint
    return x(i);
  })
  .y(function(d) {
    // verbose logging to show what's actually being done
    console.log('Plotting Y value for data point: ' + d + ' to be at: ' + y(d) + " using our yScale.");
    // return the Y coordinate where we want to plot this datapoint
    return y(d);
  })

  // display the line by appending an svg:path element with the data line we created above
  graph.append("svg:path").attr("d", line(data));
}
