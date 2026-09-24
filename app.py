from flask import Flask, jsonify
from flask_cors import CORS
from datetime import datetime
import random

app = Flask(__name__)

CORS(app)


# -----------------------------------
# SIMULATED INCIDENT DATABASE
# -----------------------------------

incidents = [

    {
        "id": 1,
        "title": "Rising PM2.5",
        "description": "Air pollution increasing near I-5",
        "type": "air",
        "status": "alert",
        "latitude": 45.5152,
        "longitude": -122.6784
    },

    {
        "id": 2,
        "title": "Line 5 Delay",
        "description": "Transit headway increased to 18 minutes",
        "type": "transit",
        "status": "delayed",
        "latitude": 45.5220,
        "longitude": -122.6710
    },

    {
        "id": 3,
        "title": "Road Sensor 12",
        "description": "Road vibration within normal range",
        "type": "road",
        "status": "normal",
        "latitude": 45.5050,
        "longitude": -122.6900
    },

    {
        "id": 4,
        "title": "Burn Alert",
        "description": "Public reports of increased smoke",
        "type": "public",
        "status": "watch",
        "latitude": 45.5300,
        "longitude": -122.6600
    }

]


# -----------------------------------
# HOME
# -----------------------------------

@app.route("/")
def home():

    return jsonify({
        "message": "Meridian Grid backend running"
    })


# -----------------------------------
# INCIDENT API
# -----------------------------------

@app.route("/api/incidents")
def get_incidents():

    return jsonify(incidents)


# -----------------------------------
# CITY STATUS
# -----------------------------------

@app.route("/api/status")
def city_status():

    aqi = random.randint(120, 160)

    pm25 = random.randint(30, 40)

    transit_delay = random.randint(15, 22)

    return jsonify({

        "aqi": aqi,

        "pm25": pm25,

        "transit_delay": transit_delay,

        "timestamp":
            datetime.now().strftime(
                "%Y-%m-%d %H:%M:%S"
            )

    })

# -----------------------------------
# CITY SEARCH
# -----------------------------------

@app.route("/api/city/<city>")
def get_city(city):

    cities = {

        "delhi": {
            "city": "Delhi",
            "latitude": 28.6139,
            "longitude": 77.2090,
            "aqi": 138,
            "pm25": 34
        },

        "mumbai": {
            "city": "Mumbai",
            "latitude": 19.0760,
            "longitude": 72.8777,
            "aqi": 112,
            "pm25": 28
        },

        "jaipur": {
            "city": "Jaipur",
            "latitude": 26.9124,
            "longitude": 75.7873,
            "aqi": 96,
            "pm25": 21
        },

        "bangalore": {
            "city": "Bangalore",
            "latitude": 12.9716,
            "longitude": 77.5946,
            "aqi": 82,
            "pm25": 18
        },

        "chennai": {
            "city": "Chennai",
            "latitude": 13.0827,
            "longitude": 80.2707,
            "aqi": 104,
            "pm25": 25
        }

    }

    result = cities.get(city.lower())

    if not result:

        return jsonify({
            "error": "City not found"
        }), 404

    return jsonify(result)
# -----------------------------------
# INCIDENT CONNECTION ANALYSIS
# -----------------------------------

@app.route("/api/analysis")
def analysis():

    return jsonify({

        "connection_detected": True,

        "message":
        "Transit delays may be contributing to increased idling and air pollution.",

        "confidence": 82,

        "sources": 4

    })


# -----------------------------------
# RUN SERVER
# -----------------------------------

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )