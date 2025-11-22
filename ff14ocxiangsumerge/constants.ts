
import { FruitType } from './types';

export const WALL_THICKNESS = 50;
export const GAME_WIDTH = 400; // Logical width
export const GAME_HEIGHT = 650; // Logical height
export const DEADLINE_Y = 150; // Y position of the game over line

// TODO: Replace this string with the URL of your uploaded image to see it in the game!
// Example: '/background.png' (if in public folder) or 'https://raw.githubusercontent.com/ribbaty/three/83aed0deb9dec366bfcc65222fedd812e13e849b/ff14ocxiangsumerge/beijing.png'
export const BACKGROUND_IMAGE_URL = "https://raw.githubusercontent.com/ribbaty/three/83aed0deb9dec366bfcc65222fedd812e13e849b/ff14ocxiangsumerge/beijing.png"; 

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
    imgUrl: 'https://raw.githubusercontent.com/ribbaty/three/83aed0deb9dec366bfcc65222fedd812e13e849b/ff14ocxiangsumerge/00.png',
    hitboxScale: 0.75 // Tighter hitbox for irregular shape
  },
  { 
    id: 1, 
    name: 'Cherry', 
    radius: 26, 
    color: '#DC2626', 
    emoji: '🍒', 
    score: 4,
    imgUrl: 'https://raw.githubusercontent.com/ribbaty/three/83aed0deb9dec366bfcc65222fedd812e13e849b/ff14ocxiangsumerge/01.png',
    hitboxScale: 0.85
  },
  { 
    id: 2, 
    name: 'Orange', 
    radius: 32, 
    color: '#EA580C', 
    emoji: '🍊', 
    score: 8,
    imgUrl: 'https://raw.githubusercontent.com/ribbaty/three/83aed0deb9dec366bfcc65222fedd812e13e849b/ff14ocxiangsumerge/02.png',
    hitboxScale: 0.9
  },
  { 
    id: 3, 
    name: 'Lemon', 
    radius: 38, 
    color: '#FACC15', 
    emoji: '🍋', 
    score: 16,
    imgUrl: 'https://raw.githubusercontent.com/ribbaty/three/83aed0deb9dec366bfcc65222fedd812e13e849b/ff14ocxiangsumerge/03.png',
    hitboxScale: 0.85
  },
  { 
    id: 4, 
    name: 'Kiwi', 
    radius: 46, 
    color: '#65A30D', 
    emoji: '🥝', 
    score: 32,
    imgUrl: 'https://raw.githubusercontent.com/ribbaty/three/83aed0deb9dec366bfcc65222fedd812e13e849b/ff14ocxiangsumerge/04.png',
    hitboxScale: 0.9
  },
  { 
    id: 5, 
    name: 'Tomato', 
    radius: 56, 
    color: '#E11D48', 
    emoji: '🍅', 
    score: 64,
    imgUrl: 'https://raw.githubusercontent.com/ribbaty/three/83aed0deb9dec366bfcc65222fedd812e13e849b/ff14ocxiangsumerge/05.png',
    hitboxScale: 0.9
  },
  { 
    id: 6, 
    name: 'Peach', 
    radius: 68, 
    color: '#F472B6', 
    emoji: '🍑', 
    score: 128,
    imgUrl: 'https://raw.githubusercontent.com/ribbaty/three/83aed0deb9dec366bfcc65222fedd812e13e849b/ff14ocxiangsumerge/06.png',
    hitboxScale: 0.9
  },
  { 
    id: 7, 
    name: 'Pineapple', 
    radius: 82, 
    color: '#F59E0B', 
    emoji: '🍍', 
    score: 256,
    imgUrl: 'https://raw.githubusercontent.com/ribbaty/three/83aed0deb9dec366bfcc65222fedd812e13e849b/ff14ocxiangsumerge/07.png',
    hitboxScale: 0.85
  },
  { 
    id: 8, 
    name: 'Coconut', 
    radius: 98, 
    color: '#78350F', 
    emoji: '🥥', 
    score: 512,
    imgUrl: 'https://raw.githubusercontent.com/ribbaty/three/83aed0deb9dec366bfcc65222fedd812e13e849b/ff14ocxiangsumerge/08.png',
    hitboxScale: 0.9
  },
  { 
    id: 9, 
    name: 'Watermelon', 
    radius: 115, 
    color: '#10B981', 
    emoji: '🍉', 
    score: 1024,
    imgUrl: 'https://raw.githubusercontent.com/ribbaty/three/83aed0deb9dec366bfcc65222fedd812e13e849b/ff14ocxiangsumerge/09.png',
    hitboxScale: 0.9
  },
  { 
    id: 10, 
    name: 'BigMelon', 
    radius: 135, 
    color: '#059669', 
    emoji: '🏆', 
    score: 2048,
    imgUrl: 'https://raw.githubusercontent.com/ribbaty/three/83aed0deb9dec366bfcc65222fedd812e13e849b/ff14ocxiangsumerge/10.png',
    hitboxScale: 0.9
  },
];

export const SPAWN_Y = 50; // Where the preview fruit hangs
