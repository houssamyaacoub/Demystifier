import React, { useState } from 'react';
import { Copy, Check, Loader2, Sparkles } from 'lucide-react';

function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [instruction, setInstruction] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleTransform = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Safety checks
    if (!instruction.trim() || !input.trim() || isProcessing) return;

    setIsProcessing(true);
    setProgress(15);

    const progressInterval = setInterval(() => {
      setProgress(prev => (prev < 90 ? prev + 2 : prev));
    }, 100);

    try {
      const response = await fetch("https://vjioo4r1vyvcozuj.us-east-2.aws.endpoints.huggingface.cloud/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_HF_API_KEY || 'test'}` // Use env variable for key
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-120b",
          messages: [
            {
              role: "system",
              content: "You are a professional data transformation engine. Output ONLY the transformed text."
            },
            {
              role: "user",
              content: `Task: ${instruction}\n\nInput Text:\n${input}`
            }
          ],
          temperature: 0.1,
        })
      });

      const data = await response.json();

      clearInterval(progressInterval);
      setProgress(100);

      setTimeout(() => {
        const finalResult = data.choices[0].message.content;
        setOutput(finalResult);
        setIsProcessing(false);
        setProgress(0);
      }, 300);

    } catch (error) {
      console.error("120B API Error:", error);
      setOutput("Critical Error: The 120B model is unreachable.");
      clearInterval(progressInterval);
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[var(--color-obsidian)] text-slate-100 flex flex-col p-6 items-center selection:bg-[var(--color-terminal-green)] selection:text-[var(--color-obsidian-dark)] font-sans antialiased overflow-hidden relative">
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[var(--color-obsidian-light)] to-[var(--color-obsidian)] pointer-events-none opacity-50" />

      {/* Header */}
      <header className="z-10 text-center mb-10 mt-6 sm:mt-8">
        <h1 className="text-5xl md:text-6xl font-mono font-bold tracking-tight text-white drop-shadow-[0_0_15px_rgba(0,255,65,0.4)] transition-all duration-300">
          Demystifier
        </h1>
        <p className="text-slate-400 mt-4 text-sm md:text-base tracking-[0.2em] uppercase font-semibold">Unveil the clarity within the chaos</p>
      </header>

      {/* Magic Bar */}
      <div className="z-10 w-full max-w-4xl mb-12 relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--color-terminal-green)] to-emerald-400 rounded-xl blur opacity-25 group-focus-within:opacity-60 transition duration-500"></div>
        <form onSubmit={handleTransform} className="relative flex items-center bg-[var(--color-obsidian-light)] rounded-xl border border-slate-700 shadow-2xl overflow-hidden focus-within:border-[var(--color-terminal-green)] transition-all duration-300">
          <div className="pl-5 pr-3 text-[var(--color-terminal-green)] animate-pulse">
            <Sparkles size={22} className="opacity-80 drop-shadow-[0_0_8px_rgba(0,255,65,0.8)]" />
          </div>
          <input
            type="text"
            className="flex-1 bg-transparent border-none py-5 px-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-0 text-xl font-medium tracking-wide"
            placeholder="What would you like to Demystify? (Press Enter)"
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            disabled={isProcessing}
          />
          {isProcessing && (
            <div className="pr-5 text-[var(--color-terminal-green)] animate-spin-slow">
              <Loader2 size={26} className="animate-spin" />
            </div>
          )}
        </form>
      </div>

      {/* Vibe Level Progress UI */}
      {isProcessing && (
        <div className="z-10 w-full max-w-xl mb-8 flex flex-col items-center">
          <div className="text-[var(--color-terminal-green)] text-xs font-mono uppercase tracking-[0.3em] mb-3 animate-pulse opacity-80">
            Vibe Level: Processing
          </div>
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-[var(--color-terminal-green)] shadow-[0_0_12px_var(--color-terminal-green)] transition-all duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Split Screen Layout */}
      <div className="z-10 flex-1 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 pb-10 min-h-[500px]">

        {/* Left Panel: Messy Input */}
        <div className="flex flex-col h-full bg-[var(--color-obsidian-light)] rounded-2xl border border-slate-800/[0.8] shadow-2xl overflow-hidden group focus-within:border-slate-500 transition-colors duration-300 hover:shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-[var(--color-obsidian-dark)]/[0.6]">
            <span className="text-xs font-mono text-slate-400 tracking-[0.15em] font-semibold">MESSY INPUT</span>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
            </div>
          </div>
          <textarea
            className="flex-1 w-full bg-transparent p-6 text-slate-300 focus:outline-none resize-none placeholder-slate-700 font-mono text-base leading-relaxed"
            placeholder="Paste your raw, messy data here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        {/* Right Panel: Clean Output */}
        <div className="flex flex-col h-full bg-[var(--color-obsidian-light)] rounded-2xl border border-[var(--color-terminal-dim)] shadow-[0_0_30px_rgba(0,255,65,0.06)] relative overflow-hidden group">
          <div className="px-6 py-4 border-b border-[var(--color-terminal-dim)] flex justify-between items-center bg-[var(--color-obsidian-dark)]/[0.6]">
            <span className="text-xs font-mono text-[var(--color-terminal-green)] tracking-[0.15em] font-semibold drop-shadow-[0_0_2px_rgba(0,255,65,0.5)]">CLEAN OUTPUT</span>
          </div>
          <textarea
            className="flex-1 w-full bg-transparent p-6 text-emerald-50 focus:outline-none resize-none font-mono text-base leading-relaxed"
            value={output}
            readOnly
            placeholder="Your demystified content will appear here..."
          />
          {/* Copy Button */}
          {output && (
            <button
              onClick={handleCopy}
              className="absolute bottom-6 right-6 px-5 py-3 rounded-xl bg-[var(--color-obsidian-dark)] border border-[var(--color-terminal-green)] text-[var(--color-terminal-green)] shadow-[0_0_20px_rgba(0,255,65,0.25)] hover:bg-[var(--color-terminal-green)] hover:text-[var(--color-obsidian-dark)] hover:shadow-[0_0_30px_rgba(0,255,65,0.5)] transition-all duration-300 focus:outline-none flex items-center gap-2.5 group/btn transform hover:-translate-y-1 active:translate-y-0"
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
              <span className="text-sm font-bold tracking-wide">{copied ? 'COPIED!' : 'COPY'}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;
