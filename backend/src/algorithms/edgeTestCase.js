const galeShapley = require('./galeShapley');

function runCase(title, students, hostels) {
  console.log("\n=== " + title + " ===");
  const result = galeShapley(students, hostels);
  console.log(JSON.stringify(result, null, 2));
}

// CASE 1: A hostel that never fills (demand < capacity)
runCase(
  "Case 1: Hostel never fills",
  [
    { id: "A", preferences: ["H1"] },
    { id: "B", preferences: ["H1"] }
  ],
  [
    { id: "H1", capacity: 5, preferences: ["A", "B"] } // capacity 5, only 2 students want it
  ]
);

// CASE 2: A student with an empty preference list
runCase(
  "Case 2: Student with empty preference list",
  [
    { id: "A", preferences: ["H1"] },
    { id: "B", preferences: [] } // B has no preferences at all
  ],
  [
    { id: "H1", capacity: 2, preferences: ["A", "B"] }
  ]
);

// CASE 3: Everyone gets their first choice (no rejections at all)
runCase(
  "Case 3: Everyone gets first choice",
  [
    { id: "A", preferences: ["H1"] },
    { id: "B", preferences: ["H2"] }
  ],
  [
    { id: "H1", capacity: 1, preferences: ["A"] },
    { id: "H2", capacity: 1, preferences: ["B"] }
  ]
);