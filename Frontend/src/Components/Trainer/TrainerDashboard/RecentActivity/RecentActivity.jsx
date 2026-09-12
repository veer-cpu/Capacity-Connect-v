import React, { useEffect, useMemo, useRef, useState } from "react";

import {
  LuActivity,
  LuCalendarDays,
  LuChevronDown,
  LuChevronRight,
  LuCheck,
  LuEllipsis,
  LuEye,
  LuFileText,
  LuGraduationCap,
  LuLightbulb,
  LuListFilter,
  LuMessageSquare,
  LuTrendingUp,
  LuUserPlus,
  LuUsersRound,
  LuX,
} from "react-icons/lu";

import "./RecentActivity.css";

// =====================================================
// ACTIVITY DATA
// =====================================================

const initialActivities = [];

// =====================================================
// CATEGORY CONFIG
// =====================================================

const categoryConfig = {
  Courses: {
    label: "Course",
    className: "activity-tag-green",
  },

  Assignments: {
    label: "Assignment",
    className: "activity-tag-purple",
  },

  Quizzes: {
    label: "Quiz",
    className: "activity-tag-orange",
  },

  Sessions: {
    label: "Session",
    className: "activity-tag-blue",
  },

  Performance: {
    label: "Performance",
    className: "activity-tag-red",
  },

  Learners: {
    label: "Learner",
    className: "activity-tag-green",
  },
};

// =====================================================
// FILTER OPTIONS
// =====================================================

const filterOptions = [
  {
    label: "All Activity",
    value: "All Activity",
    icon: LuListFilter,
  },
  {
    label: "Courses",
    value: "Courses",
    icon: LuGraduationCap,
  },
  {
    label: "Assignments",
    value: "Assignments",
    icon: LuFileText,
  },
  {
    label: "Sessions",
    value: "Sessions",
    icon: LuCalendarDays,
  },
];

// =====================================================
// RECENT ACTIVITY
// =====================================================

const RecentActivity = () => {
  // ===================================================
  // STATE
  // ===================================================

  const [activities, setActivities] = useState(initialActivities);

  const [selectedPeriod, setSelectedPeriod] =
    useState("This Week");

  const [showPeriodMenu, setShowPeriodMenu] =
    useState(false);

  const [selectedFilter, setSelectedFilter] =
    useState("All Activity");

  const [openActivityMenu, setOpenActivityMenu] =
    useState(null);

  const [showProgressTip, setShowProgressTip] =
    useState(false);

  const [showAll, setShowAll] = useState(false);

  // ===================================================
  // DROPDOWN REF
  // ===================================================

  const periodRef = useRef(null);

  // ===================================================
  // CLOSE PERIOD DROPDOWN OUTSIDE CLICK
  // ===================================================

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        periodRef.current &&
        !periodRef.current.contains(event.target)
      ) {
        setShowPeriodMenu(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
    };
  }, []);

  // ===================================================
  // CLOSE MENUS WITH ESCAPE
  // ===================================================

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowPeriodMenu(false);
        setOpenActivityMenu(null);
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, []);

  // ===================================================
  // FILTER ACTIVITIES
  // ===================================================

  const filteredActivities = useMemo(() => {
    if (selectedFilter === "All Activity") {
      return activities;
    }

    return activities.filter(
      (activity) =>
        activity.category === selectedFilter,
    );
  }, [activities, selectedFilter]);

  // ===================================================
  // VISIBLE ACTIVITIES
  // ===================================================

  const visibleActivities = showAll
    ? filteredActivities
    : filteredActivities.slice(0, 6);

  // ===================================================
  // PERIOD CHANGE
  // ===================================================

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    setShowPeriodMenu(false);
  };

  // ===================================================
  // FILTER CHANGE
  // ===================================================

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  // ===================================================
  // REMOVE ACTIVITY
  // ===================================================

  const handleRemoveActivity = (activityId) => {
    setActivities((currentActivities) =>
      currentActivities.filter(
        (activity) => activity.id !== activityId,
      ),
    );

    setOpenActivityMenu(null);
  };

  // ===================================================
  // VIEW ACTIVITY
  // ===================================================

  const handleViewActivity = (activity) => {
    setOpenActivityMenu(null);

    console.log("Viewing activity:", activity);
  };

  // ===================================================
  // VIEW ALL
  // ===================================================

  const handleViewAll = () => {
    setShowAll((previous) => !previous);
  };

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <section className="trainer-recent-activity">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="recent-activity-header">

        <div className="recent-activity-heading">

          <div className="recent-activity-title-icon">
            <LuActivity />
          </div>

          <div className="recent-activity-heading-text">

            <h2>Recent Activity</h2>

            <p>
              Latest updates from your learners and courses
            </p>

          </div>

        </div>

        {/* =================================================
            PERIOD DROPDOWN
        ================================================= */}

        <div
          className="activity-period-wrapper"
          ref={periodRef}
        >

          <button
            type="button"
            className={`activity-period-button ${
              showPeriodMenu
                ? "activity-period-active"
                : ""
            }`}
            onClick={() =>
              setShowPeriodMenu(
                (previous) => !previous,
              )
            }
            aria-expanded={showPeriodMenu}
            aria-haspopup="menu"
          >

            <LuCalendarDays />

            <span>{selectedPeriod}</span>

            <LuChevronDown
              className={
                showPeriodMenu
                  ? "activity-period-arrow-up"
                  : ""
              }
            />

          </button>

          {/* =============================================
              PERIOD MENU
          ============================================= */}

          {showPeriodMenu && (

            <div
              className="activity-period-menu"
              role="menu"
            >

              {[
                "This Week",
                "Next Week",
                "All Activity",
              ].map((period) => (

                <button
                  key={period}
                  type="button"
                  className={
                    selectedPeriod === period
                      ? "activity-period-selected"
                      : ""
                  }
                  onClick={() =>
                    handlePeriodChange(period)
                  }
                  role="menuitem"
                >

                  <span>{period}</span>

                  {selectedPeriod === period && (
                    <LuCheck />
                  )}

                </button>

              ))}

            </div>

          )}

        </div>

      </div>

      {/* =================================================
          MAIN GRID
      ================================================= */}

      <div className="recent-activity-grid">

        {/* =================================================
            ACTIVITY LIST
        ================================================= */}

        <div className="recent-activity-main">

          <div className="activity-list-card">

            <div className="activity-list">

              {visibleActivities.length === 0 ? (

                <div className="activity-empty-state">

                  <div className="activity-empty-icon">
                    <LuActivity />
                  </div>

                  <strong>No activity found</strong>

                  <span>
                    There are no activities in this category.
                  </span>

                </div>

              ) : (

                visibleActivities.map(
                  (activity, index) => {

                    const ActivityIcon =
                      activity.icon;

                    const category =
                      categoryConfig[
                        activity.category
                      ];

                    return (

                      <div
                        className="activity-item"
                        key={activity.id}
                      >

                        {/* =================================
                            TIMELINE
                        ================================= */}

                        <div className="activity-timeline">

                          <span
                            className={`activity-timeline-dot activity-dot-${activity.type}`}
                          ></span>

                          {index <
                            visibleActivities.length - 1 && (
                            <span className="activity-timeline-line"></span>
                          )}

                        </div>

                        {/* =================================
                            ICON
                        ================================= */}

                        <div
                          className={`activity-icon activity-icon-${activity.type}`}
                        >
                          <ActivityIcon />
                        </div>

                        {/* =================================
                            CONTENT
                        ================================= */}

                        <div className="activity-content">

                          <div className="activity-title-row">

                            <strong>
                              {activity.name}
                            </strong>

                            <span>
                              {activity.title}
                            </span>

                          </div>

                          <p>
                            {activity.description}
                          </p>

                        </div>

                        {/* =================================
                            CATEGORY
                        ================================= */}

                        <span
                          className={`activity-tag ${category.className}`}
                        >
                          {category.label}
                        </span>

                        {/* =================================
                            TIME
                        ================================= */}

                        <span className="activity-time">
                          {activity.time}
                        </span>

                        {/* =================================
                            ACTION MENU
                        ================================= */}

                        <div className="activity-actions">

                          <button
                            type="button"
                            className="activity-menu-button"
                            aria-label={`Activity options for ${activity.name}`}
                            aria-expanded={
                              openActivityMenu ===
                              activity.id
                            }
                            onClick={() =>
                              setOpenActivityMenu(
                                openActivityMenu ===
                                  activity.id
                                  ? null
                                  : activity.id,
                              )
                            }
                          >
                            <LuEllipsis />
                          </button>

                          {openActivityMenu ===
                            activity.id && (

                            <div
                              className="activity-action-menu"
                              role="menu"
                            >

                              <button
                                type="button"
                                onClick={() =>
                                  handleViewActivity(
                                    activity,
                                  )
                                }
                                role="menuitem"
                              >
                                <LuEye />
                                <span>
                                  View Activity
                                </span>
                              </button>

                              <button
                                type="button"
                                className="activity-remove-action"
                                onClick={() =>
                                  handleRemoveActivity(
                                    activity.id,
                                  )
                                }
                                role="menuitem"
                              >
                                <LuX />
                                <span>
                                  Remove
                                </span>
                              </button>

                            </div>

                          )}

                        </div>

                      </div>

                    );
                  },
                )

              )}

            </div>

          </div>

          {/* =================================================
              VIEW ALL
          ================================================= */}

          <button
            type="button"
            className="activity-view-all"
            onClick={handleViewAll}
          >

            <div className="activity-view-all-icon">
              <LuEye />
            </div>

            <span>
              {showAll
                ? "Show less activity"
                : "View all activity"}
            </span>

            <LuChevronRight
              className={
                showAll
                  ? "activity-view-arrow-active"
                  : ""
              }
            />

          </button>

        </div>

        {/* =================================================
            RIGHT SIDEBAR
        ================================================= */}

        <aside className="recent-activity-sidebar">

          {/* =================================================
              PROGRESS CARD
          ================================================= */}

          <article className="activity-progress-card">

            <div className="activity-progress-header">

              <div className="activity-progress-icon">
                🏆
              </div>

              <div>

                <h3>Great Progress!</h3>

                <p>
                  Your learners are actively engaging
                  and making progress.
                </p>

              </div>

            </div>

            <div className="activity-progress-stats">

              <div className="activity-progress-stat">

                <div className="progress-stat-icon progress-stat-green">
                  <LuUsersRound />
                </div>

                <strong>12</strong>

                <span>Active Learners</span>

                <small>↑ 12%</small>

              </div>

              <div className="activity-progress-stat">

                <div className="progress-stat-icon progress-stat-purple">
                  <LuFileText />
                </div>

                <strong>28</strong>

                <span>Submissions</span>

                <small>↑ 8%</small>

              </div>

              <div className="activity-progress-stat">

                <div className="progress-stat-icon progress-stat-orange">
                  <LuTrendingUp />
                </div>

                <strong>16</strong>

                <span>Completions</span>

                <small>↑ 24%</small>

              </div>

            </div>

          </article>

          {/* =================================================
              PROGRESS TIP
          ================================================= */}

          <button
            type="button"
            className="activity-tip-card"
            onClick={() =>
              setShowProgressTip(
                (previous) => !previous,
              )
            }
          >

            <div className="activity-tip-icon">
              <LuLightbulb />
            </div>

            <div className="activity-tip-content">

              <strong>
                {showProgressTip
                  ? "Keep Supporting!"
                  : "Keep Going!"}
              </strong>

              <span>
                {showProgressTip
                  ? "Your guidance helps learners stay consistent."
                  : "Consistent engagement leads to better learning outcomes."}
              </span>

            </div>

            <LuChevronRight className="activity-tip-arrow" />

          </button>

          {/* =================================================
              QUICK FILTERS
          ================================================= */}

          <article className="activity-filters-card">

            <div className="activity-filters-header">

              <h3>Quick Filters</h3>

              <LuListFilter />

            </div>

            <div className="activity-filter-grid">

              {filterOptions.map((filter) => {

                const FilterIcon = filter.icon;

                const isActive =
                  selectedFilter === filter.value;

                return (

                  <button
                    key={filter.value}
                    type="button"
                    className={`activity-filter-button ${
                      isActive
                        ? "activity-filter-active"
                        : ""
                    }`}
                    onClick={() =>
                      handleFilterChange(
                        filter.value,
                      )
                    }
                  >

                    <FilterIcon />

                    <span>
                      {filter.label}
                    </span>

                    {isActive && (
                      <LuCheck className="activity-filter-check" />
                    )}

                  </button>

                );

              })}

            </div>

          </article>

        </aside>

      </div>

    </section>
  );
};

export default RecentActivity;