(function() {
	var margin = {top: 20, right: 30, bottom: 30, left: 40},
    width = 700 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal().rangePoints([0, width], 1),
    y = {};

var axis = d3.svg.axis().orient("left");

var line = d3.svg.line() //define a function to convert points into a polyline
    .x(function(d) { return d.x; })
    .y(function(d) { return d.y; })
    .interpolate("linear");//line style. you can try "cardinal".

var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var cars=[];

d3.csv("cars.csv", type, function(error, data) {
    cars = data;
    drawPC();
});

function drawPC() {
    
    // Extract the list of dimensions and create a scale for each.
    for (var dim in cars[0]) {
	   if (dim != "name") {
		  y[dim] = d3.scale.linear()
			 .domain([d3.min(cars, function(d) { return +d[dim]; }), d3.max(cars, function(d) { return +d[dim]; })])
		      .range([height,0]);
	   }
    }
    
    x.domain(dimensions = d3.keys(cars[0]).filter(function(d) { return d != "name";}));

    //draw polylines
    for (var i=1; i< cars.length; i++) { //for each car

	   //prepare the coordinates for a polyline
	   var lineData = []; //initialize an array for coordinates of a polyline
	   for (var prop in cars[0]) { //get each dimension
	       if (prop != "name" ) { //skip the name dimension
	           var point = {}; //initialize a coordinate object
	           var val = cars[i][prop]; //obtain the value of a car in a dimension
		      point['x'] = x(prop); //x value: mapping the dimension  
	           point['y'] = y[prop](val);//y value: mapping the value in that dimension
	           lineData.push(point); //add the object into the array 
	       }
	   }

	   //draw a polyline based on the coordindates 
        chart.append("g")
	       .attr("class", "polyline")
	       .append("path") // a path shape
		  .attr("d", line(lineData)) //line() is a function to turn coordinates into SVG commands
    
		.on("mouseover", function(){
				console.log("in");
			d3.select(this).style("stroke", "red");})
			.on("mouseout", function(){
				console.log("out");
			d3.select(this).style("stroke", "#666").attr("stroke-width", 1);})
	}	
    //next: draw individual dimension lines
    //position dimension lines appropriately
    var g = chart.selectAll(".dimension")
	   .data(dimensions)
	   .enter().append("g")
	   .attr("class", "dimension")
	   .attr("transform", function(d) { return "translate(" + x(d) + ")"; }); //translate each axis
    
    // Add an axis and title.
    g.append("g")
	   .attr("class", "axis")
	   .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
	   .append("text")
	   .style("text-anchor", "middle")
	   .attr("y", -9)
	   .text(function(d) { return d; });
    
};

//this function coerces numerical data to numbers  
function type(d) {
    d.economy = +d.economy; // coerce to number
    d.displacement = +d.displacement; // coerce to number
    d.power = +d.power; // coerce to number
    d.weight = +d.weight; // coerce to number
    d.year = +d.year;
    return d;
}
})();

(function() {
var margin = {top: 20, right: 30, bottom: 30, left: 690},
    width = 1300 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.linear().range([50, width]),
    y = d3.scale.linear().range([height-20,0]);

var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xAxis = d3.svg.axis().scale(x).orient("bottom");

var yAxis = d3.svg.axis().scale(y).orient("left");

var cars=[];

d3.csv("cars.csv", type, function(error, data) {
    cars = data;
    drawXY();
});

function drawXY(){

    x.domain([d3.min(cars, function(d) { return d.year; }), d3.max(cars, function(d) { return d.year; })]);
    y.domain([d3.min(cars, function(d) { return d.power; }), d3.max(cars, function(d) { return d.power; })]);

    var yPos = height -20;
    chart.append("g")
	   .attr("class", "xaxis")
	   .attr("transform", "translate(0," + yPos + ")")
	   .call(xAxis);

    chart.append("g")
	   .attr("class", "yaxis")
	   .attr("transform", "translate(50,0)")
	   .call(yAxis);
    
    chart.selectAll(".dot")
	   .data(cars)
	   .enter().append("circle")
	   .attr("class", "dot")
	   .attr("cx", function(d) { return x(d.year); })
	   .attr("cy", function(d) { return y(d.power); })
	   .attr("r", 3)
		.on("mouseover", function(d) {
			console.log("in");
			d3.select(this).style("fill", "red")
		})
		.on("mouseout", function() {
			console.log("out");
			d3.select(this).style("fill", "black");
		});
		}

function type(d) {
    d.economy = +d.economy; // coerce to number
    d.displacement = +d.displacement; // coerce to number
    d.power = +d.power; // coerce to number
    d.weight = +d.weight; // coerce to number
    d.year = +d.year;
    return d;
}
})();