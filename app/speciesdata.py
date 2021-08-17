import numpy as np
import os

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify
from sqlalchemy.sql import elements
from sqlalchemy.sql.expression import null

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

def getSpecies(taxonid):

    # Create our session (link) from Python to the DB
    session = Session(engine)

    """Return a list of all species names"""
    # Query all species
    print("Printing" + taxonid)

    # if taxonid == "all":
    #     print("Running without taxonid")
    #     results = session.query(Species).all()
    #     results_2 = session.query(Countries).all()
    #     results_3 = session.query(Habitats).filter().all()
    #     results_4 = session.query(Narratives).all()
    #     results_5 = session.query(Threats).all()
    #     results_6 = session.query(Conservation).all()
    # else:
    results = session.query(Species).filter(Species.taxonid == taxonid).all()
    results_2 = session.query(Countries).filter(Countries.taxonid == taxonid).all()
    results_3 = session.query(Habitats).filter(Habitats.taxonid == taxonid).all()
    results_4 = session.query(Narratives).filter(Narratives.taxonid == taxonid).all()
    results_5 = session.query(Threats).filter(Threats.taxon_id == taxonid).all()
    results_6 = session.query(Conservation).filter(Conservation.taxon_id == taxonid).all()

    session.close()

    all_species_countries = []

    for c in results_2:
        countries_dict = {}
        countries_dict["taxonid"] = c.taxonid
        countries_dict["country_code"] = c.country_code
        countries_dict["country_name"] = c.country_name
        countries_dict["distribution_code"] = c.distribution_code
        countries_dict["origin"] = c.origin
        countries_dict["presence"] = c.presence
        countries_dict["longitude"] = c.longitude
        countries_dict["latitude"] = c.latitude
        countries_dict["name"] = c.name
        countries_dict["country"] = c.country
        all_species_countries.append(countries_dict)

    all_species_habitats = []

    for habitat in results_3:
        habitats_dict = {}
        habitats_dict["habitat"] = habitat.taxonid
        habitats_dict["habitat"] = habitat.habitat
        all_species_habitats.append(habitats_dict)

    all_species_narratives = []

    for narratives in results_4:
        narratives_dict = {}
        narratives_dict["taxonid"] = narratives.taxonid
        narratives_dict["taxonomic_notes"] = narratives.taxonomic_notes
        narratives_dict["endangered_rationale"] = narratives.endangered_rationale
        narratives_dict["geo_range"] = narratives.geo_range
        narratives_dict["pop_notes"] = narratives.pop_notes
        narratives_dict["pop_trend"] = narratives.pop_trend
        narratives_dict["habitat_notes"] = narratives.habitat_notes
        narratives_dict["conserve_notes"] = narratives.conserve_notes
        narratives_dict["trade_info"] = narratives.trade_info
        all_species_narratives.append(narratives_dict)

    all_species_threats = []

    for threat in results_5:
        threats_dict = {}
        threats_dict["taxonid"] = threat.taxon_id
        threats_dict["code"] = threat.code
        threats_dict["title"] = threat.title
        threats_dict["timing"] = threat.timing
        threats_dict["scope"] = threat.scope
        threats_dict["severity"] = threat.severity
        threats_dict["score"] = threat.score
        threats_dict["invasive"] = threat.invasive
        all_species_threats.append(threats_dict)


    all_species_conservations = []

    for conservation in results_6:
        conservation_dict = {}
        conservation_dict["taxonid"] = conservation.taxon_id
        conservation_dict["code"] = conservation.code
        conservation_dict["title"] = conservation.title
        all_species_conservations.append(conservation_dict)

    all_species = []

    for species in results:
        species_dict = {}
        species_dict["taxonid"] = species.taxonid
        species_dict["category"] = species.category
        species_dict["main_common_name"] = species.main_common_name
        species_dict["scientific_name"] = species.scientific_name
        species_dict["kingdom_name"] = species.kingdom_name
        species_dict["phylum_name"] = species.phylum_name
        species_dict["class_name"] = species.class_name
        species_dict["order_name"] = species.order_name
        species_dict["family_name"] = species.family_name
        species_dict["taxonomic_authority"] = species.taxonomic_authority
        species_dict["countries"] = all_species_countries
        species_dict["habitats"] = all_species_habitats
        species_dict["narratives"] = all_species_narratives
        species_dict["threats"] = all_species_threats
        species_dict["conservation"] = all_species_conservations
        all_species.append(species_dict)

    return all_species

