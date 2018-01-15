var svg = d3.select("svg"),
    width = +500,
    height = +200,
    radius = Math.min(width, height) / 2,
    g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var labels = d3.select("#labels");

var color = d3.scaleOrdinal(["#98abc5",
    "#8a89a6",
    "#7b6888",
    "#6b486b",
    "#a05d56",
    "#d0743c",
    "#ff8c00",
    "#e34d01",
    "#ccff05",
    "#3e7eca",
    "#aa0092",
    "#b32e4f"]);

var pie = d3.pie()
    .sort(null)
    .value(function(d) { return d.market_cap; });

var path = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

var outerArc = d3.arc()
    .innerRadius(radius * 0.9)
    .outerRadius(radius * 0.9);


var label = d3.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);

var csvData = "currency,market_cap\n";
csvData += "Ripple,8082383399\n";
csvData += "Bitcoin Cash,8767760760\n";
csvData += "Litecoin,3642098421\n";
csvData += "NEM,2514744000\n";
csvData += "Dash,2363329943\n";
csvData += "IOTA,1706859515\n";
var data = d3.csvParse(csvData);
data.forEach(function(d) {
    d.market_cap = +d.market_cap;
    return d;
});

var arc = g.selectAll(".arc")
    .data(pie(data))
    .enter().append("g")
    .attr("class", "arc");



arc.append("path")
    .attr("d", path)
    .attr("fill", function(d) { return color(d.data.currency); });



// Now we'll draw our label lines, etc.


//--------------------------------------------

arc.append("text")

    .attr("transform", function(d,i){
        var pos = outerArc.centroid(d);
        pos[0] = radius * (midAngle(d) < Math.PI ? 1.1 : -1.1);


        var percent = (d.endAngle - d.startAngle)/(2*Math.PI)*100
        if(percent<3){
            //console.log(percent)
            pos[1] += i*15
        }
        return "translate("+ pos +")";
    })
    .text(function(d) { return d.data.currency; })
    .attr("fill", function(d,i) { return color(i); })
    .attr("text-anchor", 'left')
    .attr("dx", function(d){
        var ac = midAngle(d) < Math.PI ? 0:-50
        return ac
    })
    .attr("dy", 5 )


function midAngle(d) {
    return d.startAngle + (d.endAngle - d.startAngle) / 2;
}

var polyline = g.selectAll("polyline")
    .data(pie(data), function(d) {
        return d.data.currency;
    })
    .enter()
    .append("polyline")
    .attr("points", function(d,i) {
        var pos = outerArc.centroid(d);
        pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
        var o=   outerArc.centroid(d)
        var percent = (d.endAngle -d.startAngle)/(2*Math.PI)*100
        if(percent<3){
            //console.log(percent)
            o[1]
            pos[1] += i*15
        }
        //return [label.centroid(d),[o[0],0[1]] , pos];
        return [label.centroid(d),[o[0],pos[1]] , pos];
    })
    .style("fill", "none")
    //.attr('stroke','grey')
    .attr("stroke", function(d,i) { return color(i); })
    .style("stroke-width", "1px");