// CHART 1: Visualization for Bar chart with countries
var countries_list = {};
var keys = [];
var vals = [];

d3.json("http://127.0.0.1:5000/api/v1.0/countries", function(data) {   
    // Loop through array of objects then each object
    data.forEach((country) => {
    //  console.log(country["country_name"]);
        var country_json = country.country_name
    //  console.log(country_json)
    //  console.log(Object.keys(countries_list));
        if (Object.keys(countries_list).includes(country_json)) {
            // console.log("Country found in list!!", country_json)
            countries_list[country_json] = (countries_list[country_json] + 1)
        }
        else {
            // console.log("Didn't find it :( ")
            countries_list[country_json] = 1;
        }
        
    });
    // console.log(countries_list);
    var filtered = Object.fromEntries(Object.entries(countries_list).filter(([k,v]) => v>100));
        // Get the entries for each object in the array
    Object.entries(filtered).forEach(([key, value]) => {
        // Log the key and value
        // console.log(`Key: ${key} and Value ${value}`);
        keys.push(key);
        vals.push(value);
    });

    var options = {
      low: 75,
      high: 550,
      chartPadding: 30,
      classNames: {
        chart: 'ct-chart',
        series: 'ct-series',
        label: 'ct-label'
      },
      axisX: {
        offset: 75 
      }, 
      axisY: {
        offset: 225
      },
      position: 'end',
      height: 1050,
      horizontalBars: true,
    };

    var chart = new Chartist.Bar('#chart1', {
        labels: keys,
        series: [
                vals
            ]
        },options);

    chart.on('draw', function(data) {
        // If this draw event is of type bar we can use the data to create additional content
        if(data.type === 'bar') {
          // console.log(data)
          // We use the group element of the current series to append a simple circle with the bar peek coordinates and a circle radius that is depending on the value
          data.group.append(new Chartist.Svg('circle', {
            cx: data.x2,
            cy: data.y2,
            r: Math.abs(Chartist.getMultiValue(data.value.x))*0.075
          }, 'ct-slice-pie'));

          var barHorizontalCenter, barVerticalCenter, label, value;
          barHorizontalCenter = data.x1 + (data.element.width()+9);
          barVerticalCenter = data.y1 + (data.element.height()+15);
          value = data.element.attr('ct:value');
          if (value !== '0') {
            label = new Chartist.Svg('text');
            label.text(value);
            label.addClass("ct-barlabel");
            label.attr({
              x: barHorizontalCenter,
              y: barVerticalCenter,
              'text-anchor': 'right'
            });
            return data.group.append(label);
          }
        }
      });
});
// console.log(keys);
// console.log(vals);


// TABLE: Population Table
var population =  d3.json('http://127.0.0.1:5000/api/v1.0/population', function(data) {
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

//CHART 3: Donut Chart for conservation efforts
var conservation_list = {};
var other_counter = 0;
var cons_labels = [];
var donut_vals = [];

d3.json("http://127.0.0.1:5000/api/v1.0/conservation", function(data){
  data.forEach((effort) => {
    var title = effort.title
    if (Object.keys(conservation_list).includes(title)) {
      conservation_list[title] = (conservation_list[title] + 1)
    }
    else {
        // console.log("Didn't find it :( ")
        conservation_list[title] = 1;
    }
  });
  Object.entries(conservation_list).forEach(([key, value]) => {
    if (value<500) {
      other_counter = other_counter + value
      delete conservation_list[key]
    }
  });
  conservation_list["Other"] = other_counter

  // var filtered_donut = Object.fromEntries(Object.entries(conservation_list).filter(([k,v]) => v<200))
  Object.entries(conservation_list).forEach(([key, value]) => {
    cons_labels.push(key)
    donut_vals.push(value)
  });

  console.log(conservation_list)
  var sum = function(a, b) {
    return a + b
  };  

  var options_donut = {
    donut: true,
    showLabel: true,
    labelOffset: 50,
    labelPosition: 'inside',
    labelDirection: 'explode',
    height: 900,
    scale: {
      pointLabels :{
         fontStyle: "bold",
      }
    },
    ignoreEmptyValues: true,
    chartPadding: 50,
    labelInterpolationFnc: function(value, idx) {
      // console.log(donut_vals[idx]);
      var percentage = Math.round(donut_vals[idx] / donut_vals.reduce(sum) * 100) + '%';
      // console.log(percentage);
      return cons_labels[idx] + ' ' + percentage;
    }
  };

  var chart = new Chartist.Pie('#chart3', {
    series: donut_vals,
    labels: cons_labels
  }, options_donut);
  
  chart.on('draw', function(data) {
    if(data.type === 'slice') {
      // Get the total path length in order to use for dash array animation
      var pathLength = data.element._node.getTotalLength();
      // console.log(pathLength)
  
      // Set a dasharray that matches the path length as prerequisite to animate dashoffset
      data.element.attr({
        'stroke-dasharray': pathLength + 'px ' + pathLength + 'px'
      });
  
      // Create animation definition while also assigning an ID to the animation for later sync usage
      var animationDefinition = {
        'stroke-dashoffset': {
          id: 'anim' + data.index,
          dur: 500,
          from: -pathLength + 'px',
          to:  '0px',
          easing: Chartist.Svg.Easing.easeOutQuint,
          // We need to use `fill: 'freeze'` otherwise our animation will fall back to initial (not visible)
          fill: 'freeze'
        }
      };
  
      // If this was not the first slice, we need to time the animation so that it uses the end sync event of the previous animation
      if(data.index !== 0) {
        animationDefinition['stroke-dashoffset'].begin = 'anim' + (data.index - 1) + '.end';
      }
  
      // We need to set an initial value before the animation starts as we are not in guided mode which would do that for us
      data.element.attr({
        'stroke-dashoffset': -pathLength + 'px'
      });
  
      // We can't use guided mode as the animations need to rely on setting begin manually
      // See http://gionkunz.github.io/chartist-js/api-documentation.html#chartistsvg-function-animate
      data.element.animate(animationDefinition, false);
    }
  });
  
  //We update the chart every time it's created with a delay
  chart.on('created', function() {
    if(window.__anim21278907124) {
      clearTimeout(window.__anim21278907124);
      window.__anim21278907124 = null;
    }
    window.__anim21278907124 = setTimeout(chart.update.bind(chart), 15000);
  });
  
})