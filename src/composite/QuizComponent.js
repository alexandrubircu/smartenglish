class QuizComponent {
  toJSON() {
    throw new Error('Method not implemented');
  }

  renderPreview() {
    throw new Error('Method not implemented');
  }
}

export class Answer extends QuizComponent {
  constructor(text = '', isCorrect = false) {
    super();
    this.text = text;
    this.isCorrect = isCorrect;
  }

  toJSON() {
    return this.text;
  }

  renderPreview() {
    return `<tr><td>${this.text}</td><td>${this.isCorrect ? '✔' : ''}</td></tr>`;
  }
}


export class Question extends QuizComponent {
  constructor(questionText = '', type = 'choose', answers = [], correctTextAnswers = []) {
    super();
    this.questionText = questionText;
    this.type = type;
    this.answers = answers; 
    this.correctTextAnswers = correctTextAnswers; 
    this.correctAnswer = 0; 
  }

  toJSON() {
    return {
      questionText: this.questionText,
      type: this.type,
      answers: this.answers.map(a => a.toJSON()),
      correctTextAnswers: this.correctTextAnswers,
      correctAnswer: this.correctAnswer
    };
  }

  renderPreview() {
    if (this.type === 'choose') {
      return `
        <div class="questionPreview">
          <p><strong>${this.questionText}</strong></p>
          <p><strong>Type:</strong> ${this.type === 'choose' ? 'Choose the correct answer' : 'Write the answer'}</p>
          <table class="answersTable">
            <thead>
              <tr>
                <th>Answer</th>
                <th>Correct</th>
              </tr>
            </thead>
            <tbody>
              ${this.answers.map((answer, index) => `
                <tr class="${this.correctAnswer === index ? 'correctAnswerRow' : ''}">
                  <td>${answer.text}</td>
                  <td>${this.correctAnswer === index ? '✔' : ''}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    } else {
      return `
        <div class="questionPreview">
          <p><strong>Question:</strong> ${this.questionText}</p>
          <p><strong>Type:</strong> Write the answer</p>
          <p><strong>Correct answers:</strong> ${this.correctTextAnswers.join(', ')}</p>
        </div>
      `;
    }
  }
}

export class Quiz extends QuizComponent {
  constructor(name = '', questions = []) {
    super();
    this.name = name;
    this.questions = questions;
  }

  toJSON() {
    return {
      quizName: this.name,
      questions: this.questions.map(q => q.toJSON())
    };
  }

  renderPreview() {
    return `
      <div class="quizPreview">
        <h3>Quiz Preview</h3>
        <p><strong>Title:</strong> ${this.name}</p>
        <div class="QuizListpreview">
          ${this.questions.map(q => q.renderPreview()).join('')}
        </div>
      </div>
    `;
  }
}
