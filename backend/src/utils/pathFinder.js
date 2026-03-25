import Route from "../models/route.js";

class PriorityQueue {
  constructor() {
    this.elements = [];
  }
  enqueue(element, priority) {
    this.elements.push({ element, priority });
    this.elements.sort((a, b) => a.priority - b.priority);
  }
  dequeue() {
    return this.elements.shift().element;
  }
  isEmpty() {
    return this.elements.length === 0;
  }
}

export const findShortestPath = async (startStation, endStation) => {
  const routes = await Route.find({});
  const graph = {};

  // Build the adjacency list
  routes.forEach(route => {
    const stations = route.stations;
    for (let i = 0; i < stations.length; i++) {
      const current = stations[i].name;
      if (!graph[current]) graph[current] = {};

      if (i > 0) {
        const prev = stations[i - 1].name;
        graph[current][prev] = { cost: 1, line: route.routeName, color: route.color };
      }
      
      if (i < stations.length - 1) {
        const next = stations[i + 1].name;
        graph[current][next] = { cost: 1, line: route.routeName, color: route.color };
      }
    }
  });

  if (!graph[startStation] || !graph[endStation]) {
    return null;
  }

  const distances = {};
  const previous = {};
  const pq = new PriorityQueue();

  for (let node in graph) {
    distances[node] = Infinity;
    previous[node] = null;
  }
  
  distances[startStation] = 0;
  pq.enqueue(startStation, 0);

  while (!pq.isEmpty()) {
    const current = pq.dequeue();

    if (current === endStation) break;

    for (let neighbor in graph[current]) {
      const newDist = distances[current] + graph[current][neighbor].cost;
      if (newDist < distances[neighbor]) {
        distances[neighbor] = newDist;
        previous[neighbor] = { node: current, line: graph[current][neighbor].line, color: graph[current][neighbor].color };
        pq.enqueue(neighbor, newDist);
      }
    }
  }

  // Reconstruct path
  const path = [];
  const linesUsed = new Set();
  let curr = endStation;

  if (distances[endStation] === Infinity) return null; // No path

  while (curr) {
    const prevData = previous[curr];
    path.push({ 
      station: curr, 
      line: prevData ? prevData.line : null,
      color: prevData ? prevData.color : null
    });
    if (prevData) linesUsed.add(prevData.line);
    curr = prevData ? prevData.node : null;
  }
  path.reverse();

  // The first node's line info comes from the next node's back-pointer
  if (path.length > 1) {
    path[0].line = path[1].line;
    path[0].color = path[1].color;
  }

  const stops = path.length - 1;
  
  // Calculate fare based on stops (Ahmedabad style example)
  let fare = 10;
  if (stops > 3) fare = 15;
  if (stops > 6) fare = 20;
  if (stops > 9) fare = 25;
  if (stops > 12) fare = 30;
  if (stops > 15) fare = 35;
  if (stops > 18) fare = 40;

  return {
    path: path.map(p => p.station),
    routeDetails: path,
    interchangesRequired: linesUsed.size > 1,
    linesUsed: Array.from(linesUsed),
    stops,
    fare,
    estimatedTimeMins: stops * 3
  };
};