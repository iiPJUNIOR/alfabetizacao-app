"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserCircle2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function StudentLogin() {
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const router = useRouter();

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && roomCode.trim()) {
      router.push(`/student/room?name=${encodeURIComponent(name)}&roomCode=${encodeURIComponent(roomCode)}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-slate-100 p-8 space-y-8">
        <div className="flex flex-col items-center space-y-4 relative">
          <Link href="/" className="absolute left-0 top-0 text-slate-400 hover:text-slate-600 transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center">
            <UserCircle2 size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Sala do Aluno</h2>
          <p className="text-slate-500 text-center">
            Pronto para aprender? Digite seu nome e a sala.
          </p>
        </div>

        <form onSubmit={handleJoin} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-semibold text-slate-700 ml-1">Seu Nome</label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Como quer ser chamado?"
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="roomCode" className="text-sm font-semibold text-slate-700 ml-1">Código da Sala</label>
            <input
              id="roomCode"
              type="text"
              required
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              placeholder="Código passado pelo professor"
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all uppercase"
              style={{ textTransform: 'uppercase' }}
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 text-lg"
          >
            Estou pronto
          </button>
        </form>
      </div>
    </div>
  );
}
