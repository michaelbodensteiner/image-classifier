// CHART 2: Line Chart for Population
pop_keys = [];
cr_series = [[],[],[],[]];
en_series = [[],[],[],[]];
vu_series = [[],[],[],[]];

d3.json("http://127.0.0.1:5000/api/v1.0/population", function(data) {
  data.forEach((stat_line) => {
    var year = stat_line.year
    if (pop_keys.indexOf(year)=== -1) {
      pop_keys.push(year)
    }
    if (stat_line.category == "CR") {
      cr_series[0].push(stat_line.birds)
      cr_series[1].push(stat_line.mammals)
      cr_series[2].push(stat_line.reptiles)
      cr_series[3].push(stat_line.total)
    }
    else if (stat_line.category == "EN") {
      en_series[0].push(stat_line.birds)
      en_series[1].push(stat_line.mammals)
      en_series[2].push(stat_line.reptiles)
      en_series[3].push(stat_line.total)
    }
    else {
      vu_series[0].push(stat_line.birds)
      vu_series[1].push(stat_line.mammals)
      vu_series[2].push(stat_line.reptiles)
      vu_series[3].push(stat_line.total)
    }
  }); 

  var options_line = {
    chartPadding: 100,
    low: 0,
    reverseData: true,
    plugins: [
      Chartist.plugins.legend({
        position: 'bottom', 
        legendNames: ['Birds', 'Mammals', 'Reptiles', 'Total']
      })
    ],
    axisX: {
      textAnchor: 'middle'
    }
  }

  function init() {
    var chart = new Chartist.Line('#chart2', {
        labels: pop_keys,
        series: cr_series
      }, options_line);
    
      // Let's put a sequence number aside so we can use it in the event callbacks
      var seq = 0,
        delays = 20,
        durations = 500;
      
      // Once the chart is fully created we reset the sequence
      chart.on('created', function() {
        seq = 0;
      });
      
      // On each drawn element by Chartist we use the Chartist.Svg API to trigger SMIL animations
      chart.on('draw', function(data) {
        seq++;
      
        if(data.type === 'line') {
          // If the drawn element is a line we do a simple opacity fade in. This could also be achieved using CSS3 animations.
          data.element.animate({
            opacity: {
              // The delay when we like to start the animation
              begin: seq * delays + 500,
              // Duration of the animation
              dur: durations,
              // The value where the animation should start
              from: 0,
              // The value where it should end
              to: 1
            }
          });
        } 
        
        else if(data.type === 'label' && data.axis === 'x') {
          data.element.animate({
            y: {
              begin: seq * delays,
              dur: durations,
              from: data.y + 100,
              to: data.y,
              // We can specify an easing function from Chartist.Svg.Easing
              easing: 'easeOutQuart'
            }
          });
        } 
        
        else if(data.type === 'label' && data.axis === 'y') {
          data.element.animate({
            x: {
              begin: seq * delays,
              dur: durations,
              from: data.x - 100,
              to: data.x,
              easing: 'easeOutQuart'
            }
          });
        } 
        
        else if(data.type === 'point') {
          data.element.animate({
            x1: {
              begin: seq * delays,
              dur: durations,
              from: data.x - 10,
              to: data.x,
              easing: 'easeOutQuart'
            },
            x2: {
              begin: seq * delays,
              dur: durations,
              from: data.x - 10,
              to: data.x,
              easing: 'easeOutQuart'
            },
            opacity: {
              begin: seq * delays,
              dur: durations,
              from: 0,
              to: 1,
              easing: 'easeOutQuart'
            }
          });
        } 
        
        else if(data.type === 'grid') {
          // Using data.axis we get x or y which we can use to construct our animation definition objects
          var pos1Animation = {
            begin: seq * delays,
            dur: durations,
            from: data[data.axis.units.pos + '1'] - 30,
            to: data[data.axis.units.pos + '1'],
            easing: 'easeOutQuart'
          };
      
          var pos2Animation = {
            begin: seq * delays,
            dur: durations,
            from: data[data.axis.units.pos + '2'] - 100,
            to: data[data.axis.units.pos + '2'],
            easing: 'easeOutQuart'
          };
      
          var animations = {};
          animations[data.axis.units.pos + '1'] = pos1Animation;
          animations[data.axis.units.pos + '2'] = pos2Animation;
          animations['opacity'] = {
            begin: seq * delays,
            dur: durations,
            from: 0,
            to: 1,
            easing: 'easeOutQuart'
          };
      
          data.element.animate(animations);
        }
      });
      
      // We update the chart every time it's created with a delay
      chart.on('created', function() {
        if(window.__exampleAnimateTimeout) {
          clearTimeout(window.__exampleAnimateTimeout);
          window.__exampleAnimateTimeout = null;
        }
        window.__exampleAnimateTimeout = setTimeout(chart.update.bind(chart), 15000);
      });
  };


  d3.selectAll("#lineSelect").on("change", updateChartist);
  // This function is called when a dropdown menu item is selected
  function updateChartist() {
      // Use D3 to select the dropdown menu
      var dropdownMenu = d3.select("#lineSelect");
      // Assign the value of the dropdown menu option to a variable
      var dataset = dropdownMenu.property("value");
      // Initialize x and y arrays
      var x = [];
      var y = [];
      if (dataset === 'cr') {
        var chart = new Chartist.Line('#chart2', {
            labels: pop_keys,
            series: cr_series
          }, options_line);
      }
      
      else if (dataset === 'en') {
        var chart = new Chartist.Line('#chart2', {
            labels: pop_keys,
            series: en_series
          }, options_line);  
      }

      else if (dataset === 'vu') {
        var chart = new Chartist.Line('#chart2', {
            labels: pop_keys,
            series: vu_series
          }, options_line);  
      }
      
      // Let's put a sequence number aside so we can use it in the event callbacks
      var seq = 0,
        delays = 20,
        durations = 500;
      
      // Once the chart is fully created we reset the sequence
      chart.on('created', function() {
        seq = 0;
      });
      
      // On each drawn element by Chartist we use the Chartist.Svg API to trigger SMIL animations
      chart.on('draw', function(data) {
        seq++;
      
        if(data.type === 'line') {
          // If the drawn element is a line we do a simple opacity fade in. This could also be achieved using CSS3 animations.
          data.element.animate({
            opacity: {
              // The delay when we like to start the animation
              begin: seq * delays + 500,
              // Duration of the animation
              dur: durations,
              // The value where the animation should start
              from: 0,
              // The value where it should end
              to: 1
            }
          });
        } 
        
        else if(data.type === 'label' && data.axis === 'x') {
          data.element.animate({
            y: {
              begin: seq * delays,
              dur: durations,
              from: data.y + 100,
              to: data.y,
              // We can specify an easing function from Chartist.Svg.Easing
              easing: 'easeOutQuart'
            }
          });
        } 
        
        else if(data.type === 'label' && data.axis === 'y') {
          data.element.animate({
            x: {
              begin: seq * delays,
              dur: durations,
              from: data.x - 100,
              to: data.x,
              easing: 'easeOutQuart'
            }
          });
        } 
        
        else if(data.type === 'point') {
          data.element.animate({
            x1: {
              begin: seq * delays,
              dur: durations,
              from: data.x - 10,
              to: data.x,
              easing: 'easeOutQuart'
            },
            x2: {
              begin: seq * delays,
              dur: durations,
              from: data.x - 10,
              to: data.x,
              easing: 'easeOutQuart'
            },
            opacity: {
              begin: seq * delays,
              dur: durations,
              from: 0,
              to: 1,
              easing: 'easeOutQuart'
            }
          });
        } 
        
        else if(data.type === 'grid') {
          // Using data.axis we get x or y which we can use to construct our animation definition objects
          var pos1Animation = {
            begin: seq * delays,
            dur: durations,
            from: data[data.axis.units.pos + '1'] - 30,
            to: data[data.axis.units.pos + '1'],
            easing: 'easeOutQuart'
          };
      
          var pos2Animation = {
            begin: seq * delays,
            dur: durations,
            from: data[data.axis.units.pos + '2'] - 100,
            to: data[data.axis.units.pos + '2'],
            easing: 'easeOutQuart'
          };
      
          var animations = {};
          animations[data.axis.units.pos + '1'] = pos1Animation;
          animations[data.axis.units.pos + '2'] = pos2Animation;
          animations['opacity'] = {
            begin: seq * delays,
            dur: durations,
            from: 0,
            to: 1,
            easing: 'easeOutQuart'
          };
      
          data.element.animate(animations);
        }
      });
      
      // We update the chart every time it's created with a delay
      chart.on('created', function() {
        if(window.__exampleAnimateTimeout) {
          clearTimeout(window.__exampleAnimateTimeout);
          window.__exampleAnimateTimeout = null;
        }
        window.__exampleAnimateTimeout = setTimeout(chart.update.bind(chart), 15000);
      });
    }
    init();

});


