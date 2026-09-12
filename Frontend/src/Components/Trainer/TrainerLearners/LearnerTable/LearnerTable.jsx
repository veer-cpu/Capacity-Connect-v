import React, { useEffect, useRef, useState } from "react";

import {
  LuCheck,
  LuChevronLeft,
  LuChevronRight,
  LuClock3,
  LuEllipsis,
  LuEye,
  LuMail,
  LuMessageCircle,
  LuTrash2,
  LuUserRound,
} from "react-icons/lu";

import "./LearnerTable.css";

/* =========================================================
   LEARNER DATA
========================================================= */

export const defaultLearners = [];

/* =========================================================
   COMPONENT
========================================================= */

const LearnerTable = ({ learners = defaultLearners, viewMode = "list" }) => {
  const [selectedLearners, setSelectedLearners] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);

  const menuRefs = useRef({});

  /* =======================================================
     CLOSE ACTION MENU ON OUTSIDE CLICK
  ======================================================= */

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!openMenu) return;

      const menuElement = menuRefs.current[openMenu];

      if (menuElement && !menuElement.contains(event.target)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [openMenu]);

  /* =======================================================
     SELECT SINGLE LEARNER
  ======================================================= */

  const handleSelectLearner = (id) => {
    setSelectedLearners((previous) =>
      previous.includes(id)
        ? previous.filter((learnerId) => learnerId !== id)
        : [...previous, id],
    );
  };

  /* =======================================================
     SELECT ALL
  ======================================================= */

  const handleSelectAll = () => {
    if (learners.length > 0 && selectedLearners.length === learners.length) {
      setSelectedLearners([]);
    } else {
      setSelectedLearners(learners.map((learner) => learner.id));
    }
  };

  /* =======================================================
     VIEW PROFILE
  ======================================================= */

  const handleViewLearner = (learner) => {
    setOpenMenu(null);
  };

  /* =======================================================
     MESSAGE
  ======================================================= */

  const handleMessageLearner = (learner) => {
    setOpenMenu(null);
  };

  /* =======================================================
     REMOVE
  ======================================================= */

  const handleRemoveLearner = (learner) => {
    setOpenMenu(null);
  };

  /* =======================================================
     PROGRESS COLOR
  ======================================================= */

  const getProgressClass = (progress) => {
    if (progress >= 80) {
      return "progress-high";
    }

    if (progress >= 60) {
      return "progress-medium";
    }

    return "progress-low";
  };

  /* =======================================================
     STATUS CLASS
  ======================================================= */

  const getStatusClass = (status) => {
    if (status === "Active") {
      return "status-active";
    }

    if (status === "At Risk") {
      return "status-risk";
    }

    if (status === "Completed") {
      return "status-completed";
    }

    return "status-default";
  };

  /* =======================================================
     EMPTY STATE
  ======================================================= */

  const renderEmptyState = () => {
    return (
      <div className="learner-empty-state">
        <div className="empty-icon">
          <LuUserRound size={20} strokeWidth={1.6} />
        </div>

        <h3>No learners found</h3>

        <p>Try changing your current filters.</p>
      </div>
    );
  };

  return (
    <section className="learner-table-section">
      {/* =====================================================
          SECTION HEADER
      ===================================================== */}

      <div className="learner-table-header">
        <div className="learner-table-heading">
          <div className="learner-table-heading-icon">
            <LuUserRound size={16} strokeWidth={1.8} />
          </div>

          <div>
            <h2>Learner List</h2>

            <p>View and manage learners enrolled in your courses.</p>
          </div>
        </div>

        {selectedLearners.length > 0 && (
          <div className="selected-count">
            <LuCheck size={13} strokeWidth={2} />

            <span>{selectedLearners.length} selected</span>
          </div>
        )}
      </div>

      {/* =====================================================
          LIST VIEW
      ===================================================== */}

      {viewMode === "list" && (
        <>
          {/* =================================================
              DESKTOP / TABLET TABLE
          ================================================= */}

          <div className="learner-table-wrapper">
            <table className="learner-table">
              <thead>
                <tr>
                  {/* Checkbox */}
                  <th className="checkbox-column">
                    <label className="custom-checkbox">
                      <input
                        type="checkbox"
                        checked={
                          learners.length > 0 &&
                          selectedLearners.length === learners.length
                        }
                        onChange={handleSelectAll}
                      />

                      <span className="checkbox-box">
                        <LuCheck size={11} strokeWidth={2.5} />
                      </span>
                    </label>
                  </th>

                  {/* Learner */}
                  <th className="learner-column">Learner</th>

                  {/* Course */}
                  <th className="course-column">Course</th>

                  {/* Progress */}
                  <th className="progress-column">Progress</th>

                  {/* Status */}
                  <th className="status-column">Status</th>

                  {/* Activity */}
                  <th className="activity-column">Last Activity</th>

                  {/* Actions */}
                  <th className="actions-column">Actions</th>
                </tr>
              </thead>

              <tbody>
                {learners.length > 0 ? (
                  learners.map((learner) => (
                    <tr key={learner.id}>
                      {/* ======================================
                          CHECKBOX
                      ====================================== */}

                      <td className="checkbox-column">
                        <label className="custom-checkbox">
                          <input
                            type="checkbox"
                            checked={selectedLearners.includes(learner.id)}
                            onChange={() => handleSelectLearner(learner.id)}
                          />

                          <span className="checkbox-box">
                            <LuCheck size={11} strokeWidth={2.5} />
                          </span>
                        </label>
                      </td>

                      {/* ======================================
                          LEARNER
                      ====================================== */}

                      <td className="learner-column">
                        <div className="learner-info">
                          <div className="learner-avatar">
                            <img src={learner.avatar} alt={learner.name} />
                          </div>

                          <div className="learner-name-block">
                            <button
                              type="button"
                              className="learner-name"
                              onClick={() => handleViewLearner(learner)}
                            >
                              {learner.name}
                            </button>

                            <span className="learner-email">
                              {learner.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* ======================================
                          COURSE
                      ====================================== */}

                      <td className="course-column">
                        <div className="course-cell">
                          <div className="course-icon">
                            <LuUserRound size={14} strokeWidth={1.7} />
                          </div>

                          <span>{learner.course}</span>
                        </div>
                      </td>

                      {/* ======================================
                          PROGRESS
                      ====================================== */}

                      <td className="progress-column">
                        <div className="progress-cell">
                          <div className="progress-track">
                            <div
                              className={`progress-fill ${getProgressClass(
                                learner.progress,
                              )}`}
                              style={{
                                width: `${learner.progress}%`,
                              }}
                            />
                          </div>

                          <span className="progress-value">
                            {learner.progress}%
                          </span>
                        </div>
                      </td>

                      {/* ======================================
                          STATUS
                      ====================================== */}

                      <td className="status-column">
                        <span
                          className={`learner-status ${getStatusClass(
                            learner.status,
                          )}`}
                        >
                          <span className="status-dot" />

                          {learner.status}
                        </span>
                      </td>

                      {/* ======================================
                          LAST ACTIVITY
                      ====================================== */}

                      <td className="activity-column">
                        <div className="activity-cell">
                          <LuClock3 size={14} strokeWidth={1.7} />

                          <span>{learner.lastActivity}</span>
                        </div>
                      </td>

                      {/* ======================================
                          ACTIONS
                      ====================================== */}

                      <td className="actions-column">
                        <div
                          className="learner-actions"
                          ref={(element) => {
                            menuRefs.current[learner.id] = element;
                          }}
                        >
                          {/* Email */}

                          <a
                            href={`mailto:${learner.email}`}
                            className="table-action-button"
                            title="Email learner"
                            aria-label={`Email ${learner.name}`}
                          >
                            <LuMail size={14} strokeWidth={1.8} />
                          </a>

                          {/* Message */}

                          <button
                            type="button"
                            className="table-action-button"
                            title="Message learner"
                            aria-label={`Message ${learner.name}`}
                            onClick={() => handleMessageLearner(learner)}
                          >
                            <LuMessageCircle size={14} strokeWidth={1.8} />
                          </button>

                          {/* More */}

                          <button
                            type="button"
                            className={`table-action-button ${
                              openMenu === learner.id ? "active" : ""
                            }`}
                            title="More actions"
                            aria-label={`More actions for ${learner.name}`}
                            onClick={() =>
                              setOpenMenu((previous) =>
                                previous === learner.id ? null : learner.id,
                              )
                            }
                          >
                            <LuEllipsis size={16} strokeWidth={1.8} />
                          </button>

                          {/* Dropdown */}

                          {openMenu === learner.id && (
                            <div className="learner-action-menu">
                              <button
                                type="button"
                                onClick={() => handleViewLearner(learner)}
                              >
                                <LuEye size={14} strokeWidth={1.8} />

                                <span>View profile</span>
                              </button>

                              <a
                                href={`mailto:${learner.email}`}
                                onClick={() => setOpenMenu(null)}
                              >
                                <LuMail size={14} strokeWidth={1.8} />

                                <span>Send email</span>
                              </a>

                              <button
                                type="button"
                                className="danger-action"
                                onClick={() => handleRemoveLearner(learner)}
                              >
                                <LuTrash2 size={14} strokeWidth={1.8} />

                                <span>Remove learner</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">{renderEmptyState()}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* =================================================
              MOBILE LIST
          ================================================= */}

          <div className="learner-mobile-list">
            {learners.length > 0
              ? learners.map((learner) => (
                  <article className="learner-mobile-card" key={learner.id}>
                    {/* Top */}

                    <div className="mobile-card-top">
                      <label className="custom-checkbox">
                        <input
                          type="checkbox"
                          checked={selectedLearners.includes(learner.id)}
                          onChange={() => handleSelectLearner(learner.id)}
                        />

                        <span className="checkbox-box">
                          <LuCheck size={11} strokeWidth={2.5} />
                        </span>
                      </label>

                      <div className="learner-info">
                        <div className="learner-avatar">
                          <img src={learner.avatar} alt={learner.name} />
                        </div>

                        <div className="learner-name-block">
                          <button
                            type="button"
                            className="learner-name"
                            onClick={() => handleViewLearner(learner)}
                          >
                            {learner.name}
                          </button>

                          <span className="learner-email">{learner.email}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="mobile-more-button"
                        aria-label={`More actions for ${learner.name}`}
                        onClick={() =>
                          setOpenMenu((previous) =>
                            previous === learner.id ? null : learner.id,
                          )
                        }
                      >
                        <LuEllipsis size={17} strokeWidth={1.8} />
                      </button>
                    </div>

                    {/* Course */}

                    <div className="mobile-card-row">
                      <span className="mobile-label">Course</span>

                      <div className="course-cell">
                        <div className="course-icon">
                          <LuUserRound size={13} strokeWidth={1.7} />
                        </div>

                        <span>{learner.course}</span>
                      </div>
                    </div>

                    {/* Progress */}

                    <div className="mobile-card-row">
                      <div className="mobile-progress-heading">
                        <span className="mobile-label">Progress</span>

                        <strong>{learner.progress}%</strong>
                      </div>

                      <div className="progress-track">
                        <div
                          className={`progress-fill ${getProgressClass(
                            learner.progress,
                          )}`}
                          style={{
                            width: `${learner.progress}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Bottom */}

                    <div className="mobile-card-bottom">
                      <span
                        className={`learner-status ${getStatusClass(
                          learner.status,
                        )}`}
                      >
                        <span className="status-dot" />

                        {learner.status}
                      </span>

                      <div className="activity-cell">
                        <LuClock3 size={13} strokeWidth={1.7} />

                        <span>{learner.lastActivity}</span>
                      </div>
                    </div>

                    {/* Mobile Actions */}

                    {openMenu === learner.id && (
                      <div className="mobile-action-menu">
                        <button
                          type="button"
                          onClick={() => handleViewLearner(learner)}
                        >
                          <LuEye size={14} />
                          View profile
                        </button>

                        <a
                          href={`mailto:${learner.email}`}
                          onClick={() => setOpenMenu(null)}
                        >
                          <LuMail size={14} />
                          Send email
                        </a>

                        <button
                          type="button"
                          className="danger-action"
                          onClick={() => handleRemoveLearner(learner)}
                        >
                          <LuTrash2 size={14} />
                          Remove learner
                        </button>
                      </div>
                    )}
                  </article>
                ))
              : renderEmptyState()}
          </div>
        </>
      )}

      {/* =====================================================
          GRID VIEW
      ===================================================== */}

      {viewMode === "grid" && (
        <div className="learner-grid">
          {learners.length > 0
            ? learners.map((learner) => (
                <article className="learner-grid-card" key={learner.id}>
                  {/* =========================================
                      GRID CARD HEADER
                  ========================================= */}

                  <div className="grid-card-header">
                    <label className="custom-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedLearners.includes(learner.id)}
                        onChange={() => handleSelectLearner(learner.id)}
                      />

                      <span className="checkbox-box">
                        <LuCheck size={11} strokeWidth={2.5} />
                      </span>
                    </label>

                    <div
                      className="grid-card-actions"
                      ref={(element) => {
                        menuRefs.current[learner.id] = element;
                      }}
                    >
                      <button
                        type="button"
                        className={`table-action-button ${
                          openMenu === learner.id ? "active" : ""
                        }`}
                        title="More actions"
                        aria-label={`More actions for ${learner.name}`}
                        onClick={() =>
                          setOpenMenu((previous) =>
                            previous === learner.id ? null : learner.id,
                          )
                        }
                      >
                        <LuEllipsis size={16} strokeWidth={1.8} />
                      </button>

                      {openMenu === learner.id && (
                        <div className="learner-action-menu grid-action-menu">
                          <button
                            type="button"
                            onClick={() => handleViewLearner(learner)}
                          >
                            <LuEye size={14} strokeWidth={1.8} />

                            <span>View profile</span>
                          </button>

                          <a
                            href={`mailto:${learner.email}`}
                            onClick={() => setOpenMenu(null)}
                          >
                            <LuMail size={14} strokeWidth={1.8} />

                            <span>Send email</span>
                          </a>

                          <button
                            type="button"
                            className="danger-action"
                            onClick={() => handleRemoveLearner(learner)}
                          >
                            <LuTrash2 size={14} strokeWidth={1.8} />

                            <span>Remove learner</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* =========================================
                      GRID LEARNER INFO
                  ========================================= */}

                  <div className="grid-learner-info">
                    <div className="grid-learner-avatar">
                      <img src={learner.avatar} alt={learner.name} />
                    </div>

                    <button
                      type="button"
                      className="grid-learner-name"
                      onClick={() => handleViewLearner(learner)}
                    >
                      {learner.name}
                    </button>

                    <span className="grid-learner-email">{learner.email}</span>
                  </div>

                  {/* =========================================
                      GRID COURSE
                  ========================================= */}

                  <div className="grid-card-course">
                    <span className="grid-card-label">Course</span>

                    <div className="course-cell">
                      <div className="course-icon">
                        <LuUserRound size={13} strokeWidth={1.7} />
                      </div>

                      <span>{learner.course}</span>
                    </div>
                  </div>

                  {/* =========================================
                      GRID PROGRESS
                  ========================================= */}

                  <div className="grid-card-progress">
                    <div className="grid-progress-heading">
                      <span className="grid-card-label">Progress</span>

                      <strong>{learner.progress}%</strong>
                    </div>

                    <div className="progress-track">
                      <div
                        className={`progress-fill ${getProgressClass(
                          learner.progress,
                        )}`}
                        style={{
                          width: `${learner.progress}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* =========================================
                      GRID FOOTER
                  ========================================= */}

                  <div className="grid-card-footer">
                    <span
                      className={`learner-status ${getStatusClass(
                        learner.status,
                      )}`}
                    >
                      <span className="status-dot" />

                      {learner.status}
                    </span>

                    <div className="activity-cell">
                      <LuClock3 size={13} strokeWidth={1.7} />

                      <span>{learner.lastActivity}</span>
                    </div>
                  </div>

                  {/* =========================================
                      GRID QUICK ACTIONS
                  ========================================= */}

                  <div className="grid-card-quick-actions">
                    <a
                      href={`mailto:${learner.email}`}
                      className="grid-quick-action"
                      title="Email learner"
                      aria-label={`Email ${learner.name}`}
                    >
                      <LuMail size={14} strokeWidth={1.8} />

                      <span>Email</span>
                    </a>

                    <button
                      type="button"
                      className="grid-quick-action"
                      title="Message learner"
                      aria-label={`Message ${learner.name}`}
                      onClick={() => handleMessageLearner(learner)}
                    >
                      <LuMessageCircle size={14} strokeWidth={1.8} />

                      <span>Message</span>
                    </button>
                  </div>
                </article>
              ))
            : renderEmptyState()}
        </div>
      )}

      {/* =====================================================
          FOOTER / PAGINATION
      ===================================================== */}

      {learners.length > 0 && (
        <div className="learner-table-footer">
          <p>
            Showing <strong>1–{learners.length}</strong> of <strong>128</strong>{" "}
            learners
          </p>

          <div className="pagination">
            <button
              type="button"
              className="pagination-arrow"
              aria-label="Previous page"
              onClick={() => window.alert("Previous page")}
            >
              <LuChevronLeft size={15} strokeWidth={1.8} />
            </button>

            <button
              type="button"
              className="pagination-number active"
              onClick={() => window.alert("Page 1")}
            >
              1
            </button>

            <button
              type="button"
              className="pagination-number"
              onClick={() => window.alert("Page 2")}
            >
              2
            </button>

            <button
              type="button"
              className="pagination-number"
              onClick={() => window.alert("Page 3")}
            >
              3
            </button>

            <button
              type="button"
              className="pagination-number"
              onClick={() => window.alert("Page 4")}
            >
              4
            </button>

            <button
              type="button"
              className="pagination-number"
              onClick={() => window.alert("Page 5")}
            >
              5
            </button>

            <button
              type="button"
              className="pagination-arrow"
              aria-label="Next page"
              onClick={() => window.alert("Next page")}
            >
              <LuChevronRight size={15} strokeWidth={1.8} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default LearnerTable;
