import {AreaChart} from './AreaChart.js';
import {StackedAreaChart} from './StackedAreaChart.js';

var csvdata;
var data = d3.csv('unemployment.csv', d3.autoType).then(data=>{
    csvdata = data;
    console.log(data);

    var columns = csvdata.columns.slice(1,-1);

    csvdata.forEach(d=>{
        let sum = 0; 
        columns.forEach(col=>sum = sum + d[col]); 
        // console.log(sum); 
        d.total = sum;
    });

    var chart1 = AreaChart(".total_chart");
    chart1.update(csvdata);
    chart1.on("brushed", (range)=>{
        chart2.filterByDate(range); 
    });

    var chart2 = StackedAreaChart(".stacked_chart");
    chart2.update(csvdata);

    
});