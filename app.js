const projectName = 'scatterplot-graph';

var url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

var req = new XMLHttpRequest();

var xScale,
    yScale,
    xAxis,
    yAxis;

var values = [];
var keys = [['Doping Allegation', 'dodgerblue'],['No Doping Allegations', 'orange']];

var height = 600;
var width = 900;
var padding = 60;

var svg = d3.select('svg')

var div = d3.select('body')
            .append('div')
            .attr('class', 'tooltip')
            .attr('id', 'tooltip')
            .style('visibility', 'hidden')
            .style('opacity', 0);


//graph setup
var makeGraph = () => {
    svg.attr('height', height)
    svg.attr('width', width);
}

//scale set up
var setScale = () => {

    xScale = d3.scaleLinear()
                .domain([d3.min(values, (int) => {
                    return int['Year']
                }) - 1, d3.max(values, (int) => {
                    return int['Year']
                }) + 1])
                .range([padding, width - padding]);
    
    yScale = d3.scaleTime()
                .domain([d3.min(values, (int) => {
                    return new Date(int['Seconds'] * 1000)
                }), d3.max(values, (int) => {
                    return new Date(int['Seconds'] * 1000)
                })])
                .range([padding, height - padding]);
}

//plot points 
var setPoints = () => {

    svg.selectAll('circle')
        .data(values)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('r', '6')
        .attr('data-xvalue', (int) => {
            return int['Year']
        })
        .attr('data-yvalue', (int) => {
            return new Date(int['Seconds'] * 1000)
        })
        .attr('cx', (int) => {
            return xScale(int['Year'])
        })
        .attr('cy', (int) => {
            return yScale(new Date(int['Seconds'] * 1000))
        })
        .attr('fill', (int) => {
            if (int['URL'] === "") {
                return 'orange'
            } else {
                return 'dodgerblue'
            }
        })
        .on('mouseover', function(d, int) {
            div.transition()
                .duration(300)
                .style('visibility', 'visible')
                .style('opacity', 0.9)

                if (int['Doping'] !== "") {
                    div.text(int['Year'] + ' - ' + int['Name'] + ' - ' + int['Time'] + ' - ' + int['Doping'])
                } else {
                    div.text(int['Year'] + ' - ' + int['Name'] + ' - ' + int['Time'] + ' - ' + 'No Allegations')
                }

            div.attr('data-year', int['Year'])
                
        })
        .on('mouseout', function(d, int) {
            div.transition()
                .duration(500)
                .style('visibility', 'hidden')
                .style('opacity', 0);
        })

}

var setAxis = () => {

    xAxis = d3.axisBottom(xScale)
                .tickFormat(d3.format('d'))

    yAxis = d3.axisLeft(yScale)
                .tickFormat(d3.timeFormat('%M:%S'))

    svg.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0, ' + (height-padding) + ')')

    
    svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', 'translate(' + padding + ', 0)')
}

//Legend //
var legendBox = svg.append('g')
                    .attr('id', 'legend');

var legend = legendBox.selectAll('#legend')
                      .data(keys)
                      .enter()
                      .append('g')
                      .attr('class', 'label')
                      .attr('transform', function(d, ind) {
                          return 'translate(0,' + (height / 2 - ind * 20) + ')';
                      });

legend.append('rect')
        .attr('x', width - 30)
        .attr('width', 18)
        .attr('height', 18)
        .style('fill', function(d) {
            return d[1];
        });

legend.append('text')
        .attr('x', width - 36)
        .attr('y', 9)
        .attr('dy', '0.35em')
        .style('text-anchor', 'end')
        .text(function(d) {
            return d[0];
        });


//fetch data 
req.open('GET', url, true)

req.onload = () => {
    values = JSON.parse(req.responseText);
    
    console.log(values);

    makeGraph();
    setScale();
    setPoints();
    setAxis();

}
req.send();


