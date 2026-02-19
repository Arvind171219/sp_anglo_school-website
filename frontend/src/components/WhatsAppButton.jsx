import { useState } from 'react';

const PHONE = '918789694039';
const MESSAGE = 'Hello! I would like to know more about S P Anglo Academy.';

export default function WhatsAppButton() {
  const [hovered, setHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  const handleClick = () => {
    window.open(
      `https://wa.me/${PHONE}?text=${encodeURIComponent(MESSAGE)}`,
      '_blank'
    );
  };

  // Auto-hide tooltip after 5 seconds
  if (showTooltip) {
    setTimeout(() => setShowTooltip(false), 5000);
  }

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>
      {/* Tooltip */}
      {showTooltip && (
        <div style={{
          position: 'absolute', bottom: '68px', right: '0',
          background: 'white', color: '#333', padding: '0.6rem 1rem',
          borderRadius: '10px', fontSize: '0.82rem', fontWeight: 600,
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          whiteSpace: 'nowrap',
          animation: 'fadeInUp 0.4s ease',
        }}>
          Chat with us on WhatsApp
          <div style={{
            position: 'absolute', bottom: '-6px', right: '24px',
            width: '12px', height: '12px', background: 'white',
            transform: 'rotate(45deg)',
            boxShadow: '3px 3px 6px rgba(0,0,0,0.08)',
          }} />
        </div>
      )}

      {/* WhatsApp Button */}
      <button
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label="Chat on WhatsApp"
        style={{
          width: '60px', height: '60px', borderRadius: '50%',
          background: '#25D366', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: hovered
            ? '0 8px 25px rgba(37, 211, 102, 0.5)'
            : '0 4px 15px rgba(37, 211, 102, 0.35)',
          transform: hovered ? 'scale(1.1)' : 'scale(1)',
          transition: 'all 0.3s ease',
        }}
      >
        <svg viewBox="0 0 32 32" width="32" height="32" fill="white">
          <path d="M16.004 0C7.165 0 0 7.163 0 16.001c0 2.822.736 5.584 2.137 8.017L.073 32l8.17-2.14A15.932 15.932 0 0 0 16.004 32C24.838 32 32 24.837 32 16.001 32 7.163 24.838 0 16.004 0zm0 29.333a13.28 13.28 0 0 1-6.782-1.858l-.487-.289-5.042 1.322 1.346-4.914-.317-.505A13.27 13.27 0 0 1 2.667 16C2.667 8.636 8.638 2.667 16.004 2.667S29.333 8.636 29.333 16c0 7.365-5.964 13.333-13.329 13.333zm7.313-9.976c-.4-.2-2.367-1.168-2.733-1.3-.367-.134-.633-.2-.9.2-.267.4-1.033 1.3-1.267 1.567-.233.267-.467.3-.867.1-.4-.2-1.689-.622-3.218-1.984-1.189-1.06-1.993-2.37-2.227-2.77-.233-.4-.025-.616.175-.816.18-.18.4-.467.6-.7.2-.233.267-.4.4-.667.133-.267.067-.5-.033-.7-.1-.2-.9-2.167-1.233-2.967-.325-.78-.655-.674-.9-.686l-.767-.013c-.267 0-.7.1-1.067.5-.367.4-1.4 1.367-1.4 3.333 0 1.967 1.433 3.867 1.633 4.133.2.267 2.822 4.31 6.838 6.043.955.413 1.7.66 2.282.844.959.305 1.832.262 2.522.159.77-.115 2.367-.968 2.7-1.902.333-.933.333-1.733.233-1.9-.1-.167-.367-.267-.767-.467z"/>
        </svg>
      </button>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
