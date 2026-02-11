export type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  correctOption: string;
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "¿Cuál de mis tres gatos es mi favorito?",
    options: ["Lilo", "Pedro", "Oscarín"],
    correctOption: "Oscarín"
  },
  {
    id: 2,
    question: "¿Cuál es mi pokemon favorito?",
    options: ["Pikachu", "Charizard", "Gengar", "Eevee"],
    correctOption: "Pikachu"
  },
  {
    id: 3,
    question: "¿Cuál es el nombre de mi peluche del zorro del principito?",
    options: ["Claudio", "Simón", "Bruno", "Félix"],
    correctOption: "Claudio"
  }
];
