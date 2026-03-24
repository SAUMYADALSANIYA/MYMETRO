import { MapContainer, TileLayer, Polyline, CircleMarker, Popup } from "react-leaflet";

const ahmedabadCenter = [23.0225, 72.5714];

export default function CustomerMetroMap({
  routes,
  highlightedRoutes,
  source,
  destination
}) {
  const activeRoutes = highlightedRoutes?.length ? highlightedRoutes : routes;

  return (
    <div className="customer-map-section">
      <MapContainer
        center={ahmedabadCenter}
        zoom={12}
        scrollWheelZoom={true}
        className="customer-metro-map"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {routes.map((route) => {
          const positions = route.stations.map((station) => [station.lat, station.lng]);
          const isHighlighted = activeRoutes.some(
            (activeRoute) => activeRoute.routeName === route.routeName
          );

          return (
            <Polyline
              key={route.routeName}
              positions={positions}
              pathOptions={{
                color: route.color,
                weight: isHighlighted ? 8 : 5,
                opacity: isHighlighted ? 1 : 0.35
              }}
            />
          );
        })}

        {routes.map((route) =>
          route.stations.map((station) => {
            const isSource = station.name === source;
            const isDestination = station.name === destination;
            const isOnHighlightedRoute = activeRoutes.some(
              (activeRoute) =>
                activeRoute.routeName === route.routeName &&
                activeRoute.stations.some((s) => s.name === station.name)
            );

            return (
              <CircleMarker
                key={`${route.routeName}-${station.name}`}
                center={[station.lat, station.lng]}
                radius={isSource || isDestination ? 9 : 6}
                pathOptions={{
                  color: isSource ? "#2E7D32" : isDestination ? "#FB8C00" : route.color,
                  fillColor: isSource
                    ? "#2E7D32"
                    : isDestination
                    ? "#FB8C00"
                    : "#ffffff",
                  fillOpacity: 1,
                  opacity: isOnHighlightedRoute ? 1 : 0.5,
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
}