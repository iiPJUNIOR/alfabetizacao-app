import Link from 'next/link';
import { BookOpen, UserCircle2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-800">
      <div className="max-w-2xl w-full flex flex-col items-center text-center space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Apoio à Alfabetização
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-lg mx-auto">
            Um espaço tranquilo e focado para aprender a ler. Escolha como você vai entrar hoje:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-xl">
          <Link 
            href="/teacher" 
            className="group flex flex-col items-center justify-center p-10 bg-white rounded-3xl shadow-sm border border-slate-100 hover:shadow-md hover:border-indigo-100 transition-all duration-300 gap-4"
          >
            <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <BookOpen size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Professor</h2>
            <span className="text-slate-500 font-medium">Criar ou acessar sala</span>
          </Link>

          <Link 
            href="/student" 
            className="group flex flex-col items-center justify-center p-10 bg-white rounded-3xl shadow-sm border border-slate-100 hover:shadow-md hover:border-emerald-100 transition-all duration-300 gap-4"
          >
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <UserCircle2 size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Aluno</h2>
            <span className="text-slate-500 font-medium">Entrar para aprender</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
