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
    <MapContainer
      center={ahmedabadCenter}
      zoom={12}
      // Lock all map movement to make it purely a display canvas
      scrollWheelZoom={false}
      dragging={false}
      doubleClickZoom={false}
      touchZoom={false}
      zoomControl={false} 
      className="customer-metro-map"
      style={{ cursor: 'default' }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {routes.map((route) => {
        const positions = route.stations.map((station) => [station.lat, station.lng]);
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

      {isSearchMode && highlightedRoutes[0].stations && (() => {
        const pathStations = highlightedRoutes[0].stations;
        const segments = [];
        
        for (let i = 0; i < pathStations.length - 1; i++) {
          const st1 = pathStations[i];
          const st2 = pathStations[i + 1];
          
          const matchingRoute = routes.find(r => 
            r.stations.some(s => s.name === st1.name) && 
            r.stations.some(s => s.name === st2.name)
          );
          
          const segmentColor = matchingRoute ? matchingRoute.color : "#1E88E5";
          
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
                weight: 5,
                opacity: 1 
              }}
           />
        ));
      })()}

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
            isOnPath = true;
          }

          let markerColor = route.color;
          if (isSource) markerColor = "#16a34a"; // Vibrant Green
          else if (isDestination) markerColor = "#ea580c"; // Vibrant Orange
          else if (isInterchange) markerColor = "#9333ea"; // Vibrant Purple

          const isSpecial = isSource || isDestination || isInterchange;
          const fillColor = isSpecial ? markerColor : "#ffffff";
          const radius = isSpecial ? 8 : 5;

          if (!isOnPath && !isSpecial) {
            return null; 
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
                <div style={{ textAlign: 'center', minWidth: '120px' }}>
                  <strong style={{ fontSize: '1.1em', color: '#111' }}>{station.name}</strong>
                  <br />
                  <span style={{ color: '#666', fontSize: '0.9em' }}>{route.routeName}</span>
                  {isSource && <div style={{ color: '#16a34a', fontWeight: 'bold', marginTop: '4px' }}>🏁 Start Here</div>}
                  {isDestination && <div style={{ color: '#ea580c', fontWeight: 'bold', marginTop: '4px' }}>🎯 Destination</div>}
                  {isInterchange && <div style={{ color: '#9333ea', fontWeight: 'bold', marginTop: '4px' }}>🔄 Interchange</div>}
                </div>
              </Popup>
            </CircleMarker>
          );
        })
      )}
    </MapContainer>
  );
}