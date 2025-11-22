
export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
}

export interface FruitType {
  id: number;
  name: string;
  radius: number;
  color: string;
  emoji: string;
  score: number;
  imgUrl?: string; // Optional URL for custom image asset
  hitboxScale?: number; // Ratio of physics radius to visual radius (default 1.0). < 1.0 means image is larger than physics body (tighter collision)
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}
