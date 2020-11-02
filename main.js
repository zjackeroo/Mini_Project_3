import {AreaChart} from './AreaChart.js';
import {StackedAreaChart} from './StackedAreaChart.js';

d3.csv('earthquake.csv', d3.autoType).then(data=>{
    
    console.log(data);

    // var columns = data.columns.slice(1,-1);

    // data.forEach(d=>{
    //     let sum = 0; 
    //     columns.forEach(col => sum = sum + d[col]); 
    //     // console.log(sum); 
    //     d.total = sum;
    // });

    // var chart1 = AreaChart(".total_chart");
    // chart1.update(data);
    // chart1.on("brushed", (range)=>{
    //     chart2.filterByDate(range); 
    // });

    var chart2 = StackedAreaChart(".stacked_chart");
    chart2.update(data);

    
});