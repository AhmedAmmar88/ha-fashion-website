import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ═══════════════════════════════════════════════════════
   DESIGN TOKENS — H&A Fashion v3.0
   Dark luxury palette: black + warm gold + clean white
═══════════════════════════════════════════════════════ */
const T = {
  black:    '#0A0A0A',
  darkGray: '#111111',
  midGray:  '#1A1A1A',
  border:   '#2A2A2A',
  textMid:  '#888888',
  textLight:'#BBBBBB',
  white:    '#FFFFFF',
  offWhite: '#F5F3EF',
  gold:     '#C9A84C',
  goldDark: '#A8893A',
  goldLight:'#E8C96A',
};

/* ═══════════════════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════════════════ */
const globalCSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --black: ${T.black};
    --dark-gray: ${T.darkGray};
    --mid-gray: ${T.midGray};
    --border: ${T.border};
    --text-mid: ${T.textMid};
    --text-light: ${T.textLight};
    --white: ${T.white};
    --off-white: ${T.offWhite};
    --gold: ${T.gold};
    --gold-dark: ${T.goldDark};
    --gold-light: ${T.goldLight};
    --font-ar: 'IBM Plex Sans Arabic', sans-serif;
    --font-en: 'Montserrat', sans-serif;
    --font-display: 'Cormorant Garamond', serif;
    --nav-h: 72px;
    --section-gap: 120px;
    --ease: cubic-bezier(0.4, 0, 0.2, 1);
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--black);
    color: var(--white);
    font-family: var(--font-ar);
    direction: rtl;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  ::selection { background: var(--gold); color: var(--black); }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--black); }
  ::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 2px; }

  /* Loading screen */
  .loading-screen {
    position: fixed; inset: 0;
    background: var(--black);
    display: flex; align-items: center; justify-content: center;
    z-index: 9999;
    transition: opacity 0.6s var(--ease), visibility 0.6s var(--ease);
  }
  .loading-screen.hidden { opacity: 0; visibility: hidden; }
  .loading-logo {
    font-family: var(--font-en);
    font-size: 3rem;
    font-weight: 800;
    letter-spacing: 0.3em;
    color: var(--gold);
    animation: pulse 1.2s ease-in-out infinite;
  }
  @keyframes pulse { 0%,100%{opacity:0.4;} 50%{opacity:1;} }

  /* Nav */
  nav {
    position: fixed; top: 0; left: 0; right: 0;
    height: var(--nav-h);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 48px;
    z-index: 1000;
    transition: background 0.4s var(--ease), backdrop-filter 0.4s var(--ease), box-shadow 0.4s var(--ease);
  }
  nav.transparent { background: transparent; }
  nav.solid {
    background: rgba(10,10,10,0.96);
    backdrop-filter: blur(16px);
    box-shadow: 0 1px 0 var(--border);
  }
  .nav-logo {
    font-family: var(--font-en);
    font-size: 1.5rem;
    font-weight: 800;
    letter-spacing: 0.25em;
    color: var(--gold);
    text-decoration: none;
    cursor: pointer;
  }
  .nav-links { display: flex; gap: 40px; list-style: none; }
  .nav-links a {
    color: var(--text-light);
    text-decoration: none;
    font-size: 0.8rem;
    font-weight: 500;
    letter-spacing: 0.12em;
    font-family: var(--font-ar);
    transition: color 0.2s;
    cursor: pointer;
  }
  .nav-links a:hover { color: var(--gold); }
  .nav-cta {
    background: transparent;
    border: 1px solid var(--gold);
    color: var(--gold);
    padding: 10px 24px;
    font-size: 0.75rem;
    font-family: var(--font-ar);
    font-weight: 500;
    letter-spacing: 0.08em;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
  }
  .nav-cta:hover { background: var(--gold); color: var(--black); }
  .hamburger {
    display: none;
    flex-direction: column; gap: 5px; cursor: pointer; background: none; border: none; padding: 4px;
  }
  .hamburger span { display: block; width: 24px; height: 2px; background: var(--white); transition: all 0.3s; }
  .hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .hamburger.open span:nth-child(2) { opacity: 0; }
  .hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

  /* Mobile menu */
  .mobile-menu {
    position: fixed; inset: 0;
    background: var(--black);
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 40px;
    z-index: 999;
    transform: translateX(100%);
    transition: transform 0.4s var(--ease);
  }
  .mobile-menu.open { transform: translateX(0); }
  .mobile-menu a {
    font-size: 1.8rem;
    color: var(--white);
    text-decoration: none;
    font-weight: 300;
    letter-spacing: 0.05em;
    transition: color 0.2s;
  }
  .mobile-menu a:hover { color: var(--gold); }

  /* Hero */
  .hero {
    position: relative;
    height: 100vh; min-height: 700px;
    display: flex; align-items: center; justify-content: center;
    overflow: hidden;
    background: var(--black);
  }
  .hero-bg {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, #0A0A0A 0%, #1A1208 50%, #0A0A0A 100%);
  }
  .hero-pattern {
    position: absolute; inset: 0; opacity: 0.04;
    background-image: repeating-linear-gradient(0deg, transparent, transparent 60px, var(--gold) 60px, var(--gold) 61px),
                      repeating-linear-gradient(90deg, transparent, transparent 60px, var(--gold) 60px, var(--gold) 61px);
  }
  .hero-glow {
    position: absolute;
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%);
    top: 50%; left: 50%; transform: translate(-50%,-50%);
    pointer-events: none;
  }
  .hero-content {
    position: relative; z-index: 2;
    text-align: center;
    padding: 0 24px;
    max-width: 900px;
  }
  .hero-eyebrow {
    font-family: var(--font-en);
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.4em;
    color: var(--gold);
    text-transform: uppercase;
    margin-bottom: 24px;
    opacity: 0;
    animation: fadeUp 0.8s 0.3s var(--ease) forwards;
  }
  .hero-title {
    font-family: var(--font-en);
    font-size: clamp(4rem, 10vw, 10rem);
    font-weight: 800;
    letter-spacing: 0.08em;
    line-height: 0.9;
    color: var(--white);
    margin-bottom: 8px;
    opacity: 0;
    animation: fadeUp 0.8s 0.5s var(--ease) forwards;
  }
  .hero-title span { color: var(--gold); }
  .hero-subtitle-ar {
    font-family: var(--font-ar);
    font-size: clamp(1.1rem, 3vw, 1.6rem);
    font-weight: 300;
    color: var(--text-light);
    letter-spacing: 0.05em;
    margin-bottom: 48px;
    opacity: 0;
    animation: fadeUp 0.8s 0.7s var(--ease) forwards;
  }
  .hero-actions {
    display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;
    opacity: 0;
    animation: fadeUp 0.8s 0.9s var(--ease) forwards;
  }
  .btn-primary {
    background: var(--gold);
    color: var(--black);
    border: none;
    padding: 16px 40px;
    font-size: 0.85rem;
    font-family: var(--font-ar);
    font-weight: 700;
    letter-spacing: 0.1em;
    cursor: pointer;
    transition: background 0.2s, transform 0.2s;
  }
  .btn-primary:hover { background: var(--gold-light); transform: translateY(-2px); }
  .btn-outline {
    background: transparent;
    color: var(--white);
    border: 1px solid rgba(255,255,255,0.3);
    padding: 16px 40px;
    font-size: 0.85rem;
    font-family: var(--font-ar);
    font-weight: 400;
    letter-spacing: 0.1em;
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s, transform 0.2s;
  }
  .btn-outline:hover { border-color: var(--gold); color: var(--gold); transform: translateY(-2px); }
  .hero-scroll {
    position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%);
    display: flex; flex-direction: column; align-items: center; gap: 8px;
    opacity: 0; animation: fadeUp 0.8s 1.2s var(--ease) forwards;
  }
  .hero-scroll span {
    font-size: 0.6rem; letter-spacing: 0.3em; color: var(--text-mid);
    font-family: var(--font-en); text-transform: uppercase;
  }
  .scroll-line {
    width: 1px; height: 48px;
    background: linear-gradient(to bottom, var(--gold), transparent);
    animation: scrollLine 1.5s ease-in-out infinite;
  }
  @keyframes scrollLine { 0%{height:0;opacity:1;} 100%{height:48px;opacity:0;} }

  /* Stats bar */
  .stats-bar {
    background: var(--dark-gray);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    padding: 40px 48px;
    display: flex; justify-content: center; gap: 0;
  }
  .stat-item {
    text-align: center;
    padding: 0 60px;
    border-right: 1px solid var(--border);
  }
  .stat-item:last-child { border-right: none; }
  .stat-number {
    font-family: var(--font-en);
    font-size: 2.5rem;
    font-weight: 800;
    color: var(--gold);
    display: block; line-height: 1;
  }
  .stat-label {
    font-size: 0.8rem;
    color: var(--text-mid);
    margin-top: 8px;
    display: block;
    font-weight: 400;
  }

  /* Section shared */
  .section { padding: var(--section-gap) 48px; }
  .section-label {
    font-family: var(--font-en);
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.4em;
    color: var(--gold);
    text-transform: uppercase;
    margin-bottom: 16px;
    display: block;
  }
  .section-title {
    font-family: var(--font-ar);
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 20px;
  }
  .section-body {
    font-size: 1rem;
    color: var(--text-light);
    line-height: 1.9;
    font-weight: 300;
    max-width: 560px;
  }

  /* Fade-in on scroll */
  .fade-in { opacity: 0; transform: translateY(30px); transition: opacity 0.7s var(--ease), transform 0.7s var(--ease); }
  .fade-in.visible { opacity: 1; transform: translateY(0); }
  .fade-in-delay-1 { transition-delay: 0.1s; }
  .fade-in-delay-2 { transition-delay: 0.2s; }
  .fade-in-delay-3 { transition-delay: 0.3s; }
  .fade-in-delay-4 { transition-delay: 0.4s; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Story section */
  .story-section {
    padding: var(--section-gap) 0;
    display: grid; grid-template-columns: 1fr 1fr;
    min-height: 560px;
    overflow: hidden;
  }
  .story-visual {
    position: relative;
    background: var(--mid-gray);
    overflow: hidden;
  }
  .story-visual-inner {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, #1A1208, #0A0A0A);
    display: flex; align-items: center; justify-content: center;
  }
  .story-monogram {
    font-family: var(--font-en);
    font-size: 12rem;
    font-weight: 800;
    color: rgba(201,168,76,0.08);
    letter-spacing: -0.05em;
    line-height: 1;
    user-select: none;
  }
  .story-gold-line {
    position: absolute; left: 0; top: 10%; bottom: 10%; width: 3px;
    background: linear-gradient(to bottom, transparent, var(--gold), transparent);
  }
  .story-content {
    padding: 80px 64px;
    display: flex; flex-direction: column; justify-content: center;
    background: var(--dark-gray);
  }
  .story-quote {
    font-family: var(--font-display);
    font-size: clamp(1.4rem, 2.5vw, 2rem);
    font-weight: 400;
    font-style: italic;
    color: var(--white);
    line-height: 1.6;
    margin-bottom: 32px;
    position: relative;
  }
  .story-quote::before {
    content: '"';
    font-size: 5rem;
    color: var(--gold);
    opacity: 0.3;
    position: absolute;
    top: -20px; right: -10px;
    font-family: var(--font-display);
    line-height: 1;
  }

  /* Categories */
  .categories-section { padding: var(--section-gap) 48px; background: var(--black); }
  .categories-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2px;
    margin-top: 60px;
  }
  .category-card {
    position: relative;
    aspect-ratio: 3/4;
    overflow: hidden;
    cursor: pointer;
    background: var(--mid-gray);
  }
  .category-card-inner {
    position: absolute; inset: 0;
    display: flex; flex-direction: column;
    align-items: center; justify-content: flex-end;
    padding: 32px 24px;
    background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%);
    transition: background 0.4s var(--ease);
  }
  .category-card:hover .category-card-inner {
    background: linear-gradient(to top, rgba(201,168,76,0.3) 0%, rgba(0,0,0,0.4) 60%, transparent 100%);
  }
  .category-icon {
    font-size: 2.5rem;
    margin-bottom: 12px;
    filter: drop-shadow(0 0 8px rgba(201,168,76,0.4));
  }
  .category-name {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--white);
    letter-spacing: 0.05em;
    margin-bottom: 6px;
  }
  .category-count {
    font-size: 0.7rem;
    color: var(--gold);
    font-family: var(--font-en);
    letter-spacing: 0.15em;
  }
  .category-bg {
    position: absolute; inset: 0;
    background-size: cover; background-position: center;
    transition: transform 0.6s var(--ease);
  }
  .category-card:hover .category-bg { transform: scale(1.05); }

  /* Products */
  .products-section { padding: var(--section-gap) 48px; background: var(--dark-gray); }
  .products-header {
    display: flex; justify-content: space-between; align-items: flex-end;
    margin-bottom: 60px;
  }
  .products-filter {
    display: flex; gap: 0;
    border: 1px solid var(--border);
  }
  .filter-btn {
    padding: 10px 24px;
    font-size: 0.75rem;
    font-family: var(--font-ar);
    font-weight: 500;
    letter-spacing: 0.05em;
    background: transparent;
    border: none;
    color: var(--text-mid);
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
    border-right: 1px solid var(--border);
  }
  .filter-btn:last-child { border-right: none; }
  .filter-btn.active { background: var(--gold); color: var(--black); }
  .filter-btn:hover:not(.active) { color: var(--white); }
  .products-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2px;
  }
  .product-card {
    position: relative;
    background: var(--mid-gray);
    overflow: hidden;
    cursor: pointer;
    group: true;
  }
  .product-img-wrap {
    position: relative;
    aspect-ratio: 3/4;
    overflow: hidden;
    background: var(--mid-gray);
  }
  .product-img-placeholder {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    flex-direction: column; gap: 8px;
    background: linear-gradient(135deg, #1A1A1A 0%, #111111 100%);
  }
  .product-img-placeholder-icon { font-size: 3rem; opacity: 0.15; }
  .product-badge {
    position: absolute; top: 16px; right: 16px;
    background: var(--gold);
    color: var(--black);
    font-size: 0.6rem;
    font-family: var(--font-en);
    font-weight: 700;
    letter-spacing: 0.15em;
    padding: 4px 10px;
    text-transform: uppercase;
  }
  .product-overlay {
    position: absolute; inset: 0;
    background: rgba(0,0,0,0.6);
    display: flex; align-items: center; justify-content: center;
    opacity: 0;
    transition: opacity 0.3s var(--ease);
  }
  .product-card:hover .product-overlay { opacity: 1; }
  .product-whatsapp-btn {
    background: var(--gold);
    color: var(--black);
    border: none;
    padding: 14px 28px;
    font-size: 0.8rem;
    font-family: var(--font-ar);
    font-weight: 700;
    cursor: pointer;
    transform: translateY(10px);
    transition: transform 0.3s var(--ease), background 0.2s;
  }
  .product-card:hover .product-whatsapp-btn { transform: translateY(0); }
  .product-whatsapp-btn:hover { background: var(--gold-light); }
  .product-info {
    padding: 20px;
    background: var(--mid-gray);
    border-top: 1px solid var(--border);
  }
  .product-name {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--white);
    margin-bottom: 6px;
    letter-spacing: 0.02em;
  }
  .product-price {
    font-family: var(--font-en);
    font-size: 0.85rem;
    color: var(--gold);
    font-weight: 600;
    letter-spacing: 0.05em;
  }

  /* Marquee */
  .marquee-section {
    padding: 32px 0;
    background: var(--gold);
    overflow: hidden;
  }
  .marquee-track {
    display: flex;
    animation: marquee 20s linear infinite;
    white-space: nowrap;
  }
  .marquee-item {
    display: inline-flex; align-items: center; gap: 24px;
    padding: 0 40px;
    font-family: var(--font-en);
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--black);
  }
  .marquee-dot { width: 4px; height: 4px; background: var(--black); border-radius: 50%; opacity: 0.4; }
  @keyframes marquee { from{transform:translateX(0);} to{transform:translateX(-50%);} }

  /* Gallery */
  .gallery-section { padding: var(--section-gap) 48px; }
  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: auto;
    gap: 4px;
    margin-top: 60px;
  }
  .gallery-item {
    position: relative;
    overflow: hidden;
    background: var(--mid-gray);
    cursor: pointer;
  }
  .gallery-item.tall { grid-row: span 2; }
  .gallery-item.wide { grid-column: span 2; }
  .gallery-item-inner {
    aspect-ratio: 1;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, #1A1208, #111111);
    transition: transform 0.6s var(--ease);
  }
  .gallery-item.tall .gallery-item-inner { aspect-ratio: unset; height: 100%; }
  .gallery-item.wide .gallery-item-inner { aspect-ratio: 2; }
  .gallery-item:hover .gallery-item-inner { transform: scale(1.04); }
  .gallery-placeholder-icon { font-size: 4rem; opacity: 0.08; }
  .gallery-overlay {
    position: absolute; inset: 0;
    background: rgba(201,168,76,0.1);
    opacity: 0;
    transition: opacity 0.3s;
  }
  .gallery-item:hover .gallery-overlay { opacity: 1; }

  /* Branches / Stores */
  .stores-section {
    padding: var(--section-gap) 0;
    background: var(--dark-gray);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
  }
  .stores-inner {
    max-width: 1400px; margin: 0 auto; padding: 0 48px;
  }
  .stores-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 2px;
    margin-top: 60px;
  }
  .store-card {
    background: var(--mid-gray);
    padding: 56px 48px;
    position: relative;
    overflow: hidden;
    transition: background 0.3s;
  }
  .store-card:hover { background: #1E1E1E; }
  .store-number {
    font-family: var(--font-en);
    font-size: 5rem;
    font-weight: 800;
    color: rgba(201,168,76,0.06);
    position: absolute;
    top: 20px; left: 40px;
    line-height: 1;
    pointer-events: none;
  }
  .store-badge {
    display: inline-block;
    background: var(--gold);
    color: var(--black);
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    padding: 5px 14px;
    margin-bottom: 24px;
    font-family: var(--font-en);
    text-transform: uppercase;
  }
  .store-name {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 20px;
  }
  .store-detail {
    display: flex; align-items: flex-start; gap: 12px;
    margin-bottom: 16px;
  }
  .store-detail-icon { font-size: 1rem; margin-top: 2px; flex-shrink: 0; }
  .store-detail-text {
    font-size: 0.9rem;
    color: var(--text-light);
    line-height: 1.6;
  }
  .store-detail-text strong { color: var(--white); }
  .store-whatsapp {
    display: inline-flex; align-items: center; gap: 8px;
    margin-top: 32px;
    background: transparent;
    border: 1px solid var(--gold);
    color: var(--gold);
    padding: 12px 28px;
    font-size: 0.8rem;
    font-family: var(--font-ar);
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    transition: background 0.2s, color 0.2s;
  }
  .store-whatsapp:hover { background: var(--gold); color: var(--black); }

  /* Testimonials */
  .reviews-section { padding: var(--section-gap) 48px; }
  .reviews-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 2px;
    margin-top: 60px;
  }
  .review-card {
    background: var(--dark-gray);
    padding: 40px;
    border: 1px solid var(--border);
    transition: border-color 0.3s, background 0.3s;
    position: relative;
  }
  .review-card:hover { border-color: var(--gold); background: var(--mid-gray); }
  .review-stars {
    display: flex; gap: 4px;
    margin-bottom: 20px;
  }
  .review-star { color: var(--gold); font-size: 0.9rem; }
  .review-text {
    font-size: 0.95rem;
    color: var(--text-light);
    line-height: 1.8;
    font-weight: 300;
    margin-bottom: 24px;
  }
  .review-author {
    display: flex; align-items: center; gap: 12px;
  }
  .review-avatar {
    width: 40px; height: 40px; border-radius: 50%;
    background: var(--gold);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--black);
    flex-shrink: 0;
    font-family: var(--font-en);
  }
  .review-name { font-size: 0.85rem; font-weight: 600; }
  .review-date { font-size: 0.7rem; color: var(--text-mid); margin-top: 2px; font-family: var(--font-en); }

  /* CTA Banner */
  .cta-banner {
    padding: 100px 48px;
    background: var(--gold);
    text-align: center;
  }
  .cta-title {
    font-family: var(--font-ar);
    font-size: clamp(2rem, 5vw, 4rem);
    font-weight: 800;
    color: var(--black);
    margin-bottom: 16px;
    line-height: 1.2;
  }
  .cta-sub {
    font-size: 1.1rem;
    color: rgba(0,0,0,0.65);
    margin-bottom: 48px;
    font-weight: 300;
  }
  .btn-dark {
    background: var(--black);
    color: var(--gold);
    border: none;
    padding: 18px 48px;
    font-size: 0.9rem;
    font-family: var(--font-ar);
    font-weight: 700;
    letter-spacing: 0.08em;
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .btn-dark:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.4); }

  /* Footer */
  footer {
    background: var(--black);
    border-top: 1px solid var(--border);
    padding: 80px 48px 40px;
  }
  .footer-top {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 60px;
    padding-bottom: 60px;
    border-bottom: 1px solid var(--border);
  }
  .footer-brand-logo {
    font-family: var(--font-en);
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: 0.25em;
    color: var(--gold);
    margin-bottom: 16px;
  }
  .footer-brand-desc {
    font-size: 0.85rem;
    color: var(--text-mid);
    line-height: 1.8;
    font-weight: 300;
    max-width: 280px;
  }
  .footer-social {
    display: flex; gap: 12px; margin-top: 24px;
  }
  .footer-social-link {
    width: 36px; height: 36px;
    border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    color: var(--text-mid);
    text-decoration: none;
    font-size: 0.85rem;
    transition: border-color 0.2s, color 0.2s, background 0.2s;
    cursor: pointer;
  }
  .footer-social-link:hover { border-color: var(--gold); color: var(--gold); }
  .footer-col-title {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    color: var(--white);
    text-transform: uppercase;
    font-family: var(--font-en);
    margin-bottom: 24px;
  }
  .footer-links { list-style: none; display: flex; flex-direction: column; gap: 14px; }
  .footer-links a {
    font-size: 0.85rem;
    color: var(--text-mid);
    text-decoration: none;
    cursor: pointer;
    transition: color 0.2s;
    font-weight: 300;
  }
  .footer-links a:hover { color: var(--gold); }
  .footer-bottom {
    display: flex; justify-content: space-between; align-items: center;
    padding-top: 32px;
    flex-wrap: wrap; gap: 12px;
  }
  .footer-copy {
    font-size: 0.75rem;
    color: var(--text-mid);
    font-family: var(--font-en);
  }
  .footer-made {
    font-size: 0.75rem;
    color: var(--text-mid);
  }

  /* Floating WhatsApp */
  .floating-wa {
    position: fixed; bottom: 32px; left: 32px;
    z-index: 998;
    display: flex; flex-direction: column; align-items: flex-start; gap: 12px;
  }
  .floating-wa-bubble {
    background: var(--dark-gray);
    border: 1px solid var(--border);
    padding: 12px 20px;
    font-size: 0.8rem;
    color: var(--text-light);
    white-space: nowrap;
    opacity: 0;
    transform: translateX(-10px);
    transition: opacity 0.3s, transform 0.3s;
    pointer-events: none;
  }
  .floating-wa:hover .floating-wa-bubble { opacity: 1; transform: translateX(0); }
  .floating-wa-btn {
    width: 56px; height: 56px;
    background: #25D366;
    border: none;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    font-size: 1.5rem;
    box-shadow: 0 4px 24px rgba(37,211,102,0.35);
    transition: transform 0.2s, box-shadow 0.2s;
    text-decoration: none;
  }
  .floating-wa-btn:hover { transform: scale(1.1); box-shadow: 0 8px 32px rgba(37,211,102,0.5); }

  /* Chatbot */
  .chatbot-container {
    position: fixed; bottom: 100px; left: 32px;
    width: 360px;
    background: var(--dark-gray);
    border: 1px solid var(--border);
    z-index: 997;
    transform: translateY(20px) scale(0.95);
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s var(--ease);
    box-shadow: 0 24px 80px rgba(0,0,0,0.6);
  }
  .chatbot-container.open { transform: translateY(0) scale(1); opacity: 1; pointer-events: all; }
  .chatbot-header {
    padding: 20px 24px;
    background: var(--gold);
    display: flex; justify-content: space-between; align-items: center;
  }
  .chatbot-header-title { font-weight: 700; color: var(--black); font-size: 0.9rem; }
  .chatbot-header-sub { font-size: 0.7rem; color: rgba(0,0,0,0.6); margin-top: 2px; }
  .chatbot-close {
    background: none; border: none; cursor: pointer;
    color: var(--black); font-size: 1.2rem;
    opacity: 0.6; transition: opacity 0.2s;
  }
  .chatbot-close:hover { opacity: 1; }
  .chatbot-messages {
    height: 280px; overflow-y: auto;
    padding: 20px;
    display: flex; flex-direction: column; gap: 12px;
  }
  .msg { max-width: 85%; }
  .msg.bot { align-self: flex-start; }
  .msg.user { align-self: flex-end; }
  .msg-bubble {
    padding: 12px 16px;
    font-size: 0.82rem;
    line-height: 1.6;
    border-radius: 0;
  }
  .msg.bot .msg-bubble { background: var(--mid-gray); color: var(--text-light); border-right: 2px solid var(--gold); }
  .msg.user .msg-bubble { background: var(--gold); color: var(--black); font-weight: 500; }
  .chatbot-quick {
    padding: 12px 20px;
    display: flex; flex-wrap: wrap; gap: 8px;
    border-top: 1px solid var(--border);
  }
  .quick-btn {
    font-size: 0.72rem;
    padding: 7px 14px;
    background: transparent;
    border: 1px solid var(--border);
    color: var(--text-light);
    cursor: pointer;
    font-family: var(--font-ar);
    transition: border-color 0.2s, color 0.2s;
  }
  .quick-btn:hover { border-color: var(--gold); color: var(--gold); }
  .chatbot-input-wrap {
    padding: 16px 20px;
    border-top: 1px solid var(--border);
    display: flex; gap: 10px;
  }
  .chatbot-input {
    flex: 1;
    background: var(--mid-gray);
    border: 1px solid var(--border);
    color: var(--white);
    padding: 10px 14px;
    font-size: 0.82rem;
    font-family: var(--font-ar);
    outline: none;
  }
  .chatbot-input:focus { border-color: var(--gold); }
  .chatbot-send {
    background: var(--gold);
    border: none;
    color: var(--black);
    padding: 10px 16px;
    cursor: pointer;
    font-size: 1rem;
    transition: background 0.2s;
  }
  .chatbot-send:hover { background: var(--gold-light); }

  /* Chatbot toggle */
  .chat-toggle {
    position: fixed; bottom: 100px; left: 100px;
    z-index: 998;
  }
  .chat-toggle-btn {
    width: 48px; height: 48px;
    background: var(--dark-gray);
    border: 1px solid var(--border);
    color: var(--white);
    cursor: pointer;
    font-size: 1.3rem;
    display: flex; align-items: center; justify-content: center;
    transition: border-color 0.2s, color 0.2s;
  }
  .chat-toggle-btn:hover { border-color: var(--gold); color: var(--gold); }

  /* Page transitions */
  .page { animation: pageIn 0.4s var(--ease); }
  @keyframes pageIn { from{opacity:0;} to{opacity:1;} }

  /* Responsive */
  @media (max-width: 1024px) {
    .categories-grid { grid-template-columns: repeat(2, 1fr); }
    .products-grid { grid-template-columns: repeat(2, 1fr); }
    .story-section { grid-template-columns: 1fr; }
    .story-visual { min-height: 300px; }
    .footer-top { grid-template-columns: 1fr 1fr; gap: 40px; }
  }

  @media (max-width: 768px) {
    :root { --section-gap: 72px; --nav-h: 60px; }
    nav { padding: 0 24px; }
    .nav-links { display: none; }
    .nav-cta { display: none; }
    .hamburger { display: flex; }
    .hero-title { font-size: clamp(3.5rem, 18vw, 6rem); }
    .section { padding: var(--section-gap) 24px; }
    .stats-bar { padding: 32px 24px; flex-wrap: wrap; gap: 24px; }
    .stat-item { border-right: none; padding: 0 24px; }
    .stores-grid { grid-template-columns: 1fr; }
    .reviews-grid { grid-template-columns: 1fr; }
    .gallery-grid { grid-template-columns: 1fr 1fr; }
    .gallery-item.wide { grid-column: span 1; }
    .gallery-item.tall { grid-row: span 1; }
    .products-header { flex-direction: column; align-items: flex-start; gap: 24px; }
    .footer-top { grid-template-columns: 1fr; gap: 32px; }
    .floating-wa { bottom: 20px; left: 20px; }
    .chatbot-container { left: 16px; right: 16px; width: auto; bottom: 90px; }
    .stores-inner { padding: 0 24px; }
    .categories-section { padding: var(--section-gap) 24px; }
    .products-section { padding: var(--section-gap) 24px; }
    .gallery-section { padding: var(--section-gap) 24px; }
    .reviews-section { padding: var(--section-gap) 24px; }
    .cta-banner { padding: 72px 24px; }
    footer { padding: 60px 24px 32px; }
    .footer-bottom { flex-direction: column; text-align: center; }
    .story-content { padding: 48px 24px; }
  }
`;

/* ═══════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════ */
const WHATSAPP_NUM = '201010422018';
const waLink = (msg) => `https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent(msg)}`;

const CATEGORIES = [
  { id: 1, name: 'تيشيرتات', count: '20+ صنف', icon: '👕', gradient: 'linear-gradient(135deg,#1a2535,#0d1520)' },
  { id: 2, name: 'قمصان', count: '15+ صنف', icon: '👔', gradient: 'linear-gradient(135deg,#251a10,#150d05)' },
  { id: 3, name: 'بناطيل', count: '18+ صنف', icon: '👖', gradient: 'linear-gradient(135deg,#1a1a25,#0d0d18)' },
  { id: 4, name: 'جاكيتات', count: '12+ صنف', icon: '🧥', gradient: 'linear-gradient(135deg,#251520,#180b12)' },
];

const PRODUCTS = [
  { id:1, name:'تيشيرت بريميوم كاجوال', price:'اسأل عن السعر', badge:'جديد', cat:'تيشيرتات' },
  { id:2, name:'قميص أوكسفورد كلاسيك', price:'اسأل عن السعر', badge:'الأكثر طلباً', cat:'قمصان' },
  { id:3, name:'بنطلون سليم فيت', price:'اسأل عن السعر', badge:null, cat:'بناطيل' },
  { id:4, name:'جاكيت كاجوال خفيف', price:'اسأل عن السعر', badge:'محدود', cat:'جاكيتات' },
  { id:5, name:'تيشيرت أوفرسايز', price:'اسأل عن السعر', badge:null, cat:'تيشيرتات' },
  { id:6, name:'قميص كتان صيفي', price:'اسأل عن السعر', badge:'جديد', cat:'قمصان' },
  { id:7, name:'بنطلون كاجوال لينن', price:'اسأل عن السعر', badge:null, cat:'بناطيل' },
  { id:8, name:'تيشيرت برادي لوجو', price:'اسأل عن السعر', badge:'الأكثر طلباً', cat:'تيشيرتات' },
];

const REVIEWS = [
  { id:1, name:'محمد أحمد', initial:'م', text:'أحسن محل ملابس في المرج. الأسعار معقولة جداً والجودة عالية. بجد مش هتلاقي حاجة زيها في المنطقة.', date:'منذ أسبوع' },
  { id:2, name:'خالد إبراهيم', initial:'خ', text:'المعاملة حلوة والموظفين محترمين. اشتريت قميص وبنطلون وطلعوا تمام. هرجع تاني بكل تأكيد!', date:'منذ أسبوعين' },
  { id:3, name:'أحمد علي', initial:'أ', text:'فرع المحطة قريب مني وبيجيب موديلات حلوة دايماً. الكوليكشن بتتغير باستمرار وفيه دايماً جديد.', date:'منذ شهر' },
];

const BOT_QA = [
  { q: ['مواعيد', 'وقت', 'فتح', 'بفتح'], a: 'مواعيد العمل: من ٣ العصر لـ ٢ الليل — كل يوم بدون إجازة 🕒' },
  { q: ['فروع', 'فرع', 'عنوان', 'فين'], a: 'عندنا فرعين في المرج:\n📍 فرع المحطة — جنب محطة المرج القديمة الشرقية\n📍 فرع الأنابيب — شارع مكازن الأنابيب قرب صيدلية د. أيمن' },
  { q: ['واتساب', 'تواصل', 'اتصل', 'رقم'], a: 'تقدر تتواصل معانا على واتساب: 01010422018 ✅' },
  { q: ['دليفري', 'توصيل', 'شحن'], a: 'مش بنعمل توصيل حالياً — بس منور تزورنا في أي فرع 🙏' },
  { q: ['سعر', 'بكام', 'تمن', 'أسعار'], a: 'الأسعار متنوعة وتناسب كل الميزانيات! ابعتلنا صورة المنتج اللي عجبك على واتساب وهنعرفك السعر فوراً 💬' },
  { q: ['استبدال', 'ريترن', 'رجع', 'تغيير'], a: 'في حالة المقاس مش مناسب، بنتعامل معاك بكل مرونة. اتصل بينا على واتساب 👍' },
  { q: ['منتجات', 'عندكم', 'بتبيعوا', 'بيع'], a: 'عندنا: تيشيرتات، قمصان، بناطيل، جاكيتات وأكسسوارات — كل حاجة الراجل محتاجها بجودة عالية 🛍️' },
];

/* ═══════════════════════════════════════════════════════
   HOOKS
═══════════════════════════════════════════════════════ */
function useFadeIn() {
  useEffect(() => {
    const els = document.querySelectorAll('.fade-in');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
    }, { threshold: 0.1 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  });
}

/* ═══════════════════════════════════════════════════════
   COMPONENTS
═══════════════════════════════════════════════════════ */

function LoadingScreen({ done }) {
  return (
    <div className={`loading-screen${done ? ' hidden' : ''}`}>
      <div className="loading-logo">H&A</div>
    </div>
  );
}

function Nav({ page, setPage, scrolled }) {
  const [open, setOpen] = useState(false);
  const links = [
    { label: 'الرئيسية', key: 'home' },
    { label: 'المنتجات', key: 'products' },
    { label: 'قصتنا', key: 'story' },
    { label: 'فروعنا', key: 'stores' },
    { label: 'تواصل', key: 'contact' },
  ];
  const go = (key) => { setPage(key); setOpen(false); window.scrollTo(0,0); };

  return (
    <>
      <nav className={scrolled ? 'solid' : 'transparent'}>
        <span className="nav-logo" onClick={() => go('home')}>H&A</span>
        <ul className="nav-links">
          {links.map(l => <li key={l.key}><a onClick={() => go(l.key)}>{l.label}</a></li>)}
        </ul>
        <button className="nav-cta" onClick={() => window.open(waLink('مرحباً! عايز أعرف أكثر عن منتجاتكم'), '_blank')}>
          تواصل الآن
        </button>
        <button className={`hamburger${open ? ' open' : ''}`} onClick={() => setOpen(!open)}>
          <span/><span/><span/>
        </button>
      </nav>
      <div className={`mobile-menu${open ? ' open' : ''}`}>
        {links.map(l => <a key={l.key} onClick={() => go(l.key)}>{l.label}</a>)}
        <a href={waLink('مرحباً!')} target="_blank" rel="noreferrer" style={{color:T.gold}}>واتساب</a>
      </div>
    </>
  );
}

function FloatingWA({ chatOpen, setChatOpen }) {
  return (
    <div className="floating-wa">
      <div className="floating-wa-bubble">تكلم معانا على واتساب</div>
      <a
        className="floating-wa-btn"
        href={waLink('مرحباً يا H&A! عايز أسأل عن منتجاتكم')}
        target="_blank" rel="noreferrer"
        title="واتساب"
      >
        💬
      </a>
    </div>
  );
}

function Chatbot({ open, setOpen }) {
  const [msgs, setMsgs] = useState([
    { role: 'bot', text: 'أهلاً بيك في H&A Fashion! 👋 إزاي أقدر أساعدك؟' }
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  const quickQuestions = ['مواعيد العمل', 'عناوين الفروع', 'أسعار المنتجات', 'كيفية الشراء'];

  const getReply = (text) => {
    const low = text.toLowerCase();
    for (const qa of BOT_QA) {
      if (qa.q.some(k => low.includes(k))) return qa.a;
    }
    return `شكراً على سؤالك! للرد السريع راسلنا على واتساب مباشرة 📲\nاضغط على الزر الأخضر أسفل الشاشة أو على الرابط: wa.me/${WHATSAPP_NUM}`;
  };

  const send = (text) => {
    if (!text.trim()) return;
    setMsgs(m => [...m, { role: 'user', text }]);
    setTimeout(() => {
      setMsgs(m => [...m, { role: 'bot', text: getReply(text) }]);
    }, 600);
    setInput('');
  };

  return (
    <>
      <div className={`chatbot-container${open ? ' open' : ''}`}>
        <div className="chatbot-header">
          <div>
            <div className="chatbot-header-title">H&A Fashion — مساعد</div>
            <div className="chatbot-header-sub">متاح دايماً للمساعدة</div>
          </div>
          <button className="chatbot-close" onClick={() => setOpen(false)}>✕</button>
        </div>
        <div className="chatbot-messages">
          {msgs.map((m, i) => (
            <div key={i} className={`msg ${m.role}`}>
              <div className="msg-bubble">{m.text}</div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
        <div className="chatbot-quick">
          {quickQuestions.map(q => (
            <button key={q} className="quick-btn" onClick={() => send(q)}>{q}</button>
          ))}
        </div>
        <div className="chatbot-input-wrap">
          <input
            className="chatbot-input"
            placeholder="اكتب سؤالك..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send(input)}
          />
          <button className="chatbot-send" onClick={() => send(input)}>➤</button>
        </div>
      </div>
      <button
        style={{
          position:'fixed', bottom:32, left:100, zIndex:998,
          width:48, height:48,
          background: open ? T.gold : T.darkGray,
          border:`1px solid ${open ? T.gold : T.border}`,
          color: open ? T.black : T.white,
          cursor:'pointer', fontSize:'1.2rem',
          display:'flex', alignItems:'center', justifyContent:'center',
          transition:'all 0.2s'
        }}
        onClick={() => setOpen(!open)}
        title="المساعد الذكي"
      >
        {open ? '✕' : '🤖'}
      </button>
    </>
  );
}

/* ── PAGES ───────────────────────────────────────────── */

function HomePage({ setPage }) {
  useFadeIn();
  const [activeFilter, setActiveFilter] = useState('الكل');
  const filters = ['الكل', 'تيشيرتات', 'قمصان', 'بناطيل', 'جاكيتات'];
  const filtered = activeFilter === 'الكل' ? PRODUCTS : PRODUCTS.filter(p => p.cat === activeFilter);

  const galleryItems = [
    { span: 'tall', icon: '🏪' },
    { span: '', icon: '👔' },
    { span: '', icon: '👕' },
    { span: 'wide', icon: '🛍️' },
    { span: '', icon: '👖' },
    { span: '', icon: '🧥' },
  ];

  return (
    <div className="page">
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg"/>
        <div className="hero-pattern"/>
        <div className="hero-glow"/>
        <div className="hero-content">
          <div className="hero-eyebrow">Est. 2020 · المرج، القاهرة</div>
          <div className="hero-title">
            H<span>&</span>A
          </div>
          <div className="hero-subtitle-ar">
            الرجل الذي يعرف ما يريد — يختار H&A
          </div>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => setPage('products')}>
              اكتشف المجموعة
            </button>
            <button className="btn-outline" onClick={() => setPage('stores')}>
              فروعنا
            </button>
          </div>
        </div>
        <div className="hero-scroll">
          <span>Scroll</span>
          <div className="scroll-line"/>
        </div>
      </section>

      {/* STATS */}
      <div className="stats-bar fade-in">
        <div className="stat-item">
          <span className="stat-number">500+</span>
          <span className="stat-label">عميل راضٍ</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">2</span>
          <span className="stat-label">فرع في المرج</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">15+</span>
          <span className="stat-label">سنة خبرة</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">100+</span>
          <span className="stat-label">موديل متاح</span>
        </div>
      </div>

      {/* STORY TEASER */}
      <div className="story-section fade-in">
        <div className="story-visual">
          <div className="story-visual-inner">
            <div className="story-monogram">H&A</div>
            <div className="story-gold-line"/>
          </div>
        </div>
        <div className="story-content">
          <span className="section-label">قصتنا</span>
          <p className="story-quote">
            من المرج للقاهرة — نحن لا نبيع ملابس، نبيع ثقة الرجل في إطلالته
          </p>
          <p className="section-body">
            بدأنا بحلم بسيط: نوصّل الموضة الرجالية العصرية بجودة عالية وأسعار مناسبة لكل رجل في المرج وما حوله.
            اليوم، بعد أكثر من ١٥ سنة من العمل والإتقان، أصبحنا الوجهة الأولى لكل من يريد أن يبدو في أبهى صورة.
          </p>
          <button
            className="btn-outline"
            style={{ marginTop: 32, display:'inline-block' }}
            onClick={() => setPage('story')}
          >
            اعرف أكثر
          </button>
        </div>
      </div>

      {/* CATEGORIES */}
      <section className="categories-section">
        <div className="fade-in">
          <span className="section-label">تصنيفاتنا</span>
          <h2 className="section-title">كل ما يحتاجه الرجل العصري</h2>
        </div>
        <div className="categories-grid">
          {CATEGORIES.map((cat, i) => (
            <div
              key={cat.id}
              className={`category-card fade-in fade-in-delay-${i+1}`}
              onClick={() => { setPage('products'); }}
            >
              <div className="category-bg" style={{ background: cat.gradient }}/>
              <div className="category-card-inner">
                <div className="category-icon">{cat.icon}</div>
                <div className="category-name">{cat.name}</div>
                <div className="category-count">{cat.count}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-section">
        <div className="marquee-track">
          {[...Array(3)].map((_, j) =>
            ['جودة عالية', 'أسعار مناسبة', 'موضة رجالية', 'فرعين في المرج', 'H&A FASHION', 'أناقتك أسلوب حياة', 'CAIRO EGYPT'].map((t, i) => (
              <div key={`${j}-${i}`} className="marquee-item">
                {t} <span className="marquee-dot"/>
              </div>
            ))
          )}
        </div>
      </div>

      {/* PRODUCTS */}
      <section className="products-section">
        <div className="products-header fade-in">
          <div>
            <span className="section-label">منتجاتنا</span>
            <h2 className="section-title">الكوليكشن الجديد</h2>
          </div>
          <div className="products-filter">
            {filters.map(f => (
              <button
                key={f}
                className={`filter-btn${activeFilter === f ? ' active' : ''}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="products-grid">
          {filtered.map((p, i) => (
            <div key={p.id} className={`product-card fade-in fade-in-delay-${(i%4)+1}`}>
              <div className="product-img-wrap">
                <div className="product-img-placeholder">
                  <div className="product-img-placeholder-icon">
                    {p.cat === 'تيشيرتات' ? '👕' : p.cat === 'قمصان' ? '👔' : p.cat === 'بناطيل' ? '👖' : '🧥'}
                  </div>
                </div>
                {p.badge && <div className="product-badge">{p.badge}</div>}
                <div className="product-overlay">
                  <button
                    className="product-whatsapp-btn"
                    onClick={() => window.open(waLink(`مرحباً! عايز أسأل عن: ${p.name}`), '_blank')}
                  >
                    💬 استفسر الآن
                  </button>
                </div>
              </div>
              <div className="product-info">
                <div className="product-name">{p.name}</div>
                <div className="product-price">{p.price}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* GALLERY */}
      <section className="gallery-section">
        <div className="fade-in" style={{ textAlign:'center' }}>
          <span className="section-label">من داخل فروعنا</span>
          <h2 className="section-title">تجربة التسوق عندنا</h2>
        </div>
        <div className="gallery-grid">
          {galleryItems.map((g, i) => (
            <div key={i} className={`gallery-item${g.span ? ` ${g.span}` : ''} fade-in fade-in-delay-${(i%4)+1}`}>
              <div className="gallery-item-inner">
                <div className="gallery-placeholder-icon">{g.icon}</div>
              </div>
              <div className="gallery-overlay"/>
            </div>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <section className="reviews-section">
        <div className="fade-in" style={{ textAlign:'center', marginBottom: 0 }}>
          <span className="section-label">آراء عملاءنا</span>
          <h2 className="section-title">بيتكلموا عننا</h2>
        </div>
        <div className="reviews-grid">
          {REVIEWS.map((r, i) => (
            <div key={r.id} className={`review-card fade-in fade-in-delay-${i+1}`}>
              <div className="review-stars">
                {[...Array(5)].map((_,j) => <span key={j} className="review-star">★</span>)}
              </div>
              <p className="review-text">"{r.text}"</p>
              <div className="review-author">
                <div className="review-avatar">{r.initial}</div>
                <div>
                  <div className="review-name">{r.name}</div>
                  <div className="review-date">{r.date}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="cta-banner fade-in">
        <h2 className="cta-title">مش لاقي إطلالتك؟</h2>
        <p className="cta-sub">كلمنا على واتساب وهنساعدك تلاقي اللي يناسبك</p>
        <a
          className="btn-dark"
          href={waLink('مرحباً H&A! عايز تساعدني أختار الإطلالة المناسبة')}
          target="_blank" rel="noreferrer"
        >
          💬 تكلم معانا دلوقتي
        </a>
      </div>
    </div>
  );
}

function ProductsPage() {
  useFadeIn();
  const [activeFilter, setActiveFilter] = useState('الكل');
  const filters = ['الكل', 'تيشيرتات', 'قمصان', 'بناطيل', 'جاكيتات'];
  const filtered = activeFilter === 'الكل' ? PRODUCTS : PRODUCTS.filter(p => p.cat === activeFilter);

  return (
    <div className="page" style={{ paddingTop: 'var(--nav-h)' }}>
      <div style={{ padding:'80px 48px 40px', borderBottom:`1px solid ${T.border}`, background:T.darkGray }}>
        <span className="section-label fade-in">كوليكشن H&A</span>
        <h1 className="section-title fade-in">جميع المنتجات</h1>
      </div>
      <section className="products-section" style={{ background:T.black }}>
        <div className="products-filter" style={{ marginBottom:48 }}>
          {filters.map(f => (
            <button key={f} className={`filter-btn${activeFilter===f?' active':''}`} onClick={()=>setActiveFilter(f)}>{f}</button>
          ))}
        </div>
        <div className="products-grid">
          {filtered.map((p,i) => (
            <div key={p.id} className={`product-card fade-in fade-in-delay-${(i%4)+1}`}>
              <div className="product-img-wrap">
                <div className="product-img-placeholder">
                  <div className="product-img-placeholder-icon">
                    {p.cat==='تيشيرتات'?'👕':p.cat==='قمصان'?'👔':p.cat==='بناطيل'?'👖':'🧥'}
                  </div>
                </div>
                {p.badge && <div className="product-badge">{p.badge}</div>}
                <div className="product-overlay">
                  <button className="product-whatsapp-btn" onClick={()=>window.open(waLink(`استفسار عن: ${p.name}`),'_blank')}>
                    💬 استفسر الآن
                  </button>
                </div>
              </div>
              <div className="product-info">
                <div className="product-name">{p.name}</div>
                <div className="product-price">{p.price}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function StoryPage() {
  useFadeIn();
  return (
    <div className="page" style={{ paddingTop:'var(--nav-h)' }}>
      <div style={{ padding:'80px 48px 40px', background:T.darkGray, borderBottom:`1px solid ${T.border}` }}>
        <span className="section-label fade-in">من نحن</span>
        <h1 className="section-title fade-in">قصة H&A Fashion</h1>
      </div>
      <section className="section fade-in" style={{ maxWidth:800, margin:'0 auto' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:40 }}>
          <div className="fade-in">
            <h3 style={{ fontSize:'1.4rem', fontWeight:700, marginBottom:16, color:T.gold }}>البداية</h3>
            <p className="section-body" style={{ maxWidth:'100%' }}>
              في عام ٢٠٢٠، قرر أحمد وحمادة حشم أن يغيّرا مشهد الموضة الرجالية في منطقة المرج.
              كانت فكرتهم بسيطة لكن طموحة: مكان واحد يجمع كل ما يحتاجه الرجل العصري من ملابس عالية الجودة
              بأسعار في متناول الجميع.
            </p>
          </div>
          <div className="fade-in fade-in-delay-1" style={{ width:'100%', height:2, background:`linear-gradient(to right, ${T.gold}, transparent)` }}/>
          <div className="fade-in fade-in-delay-1">
            <h3 style={{ fontSize:'1.4rem', fontWeight:700, marginBottom:16, color:T.gold }}>اليوم</h3>
            <p className="section-body" style={{ maxWidth:'100%' }}>
              اليوم، H&A Fashion أصبحت اسماً راسخاً في المنطقة. بفرعين في قلب المرج — فرع المحطة وفرع الأنابيب —
              نخدم مئات العملاء يومياً ونوفّر أحدث صيحات الموضة الرجالية من تيشيرتات وقمصان وبناطيل وجاكيتات وإكسسوارات.
            </p>
          </div>
          <div className="fade-in fade-in-delay-1" style={{ width:'100%', height:2, background:`linear-gradient(to right, ${T.gold}, transparent)` }}/>
          <div className="fade-in fade-in-delay-2">
            <h3 style={{ fontSize:'1.4rem', fontWeight:700, marginBottom:16, color:T.gold }}>رؤيتنا</h3>
            <p className="section-body" style={{ maxWidth:'100%' }}>
              نؤمن أن الإطلالة الجيدة ليست رفاهية — هي حق لكل رجل. ولذلك نعمل كل يوم على جلب
              أفضل المنتجات وتقديم تجربة تسوق استثنائية تجعلك تخرج من عندنا واثقاً في نفسك وإطلالتك.
            </p>
          </div>
          <div className="fade-in fade-in-delay-3" style={{
            background:T.darkGray, border:`1px solid ${T.border}`,
            padding:40, display:'flex', gap:48, flexWrap:'wrap'
          }}>
            {[['أحمد', 'الإدارة والمالية'], ['حمادة حشم', 'المشتريات والتشغيل']].map(([name, role]) => (
              <div key={name}>
                <div style={{ fontSize:'1rem', fontWeight:700, marginBottom:6 }}>{name}</div>
                <div style={{ fontSize:'0.8rem', color:T.gold, fontFamily:'var(--font-en)', letterSpacing:'0.15em' }}>{role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function StoresPage() {
  useFadeIn();
  return (
    <div className="page" style={{ paddingTop:'var(--nav-h)' }}>
      <div style={{ padding:'80px 48px 40px', background:T.darkGray, borderBottom:`1px solid ${T.border}` }}>
        <span className="section-label fade-in">موقعنا</span>
        <h1 className="section-title fade-in">فروعنا</h1>
        <p className="section-body fade-in">زورنا في أي من فرعينا بالمرج، القاهرة</p>
      </div>
      <div className="stores-section">
        <div className="stores-inner">
          <div className="stores-grid">
            {[
              {
                n:1, badge:'فرع رقم ١', name:'فرع المحطة',
                addr:'جنب محطة مترو المرج القديمة الشرقية، بجوار مطعم ملك الكبدة',
                hours:'٣ العصر — ٢ الليل (يومياً)',
                landmark:'قريب من الميدان الرئيسي'
              },
              {
                n:2, badge:'فرع رقم ٢', name:'فرع الأنابيب',
                addr:'شارع مكازن الأنابيب بجانب شارع محمد نجيب، بالقرب من صيدلية الدكتور أيمن',
                hours:'٣ العصر — ٢ الليل (يومياً)',
                landmark:'في قلب حي الأنابيب'
              }
            ].map(s => (
              <div key={s.n} className="store-card fade-in">
                <div className="store-number">{String(s.n).padStart(2,'0')}</div>
                <div className="store-badge">{s.badge}</div>
                <div className="store-name">{s.name}</div>
                <div className="store-detail">
                  <span className="store-detail-icon">📍</span>
                  <span className="store-detail-text">{s.addr}</span>
                </div>
                <div className="store-detail">
                  <span className="store-detail-icon">🕐</span>
                  <span className="store-detail-text"><strong>{s.hours}</strong></span>
                </div>
                <div className="store-detail">
                  <span className="store-detail-icon">📌</span>
                  <span className="store-detail-text">{s.landmark}</span>
                </div>
                <a
                  className="store-whatsapp"
                  href={waLink(`مرحباً! عايز أيجي ${s.name} — ممكن تساعدني؟`)}
                  target="_blank" rel="noreferrer"
                >
                  💬 تواصل معنا
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactPage() {
  useFadeIn();
  return (
    <div className="page" style={{ paddingTop:'var(--nav-h)' }}>
      <div style={{ padding:'80px 48px 40px', background:T.darkGray, borderBottom:`1px solid ${T.border}` }}>
        <span className="section-label fade-in">تواصل معنا</span>
        <h1 className="section-title fade-in">نحن هنا لك</h1>
      </div>
      <section className="section" style={{ maxWidth:800, margin:'0 auto' }}>
        <div style={{ display:'grid', gap:16 }}>
          {[
            { icon:'💬', label:'واتساب', val:'01010422018', link: waLink('مرحباً H&A!') },
            { icon:'📸', label:'انستجرام', val:'@ha_storree', link:'https://instagram.com/ha_storree' },
            { icon:'🎵', label:'تيك توك', val:'@ha_lll1', link:'https://tiktok.com/@ha_lll1' },
            { icon:'🕐', label:'مواعيد العمل', val:'٣ العصر — ٢ الليل — يومياً', link:null },
          ].map((item, i) => (
            <div key={i} className={`fade-in fade-in-delay-${i+1}`} style={{
              display:'flex', alignItems:'center', gap:20, padding:'24px 32px',
              background:T.darkGray, border:`1px solid ${T.border}`,
              transition:'border-color 0.2s'
            }}>
              <span style={{ fontSize:'1.5rem' }}>{item.icon}</span>
              <div>
                <div style={{ fontSize:'0.7rem', color:T.gold, letterSpacing:'0.2em', fontFamily:'var(--font-en)', marginBottom:4 }}>{item.label}</div>
                {item.link
                  ? <a href={item.link} target="_blank" rel="noreferrer" style={{ color:T.white, textDecoration:'none', fontSize:'1rem', fontWeight:500 }}>{item.val}</a>
                  : <span style={{ color:T.white, fontSize:'1rem' }}>{item.val}</span>
                }
              </div>
            </div>
          ))}
        </div>
        <div className="fade-in" style={{ marginTop:48 }}>
          <a
            href={waLink('مرحباً H&A! عندي سؤال...')}
            target="_blank" rel="noreferrer"
            className="btn-primary"
            style={{ display:'inline-block', textDecoration:'none' }}
          >
            💬 ابدأ محادثة على واتساب
          </a>
        </div>
      </section>
    </div>
  );
}

function Footer({ setPage }) {
  return (
    <footer>
      <div className="footer-top">
        <div>
          <div className="footer-brand-logo">H&A</div>
          <p className="footer-brand-desc">
            ملابس رجالية عصرية بجودة عالية وأسعار مناسبة. فرعين في قلب المرج، القاهرة.
          </p>
          <div className="footer-social">
            <a className="footer-social-link" href="https://instagram.com/ha_storree" target="_blank" rel="noreferrer">IG</a>
            <a className="footer-social-link" href="https://tiktok.com/@ha_lll1" target="_blank" rel="noreferrer">TK</a>
            <a className="footer-social-link" href={waLink('مرحباً!')} target="_blank" rel="noreferrer">WA</a>
          </div>
        </div>
        <div>
          <div className="footer-col-title">الموقع</div>
          <ul className="footer-links">
            {[['الرئيسية','home'],['المنتجات','products'],['قصتنا','story'],['فروعنا','stores'],['تواصل','contact']].map(([l,k]) => (
              <li key={k}><a onClick={() => { setPage(k); window.scrollTo(0,0); }}>{l}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <div className="footer-col-title">التصنيفات</div>
          <ul className="footer-links">
            {['تيشيرتات','قمصان','بناطيل','جاكيتات'].map(c => (
              <li key={c}><a onClick={() => { setPage('products'); window.scrollTo(0,0); }}>{c}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <div className="footer-col-title">تواصل</div>
          <ul className="footer-links">
            <li><a href={waLink('مرحباً!')} target="_blank" rel="noreferrer">01010422018</a></li>
            <li><a href="https://instagram.com/ha_storree" target="_blank" rel="noreferrer">@ha_storree</a></li>
            <li><a>المرج، القاهرة</a></li>
            <li><a>٣ ع — ٢ ص يومياً</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span className="footer-copy">© 2025 H&A Fashion. All rights reserved.</span>
        <span className="footer-made">صُنع بـ ❤️ للرجل العصري</span>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════ */
export default function App() {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const renderPage = () => {
    switch(page) {
      case 'home':     return <HomePage setPage={setPage} />;
      case 'products': return <ProductsPage />;
      case 'story':    return <StoryPage />;
      case 'stores':   return <StoresPage />;
      case 'contact':  return <ContactPage />;
      default:         return <HomePage setPage={setPage} />;
    }
  };

  return (
    <>
      <style>{globalCSS}</style>
      <LoadingScreen done={!loading} />
      <Nav page={page} setPage={setPage} scrolled={scrolled} />
      <main>
        {renderPage()}
        <Footer setPage={setPage} />
      </main>
      <FloatingWA chatOpen={chatOpen} setChatOpen={setChatOpen} />
      <Chatbot open={chatOpen} setOpen={setChatOpen} />
    </>
  );
}
