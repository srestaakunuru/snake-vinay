import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCcw, Play, Pause } from 'lucide-react';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, GAME_SPEED } from '../constants.ts';

interface Point {
  x: number;
  y: number;
}

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snakeHighScore');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    setFood(newFood);
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    generateFood(INITIAL_SNAKE);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Collision check
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        if (score > highScore) {
          setHighScore(score);
          localStorage.setItem('snakeHighScore', score.toString());
        }
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Food check
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        generateFood(newSnake);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, score, highScore, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    const tick = (time: number) => {
      if (time - lastUpdateRef.current >= GAME_SPEED) {
        moveSnake();
        lastUpdateRef.current = time;
      }
      gameLoopRef.current = requestAnimationFrame(tick);
    };

    gameLoopRef.current = requestAnimationFrame(tick);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [moveSnake]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background grid
    ctx.strokeStyle = 'rgba(57, 255, 20, 0.05)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * size, 0);
      ctx.lineTo(i * size, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * size);
      ctx.lineTo(canvas.width, i * size);
      ctx.stroke();
    }

    // Draw food
    ctx.fillStyle = '#FF00E5';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#FF00E5';
    ctx.beginPath();
    ctx.arc(
      food.x * size + size / 2,
      food.y * size + size / 2,
      size / 2.5,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw snake
    snake.forEach((segment, i) => {
      const isHead = i === 0;
      ctx.fillStyle = '#39FF14';
      ctx.shadowBlur = isHead ? 20 : 10;
      ctx.shadowColor = '#39FF14';
      
      const padding = 2;
      ctx.beginPath();
      if (isHead) {
        ctx.roundRect(
          segment.x * size + padding,
          segment.y * size + padding,
          size - padding * 2,
          size - padding * 2,
          4
        );
      } else {
        ctx.fillRect(
          segment.x * size + padding,
          segment.y * size + padding,
          size - padding * 2,
          size - padding * 2
        );
      }
      ctx.fill();
    });
    
    ctx.shadowBlur = 0;
  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl px-4">
      <div className="w-full flex justify-between items-end">
        <div className="flex flex-col">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500">System Points</span>
          <div className="text-4xl font-sans font-black text-neon-green neon-text-green italic -skew-x-6">
            {score.toString().padStart(4, '0')}
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2 text-zinc-600">
            <Trophy size={14} />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Matrix Record</span>
          </div>
          <div className="text-2xl font-sans font-medium text-white/30">
            {highScore.toString().padStart(4, '0')}
          </div>
        </div>
      </div>

      <div className="relative bg-[#0a0a0a] rounded-2xl p-2 neon-border-green aspect-square w-full max-w-[500px]">
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          className="w-full h-full block"
        />

        <AnimatePresence>
          {(isGameOver || isPaused) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md rounded-xl border border-neon-green/10"
            >
              <div className="flex flex-col items-center gap-6 p-8 text-center">
                {isGameOver ? (
                  <>
                    <h2 className="text-5xl font-sans font-black text-neon-green uppercase tracking-tighter italic scale-y-110 neon-text-green">
                      Game Over
                    </h2>
                    <p className="text-white/40 font-mono text-sm max-w-[200px]">Neural link severed. Re-initialize system?</p>
                    <button 
                      onClick={resetGame}
                      className="group flex items-center gap-3 bg-neon-green text-black px-10 py-3 rounded-none font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_#39FF14]"
                    >
                      <RefreshCcw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                      Reboot
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="text-5xl font-sans font-black text-white/20 uppercase tracking-tighter italic">
                      Paused
                    </h2>
                    <p className="text-white/40 font-mono text-sm">System standing by...</p>
                    <button 
                      onClick={() => setIsPaused(false)}
                      className="flex items-center gap-3 border-2 border-neon-green text-neon-green px-10 py-3 rounded-none font-black uppercase tracking-widest hover:bg-neon-green hover:text-black transition-all"
                    >
                      <Play size={18} fill="currentColor" />
                      Continue
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute bottom-4 right-4 flex gap-2">
            <button 
              onClick={() => setIsPaused(prev => !prev)}
              className="w-10 h-10 rounded-lg bg-black/40 backdrop-blur border border-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-white/60"
            >
              {isPaused ? <Play size={16} fill="currentColor" /> : <Pause size={16} fill="currentColor" />}
            </button>
            <button 
              onClick={resetGame}
              className="w-10 h-10 rounded-lg bg-black/40 backdrop-blur border border-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-white/60"
            >
              <RefreshCcw size={16} />
            </button>
        </div>
      </div>

      <div className="flex gap-12 text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">
        <div className="flex items-center gap-2">
          <span className="bg-white/10 px-1.5 py-0.5 rounded border border-white/10">ARROWS</span>
          <span>Move</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-white/10 px-1.5 py-0.5 rounded border border-white/10">SPACE</span>
          <span>Pause</span>
        </div>
      </div>
    </div>
  );
}
