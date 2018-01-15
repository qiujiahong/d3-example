/**
 * Created by Administrator on 2018/1/15.
 */
var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

var parseTime = d3.timeParse("%Y")
bisectDate = d3.bisector(function (d) {
    return d.hour;
}).left;

var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

var line = d3.line()
    .x(function (d) {
        return x(d.hour);
    })
    .y(function (d) {
        return y(d.value);
    });

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("data.json", function (error, data) {
    if (error) throw error;

    data.forEach(function (d) {
        d.hour = parseTime(d.hour);
        d.value = +d.value;
    });

    x.domain(d3.extent(data, function (d) {
        return d.hour;
    }));
    y.domain([d3.min(data, function (d) {
        return d.value;
    }) / 1.005, d3.max(data, function (d) {
        return d.value;
    }) * 1.005]);

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y).ticks(6).tickFormat(function (d) {
            return parseInt(d );
        }))
        .append("text")
        .attr("class", "axis-title")
        .attr("transform", "rotate(0)")
        .attr("x", 35)
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .attr("fill", "#5D6971")
        .text("利用率");

    g.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);

    var focus = g.append("g")
        .attr("class", "focus")
        .style("display", "none");

    focus.append("line")
        .attr("class", "x-hover-line hover-line")
        .attr("y1", 0)
        .attr("y2", height);

    focus.append("line")
        .attr("class", "y-hover-line hover-line")
        .attr("x1", width)
        .attr("x2", width);

    focus.append("circle")
        .attr("r", 7.5);

    focus.append("text")
        .attr("x", 15)
        .attr("dy", ".31em");

    svg.append("rect")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", function () {
            focus.style("display", null);
        })
        .on("mouseout", function () {
            focus.style("display", "none");
        })
        .on("mousemove", mousemove);

    function mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]),
            i = bisectDate(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            d = x0 - d0.hour > d1.hour - x0 ? d1 : d0;
        focus.attr("transform", "translate(" + x(d.hour) + "," + y(d.value) + ")");
        focus.select("text").text(function () {
            return d.value;
        });
        focus.select(".x-hover-line").attr("y2", height - y(d.value));
        focus.select(".y-hover-line").attr("x2", width + width);
    }
});
