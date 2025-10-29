// Lesson data for different subjects

export interface Question {
  question: string;
  options: string[];
  correct: number;
  emoji: string;
  explanation?: string;
}

export interface Lesson {
  id: string;
  title: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: Question[];
}

// ========= MATH LESSONS =========

export const mathLessons: Lesson[] = [
  {
    id: 'math-1',
    title: 'Addition Basics',
    subject: 'math',
    difficulty: 'easy',
    questions: [
      {
        question: "What is 5 + 3?",
        options: ["6", "7", "8", "9"],
        correct: 2,
        emoji: "🧮",
        explanation: "5 + 3 = 8. Count 5 fingers, then 3 more!"
      },
      {
        question: "What is 2 + 4?",
        options: ["5", "6", "7", "8"],
        correct: 1,
        emoji: "➕",
        explanation: "2 + 4 = 6"
      },
      {
        question: "What is 10 + 5?",
        options: ["12", "13", "14", "15"],
        correct: 3,
        emoji: "🔢",
        explanation: "10 + 5 = 15"
      },
      {
        question: "What is 7 + 7?",
        options: ["12", "13", "14", "15"],
        correct: 2,
        emoji: "🧮",
        explanation: "7 + 7 = 14. They're doubles!"
      },
      {
        question: "What is 3 + 6?",
        options: ["8", "9", "10", "11"],
        correct: 1,
        emoji: "➕",
        explanation: "3 + 6 = 9"
      }
    ]
  },
  {
    id: 'math-2',
    title: 'Subtraction Fun',
    subject: 'math',
    difficulty: 'easy',
    questions: [
      {
        question: "What is 10 - 4?",
        options: ["4", "5", "6", "7"],
        correct: 2,
        emoji: "➖",
        explanation: "10 - 4 = 6"
      },
      {
        question: "What is 8 - 3?",
        options: ["4", "5", "6", "7"],
        correct: 1,
        emoji: "➖",
        explanation: "8 - 3 = 5"
      },
      {
        question: "What is 15 - 7?",
        options: ["6", "7", "8", "9"],
        correct: 2,
        emoji: "🔢",
        explanation: "15 - 7 = 8"
      },
      {
        question: "What is 12 - 5?",
        options: ["5", "6", "7", "8"],
        correct: 2,
        emoji: "➖",
        explanation: "12 - 5 = 7"
      },
      {
        question: "What is 20 - 10?",
        options: ["8", "9", "10", "11"],
        correct: 2,
        emoji: "🧮",
        explanation: "20 - 10 = 10"
      }
    ]
  },
  {
    id: 'math-3',
    title: 'Shapes and Sides',
    subject: 'math',
    difficulty: 'easy',
    questions: [
      {
        question: "How many sides does a triangle have?",
        options: ["2", "3", "4", "5"],
        correct: 1,
        emoji: "📐",
        explanation: "A triangle has 3 sides!"
      },
      {
        question: "How many sides does a square have?",
        options: ["3", "4", "5", "6"],
        correct: 1,
        emoji: "🟦",
        explanation: "A square has 4 equal sides"
      },
      {
        question: "How many sides does a circle have?",
        options: ["0", "1", "2", "3"],
        correct: 0,
        emoji: "⭕",
        explanation: "A circle has no straight sides!"
      },
      {
        question: "How many corners does a rectangle have?",
        options: ["2", "3", "4", "5"],
        correct: 2,
        emoji: "▭",
        explanation: "A rectangle has 4 corners"
      },
      {
        question: "What shape is a pizza slice?",
        options: ["Circle", "Triangle", "Square", "Rectangle"],
        correct: 1,
        emoji: "🍕",
        explanation: "A pizza slice is triangle-shaped!"
      }
    ]
  },
  {
    id: 'math-4',
    title: 'Comparing Numbers',
    subject: 'math',
    difficulty: 'easy',
    questions: [
      {
        question: "Which is bigger: 15 or 12?",
        options: ["15", "12", "Same", "Neither"],
        correct: 0,
        emoji: "🔢",
        explanation: "15 is bigger than 12"
      },
      {
        question: "Which is smaller: 8 or 11?",
        options: ["8", "11", "Same", "Neither"],
        correct: 0,
        emoji: "🔢",
        explanation: "8 is smaller than 11"
      },
      {
        question: "Is 20 bigger than 18?",
        options: ["Yes", "No"],
        correct: 0,
        emoji: "🎯",
        explanation: "Yes! 20 is bigger than 18"
      },
      {
        question: "Which number comes after 14?",
        options: ["13", "14", "15", "16"],
        correct: 2,
        emoji: "🔢",
        explanation: "15 comes after 14"
      },
      {
        question: "Which is the biggest: 5, 9, or 3?",
        options: ["5", "9", "3", "All same"],
        correct: 1,
        emoji: "🏆",
        explanation: "9 is the biggest number"
      }
    ]
  },
  {
    id: 'math-5',
    title: 'Multiplication Magic',
    subject: 'math',
    difficulty: 'medium',
    questions: [
      {
        question: "What is 2 × 4?",
        options: ["6", "8", "10", "12"],
        correct: 1,
        emoji: "✖️",
        explanation: "2 × 4 = 8. That's 2 groups of 4!"
      },
      {
        question: "What is 3 × 3?",
        options: ["6", "7", "8", "9"],
        correct: 3,
        emoji: "✖️",
        explanation: "3 × 3 = 9"
      },
      {
        question: "What is 5 × 2?",
        options: ["8", "9", "10", "11"],
        correct: 2,
        emoji: "✖️",
        explanation: "5 × 2 = 10"
      },
      {
        question: "What is 4 × 4?",
        options: ["12", "14", "16", "18"],
        correct: 2,
        emoji: "🔢",
        explanation: "4 × 4 = 16"
      },
      {
        question: "What is 6 × 2?",
        options: ["10", "11", "12", "13"],
        correct: 2,
        emoji: "✖️",
        explanation: "6 × 2 = 12"
      }
    ]
  }
];

// ========= READING LESSONS =========

export const readingLessons: Lesson[] = [
  {
    id: 'reading-1',
    title: 'Letter Sounds',
    subject: 'reading',
    difficulty: 'easy',
    questions: [
      {
        question: "What sound does the letter 'A' make?",
        options: ["ah", "bee", "cuh", "duh"],
        correct: 0,
        emoji: "🔤",
        explanation: "'A' makes the 'ah' sound, like in 'apple'"
      },
      {
        question: "Which letter makes the 'mmm' sound?",
        options: ["N", "M", "B", "P"],
        correct: 1,
        emoji: "📝",
        explanation: "'M' makes the 'mmm' sound"
      },
      {
        question: "What letter does 'Cat' start with?",
        options: ["B", "C", "D", "K"],
        correct: 1,
        emoji: "🐱",
        explanation: "Cat starts with the letter 'C'"
      },
      {
        question: "What sound does 'S' make?",
        options: ["zzz", "sss", "fff", "rrr"],
        correct: 1,
        emoji: "🐍",
        explanation: "'S' makes the 'sss' sound, like a snake!"
      },
      {
        question: "Which word starts with 'B'?",
        options: ["Apple", "Ball", "Cat", "Dog"],
        correct: 1,
        emoji: "⚽",
        explanation: "Ball starts with 'B'"
      }
    ]
  },
  {
    id: 'reading-2',
    title: 'Rhyming Words',
    subject: 'reading',
    difficulty: 'easy',
    questions: [
      {
        question: "Which word rhymes with 'Cat'?",
        options: ["Dog", "Hat", "Big", "Run"],
        correct: 1,
        emoji: "🎵",
        explanation: "Cat and Hat rhyme!"
      },
      {
        question: "Which word rhymes with 'Blue'?",
        options: ["Red", "Two", "Green", "Four"],
        correct: 1,
        emoji: "🎨",
        explanation: "Blue and Two rhyme!"
      },
      {
        question: "Which word rhymes with 'Sun'?",
        options: ["Moon", "Fun", "Star", "Cloud"],
        correct: 1,
        emoji: "☀️",
        explanation: "Sun and Fun rhyme!"
      },
      {
        question: "Which word rhymes with 'Tree'?",
        options: ["Bush", "Bee", "Leaf", "Bark"],
        correct: 1,
        emoji: "🌳",
        explanation: "Tree and Bee rhyme!"
      },
      {
        question: "Which word rhymes with 'Book'?",
        options: ["Read", "Look", "Page", "Story"],
        correct: 1,
        emoji: "📚",
        explanation: "Book and Look rhyme!"
      }
    ]
  },
  {
    id: 'reading-3',
    title: 'Simple Words',
    subject: 'reading',
    difficulty: 'easy',
    questions: [
      {
        question: "What word is this: C-A-T?",
        options: ["Dog", "Cat", "Bat", "Rat"],
        correct: 1,
        emoji: "🐱",
        explanation: "C-A-T spells Cat!"
      },
      {
        question: "What word is this: D-O-G?",
        options: ["Dog", "Cat", "Frog", "Hog"],
        correct: 0,
        emoji: "🐕",
        explanation: "D-O-G spells Dog!"
      },
      {
        question: "What word is this: S-U-N?",
        options: ["Moon", "Star", "Sun", "Sky"],
        correct: 2,
        emoji: "☀️",
        explanation: "S-U-N spells Sun!"
      },
      {
        question: "What word is this: B-E-D?",
        options: ["Bad", "Bed", "Bid", "Bud"],
        correct: 1,
        emoji: "🛏️",
        explanation: "B-E-D spells Bed!"
      },
      {
        question: "What word is this: R-U-N?",
        options: ["Run", "Rain", "Red", "Ring"],
        correct: 0,
        emoji: "🏃",
        explanation: "R-U-N spells Run!"
      }
    ]
  },
  {
    id: 'reading-4',
    title: 'Opposite Words',
    subject: 'reading',
    difficulty: 'medium',
    questions: [
      {
        question: "What is the opposite of 'Big'?",
        options: ["Large", "Small", "Huge", "Tall"],
        correct: 1,
        emoji: "🔄",
        explanation: "Small is the opposite of Big"
      },
      {
        question: "What is the opposite of 'Hot'?",
        options: ["Warm", "Cold", "Cool", "Freezing"],
        correct: 1,
        emoji: "🌡️",
        explanation: "Cold is the opposite of Hot"
      },
      {
        question: "What is the opposite of 'Happy'?",
        options: ["Sad", "Glad", "Joyful", "Cheerful"],
        correct: 0,
        emoji: "😊",
        explanation: "Sad is the opposite of Happy"
      },
      {
        question: "What is the opposite of 'Up'?",
        options: ["Down", "Over", "Under", "Above"],
        correct: 0,
        emoji: "⬆️",
        explanation: "Down is the opposite of Up"
      },
      {
        question: "What is the opposite of 'Fast'?",
        options: ["Quick", "Slow", "Rapid", "Swift"],
        correct: 1,
        emoji: "🐢",
        explanation: "Slow is the opposite of Fast"
      }
    ]
  },
  {
    id: 'reading-5',
    title: 'Story Understanding',
    subject: 'reading',
    difficulty: 'medium',
    questions: [
      {
        question: "The cat sat on the ___.",
        options: ["mat", "bat", "hat", "rat"],
        correct: 0,
        emoji: "🐱",
        explanation: "The cat sat on the mat makes sense!"
      },
      {
        question: "I like to ___ books.",
        options: ["eat", "read", "run", "jump"],
        correct: 1,
        emoji: "📖",
        explanation: "We read books!"
      },
      {
        question: "The sun is very ___.",
        options: ["cold", "dark", "bright", "wet"],
        correct: 2,
        emoji: "☀️",
        explanation: "The sun is very bright!"
      },
      {
        question: "Birds can ___.",
        options: ["swim", "fly", "drive", "dig"],
        correct: 1,
        emoji: "🐦",
        explanation: "Birds can fly!"
      },
      {
        question: "We sleep in a ___.",
        options: ["car", "bed", "tree", "box"],
        correct: 1,
        emoji: "😴",
        explanation: "We sleep in a bed!"
      }
    ]
  }
];

// Get lessons by subject
export const getLessonsBySubject = (subject: string): Lesson[] => {
  switch (subject) {
    case 'math':
      return mathLessons;
    case 'reading':
      return readingLessons;
    default:
      return mathLessons; // Default to math
  }
};

// Get a specific lesson
export const getLesson = (subject: string, lessonIndex: number): Lesson | null => {
  const lessons = getLessonsBySubject(subject);
  return lessons[lessonIndex] || null;
};
