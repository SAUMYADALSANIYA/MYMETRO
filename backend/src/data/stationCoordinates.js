const STATION_COORDINATES = {
    A: { lat: 23.02, lng: 72.57 },
    B: { lat: 23.02, lng: 72.58 },
    C: { lat: 23.03, lng: 72.59 },
    D: { lat: 23.04, lng: 72.60 },
    E: { lat: 23.05, lng: 72.61 },
    F: { lat: 23.06, lng: 72.62 },
    G: { lat: 23.07, lng: 72.63 },
    H: { lat: 23.08, lng: 72.64 },
    I: { lat: 23.09, lng: 72.65 },
    J: { lat: 23.10, lng: 72.66 },
    K: { lat: 23.11, lng: 72.67 },
    X: { lat: 23.12, lng: 72.68 },
    Y: { lat: 23.13, lng: 72.69 }
};

function stationToPoint(name) {
    const coords = STATION_COORDINATES[name] || { lat: null, lng: null };
    return { name, ...coords };
}

module.exports = { STATION_COORDINATES, stationToPoint };