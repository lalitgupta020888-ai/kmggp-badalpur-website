"use client";

import React, { useEffect, useState } from 'react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Scroll back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      style={{
        position: 'fixed',
        right: '22px',
        bottom: '26px',
        width: '46px',
        height: '46px',
        borderRadius: '50%',
        border: 'none',
        display: 'grid',
        placeItems: 'center',
        background: 'linear-gradient(90deg, #a8841c, #ecd282, #c9a227)',
        color: '#071c33',
        fontSize: '1.15rem',
        cursor: 'pointer',
        zIndex: 1040,
        boxShadow: '0 10px 30px rgba(201, 162, 39, 0.4)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity .3s ease, transform .3s ease',
      }}
    >
      <i className="bi bi-arrow-up" />
    </button>
  );
}
