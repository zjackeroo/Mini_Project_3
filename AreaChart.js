
export function AreaChart(container){
    
    var listeners = { brushed: null };

    const margin = ({top: 20, right: 20, bottom: 40, left: 50});
    const w = 650 - margin.left - margin.right;
    const h = 150 - margin.top - margin.bottom;
    
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
        .attr("class", "area");

        
    var xAxis = d3.axisBottom()
        .scale(xScale);

    var yAxis = d3.axisLeft()
        .scale(yScale);

    var xAxisDisplay = svg.append("g")
        .attr('class', 'axis x-axis');

    var yAxisDisplay = svg.append('g')
        .attr('class', 'axis y-axis');

    const brush = d3
        .brushX()
        .extent([[0,0],[w,h]])
        .on('brush', brushed)
        .on('end', brushed);
        
    svg
    .append("g")
    .attr('class', 'brush')
    .call(brush);

    function brushed(event) {
        if (event.selection) {
            listeners["brushed"](event.selection.map(xScale.invert));
        }
      };
    

    function update(data){ 
        xScale.domain([d3.min(data, d=>d.date), d3.max(data,d=>d.date)]);
        yScale.domain([0, d3.max(data, d=>d.total)]);

        var area = d3.area()
            .x(function(d) { return xScale(d.date); })
            .y0(function() { return yScale.range()[0]; })
            .y1(function(d) { return yScale(d.total); });
        d3.select(".area")
            .datum(data)
            .attr('fill', "#146EA6")
            .attr("d",area)

        xAxisDisplay
            .call(xAxis)
            .attr("transform", `translate(0, ${h})`);
        yAxisDisplay
            .call(yAxis)
    }
    function on(event, listener) {
		listeners[event] = listener;
    }
	return {
		update,
		on
	}
};