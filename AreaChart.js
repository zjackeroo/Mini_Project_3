export function AreaChart(container){
    
    const listeners = { brushed: null };

    const margin = ({top: 20, right: 20, bottom: 40, left: 50});
    const width = 650 - margin.left - margin.right;
    const height = 150 - margin.top - margin.bottom;
    
    var svg = d3.selectAll(container)
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var xScale = d3.scaleTime()
                   .range([0,width])
    var yScale = d3.scaleLinear()
                   .range([height,0])
    
    var xAxis = d3.axisBottom()
                  .scale(xScale);
    var yAxis = d3.axisLeft()
                  .scale(yScale);

    var xAxisLabel = svg.append("g")
                          .attr('class', 'axis x-axis');
    var yAxisLabel = svg.append('g')
                          .attr('class', 'axis y-axis');

    svg.append("path")
       .attr("class", "area");
    
    const brush = d3
        .brushX()
        .extent([[0,0],[width,height]])
        .on('brush', brushed)
        .on('end', brushed);
        
    svg.append("g")
       .attr('class', 'brush')
       .call(brush);

    function brushed(event) {
        if (event.selection) {listeners["brushed"](event.selection.map(xScale.invert))}
    }

    function update(data){ 
        xScale.domain([d3.min(data, d=>d.date), d3.max(data,d=>d.date)]);
        yScale.domain([0, d3.max(data, d=>d.total)]);

        var area = d3.area()
                     .x((d)=>xScale(d.date))
                     .y0(()=>yScale.range()[0])
                     .y1((d)=>yScale(d.total))
        
        d3.select(".area")
          .datum(data)
          .attr('fill', "skyblue")
          .attr("d",area)

        xAxisLabel.call(xAxis)
                  .attr("transform", `translate(0, ${height})`);
        yAxisLabel.call(yAxis)
    }

    function on(event, listener) {listeners[event] = listener}

	return {
		update,
		on
	}
};