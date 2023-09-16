// set the dimensions and margins of the graph
var margin = {top: 40, right: 50, bottom: 50, left: 200 },
width = 1400 - margin.left - margin.right,
height = 700 - margin.top - margin.bottom;


// Parse the Data
d3.csv("/pcp_data", function(data) {

// Get the Keys
var keys = d3.keys(data[0])

// Get the labels
var labels = keys.filter(function(d){
return d != 'county'
})

/*
for(i in data[0]){
console.log(data[0][i], typeof(data[0][i]))
}
*/


var order = ['state', 'total_population', 'percent_homeowners', 
'percent_minorities', 'percent_insufficient_sleep', 'percent_unemployed_CDC',
'percent_frequent_mental_distress', 'percent_below_poverty', 
'percent_frequent_physical_distress', 'percent_fair_or_poor_health', 
'percent_no_highschool_diploma', 'per_capita_income', 'percent_adults_with_obesity',
'percent_excessive_drinking_cat', 'population_density_per_sqmi_cat']


var labs_obj = {
'state': 'State',
'total_population':'Population',
'percent_homeowners':'%Homeowners',
'percent_below_poverty':'%Below_Poverty',
'percent_fair_or_poor_health':'%Poor_Health',
'percent_frequent_physical_distress':'%Physical_Distress',
'percent_adults_with_obesity':'%Obesity',
'percent_frequent_mental_distress':'%Mental_Distress',
'percent_minorities':'%Minorities',
'percent_insufficient_sleep':'%Insufficient_Sleep',
'per_capita_income':'Per_Capita_Income',
'percent_no_highschool_diploma':'%No_Highschool_Dip.',
'percent_unemployed_CDC': '%Unemployed',
'percent_excessive_drinking_cat':'Excessive_Drinking',
'population_density_per_sqmi_cat':'Population_Density',

}


// Reorder

var inputObject = labs_obj;

var keyOrder = order;

var labs_obj_sorted = keyOrder.reduce((acc, key) => {
if (key in inputObject) {
acc[key] = inputObject[key];
}
return acc;
}, {});

//console.log(labs_obj_sorted)

var labs = Object.values(labs_obj_sorted)

//console.log(labs);
//console.log(keys, typeof(keys));

cols = d3.keys(data[0]).filter(function(d) { 
return d != "state" && d != "county" && d != "percent_excessive_drinking_cat" && d != "population_density_per_sqmi_cat"
})

//console.log(data);
final_data = []

var color_labs = [];

//console.log(keys[0] in cols)

for (var i = 0; i<data.length; i++) 
{
for(j in keys)
{
  if(j in cols)
  {
      data[i][cols[j]] = parseFloat(data[i][cols[j]]);

  }

}
}

var data = data.map(function(item) { 
delete item.county; 
color_labs.push(item.Labels);
delete item.Labels;
return item; 
});

//console.log(labs);
/*
for(i in data[0]){
console.log(data[0][i], typeof(data[0][i]))
}
*/
//console.log(data);

final_data = []

// Reorder
for (var i = 0; i < data.length; i++)
{
var inputObject = data[i];

var keyOrder = order;

var outputObject = keyOrder.reduce((acc, key) => {
if (key in inputObject) {
  acc[key] = inputObject[key];
}
return acc;
}, {});

final_data.push(outputObject);
}


var allScales = {};

Object.keys(final_data[0]).forEach(function(key) {
if (typeof final_data[0][key] === 'number') {
allScales[key] = d3.scaleLinear()
.domain(d3.extent(final_data, function(d) { return d[key]; }))
.range([height, 0]);
} 
else {
allScales[key] = d3.scalePoint()
.domain(final_data.map(function(d) { return d[key]; }))
.range([height, 0])
.padding(1);
}
});

// Define your axis
var allAxis = {};
Object.keys(allScales).forEach(function(key) {
allAxis[key] = d3.axisLeft(allScales[key]);
});

// Range of colors
var color = d3.scaleOrdinal()
      .domain(color_labs)
      .range(["red", "green"]);
let uniqueLabels = [...new Set(labels)]
l0 = uniqueLabels[0]
l1 = uniqueLabels[1]
color_labels = {
l0: color(l0),
l1: color(l1)
}
// Create canvas 
var canvas = d3.select("body").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Add axes
canvas.selectAll(".axis")
.data(Object.keys(allScales))
.enter()
.append("g")
.attr("class", "axis")
.attr("transform", function(d) { return "translate(" + (width / (Object.keys(allScales).length - 1)) * Object.keys(allScales).indexOf(d) + ",0)"; })
.each(function(d) { d3.select(this).call(allAxis[d]); })
.append("text")
.attr("class", "title")
.attr("text-anchor", "middle")
.attr("y", height + 20)
.attr("x", function(d) { return 0.001 * ((width / (Object.keys(allScales).length - 1)) * Object.keys(allScales).indexOf(d)); })
.attr("fill", "black")
.attr("font-size", "12px")
.text(function(d, i) { return labs[i]; })
.attr("transform", function(d, i) { 
return "rotate(-15 " + 0.01 * ((width / (Object.keys(allScales).length - 1)) * Object.keys(allScales).indexOf(d)) + "," + (height + 20) + ")";
})
.raise();


canvas.selectAll("text")
.data(cols)
.enter()
.append("g")
.attr("class", "axis")
.attr("x", 20)
.attr("y", 500)


// Add the lines
var line = d3.line()
.x(function(d, i) { return 1* (width / (Object.keys(allScales).length - 1)) * i; })
.y(function(d) { return allScales[d[0]](d[1]); });

canvas.selectAll(".line")
.data(data)
.enter().append("path")
.attr("class", "line")
.attr("stroke-opacity",0.3)
.attr("d", function(d) {
return line(Object.keys(d).map(function(key) {
return [key, d[key]];
}));
})
.attr("stroke", function(d, i) {
return color(color_labs[i])
})
.attr("stroke-width", 2)
.attr("fill", "none");

// Plot name
canvas.append("text")
  .attr("x", (width / 2))
  .attr("y", -15)
  .attr("text-anchor", "middle")
  .style("font-size", "18px")
  .style("text-decoration", "underline")
  .text("PCP Plot");

// Legend
canvas.append("rect").attr("x",width-65).attr("y",30).attr("width", 15).attr("height", 1).style("fill", color_labels['l0'])
canvas.append("rect").attr("x",width-65).attr("y",50).attr("width", 15).attr("height", 1).style("fill", color_labels['l1'])
canvas.append("text").attr("x", width-45).attr("y", 30).text(" 0").style("font-size", "15px").attr("alignment-baseline","middle")
canvas.append("text").attr("x", width-45).attr("y", 50).text(" 1").style("font-size", "15px").attr("alignment-baseline","middle")



});