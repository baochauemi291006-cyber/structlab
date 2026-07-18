export type User = {
  id: number;
  displayName: string;
  email: string;
};

export type AuthResponse = {
  token: string;
  tokenType: string;
  expiresInSeconds: number;
  user: User;
};

export type TopicSummary = {
  id: number;
  slug: string;
  title: string;
  shortDescription: string;
  icon: string;
  color: string;
  orderIndex: number;
  estimatedMinutes: number;
  difficulty: string;
  visualizerAvailable: boolean;
  lessonCount: number;
};

export type Lesson = {
  id: number;
  title: string;
  summary: string;
  content: string;
  codeExample: string;
  orderIndex: number;
  completed: boolean;
};

export type TopicDetail = Omit<TopicSummary, "lessonCount" | "orderIndex"> & {
  overview: string;
  lessons: Lesson[];
};

export type Exercise = {
  id: number;
  topicSlug: string;
  topicTitle: string;
  prompt: string;
  type: "MULTIPLE_CHOICE" | "PREDICT_STATE" | "COMPLEXITY";
  options: string[];
  points: number;
  difficulty: string;
};

export type AttemptResult = {
  correct: boolean;
  correctAnswer: string;
  explanation: string;
  pointsEarned: number;
  totalPoints: number;
};

export type Operation = {
  type: string;
  value?: number;
  index?: number;
};

export type VisualizationStep = {
  stepNumber: number;
  operation: string;
  description: string;
  state: number[];
  highlightedIndices: number[];
  removedValue?: number;
  found?: boolean;
};

export type VisualizationResponse = {
  structureType: "array" | "stack" | "queue";
  initialState: number[];
  finalState: number[];
  steps: VisualizationStep[];
  timeComplexity: string;
  spaceComplexity: string;
};

export type TopicProgress = {
  slug: string;
  title: string;
  color: string;
  completedLessons: number;
  totalLessons: number;
  lessonPercent: number;
  quizAccuracy: number;
};

export type RecentAttempt = {
  exerciseId: number;
  topicTitle: string;
  prompt: string;
  correct: boolean;
  pointsEarned: number;
  attemptedAt: string;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
};

export type Dashboard = {
  displayName: string;
  totalPoints: number;
  completedLessons: number;
  totalLessons: number;
  attempts: number;
  accuracy: number;
  correctStreak: number;
  topics: TopicProgress[];
  recentAttempts: RecentAttempt[];
  achievements: Achievement[];
};
