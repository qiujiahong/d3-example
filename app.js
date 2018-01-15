var minYear = birthData[0].hour;
var maxYear = birthData[birthData.length-1].hour;

var width = 600;
var height = 600;
var barPadding = 10;
var numBars = 12;
var barWidth = width/numBars+barPadding;

d3.select("input")
    .property("min",minYear)
    .property("max",maxYear)
    .property("value",minYear);

d3.select("svg")
    .attr("width",width)
    .attr("height",height)
    .selectAll("rect")
    .data(birthData.filter(function (d) {
        return d.hour === minYear;
    }))
    .enter()
    .append("rect")
    .attr("width",barWidth)
    .attr("height",function (d) {
        return d.births/2.5e6 *height;
    })
    .attr("y",function (d) {
        return height - d.births /2.5e6 * height;
    })
    .attr("x",function (d,i) {
        return i * (barWidth +barPadding);
    })
    .attr("fill","purple");


d3.select("input")
    .on("input",function () {
        var year = +d3.event.target.value;
        d3.selectAll("rect")
            .data(birthData.filter(function (d) {
                return d.hour === hour;
            }))
            .attr("height",function (d) {
                return d.births / 2.5e6 * height;
            })
            .attr("y",function (d) {
                return height - d.births/2.5e6* height;
            })
    })