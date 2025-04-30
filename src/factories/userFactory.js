export const createStudent = (type, name, email, ownerId, quizId = null, quizName = null, assignedQuizId = null) => {
  const base = {
    name,
    email,
    ownerId,
    quizzes: {},
    completedTests: {},
    createdAt: new Date().toISOString()
  };

  switch (type) {
    case "basic":
      return base;

    case "with-test":
      return {
        ...base,
        quizzes: (quizId && quizName && assignedQuizId) ? {
          [assignedQuizId]: {
            quizId: quizId,
            quizName: quizName,
            assignedBy: ownerId,
            timestamp: new Date().toISOString()
          }
        } : {}
      };

    default:
      throw new Error(`Tip student necunoscut: ${type}`);
  }
};
