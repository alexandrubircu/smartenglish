export class QuestionFactory {
  static createQuestion(type = 'choose') {
    if (type === 'choose') {
      return {
        type: 'choose',
        questionText: '',
        answers: ['', ''],
        correctAnswer: null,
      };
    }

    if (type === 'write') {
      return {
        type: 'write',
        questionText: '',
        correctTextAnswers: [''],
      };
    }

    throw new Error(`Unknown question type: ${type}`);
  }
}
