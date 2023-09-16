var update_pcp = false;

// set the dimensions and margins of the graph
var margin = {top: 40, right: 50, bottom: 50, left: 250 },
    width = 1000 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

    var width = 1000;
    var height = 600;
    var left_padding = 250;
    var top_padding = 75;
    var graphName;


d3.json('/mds_variable', function (error, data) {

var canvas = d3.select("#mds_plot")
                .append("svg")
                .attr("width", width + 2 * left_padding)
                .attr("height", height + 2 * top_padding)
                .append("g")
                .attr('transform', 'translate(' + left_padding + ',' + top_padding + ')');

var labs = ['Population', 
'%Homeowners', '%Below_Poverty', 
'%Poor_Health', '%Physical_Distress', 
'%Obesity', '%Mental_Distress', 
'%Minorities', '%Insufficient_Sleep', 'Per_Capita_Income', 
'%No_Highschool_Dip.', '%Unemployed']

//console.log(data);
var x = data.x;
var y = data.y;
var cols = data.cols;
//var labels = data.labels;

var scatter_data = [];

for (i = 0; i < x.length; i++) {
    scatter_data.push(
        {
            x: x[i],
            y: y[i],
            col: cols[i],
        }
    )
};

x_max_value = d3.max(x);
x_min_value = d3.min(x)
y_max_value = d3.max(y)
y_min_value = d3.min(y)

//console.log(x_min_value, y_min_value);
//console.log(x_max_value, y_max_value);

// Scaling
// X Axis
var widthScale = d3.scaleLinear()
    .domain([x_min_value+(0.2*x_min_value), x_max_value+(0.2*x_max_value)])
    .range([0, width]);
canvas.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(widthScale));
canvas.append("g")
    .attr("transform", "translate(0," + 0 + ")")
    .call(d3.axisBottom(widthScale));

// Add Y axis
var heightScale = d3.scaleLinear()
    .domain([y_min_value+(0.2*y_min_value), y_max_value+(0.2*y_max_value)])
    .range([height, 0]);

canvas.append("g")
    .call(d3.axisLeft(heightScale))
    .attr("transform", "translate(" + width + "," + 0 + ")");
canvas.append("g")
    .call(d3.axisLeft(heightScale))
    .attr("transform", "translate(" + 0 + "," + 0 + ")");

selectedPoints = [];

var dots = canvas.append('g')
    .selectAll("dot")
    .data(scatter_data)
    .enter()
    .append("circle")
    .attr("cx", function (d) { return widthScale(d.x); })
    .attr("cy", function (d) { return heightScale(d.y); })
    .attr("r", 6)
    .on("click", function(d) {
    // When a circle is clicked, store its data if not clicked before
        if((selectedPoints.indexOf(d) == -1)){
            selectedPoints.push(d)
            d3.select(this).classed("highlight", true);
        }
        if(selectedPoints.length == 12){
            update_pcp = true;
            updatePCP(selectedPoints)
            dots.classed("highlight", false);
            selectedPoints = [];
        }

        console.log(update_pcp);
        console.log(selectedPoints)}
        )
    .attr("fill", "red");

    canvas.selectAll(".text-label")
    .data(scatter_data)
    .enter()
        .append("text")
        .classed("text-label", true)
        .attr("x", function (d) { return widthScale(d.x + 0.01); })
        .attr("y", function (d) { return heightScale(d.y + 0.01); })
        .text(function (d) { return d.col; })
        .attr('fill', "purple");

// Labeling the graph and axises
canvas.append("text")
    .attr("x", (width / 2))
    .attr("y", 0 - (top_padding / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
    .style("text-decoration", "underline")
    .text("MDS Plot for Variables");

canvas.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", height + 45)
    .text("Dimension 1");

canvas.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "middle")
    .attr("x", -height / 2)
    .attr("y", -60)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Dimension 2");



});


   
// Parse the Data
d3.csv("/pcp_data", function(data) {
    // Define your allScales
// Define your allScales
// Define your allScales



var keys = d3.keys(data[0])

var labels = keys.filter(function(d){
    return d != 'county'
})


var labs = ['Population', 
'%Homeowners', '%Below_Poverty', 
'%Poor_Health', '%Physical_Distress', 
'%Obesity', '%Mental_Distress', 
'%Minorities', '%Insufficient_Sleep', 'Per_Capita_Income', 
'%No_Highschool_Dip.', '%Unemployed']

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
    delete item.state; 
    delete item.percent_excessive_drinking_cat; 
    delete item.population_density_per_sqmi_cat; 
    return item; 
});

//console.log(labs);

for(i in data[0]){
    //console.log(data[0][i], typeof(data[0][i]))
}
//console.log(data);

var allScales = {};
Object.keys(data[0]).forEach(function(key) {
  if (typeof data[0][key] === 'number') {
    allScales[key] = d3.scaleLinear()
      .domain(d3.extent(data, function(d) { return d[key]; }))
      .range([height, 0])
;
  } 
  else {
    allScales[key] = d3.scalePoint()
      .domain(data.map(function(d) { return d[key]; }))
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

// Create Canvas 
var canvas = d3.select("#pcp_plot").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Add the axis
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


  
  /*
  .append("text")
  .attr("text-anchor", "middle")
  .attr("y", 300)
  .attr("x", function(d) { return (width / (Object.keys(allScales).length - 1)) * Object.keys(allScales).indexOf(d); })
  .text("Attribute");
*/

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


  canvas.append("text")
        .attr("x", (width / 2))
        .attr("y", -15)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("text-decoration", "underline")
        .text("PCP Interactive Plot");

});


// Function to arrange PCP according to points selected 

function updatePCP(selectedPoints){

d3.select('#pcp_plot').selectAll("*").remove();

console.log("FROM PCP UPDATE");
console.log(selectedPoints);

d3.csv("/pcp_data", function(data) {
 
var order = [];

for (var i = 0; i < selectedPoints.length; i++) 
{
    order.push(selectedPoints[i]['col'])
}

console.log(order);


var keys = d3.keys(data[0])

var labels = keys.filter(function(d){
    return d != 'county'
})


var labs_obj = {
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

}

var inputObject = labs_obj;

var keyOrder = order;

var labs_obj_sorted = keyOrder.reduce((acc, key) => {
  if (key in inputObject) {
    acc[key] = inputObject[key];
  }
  return acc;
}, {});


var labs = Object.values(labs_obj_sorted)

//console.log(keys, typeof(keys));

cols = d3.keys(data[0]).filter(function(d) { 
    return d != "state" && d != "county" && d != "percent_excessive_drinking_cat" && d != "population_density_per_sqmi_cat"
})

//console.log(data);


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
    delete item.state; 
    delete item.percent_excessive_drinking_cat; 
    delete item.population_density_per_sqmi_cat; 
    return item; 
});


console.log(data[0]);

final_data = []

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

console.log(final_data[0]);

//console.log(labs);

for(i in data[0]){
    //console.log(data[0][i], typeof(data[0][i]))
}
//console.log(data);

var allScales = {};
Object.keys(final_data[0]).forEach(function(key) {
  if (typeof final_data[0][key] === 'number') {
    allScales[key] = d3.scaleLinear()
      .domain(d3.extent(final_data, function(d) { return d[key]; }))
      .range([height, 0])
;
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

// Create canvas 
var canvas = d3.select("#pcp_plot").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Add the axis
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
  .data(final_data)
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

canvas.append("text")
        .attr("x", (width / 2))
        .attr("y", -15)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("text-decoration", "underline")
        .text("PCP Interactive Plot");

});

}
