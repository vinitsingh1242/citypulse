let map;

let markers = [];


// -------------------------
// INITIALIZE MAP
// -------------------------

function initializeMap() {

    map = L.map("map").setView(
        [45.5152, -122.6784],
        12
    );

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution: "© OpenStreetMap contributors"
        }
    ).addTo(map);


    loadIncidents();
}


// -------------------------
// LOAD INCIDENTS
// -------------------------

async function loadIncidents() {

    try {

        const response =
            await fetch("http://127.0.0.1:5000/api/incidents");

        const data = await response.json();

        data.forEach(incident => {

            const marker =
                L.marker([
                    incident.latitude,
                    incident.longitude
                ]).addTo(map);

            marker.bindPopup(`
                <b>${incident.title}</b><br>
                ${incident.description}<br><br>
                <strong>Type:</strong> ${incident.type}<br>
                <strong>Status:</strong> ${incident.status}
            `);

            markers.push(marker);

        });

    } catch(error) {

        console.error(
            "Backend connection failed:",
            error
        );

    }
}


// -------------------------
// REFRESH DATA
// -------------------------

async function refreshData() {

    try {

        const response =
            await fetch("http://127.0.0.1:5000/api/status");

        const data = await response.json();

        document.getElementById("aqi").innerText =
            data.aqi + " AQI";

        document.getElementById("pm25").innerText =
            data.pm25;

        document.getElementById("delay").innerText =
            data.transit_delay + " min";

    } catch(error) {

        console.error(error);

    }
}

// -------------------------
// SEARCH CITY
// -------------------------

async function searchCity() {

    const input =
        document.getElementById("cityInput");

    const city =
        input.value.trim();

    if (!city) {
        alert("Please enter a city");
        return;
    }

    try {

        const response = await fetch(
            `http://127.0.0.1:5000/api/city/${encodeURIComponent(city)}`
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.error || "City not found");
            return;
        }

        // Move map to searched city
        map.setView(
            [data.latitude, data.longitude],
            12
        );

        // Update dashboard
        document.getElementById("aqi").innerText =
            data.aqi + " AQI";

        document.getElementById("pm25").innerText =
            data.pm25;

        // Add marker
        L.marker([
            data.latitude,
            data.longitude
        ])
        .addTo(map)
        .bindPopup(`
            <b>${data.city}</b><br>
            AQI: ${data.aqi}<br>
            PM2.5: ${data.pm25} µg/m³
        `)
        .openPopup();

    } catch (error) {

        console.error(error);

        alert(
            "Could not connect to the backend."
        );
    }
}
// -------------------------
// EVENT FILTER
// -------------------------

function filterEvents(type) {

    const logs =
        document.querySelectorAll(".log");

    logs.forEach(log => {

        if(type === "all") {

            log.style.display = "flex";

        } else {

            if(log.classList.contains(type)) {

                log.style.display = "flex";

            } else {

                log.style.display = "none";

            }

        }

    });
}


// -------------------------
// ACKNOWLEDGE
// -------------------------

function acknowledge() {

    alert(
        "Incident acknowledged successfully."
    );
}


// -------------------------
// TIMELINE
// -------------------------

function showTimeline() {

    alert(
        "Timeline:\n\n" +
        "4:10 PM - Burn alert\n" +
        "4:22 PM - Road sensor check\n" +
        "4:28 PM - Line 5 delay\n" +
        "4:34 PM - PM2.5 alert"
    );
}


initializeMap();