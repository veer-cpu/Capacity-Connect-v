import React from "react";

import {
  LuBookOpen,
  LuUsersRound,
  LuLightbulb,
  LuHeart,
  LuArrowUpRight,
} from "react-icons/lu";

import "./WelcomeSection.css";

import { useNavigate } from "react-router-dom";

const WelcomeSection = () => {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const trainerName = storedUser?.name || "Trainer";
  const currentDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <section className="trainer-welcome">
      {/* =====================================================
          BACKGROUND DECORATION
      ===================================================== */}

      <div className="trainer-welcome-glow trainer-welcome-glow-one"></div>
      <div className="trainer-welcome-glow trainer-welcome-glow-two"></div>

      {/* =====================================================
          LEFT CONTENT
      ===================================================== */}

      <div className="trainer-welcome-content">
        {/* Date */}
        <p className="trainer-welcome-date">{currentDateStr}</p>

        {/* Greeting */}
        <h1 className="trainer-welcome-title">
          Good Morning, {trainerName}!
          <span className="trainer-welcome-wave">👋</span>
        </h1>

        {/* Description */}
        <p className="trainer-welcome-description">
          Here's what's happening with your training programs today.
        </p>

        {/* =================================================
            TRAINER VALUES
        ================================================= */}

        <div className="trainer-welcome-values">
          {/* Teach */}
          <div className="trainer-welcome-value value-blue">
            <span className="trainer-welcome-value-icon">
              <LuBookOpen />
            </span>

            <span>Teach</span>
          </div>

          {/* Guide */}
          <div className="trainer-welcome-value value-green">
            <span className="trainer-welcome-value-icon">
              <LuUsersRound />
            </span>

            <span>Guide</span>
          </div>

          {/* Inspire */}
          <div className="trainer-welcome-value value-yellow">
            <span className="trainer-welcome-value-icon">
              <LuLightbulb />
            </span>

            <span>Inspire</span>
          </div>

          {/* Make an Impact */}
          <div className="trainer-welcome-value value-pink">
            <span className="trainer-welcome-value-icon">
              <LuHeart />
            </span>

            <span>Make an Impact</span>
          </div>
        </div>
      </div>

      {/* =====================================================
          RIGHT QUOTE AREA
      ===================================================== */}

      <div className="trainer-welcome-quote-area">
        {/* Decorative image-like glass panel */}
        <div className="trainer-welcome-visual">
          <div className="trainer-welcome-visual-glow"></div>

          <div className="trainer-welcome-orbit orbit-one"></div>
          <div className="trainer-welcome-orbit orbit-two"></div>

          <div className="trainer-welcome-visual-dot dot-one"></div>
          <div className="trainer-welcome-visual-dot dot-two"></div>
          <div className="trainer-welcome-visual-dot dot-three"></div>
        </div>

        {/* Quote */}
        <div className="trainer-welcome-quote">
          <span className="trainer-quote-mark">“</span>

          <p>
            Empowering learners
            <br />
            today for a resilient tomorrow.
          </p>

          <div className="trainer-quote-line">
            <span></span>
          </div>
        </div>
      </div>

      {/* =====================================================
          SMALL ACTION
      ===================================================== */}

      <button
        type="button"
        className="trainer-welcome-action"
        aria-label="Open trainer courses"
        onClick={() => navigate('/trainer/trainer-courses')}
      >
        <LuArrowUpRight />
      </button>
    </section>
  );
};

export default WelcomeSection;
