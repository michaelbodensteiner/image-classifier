import numpy as np
import os

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify, request
from sqlalchemy.sql.schema import DEFAULT_NAMING_CONVENTION
from speciesdata import getSpecies
from species_map import getCountryCounts


#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///animal.sqlite")

# reflect an existing database into a new model
Base = automap_base()

# reflect the tables
Base.prepare(engine, reflect=True)

# Save references to the tables
Species = Base.classes.species
Countries = Base.classes.country_coordinates
Geo_Coords = Base.classes.geo_coords
Habitats = Base.classes.habitats
Narratives = Base.classes.narratives
Threats = Base.classes.threats
Conservation = Base.classes.conservation
Population = Base.classes.population


#################################################
# Flask Setup
#################################################
app = Flask(__name__)


#################################################
# Flask Routes
#################################################

# Welcome route 
@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"/api/v1.0/species<br/>"
        f"/api/v1.0/countries"
    )

# All Species
@app.route("/api/v1.0/species/<taxonid>")
def get_species_by_id(taxonid):
    return jsonify(getSpecies(taxonid))

@app.route("/api/v1.0/country_counts")
def getCounts():
    return jsonify(getCountryCounts())
##################################################
# ALL SPECIES
##################################################

@app.route("/api/v1.0/all_species")
def get_all_species():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    """Return a list of all species names"""
    # Query all species
    results = session.query(Species.taxonid, 
        Species.category, 
        Species.main_common_name,
        Species.scientific_name,
        Species.kingdom_name,
        Species.phylum_name,
        Species.class_name,
        Species.order_name,
        Species.family_name,
        Species.genus_name,
        Species.taxonomic_authority
    ).all()

    session.close()

    all_species = []

    for taxonid, category, main_common_name, scientific_name, kingdom_name, phylum_name, class_name, order_name, family_name, genus_name, taxonomic_authority in results:
        species_dict = {}
        species_dict["taxonid"] = taxonid
        species_dict["category"] = category
        species_dict["main_common_name"] = main_common_name
        species_dict["scientific_name"] = scientific_name
        species_dict["kingdom_name"] = kingdom_name
        species_dict["phylum_name"] = phylum_name
        species_dict["class_name"] = class_name
        species_dict["order_name"] = order_name
        species_dict["family_name"] = family_name
        species_dict["taxonomic_authority"] = taxonomic_authority
        all_species.append(species_dict)
    return jsonify(all_species)


##################################################
# All Countries
##################################################

@app.route("/api/v1.0/countries")
def get_all_countries():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    """Return a list of all species countries"""
    # Query all countries
    results = session.query(Countries.taxonid, 
        Countries.country_code, 
        Countries.country_name,
        Countries.distribution_code,
        Countries.origin,
        Countries.presence
    ).all()

    session.close()

    # Convert list of tuples into normal list
    all_species_country = []

    for taxonid, country_code, country_name, distribution_code, origin, presence in results:
        countries_dict = {}
        countries_dict["taxonid"] = taxonid
        countries_dict["country_code"] = country_code
        countries_dict["country_name"] = country_name
        countries_dict["distribution_code"] = distribution_code
        countries_dict["origin"] = origin
        countries_dict["presence"] = presence
        all_species_country.append(countries_dict)
    return jsonify(all_species_country)




##################################################
# All Habitats
##################################################

@app.route("/api/v1.0/habitats")
def get_all_habitats():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    """Return a list of all species habitats"""
    # Query all habitats
    results = session.query(Habitats.taxonid,
        Habitats.habitat,
        Habitats.species_name,  
        Habitats.scientific_name,
        # Habitats.category,
        # Habitats.main_common_name,
        # Habitats.kingdom_name, 
        # Habitats.phylum_name,
        # Habitats.class_name,
        # Habitats.order_name,
        # Habitats.family_name,
        # Habitats.genus_name,
        # Habitats.taxonomic_authority
    ).all()

    session.close()

    # Convert list of tuples into normal list
    all_species_habitat = []

    for taxonid, habitat, species_name, scientific_name in results:
    #, category, main_common_name, kingdom_name, phylum_name, class_name, order_name, family_name, genus_name, taxonomic_authority in results:
        habitat_dict = {}
        habitat_dict["taxonid"] = taxonid
        habitat_dict["habitat"] = habitat
        habitat_dict["species_name"] = species_name
        habitat_dict["scientific_name"] = scientific_name
        # habitat_dict["category"] = category
        # habitat_dict["main_common_name"] = main_common_name 
        # habitat_dict["kingdom_name"] = kingdom_name
        # habitat_dict["phylum_name"] = phylum_name
        # habitat_dict["class_name"] = class_name
        # habitat_dict["order_name"] = order_name
        # habitat_dict["family_name"] = family_name
        # habitat_dict["genus_name"] = genus_name
        # habitat_dict["taxonomic_authority"] = taxonomic_authority
        all_species_habitat.append(habitat_dict)
    return jsonify(all_species_habitat)



##################################################
# All Narratives
##################################################

@app.route("/api/v1.0/narratives")
def get_all_narratives():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    """Return a list of all species habitats"""
    # Query all narratives
    results = session.query(Narratives.taxonid,
        Narratives.species_name, 
        Narratives.taxonomic_notes,
        Narratives.endangered_rationale, 
        Narratives.geo_range, 
        Narratives.pop_notes, 
        Narratives.pop_trend, 
        Narratives.habitat_notes, 
        Narratives.conserve_notes, 
        Narratives.trade_info,  
        # Narratives.threat_notes, 
        # Narratives.category,
        # Narratives.main_common_name,
        # Narratives.scientific_name,
        # Narratives.kingdom_name, 
        # Narratives.phylum_name,
        # Narratives.class_name,
        # Narratives.order_name,
        # Narratives.family_name,
        # Narratives.genus_name,
        # Narratives.taxonomic_authority
    ).all()

    session.close()

    # Convert list of tuples into normal list
    narratives = []

    for taxonid, species_name, taxonomic_notes, endangered_rationale, geo_range, pop_notes, pop_trend, habitat_notes, conserve_notes, trade_info in results:
    #, threat_notes, category, main_common_name, scientific_name, kingdom_name, phylum_name, class_name, order_name, family_name, genus_name, taxonomic_authority in results:
        narrative_dict = {}
        narrative_dict["taxonid"] = taxonid
        narrative_dict["species_name"] = species_name
        narrative_dict["taxonomic_notes"] = taxonomic_notes
        narrative_dict["endangered_rationale"] = endangered_rationale
        narrative_dict["geo_range"] = geo_range
        narrative_dict["pop_notes"] = pop_notes
        narrative_dict["pop_trend"] = pop_trend
        narrative_dict["habitat_notes"] = habitat_notes
        narrative_dict["conserve_notes"] = conserve_notes
        narrative_dict["trade_info"] = trade_info
        # narrative_dict["threat_notes"] = threat_notes
        # narrative_dict["category"] = category
        # narrative_dict["main_common_name"] = main_common_name
        # narrative_dict["scientific_name"] = scientific_name
        # narrative_dict["species_name"] = species_name
        # narrative_dict["kingdom_name"] = kingdom_name
        # narrative_dict["phylum_name"] = phylum_name
        # narrative_dict["class_name"] = class_name
        # narrative_dict["order_name"] = order_name
        # narrative_dict["family_name"] = family_name
        # narrative_dict["genus_name"] = genus_name
        # narrative_dict["taxonomic_authority"] = taxonomic_authority
        narratives.append(narrative_dict)
    return jsonify(narratives)



##################################################
# All Threats
##################################################

@app.route("/api/v1.0/threats")
def get_all_threats():
    session = Session(engine)

    """Return a list of all species countries"""
    # Query all threats
    results = session.query(Threats.taxon_id, 
        Threats.code, 
        Threats.title,
        Threats.timing,
        Threats.scope,
        Threats.severity,
        Threats.score,
        Threats.invasive
    ).all()

    session.close()

    # Convert list of tuples into normal list
    all_species_threats = []

    for taxon_id, code, title, timing, scope, severity, score, invasive in results:
        threats_dict = {}
        threats_dict["taxonid"] = taxon_id
        threats_dict["code"] = code
        threats_dict["title"] = title
        threats_dict["timing"] = timing
        threats_dict["scope"] = scope
        threats_dict["severity"] = severity
        threats_dict["score"] = score
        threats_dict["invasive"] = invasive
        all_species_threats.append(threats_dict)
    return jsonify(all_species_threats)



##################################################
# Conservation
##################################################

@app.route("/api/v1.0/conservation")
def get_all_conservation():
    
    session = Session(engine)

    results = session.query(Conservation.taxon_id,
        Conservation.code,
        Conservation.title
    ).all()

    session.close()

    # Convert list of tuples into normal list
    all_species_conservation = []

    for taxon_id, code, title in results:
        conservation_dict = {}
        conservation_dict["taxon_id"] = taxon_id
        conservation_dict["code"] = code
        conservation_dict["title"] = title
        all_species_conservation.append(conservation_dict)
    return jsonify(all_species_conservation)

##################################################
# Population stats
##################################################
@app.route("/api/v1.0/population")
def get_pop_stats():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    """Return a list of pop_data"""
    # Query all species
    results = session.query(Population.category, 
        Population.year,
        Population.mammals,
        Population.birds,
        Population.reptiles,
        Population.total
    ).all()

    session.close()

    pop_stats = []

    for category, year, mammals, birds, reptiles, total in results:
        pop_dict = {}
        pop_dict["category"] = category
        pop_dict["year"] = year
        pop_dict["mammals"] = mammals
        pop_dict["birds"] = birds
        pop_dict["reptiles"] = reptiles
        pop_dict["total"] = total
        pop_stats.append(pop_dict)
    return jsonify(pop_stats)


@app.after_request
def after_request(response):
    response.headers["Access-Control-Allow-Origin"] = "*" # <- You can change "*" for a domain for example "http://localhost"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS, PUT, DELETE"
    response.headers["Access-Control-Allow-Headers"] = "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization"
    return response


if __name__ == '__main__':
    app.run(debug=True)
