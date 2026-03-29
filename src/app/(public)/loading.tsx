export default function Loading() {
  return (
    <div className="fixed inset-0 z-[999] bg-[#0A0A0A] flex flex-col items-center justify-center gap-6">

      {/* Animated logo mark */}
      <div className="relative flex items-center justify-center">
        {/* Outer pulse ring */}
        <span className="absolute w-20 h-20 rounded-full border border-[#8B5CF6]/20 animate-[ping_1.8s_ease-in-out_infinite]" />
        {/* Inner glow ring */}
        <span className="absolute w-14 h-14 rounded-full border border-[#8B5CF6]/40 animate-[ping_1.8s_ease-in-out_0.4s_infinite]" />
        {/* Core */}
        <div className="relative w-10 h-10 rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/50 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-[#8B5CF6] animate-pulse" />
        </div>
      </div>

      {/* Wordmark */}
      <p className="text-white/50 text-sm font-medium tracking-[0.3em] uppercase animate-pulse">
        MycoZenith
      </p>

      {/* Progress bar */}
      <div className="w-32 h-px bg-white/[0.07] overflow-hidden rounded-full">
        <div className="h-full bg-[#8B5CF6] rounded-full animate-[loading-bar_1.4s_ease-in-out_infinite]" />
      </div>

      <style>{`
        @keyframes loading-bar {
          0%   { width: 0%;   margin-left: 0; }
          50%  { width: 60%;  margin-left: 20%; }
          100% { width: 0%;   margin-left: 100%; }
        }
      `}</style>
    </div>
  )
}
