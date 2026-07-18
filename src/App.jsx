import React, { useState, useEffect, useRef } from 'react';

const T = {
  white:     '#FFFFFF',
  lightGray: '#F8F9FB',
  navy:      '#0F172A',
  navyHover: '#1E293B',
  text:      '#111827',
  textGray:  '#687280',
  gold:      '#D4AF37',
  goldLight: '#E8C84A',
  border:    '#E5E7EB',
  shadow:    '0 4px 24px rgba(15,23,42,0.08)',
  shadowHover: '0 12px 40px rgba(15,23,42,0.15)',
};

const globalCSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --white: ${T.white};
    --light-gray: ${T.lightGray};
    --navy: ${T.navy};
    --navy-hover: ${T.navyHover};
    --text: ${T.text};
    --text-gray: ${T.textGray};
    --gold: ${T.gold};
    --gold-light: ${T.goldLight};
    --border: ${T.border};
    --shadow: ${T.shadow};
    --shadow-hover: ${T.shadowHover};
    --font-ar: 'IBM Plex Sans Arabic', sans-serif;
    --font-en: 'Inter', sans-serif;
    --nav-h: 72px;
    --max-w: 1280px;
    --radius: 20px;
    --radius-sm: 12px;
    --ease: cubic-bezier(0.4, 0, 0.2, 1);
    --section-gap: 120px;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--white);
    color: var(--text);
    font-family: var(--font-ar);
    direction: rtl;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  ::selection { background: var(--gold); color: var(--navy); }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--light-gray); }
  ::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 2px; }

  /* Loading */
  .loading {
    position: fixed; inset: 0;
    background: var(--navy);
    display: flex; align-items: center; justify-content: center;
    z-index: 9999;
    transition: opacity 0.6s var(--ease), visibility 0.6s;
  }
  .loading.out { opacity: 0; visibility: hidden; pointer-events: none; }
  .loading-logo {
    font-family: var(--font-en);
    font-size: 3.5rem; font-weight: 800;
    letter-spacing: 0.3em; color: var(--gold);
    animation: pulse 1.2s ease-in-out infinite;
  }
  @keyframes pulse { 0%,100%{opacity:0.3} 50%{opacity:1} }

  /* Nav */
  nav {
    position: fixed; top: 0; left: 0; right: 0;
    height: var(--nav-h);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 48px;
    z-index: 1000;
    transition: background 0.4s, box-shadow 0.4s, backdrop-filter 0.4s;
  }
  nav.transparent { background: transparent; }
  nav.solid {
    background: rgba(255,255,255,0.92);
    backdrop-filter: blur(20px);
    box-shadow: 0 1px 0 var(--border);
  }
  .nav-logo {
    font-family: var(--font-en);
    font-size: 1.6rem; font-weight: 800;
    letter-spacing: 0.2em; color: var(--navy);
    cursor: pointer; text-decoration: none;
    transition: color 0.2s;
  }
  nav.transparent .nav-logo { color: var(--white); }
  .nav-links { display: flex; gap: 36px; list-style: none; }
  .nav-links a {
    font-size: 0.85rem; font-weight: 500;
    color: var(--text-gray); text-decoration: none;
    letter-spacing: 0.05em; cursor: pointer;
    transition: color 0.2s; position: relative;
  }
  .nav-links a::after {
    content: ''; position: absolute; bottom: -4px; right: 0; left: 0;
    height: 2px; background: var(--gold);
    transform: scaleX(0); transition: transform 0.2s var(--ease);
  }
  .nav-links a:hover { color: var(--navy); }
  .nav-links a:hover::after { transform: scaleX(1); }
  nav.transparent .nav-links a { color: rgba(255,255,255,0.8); }
  nav.transparent .nav-links a:hover { color: var(--white); }
  .nav-cta {
    background: var(--navy); color: var(--white);
    border: none; padding: 12px 28px;
    font-size: 0.82rem; font-family: var(--font-ar);
    font-weight: 600; letter-spacing: 0.05em;
    border-radius: 100px; cursor: pointer;
    transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
  }
  .nav-cta:hover {
    background: var(--navy-hover);
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(15,23,42,0.25);
  }
  nav.transparent .nav-cta { background: var(--gold); color: var(--navy); }
  .hamburger {
    display: none; flex-direction: column; gap: 5px;
    cursor: pointer; background: none; border: none; padding: 4px;
  }
  .hamburger span { display: block; width: 24px; height: 2px; background: var(--navy); transition: all 0.3s; border-radius: 2px; }
  nav.transparent .hamburger span { background: var(--white); }
  .hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .hamburger.open span:nth-child(2) { opacity: 0; }
  .hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

  /* Mobile menu */
  .mobile-menu {
    position: fixed; inset: 0;
    background: var(--white);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 36px;
    z-index: 999;
    transform: translateX(100%);
    transition: transform 0.4s var(--ease);
  }
  .mobile-menu.open { transform: translateX(0); }
  .mobile-menu a {
    font-size: 1.8rem; color: var(--navy);
    text-decoration: none; font-weight: 300;
    cursor: pointer; transition: color 0.2s;
  }
  .mobile-menu a:hover { color: var(--gold); }

  /* Hero */
  .hero {
    height: 100vh; min-height: 700px;
    position: relative; overflow: hidden;
    display: flex; align-items: center;
    background: linear-gradient(135deg, #0F172A 0%, #1E293B 40%, #0F2744 100%);
  }
  .hero-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to left, transparent 40%, rgba(15,23,42,0.85) 100%);
    z-index: 1;
  }
  .hero-content {
    position: relative; z-index: 2;
    max-width: var(--max-w); margin: 0 auto;
    padding: 0 48px; width: 100%;
  }
  .hero-eyebrow {
    font-family: var(--font-en);
    font-size: 0.72rem; font-weight: 600;
    letter-spacing: 0.4em; color: var(--gold);
    text-transform: uppercase; margin-bottom: 20px;
    opacity: 0; animation: fadeUp 0.8s 0.3s var(--ease) forwards;
    display: flex; align-items: center; gap: 12px;
  }
  .hero-eyebrow::before {
    content: ''; width: 32px; height: 1px; background: var(--gold);
  }
  .hero-title {
    font-size: clamp(3rem, 6vw, 5rem);
    font-weight: 800; line-height: 1.1;
    color: var(--white); max-width: 600px;
    margin-bottom: 24px;
    opacity: 0; animation: fadeUp 0.8s 0.5s var(--ease) forwards;
  }
  .hero-title .gold { color: var(--gold); }
  .hero-desc {
    font-size: 1.1rem; color: rgba(255,255,255,0.7);
    line-height: 1.8; max-width: 460px;
    font-weight: 300; margin-bottom: 48px;
    opacity: 0; animation: fadeUp 0.8s 0.7s var(--ease) forwards;
  }
  .hero-btns {
    display: flex; gap: 16px; flex-wrap: wrap;
    opacity: 0; animation: fadeUp 0.8s 0.9s var(--ease) forwards;
  }
  .btn-primary {
    background: var(--gold); color: var(--navy);
    border: none; padding: 16px 40px;
    font-size: 0.9rem; font-family: var(--font-ar);
    font-weight: 700; letter-spacing: 0.05em;
    border-radius: 100px; cursor: pointer;
    transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
    text-decoration: none; display: inline-block;
  }
  .btn-primary:hover {
    background: var(--gold-light);
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(212,175,55,0.4);
  }
  .btn-outline-white {
    background: transparent; color: var(--white);
    border: 1.5px solid rgba(255,255,255,0.4);
    padding: 16px 40px;
    font-size: 0.9rem; font-family: var(--font-ar);
    font-weight: 400; border-radius: 100px; cursor: pointer;
    transition: border-color 0.2s, background 0.2s, transform 0.2s;
  }
  .btn-outline-white:hover {
    border-color: var(--white); background: rgba(255,255,255,0.1);
    transform: translateY(-2px);
  }
  .hero-stats {
    position: absolute; bottom: 48px; left: 0; right: 0;
    z-index: 2;
    max-width: var(--max-w); margin: 0 auto; padding: 0 48px;
    display: flex; gap: 48px;
    opacity: 0; animation: fadeUp 0.8s 1.1s var(--ease) forwards;
  }
  .hero-stat { text-align: center; }
  .hero-stat-num {
    font-family: var(--font-en);
    font-size: 2.2rem; font-weight: 800;
    color: var(--gold); display: block; line-height: 1;
  }
  .hero-stat-label {
    font-size: 0.78rem; color: rgba(255,255,255,0.6);
    margin-top: 6px; display: block; font-weight: 300;
  }
  .hero-scroll-indicator {
    position: absolute; bottom: 48px; right: 48px; z-index: 2;
    display: flex; flex-direction: column; align-items: center; gap: 8px;
    opacity: 0; animation: fadeUp 0.8s 1.3s var(--ease) forwards;
  }
  .scroll-text {
    font-family: var(--font-en); font-size: 0.6rem;
    letter-spacing: 0.3em; color: rgba(255,255,255,0.5);
    text-transform: uppercase; writing-mode: vertical-rl;
  }
  .scroll-line-anim {
    width: 1px; height: 48px;
    background: linear-gradient(to bottom, var(--gold), transparent);
    animation: scrollAnim 1.5s ease-in-out infinite;
  }
  @keyframes scrollAnim { 0%{height:0;opacity:1} 100%{height:48px;opacity:0} }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Fade in on scroll */
  .fi { opacity: 0; transform: translateY(32px); transition: opacity 0.7s var(--ease), transform 0.7s var(--ease); }
  .fi.visible { opacity: 1; transform: translateY(0); }
  .fi-d1 { transition-delay: 0.1s; }
  .fi-d2 { transition-delay: 0.2s; }
  .fi-d3 { transition-delay: 0.3s; }
  .fi-d4 { transition-delay: 0.4s; }

  /* Section shared */
  .section { padding: var(--section-gap) 48px; max-width: 1440px; margin: 0 auto; }
  .section-center { text-align: center; }
  .section-label {
    font-family: var(--font-en);
    font-size: 0.7rem; font-weight: 600;
    letter-spacing: 0.35em; color: var(--gold);
    text-transform: uppercase; margin-bottom: 16px;
    display: flex; align-items: center; gap: 12px;
  }
  .section-label.center { justify-content: center; }
  .section-label::before, .section-label::after {
    content: ''; flex: 1; max-width: 40px;
    height: 1px; background: var(--gold);
  }
  .section-label:not(.center)::before { display: none; }
  .section-title {
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 800; color: var(--navy);
    line-height: 1.15; margin-bottom: 16px;
  }
  .section-sub {
    font-size: 1rem; color: var(--text-gray);
    line-height: 1.8; font-weight: 300;
    max-width: 520px; margin: 0 auto;
  }

  /* Stats marquee */
  .marquee-wrap {
    background: var(--navy); padding: 20px 0; overflow: hidden;
  }
  .marquee-track {
    display: flex; animation: marquee 25s linear infinite; white-space: nowrap;
  }
  .marquee-item {
    display: inline-flex; align-items: center; gap: 20px;
    padding: 0 32px;
    font-family: var(--font-en); font-size: 0.72rem;
    font-weight: 600; letter-spacing: 0.25em;
    text-transform: uppercase; color: rgba(255,255,255,0.6);
  }
  .marquee-dot { width: 4px; height: 4px; background: var(--gold); border-radius: 50%; }
  @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }

  /* Categories */
  .categories-grid {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 20px; margin-top: 56px;
  }
  .cat-card {
    border-radius: var(--radius);
    overflow: hidden; position: relative;
    aspect-ratio: 3/4; cursor: pointer;
    background: var(--light-gray);
    transition: transform 0.4s var(--ease), box-shadow 0.4s var(--ease);
  }
  .cat-card:hover { transform: translateY(-8px); box-shadow: var(--shadow-hover); }
  .cat-bg {
    position: absolute; inset: 0;
    background-size: cover; background-position: center;
    transition: transform 0.6s var(--ease);
  }
  .cat-card:hover .cat-bg { transform: scale(1.06); }
  .cat-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.1) 60%, transparent 100%);
  }
  .cat-info {
    position: absolute; bottom: 0; left: 0; right: 0;
    padding: 28px 24px;
  }
  .cat-name { font-size: 1.2rem; font-weight: 700; color: var(--white); margin-bottom: 6px; }
  .cat-count {
    font-family: var(--font-en); font-size: 0.72rem;
    color: var(--gold); letter-spacing: 0.15em; font-weight: 600;
  }
  .cat-arrow {
    position: absolute; top: 20px; left: 20px;
    width: 36px; height: 36px; border-radius: 50%;
    background: rgba(255,255,255,0.15);
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: 1rem;
    opacity: 0; transform: translateY(8px);
    transition: opacity 0.3s, transform 0.3s;
  }
  .cat-card:hover .cat-arrow { opacity: 1; transform: translateY(0); }

  /* Products */
  .products-grid {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 24px; margin-top: 56px;
  }
  .product-card {
    background: var(--white);
    border-radius: var(--radius);
    overflow: hidden; cursor: pointer;
    box-shadow: var(--shadow);
    transition: transform 0.4s var(--ease), box-shadow 0.4s var(--ease);
  }
  .product-card:hover { transform: translateY(-8px); box-shadow: var(--shadow-hover); }
  .product-img {
    position: relative; aspect-ratio: 3/4;
    background: var(--light-gray); overflow: hidden;
  }
  .product-img-placeholder {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, #F1F5F9, #E2E8F0);
  }
  .product-icon { font-size: 4rem; opacity: 0.2; }
  .product-badge {
    position: absolute; top: 16px; right: 16px;
    background: var(--gold); color: var(--navy);
    font-size: 0.65rem; font-weight: 700;
    letter-spacing: 0.1em; padding: 5px 12px;
    border-radius: 100px; font-family: var(--font-en);
    text-transform: uppercase;
  }
  .product-badge.new { background: var(--navy); color: var(--white); }
  .product-wishlist {
    position: absolute; top: 16px; left: 16px;
    width: 36px; height: 36px; border-radius: 50%;
    background: white; border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem; box-shadow: var(--shadow);
    opacity: 0; transform: scale(0.8);
    transition: opacity 0.3s, transform 0.3s;
  }
  .product-card:hover .product-wishlist { opacity: 1; transform: scale(1); }
  .product-overlay {
    position: absolute; inset: 0;
    background: rgba(15,23,42,0.5);
    display: flex; align-items: center; justify-content: center;
    opacity: 0; transition: opacity 0.3s;
  }
  .product-card:hover .product-overlay { opacity: 1; }
  .product-wa-btn {
    background: var(--white); color: var(--navy);
    border: none; padding: 14px 28px;
    font-size: 0.82rem; font-family: var(--font-ar);
    font-weight: 700; border-radius: 100px; cursor: pointer;
    transform: translateY(12px);
    transition: transform 0.3s var(--ease), background 0.2s;
  }
  .product-card:hover .product-wa-btn { transform: translateY(0); }
  .product-wa-btn:hover { background: var(--gold); }
  .product-info { padding: 20px; }
  .product-name { font-size: 0.95rem; font-weight: 600; color: var(--navy); margin-bottom: 8px; }
  .product-price { font-family: var(--font-en); font-size: 0.9rem; color: var(--gold); font-weight: 700; }
  .product-stars { display: flex; gap: 2px; margin-top: 8px; }
  .star { color: var(--gold); font-size: 0.75rem; }

  /* Filter tabs */
  .filter-tabs {
    display: flex; gap: 8px; justify-content: center;
    margin-top: 40px; flex-wrap: wrap;
  }
  .filter-tab {
    padding: 10px 24px; border-radius: 100px;
    font-size: 0.82rem; font-family: var(--font-ar); font-weight: 500;
    background: transparent; border: 1.5px solid var(--border);
    color: var(--text-gray); cursor: pointer;
    transition: all 0.2s var(--ease);
  }
  .filter-tab.active { background: var(--navy); color: var(--white); border-color: var(--navy); }
  .filter-tab:hover:not(.active) { border-color: var(--navy); color: var(--navy); }

  /* Promo banner */
  .promo-banner {
    margin: 0 48px;
    border-radius: var(--radius);
    background: linear-gradient(135deg, var(--navy) 0%, #1E3A5F 100%);
    padding: 80px 64px;
    display: flex; align-items: center; justify-content: space-between;
    position: relative; overflow: hidden;
  }
  .promo-bg-text {
    position: absolute; right: -20px; top: -20px;
    font-family: var(--font-en); font-size: 18rem; font-weight: 900;
    color: rgba(255,255,255,0.02); line-height: 1; pointer-events: none;
    letter-spacing: -0.05em;
  }
  .promo-content { position: relative; z-index: 1; }
  .promo-label {
    font-family: var(--font-en); font-size: 0.7rem; font-weight: 600;
    letter-spacing: 0.35em; color: var(--gold); text-transform: uppercase;
    margin-bottom: 16px; display: block;
  }
  .promo-title {
    font-size: clamp(2rem, 4vw, 3rem); font-weight: 800;
    color: var(--white); line-height: 1.2; margin-bottom: 24px;
  }
  .promo-title .gold { color: var(--gold); }

  /* Story / About */
  .story-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 80px; align-items: center;
  }
  .story-visual {
    border-radius: var(--radius);
    background: linear-gradient(135deg, var(--navy), #1E293B);
    aspect-ratio: 4/5;
    display: flex; align-items: center; justify-content: center;
    position: relative; overflow: hidden;
  }
  .story-monogram {
    font-family: var(--font-en); font-size: 10rem; font-weight: 900;
    color: rgba(212,175,55,0.08); letter-spacing: -0.05em; line-height: 1;
  }
  .story-gold-accent {
    position: absolute; bottom: 0; left: 0; right: 0;
    height: 4px; background: linear-gradient(to right, var(--gold), transparent);
  }
  .story-badge {
    position: absolute; top: 32px; right: 32px;
    background: var(--gold); color: var(--navy);
    padding: 12px 20px; border-radius: var(--radius-sm);
    font-size: 0.8rem; font-weight: 700; text-align: center;
  }
  .story-badge span { display: block; font-size: 1.8rem; font-family: var(--font-en); }
  .story-quote {
    font-size: clamp(1.3rem, 2.5vw, 1.7rem); font-weight: 300;
    color: var(--navy); line-height: 1.7; margin-bottom: 32px;
    font-style: italic; position: relative; padding-right: 24px;
  }
  .story-quote::before {
    content: ''; position: absolute;
    right: 0; top: 4px; bottom: 4px;
    width: 3px; background: var(--gold); border-radius: 2px;
  }
  .story-features { display: flex; flex-direction: column; gap: 20px; margin-top: 40px; }
  .story-feature {
    display: flex; align-items: center; gap: 16px;
    padding: 20px 24px; border-radius: var(--radius-sm);
    background: var(--light-gray);
    transition: background 0.2s;
  }
  .story-feature:hover { background: #EEF2FF; }
  .story-feature-icon {
    width: 44px; height: 44px; border-radius: 12px;
    background: var(--navy); display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem; flex-shrink: 0;
  }
  .story-feature-text { font-size: 0.9rem; color: var(--text-gray); font-weight: 400; }
  .story-feature-text strong { color: var(--navy); display: block; margin-bottom: 2px; }

  /* Reviews */
  .reviews-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 24px; margin-top: 56px;
  }
  .review-card {
    background: var(--white); border-radius: var(--radius);
    padding: 36px; box-shadow: var(--shadow);
    border: 1px solid var(--border);
    transition: transform 0.3s, box-shadow 0.3s;
    position: relative;
  }
  .review-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-hover); }
  .review-quote-icon {
    font-size: 3rem; color: var(--gold); opacity: 0.2;
    position: absolute; top: 20px; left: 24px;
    font-family: Georgia, serif; line-height: 1;
  }
  .review-stars { display: flex; gap: 4px; margin-bottom: 20px; }
  .review-text {
    font-size: 0.95rem; color: var(--text-gray);
    line-height: 1.8; font-weight: 300; margin-bottom: 28px;
  }
  .review-author { display: flex; align-items: center; gap: 12px; }
  .review-avatar {
    width: 44px; height: 44px; border-radius: 50%;
    background: var(--navy); display: flex; align-items: center; justify-content: center;
    font-size: 1rem; font-weight: 700; color: var(--gold);
    font-family: var(--font-en); flex-shrink: 0;
  }
  .review-name { font-size: 0.9rem; font-weight: 600; color: var(--navy); }
  .review-date { font-size: 0.75rem; color: var(--text-gray); margin-top: 2px; font-family: var(--font-en); }

  /* Stores */
  .stores-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 24px; margin-top: 56px;
  }
  .store-card {
    background: var(--white); border-radius: var(--radius);
    padding: 48px; box-shadow: var(--shadow);
    border: 1px solid var(--border);
    transition: transform 0.3s, box-shadow 0.3s;
    position: relative; overflow: hidden;
  }
  .store-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-hover); }
  .store-card-accent {
    position: absolute; top: 0; right: 0;
    width: 4px; height: 100%;
    background: linear-gradient(to bottom, var(--gold), transparent);
  }
  .store-num {
    font-family: var(--font-en); font-size: 5rem; font-weight: 900;
    color: var(--light-gray); position: absolute;
    top: 16px; left: 32px; line-height: 1; pointer-events: none;
  }
  .store-badge {
    display: inline-block; background: var(--navy); color: var(--gold);
    font-size: 0.65rem; font-weight: 700; letter-spacing: 0.2em;
    padding: 5px 14px; border-radius: 100px; margin-bottom: 20px;
    font-family: var(--font-en); text-transform: uppercase;
  }
  .store-name { font-size: 1.4rem; font-weight: 800; color: var(--navy); margin-bottom: 24px; }
  .store-detail { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 16px; }
  .store-detail-icon { font-size: 1.1rem; margin-top: 1px; flex-shrink: 0; }
  .store-detail-text { font-size: 0.9rem; color: var(--text-gray); line-height: 1.6; }
  .store-detail-text strong { color: var(--navy); }
  .store-btn {
    display: inline-flex; align-items: center; gap: 8px;
    margin-top: 28px; background: var(--navy); color: var(--white);
    padding: 14px 28px; border-radius: 100px;
    font-size: 0.85rem; font-family: var(--font-ar); font-weight: 600;
    text-decoration: none; border: none; cursor: pointer;
    transition: background 0.2s, transform 0.2s;
  }
  .store-btn:hover { background: var(--gold); color: var(--navy); transform: translateY(-2px); }

  /* Newsletter */
  .newsletter {
    background: var(--navy);
    padding: 100px 48px; text-align: center;
  }
  .newsletter-title {
    font-size: clamp(2rem, 4vw, 3rem); font-weight: 800;
    color: var(--white); margin-bottom: 16px;
  }
  .newsletter-sub { font-size: 1rem; color: rgba(255,255,255,0.6); margin-bottom: 48px; }
  .newsletter-cta {
    display: inline-flex; align-items: center; gap: 12px;
    background: var(--gold); color: var(--navy);
    padding: 18px 48px; border-radius: 100px;
    font-size: 1rem; font-family: var(--font-ar); font-weight: 700;
    text-decoration: none; cursor: pointer; border: none;
    transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
  }
  .newsletter-cta:hover {
    background: var(--gold-light); transform: translateY(-3px);
    box-shadow: 0 16px 40px rgba(212,175,55,0.4);
  }

  /* Features */
  .features-grid {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 24px; margin-top: 56px;
  }
  .feature-card {
    background: var(--white); border-radius: var(--radius);
    padding: 36px 28px; text-align: center;
    box-shadow: var(--shadow); border: 1px solid var(--border);
    transition: transform 0.3s, box-shadow 0.3s;
  }
  .feature-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-hover); }
  .feature-icon {
    width: 64px; height: 64px; border-radius: 20px;
    background: var(--light-gray);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.8rem; margin: 0 auto 20px;
    transition: background 0.2s;
  }
  .feature-card:hover .feature-icon { background: var(--navy); }
  .feature-name { font-size: 1rem; font-weight: 700; color: var(--navy); margin-bottom: 8px; }
  .feature-desc { font-size: 0.85rem; color: var(--text-gray); line-height: 1.7; }

  /* Footer */
  footer {
    background: var(--navy); padding: 80px 48px 40px;
  }
  .footer-grid {
    display: grid; grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 60px; padding-bottom: 60px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }
  .footer-logo {
    font-family: var(--font-en); font-size: 2rem; font-weight: 800;
    letter-spacing: 0.2em; color: var(--gold); margin-bottom: 16px;
  }
  .footer-desc {
    font-size: 0.875rem; color: rgba(255,255,255,0.5);
    line-height: 1.8; font-weight: 300; max-width: 260px;
  }
  .footer-social { display: flex; gap: 10px; margin-top: 24px; }
  .footer-social-btn {
    width: 38px; height: 38px; border-radius: 10px;
    background: rgba(255,255,255,0.06);
    display: flex; align-items: center; justify-content: center;
    color: rgba(255,255,255,0.5); font-size: 0.85rem;
    cursor: pointer; text-decoration: none;
    transition: background 0.2s, color 0.2s;
    border: 1px solid rgba(255,255,255,0.08);
  }
  .footer-social-btn:hover { background: var(--gold); color: var(--navy); border-color: var(--gold); }
  .footer-col-title {
    font-size: 0.72rem; font-weight: 700; letter-spacing: 0.2em;
    color: var(--white); text-transform: uppercase;
    font-family: var(--font-en); margin-bottom: 24px;
  }
  .footer-links { list-style: none; display: flex; flex-direction: column; gap: 14px; }
  .footer-links a {
    font-size: 0.875rem; color: rgba(255,255,255,0.5);
    text-decoration: none; cursor: pointer;
    transition: color 0.2s; font-weight: 300;
  }
  .footer-links a:hover { color: var(--gold); }
  .footer-bottom {
    display: flex; justify-content: space-between; align-items: center;
    padding-top: 32px; flex-wrap: wrap; gap: 12px;
  }
  .footer-copy { font-size: 0.78rem; color: rgba(255,255,255,0.3); font-family: var(--font-en); }
  .footer-made { font-size: 0.78rem; color: rgba(255,255,255,0.3); }

  /* Floating WA */
  .floating-wa {
    position: fixed; bottom: 32px; left: 32px; z-index: 998;
    display: flex; flex-direction: column; align-items: flex-start; gap: 10px;
  }
  .wa-bubble {
    background: var(--white); border: 1px solid var(--border);
    padding: 10px 16px; border-radius: var(--radius-sm);
    font-size: 0.8rem; color: var(--text-gray);
    white-space: nowrap; box-shadow: var(--shadow);
    opacity: 0; transform: translateX(-8px);
    transition: opacity 0.3s, transform 0.3s; pointer-events: none;
  }
  .floating-wa:hover .wa-bubble { opacity: 1; transform: translateX(0); }
  .wa-btn {
    width: 56px; height: 56px; border-radius: 50%;
    background: #25D366; border: none;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.5rem; cursor: pointer; text-decoration: none;
    box-shadow: 0 6px 24px rgba(37,211,102,0.4);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .wa-btn:hover { transform: scale(1.1); box-shadow: 0 10px 32px rgba(37,211,102,0.5); }

  /* Chatbot */
  .chatbot {
    position: fixed; bottom: 100px; left: 32px;
    width: 360px; background: var(--white);
    border-radius: var(--radius); border: 1px solid var(--border);
    box-shadow: var(--shadow-hover); z-index: 997;
    transform: translateY(16px) scale(0.96); opacity: 0;
    pointer-events: none; transition: all 0.3s var(--ease);
    overflow: hidden;
  }
  .chatbot.open { transform: translateY(0) scale(1); opacity: 1; pointer-events: all; }
  .chatbot-header {
    padding: 20px 24px; background: var(--navy);
    display: flex; justify-content: space-between; align-items: center;
  }
  .chatbot-title { font-weight: 700; color: var(--white); font-size: 0.95rem; }
  .chatbot-sub { font-size: 0.72rem; color: rgba(255,255,255,0.6); margin-top: 2px; }
  .chatbot-close {
    background: none; border: none; cursor: pointer;
    color: rgba(255,255,255,0.6); font-size: 1.2rem; transition: color 0.2s;
  }
  .chatbot-close:hover { color: var(--white); }
  .chatbot-msgs {
    height: 280px; overflow-y: auto; padding: 20px;
    display: flex; flex-direction: column; gap: 12px;
  }
  .msg { max-width: 85%; }
  .msg.bot { align-self: flex-start; }
  .msg.user { align-self: flex-end; }
  .msg-bubble {
    padding: 12px 16px; font-size: 0.84rem; line-height: 1.6;
    border-radius: var(--radius-sm);
  }
  .msg.bot .msg-bubble { background: var(--light-gray); color: var(--text); }
  .msg.user .msg-bubble { background: var(--navy); color: var(--white); }
  .chatbot-quick {
    padding: 12px 16px; display: flex; flex-wrap: wrap; gap: 8px;
    border-top: 1px solid var(--border);
  }
  .quick-q {
    font-size: 0.74rem; padding: 6px 14px; border-radius: 100px;
    background: var(--light-gray); border: 1px solid var(--border);
    color: var(--text-gray); cursor: pointer; font-family: var(--font-ar);
    transition: all 0.2s;
  }
  .quick-q:hover { background: var(--navy); color: var(--white); border-color: var(--navy); }
  .chatbot-input-row {
    padding: 16px; border-top: 1px solid var(--border);
    display: flex; gap: 10px;
  }
  .chatbot-input {
    flex: 1; background: var(--light-gray); border: 1.5px solid var(--border);
    color: var(--text); padding: 10px 14px;
    font-size: 0.84rem; font-family: var(--font-ar);
    border-radius: 100px; outline: none;
    transition: border-color 0.2s;
  }
  .chatbot-input:focus { border-color: var(--navy); }
  .chatbot-send {
    width: 40px; height: 40px; border-radius: 50%;
    background: var(--navy); border: none; color: var(--white);
    cursor: pointer; font-size: 1rem; transition: background 0.2s;
    display: flex; align-items: center; justify-content: center;
  }
  .chatbot-send:hover { background: var(--gold); color: var(--navy); }
  .chat-toggle-btn {
    position: fixed; bottom: 100px; left: 100px; z-index: 998;
    width: 46px; height: 46px; border-radius: 50%;
    background: var(--white); border: 1.5px solid var(--border);
    color: var(--navy); cursor: pointer; font-size: 1.2rem;
    display: flex; align-items: center; justify-content: center;
    box-shadow: var(--shadow); transition: all 0.2s;
  }
  .chat-toggle-btn:hover { background: var(--navy); color: var(--white); border-color: var(--navy); }

  /* Page anim */
  .page { animation: pageIn 0.4s var(--ease); }
  @keyframes pageIn { from{opacity:0} to{opacity:1} }

  /* Responsive */
  @media (max-width: 1024px) {
    .categories-grid { grid-template-columns: repeat(2, 1fr); }
    .products-grid { grid-template-columns: repeat(2, 1fr); }
    .features-grid { grid-template-columns: repeat(2, 1fr); }
    .story-grid { grid-template-columns: 1fr; }
    .footer-grid { grid-template-columns: 1fr 1fr; gap: 40px; }
  }
  @media (max-width: 768px) {
    :root { --section-gap: 72px; --nav-h: 60px; }
    nav { padding: 0 20px; }
    .nav-links, .nav-cta { display: none; }
    .hamburger { display: flex; }
    .section { padding: var(--section-gap) 20px; }
    .stores-grid { grid-template-columns: 1fr; }
    .reviews-grid { grid-template-columns: 1fr; }
    .promo-banner { margin: 0 20px; padding: 48px 32px; }
    .footer-grid { grid-template-columns: 1fr; gap: 32px; }
    .footer-bottom { flex-direction: column; text-align: center; }
    .floating-wa { bottom: 20px; left: 20px; }
    .chatbot { left: 16px; right: 16px; width: auto; bottom: 90px; }
    .hero-stats { gap: 24px; flex-wrap: wrap; }
    footer { padding: 60px 20px 32px; }
    .newsletter { padding: 72px 20px; }
  }
`;

/* DATA */
const WA = '201010422018';
const wa = (msg) => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;

const CATS = [
  { id:1, name:'تيشيرتات', count:'20+ موديل', icon:'👕', bg:'linear-gradient(135deg,#1E3A5F,#0F172A)' },
  { id:2, name:'قمصان',    count:'15+ موديل', icon:'👔', bg:'linear-gradient(135deg,#2D1B00,#0F172A)' },
  { id:3, name:'بناطيل',   count:'18+ موديل', icon:'👖', bg:'linear-gradient(135deg,#1A1A3E,#0F172A)' },
  { id:4, name:'جاكيتات',  count:'12+ موديل', icon:'🧥', bg:'linear-gradient(135deg,#2D0A1A,#0F172A)' },
];

const PRODUCTS = [
  { id:1, name:'تيشيرت بريميوم كاجوال',  badge:'جديد',          badgeType:'new', cat:'تيشيرتات', icon:'👕' },
  { id:2, name:'قميص أوكسفورد كلاسيك',  badge:'الأكثر طلباً',  badgeType:'',    cat:'قمصان',    icon:'👔' },
  { id:3, name:'بنطلون سليم فيت',        badge:null,            badgeType:'',    cat:'بناطيل',   icon:'👖' },
  { id:4, name:'جاكيت كاجوال خفيف',      badge:'محدود',         badgeType:'',    cat:'جاكيتات',  icon:'🧥' },
  { id:5, name:'تيشيرت أوفرسايز',        badge:'جديد',          badgeType:'new', cat:'تيشيرتات', icon:'👕' },
  { id:6, name:'قميص كتان صيفي',         badge:'جديد',          badgeType:'new', cat:'قمصان',    icon:'👔' },
  { id:7, name:'بنطلون كاجوال لينن',     badge:null,            badgeType:'',    cat:'بناطيل',   icon:'👖' },
  { id:8, name:'تيشيرت برادي لوجو',      badge:'الأكثر طلباً',  badgeType:'',    cat:'تيشيرتات', icon:'👕' },
];

const REVIEWS = [
  { id:1, init:'م', name:'محمد أحمد',    date:'منذ أسبوع',   text:'أحسن محل ملابس في المرج. الأسعار معقولة جداً والجودة عالية. بجد مش هتلاقي حاجة زيها في المنطقة كلها!' },
  { id:2, init:'خ', name:'خالد إبراهيم', date:'منذ أسبوعين', text:'المعاملة حلوة والموظفين محترمين. اشتريت قميص وبنطلون وطلعوا تمام جداً. هرجع تاني بكل تأكيد!' },
  { id:3, init:'أ', name:'أحمد علي',     date:'منذ شهر',     text:'فرع المحطة قريب مني وبيجيب موديلات حلوة دايماً. الكوليكشن بتتغير باستمرار وفيه دايماً جديد.' },
];

const BOT_QA = [
  { q:['مواعيد','وقت','فتح','بفتح'],    a:'مواعيد العمل: من ٣ العصر لـ ٢ الليل — يومياً بدون إجازة 🕒' },
  { q:['فروع','فرع','عنوان','فين'],      a:'عندنا فرعين في المرج:\n📍 فرع المحطة — جنب محطة المرج القديمة الشرقية\n📍 فرع الأنابيب — شارع مكازن الأنابيب' },
  { q:['واتساب','تواصل','اتصل','رقم'],  a:'تقدر تتواصل معانا على واتساب: 01010422018 ✅' },
  { q:['دليفري','توصيل','شحن'],          a:'مش بنعمل توصيل حالياً — بس منور تزورنا في أي فرع 🙏' },
  { q:['سعر','بكام','تمن','أسعار'],      a:'الأسعار متنوعة وتناسب كل الميزانيات! ابعتلنا صورة المنتج على واتساب وهنعرفك السعر فوراً 💬' },
  { q:['منتجات','عندكم','بتبيعوا'],     a:'عندنا: تيشيرتات، قمصان، بناطيل، جاكيتات وأكسسوارات 🛍️' },
];

/* HOOKS */
function useFadeIn() {
  useEffect(() => {
    const els = document.querySelectorAll('.fi');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  });
}

/* NAV */
function Nav({ page, setPage, scrolled }) {
  const [open, setOpen] = useState(false);
  const links = [['الرئيسية','home'],['المنتجات','products'],['قصتنا','story'],['فروعنا','stores'],['تواصل','contact']];
  const go = (k) => { setPage(k); setOpen(false); window.scrollTo(0,0); };
  const cls = scrolled ? 'solid' : 'transparent';

  return (
    <>
      <nav className={cls}>
        <span className="nav-logo" onClick={() => go('home')}>H&A</span>
        <ul className="nav-links">
          {links.map(([l,k]) => <li key={k}><a onClick={() => go(k)}>{l}</a></li>)}
        </ul>
        <button className="nav-cta" onClick={() => window.open(wa('مرحباً! عايز أعرف أكثر عن منتجاتكم'), '_blank')}>
          تواصل الآن
        </button>
        <button className={`hamburger${open?' open':''}`} onClick={() => setOpen(!open)}>
          <span/><span/><span/>
        </button>
      </nav>
      <div className={`mobile-menu${open?' open':''}`}>
        {links.map(([l,k]) => <a key={k} onClick={() => go(k)}>{l}</a>)}
      </div>
    </>
  );
}

/* CHATBOT */
function Chatbot({ open, setOpen }) {
  const [msgs, setMsgs] = useState([{ role:'bot', text:'أهلاً بيك في H&A Fashion! 👋 إزاي أقدر أساعدك؟' }]);
  const [inp, setInp] = useState('');
  const endRef = useRef(null);
  useEffect(() => endRef.current?.scrollIntoView({ behavior:'smooth' }), [msgs]);

  const getReply = (t) => {
    const l = t.toLowerCase();
    for (const qa of BOT_QA) if (qa.q.some(k => l.includes(k))) return qa.a;
    return `شكراً! للرد السريع راسلنا على واتساب 📲\nاضغط الزر الأخضر أسفل الشاشة`;
  };
  const send = (t) => {
    if (!t.trim()) return;
    setMsgs(m => [...m, { role:'user', text:t }]);
    setTimeout(() => setMsgs(m => [...m, { role:'bot', text:getReply(t) }]), 600);
    setInp('');
  };

  return (
    <>
      <div className={`chatbot${open?' open':''}`}>
        <div className="chatbot-header">
          <div>
            <div className="chatbot-title">H&A Fashion — مساعد</div>
            <div className="chatbot-sub">متاح دايماً للمساعدة</div>
          </div>
          <button className="chatbot-close" onClick={() => setOpen(false)}>✕</button>
        </div>
        <div className="chatbot-msgs">
          {msgs.map((m,i) => (
            <div key={i} className={`msg ${m.role}`}>
              <div className="msg-bubble">{m.text}</div>
            </div>
          ))}
          <div ref={endRef}/>
        </div>
        <div className="chatbot-quick">
          {['مواعيد العمل','عناوين الفروع','الأسعار','المنتجات'].map(q => (
            <button key={q} className="quick-q" onClick={() => send(q)}>{q}</button>
          ))}
        </div>
        <div className="chatbot-input-row">
          <input className="chatbot-input" placeholder="اكتب سؤالك..." value={inp}
            onChange={e => setInp(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send(inp)} />
          <button className="chatbot-send" onClick={() => send(inp)}>➤</button>
        </div>
      </div>
      <button className="chat-toggle-btn" onClick={() => setOpen(!open)} title="المساعد الذكي">
        {open ? '✕' : '🤖'}
      </button>
    </>
  );
}

/* FLOATING WA */
function FloatingWA() {
  return (
    <div className="floating-wa">
      <div className="wa-bubble">تكلم معانا على واتساب</div>
      <a className="wa-btn" href={wa('مرحباً H&A!')} target="_blank" rel="noreferrer">💬</a>
    </div>
  );
}

/* ── PAGES ── */
function HomePage({ setPage }) {
  useFadeIn();
  const [filter, setFilter] = useState('الكل');
  const filters = ['الكل','تيشيرتات','قمصان','بناطيل','جاكيتات'];
  const filtered = filter === 'الكل' ? PRODUCTS : PRODUCTS.filter(p => p.cat === filter);

  return (
    <div className="page">
      {/* HERO */}
      <section className="hero">
        <div className="hero-overlay"/>
        <div className="hero-content">
          <div className="hero-eyebrow">المرج، القاهرة — منذ ٢٠٢٠</div>
          <h1 className="hero-title">
            أناقتك<br/><span className="gold">أسلوب حياة</span>
          </h1>
          <p className="hero-desc">
            ملابس رجالية عصرية بجودة عالية وأسعار مناسبة. اكتشف أحدث صيحات الموضة في فرعينا بالمرج.
          </p>
          <div className="hero-btns">
            <button className="btn-primary" onClick={() => setPage('products')}>اكتشف المجموعة</button>
            <button className="btn-outline-white" onClick={() => setPage('stores')}>فروعنا</button>
          </div>
        </div>
        <div className="hero-stats">
          {[['500+','عميل راضٍ'],['2','فرع في المرج'],['15+','سنة خبرة'],['100+','موديل متاح']].map(([n,l]) => (
            <div key={l} className="hero-stat">
              <span className="hero-stat-num">{n}</span>
              <span className="hero-stat-label">{l}</span>
            </div>
          ))}
        </div>
        <div className="hero-scroll-indicator">
          <div className="scroll-line-anim"/>
          <span className="scroll-text">Scroll</span>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-wrap">
        <div className="marquee-track">
          {[...Array(3)].map((_,j) =>
            ['جودة عالية','أسعار مناسبة','موضة رجالية','فرعين في المرج','H&A FASHION','أناقتك أسلوب حياة'].map((t,i) => (
              <div key={`${j}-${i}`} className="marquee-item">{t}<span className="marquee-dot"/></div>
            ))
          )}
        </div>
      </div>

      {/* CATEGORIES */}
      <section className="section fi">
        <div className="section-center">
          <div className="section-label center">تصنيفاتنا</div>
          <h2 className="section-title">كل ما يحتاجه الرجل العصري</h2>
          <p className="section-sub">تشكيلة متنوعة من أرقى الماركات بأسعار تناسب الجميع</p>
        </div>
        <div className="categories-grid">
          {CATS.map((c,i) => (
            <div key={c.id} className={`cat-card fi fi-d${i+1}`} onClick={() => setPage('products')}>
              <div className="cat-bg" style={{ background: c.bg }}/>
              <div className="cat-overlay"/>
              <div className="cat-arrow">↗</div>
              <div className="cat-info">
                <div style={{ fontSize:'2.5rem', marginBottom:8 }}>{c.icon}</div>
                <div className="cat-name">{c.name}</div>
                <div className="cat-count">{c.count}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="section fi" style={{ background: T.lightGray, maxWidth:'100%', padding:'120px 48px' }}>
        <div style={{ maxWidth:'1280px', margin:'0 auto' }}>
          <div className="section-center">
            <div className="section-label center">منتجاتنا</div>
            <h2 className="section-title">الكوليكشن الجديد</h2>
          </div>
          <div className="filter-tabs">
            {filters.map(f => (
              <button key={f} className={`filter-tab${filter===f?' active':''}`} onClick={() => setFilter(f)}>{f}</button>
            ))}
          </div>
          <div className="products-grid" style={{ marginTop: 48 }}>
            {filtered.map((p,i) => (
              <div key={p.id} className={`product-card fi fi-d${(i%4)+1}`}>
                <div className="product-img">
                  <div className="product-img-placeholder">
                    <span className="product-icon">{p.icon}</span>
                  </div>
                  {p.badge && <div className={`product-badge${p.badgeType==='new'?' new':''}`}>{p.badge}</div>}
                  <button className="product-wishlist">♡</button>
                  <div className="product-overlay">
                    <button className="product-wa-btn" onClick={() => window.open(wa(`استفسار عن: ${p.name}`),'_blank')}>
                      💬 استفسر الآن
                    </button>
                  </div>
                </div>
                <div className="product-info">
                  <div className="product-name">{p.name}</div>
                  <div className="product-price">اسأل عن السعر</div>
                  <div className="product-stars">{[...Array(5)].map((_,j) => <span key={j} className="star">★</span>)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROMO BANNER */}
      <div style={{ padding:'0 48px', margin:'120px 0' }}>
        <div className="promo-banner fi">
          <div className="promo-bg-text">H&A</div>
          <div className="promo-content">
            <span className="promo-label">عرض خاص</span>
            <h2 className="promo-title">اكتشف <span className="gold">الكوليكشن</span><br/>الجديد دلوقتي</h2>
            <button className="btn-primary" onClick={() => window.open(wa('مرحباً! عايز أعرف عن العروض الجديدة'),'_blank')}>
              تواصل معانا 💬
            </button>
          </div>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:'8rem', opacity:0.3 }}>👔</div>
          </div>
        </div>
      </div>

      {/* STORY */}
      <section className="section">
        <div className="story-grid">
          <div className="story-visual fi">
            <div className="story-monogram">H&A</div>
            <div className="story-gold-accent"/>
            <div className="story-badge">
              <span>15+</span>
              سنة خبرة
            </div>
          </div>
          <div className="fi fi-d2">
            <div className="section-label">قصتنا</div>
            <h2 className="section-title">من المرج للقاهرة</h2>
            <p className="story-quote">
              نحن لا نبيع ملابس — نبيع ثقة الرجل في إطلالته وشعوره بالأناقة كل يوم
            </p>
            <p style={{ fontSize:'0.95rem', color:T.textGray, lineHeight:1.8, fontWeight:300 }}>
              بدأنا بحلم بسيط: نوصّل الموضة الرجالية العصرية بجودة عالية لكل رجل في المرج وما حوله.
              اليوم بعد أكثر من ١٥ سنة، أصبحنا الوجهة الأولى للرجل العصري.
            </p>
            <div className="story-features">
              {[['🏆','جودة مضمونة','نختار كل منتج بعناية فائقة'],['💰','أسعار مناسبة','موضة عالمية بأسعار في متناول الجميع'],['📍','فرعين في المرج','خدمة قريبة منك دايماً']].map(([ic,t,d]) => (
                <div key={t} className="story-feature">
                  <div className="story-feature-icon">{ic}</div>
                  <div className="story-feature-text"><strong>{t}</strong>{d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section fi" style={{ background: T.lightGray, maxWidth:'100%', padding:'120px 48px' }}>
        <div style={{ maxWidth:'1280px', margin:'0 auto' }}>
          <div className="section-center fi">
            <div className="section-label center">لماذا H&A؟</div>
            <h2 className="section-title">مميزاتنا</h2>
          </div>
          <div className="features-grid">
            {[['⭐','جودة عالية','منتجات مختارة بعناية من أفضل الموردين'],['💎','أسعار منافسة','موضة عصرية بأسعار في متناول الجميع'],['📦','تشكيلة واسعة','أكثر من ١٠٠ موديل متنوع في كل وقت'],['😊','خدمة مميزة','فريق متخصص لمساعدتك في الاختيار']].map(([ic,t,d],i) => (
              <div key={t} className={`feature-card fi fi-d${i+1}`}>
                <div className="feature-icon">{ic}</div>
                <div className="feature-name">{t}</div>
                <div className="feature-desc">{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="section">
        <div className="section-center fi">
          <div className="section-label center">آراء عملاءنا</div>
          <h2 className="section-title">بيتكلموا عننا</h2>
        </div>
        <div className="reviews-grid">
          {REVIEWS.map((r,i) => (
            <div key={r.id} className={`review-card fi fi-d${i+1}`}>
              <div className="review-quote-icon">"</div>
              <div className="review-stars">{[...Array(5)].map((_,j) => <span key={j} className="star">★</span>)}</div>
              <p className="review-text">"{r.text}"</p>
              <div className="review-author">
                <div className="review-avatar">{r.init}</div>
                <div>
                  <div className="review-name">{r.name}</div>
                  <div className="review-date">{r.date}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <div className="newsletter fi">
        <div className="section-label center" style={{ color:T.gold, justifyContent:'center' }}>تواصل معنا</div>
        <h2 className="newsletter-title">مش لاقي إطلالتك؟</h2>
        <p className="newsletter-sub">كلمنا على واتساب وهنساعدك تلاقي اللي يناسبك</p>
        <a className="newsletter-cta" href={wa('مرحباً H&A! عايز تساعدني أختار الإطلالة المناسبة')} target="_blank" rel="noreferrer">
          💬 تكلم معانا دلوقتي
        </a>
      </div>
    </div>
  );
}

function ProductsPage() {
  useFadeIn();
  const [filter, setFilter] = useState('الكل');
  const filters = ['الكل','تيشيرتات','قمصان','بناطيل','جاكيتات'];
  const filtered = filter === 'الكل' ? PRODUCTS : PRODUCTS.filter(p => p.cat === filter);

  return (
    <div className="page" style={{ paddingTop:'var(--nav-h)', background: T.white }}>
      <div style={{ padding:'80px 48px 40px', background: T.lightGray, borderBottom:`1px solid ${T.border}` }}>
        <div className="section-label fi">كوليكشن H&A</div>
        <h1 className="section-title fi">جميع المنتجات</h1>
      </div>
      <section style={{ padding:'60px 48px', maxWidth:1440, margin:'0 auto' }}>
        <div className="filter-tabs" style={{ justifyContent:'flex-start' }}>
          {filters.map(f => (
            <button key={f} className={`filter-tab${filter===f?' active':''}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
        <div className="products-grid" style={{ marginTop: 40 }}>
          {filtered.map((p,i) => (
            <div key={p.id} className={`product-card fi fi-d${(i%4)+1}`}>
              <div className="product-img">
                <div className="product-img-placeholder"><span className="product-icon">{p.icon}</span></div>
                {p.badge && <div className={`product-badge${p.badgeType==='new'?' new':''}`}>{p.badge}</div>}
                <button className="product-wishlist">♡</button>
                <div className="product-overlay">
                  <button className="product-wa-btn" onClick={() => window.open(wa(`استفسار عن: ${p.name}`),'_blank')}>
                    💬 استفسر
                  </button>
                </div>
              </div>
              <div className="product-info">
                <div className="product-name">{p.name}</div>
                <div className="product-price">اسأل عن السعر</div>
                <div className="product-stars">{[...Array(5)].map((_,j) => <span key={j} className="star">★</span>)}</div>
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
      <div style={{ padding:'80px 48px 40px', background: T.lightGray, borderBottom:`1px solid ${T.border}` }}>
        <div className="section-label fi">من نحن</div>
        <h1 className="section-title fi">قصة H&A Fashion</h1>
      </div>
      <section className="section" style={{ maxWidth:800 }}>
        <div style={{ display:'flex', flexDirection:'column', gap:48 }}>
          {[
            ['البداية','في عام ٢٠٢٠، قرر أحمد وحمادة حشم أن يغيّرا مشهد الموضة الرجالية في منطقة المرج. كانت فكرتهم بسيطة لكن طموحة: مكان واحد يجمع كل ما يحتاجه الرجل العصري من ملابس عالية الجودة بأسعار في متناول الجميع.'],
            ['اليوم','اليوم، H&A Fashion أصبحت اسماً راسخاً في المنطقة. بفرعين في قلب المرج، نخدم مئات العملاء يومياً ونوفّر أحدث صيحات الموضة الرجالية من تيشيرتات وقمصان وبناطيل وجاكيتات وإكسسوارات.'],
            ['رؤيتنا','نؤمن أن الإطلالة الجيدة ليست رفاهية — هي حق لكل رجل. ولذلك نعمل كل يوم على جلب أفضل المنتجات وتقديم تجربة تسوق استثنائية.'],
          ].map(([t,d],i) => (
            <div key={t} className={`fi fi-d${i+1}`}>
              <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:16 }}>
                <div style={{ width:4, height:32, background:T.gold, borderRadius:2 }}/>
                <h3 style={{ fontSize:'1.3rem', fontWeight:800, color:T.navy }}>{t}</h3>
              </div>
              <p style={{ fontSize:'0.95rem', color:T.textGray, lineHeight:1.9, fontWeight:300, paddingRight:20 }}>{d}</p>
            </div>
          ))}
          <div className="fi" style={{ display:'flex', gap:32, background:T.lightGray, padding:36, borderRadius:20, flexWrap:'wrap' }}>
            {[['أحمد عمار','الإدارة والمالية'],['حمادة حشم','المشتريات والتشغيل']].map(([n,r]) => (
              <div key={n}>
                <div style={{ fontSize:'1rem', fontWeight:700, color:T.navy, marginBottom:4 }}>{n}</div>
                <div style={{ fontSize:'0.78rem', color:T.gold, letterSpacing:'0.15em', fontFamily:'var(--font-en)' }}>{r.toUpperCase()}</div>
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
      <div style={{ padding:'80px 48px 40px', background: T.lightGray, borderBottom:`1px solid ${T.border}` }}>
        <div className="section-label fi">موقعنا</div>
        <h1 className="section-title fi">فروعنا</h1>
        <p className="section-sub fi">زورنا في أي من فرعينا بالمرج، القاهرة</p>
      </div>
      <section className="section">
        <div className="stores-grid">
          {[
            { n:'01', badge:'فرع رقم ١', name:'فرع المحطة', addr:'جنب محطة مترو المرج القديمة الشرقية، بجوار مطعم ملك الكبدة', hours:'٣ العصر — ٢ الليل (يومياً)', note:'قريب من الميدان الرئيسي' },
            { n:'02', badge:'فرع رقم ٢', name:'فرع الأنابيب', addr:'شارع مكازن الأنابيب بجانب شارع محمد نجيب، بالقرب من صيدلية الدكتور أيمن', hours:'٣ العصر — ٢ الليل (يومياً)', note:'في قلب حي الأنابيب' },
          ].map(s => (
            <div key={s.n} className="store-card fi">
              <div className="store-card-accent"/>
              <div className="store-num">{s.n}</div>
              <div className="store-badge">{s.badge}</div>
              <div className="store-name">{s.name}</div>
              <div className="store-detail"><span className="store-detail-icon">📍</span><span className="store-detail-text">{s.addr}</span></div>
              <div className="store-detail"><span className="store-detail-icon">🕐</span><span className="store-detail-text"><strong>{s.hours}</strong></span></div>
              <div className="store-detail"><span className="store-detail-icon">📌</span><span className="store-detail-text">{s.note}</span></div>
              <a className="store-btn" href={wa(`مرحباً! عايز أيجي ${s.name}`)} target="_blank" rel="noreferrer">
                💬 تواصل معنا
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ContactPage() {
  useFadeIn();
  return (
    <div className="page" style={{ paddingTop:'var(--nav-h)' }}>
      <div style={{ padding:'80px 48px 40px', background: T.lightGray, borderBottom:`1px solid ${T.border}` }}>
        <div className="section-label fi">تواصل معنا</div>
        <h1 className="section-title fi">نحن هنا لك</h1>
      </div>
      <section className="section" style={{ maxWidth:700 }}>
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {[
            { icon:'💬', label:'واتساب', val:'01010422018', link: wa('مرحباً H&A!') },
            { icon:'📸', label:'انستجرام', val:'@ha_storree', link:'https://instagram.com/ha_storree' },
            { icon:'🎵', label:'تيك توك', val:'@ha_lll1', link:'https://tiktok.com/@ha_lll1' },
            { icon:'🕐', label:'مواعيد العمل', val:'٣ العصر — ٢ الليل — يومياً', link:null },
          ].map((item,i) => (
            <div key={i} className={`fi fi-d${i+1}`} style={{
              display:'flex', alignItems:'center', gap:20,
              padding:'24px 28px', background:T.white,
              borderRadius:T.radiusSm || 16,
              border:`1px solid ${T.border}`, boxShadow:T.shadow
            }}>
              <span style={{ fontSize:'1.5rem', width:48, textAlign:'center' }}>{item.icon}</span>
              <div>
                <div style={{ fontSize:'0.7rem', color:T.gold, letterSpacing:'0.2em', fontFamily:'var(--font-en)', marginBottom:4, fontWeight:700 }}>{item.label.toUpperCase()}</div>
                {item.link
                  ? <a href={item.link} target="_blank" rel="noreferrer" style={{ color:T.navy, textDecoration:'none', fontSize:'1rem', fontWeight:600 }}>{item.val}</a>
                  : <span style={{ color:T.navy, fontSize:'1rem', fontWeight:600 }}>{item.val}</span>
                }
              </div>
            </div>
          ))}
        </div>
        <div className="fi" style={{ marginTop:40 }}>
          <a href={wa('مرحباً H&A! عندي سؤال...')} target="_blank" rel="noreferrer" className="btn-primary">
            💬 ابدأ محادثة على واتساب
          </a>
        </div>
      </section>
    </div>
  );
}

function Footer({ setPage }) {
  const go = (k) => { setPage(k); window.scrollTo(0,0); };
  return (
    <footer>
      <div className="footer-grid">
        <div>
          <div className="footer-logo">H&A</div>
          <p className="footer-desc">ملابس رجالية عصرية بجودة عالية وأسعار مناسبة. فرعين في قلب المرج، القاهرة.</p>
          <div className="footer-social">
            <a className="footer-social-btn" href="https://instagram.com/ha_storree" target="_blank" rel="noreferrer">IG</a>
            <a className="footer-social-btn" href="https://tiktok.com/@ha_lll1" target="_blank" rel="noreferrer">TK</a>
            <a className="footer-social-btn" href={wa('مرحباً!')} target="_blank" rel="noreferrer">WA</a>
          </div>
        </div>
        <div>
          <div className="footer-col-title">الموقع</div>
          <ul className="footer-links">
            {[['الرئيسية','home'],['المنتجات','products'],['قصتنا','story'],['فروعنا','stores'],['تواصل','contact']].map(([l,k]) => (
              <li key={k}><a onClick={() => go(k)}>{l}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <div className="footer-col-title">التصنيفات</div>
          <ul className="footer-links">
            {['تيشيرتات','قمصان','بناطيل','جاكيتات'].map(c => (
              <li key={c}><a onClick={() => go('products')}>{c}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <div className="footer-col-title">تواصل</div>
          <ul className="footer-links">
            <li><a href={wa('مرحباً!')} target="_blank" rel="noreferrer">01010422018</a></li>
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

/* ROOT */
export default function App() {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 1500); return () => clearTimeout(t); }, []);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive:true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const renderPage = () => {
    switch(page) {
      case 'home':     return <HomePage setPage={setPage}/>;
      case 'products': return <ProductsPage/>;
      case 'story':    return <StoryPage/>;
      case 'stores':   return <StoresPage/>;
      case 'contact':  return <ContactPage/>;
      default:         return <HomePage setPage={setPage}/>;
    }
  };

  return (
    <>
      <style>{globalCSS}</style>
      <div className={`loading${loading?'':' out'}`}>
        <div className="loading-logo">H&A</div>
      </div>
      <Nav page={page} setPage={setPage} scrolled={scrolled}/>
      <main>{renderPage()}<Footer setPage={setPage}/></main>
      <FloatingWA/>
      <Chatbot open={chatOpen} setOpen={setChatOpen}/>
    </>
  );
}
