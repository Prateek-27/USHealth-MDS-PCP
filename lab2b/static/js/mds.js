UpdateGraph();
        // Function to Update Graph / Plot 
        function UpdateGraph() {
    
            var selectedval = 'Data';

            // Remove Exisiting Plot on Canvas
            d3.select('#plot').selectAll("*").remove();
            
            var margin = {top: 40, right: 50, bottom: 50, left: 300 };

            // Initializations
            var width = 1200;
            var height = 600;
            var left_padding = 150;
            var top_padding = 75;
            var graphName;
    
            // Getting the selected attribute (Data or Variable)
            attribute = document.getElementById("list").value;
            //console.log(attribute)
            
            // Canvas
            var canvas = d3.select("#plot")
                        .append("svg")
                        .attr("width", width + 2 * left_padding)
                        .attr("height", height + 2 * top_padding)
                        .append("g")
                        .attr('transform', 'translate(' + left_padding + ',' + top_padding + ')');


            if(attribute == 'Data')
            {
                d3.json('/mds_data', function (error, data) {

                    //console.log(data);
                    
                    var x = data.x;
                    var y = data.y;
                    var labels = data.labels;
                    
                    var scatter_data = [];
                    
                    for (i = 0; i < x.length; i++) {
                        scatter_data.push(
                            {
                                x: x[i],
                                y: y[i],
                                label: labels[i],
                            }
                        )
                    };

                    x_max_value = d3.max(x);
                    x_min_value = d3.min(x)
                    y_max_value = d3.max(y)
                    y_min_value = d3.min(y)

                    // Scaling
                    // X Axis
                    var widthScale = d3.scaleLinear()
                        .domain([x_min_value-1, x_max_value+1])
                        .range([0, width]);
                    canvas.append("g")
                        .attr("transform", "translate(0," + height + ")")
                        .call(d3.axisBottom(widthScale));
                    canvas.append("g")
                        .attr("transform", "translate(0," + 0 + ")")
                        .call(d3.axisBottom(widthScale));

                    // Add Y axis
                    var heightScale = d3.scaleLinear()
                        .domain([y_min_value-1, y_max_value+1])
                        .range([height, 0]);

                    canvas.append("g")
                        .call(d3.axisLeft(heightScale))
                        .attr("transform", "translate(" + width + "," + 0 + ")");
                    canvas.append("g")
                        .call(d3.axisLeft(heightScale))
                        .attr("transform", "translate(" + 0 + "," + 0 + ")");


                    // Coloring
                    // Define the domain as labels
                    let uniqueLabels = [...new Set(labels)]
                    //console.log(uniqueLabels[0], uniqueLabels[1]);

                    // Range of colors
                    var color = d3.scaleOrdinal()
                        .domain(uniqueLabels)
                        .range(["red", "green"]);
                    
                    l0 = uniqueLabels[0]
                    l1 = uniqueLabels[1]
                    color_labels = {
                        l0: color(l0),
                        l1: color(l1)
                    }
                    //console.log(color_labels);

                    canvas.append('g')
                        .selectAll("dot")
                        .data(scatter_data)
                        .enter()
                        .append("circle")
                        .attr("cx", function (d) { return widthScale(d.x); })
                        .attr("cy", function (d) { return heightScale(d.y); })
                        .attr("r", 2)
                        .style("fill", function (d) { return color(d.label) });

                    // Labeling the graph and axises
                    canvas.append("text")
                        .attr("x", (width / 2))
                        .attr("y", 0 - (top_padding / 2))
                        .attr("text-anchor", "middle")
                        .style("font-size", "18px")
                        .style("text-decoration", "underline")
                        .text("MDS Plot for Data");

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

                    canvas.append("circle").attr("cx",width-110).attr("cy",30).attr("r", 6).style("fill", color_labels['l0'])
                    canvas.append("circle").attr("cx",width-110).attr("cy",50).attr("r", 6).style("fill", color_labels['l1'])
                    canvas.append("text").attr("x", width-90).attr("y", 30).text("Label 0").style("font-size", "15px").attr("alignment-baseline","middle")
                    canvas.append("text").attr("x", width-90).attr("y", 50).text("Label 1").style("font-size", "15px").attr("alignment-baseline","middle")





                });

            }

            else if(attribute == 'Variable')
            {
                d3.json('/mds_variable', function (error, data) {

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

                    canvas.append('g')
                        .selectAll("dot")
                        .data(scatter_data)
                        .enter()
                        .append("circle")
                        .attr("cx", function (d) { return widthScale(d.x); })
                        .attr("cy", function (d) { return heightScale(d.y); })
                        .attr("r", 4)
                        .attr("fill", "red");

                        canvas.selectAll(".label")
                        .data(scatter_data)
                        .enter()
                            .append("text")
                            .attr('class', 'label')
                            .attr("x", function (d) { return widthScale(d.x + 0.01); })
                            .attr("y", function (d) { return heightScale(d.y); })
                            .text(function (d) { return d.col; })
                            .attr('fill', "green");
                    
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

            }

            
    
    
        }