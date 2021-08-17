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


def getCountryCounts():

    # Create our session (link) from Python to the DB
    session = Session(engine)
        
    results = session.query(func.count(Countries.taxonid).label("total"), Countries.country_name, Countries.country_code, Countries.latitude, Countries.longitude).group_by(Countries.country_name, Countries.country_code, Countries.latitude, Countries.longitude).all()
    
    session.close()

    all_species_countries = []

    for c in results:
        countries_dict = {}
        countries_dict["species_count"] = c.total
        countries_dict["country_name"] = c.country_name
        countries_dict["country_code"] = c.country_code
        countries_dict["latitude"] = c.latitude
        countries_dict["longitude"] = c.longitude
        all_species_countries.append(countries_dict)


    return all_species_countries

