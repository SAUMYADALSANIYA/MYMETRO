import { MapContainer, TileLayer, Polyline, CircleMarker, Popup } from "react-leaflet";

const ahmedabadCenter = [23.0225, 72.5714];

export default function CustomerMetroMap({
  routes,
  highlightedRoutes,
  source,
  destination
}) {
  const isSearchMode = highlightedRoutes?.length === 1 && source && destination;

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

        {/* 1. Draw Background/Base Routes */}
        {routes.map((route) => {
          const positions = route.stations.map((station) => [station.lat, station.lng]);
          // Fade out the base map lines heavily when searching to make the path pop
          const opacity = isSearchMode ? 0.2 : 0.8;
          
          return (
            <Polyline
              key={`base-${route.routeName}`}
              positions={positions}
              pathOptions={{
                color: route.color,
                weight: 5,
                opacity: opacity
              }}
            />
          );
        })}

        {/* 2. Draw the exact path segmented by actual line colors */}
        {isSearchMode && highlightedRoutes[0].stations && (() => {
          const pathStations = highlightedRoutes[0].stations;
          const segments = [];
          
          // Reconstruct the path segments by tracing which real route each adjacent pair belongs to
          for (let i = 0; i < pathStations.length - 1; i++) {
            const st1 = pathStations[i];
            const st2 = pathStations[i + 1];
            
            // Find which route contains BOTH of these adjacent stations
            const matchingRoute = routes.find(r => 
              r.stations.some(s => s.name === st1.name) && 
              r.stations.some(s => s.name === st2.name)
            );
            
            const segmentColor = matchingRoute ? matchingRoute.color : "#1E88E5";
            
            // If the current segment is the same color as the last one, append to it, else create new
            if (segments.length > 0 && segments[segments.length - 1].color === segmentColor) {
               segments[segments.length - 1].positions.push([st2.lat, st2.lng]);
            } else {
               segments.push({
                 color: segmentColor,
                 positions: [[st1.lat, st1.lng], [st2.lat, st2.lng]]
               });
            }
          }
          
          return segments.map((segment, index) => (
             <Polyline
                key={`path-segment-${index}`}
                positions={segment.positions}
                pathOptions={{
                  color: segment.color,
                  weight: 5, // Thin matching the normal size
                  opacity: 1 // Fully solid
                }}
             />
          ));
        })()}

        {/* 3. Draw Stations */}
        {routes.map((route) =>
          route.stations.map((station) => {
            const isSource = station.name === source;
            const isDestination = station.name === destination;
            
            let isInterchange = false;
            let isOnPath = false;

            if (isSearchMode) {
              isOnPath = highlightedRoutes[0].stations.some(s => s.name === station.name);
              if (highlightedRoutes[0].interchangeStation === station.name) {
                isInterchange = true;
              }
            } else {
              // Show All mode
              isOnPath = true;
            }

            let markerColor = route.color;
            if (isSource) markerColor = "#2E7D32"; // Green
            else if (isDestination) markerColor = "#FB8C00"; // Orange
            else if (isInterchange) markerColor = "#9C27B0"; // Elegant Purple for the interchange dot

            // If it's a special station, fill it with color, otherwise white
            const isSpecial = isSource || isDestination || isInterchange;
            const fillColor = isSpecial ? markerColor : "#ffffff";
            const radius = isSpecial ? 8 : 5;

            // Only draw the marker if it's on the path (during search mode) or if we are showing all
            if (!isOnPath && !isSpecial) {
              return null; // Hide off-path stations for a cleaner map
            }

            return (
              <CircleMarker
                key={`${route.routeName}-${station.name}`}
                center={[station.lat, station.lng]}
                radius={radius}
                pathOptions={{
                  color: markerColor,
                  fillColor: fillColor,
                  fillOpacity: 1,
                  opacity: 1,
                  weight: 2
                }}
              >
                <Popup>
                  <div>
                    <strong>{station.name}</strong>
                    <br />
                    {route.routeName}
                    {isSource && <><br /><strong>Source Station</strong></>}
                    {isDestination && <><br /><strong>Destination Station</strong></>}
                    {isInterchange && <><br /><strong style={{color: "#9C27B0"}}>Interchange Station</strong></>}
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