function galeShapley(students, hostels) {
    const studentMatch = {};   // studentId -> hostelId (or null if unmatched)
    const hostelHoldings = {}; // hostelId -> array of studentIds currently held
    const nextProposalIndex = {}; // studentId -> index into their own preferences array

    const freeStudents = [];  // queue of student IDs who still need to propose

    for (const student of students) {
        studentMatch[student.id] = null;
        nextProposalIndex[student.id] = 0;
        freeStudents.push(student.id);
    }

    for (const hostel of hostels) {
        hostelHoldings[hostel.id] = [];
    }

    // quick lookup maps, so we don't loop through arrays every time
    const studentMap = {};
    for (const student of students) {
        studentMap[student.id] = student;
    }

    const hostelMap = {};
    for (const hostel of hostels) {
        hostelMap[hostel.id] = hostel;
    }

    while (freeStudents.length > 0) {
        const studentId = freeStudents.pop();
        const student = studentMap[studentId];

        // student has already been rejected by everyone on their list
        if (nextProposalIndex[studentId] >= student.preferences.length) {
            continue;
        }

        const hostelId = student.preferences[nextProposalIndex[studentId]];
        nextProposalIndex[studentId]++;

        const hostel = hostelMap[hostelId];
        // ... proposal handling goes here next
        const currentlyHeld = hostelHoldings[hostelId];

        if (currentlyHeld.length < hostel.capacity) {
            // hostel has a free seat — accept immediately
            currentlyHeld.push(studentId);
            studentMatch[studentId] = hostelId;
        } 
        else {
            // hostel is full — find the weakest currently-held student
            const hostelPrefs = hostel.preferences;
            let weakestStudentId = null;
            let weakestRank = -1;

            for (const heldId of currentlyHeld) {
                const rank = hostelPrefs.indexOf(heldId);//rank simply mean what is your index in preference list of hostel
                if (rank > weakestRank) {
                weakestRank = rank;
                weakestStudentId = heldId;
                }    
            }

            const proposerRank = hostelPrefs.indexOf(studentId);

            if (proposerRank < weakestRank) {
                // proposer is better than the weakest held student — bump them
                currentlyHeld.splice(currentlyHeld.indexOf(weakestStudentId), 1);
                studentMatch[weakestStudentId] = null;
                freeStudents.push(weakestStudentId);

                currentlyHeld.push(studentId);
                studentMatch[studentId] = hostelId;
            } 
            else {
                // proposer is worse than everyone currently held — rejected
                freeStudents.push(studentId);
            }
        }
    }
    const unmatchedStudents = [];
    for (const studentId in studentMatch) {
        if (studentMatch[studentId] === null) {
        unmatchedStudents.push(studentId);
        }
    }

    return { studentMatch, hostelHoldings, unmatchedStudents };
}

module.exports = galeShapley;