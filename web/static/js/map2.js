const width = 960;
const height = 500;
    const config = {
    speed: 0.003,
    verticalTilt: 0,
    horizontalTilt: 0
}
let locations = [];
const svg = d3.select('#map')
    .attr('width', width).attr('height', height);
const markerGroup = svg.append('g');
const projection = d3.geoOrthographic();
const initialScale = projection.scale();
const path = d3.geoPath().projection(projection);
const center = [width/2, height/2];

// create a tooltip
var Tooltip = d3.select("#map2")
.append("div")
.attr("class", "tooltip")
.style("opacity", 1)
.style("background-color", "white")
.style("border", "solid")
.style("border-width", "2px")
.style("border-radius", "5px")
.style("padding", "5px")

// Three function that change the tooltip when user hover / move / leave a cell
var mouseover = function(d) {
Tooltip.style("opacity", 1)
// config.speed = 0.001;
}
var mousemove = function(d) {
    // console.log("D" + d.species_count)
Tooltip
  .html(d.country_name + "<br>" + "Species Endangered: " + d.count)
  .style("left", (d3.mouse(this)[0] + 300) + "px")
  .style("top", (d3.mouse(this)[1] + 50) + "px")
 
//   console.log("Tooltip")
}
var mouseleave = function(d) {
    Tooltip.style("opacity", 0)
   
}


console.log(get_coordinates());
drawGlobe();    
drawGraticule();
enableRotation();


// const svg = d3.select('#pause_play')
//     .attr("x", width/2)
//     .attr("y", height + 10)
//     .text("PAUSE")
//     .attr("text-anchor", "middle")
//     .style("font-family", "sans-serif")
//     .on("mouseover", function() { d3.select(this).style("text-decoration", "underline") })
//     .on("mouseout", function() { d3.select(this).style("text-decoration", "none") })
//     .on("click", function() {
//         rotationOn = !rotationOn;
//         d3.select(this).text(rotationOn ? "PAUSE" : "PLAY")
//     });

function drawGlobe() {  
    d3.queue()
        .defer(d3.json, 'https://gist.githubusercontent.com/mbostock/4090846/raw/d534aba169207548a8a3d670c9c2cc719ff05c47/world-110m.json')          
        .await((error, worldData) => {
            svg.selectAll(".segment")
                .data(topojson.feature(worldData, worldData.objects.countries).features)
                .enter().append("path")
                .attr("class", "segment")
                .attr("d", path)
                .style("stroke", "#888")
                .style("stroke-width", "1px")
                .style("fill", (d, i) => '#e5e5e5')
                .style("opacity", ".6")
                locations = get_coordinates();
                drawMarkers();
                                  
        });
}

function drawGraticule() {
    const graticule = d3.geoGraticule()
        .step([10, 10]);

    svg.append("path")
        .datum(graticule)
        .attr("class", "graticule")
        .attr("d", path)
        .style("fill", "#fff")
        .style("stroke", "#ccc");
}

function enableRotation() {
    
    d3.timer(function (elapsed) {
        projection.rotate([config.speed * elapsed - 120, config.verticalTilt, config.horizontalTilt]);
        svg.selectAll("path").attr("d", path)
        
        drawMarkers();
    });
}        

function drawMarkers() {
    const markers = markerGroup.selectAll('circle')
        .data(locations);
    markers
        .enter()
        .append('circle')
        .merge(markers)
        .attr('cx', d => projection([d.longitude, d.latitude])[0])
        .attr('cy', d => projection([d.longitude, d.latitude])[1])
        .attr('fill', d => {
            const coordinate = [d.longitude, d.latitude];
            gdistance = d3.geoDistance(coordinate, projection.invert(center));
            return gdistance > 1.57 ? 'none' : 'steelblue';
        })
        .attr('r', 7)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);


    markerGroup.each(function () {
        this.parentNode.appendChild(this);
    });
}



function get_coordinates() {
var species_coordinates_dict = []

var species =  d3.json(`http://127.0.0.1:5000/api/v1.0/country_counts`, function(data) {
// console.log(data);
    var coordinates = {}

    data.forEach((country)=>{
            coordinates.latitude = country.latitude
            coordinates.longitude = country.longitude
            coordinates.count = country.species_count
            coordinates.country_name = country.country_name
            species_coordinates_dict.push(coordinates)
            coordinates = {}
    });

    // console.log(species_coordinates_dict);

    });

return species_coordinates_dict;

}
