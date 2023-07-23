import { User } from "discord.js";
import { IAnswer, IQuestion } from "../interfaces";

export class Poker {
    isQuestionRunning: boolean;
    currentAnswers: Array<IAnswer>;
    currentQuestion: string;
    questions: Array<IQuestion>;
    users: User[];

    constructor() {
      this.isQuestionRunning = false;
      this.currentAnswers = [];
      this.currentQuestion = "";
      this.questions = [];
      this.users = [];
    }

    addUser(user: User) {
      this.users.push(user);
    }

    removeUser(user: User) {
      this.users = this.users.filter((usr) => usr !== user);
    }

    playQuestion(question: string) {
      this.currentQuestion = question;
      this.isQuestionRunning = true;
    }

    addAnswer(user: User, points: number) {
      this.currentAnswers.push({ user, points });
    }

    finishQuestion(storypoints: number) {
      this.questions.push({
        question: this.currentQuestion,
        answers: this.currentAnswers,
        storypoints,
      });
      this.currentQuestion = "";
      this.currentAnswers = [];
      this.isQuestionRunning = false;
    }

    finishGame() {
      this.questions = [];
    }
  }