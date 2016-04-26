function drawScatter(chart) {
	var div = d3.select(chart.selector);
	div.selectAll("*").remove();
	div.attr('id','scatterChart');
	var dim = {height: div.style("height").slice(0,-2), width: div.style("width").slice(0,-2)};
	var margin = {top: dim.height/10, right: dim.height/20, bottom: dim.height/5, left: dim.height/5};
	xAxisLen = (dim.width-margin.left - margin.right);
	yAxisLen = (dim.height - margin.top - margin.bottom);
	var x = d3.scale.linear().range([0, xAxisLen]);
	var y = d3.scale.linear().range([yAxisLen, 0]);
	x.domain([d3.min(chart.data.other_words, function(d){return d.x})-1, d3.max(chart.data.other_words, function(d){return d.x})+1]);
  	y.domain([d3.min(chart.data.other_words, function(d){return d.y})-1, d3.max(chart.data.other_words, function(d){return d.y})+1]);
	var palette = d3.scale.category20();
    var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left")
	    .ticks(10);

    var plotArea = div.append("svg");
		plotArea.append("g").append("text")
				.attr("class","axisTitle")
	            .attr("text-anchor", "middle")
	            .attr("transform", "translate("+ (margin.left/3) +","+(dim.height/2)+") rotate(-90)")
	            .text(chart.yAxisTitle);

	     plotArea.append("g").append("text")
	     		.attr("class","axisTitle")
	            .attr("text-anchor", "middle")
	            .attr("transform", "translate("+ (dim.width/2) +","+(dim.height-(margin.bottom/2))+")")
	            .text(chart.xAxisTitle);

	    plotArea.append("g").append("text")
	     		.attr("class","title")
	            .attr("text-anchor", "middle")
	            .attr("transform", "translate("+ (dim.width/2) +","+margin.top/2+")")
	            .text(chart.title);

	var plot = plotArea.attr("width", dim.width)
	  					.attr("height", dim.height)
						.append("g")
						.attr("class", "plot")
						.attr("transform",
						  	"translate(" + margin.left + "," + margin.top + ")");

	plot.append("g")
		.attr("class","axis")
		.attr("id","axis")
		.attr("transform", "translate(0," +  yAxisLen + ")")
	    .call(xAxis)
	    .selectAll("text")
	    .attr("transform", "rotate(45)")
	    .attr("dx", "1em")
	    .style("text-anchor","start");

	plot.append("g")
		.attr("class","axis")
	    .call(yAxis);

	plot.append("g")
		.attr("class", "target")
		.append("circle")
        .attr("r", 5)
        // .attr("cx", function(d){return x(chart.data.timeseries["1900"].x);})
        // .attr("cy", function(d){return y(chart.data.timeseries["1900"].y);})
        .attr("cx", 0)
        .attr("cy", 0)
        .style("fill", function(d) {return palette(0);});

    var target = plot.selectAll(".target");
    target.on("mouseover",function(d){
  		d3.select(this.childNodes[0]).transition().duration(300)
  		.attr("r", function(d){
			return 8;
		});
		// d3.select(this.childNodes[1]).style("visibility","visible")
  	});

  	target.on("mouseout",function(d){
  		d3.select(this.childNodes[0]).transition().duration(300)
  		.attr("r", function(d){
			return 5;
		});
		// d3.select(this.childNodes[1]).style("visibility","hidden")
  	});

  	target.append("text")
	  // .attr("x",function(d){return x(chart.data.timeseries["1900"].x);})
	  // .attr("y",function(d){return y(chart.data.timeseries["1900"].y);})
	  .attr("x", 0)
	  .attr("y", 0)
	  .attr("dx","0.5em")
	  .attr("dy","-0.5em")
	  // .style("visibility","hidden")
	  .text(function(d) { return chart.data.word; });

	var points = plot.selectAll(".points")
      .data(chart.data.other_words)
    .enter().append("g")
    .attr("class", "points");

    points.append("circle")
      .attr("r", 5)
      .attr("cx", function(d){return x(d.x);})
      .attr("cy", function(d){return y(d.y);})
      .style("fill", function(d) {return palette(6);})
      console.log(palette(6));

	 points.append("text")
	  .attr("x",function(d){return x(d.x);})
	  .attr("y",function(d){return y(d.y);})
	  .attr("dx","0.5em")
	  .attr("dy","-0.5em")
	  // .style("visibility","hidden")
	  .text(function(d) { return d.word; });

    points.on("mouseover",function(d){
  		d3.select(this.childNodes[0]).transition().duration(300)
  		.attr("r", function(d){
			return 8;
		});
		// d3.select(this.childNodes[1]).style("visibility","visible")
  	});

  	points.on("mouseout",function(d){
  		d3.select(this.childNodes[0]).transition().duration(300)
  		.attr("r", function(d){
			return 5;
		});
		// d3.select(this.childNodes[1]).style("visibility","hidden")
  	});
  	onSliderEvent(1900, chart, x, y)
}

function onSliderEvent(e, chart, x, y) {
	var target = d3.selectAll(".target");
	console.log(e)
	console.log(x(chart.data.timeseries[e.toString()].x), y(chart.data.timeseries[e.toString()].y))
	target.attr("transform", "translate("+ x(chart.data.timeseries[e].x) + "," +  y(chart.data.timeseries[e].y) + ")")
	if(e < 2005) {
		setTimeout(function() {
			onSliderEvent(e+5, chart, x, y)
		}, 2000);
	}
}