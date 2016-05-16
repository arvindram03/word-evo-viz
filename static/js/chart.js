var timeDuration = 500;
function change(year, remove_path = false){
						// drawForceGraph(chart,this.value);
						// onSliderEvent(1900, chart, x, y);
	//Complete repetition
	//TODO: find a way to write it clearly
	var div = d3.select(chart.selector);
	var dim = {height: div.style("height").slice(0,-2), width: div.style("width").slice(0,-2)};
	var margin = {top: dim.height/10, right: dim.height/20, bottom: dim.height/5, left: dim.height/5};
	xAxisLen = (dim.width-margin.left - margin.right);
	yAxisLen = (dim.height - margin.top - margin.bottom);
	var x = d3.scale.linear().range([0, xAxisLen]);
	var y = d3.scale.linear().range([yAxisLen, 0]);
	var points_data = [];
	for(idx in chart.data.other_words) {
		tmp = {};
		// console.log(coord["word"]);
		tmp["x"] = chart.data.other_words[idx].x;
		tmp["y"] = chart.data.other_words[idx].y;
		points_data.push(tmp);
	}
	for(yr in chart.data.timeseries) {
		// console.log(y);
		tmp = {};
		tmp["x"] = chart.data.timeseries[yr].x;
		tmp["y"] = chart.data.timeseries[yr].y;
		points_data.push(tmp);
	}

	x.domain([d3.min(points_data, function(d){return d.x})-1, d3.max(points_data, function(d){return d.x})+1]);
  	y.domain([d3.min(points_data, function(d){return d.y})-1, d3.max(points_data, function(d){return d.y})+1]);

	var target = d3.selectAll(".target");
	if (year > 1900) {
		old_x = x(chart.data.timeseries[year-5].x);
		old_y = y(chart.data.timeseries[year-5].y);
	}else {
		old_x = x(chart.data.timeseries[1900].x);
		old_y = y(chart.data.timeseries[1900].y);
	}
	line_data = [];

	// for(yr in chart.data.timeseries) {
	// 	// console.log(y);
	// 	tmp = {};
	// 	tmp["x"] = chart.data.timeseries[yr].x;
	// 	tmp["y"] = chart.data.timeseries[yr].y;
	// 	line_data.push(tmp);
	// }

	new_x = x(chart.data.timeseries[year].x);
	new_y = y(chart.data.timeseries[year].y);

	line_data.push({"x":old_x, "y":old_y});
	line_data.push({"x":old_x, "y":old_y});
	line_data.push({"x":new_x, "y":new_y});
	line_data.push({"x":new_x, "y":new_y});

	var line = d3.svg.line()
      .interpolate("basis")
      .x(function(d) {return d.x;})
      .y(function(d) {return d.y;})

    if (remove_path) {
    	d3.select(".plot").selectAll(".trace").remove();
    } else {
    	var path = d3.selectAll(".plot").append("path")
    		.attr("class", "trace")
      		.attr("d", line(line_data))
      		.attr("stroke", "steelblue")
      		.attr("stroke-width", "3")
      		.attr("fill", "none")
      		.style("opacity", 0.3);

    	var totalLength = path.node().getTotalLength();
    	path.attr("stroke-dasharray", totalLength + " " + totalLength)
			.attr("stroke-dashoffset", totalLength)
			.transition()
			.duration(222)
			.ease("basis")
			.attr("stroke-dashoffset", 0);
    }
	target
		  .transition()
		  .duration(222).ease("basis")
		  .attr("transform", "translate("+ new_x + "," + new_y + ")");
	target.select("text").text(function(d) {return chart.data.word + "," + year});
};

function drawScatter() {
	// var sliderDiv = d3.select("#slider");
	var div = d3.select(chart.selector);
	div.selectAll("*").remove();
	div.attr('id','scatterChart');
	var dim = {height: div.style("height").slice(0,-2), width: div.style("width").slice(0,-2)};
	var margin = {top: dim.height/10, right: dim.height/20, bottom: dim.height/5, left: dim.height/5};
	xAxisLen = (dim.width-margin.left - margin.right);
	yAxisLen = (dim.height - margin.top - margin.bottom);
	var x = d3.scale.linear().range([0, xAxisLen]);
	var y = d3.scale.linear().range([yAxisLen, 0]);
	// div.append("input")
	//     		.attr("id","timeSlider")
	//     		.attr("type","range")
	//     		.attr("min",1900)
	//     		.attr("max",2005)
	//     		.attr("step",5)
	//     		.attr("value",1900)
	//     		.on("change",change)
	//     		.style("width",xAxisLen+"px")
	//     		.style("margin-top",(margin.top)/2+"px")
	//     		.style("margin-left",(margin.left)+"px")
	//     		.style("margin-bottom",(margin.bottom/8)+"px")
	var points_data = [];
	for(idx in chart.data.other_words) {
		tmp = {};
		tmp["x"] = chart.data.other_words[idx].x;
		tmp["y"] = chart.data.other_words[idx].y;
		points_data.push(tmp);
	}
	for(yr in chart.data.timeseries) {
		// console.log(y);
		tmp = {};
		tmp["x"] = chart.data.timeseries[yr].x;
		tmp["y"] = chart.data.timeseries[yr].y;
		points_data.push(tmp);
	}

	x.domain([d3.min(points_data, function(d){return d.x})-1, d3.max(points_data, function(d){return d.x})+1]);
  	y.domain([d3.min(points_data, function(d){return d.y})-1, d3.max(points_data, function(d){return d.y})+1]);
	var palette = d3.scale.category10();
    var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom")
	    .ticks(4)
	    .innerTickSize(-yAxisLen)
	    .outerTickSize(0)
	    .tickFormat("");

	var xAxis_top = d3.svg.axis()
	    .scale(x)
	    .orient("top")
	    .ticks(4)
	    .innerTickSize(0)
	    .outerTickSize(0)
	    .tickFormat("");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left")
	    .ticks(2)
	    .innerTickSize(-xAxisLen)
	    .outerTickSize(0)
	    .tickFormat("");

	var yAxis_right = d3.svg.axis()
	    .scale(y)
	    .orient("right")
	    .ticks(2)
	    .innerTickSize(0)
	    .outerTickSize(0)
	    .tickFormat("");

    var plotArea = div.append("svg");
		// plotArea.append("g").append("text")
		// 		.attr("class","axisTitle")
	 //            .attr("text-anchor", "middle")
	 //            .attr("transform", "translate("+ (margin.left/3) +","+(dim.height/2)+") rotate(-90)")
	 //            .text(chart.yAxisTitle);

	 //     plotArea.append("g").append("text")
	 //     		.attr("class","axisTitle")
	 //            .attr("text-anchor", "middle")
	 //            .attr("transform", "translate("+ (dim.width/2) +","+(dim.height-(margin.bottom/2))+")")
	 //            .text(chart.xAxisTitle);

	    plotArea.append("g").append("text")
	     		.attr("class","title")
	            .attr("text-anchor", "start")
	            .attr("transform", "translate("+ (xAxisLen/2) +","+margin.top/2+")")
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

	plot.append("g")
		.attr("class","axis")
	    .call(xAxis_top)
	    .selectAll("text")

	plot.append("g")
		.attr("class","axis")
	    .call(yAxis);

	plot.append("g")
		.attr("class","axis")
		.attr("transform", "translate(" + xAxisLen + " ,0)")
	    .call(yAxis_right);

	plot.append("g")
		.attr("class", "target")
		.append("circle")
        .attr("r", 5)
        .attr("cx", 0)
        .attr("cy", 0)
        .style("fill", function(d) {return palette("9");});

    var target = plot.selectAll(".target");
    target.attr("transform", "translate("+ x(chart.data.timeseries[1900].x) + "," +  y(chart.data.timeseries[1900].y) + ")")
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
	  .text(function(d) { return chart.data.word + "," + 1900; });

	var points = plot.selectAll(".points")
      .data(chart.data.other_words)
    .enter().append("g")
    .attr("class", "points");

    points.append("circle")
      .attr("r", 5)
      .attr("cx", function(d){return x(d.x);})
      .attr("cy", function(d){return y(d.y);})
      .style("fill", function(d) {return palette(d.c);})

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

  	// onSliderEvent(1900, chart, x, y)
}
var gSlider = d3.slider()
  .axis(d3.svg.axis().ticks(20).tickFormat(d3.format("d")))
  .min(1900)
  .max(2005)
  .step(5)
  .on("slide", function(evt, value) {
     change(value, true);
  }).animate(timeDuration);
gSlider = gSlider.value(1900);
d3.select('#slider').call(gSlider);
