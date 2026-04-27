import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame.tsx';
import MusicPlayer from './components/MusicPlayer.tsx';
import { motion } from 'motion/react';
import { Gamepad2, Play, Music as MusicIcon, Info, Database, Cpu } from 'lucide-react';
import { DUMMY_TRACKS } from './constants.ts';

export default function App() {
  return (
    <div className="flex h-screen bg-dark-bg text-white font-sans overflow-hidden border-8 border-border">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="scanline" />
      </div>

      {/* Sidebar */}
      <aside className="w-80 bg-panel-bg border-r border-border flex flex-col p-6 z-20">
        <div className="mb-10">
          <h1 className="text-3xl font-black tracking-tighter text-neon-green neon-text-green uppercase italic flex items-center gap-2">
            SynthSnake
          </h1>
          <p className="text-[10px] text-zinc-500 font-mono mt-1 tracking-widest uppercase">System V.04.2-NEON</p>
        </div>

        <div className="flex-1 space-y-8">
          <section>
            <h2 className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 mb-6 font-bold">Neural Playlist</h2>
            <div className="space-y-3">
              {DUMMY_TRACKS.map((track, idx) => (
                <div 
                  key={track.id}
                  className={`p-3 rounded-lg flex items-center gap-3 transition-all cursor-pointer ${
                    idx === 0 
                      ? 'bg-item-bg border border-neon-green/30 shadow-[0_0_15px_rgba(57,255,20,0.1)]' 
                      : 'bg-transparent border border-white/5 opacity-40 hover:opacity-100 hover:border-white/10'
                  }`}
                >
                  <div className={`w-8 h-8 rounded flex items-center justify-center ${
                    idx === 0 ? 'bg-neon-green text-black' : 'bg-zinc-800'
                  }`}>
                    <Play size={idx === 0 ? 14 : 12} fill="currentColor" />
                  </div>
                  <div className="min-w-0">
                    <p className={`text-xs font-bold truncate ${idx === 0 ? 'text-neon-green' : 'text-zinc-300'}`}>
                      {track.title}
                    </p>
                    <p className="text-[10px] text-zinc-500 font-mono">TRK {String(idx + 1).padStart(2, '0')}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-bold">Core Modules</h2>
            <div className="grid grid-cols-2 gap-2">
               {[
                 { icon: Database, label: 'Data', val: '98%' },
                 { icon: Cpu, label: 'Cores', val: 'x16' }
               ].map(item => (
                 <div key={item.label} className="bg-item-bg p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <item.icon size={10} className="text-zinc-500" />
                      <span className="text-[9px] text-zinc-500 uppercase">{item.label}</span>
                    </div>
                    <div className="text-xs font-bold font-mono">{item.val}</div>
                 </div>
               ))}
            </div>
          </section>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
           <div className="flex items-center gap-2 opacity-30 hover:opacity-100 transition-opacity cursor-help">
             <Info size={14} />
             <span className="text-[9px] font-mono tracking-widest uppercase">Protocol Documentation</span>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative bg-dark-bg z-10">
        <div className="flex-1 flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full flex justify-center"
          >
            <SnakeGame />
          </motion.div>
        </div>

        <MusicPlayer />
      </main>
    </div>
  );
}
