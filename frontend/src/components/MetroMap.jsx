import { MapContainer, TileLayer, Polyline, Marker, Popup, CircleMarker } from "react-leaflet";

const ahmedabadCenter = [23.0225, 72.5714];

const MetroMap = ({
  routes,
  selectedRouteName,
  selectedSource,
  selectedDestination
}) => {
  return (
    <div className="metro-map-wrapper">
      <MapContainer
        center={ahmedabadCenter}
        zoom={12}
        scrollWheelZoom={true}
        className="metro-map"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {routes.map((route) => {
          const positions = route.stations.map((station) => [station.lat, station.lng]);

          const isSelectedRoute = route.routeName === selectedRouteName;

          return (
            <Polyline
              key={route.routeName}
              positions={positions}
              pathOptions={{
                color: route.color,
                weight: isSelectedRoute ? 8 : 5,
                opacity: isSelectedRoute ? 1 : 0.65
              }}
            />
          );
        })}

        {routes.map((route) =>
          route.stations.map((station) => {
            const isSource = station.name === selectedSource;
            const isDestination = station.name === selectedDestination;

            return (
              <CircleMarker
                key={`${route.routeName}-${station.name}`}
                center={[station.lat, station.lng]}
                radius={isSource || isDestination ? 9 : 6}
                pathOptions={{
                  color: isSource ? "#2E7D32" : isDestination ? "#F57C00" : route.color,
                  fillColor: isSource ? "#2E7D32" : isDestination ? "#F57C00" : "#ffffff",
                  fillOpacity: 1,
                  weight: 3
                }}
              >
                <Popup>
                  <div>
                    <strong>{station.name}</strong>
                    <br />
                    {route.routeName}
                    {isSource && (
                      <>
                        <br />
                        Source Station
                      </>
                    )}
                    {isDestination && (
                      <>
                        <br />
                        Destination Station
                      </>
                    )}
                  </div>
                </Popup>
              </CircleMarker>
            );
          })
        )}
      </MapContainer>
    </div>
  );
};

export default MetroMap;