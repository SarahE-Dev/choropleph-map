
// Create the SVG container


// Load the data
fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json').then(response => {
    return response.json();
}   ).then(educationData => {    
    fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json').then(response => {
        return response.json()
    }).then(geoData => {
        console.log(geoData);
        console.log(educationData);

        const educationMap = {}

        educationData.forEach(d => {
            educationMap[d.fips] = {
                education: d.bachelorsOrHigher,
                area_name: d.area_name
              };
        })

        

        const color = d3.scaleOrdinal()
        .domain([0, 100])
        .range(d3.schemeBlues[9])

        const svg = d3.select('body').append('svg')
        .attr('width', 1000)
        .attr('height', 800)

        const legend = svg.append('g')
        .attr('id', 'legend')
        
        .selectAll('rect')
        .data(color.range())
        .enter()
        .append('rect')
        .attr('x', (d, i) => i * 30)
        .attr('y', 0)
        .attr('width', 30)
        .attr('height', 30)
        .attr('fill', d => d)
        .attr('stroke', 'black')


        svg.selectAll('county')
        .data(topojson.feature(geoData, geoData.objects.counties).features)
        .enter()
        .append('path')
        .attr('class', 'county')
        .attr('data-fips', d => d.id)
        .attr('data-education', d => educationMap[d.id].education || 0)
        .attr('fill', d => color(educationMap[d.id].education || 0))
        .attr('d', d3.geoPath())
        .attr('stroke', 'black')
        .on('mouseover', function( d, event) {
            const education = educationMap[d.id].education || 0;
            const area_name = educationMap[d.id].area_name || '';
            const tooltip = d3.select('#tooltip')
            .style('opacity', 1)
            .attr('data-education', education)
            .html(`County: ${area_name}<br>Education: ${education}%`)
            .style('left', event.pageX + 10 + 'px')
            .style('top', event.pageY - 28 + 'px')
        })
        .on('mouseout', function() {
            d3.select('#tooltip')
            .style('opacity', 0)
        })
    })
})

    