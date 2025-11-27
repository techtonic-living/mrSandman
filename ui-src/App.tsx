import React from 'react';
import { SandmanController } from './components/mr-sandman/SandmanController';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans text-slate-900 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat bg-fixed bg-opacity-10">
      <div className="absolute inset-0 bg-slate-50/90 backdrop-blur-sm" />
      
      <div className="relative w-full z-10 flex flex-col items-center p-4">
        <div className="w-full max-w-3xl mx-auto text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2 tracking-tight">Mr. Sandman</h1>
          <p className="text-slate-600">Design System Foundations Workbench</p>
        </div>
        
        <SandmanController />
      </div>
    </div>
  );
}
