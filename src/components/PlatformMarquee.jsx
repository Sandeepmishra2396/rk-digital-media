// Platform Marquee / Featured On Section

const marqueeItems = [
  { icon: '🎵', label: 'Spotify' },
  { icon: '🍎', label: 'Apple Music' },
  { icon: '▶️', label: 'YouTube Music' },
  { icon: '📦', label: 'Amazon Music' },
  { icon: '🎤', label: 'JioSaavn' },
  { icon: '📻', label: 'Wynk Music' },
  { icon: '🎼', label: 'Gaana' },
  { icon: '🎶', label: 'Hungama' },
  { icon: '📱', label: 'Instagram' },
  { icon: '📘', label: 'Facebook' },
  { icon: '🎬', label: 'Moj' },
  { icon: '📹', label: 'Josh' },
  { icon: '☁️', label: 'SoundCloud' },
  { icon: '💎', label: 'Deezer' },
  { icon: '📞', label: 'Caller Tunes' },
];

// Duplicate for seamless infinite scroll
const doubled = [...marqueeItems, ...marqueeItems];

export default function PlatformMarquee() {
  return (
    <section className="py-5 overflow-hidden" style={{ background: '#050813', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="flex items-center">
        {/* Label */}
        <div className="flex-shrink-0 px-6 pr-8 hidden md:block">
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest whitespace-nowrap">
            🤝 Distributed To
          </p>
        </div>

        {/* Marquee Track */}
        <div className="flex-1 overflow-hidden relative">
          {/* Fade edges */}
          <div
            className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to right, #050813, transparent)' }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to left, #050813, transparent)' }}
          />

          <div
            className="marquee-inner"
            style={{ animation: 'marquee 25s linear infinite' }}
          >
            {doubled.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-5 py-2 mx-1 rounded-full border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:border-indigo-500/40 hover:bg-indigo-500/10 transition-all cursor-default whitespace-nowrap"
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
