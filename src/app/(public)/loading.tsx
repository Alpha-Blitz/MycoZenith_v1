export default function Loading() {
  return (
    <div className="fixed inset-0 z-[999] bg-[#0A0A0A] flex flex-col items-center justify-center gap-8">

      {/* Logo mark */}
      <div className="relative flex items-center justify-center">
        {/* Outermost slow ring — orange tint */}
        <span className="absolute w-28 h-28 rounded-full border border-[#F97316]/20"
          style={{ animation: 'spin 8s linear infinite' }} />
        {/* Dashed orbit — purple */}
        <span className="absolute w-20 h-20 rounded-full border border-dashed border-[#8B5CF6]/25"
          style={{ animation: 'spin 5s linear infinite reverse' }} />
        {/* Pulse ring */}
        <span className="absolute w-16 h-16 rounded-full border border-[#8B5CF6]/30"
          style={{ animation: 'pulse-ring 2s ease-in-out infinite' }} />

        {/* Core icon */}
        <div className="relative w-12 h-12 rounded-2xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/40 flex items-center justify-center"
          style={{ animation: 'float 3s ease-in-out infinite' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
      </div>

      {/* Wordmark */}
      <div className="flex flex-col items-center gap-1.5">
        <span
          style={{ fontFamily: 'var(--font-playfair)', animation: 'fadeIn 0.6s ease both 0.2s' }}
          className="text-white text-xl font-bold tracking-wide opacity-0"
        >
          MycoZenith
        </span>
        <span
          className="text-[#8B5CF6] text-[10px] font-bold tracking-[0.3em] uppercase opacity-0"
          style={{ animation: 'fadeIn 0.6s ease both 0.4s' }}
        >
          Built on Evidence
        </span>
      </div>

      {/* Shimmer dots */}
      <div className="flex items-center gap-2" style={{ animation: 'fadeIn 0.6s ease both 0.6s', opacity: 0 }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`w-1.5 h-1.5 rounded-full ${i === 2 ? 'bg-[#F97316]' : 'bg-[#8B5CF6]'}`}
            style={{ animation: `dot-bounce 1.2s ease-in-out infinite`, animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-ring {
          0%, 100% { transform: scale(1);   opacity: 0.4; }
          50%       { transform: scale(1.1); opacity: 0.1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px);  }
          50%       { transform: translateY(-4px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
        @keyframes dot-bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
          40%           { transform: scale(1.2); opacity: 1;   }
        }
      `}</style>
    </div>
  )
}
