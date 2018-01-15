# d3基础1

## 使用知识

* d3.select
* d3.selectAll
* selection.data
* selection.enter
* enter.append;
* selection.attr
* selection.style


## 使用D3 画圆、矩形

* 画圆
```js
    d3.select("svg")
        .selectAll("circle")
        .data([10,50,100])
        .enter().append("circle")
        .attr("cx",function (d) {
            return d;
        })
        .attr("cy",function () {
            return 100;
        })
        .attr("r",10);
```

* 画矩形

  d3.select("svg")
        .selectAll("rect")
        .data([10,50,100])
        .enter().append("rect")
        .attr("x",function (d) {
            return d+"px";
        })
        .attr("y","200px")
            .attr("width","20px")
            .attr("height","30px");
            
## 完整例子请查看
[index.html](index.html)