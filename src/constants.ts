import { Track } from './types.ts';

export const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Cyberpunk Awakening',
    artist: 'AI-Synth Master',
    coverUrl: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=400&auto=format&fit=crop',
    duration: 184,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: '2',
    title: 'Neon Drift',
    artist: 'Future Core',
    coverUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=400&auto=format&fit=crop',
    duration: 212,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: '3',
    title: 'Subsurface Memory',
    artist: 'Digital Echo',
    coverUrl: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=400&auto=format&fit=crop',
    duration: 156,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  }
];

export const GRID_SIZE = 20;
export const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
export const INITIAL_DIRECTION = { x: 0, y: -1 };
export const GAME_SPEED = 100;
