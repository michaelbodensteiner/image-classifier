const queryString = window.location.search
const urlParams = new URLSearchParams(queryString);
const taxonid = urlParams.get('taxonid');

d3.json(`http://127.0.0.1:5000/api/v1.0/species/6557`, function(data) {
  console.log(data);
  data.forEach((species) => {
    var main_common_name = species.main_common_name;
    var scientific_name = species.scientific_name;
    var kingdom_name = species.kingdom_name;
    var class_name = species.class_name;
    var phylum_name = species.phylum_name;
    var order_name = species.order_name;
    var family_name = species.family_name;
    var genus_name = species.genus_name;
    var narratives = species.narratives;
    var countries = species.countries;
    var habitats = species.habitats;
    var threats = species.threats;
    var conservation = species.conservation;
    // console.log(narratives);

    d3.select('#main_common_name')
      .text(main_common_name);
  
    d3.select('#scientific_name')
      .text("Scientific name: " + scientific_name);
    
    d3.select('#kingdom_name')
      .text("Kingdom: " + kingdom_name);
    
    d3.select('#class_name')   
      .text("Phylum: " + phylum_name);
    
    d3.select('#class_name')
      .text("Class: " + class_name);

    d3.select('#order_name')
      .text("Order: " + order_name);
    
    d3.select('#family_name')
      .text("Family: " + family_name);
      
    d3.select('#genus_name')
      .text("Genus: " + genus_name);

    narratives.forEach((narrative)=> {
      geo_range = narrative.geo_range;
      
      d3.select('#narrative')
        .html(geo_range);
    });

    // console.log(document)
    countries.forEach((country) => {
      var ul = document.getElementById("occurances");
      var country_name = country.country_name;
      var li_item = document.createElement("li")
      li_item.appendChild(document.createTextNode(country_name))
      li_item.setAttribute("id", country_name);
      // console.log(li_item)
      li_item.innerHTML=country_name
      // console.log(ul)
      ul.appendChild(li_item)
    });

    habitats.forEach((hab) => {
      var hab_name = hab.habitat.split("'").filter((element, index) => {
        return index % 2 === 1;
      });
      // console.log(hab_name)
      hab_name.forEach((new_hab)=> {
        var ul = document.getElementById("habitats");
        var li_item = document.createElement("li")
        li_item.appendChild(document.createTextNode(new_hab))
        li_item.setAttribute("id", new_hab);
        // console.log(li_item)
        li_item.innerHTML=new_hab
        // console.log(ul)
        ul.appendChild(li_item)
      })
      var tags = [...document.querySelectorAll('#habitats > li')];
      var texts = new Set(tags.map(x => x.innerHTML));
      tags.forEach(tag => {
        if(texts.has(tag.innerHTML)){
          texts.delete(tag.innerHTML);
        }
        else{
          tag.remove()
        }
      });
    });

    threats.forEach((threat) => {
      var ul = document.getElementById("threats");
      var threat_name = threat.title;
      var li_item = document.createElement("li")
      li_item.appendChild(document.createTextNode(threat_name))
      li_item.setAttribute("id", threat_name);
      // console.log(li_item)
      li_item.innerHTML=threat_name
      // console.log(ul)
      ul.appendChild(li_item)
    });

    conservation.forEach((effort) => {
      var ul = document.getElementById("conserve");
      var cons_name = effort.title;
      var li_item = document.createElement("li")
      li_item.appendChild(document.createTextNode(cons_name))
      li_item.setAttribute("id", cons_name);
      // console.log(li_item)
      li_item.innerHTML=cons_name
      // console.log(ul)
      ul.appendChild(li_item)
    });

  });
});
