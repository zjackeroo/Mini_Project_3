var csvdata;
var dummy;
var data = d3.csv('unemployment.csv', d3.autoType).then(data => {
    console.log("reached data loading")
    csvdata = data;
    console.log(data);
    var columns = csvdata.columns.slice(1,-1);
    csvdata.forEach(
        d=>{let sum = 0; 
        columns.forEach(col=>sum = sum+ d[col]); 
        console.log(sum); 
        d.total = sum;}
    );
    var chart = AreaChart(".chart");
    chart.update(csvdata);

    var chart2 = StackedAreaChart(".chart");
    chart2.update(csvdata);
});

function AreaChart(container){
    const margin = ({top: 20, right: 20, bottom: 40, left: 50});
    const w = 650 - margin.left - margin.right;
    const h = 500 - margin.top - margin.bottom;
    var svg = d3.selectAll(container)
        .append("svg")
        .attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var xScale = d3.scaleTime()
        .range([0,w])
    
    var yScale = d3.scaleLinear()
        .range([h,0])
    
    svg.append("path")
        .datum(csvdata)
        .attr("class", "area");
    
    var xAxis = d3.axisBottom()
        .scale(xScale);
    
    var yAxis = d3.axisLeft()
        .scale(yScale);

    var xAxisDisplay = svg.append("g")
        .attr('class', 'axis x-axis');

    var yAxisDisplay = svg.append('g')
        .attr('class', 'axis y-axis');


	function update(data){ 
        xScale.domain([d3.min(data, d=>d.date), d3.max(data,d=>d.date)]);
        yScale.domain([0, d3.max(data, d=>d.total)]);

        var area = d3.area()
            .x(function(d) { return xScale(d.date); })
            .y0(function() { return yScale.range()[0]; })
            .y1(function(d) { return yScale(d.total); });
        d3.select(".area")
            .datum(data)
            .attr("d",area)

        xAxisDisplay
            .call(xAxis)
            .attr("transform", `translate(0, ${h})`);
        yAxisDisplay
            .call(yAxis)
	}

	return {
		update
	};
}

function StackedAreaChart(container) {
    const margin = ({top: 20, right: 20, bottom: 40, left: 50});
    const w = 650 - margin.left - margin.right;
    const h = 500 - margin.top - margin.bottom;
    var svg = d3.selectAll(container)
        .append("svg")
        .attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var xScale = d3.scaleTime()
        .range([0,w])
    
    var yScale = d3.scaleLinear()
        .range([h,0])
    
    var typeScale = d3.scaleOrdinal()
        .range(d3.schemeTableau10);
    
    var xAxis = d3.axisBottom()
        .scale(xScale);
    
    var yAxis = d3.axisLeft()
        .scale(yScale);

    var xAxisDisplay = svg.append("g")
        .attr('class', 'axis x-axis');

    var yAxisDisplay = svg.append('g')
        .attr('class', 'axis y-axis');

    const tooltip = svg
        .append("text")
        .attr('x', 0)
        .attr('y', -10)
        .attr('font-size', 10);
    
	function update(data){
        var keys = data.columns.slice(1);
        var stack = d3.stack()
            .keys(keys)
            .order(d3.stackOrderNone)
            .offset(d3.stackOffsetNone);

        var series = stack(data);
        dummy = series;
        console.log(series);
        typeScale.domain(keys);
        xScale.domain([d3.min(data, d=>d.date), d3.max(data,d=>d.date)]);
        yScale.domain([0, d3.max(series, 
            a => d3.max(a, d=>d[1]))
        ]);

        const area = d3.area()
            .x(d=>xScale(d.data.date))
            .y0(d=>yScale(d[0]))
            .y1(d=>yScale(d[1]));
        
        const areas = svg.selectAll(".area")
            .data(series, d => d.key);
        
        areas.enter()
            .append("path")
            .attr("class", function(d) { return "myArea " + d.key })
            .style("fill", function(d) { return typeScale(d.key); })
            .on("mouseover", (event, d, i) => tooltip.text(d.key))
            .on("mouseout", (event, d, i) => tooltip.text(''))
            .merge(areas)
            .attr("d", area)
        
        areas.exit().remove();
        
        xAxisDisplay
            .call(xAxis)
            .attr("transform", `translate(0, ${h})`);

        yAxisDisplay
            .call(yAxis);
	}
	return {
		update
	}
}