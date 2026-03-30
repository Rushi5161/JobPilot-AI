import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../pages/LandingPage.scss";

const NAV_LINKS = ["Features", "How It Works", "Tech Stack", "About"];

export const AuthNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <nav className={`lp__nav ${scrolled ? "lp__nav--scrolled" : ""}`}>
      <div className="lp__nav-inner">
        <Link className="lp__logo" to="/">
          JobPilot<span className="lp__logo-accent"> AI</span>
        </Link>

        <ul className={`lp__nav-links ${menuOpen ? "lp__nav-links--open" : ""}`}>
          {NAV_LINKS.map((item) => (
            <li key={item}>
              <button type="button" onClick={() => scrollTo(item.toLowerCase().replace(/\s/g, "-"))}>
                {item}
              </button>
            </li>
          ))}
        </ul>

        <div className="lp__nav-cta">
          <Link to="/login" className="lp__btn lp__btn--ghost">
            Login
          </Link>
          <Link to="/register" className="lp__btn lp__btn--primary">
            Get Started
          </Link>
        </div>

        <button className={`lp__hamburger ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(!menuOpen)}>
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
};
