
import { FruitType } from './types';

export const WALL_THICKNESS = 50;
export const GAME_WIDTH = 400; // Logical width
export const GAME_HEIGHT = 650; // Logical height
export const DEADLINE_Y = 150; // Y position of the game over line

// TODO: Replace this string with the URL of your uploaded image to see it in the game!
// Example: '/background.png' (if in public folder) or 'https://github.com/ribbaty/first/blob/main/lovelyduoduo.png?raw=true'
export const BACKGROUND_IMAGE_URL = "https://github.com/ribbaty/first/blob/main/lovelyduoduo.png?raw=true"; 

// Using Microsoft Fluent UI 3D Emojis hosted on CDN for demonstration.
// These are PNGs with transparent backgrounds.
// hitboxScale: 0.85 means the physics circle is 85% size of the visual image, 
// making the collision feel like it matches the "edge" of the fruit better.
export const FRUITS: FruitType[] = [
  { 
    id: 0, 
    name: 'PinkBow', 
    radius: 22, // Slightly adjusted size for the bow
    color: '#EC4899', // Pink color
    emoji: '🎀', 
    score: 2,
    // Replaced with a Data URI representing a Pink Bow to match your request immediately
    imgUrl: 'https://github.com/ribbaty/first/blob/1e44308d25c062b137edca94365c31284973a696/00.png?raw=true',
    hitboxScale: 0.75 // Tighter hitbox for irregular shape
  },
  { 
    id: 1, 
    name: 'Cherry', 
    radius: 26, 
    color: '#DC2626', 
    emoji: '🍒', 
    score: 4,
    imgUrl: 'https://github.com/ribbaty/first/blob/1e44308d25c062b137edca94365c31284973a696/01.png?raw=true',
    hitboxScale: 0.85
  },
  { 
    id: 2, 
    name: 'Orange', 
    radius: 32, 
    color: '#EA580C', 
    emoji: '🍊', 
    score: 8,
    imgUrl: 'https://github.com/ribbaty/first/blob/1e44308d25c062b137edca94365c31284973a696/02.png?raw=true',
    hitboxScale: 0.9
  },
  { 
    id: 3, 
    name: 'Lemon', 
    radius: 38, 
    color: '#FACC15', 
    emoji: '🍋', 
    score: 16,
    imgUrl: 'https://github.com/ribbaty/first/blob/1e44308d25c062b137edca94365c31284973a696/03.png?raw=true',
    hitboxScale: 0.85
  },
  { 
    id: 4, 
    name: 'Kiwi', 
    radius: 46, 
    color: '#65A30D', 
    emoji: '🥝', 
    score: 32,
    imgUrl: 'https://github.com/ribbaty/first/blob/1e44308d25c062b137edca94365c31284973a696/04.png?raw=true',
    hitboxScale: 0.9
  },
  { 
    id: 5, 
    name: 'Tomato', 
    radius: 56, 
    color: '#E11D48', 
    emoji: '🍅', 
    score: 64,
    imgUrl: 'https://github.com/ribbaty/first/blob/1e44308d25c062b137edca94365c31284973a696/05.png?raw=true',
    hitboxScale: 0.9
  },
  { 
    id: 6, 
    name: 'Peach', 
    radius: 68, 
    color: '#F472B6', 
    emoji: '🍑', 
    score: 128,
    imgUrl: 'https://github.com/ribbaty/first/blob/1e44308d25c062b137edca94365c31284973a696/06.png?raw=true',
    hitboxScale: 0.9
  },
  { 
    id: 7, 
    name: 'Pineapple', 
    radius: 82, 
    color: '#F59E0B', 
    emoji: '🍍', 
    score: 256,
    imgUrl: 'https://github.com/ribbaty/first/blob/1e44308d25c062b137edca94365c31284973a696/07.png?raw=true',
    hitboxScale: 0.85
  },
  { 
    id: 8, 
    name: 'Coconut', 
    radius: 98, 
    color: '#78350F', 
    emoji: '🥥', 
    score: 512,
    imgUrl: 'https://github.com/ribbaty/first/blob/1e44308d25c062b137edca94365c31284973a696/08.png?raw=true',
    hitboxScale: 0.9
  },
  { 
    id: 9, 
    name: 'Watermelon', 
    radius: 115, 
    color: '#10B981', 
    emoji: '🍉', 
    score: 1024,
    imgUrl: 'https://github.com/ribbaty/first/blob/1e44308d25c062b137edca94365c31284973a696/09.png?raw=true',
    hitboxScale: 0.9
  },
  { 
    id: 10, 
    name: 'BigMelon', 
    radius: 135, 
    color: '#059669', 
    emoji: '🏆', 
    score: 2048,
    imgUrl: 'https://github.com/ribbaty/first/blob/1e44308d25c062b137edca94365c31284973a696/10.png?raw=true',
    hitboxScale: 0.9
  },
];

export const SPAWN_Y = 50; // Where the preview fruit hangs
