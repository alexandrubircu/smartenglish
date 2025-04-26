export const createStudent = (type, name, email, ownerId, quizId = null, quizName) => {
  
  const base = {
    name,
    email,
    ownerId,
    quizzes: [],
    completedTests: [],
    createdAt: new Date()
  };

  switch (type) {
    case "basic":
      return base;

    case "with-test":
      return {
        ...base,
        quizzes: (quizId && quizName) ? [
          {
            [quizName]: {
              quizId: quizId,
              timestamp: new Date().toISOString()
            }
          }
        ] : []
      };

    default:
      throw new Error(`Tip student necunoscut: ${type}`);
  }
};
