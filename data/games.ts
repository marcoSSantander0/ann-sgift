export const games = [
  {
    id: 1,
    title: "Memorama de recuerdos",
    description: "Encuentra las 4 parejas con nuestras fotos."
  },
  {
    id: 2,
    title: "Quiz rápido",
    description: "Responde bien las 3 preguntas especiales."
  },
  {
    id: 3,
    title: "Conecta 4 del amor",
    description: "Solo se gana de verdad si ganas."
  },
  {
    id: 4,
    title: "Mirarnos 20 segundos",
    description: "Reto físico: ojos con ojos y corazón acelerado."
  },
  {
    id: 5,
    title: "Ahorcado romántico",
    description: "Descifra la palabra secreta: una bebida especial."
  },
  {
    id: 6,
    title: "Mini-laberinto de fresa",
    description: "Llega con WASD (o flechas) hasta la meta."
  },
  {
    id: 7,
    title: "Sudoku 6x6",
    description: "Completa el tablero fácil sin equivocarte."
  },
  {
    id: 8,
    title: "Ajusta la melodía",
    description: "Memoriza y repite la secuencia hasta 5 pasos."
  },
  {
    id: 9,
    title: "Puzzle deslizante 3x3",
    description: "Arma la imagen moviendo piezas con un hueco vacío."
  },
  {
    id: 10,
    title: "Detén el reloj",
    description: "Quédate lo más cerca posible de 11.11 segundos."
  },
  {
    id: 11,
    title: "Llave final",
    description: "Reto físico + PIN para desbloquear la carta."
  }
] as const;

export type GameMeta = (typeof games)[number];