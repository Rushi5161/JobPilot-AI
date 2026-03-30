import React, { useEffect, useRef, useState } from "react";
import "./LandingPage.scss";

const NAV_LINKS = ["Features", "How It Works", "Tech Stack", "About"];

const FEATURES = [
  {
    icon: "◈",
    title: "AI Resume Analyzer",
    desc: "Google Gemini AI dissects your resume against job descriptions — spotting every gap before recruiters do.",
    tag: "Gemini AI",
  },
  {
    icon: "⬡",
    title: "ATS Optimizer",
    desc: "Auto-generates ATS-friendly resumes tailored to each role, maximizing your shortlist probability.",
    tag: "Smart Parsing",
  },
  {
    icon: "◉",
    title: "Skill Gap Radar",
    desc: "Visual skill gap reports map exactly what you're missing — and what to learn next.",
    tag: "Gap Analysis",
  },
  {
    icon: "⬖",
    title: "Interview Generator",
    desc: "Curated interview questions based on your target role, generated from real job postings.",
    tag: "Prep Engine",
  },
  {
    icon: "◫",
    title: "Secure Dashboard",
    desc: "JWT-authenticated personal dashboard stores your history, uploads, and progress across sessions.",
    tag: "JWT Auth",
  },
  {
    icon: "◬",
    title: "Job Scraper Engine",
    desc: "Puppeteer-powered scraper pulls live job data for real-time comparisons against your profile.",
    tag: "Puppeteer",
  },
];

const STEPS = [
  { num: "01", title: "Upload Resume", desc: "Drop your PDF or DOCX. Our parser extracts skills, roles, and experience instantly." },
  { num: "02", title: "Paste Job Description", desc: "Paste any job listing. Gemini AI maps your profile against the requirements." },
  { num: "03", title: "Get Your Readiness Score", desc: "Instant gap analysis, ATS score, and a tailored interview question bank." },
  { num: "04", title: "Land the Interview", desc: "Download your optimized resume and walk in prepared. JobPilot handles the rest." },
];

const STACK = [
  { name: "React", color: "#61DAFB" },
  { name: "Node.js", color: "#84CC16" },
  { name: "Gemini AI", color: "#F59E0B" },
  { name: "Puppeteer", color: "#40C057" },
  { name: "JWT Auth", color: "#A78BFA" },
  { name: "MongoDB", color: "#10B981" },
  { name: "Express.js", color: "#F97316" },
  { name: "REST API", color: "#38BDF8" },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const heroRef = useRef(null);
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animFrameRef = useRef(null);

  // Navbar scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Canvas particle grid
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      const cols = Math.floor(canvas.width / 80);
      const rows = Math.floor(canvas.height / 80);
      particlesRef.current = [];
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          particlesRef.current.push({
            x: i * 80 + 40,
            y: j * 80 + 40,
            baseX: i * 80 + 40,
            baseY: j * 80 + 40,
            size: Math.random() * 1.2 + 0.3,
            opacity: Math.random() * 0.25 + 0.05,
            speed: Math.random() * 0.008 + 0.003,
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
    };

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.005;
      particlesRef.current.forEach((p) => {
        p.opacity = 0.05 + Math.abs(Math.sin(t * p.speed * 100 + p.phase)) * 0.2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139,92,246,${p.opacity})`;
        ctx.fill();
      });
      animFrameRef.current = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Intersection observer for fade-in
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div className="lp">
      {/* ── NAVBAR ── */}
      <nav className={`lp__nav ${scrolled ? "lp__nav--scrolled" : ""}`}>
        <div className="lp__nav-inner">
          <a className="lp__logo" href="#">
            {/* <span className="lp__logo-icon">✦</span> */}
            JobPilot<span className="lp__logo-accent"> AI</span>
          </a>

          <ul className={`lp__nav-links ${menuOpen ? "lp__nav-links--open" : ""}`}>
            {NAV_LINKS.map((l) => (
              <li key={l}>
                <button onClick={() => scrollTo(l.toLowerCase().replace(/\s/g, "-"))}>
                  {l}
                </button>
              </li>
            ))}
          </ul>

          <div className="lp__nav-cta">
            <a href="/login" className="lp__btn lp__btn--ghost">Login</a>
            <a href="/register" className="lp__btn lp__btn--primary">Get Started</a>
          </div>

          <button className={`lp__hamburger ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(!menuOpen)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="lp__hero" ref={heroRef} id="hero">
        <canvas className="lp__canvas" ref={canvasRef} />

        <div className="lp__hero-glow lp__hero-glow--1" />
        <div className="lp__hero-glow lp__hero-glow--2" />

        <div className="lp__hero-content">
          <div className="lp__hero-badge">
            <span className="lp__badge-dot" />
            Powered by Google Gemini AI
          </div>

          <h1 className="lp__hero-title">
            Your Career,<br />
            <span className="lp__hero-gradient">Co-Piloted</span><br />
            by AI.
          </h1>

          <p className="lp__hero-sub">
            Upload your resume. Paste a job description. JobPilot AI identifies every skill gap,
            generates an ATS-ready resume, and arms you with interview questions — in seconds.
          </p>

          <div className="lp__hero-actions">
            <a href="/register" className="lp__btn lp__btn--primary lp__btn--lg">
              Start for Free <span className="lp__btn-arrow">→</span>
            </a>
            <button className="lp__btn lp__btn--ghost lp__btn--lg" onClick={() => scrollTo("how-it-works")}>
              See How It Works
            </button>
          </div>

          <div className="lp__hero-stats">
            <div className="lp__stat">
              <strong>6</strong><span>AI Features</span>
            </div>
            <div className="lp__stat-divider" />
            <div className="lp__stat">
              <strong>ATS</strong><span>Optimized</span>
            </div>
            <div className="lp__stat-divider" />
            <div className="lp__stat">
              <strong>JWT</strong><span>Secure Auth</span>
            </div>
          </div>
        </div>

        <div className="lp__hero-visual">
          <div className="lp__card-float lp__card-float--main">
            <div className="lp__card-header">
              <span className="lp__card-dot red" /><span className="lp__card-dot yellow" /><span className="lp__card-dot green" />
              <span className="lp__card-title">Resume Analysis</span>
            </div>
            <div className="lp__card-body">
              <div className="lp__score-ring">
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" className="lp__ring-bg" />
                  <circle cx="50" cy="50" r="42" className="lp__ring-fill" strokeDasharray="226" strokeDashoffset="45" />
                </svg>
                <div className="lp__score-text"><strong>82</strong><span>ATS Score</span></div>
              </div>
              <div className="lp__skill-bars">
                {[["React", 90], ["Node.js", 85], ["Python", 55], ["Docker", 30]].map(([s, v]) => (
                  <div className="lp__skill-bar" key={s}>
                    <span>{s}</span>
                    <div className="lp__bar-track">
                      <div className="lp__bar-fill" style={{ "--w": `${v}%` }} />
                    </div>
                    <span className="lp__bar-pct">{v}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lp__card-float lp__card-float--badge">
            <span>✦</span> Skill Gap Detected
          </div>

          <div className="lp__card-float lp__card-float--questions">
            <p className="lp__q-label">Interview Q</p>
            <p className="lp__q-text">"Describe your experience with microservices architecture..."</p>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="lp__features" id="features">
        <div className="lp__container">
          <div className="lp__section-head reveal">
            <span className="lp__section-tag">Features</span>
            <h2>Everything you need to<br /><em>land the role.</em></h2>
            <p>Six AI-powered modules, one unified platform.</p>
          </div>

          <div className="lp__features-grid">
            {FEATURES.map((f, i) => (
              <div className={`lp__feature-card reveal`} key={f.title} style={{ "--delay": `${i * 0.08}s` }}>
                <div className="lp__feature-icon">{f.icon}</div>
                <span className="lp__feature-tag">{f.tag}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                <div className="lp__feature-line" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="lp__how" id="how-it-works">
        <div className="lp__container">
          <div className="lp__section-head reveal">
            <span className="lp__section-tag">Process</span>
            <h2>Four steps to<br /><em>interview-ready.</em></h2>
          </div>

          <div className="lp__steps">
            {STEPS.map((s, i) => (
              <div className="lp__step reveal" key={s.num} style={{ "--delay": `${i * 0.1}s` }}>
                <div className="lp__step-num">{s.num}</div>
                <div className="lp__step-content">
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
                {i < STEPS.length - 1 && <div className="lp__step-connector" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECH STACK ── */}
      <section className="lp__tech" id="tech-stack">
        <div className="lp__container">
          <div className="lp__section-head reveal">
            <span className="lp__section-tag">Tech Stack</span>
            <h2>Built with the<br /><em>right tools.</em></h2>
          </div>

          <div className="lp__tech-grid reveal">
            {STACK.map((t) => (
              <div className="lp__tech-pill" key={t.name} style={{ "--accent": t.color }}>
                <span className="lp__tech-dot" />
                {t.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="lp__cta" id="about">
        <div className="lp__container">
          <div className="lp__cta-box reveal">
            <div className="lp__cta-glow" />
            <span className="lp__section-tag">Get Started</span>
            <h2>Ready to <em>pilot</em> your career?</h2>
            <p>
              Join the platform built for serious job seekers. No fluff —<br />
              just AI-powered clarity on what you need to get hired.
            </p>
            <div className="lp__cta-actions">
              <a href="/register" className="lp__btn lp__btn--primary lp__btn--lg">
                Create Free Account <span className="lp__btn-arrow">→</span>
              </a>
              <a href="/login" className="lp__btn lp__btn--ghost lp__btn--lg">
                Already have an account?
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="lp__footer">
        <div className="lp__container">
          <div className="lp__footer-inner">
            <a className="lp__logo" href="#">
              <span className="lp__logo-icon">✦</span>
              JobPilot<span className="lp__logo-accent"> AI</span>
            </a>
            <p>A full-stack GenAI project built with React, Node.js & Gemini AI.</p>
            <div className="lp__footer-links">
              <a href="/login">Login</a>
              <a href="/register">Register</a>
            </div>
          </div>
          <div className="lp__footer-bottom">
            <span>© 2025 JobPilot AI — Designed & developed with care.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}