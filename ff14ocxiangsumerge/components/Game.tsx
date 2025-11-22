
import React, { useEffect, useRef, useState, useCallback } from 'react';
import Matter from 'matter-js';
import { FRUITS, GAME_HEIGHT, GAME_WIDTH, WALL_THICKNESS, DEADLINE_Y, SPAWN_Y } from '../constants';
import { GameState, Particle } from '../types';
import { RefreshCw, Play } from 'lucide-react';

// Matter.js aliases
const Engine = Matter.Engine;
const Render = Matter.Render;
const Runner = Matter.Runner;
const Bodies = Matter.Bodies;
const Composite = Matter.Composite;
const Events = Matter.Events;
const Body = Matter.Body;
const Vector = Matter.Vector;

interface GameProps {
  onScoreUpdate: (score: number) => void;
  onGameOver: (finalScore: number) => void;
}

const Game: React.FC<GameProps> = ({ onScoreUpdate, onGameOver }) => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);

  // Game State
  const [currentFruitId, setCurrentFruitId] = useState<number>(0);
  const [nextFruitId, setNextFruitId] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  
  // Assets
  const [loadedImages, setLoadedImages] = useState<Record<number, HTMLImageElement>>({});
  
  // Ref for logic that doesn't need re-renders
  const gameLogicRef = useRef({
    canDrop: true,
    currentFruitBody: null as Matter.Body | null,
    previewX: GAME_WIDTH / 2,
    particles: [] as Particle[],
  });

  // Preload Images
  useEffect(() => {
    const loadImages = async () => {
      const images: Record<number, HTMLImageElement> = {};
      const promises = FRUITS.map(fruit => {
        if (!fruit.imgUrl) return Promise.resolve();
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.crossOrigin = "Anonymous";
          img.src = fruit.imgUrl!;
          img.onload = () => {
            images[fruit.id] = img;
            resolve();
          };
          img.onerror = () => {
            console.warn(`Failed to load image for ${fruit.name}`);
            resolve(); // Resolve anyway to not block
          };
        });
      });

      await Promise.all(promises);
      setLoadedImages(images);
    };

    loadImages();
  }, []);

  // Helper to get random starting fruit (low tier)
  const getRandomFruitId = () => Math.floor(Math.random() * 5); // 0 to 4

  const createFruit = (x: number, y: number, id: number, isStatic = false) => {
    const fruitDef = FRUITS[id];
    const body = Bodies.circle(x, y, fruitDef.radius, {
      isStatic,
      label: `fruit-${id}`,
      restitution: 0.2, // Bounciness
      friction: 0.1,
      density: 0.002, // Heavier fruits push lighter ones
      render: {
        fillStyle: fruitDef.color,
      },
    });
    // Attach data for easier lookup
    (body as any).fruitId = id;
    return body;
  };

  // Initialize Physics Engine
  useEffect(() => {
    if (!sceneRef.current || !canvasRef.current) return;

    // Setup Matter JS
    const engine = Engine.create();
    const world = engine.world;
    engineRef.current = engine;

    // Create Walls
    // Ground - placed slightly lower to match the grass visual
    const ground = Bodies.rectangle(GAME_WIDTH / 2, GAME_HEIGHT + WALL_THICKNESS / 2 - 10, GAME_WIDTH + 200, WALL_THICKNESS, { isStatic: true, render: { fillStyle: '#333' } });
    const leftWall = Bodies.rectangle(0 - WALL_THICKNESS / 2, GAME_HEIGHT / 2, WALL_THICKNESS, GAME_HEIGHT * 2, { isStatic: true, render: { fillStyle: '#333' } });
    const rightWall = Bodies.rectangle(GAME_WIDTH + WALL_THICKNESS / 2, GAME_HEIGHT / 2, WALL_THICKNESS, GAME_HEIGHT * 2, { isStatic: true, render: { fillStyle: '#333' } });

    Composite.add(world, [ground, leftWall, rightWall]);

    // Collision Handling
    Events.on(engine, 'collisionStart', (event) => {
      const pairs = event.pairs;
      
      for (let i = 0; i < pairs.length; i++) {
        const { bodyA, bodyB } = pairs[i];
        const aType = (bodyA as any).fruitId;
        const bType = (bodyB as any).fruitId;

        // Check if both are fruits and same type
        if (aType !== undefined && bType !== undefined && aType === bType) {
          // Merge!
          const mergedId = aType + 1;
          if (mergedId < FRUITS.length) {
            // Remove old bodies
            Composite.remove(world, [bodyA, bodyB]);
            
            // Calculate midpoint
            const midX = (bodyA.position.x + bodyB.position.x) / 2;
            const midY = (bodyA.position.y + bodyB.position.y) / 2;
            
            // Add new bigger fruit
            const newFruit = createFruit(midX, midY, mergedId);
            Composite.add(world, newFruit);
            
            // Score
            const points = FRUITS[aType].score;
            setScore(prev => prev + points);
            
            // Add particles
            for(let k=0; k<8; k++) {
                gameLogicRef.current.particles.push({
                    x: midX,
                    y: midY,
                    vx: (Math.random() - 0.5) * 10,
                    vy: (Math.random() - 0.5) * 10,
                    life: 1.0,
                    color: FRUITS[mergedId].color,
                    size: 5 + Math.random() * 10
                });
            }
          } else {
              // Already max level
          }
        }
      }
    });

    // Game Loop for Custom Rendering
    const runner = Runner.create();
    runnerRef.current = runner;
    
    // Start runner
    Runner.run(runner, engine);

    // Cleanup
    return () => {
      Runner.stop(runner);
      Engine.clear(engine);
      if (renderRef.current) {
        Render.stop(renderRef.current);
        renderRef.current.canvas.remove();
      }
    };
  }, []);

  // Sync score
  useEffect(() => {
    onScoreUpdate(score);
  }, [score, onScoreUpdate]);

  // Custom Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle Retina displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = GAME_WIDTH * dpr;
    canvas.height = GAME_HEIGHT * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${GAME_WIDTH}px`;
    canvas.style.height = `${GAME_HEIGHT}px`;

    let animationFrameId: number;

    const renderLoop = () => {
      if (!engineRef.current) return;

      // 1. Clear
      ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      // 2. Draw Physics Bodies
      const bodies = Composite.allBodies(engineRef.current.world);
      
      // Check Game Over condition
      let crossingLine = false;
      bodies.forEach(body => {
          if (body.label.startsWith('fruit-')) {
              // Ignore the fruit currently being aimed
              if (body === gameLogicRef.current.currentFruitBody) return;
              
              // Allow a buffer for falling fruits
              if (body.position.y < DEADLINE_Y && body.velocity.y > -0.1 && body.velocity.y < 0.1 && !body.isStatic) {
                   crossingLine = true;
              }
          }
      });

      bodies.forEach(body => {
        if (body.render.visible === false) return;

        const { x, y } = body.position;
        
        if (body.label.startsWith('fruit-')) {
          const id = (body as any).fruitId;
          const fruit = FRUITS[id];
          const img = loadedImages[id];

          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(body.angle);

          if (img) {
            // Draw Image
            // Use hitboxScale to calculate visual size relative to physics radius
            const scale = fruit.hitboxScale || 1.0;
            const visualRadius = fruit.radius / scale;
            
            ctx.drawImage(img, -visualRadius, -visualRadius, visualRadius * 2, visualRadius * 2);
          } else {
            // Fallback: Draw Circle + Emoji
            ctx.beginPath();
            ctx.fillStyle = fruit.color;
            ctx.arc(0, 0, fruit.radius, 0, 2 * Math.PI);
            ctx.fill();
            
            ctx.fillStyle = '#fff';
            ctx.font = `${fruit.radius}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(fruit.emoji, 0, 5);
          }
          
          ctx.restore();

        } else {
            // Walls/Ground - Invisible
        }
      });

      // 3. Draw Preview Fruit (if playing)
      if (isPlaying && !isGameOver && gameLogicRef.current.canDrop) {
          const fruit = FRUITS[currentFruitId];
          const img = loadedImages[currentFruitId];
          const x = gameLogicRef.current.previewX;
          const y = SPAWN_Y;

          // Calculate visual size
          const scale = fruit.hitboxScale || 1.0;
          const visualRadius = fruit.radius / scale;

          if (img) {
              ctx.globalAlpha = 0.8;
              ctx.drawImage(img, x - visualRadius, y - visualRadius, visualRadius * 2, visualRadius * 2);
              ctx.globalAlpha = 1.0;
          } else {
              ctx.globalAlpha = 0.8;
              ctx.beginPath();
              ctx.arc(x, y, fruit.radius, 0, Math.PI * 2);
              ctx.fillStyle = fruit.color;
              ctx.fill();
              
              ctx.font = `${fruit.radius}px sans-serif`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = '#fff';
              ctx.fillText(fruit.emoji, x, y + 5);
              ctx.globalAlpha = 1.0;
          }

          // Guideline
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(255,255,255,0.5)';
          ctx.setLineDash([5, 5]);
          ctx.moveTo(x, y + visualRadius);
          ctx.lineTo(x, GAME_HEIGHT);
          ctx.stroke();
          ctx.setLineDash([]);
      }

      // 4. Draw Deadline
      ctx.beginPath();
      ctx.strokeStyle = '#FF8A80'; // Soft Red
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.setLineDash([10, 10]);
      ctx.moveTo(0, DEADLINE_Y);
      ctx.lineTo(GAME_WIDTH, DEADLINE_Y);
      ctx.stroke();
      ctx.setLineDash([]);

      // 5. Particles
      for (let i = gameLogicRef.current.particles.length - 1; i >= 0; i--) {
          const p = gameLogicRef.current.particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 0.05;
          p.vy += 0.5; // Gravity

          if (p.life <= 0) {
              gameLogicRef.current.particles.splice(i, 1);
          } else {
              ctx.globalAlpha = p.life;
              ctx.fillStyle = p.color;
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
              ctx.fill();
              ctx.globalAlpha = 1.0;
          }
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    // Game Over Check Interval
    const checkInterval = setInterval(() => {
        if (!isPlaying || isGameOver || !engineRef.current) return;
        
        const bodies = Composite.allBodies(engineRef.current.world);
        let gameOverDetected = false;
        
        bodies.forEach(body => {
            if (body.label.startsWith('fruit-')) {
                 if (body.position.y < DEADLINE_Y && body.velocity.y > -0.1 && body.velocity.y < 0.1 && Math.abs(body.velocity.x) < 0.1) {
                    gameOverDetected = true;
                 }
            }
        });

        if (gameOverDetected) {
            handleGameOver();
        }
    }, 1000);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(checkInterval);
    };
  }, [currentFruitId, isPlaying, isGameOver, loadedImages]); // Depend on loadedImages to re-bind render loop if needed

  const handleGameOver = () => {
      setIsGameOver(true);
      setIsPlaying(false);
      onGameOver(score);
  };

  const resetGame = () => {
      if (!engineRef.current) return;
      
      // Clear all fruits
      const bodies = Composite.allBodies(engineRef.current.world);
      const fruits = bodies.filter(b => b.label.startsWith('fruit-'));
      Composite.remove(engineRef.current.world, fruits);

      setScore(0);
      setNextFruitId(getRandomFruitId());
      setCurrentFruitId(getRandomFruitId());
      setIsGameOver(false);
      setIsPlaying(true);
      gameLogicRef.current.canDrop = true;
  };

  // Input Handling
  const handleInputMove = useCallback((clientX: number) => {
    if (!canvasRef.current || !isPlaying || isGameOver) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = GAME_WIDTH / rect.width;
    let x = (clientX - rect.left) * scaleX;
    
    // Clamp
    const fruit = FRUITS[currentFruitId];
    const scale = fruit.hitboxScale || 1.0;
    const visualRadius = fruit.radius / scale;

    x = Math.max(visualRadius + WALL_THICKNESS/2, Math.min(x, GAME_WIDTH - visualRadius - WALL_THICKNESS/2));
    
    gameLogicRef.current.previewX = x;
  }, [isPlaying, isGameOver, currentFruitId]);

  const handleInputEnd = useCallback(() => {
     if (!isPlaying || isGameOver || !gameLogicRef.current.canDrop || !engineRef.current) return;

     const x = gameLogicRef.current.previewX;
     const y = SPAWN_Y;
     
     // Drop logic
     gameLogicRef.current.canDrop = false;
     
     const newBody = createFruit(x, y, currentFruitId);
     Composite.add(engineRef.current.world, newBody);

     // Set cooldown
     setTimeout(() => {
         setCurrentFruitId(nextFruitId);
         setNextFruitId(getRandomFruitId());
         gameLogicRef.current.canDrop = true;
     }, 600);

  }, [isPlaying, isGameOver, currentFruitId, nextFruitId]);

  // Event Listeners for Input
  useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const onTouchMove = (e: TouchEvent) => {
          e.preventDefault();
          handleInputMove(e.touches[0].clientX);
      };
      const onMouseMove = (e: MouseEvent) => {
          handleInputMove(e.clientX);
      };
      const onTouchEnd = (e: TouchEvent) => {
          handleInputEnd();
      };
      const onMouseUp = (e: MouseEvent) => {
          handleInputEnd();
      };

      canvas.addEventListener('touchmove', onTouchMove, { passive: false });
      canvas.addEventListener('mousemove', onMouseMove);
      canvas.addEventListener('touchend', onTouchEnd);
      canvas.addEventListener('mouseup', onMouseUp);

      return () => {
          canvas.removeEventListener('touchmove', onTouchMove);
          canvas.removeEventListener('mousemove', onMouseMove);
          canvas.removeEventListener('touchend', onTouchEnd);
          canvas.removeEventListener('mouseup', onMouseUp);
      };
  }, [handleInputMove, handleInputEnd]);

  // Dynamic Style for Background: Glassmorphism
  const gameAreaStyle: React.CSSProperties = {
    width: GAME_WIDTH, 
    height: GAME_HEIGHT,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent white
    backdropFilter: 'blur(4px)', // Blurs the global background behind the game
    WebkitBackdropFilter: 'blur(4px)',
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden select-none font-['Fredoka']">
      {/* Game Area */}
      <div 
        ref={sceneRef}
        className="relative shadow-2xl rounded-3xl overflow-hidden border-4 border-white/80"
        style={gameAreaStyle}
      >
        <canvas ref={canvasRef} className="block w-full h-full touch-none relative z-10" />

        {/* Next Fruit Indicator */}
        {isPlaying && !isGameOver && (
            <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md p-2 rounded-2xl border-2 border-pink-200 flex flex-col items-center gap-1 shadow-sm pointer-events-none z-20">
                <span className="text-xs text-pink-500 font-bold uppercase tracking-wider">Next</span>
                <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full text-2xl border-2 border-pink-100 overflow-hidden">
                    {loadedImages[nextFruitId] ? (
                         <img src={FRUITS[nextFruitId].imgUrl} alt="next" className="w-full h-full object-contain p-1" />
                    ) : (
                         FRUITS[nextFruitId].emoji
                    )}
                </div>
            </div>
        )}

        {/* Start / Restart Overlays */}
        {(!isPlaying && !isGameOver) && (
           <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[3px] z-30">
               <button 
                onClick={resetGame}
                className="group relative px-10 py-5 bg-[#F472B6] text-white text-3xl font-bold rounded-full shadow-[0_8px_0_#BE185D] hover:translate-y-1 hover:shadow-[0_4px_0_#BE185D] transition-all active:translate-y-2 active:shadow-none overflow-hidden border-4 border-white"
               >
                   <span className="relative z-10 flex items-center gap-3 drop-shadow-md">
                        <Play fill="currentColor" className="w-8 h-8" /> Play
                   </span>
               </button>
           </div> 
        )}

        {isGameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md z-30 p-6 text-center animate-in fade-in duration-500">
                <h2 className="text-6xl font-black text-white mb-2 drop-shadow-[0_4px_0_rgba(0,0,0,0.2)] rotate-[-5deg]">OOPS!</h2>
                <p className="text-white/90 mb-8 text-xl font-bold">Too high!</p>
                
                <div className="bg-white p-6 rounded-3xl border-4 border-pink-200 shadow-xl mb-8 w-full max-w-xs rotate-2 transform transition-transform hover:rotate-0">
                    <p className="text-sm text-pink-400 uppercase tracking-widest mb-1 font-bold">Final Score</p>
                    <p className="text-5xl font-black text-pink-500">{score}</p>
                </div>

                <button 
                    onClick={resetGame}
                    className="px-8 py-4 bg-[#F472B6] text-white text-xl font-bold rounded-2xl shadow-lg hover:bg-[#EC4899] transition-colors flex items-center gap-2 border-4 border-white"
                >
                    <RefreshCw className="w-6 h-6" /> Try Again
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default Game;
