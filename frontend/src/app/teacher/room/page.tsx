"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Users, Send, History, Lightbulb, Check, X } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  status: string;
}

interface RoomState {
  teacher: { id: string; name: string } | null;
  students: Student[];
  currentWord: string;
  wordHistory: { id: string; word: string; status: string }[];
}

type Difficulty = 'Fácil' | 'Média' | 'Difícil';

const SUGGESTED_WORDS: Record<Difficulty, string[]> = {
  Fácil: ["CA SA", "BO LA", "GA TO", "LU A", "SO FA"],
  Média: ["MA CA CO", "BA NA NA", "JA NE LA", "SA PA TO"],
  Difícil: ["ME SI NHA", "CA DE LA", "PI PO CA", "FO GUE TE", "BI CI CLE TA"]
};

function TeacherRoomContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const name = searchParams.get('name');
  const roomCode = searchParams.get('roomCode')?.toUpperCase();
  
  const [roomState, setRoomState] = useState<RoomState>({ teacher: null, students: [], currentWord: '', wordHistory: [] });
  const [wordInput, setWordInput] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('Fácil');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!name || !roomCode) {
      router.push('/teacher');
      return;
    }

    const init = async () => {
      // Create or update room in DB
      await supabase.from('rooms').upsert({
        code: roomCode,
        teacher_name: name,
        updated_at: new Date().toISOString()
      }, { onConflict: 'code' });

      // Fetch initial state
      const { data: roomData } = await supabase.from('rooms').select('current_word').eq('code', roomCode).single();
      const { data: historyData } = await supabase.from('room_history').select('*').eq('room_code', roomCode).order('created_at', { ascending: true });

      setRoomState(prev => ({
        ...prev,
        teacher: { id: 'teacher', name },
        currentWord: roomData?.current_word || '',
        wordHistory: historyData || []
      }));

      // Setup Realtime
      const channel = supabase.channel(`room:${roomCode}`, {
        config: { presence: { key: 'teacher' } }
      });

      channel
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState();
          const studentsOnline: Student[] = [];
          for (const id in state) {
            const presences = state[id] as any[];
            presences.forEach(p => {
              if (p.type === 'student') {
                studentsOnline.push({ id, name: p.name, status: 'Conectado' });
              }
            });
          }
          setRoomState(prev => ({ ...prev, students: studentsOnline }));
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await channel.track({ type: 'teacher', name });
            setIsReady(true);
          }
        });

      return () => {
        supabase.removeChannel(channel);
      };
    };

    init();
  }, [name, roomCode, router]);

  const handleSendWord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (wordInput.trim()) {
      const word = wordInput.trim().toUpperCase();
      setWordInput('');
      
      const tempId = Math.random().toString();

      // Update local state instantly
      setRoomState(prev => ({
        ...prev,
        currentWord: word,
        wordHistory: [...prev.wordHistory, { id: tempId, word, status: 'pending' }]
      }));

      // Add to history DB
      await supabase.from('room_history').insert({
        room_code: roomCode,
        word: word,
        status: 'pending'
      });

      // Broadcast word
      await supabase.channel(`room:${roomCode}`).send({
        type: 'broadcast',
        event: 'word_update',
        payload: { word }
      });

      // Update room DB
      await supabase.from('rooms').update({
        current_word: word,
        updated_at: new Date().toISOString()
      }).eq('code', roomCode);
    }
  };

  const handleClearWord = async () => {
    setRoomState(prev => ({ ...prev, currentWord: '' }));

    await supabase.channel(`room:${roomCode}`).send({
      type: 'broadcast',
      event: 'word_update',
      payload: { word: '' }
    });

    await supabase.from('rooms').update({
      current_word: '',
      updated_at: new Date().toISOString()
    }).eq('code', roomCode);
  };

  const handleFeedback = async (type: 'correct' | 'wrong') => {
    if (roomState.wordHistory.length > 0 && roomState.currentWord) {
      const lastWord = roomState.wordHistory[roomState.wordHistory.length - 1];
      
      // Update local state instantly
      setRoomState(prev => {
        const updated = [...prev.wordHistory];
        updated[updated.length - 1].status = type;
        return { ...prev, wordHistory: updated, currentWord: '' };
      });

      await supabase.from('room_history').update({ status: type }).eq('id', lastWord.id);
    }
    
    // Broadcast feedback animation via realtime directly
    await supabase.channel(`room:${roomCode}`).send({
      type: 'broadcast',
      event: 'feedback',
      payload: { type }
    });

    await handleClearWord();
  };

  if (!isReady) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-medium">Conectando à sala...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-8">
        
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Painel do Professor</h1>
            <p className="text-slate-500">Olá, {name}</p>
          </div>
          <div className="bg-indigo-50 px-6 py-3 rounded-2xl flex items-center gap-3">
            <span className="text-indigo-600 font-medium text-sm uppercase tracking-wider">Código da Sala</span>
            <span className="text-2xl font-bold text-indigo-700 tracking-widest">{roomCode}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Control Panel */}
          <div className="lg:col-span-12 xl:col-span-6 space-y-6">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 space-y-6 flex flex-col h-full">
              <h2 className="text-xl font-bold text-slate-800">Controle de Aula</h2>
              
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Palavra Atual no Quadro</p>
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 flex items-center justify-center min-h-[160px] w-full overflow-hidden">
                  {roomState.currentWord ? (
                    <span className={`font-black text-slate-800 tracking-widest uppercase text-center break-words break-all ${
                      roomState.currentWord.length > 15 ? 'text-2xl md:text-3xl' : 
                      roomState.currentWord.length > 8 ? 'text-4xl md:text-5xl' : 
                      'text-5xl md:text-6xl'
                    }`}>
                      {roomState.currentWord}
                    </span>
                  ) : (
                    <span className="text-xl text-slate-400 font-medium text-center">Nenhuma palavra exibida</span>
                  )}
                </div>
                {roomState.currentWord && (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full mt-4 gap-4">
                    <button 
                      onClick={handleClearWord}
                      className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors whitespace-nowrap"
                    >
                      Limpar quadro
                    </button>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm font-semibold text-slate-400 whitespace-nowrap">Avaliar leitura:</span>
                      <button 
                        onClick={() => handleFeedback('wrong')} 
                        title="Enviar 'Errado' (X vermelho)"
                        className="bg-red-50 hover:bg-red-100 text-red-600 p-2.5 rounded-xl transition-colors border border-red-200 flex items-center justify-center"
                      >
                        <X size={20} strokeWidth={3} />
                      </button>
                      <button 
                        onClick={() => handleFeedback('correct')} 
                        title="Enviar 'Certo' (✓ verde)"
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-600 p-2.5 rounded-xl transition-colors border border-emerald-200 flex items-center justify-center"
                      >
                        <Check size={20} strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleSendWord} className="space-y-4 pt-4 border-t border-slate-100">
                <div className="space-y-2">
                  <label htmlFor="word" className="text-sm font-semibold text-slate-700">Nova Palavra</label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      id="word"
                      type="text"
                      value={wordInput}
                      onChange={(e) => setWordInput(e.target.value)}
                      placeholder="Nova palavra (ex: BO LA)"
                      className="flex-1 min-w-0 px-4 py-3 sm:px-5 sm:py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all uppercase text-base sm:text-lg font-bold"
                      style={{ textTransform: 'uppercase' }}
                      autoComplete="off"
                    />
                    <button
                      type="submit"
                      disabled={!wordInput.trim()}
                      className="flex-shrink-0 px-6 py-3 sm:px-8 sm:py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white font-bold rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Send size={20} />
                      <span className="hidden md:inline">Enviar</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-500">Dica: Você pode usar espaços para separar sílabas (ex: CA SA).</p>
                </div>
              </form>
            </div>
          </div>
            
          {/* NEW SECTION: Suggestions and History */}
          <div className="lg:col-span-6 xl:col-span-3 flex flex-col gap-6 h-full">
            {/* Suggestions */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex-1 flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-amber-500">
                  <Lightbulb size={20} />
                  <h3 className="font-bold text-slate-800">Sugestões</h3>
                </div>
              </div>
              <div className="flex gap-2 mb-4 bg-slate-50 p-1 rounded-xl">
                {(['Fácil', 'Média', 'Difícil'] as Difficulty[]).map(level => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${difficulty === level ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_WORDS[difficulty].map((word, idx) => (
                  <button
                    key={idx}
                    onClick={() => setWordInput(word)}
                    className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-sm font-bold rounded-xl transition-colors border border-amber-200"
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>

            {/* History */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex-1 space-y-4 h-full">
              <div className="flex items-center gap-2 text-indigo-500">
                <History size={20} />
                <h3 className="font-bold text-slate-800">Histórico</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {roomState.wordHistory && roomState.wordHistory.length > 0 ? (
                  roomState.wordHistory.map((item, idx) => {
                    let btnClass = "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200";
                    if (item.status === 'correct') btnClass = "bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border-emerald-200";
                    if (item.status === 'wrong') btnClass = "bg-red-50 hover:bg-red-100 text-red-600 border-red-200";
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => setWordInput(item.word)}
                        className={`px-3 py-1.5 text-sm font-bold rounded-xl transition-colors border ${btnClass}`}
                      >
                        {item.word} {item.status === 'correct' && '✓'} {item.status === 'wrong' && 'X'}
                      </button>
                    );
                  })
                ) : (
                  <p className="text-sm text-slate-400">Nenhuma palavra enviada ainda.</p>
                )}
              </div>
            </div>
          </div>
          {/* END NEW SECTION */}

          {/* Students List */}
          <div className="lg:col-span-6 xl:col-span-3 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="p-2 bg-emerald-50 text-emerald-500 rounded-xl">
                <Users size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Alunos Online</h3>
                <p className="text-sm text-slate-500">{roomState.students.length} conectado(s)</p>
              </div>
            </div>

            <div className="space-y-3">
              {roomState.students.length > 0 ? (
                roomState.students.map((student) => (
                  <div key={student.id} className="flex flex-wrap items-center justify-between gap-2 p-4 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden">
                    <span className="font-bold text-slate-700 truncate min-w-[50px]">{student.name}</span>
                    <span className="text-[10px] sm:text-xs font-bold px-2 py-1 rounded-full bg-amber-100 text-amber-700 whitespace-nowrap">
                      {student.status.toUpperCase()}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-400 font-medium">Aguardando alunos entrarem...</p>
                  <p className="text-sm text-slate-400 mt-2">Compartilhe o código da sala.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function TeacherRoom() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <TeacherRoomContent />
    </Suspense>
  );
}
