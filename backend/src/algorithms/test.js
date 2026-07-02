const galeShapley = require('./galeShapley');

const students = [
  { id: "A", preferences: ["H1", "H2"] },
  { id: "B", preferences: ["H1", "H2"] },
  { id: "C", preferences: ["H2", "H1"] },
  { id: "D", preferences: ["H1", "H2"] }
];

const hostels = [
  { id: "H1", capacity: 2, preferences: ["B", "A", "D", "C"] },
  { id: "H2", capacity: 2, preferences: ["C", "A", "D", "B"] }
];

console.log(JSON.stringify(galeShapley(students, hostels), null, 2));