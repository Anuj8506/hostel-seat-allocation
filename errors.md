## Bug: Gale-Shapley crash on room displacement (`Cannot read properties of undefined (reading 'indexOf')`)

**Symptom:** Round 1 allocation returned 500 once a room received more proposals than its capacity.

**Root cause:** `shapeRooms()` built room objects without a `preferences` array, but `galeShapley.js`'s 
displacement logic (`hostel.preferences.indexOf(...)`) assumed every room had one — needed to rank 
currently-held students against a new proposer.

**Fix:** Pass the already-ranked student list into `shapeRooms()` and build each room's preference 
order from it (rooms rank students purely by score, identical order across all rooms in a pool).

**Why it wasn't caught earlier:** original unit tests didn't include a scenario where a full room 
received a stronger later proposer, so the displacement branch never executed.