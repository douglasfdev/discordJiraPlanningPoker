import { IAnswer} from './IAnswer';

export type IQuestion = {
    question: string;
    answers: Array<IAnswer>;
    storypoints: number;
  };