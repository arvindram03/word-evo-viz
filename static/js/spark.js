fetchSparkData();
function fetchSparkData() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      // console.log(xhttp.responseText);
      words = JSON.parse(xhttp.responseText);
      drawSparks("table-sparkline-1",0,words['outlier']);
      drawSparks("table-sparkline-2",10,words['outlier']);
      drawSparks("table-sparkline-3",20,words['outlier']);
    }
  };
  xhttp.open("GET", "/outlier", true);
  xhttp.send();
}

function drawSparks(id, offset, words) {
	var table = document.getElementById(id);
	var tBody = table.tBodies[0];

	for (var i=offset; i < offset+10; i++) {
		var data = words[i];
    var word = data["word"];
		var idStr = "spark-"+word;
		var row = "<tr><td>"+word+"</td><td><div class='spark-plot' id="+idStr+"></div></td></tr>";
		tBody.innerHTML += row;
		drawSpark(idStr, data["points"]);
	}
}

function drawSpark(id, data) {
var div = d3.select("#"+id);
  // create an SVG element inside the #graph div that fills 100% of the div
var graph = div.append("svg:svg").attr("width",div.style("width").slice(0,-2)).attr("height",div.style("height").slice(0,-2));

// create a simple data array that we'll plot with a line (this array represents only the Y values, X will just be the index location)
// var data = [3, 6, 2, 7, 5, 2, 1, 3, 8, 9, 2, 5, 9, 3, 6, 3, 6, 2, 7, 5, 2, 1, 3, 8, 9, 2, 5, 9, 2, 7, 5, 2, 1, 3, 8, 9, 2, 5, 9, 3, 6, 2, 7, 5, 2, 1, 3, 8, 9, 2, 5, 9];
var x = d3.scale.linear().range([0, div.style("width").slice(0,-2)]);
var y = d3.scale.linear().range([div.style("height").slice(0,-2), 0]);

x.domain([d3.min(data, function(d){return +d.x})-1, d3.max(data, function(d){return +d.x})+1]);
y.domain([d3.min(data, function(d){return +d.y})-1, d3.max(data, function(d){return +d.y})+1]);

// create a line object that represents the SVN line we're creating
var line = d3.svg.line()
  // assign the X function to plot our line as we wish
  .x(function(d,i) {
    // verbose logging to show what's actually being done
    // console.log('Plotting X value for data point: ' + d + ' using index: ' + i + ' to be at: ' + x(i) + ' using our xScale.');
    // return the X coordinate where we want to plot this datapoint
    return x(d.x);
  })
  .y(function(d) {
    // verbose logging to show what's actually being done
    // console.log('Plotting Y value for data point: ' + d + ' to be at: ' + y(d) + " using our yScale.");
    // return the Y coordinate where we want to plot this datapoint
    return y(d.y);
  })

  // display the line by appending an svg:path element with the data line we created above
  graph.append("svg:path").attr("d", line(data));
}

