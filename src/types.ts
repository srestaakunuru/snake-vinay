export interface Track {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  duration: number; // in seconds
  audioUrl: string;
}

export interface GameState {
  score: number;
  highScore: number;
  isPaused: boolean;
  isGameOver: boolean;
}
