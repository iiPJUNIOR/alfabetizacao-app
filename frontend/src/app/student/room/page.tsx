"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Check, X } from 'lucide-react';

interface RoomState {
  currentWord: string;
  wordHistory: { id: string; word: string; status: string }[];
}

function StudentRoomContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const name = searchParams.get('name');
  const roomCode = searchParams.get('roomCode')?.toUpperCase();
  
  const [currentWord, setCurrentWord] = useState<string>('');
  const [roomState, setRoomState] = useState<RoomState | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'correct' | 'wrong' | null>(null);

  useEffect(() => {
    if (!name || !roomCode) {
      router.push('/student');
      return;
    }

    const init = async () => {
      // Fetch initial state
      const { data: roomData } = await supabase.from('rooms').select('current_word').eq('code', roomCode).single();
      const { data: historyData } = await supabase.from('room_history').select('*').eq('room_code', roomCode).order('created_at', { ascending: true });

      setCurrentWord(roomData?.current_word || '');
      setRoomState({
        currentWord: roomData?.current_word || '',
        wordHistory: historyData || []
      });

      // Setup Realtime
      const channel = supabase.channel(`room:${roomCode}`, {
        config: { presence: { key: `student_${name}_${Math.random().toString(36).substring(7)}` } }
      });

      channel
        .on('broadcast', { event: 'word_update' }, (payload) => {
          const newWord = payload.payload.word || '';
          setCurrentWord(newWord);
          setRoomState(prev => prev ? { 
            ...prev, 
            currentWord: newWord,
            wordHistory: newWord ? [...prev.wordHistory, { id: Math.random().toString(), word: newWord, status: 'pending' }] : prev.wordHistory
          } : { currentWord: newWord, wordHistory: newWord ? [{ id: Math.random().toString(), word: newWord, status: 'pending' }] : [] });
        })
        .on('broadcast', { event: 'feedback' }, (payload) => {
          const type = payload.payload.type;
          setFeedbackType(type);
          setRoomState(prev => {
            if (!prev || prev.wordHistory.length === 0) return prev;
            const updated = [...prev.wordHistory];
            updated[updated.length - 1].status = type;
            return { ...prev, wordHistory: updated, currentWord: '' };
          });
          setTimeout(() => {
            setFeedbackType(null);
          }, 2500);
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await channel.track({ type: 'student', name });
            setIsReady(true);
          }
        });

      return () => {
        supabase.removeChannel(channel);
      };
    };

    init();
  }, [name, roomCode, router]);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center">
        <p className="text-2xl text-slate-400 font-medium animate-pulse">Entrando na sala...</p>
      </div>
    );
  }

  // Dividindo a palavra em sílabas
  const syllables = currentWord ? currentWord.split(' ').filter(Boolean) : [];

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      
      {/* Sidebar with History */}
      {roomState && roomState.wordHistory && roomState.wordHistory.length > 0 && (
        <div className="absolute left-0 top-0 bottom-0 w-48 sm:w-64 bg-slate-50/80 backdrop-blur-sm border-r border-slate-100 p-6 overflow-y-auto hidden md:block z-40">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Histórico</h3>
          <div className="space-y-3">
            {roomState.wordHistory.map((item) => (
              <div 
                key={item.id} 
                className={`px-4 py-3 rounded-2xl font-bold flex items-center justify-between ${
                  item.status === 'correct' ? 'bg-emerald-100 text-emerald-700' :
                  item.status === 'wrong' ? 'bg-red-100 text-red-700' :
                  'bg-white text-slate-600 border border-slate-100'
                }`}
              >
                <span>{item.word}</span>
                {item.status === 'correct' && <Check size={16} strokeWidth={3} />}
                {item.status === 'wrong' && <X size={16} strokeWidth={3} />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center z-10 w-full ml-0 md:ml-48 sm:md:ml-64">
        
        {/* Feedback Overlay */}
        {feedbackType && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-sm transition-all duration-300">
            {feedbackType === 'correct' ? (
              <div className="flex flex-col items-center justify-center" style={{ animation: 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards' }}>
                <div className="w-40 h-40 md:w-56 md:h-56 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-[0_0_80px_rgba(16,185,129,0.5)]">
                  <Check size={120} strokeWidth={4} />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center" style={{ animation: 'shake 0.5s ease-in-out forwards' }}>
                <div className="w-40 h-40 md:w-56 md:h-56 bg-red-500 rounded-full flex items-center justify-center text-white shadow-[0_0_80px_rgba(239,68,68,0.5)]">
                  <X size={120} strokeWidth={4} />
                </div>
              </div>
            )}
          </div>
        )}

        {!currentWord ? (
          <div className="flex flex-col items-center justify-center p-6 transition-colors duration-700">
            <div className="w-24 h-24 mb-8 text-emerald-200">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-5xl font-medium text-slate-300 text-center tracking-wide animate-pulse">
              Aguardando palavra...
            </h1>
          </div>
        ) : (
          <div 
            key={currentWord}
            className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 md:gap-12 lg:gap-16 max-w-[90vw]"
            style={{ animation: 'slideFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
          >
            {syllables.map((syllable, index) => (
              <div 
                key={index}
                className="flex items-center justify-center min-w-[2em] max-w-full h-auto px-4 sm:px-8 py-4 sm:py-6 rounded-3xl sm:rounded-[2.5rem] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/50"
                style={{ 
                  animation: `slideFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.15}s forwards`,
                  opacity: 0
                }}
              >
                <span className={`font-black tracking-tighter text-slate-800 leading-none break-all text-center ${
                  syllable.length > 10 ? 'text-[8vw] sm:text-[6vw] md:text-[4rem] lg:text-[6rem]' :
                  syllable.length > 5 ? 'text-[10vw] sm:text-[8vw] md:text-[6rem] lg:text-[8rem]' :
                  'text-[12vw] sm:text-[10vw] md:text-[8rem] lg:text-[12rem]'
                }`} style={{ fontFamily: 'var(--font-geist-sans), system-ui, sans-serif' }}>
                  {syllable}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideFadeIn {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes popIn {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-15px) rotate(-5deg); }
          40% { transform: translateX(15px) rotate(5deg); }
          60% { transform: translateX(-15px) rotate(-5deg); }
          80% { transform: translateX(15px) rotate(5deg); }
        }
      `}} />
    </div>
  );
}

export default function StudentRoom() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <StudentRoomContent />
    </Suspense>
  );
}
