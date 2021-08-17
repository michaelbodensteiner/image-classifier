var species =  d3.json('http://127.0.0.1:5000/api/v1.0/species', function(data) {
    console.log(data);
    
    d3.select("tbody")
    .selectAll("tr")
    .data(data)
    .enter()
    .append("tr")
    .html(function(d) {
      return `<td>${d.category}</td><td>${d.year}</td><td>${d.mammals}</td><td>${d.birds}</td><td>${d.reptiles}</td><td>${d.total}</td>`;
    });
});