const calculateScore = (student) => {
  if (student.year === 1) {
    if (!student.twelfthPercentage && student.twelfthPercentage !== 0) {
      throw new Error(`Missing twelfthPercentage for first year student ${student._id}`);
    }
    return parseFloat(student.twelfthPercentage.toFixed(2));
  }

  if ([2, 3, 4].includes(student.year)) {
    if (!student.cgpa && student.cgpa !== 0) {
      throw new Error(`Missing cgpa for senior student ${student._id}`);
    }
    return parseFloat((student.cgpa * 10).toFixed(2));
  }

  throw new Error(`Invalid year value: ${student.year}`);
};

const rankStudents = (students) => {
  return [...students].sort((a, b) => {
    const scoreA = calculateScore(a);
    const scoreB = calculateScore(b);
    return scoreB - scoreA;
  });
};

module.exports = { calculateScore, rankStudents };