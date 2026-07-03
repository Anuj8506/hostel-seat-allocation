const galeShapley = require('./galeShapley');

const students = [
  { id: "A", preferences: ["H1", "H2"] },
  { id: "B", preferences: ["H1", "H2"] },
  { id: "C", preferences: ["H2", "H1"] },
  { id: "D", preferences: ["H1", "H2"] },
  { id: "E", preferences: ["H1"] }  // only lists H1, which will be full
];

const hostels = [
  { id: "H1", capacity: 2, preferences: ["B", "A", "D", "C", "E"] },
  { id: "H2", capacity: 2, preferences: ["C", "A", "D", "B", "E"] }
];

console.log(JSON.stringify(galeShapley(students, hostels), null, 2));