import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  LuArrowRight,
  LuChevronDown,
  LuChevronLeft,
  LuChevronRight,
  LuCircleCheck,
  LuClock3,
  LuEllipsis,
  LuEye,
  LuFilePenLine,
  LuFileText,
  LuGrid2X2,
  LuList,
  LuListChecks,
  LuUsersRound,
} from "react-icons/lu";

import "./QuizList.css";

/* =========================================================
   QUIZ DATA
========================================================= */

export const quizzes = [
  {
    id: 1,
    title: "React Basics Quiz",
    description: "Test your knowledge of React fundamentals and core concepts.",
    course: "React for Beginners",
    type: "Assessment",
    status: "Published",
    questions: 20,
    attempts: 245,
    duration: "30 min",
    score: 82,
    icon: "react",
    theme: "blue",
  },

  {
    id: 2,
    title: "JavaScript Fundamentals",
    description: "A quick quiz to practice JavaScript basics and syntax.",
    course: "React for Beginners",
    type: "Practice",
    status: "Draft",
    questions: 15,
    attempts: 186,
    duration: "20 min",
    score: 76,
    icon: "javascript",
    theme: "green",
  },

  {
    id: 3,
    title: "Python for Data Science",
    description: "Test your Python skills for data analysis and visualization.",
    course: "Python for Data Science",
    type: "Assessment",
    status: "Published",
    questions: 25,
    attempts: 320,
    duration: "40 min",
    score: 88,
    icon: "python",
    theme: "lavender",
  },

  {
    id: 4,
    title: "UI/UX Design Principles",
    description: "Check your understanding of modern UI/UX design concepts.",
    course: "UI/UX Design Fundamentals",
    type: "Practice",
    status: "Archived",
    questions: 18,
    attempts: 142,
    duration: "25 min",
    score: 74,
    icon: "design",
    theme: "pink",
  },

  {
    id: 5,
    title: "Cloud Computing Basics",
    description: "Assess your knowledge of cloud services and architecture.",
    course: "Cloud Computing Basics",
    type: "Final",
    status: "Published",
    questions: 30,
    attempts: 210,
    duration: "45 min",
    score: 79,
    icon: "cloud",
    theme: "violet",
  },

  {
    id: 6,
    title: "Data Analytics Quiz",
    description: "Test your data analysis and visualization skills.",
    course: "Python for Data Science",
    type: "Assessment",
    status: "Draft",
    questions: 22,
    attempts: 175,
    duration: "35 min",
    score: 81,
    icon: "analytics",
    theme: "sky",
  },

  {
    id: 7,
    title: "Node.js Essentials",
    description: "Practice key Node.js concepts and backend development.",
    course: "Node.js Backend Development",
    type: "Practice",
    status: "Published",
    questions: 20,
    attempts: 198,
    duration: "30 min",
    score: 85,
    icon: "node",
    theme: "mint",
  },

  {
    id: 8,
    title: "Database Management",
    description: "Test your knowledge of database design and SQL.",
    course: "Node.js Backend Development",
    type: "Final",
    status: "Unpublished",
    questions: 28,
    attempts: 156,
    duration: "40 min",
    score: 73,
    icon: "database",
    theme: "rose",
  },

  {
    id: 9,
    title: "AI Fundamentals",
    description:
      "Evaluate your understanding of artificial intelligence concepts.",
    course: "AI for Everyone",
    type: "Assessment",
    status: "Published",
    questions: 24,
    attempts: 286,
    duration: "35 min",
    score: 91,
    icon: "ai",
    theme: "blue",
  },

  {
    id: 10,
    title: "Digital Marketing Strategy",
    description:
      "Practice essential digital marketing strategies and concepts.",
    course: "Digital Marketing Strategy",
    type: "Practice",
    status: "Published",
    questions: 16,
    attempts: 164,
    duration: "25 min",
    score: 78,
    icon: "marketing",
    theme: "peach",
  },

  {
    id: 11,
    title: "Flutter Development Quiz",
    description: "Test your knowledge of cross-platform Flutter development.",
    course: "Flutter App Development",
    type: "Assessment",
    status: "Draft",
    questions: 21,
    attempts: 132,
    duration: "30 min",
    score: 84,
    icon: "mobile",
    theme: "sky",
  },

  {
    id: 12,
    title: "Advanced React Patterns",
    description: "Evaluate your understanding of advanced React patterns.",
    course: "React for Beginners",
    type: "Final",
    status: "Published",
    questions: 32,
    attempts: 298,
    duration: "50 min",
    score: 89,
    icon: "react",
    theme: "lavender",
  },
];

/* =========================================================
   QUIZ VISUAL ICON
========================================================= */

const QuizVisualIcon = ({ type }) => {
  const iconMap = {
    react: "⚛",
    javascript: "JS",
    python: "🐍",
    design: "F",
    cloud: "☁",
    analytics: "▥",
    node: "N",
    database: "◉",
    ai: "AI",
    marketing: "↗",
    mobile: "◇",
  };

  return (
    <span className={`quiz-visual-mark quiz-mark-${type}`}>
      {iconMap[type] || "Q"}
    </span>
  );
};

/* =========================================================
   QUIZ LIST
========================================================= */

const QuizList = ({
  quizzes: quizItems = quizzes,

  /* ======================================================
     SHARED FILTER VALUES
  ====================================================== */

  searchValue = "",
  course = "All Courses",
  status = "All Status",
  type = "All Types",
  sortValue = "Latest First",

  /* ======================================================
     VIEW MODE
  ====================================================== */

  viewMode = "grid",
  onViewChange,

  /* ======================================================
     ACTION CALLBACKS
  ====================================================== */

  onEditQuiz,
}) => {
  /* ======================================================
     NAVIGATION
  ====================================================== */

  const navigate = useNavigate();

  /* ======================================================
     LOCAL UI STATE
  ====================================================== */

  const [openMenu, setOpenMenu] = useState(null);

  const [openRowsDropdown, setOpenRowsDropdown] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const [rowsPerPage, setRowsPerPage] = useState(8);

  /* ======================================================
     REFS

     Used to detect clicks outside dropdowns/menus.
  ====================================================== */

  const quizListRef = useRef(null);

  /* ======================================================
     CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
  ====================================================== */

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (quizListRef.current && !quizListRef.current.contains(event.target)) {
        setOpenMenu(null);
        setOpenRowsDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  /* ======================================================
     ESCAPE KEY

     Closes every open dropdown/menu.
  ====================================================== */

  useEffect(() => {
    const handleKeyboard = (event) => {
      if (event.key === "Escape") {
        setOpenMenu(null);
        setOpenRowsDropdown(false);
      }
    };

    document.addEventListener("keydown", handleKeyboard);

    return () => {
      document.removeEventListener("keydown", handleKeyboard);
    };
  }, []);

  /* ======================================================
     FILTER + SORT
  ====================================================== */

  const filteredQuizzes = useMemo(() => {
    let result = quizItems.map((quiz) => ({
      ...quiz,
      course: quiz.course_title || quiz.course || "General",
      type: quiz.type || "Assessment",
      status: quiz.status || "Published",
      questions: quiz.questions ?? quiz.question_count ?? 15,
      attempts: quiz.attempts ?? quiz.attempt_count ?? 0,
      duration:
        quiz.duration ??
        (quiz.time_limit_minutes ? `${quiz.time_limit_minutes} min` : "20 min"),
      score: quiz.score ?? quiz.passing_score ?? 60,
      icon: quiz.icon || "react",
      theme: quiz.theme || "blue",
    }));

    /* ----------------------------------------------------
       SEARCH
    ---------------------------------------------------- */

    const search = searchValue.trim().toLowerCase();

    if (search) {
      result = result.filter((quiz) => {
        return (
          quiz.title.toLowerCase().includes(search) ||
          quiz.description.toLowerCase().includes(search) ||
          quiz.course.toLowerCase().includes(search) ||
          quiz.type.toLowerCase().includes(search)
        );
      });
    }

    /* ----------------------------------------------------
       COURSE
    ---------------------------------------------------- */

    if (course !== "All Courses") {
      result = result.filter((quiz) => quiz.course === course);
    }

    /* ----------------------------------------------------
       STATUS
    ---------------------------------------------------- */

    if (status !== "All Status") {
      result = result.filter((quiz) => quiz.status === status);
    }

    /* ----------------------------------------------------
       TYPE
    ---------------------------------------------------- */

    if (type !== "All Types") {
      result = result.filter((quiz) => quiz.type === type);
    }

    /* ----------------------------------------------------
       SORT
    ---------------------------------------------------- */

    switch (sortValue) {
      case "Oldest First":
        result.sort((a, b) => b.id - a.id);
        break;

      case "Name: A → Z":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;

      case "Name: Z → A":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;

      case "Most Attempts":
        result.sort((a, b) => b.attempts - a.attempts);
        break;

      case "Highest Score":
        result.sort((a, b) => b.score - a.score);
        break;

      case "Latest First":
      default:
        result.sort((a, b) => a.id - b.id);
        break;
    }

    return result;
  }, [quizItems, searchValue, course, status, type, sortValue]);

  /* ======================================================
     PAGINATION
  ====================================================== */

  const totalPages = Math.max(
    1,
    Math.ceil(filteredQuizzes.length / rowsPerPage),
  );

  /* ------------------------------------------------------
     Reset page whenever filters change
  ------------------------------------------------------ */

  useEffect(() => {
    setCurrentPage(1);
    setOpenMenu(null);
  }, [searchValue, course, status, type, sortValue]);

  /* ------------------------------------------------------
     Protect against invalid page
  ------------------------------------------------------ */

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const startIndex = (currentPage - 1) * rowsPerPage;

  const visibleQuizzes = filteredQuizzes.slice(
    startIndex,
    startIndex + rowsPerPage,
  );

  /* ======================================================
     EDIT QUIZ
  ====================================================== */

  const handleEdit = (quiz) => {
    setOpenMenu(null);

    if (onEditQuiz) {
      onEditQuiz(quiz);
      return;
    }

    window.dispatchEvent(
      new CustomEvent("trainer-edit-quiz", {
        detail: { quiz },
      }),
    );
  };

  /* ======================================================
     VIEW QUIZ
     
     Navigate directly to QuizDetails page using quiz ID.
  ====================================================== */

  const handleView = (quiz) => {
    setOpenMenu(null);

    navigate(`/trainer/trainer-quizzes/${quiz.id}`);
  };

  /* ======================================================
     VIEW MODE
  ====================================================== */

  const handleGridView = () => {
    onViewChange?.("grid");
  };

  const handleListView = () => {
    onViewChange?.("list");
  };

  /* ======================================================
     CARD MENU
  ====================================================== */

  const handleMenuToggle = (quizId) => {
    setOpenRowsDropdown(false);

    setOpenMenu((previous) => (previous === quizId ? null : quizId));
  };

  /* ======================================================
     ROWS DROPDOWN
  ====================================================== */

  const handleRowsDropdownToggle = () => {
    setOpenMenu(null);

    setOpenRowsDropdown((previous) => !previous);
  };

  const handleRowsChange = (value) => {
    setRowsPerPage(value);
    setCurrentPage(1);
    setOpenRowsDropdown(false);
  };

  /* ======================================================
     NEXT PAGE
  ====================================================== */

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((page) => page + 1);

      setOpenMenu(null);
      setOpenRowsDropdown(false);
    }
  };

  /* ======================================================
     PREVIOUS PAGE
  ====================================================== */

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((page) => page - 1);

      setOpenMenu(null);
      setOpenRowsDropdown(false);
    }
  };

  /* ======================================================
     PAGE CHANGE
  ====================================================== */

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);
    setOpenMenu(null);
    setOpenRowsDropdown(false);
  };

  /* ======================================================
     STATUS CLASS
  ====================================================== */

  const getStatusClass = (quizStatus) => {
    switch (quizStatus) {
      case "Published":
        return "published";

      case "Draft":
        return "draft";

      case "Archived":
        return "archived";

      case "Unpublished":
        return "unpublished";

      default:
        return "draft";
    }
  };

  /* ======================================================
     PAGE NUMBERS
  ====================================================== */

  const renderPageNumbers = () => {
    if (totalPages <= 6) {
      return Array.from(
        {
          length: totalPages,
        },
        (_, index) => index + 1,
      ).map((page) => (
        <button
          type="button"
          key={page}
          className={`quiz-page-number ${currentPage === page ? "active" : ""}`}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </button>
      ));
    }

    return (
      <>
        {[1, 2, 3].map((page) => (
          <button
            type="button"
            key={page}
            className={`quiz-page-number ${
              currentPage === page ? "active" : ""
            }`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}

        <span className="quiz-page-dots">...</span>

        <button
          type="button"
          className={`quiz-page-number ${
            currentPage === totalPages ? "active" : ""
          }`}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </button>
      </>
    );
  };

  /* ======================================================
     EMPTY STATE
  ====================================================== */

  if (filteredQuizzes.length === 0) {
    return (
      <section className="quiz-list-section" ref={quizListRef}>
        <div className="quiz-list-header">
          <div className="quiz-list-title-group">
            <div className="quiz-list-title-icon">
              <LuListChecks size={19} strokeWidth={1.7} />
            </div>

            <div className="quiz-list-heading">
              <div className="quiz-list-title-row">
                <h2>Quiz List</h2>

                <span className="quiz-list-count">0 Quizzes</span>
              </div>

              <p>Manage, edit and track all your quizzes in one place.</p>
            </div>
          </div>
        </div>

        <div className="quiz-list-empty">
          <div className="quiz-empty-icon">
            <LuFileText size={23} strokeWidth={1.6} />
          </div>

          <h3>No quizzes found</h3>

          <p>Try changing your search or quiz filters to find more quizzes.</p>
        </div>
      </section>
    );
  }

  /* ======================================================
     MAIN
  ====================================================== */

  return (
    <section className="quiz-list-section" ref={quizListRef}>
      {/* ==================================================
          LIST HEADER
      ================================================== */}

      <div className="quiz-list-header">
        <div className="quiz-list-title-group">
          <div className="quiz-list-title-icon">
            <LuListChecks size={19} strokeWidth={1.7} />
          </div>

          <div className="quiz-list-heading">
            <div className="quiz-list-title-row">
              <h2>Quiz List</h2>

              <span className="quiz-list-count">
                {filteredQuizzes.length}{" "}
                {filteredQuizzes.length === 1 ? "Quiz" : "Quizzes"}
              </span>
            </div>

            <p>Manage, edit and track all your quizzes in one place.</p>
          </div>
        </div>

        {/* ================================================
            HEADER RIGHT
        ================================================= */}

        <div className="quiz-list-header-right">
          <span className="quiz-list-result-count">
            Showing <strong>{visibleQuizzes.length}</strong> of{" "}
            <strong>{filteredQuizzes.length}</strong> quizzes
          </span>

          {/* ==============================================
              GRID / LIST
          ============================================== */}

          <div className="quiz-list-view-switch">
            <button
              type="button"
              className={viewMode === "grid" ? "active" : ""}
              aria-label="Grid view"
              aria-pressed={viewMode === "grid"}
              onClick={handleGridView}
            >
              <LuGrid2X2 size={16} strokeWidth={1.8} />
            </button>

            <button
              type="button"
              className={viewMode === "list" ? "active" : ""}
              aria-label="List view"
              aria-pressed={viewMode === "list"}
              onClick={handleListView}
            >
              <LuList size={17} strokeWidth={1.8} />
            </button>
          </div>

          {/* ==============================================
              HEADER PAGINATION
          ============================================== */}

          <div className="quiz-header-pagination">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={handlePreviousPage}
              aria-label="Previous page"
            >
              <LuChevronLeft size={16} strokeWidth={1.9} />
            </button>

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={handleNextPage}
              aria-label="Next page"
            >
              <LuChevronRight size={16} strokeWidth={1.9} />
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================
          QUIZ GRID / LIST
      ================================================== */}

      <div
        className={`quiz-list-grid ${
          viewMode === "list" ? "quiz-list-list-mode" : ""
        }`}
      >
        {visibleQuizzes.map((quiz) => (
          <article
            key={quiz.id}
            className={`quiz-card quiz-card-${quiz.theme}`}
          >
            {/* ==========================================
                  CARD MAIN
            ========================================== */}

            <div className="quiz-card-main">
              {/* ========================================
                    CARD TOP
              ======================================== */}

              <div className="quiz-card-top">
                <div className="quiz-card-visual">
                  <QuizVisualIcon type={quiz.icon} />
                </div>

                <span
                  className={`quiz-type-badge quiz-type-${quiz.type
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                >
                  {quiz.type}
                </span>

                {/* ======================================
                      CARD MENU
                ====================================== */}

                <div className="quiz-card-menu-wrapper">
                  <button
                    type="button"
                    className={`quiz-card-menu-button ${
                      openMenu === quiz.id ? "active" : ""
                    }`}
                    onClick={() => handleMenuToggle(quiz.id)}
                    aria-label={`More actions for ${quiz.title}`}
                    aria-expanded={openMenu === quiz.id}
                  >
                    <LuEllipsis size={17} strokeWidth={1.9} />
                  </button>

                  {openMenu === quiz.id && (
                    <div className="quiz-card-action-menu">
                      <button type="button" onClick={() => handleEdit(quiz)}>
                        <LuFilePenLine size={14} strokeWidth={1.8} />

                        <span>Edit Quiz</span>
                      </button>

                      <button type="button" onClick={() => handleView(quiz)}>
                        <LuEye size={14} strokeWidth={1.8} />

                        <span>View Quiz</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* ========================================
                    TITLE
              ======================================== */}

              <h3 className="quiz-card-title">{quiz.title}</h3>

              {/* ========================================
                    DESCRIPTION
              ======================================== */}

              <p className="quiz-card-description">{quiz.description}</p>

              {/* ========================================
                    METRICS
              ======================================== */}

              <div className="quiz-card-metrics">
                <div className="quiz-card-metric">
                  <LuListChecks size={15} strokeWidth={1.75} />

                  <span>{quiz.questions} Questions</span>
                </div>

                <div className="quiz-card-metric">
                  <LuUsersRound size={15} strokeWidth={1.75} />

                  <span>{quiz.attempts} Attempts</span>
                </div>

                <div className="quiz-card-metric">
                  <LuClock3 size={15} strokeWidth={1.75} />

                  <span>{quiz.duration}</span>
                </div>
              </div>

              {/* ========================================
                    STATUS
              ======================================== */}

              <div className="quiz-card-status-row">
                <span
                  className={`quiz-status-badge ${getStatusClass(quiz.status)}`}
                >
                  <span className="quiz-status-dot" />

                  {quiz.status}
                </span>
              </div>
            </div>

            {/* ==========================================
                  CARD ACTIONS
            ========================================== */}

            <div className="quiz-card-actions">
              <button
                type="button"
                className="quiz-edit-button"
                onClick={() => handleEdit(quiz)}
              >
                <LuFilePenLine size={14} strokeWidth={1.8} />

                <span>Edit</span>
              </button>

              <button
                type="button"
                className="quiz-view-button"
                onClick={() => handleView(quiz)}
              >
                <LuEye size={14} strokeWidth={1.8} />

                <span>View</span>
              </button>

              <button
                type="button"
                className="quiz-arrow-button"
                onClick={() => handleView(quiz)}
                aria-label={`View ${quiz.title}`}
              >
                <LuArrowRight size={16} strokeWidth={1.9} />
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* ==================================================
          FOOTER
      ================================================== */}

      <div className="quiz-list-footer">
        {/* ================================================
            ROWS PER PAGE
        ================================================= */}

        <div className="quiz-rows-control">
          <span>Rows per page</span>

          {/* ==============================================
              CUSTOM ROWS DROPDOWN
          ============================================== */}

          <div className="quiz-rows-select">
            <button
              type="button"
              className={`quiz-rows-trigger ${
                openRowsDropdown ? "is-open" : ""
              }`}
              onClick={handleRowsDropdownToggle}
              aria-haspopup="listbox"
              aria-expanded={openRowsDropdown}
            >
              <span>{rowsPerPage}</span>

              <LuChevronDown
                className={openRowsDropdown ? "rotate" : ""}
                size={14}
                strokeWidth={1.8}
              />
            </button>

            {openRowsDropdown && (
              <div
                className="quiz-rows-dropdown"
                role="listbox"
                aria-label="Rows per page"
              >
                {[4, 8, 12].map((option) => (
                  <button
                    type="button"
                    key={option}
                    role="option"
                    aria-selected={rowsPerPage === option}
                    className={`quiz-rows-option ${
                      rowsPerPage === option ? "selected" : ""
                    }`}
                    onClick={() => handleRowsChange(option)}
                  >
                    <span>{option}</span>

                    {rowsPerPage === option && (
                      <LuCircleCheck size={15} strokeWidth={1.8} />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ================================================
            PAGINATION
        ================================================= */}

        <div className="quiz-pagination">
          <button
            type="button"
            className="quiz-pagination-arrow"
            disabled={currentPage === 1}
            onClick={handlePreviousPage}
            aria-label="Previous page"
          >
            <LuChevronLeft size={15} strokeWidth={1.9} />
          </button>

          {renderPageNumbers()}

          <button
            type="button"
            className="quiz-pagination-arrow"
            disabled={currentPage === totalPages}
            onClick={handleNextPage}
            aria-label="Next page"
          >
            <LuChevronRight size={15} strokeWidth={1.9} />
          </button>
        </div>

        {/* ================================================
            GO TO PAGE
        ================================================= */}

        <div className="quiz-go-to-page">
          <span>Go to page</span>

          <span className="quiz-current-page">{currentPage}</span>

          <button type="button" onClick={() => handlePageChange(currentPage)}>
            Go
          </button>
        </div>
      </div>
    </section>
  );
};

export default QuizList;
