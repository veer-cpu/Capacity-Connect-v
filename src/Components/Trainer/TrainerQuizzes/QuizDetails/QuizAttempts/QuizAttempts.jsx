import React, { useEffect, useMemo, useRef, useState } from "react";

import {
  LuChevronDown,
  LuChevronLeft,
  LuChevronRight,
  LuCheck,
  LuCircleCheck,
  LuClock3,
  LuDownload,
  LuEllipsis,
  LuEye,
  LuFileText,
  LuFilter,
  LuRefreshCw,
  LuSearch,
  LuTrash2,
  LuUserRound,
  LuX,
} from "react-icons/lu";

import { getQuizResult } from "../../../../../services/quizApi";

import "./QuizAttempts.css";

/* =========================================================
   ATTEMPT DATA & NORMALIZER
========================================================= */

const normalizeAttempt = (att, idx) => {
  const learnerName = att.learner || att.user_name || "Learner User";
  const emailStr = att.email || att.user_email || "learner@example.com";
  const initials =
    learnerName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "LU";

  const pct = Number(att.percentage ?? att.score ?? 0);
  const isPassed = att.passed === true || att.status === "Passed" || pct >= 60;

  const dateObj = att.submitted_at ? new Date(att.submitted_at) : new Date();
  const dateStr = dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timeStr = dateObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return {
    ...att,
    id: att.id || idx + 1,
    learner: learnerName,
    email: emailStr,
    initials,
    attempt: att.attempt || 1,
    score: Number(pct.toFixed(2)),
    timeTaken: att.timeTaken || "20m 00s",
    date: att.date || dateStr,
    time: att.time || timeStr,
    status: isPassed ? "Passed" : "Failed",
    theme:
      att.theme ||
      ["blue", "lavender", "peach", "rose", "sky", "mint"][idx % 6],
  };
};

const initialAttempts = [
  {
    id: 1,
    learner: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    initials: "RS",
    attempt: 1,
    score: 92,
    timeTaken: "18m 24s",
    date: "Feb 18, 2024",
    time: "10:24 AM",
    status: "Passed",
    theme: "blue",
  },

  {
    id: 2,
    learner: "Priya Verma",
    email: "priya.verma@example.com",
    initials: "PV",
    attempt: 1,
    score: 86,
    timeTaken: "21m 10s",
    date: "Feb 17, 2024",
    time: "02:15 PM",
    status: "Passed",
    theme: "lavender",
  },

  {
    id: 3,
    learner: "Aman Kumar",
    email: "aman.kumar@example.com",
    initials: "AK",
    attempt: 2,
    score: 61,
    timeTaken: "27m 36s",
    date: "Feb 16, 2024",
    time: "11:42 AM",
    status: "Passed",
    theme: "peach",
  },

  {
    id: 4,
    learner: "Neha Tiwari",
    email: "neha.tiwari@example.com",
    initials: "NT",
    attempt: 1,
    score: 42,
    timeTaken: "29m 18s",
    date: "Feb 15, 2024",
    time: "04:28 PM",
    status: "Failed",
    theme: "rose",
  },

  {
    id: 5,
    learner: "Suresh Kumar",
    email: "suresh.kumar@example.com",
    initials: "SK",
    attempt: 1,
    score: 88,
    timeTaken: "19m 52s",
    date: "Feb 14, 2024",
    time: "09:16 AM",
    status: "Passed",
    theme: "sky",
  },

  {
    id: 6,
    learner: "Anjali Patel",
    email: "anjali.patel@example.com",
    initials: "AP",
    attempt: 1,
    score: 74,
    timeTaken: "24m 06s",
    date: "Feb 13, 2024",
    time: "01:32 PM",
    status: "Passed",
    theme: "mint",
  },

  {
    id: 7,
    learner: "Vivek Joshi",
    email: "vivek.joshi@example.com",
    initials: "VJ",
    attempt: 2,
    score: 38,
    timeTaken: "30m 00s",
    date: "Feb 12, 2024",
    time: "03:47 PM",
    status: "Failed",
    theme: "rose",
  },

  {
    id: 8,
    learner: "Kavya Mehta",
    email: "kavya.mehta@example.com",
    initials: "KM",
    attempt: 1,
    score: 95,
    timeTaken: "16m 41s",
    date: "Feb 11, 2024",
    time: "10:08 AM",
    status: "Passed",
    theme: "lavender",
  },

  {
    id: 9,
    learner: "Rohan Shah",
    email: "rohan.shah@example.com",
    initials: "RS",
    attempt: 3,
    score: 67,
    timeTaken: "26m 14s",
    date: "Feb 10, 2024",
    time: "12:22 PM",
    status: "Passed",
    theme: "blue",
  },

  {
    id: 10,
    learner: "Meera Singh",
    email: "meera.singh@example.com",
    initials: "MS",
    attempt: 1,
    score: 48,
    timeTaken: "28m 47s",
    date: "Feb 09, 2024",
    time: "05:12 PM",
    status: "Failed",
    theme: "peach",
  },

  {
    id: 11,
    learner: "Arjun Patel",
    email: "arjun.patel@example.com",
    initials: "AP",
    attempt: 2,
    score: 81,
    timeTaken: "22m 18s",
    date: "Feb 08, 2024",
    time: "11:17 AM",
    status: "Passed",
    theme: "mint",
  },

  {
    id: 12,
    learner: "Nisha Kapoor",
    email: "nisha.kapoor@example.com",
    initials: "NK",
    attempt: 1,
    score: 90,
    timeTaken: "17m 52s",
    date: "Feb 07, 2024",
    time: "09:42 AM",
    status: "Passed",
    theme: "sky",
  },

  {
    id: 13,
    learner: "Dev Malhotra",
    email: "dev.malhotra@example.com",
    initials: "DM",
    attempt: 1,
    score: 55,
    timeTaken: "29m 11s",
    date: "Feb 06, 2024",
    time: "02:48 PM",
    status: "Failed",
    theme: "rose",
  },

  {
    id: 14,
    learner: "Isha Desai",
    email: "isha.desai@example.com",
    initials: "ID",
    attempt: 2,
    score: 78,
    timeTaken: "23m 43s",
    date: "Feb 05, 2024",
    time: "10:31 AM",
    status: "Passed",
    theme: "lavender",
  },

  {
    id: 15,
    learner: "Yash Trivedi",
    email: "yash.trivedi@example.com",
    initials: "YT",
    attempt: 1,
    score: 96,
    timeTaken: "15m 48s",
    date: "Feb 04, 2024",
    time: "01:18 PM",
    status: "Passed",
    theme: "blue",
  },
];

/* =========================================================
   FILTER OPTIONS
========================================================= */

const statusOptions = ["All Status", "Passed", "Failed"];

/* =========================================================
   SCORE OPTIONS
========================================================= */

const scoreOptions = [
  "All Scores",
  "90% and above",
  "75% - 89%",
  "50% - 74%",
  "Below 50%",
];

/* =========================================================
   SORT OPTIONS
========================================================= */

const sortOptions = [
  "Latest First",
  "Oldest First",
  "Highest Score",
  "Lowest Score",
  "Learner: A → Z",
  "Learner: Z → A",
];

/* =========================================================
   QUIZ ATTEMPTS
========================================================= */

const QuizAttempts = ({
  attempts: externalAttempts,
  onViewAttempt,
  onDeleteAttempt,
}) => {
  /* =======================================================
     STATE
  ======================================================= */

  const [attempts, setAttempts] = useState(() =>
    (externalAttempts || initialAttempts).map(normalizeAttempt),
  );

  useEffect(() => {
    if (externalAttempts && Array.isArray(externalAttempts)) {
      setAttempts(externalAttempts.map(normalizeAttempt));
    }
  }, [externalAttempts]);

  const [searchValue, setSearchValue] = useState("");

  const [selectedStatus, setSelectedStatus] = useState("All Status");

  const [selectedScore, setSelectedScore] = useState("All Scores");

  const [sortValue, setSortValue] = useState("Latest First");

  const [openFilter, setOpenFilter] = useState(null);

  const [openMenu, setOpenMenu] = useState(null);

  const [selectedAttempt, setSelectedAttempt] = useState(null);

  const [activeModal, setActiveModal] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  const [rowsPerPage, setRowsPerPage] = useState(5);

  /* =======================================================
     REFERENCE
  ======================================================= */

  const attemptsRef = useRef(null);

  /* =======================================================
     CALCULATE SUMMARY
  ======================================================= */

  const totalAttempts = attempts.length;

  const passedAttempts = attempts.filter(
    (attempt) => attempt.status === "Passed",
  ).length;

  const failedAttempts = attempts.filter(
    (attempt) => attempt.status === "Failed",
  ).length;

  const averageScore =
    attempts.length > 0
      ? Math.round(
          attempts.reduce((total, attempt) => total + attempt.score, 0) /
            attempts.length,
        )
      : 0;

  const passPercentage =
    totalAttempts > 0 ? Math.round((passedAttempts / totalAttempts) * 100) : 0;

  const failPercentage =
    totalAttempts > 0 ? Math.round((failedAttempts / totalAttempts) * 100) : 0;

  /* =======================================================
     FILTER + SORT
  ======================================================= */

  const filteredAttempts = useMemo(() => {
    let result = [...attempts];

    const search = searchValue.trim().toLowerCase();

    /* -----------------------------------------------------
       SEARCH
    ----------------------------------------------------- */

    if (search) {
      result = result.filter((attempt) => {
        return (
          attempt.learner.toLowerCase().includes(search) ||
          attempt.email.toLowerCase().includes(search)
        );
      });
    }

    /* -----------------------------------------------------
       STATUS
    ----------------------------------------------------- */

    if (selectedStatus !== "All Status") {
      result = result.filter((attempt) => attempt.status === selectedStatus);
    }

    /* -----------------------------------------------------
       SCORE
    ----------------------------------------------------- */

    if (selectedScore !== "All Scores") {
      result = result.filter((attempt) => {
        if (selectedScore === "90% and above") {
          return attempt.score >= 90;
        }

        if (selectedScore === "75% - 89%") {
          return attempt.score >= 75 && attempt.score <= 89;
        }

        if (selectedScore === "50% - 74%") {
          return attempt.score >= 50 && attempt.score <= 74;
        }

        if (selectedScore === "Below 50%") {
          return attempt.score < 50;
        }

        return true;
      });
    }

    /* -----------------------------------------------------
       SORT
    ----------------------------------------------------- */

    switch (sortValue) {
      case "Oldest First":
        result.sort((a, b) => b.id - a.id);
        break;

      case "Highest Score":
        result.sort((a, b) => b.score - a.score);
        break;

      case "Lowest Score":
        result.sort((a, b) => a.score - b.score);
        break;

      case "Learner: A → Z":
        result.sort((a, b) => a.learner.localeCompare(b.learner));
        break;

      case "Learner: Z → A":
        result.sort((a, b) => b.learner.localeCompare(a.learner));
        break;

      case "Latest First":
      default:
        result.sort((a, b) => a.id - b.id);
        break;
    }

    return result;
  }, [attempts, searchValue, selectedStatus, selectedScore, sortValue]);

  /* =======================================================
     PAGINATION
  ======================================================= */

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAttempts.length / rowsPerPage),
  );

  const startIndex = (currentPage - 1) * rowsPerPage;

  const visibleAttempts = filteredAttempts.slice(
    startIndex,
    startIndex + rowsPerPage,
  );

  /* =======================================================
     RESET PAGE WHEN FILTER CHANGES
  ======================================================= */

  useEffect(() => {
    setCurrentPage(1);
    setOpenMenu(null);
  }, [searchValue, selectedStatus, selectedScore, sortValue, rowsPerPage]);

  /* =======================================================
     PROTECT CURRENT PAGE
  ======================================================= */

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  /* =======================================================
     OUTSIDE CLICK
  ======================================================= */

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (attemptsRef.current && !attemptsRef.current.contains(event.target)) {
        setOpenFilter(null);
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  /* =======================================================
     ESCAPE
  ======================================================= */

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key !== "Escape") {
        return;
      }

      setOpenFilter(null);
      setOpenMenu(null);
      setActiveModal(null);
      setSelectedAttempt(null);
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  /* =======================================================
     FILTER DROPDOWN
  ======================================================= */

  const handleFilterToggle = (event, filterName) => {
    event.stopPropagation();

    setOpenMenu(null);

    setOpenFilter((previous) => (previous === filterName ? null : filterName));
  };

  /* =======================================================
     FILTER VALUE
  ======================================================= */

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    setOpenFilter(null);
  };

  const handleScoreChange = (value) => {
    setSelectedScore(value);
    setOpenFilter(null);
  };

  const handleSortChange = (value) => {
    setSortValue(value);
    setOpenFilter(null);
  };

  /* =======================================================
     RESET
  ======================================================= */

  const handleReset = () => {
    setSearchValue("");
    setSelectedStatus("All Status");
    setSelectedScore("All Scores");
    setSortValue("Latest First");
    setCurrentPage(1);
    setOpenFilter(null);
    setOpenMenu(null);
  };

  const [detailedResult, setDetailedResult] = useState(null);

  const handleMenuToggle = (event, attemptId) => {
    event.stopPropagation();
    setOpenFilter(null);
    setOpenMenu((previous) => (previous === attemptId ? null : attemptId));
  };

  const handleViewAttempt = (attempt) => {
    setOpenMenu(null);
    setSelectedAttempt(attempt);
    setDetailedResult(null);
    setActiveModal("view");

    if (attempt.id) {
      getQuizResult(attempt.id, "TRAINER")
        .then((res) => {
          setDetailedResult(res);
        })
        .catch((err) => {
          console.error("Failed to load attempt result breakdown:", err);
          setDetailedResult(null);
        });
    }

    if (onViewAttempt) {
      onViewAttempt(attempt);
    }
  };
    /* =======================================================
     ATTEMPT MENU
  ======================================================= */

 

  /* =======================================================
     DELETE ATTEMPT
  ======================================================= */

  const handleDeleteAttempt = (attempt) => {
    setOpenMenu(null);
    setSelectedAttempt(attempt);
    setActiveModal("delete");
  };

  const confirmDelete = () => {
    if (!selectedAttempt) {
      return;
    }

    setAttempts((previous) =>
      previous.filter((attempt) => attempt.id !== selectedAttempt.id),
    );

    if (onDeleteAttempt) {
      onDeleteAttempt(selectedAttempt);
    }

    setSelectedAttempt(null);
    setActiveModal(null);
  };

  /* =======================================================
     EXPORT CSV
  ======================================================= */

  const handleExport = () => {
    const rows = [
      [
        "Learner",
        "Email",
        "Attempt",
        "Score",
        "Time Taken",
        "Attempt Date",
        "Status",
      ],
      ...filteredAttempts.map((attempt) => [
        attempt.learner,
        attempt.email,
        `#${attempt.attempt}`,
        `${attempt.score}%`,
        attempt.timeTaken,
        `${attempt.date} ${attempt.time}`,
        attempt.status,
      ]),
    ];

    const csvContent = rows
      .map((row) =>
        row
          .map((value) => {
            const safeValue = String(value).replace(/"/g, '""');

            return `"${safeValue}"`;
          })
          .join(","),
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "quiz-attempts.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  /* =======================================================
     PAGE CHANGE
  ======================================================= */

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);
    setOpenMenu(null);
  };

  /* =======================================================
     SCORE CLASS
  ======================================================= */

  const getScoreClass = (score) => {
    if (score >= 90) {
      return "excellent";
    }

    if (score >= 75) {
      return "good";
    }

    if (score >= 50) {
      return "average";
    }

    return "low";
  };

  /* =======================================================
     PAGE NUMBERS
  ======================================================= */

  const renderPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from(
        {
          length: totalPages,
        },
        (_, index) => index + 1,
      ).map((page) => (
        <button
          type="button"
          key={page}
          className={`quiz-attempt-page-number ${
            currentPage === page ? "active" : ""
          }`}
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
            className={`quiz-attempt-page-number ${
              currentPage === page ? "active" : ""
            }`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}

        <span className="quiz-attempt-page-dots">...</span>

        <button
          type="button"
          className={`quiz-attempt-page-number ${
            currentPage === totalPages ? "active" : ""
          }`}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </button>
      </>
    );
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section className="quiz-attempts" ref={attemptsRef}>
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="quiz-attempts-header">
        <div className="quiz-attempts-heading-group">
          <div className="quiz-attempts-heading-icon">
            <LuUserRound size={19} strokeWidth={1.7} />
          </div>

          <div className="quiz-attempts-heading">
            <div className="quiz-attempts-title-row">
              <h2>Quiz Attempts</h2>

              <span className="quiz-attempts-count">
                {totalAttempts} Attempts
              </span>
            </div>

            <p>Track learner attempts and performance for this quiz.</p>
          </div>
        </div>

        <div className="quiz-attempts-header-actions">
          <button
            type="button"
            className="quiz-export-button"
            onClick={handleExport}
          >
            <LuDownload size={15} strokeWidth={1.9} />

            <span>Export</span>
          </button>

          <button
            type="button"
            className="quiz-header-more"
            onClick={(event) => handleFilterToggle(event, "header-menu")}
            aria-label="More attempt actions"
            aria-expanded={openFilter === "header-menu"}
          >
            <LuEllipsis size={17} strokeWidth={1.9} />
          </button>

          {openFilter === "header-menu" && (
            <div className="quiz-header-action-menu">
              <button
                type="button"
                onClick={() => {
                  handleExport();
                  setOpenFilter(null);
                }}
              >
                <LuDownload size={14} strokeWidth={1.8} />
                <span>Export CSV</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleReset();
                  setOpenFilter(null);
                }}
              >
                <LuRefreshCw size={14} strokeWidth={1.8} />
                <span>Reset Filters</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* =================================================
          SUMMARY STRIP
      ================================================= */}

      <div className="quiz-attempts-summary">
        {/* TOTAL */}

        <div className="quiz-attempt-summary-card summary-blue">
          <div className="quiz-summary-icon">
            <LuUserRound size={18} strokeWidth={1.7} />
          </div>

          <div className="quiz-summary-content">
            <strong>{totalAttempts}</strong>
            <span>Total Attempts</span>
          </div>
        </div>

        {/* PASSED */}

        <div className="quiz-attempt-summary-card summary-mint">
          <div className="quiz-summary-icon">
            <LuCircleCheck size={18} strokeWidth={1.7} />
          </div>

          <div className="quiz-summary-content">
            <strong>{passedAttempts}</strong>
            <span>Passed</span>
          </div>

          <span className="quiz-summary-percentage">{passPercentage}%</span>
        </div>

        {/* FAILED */}

        <div className="quiz-attempt-summary-card summary-rose">
          <div className="quiz-summary-icon">
            <LuX size={18} strokeWidth={1.9} />
          </div>

          <div className="quiz-summary-content">
            <strong>{failedAttempts}</strong>
            <span>Failed</span>
          </div>

          <span className="quiz-summary-percentage">{failPercentage}%</span>
        </div>

        {/* AVERAGE */}

        <div className="quiz-attempt-summary-card summary-lavender">
          <div className="quiz-summary-icon">
            <LuCheck size={18} strokeWidth={1.9} />
          </div>

          <div className="quiz-summary-content">
            <strong>{averageScore}%</strong>
            <span>Average Score</span>
          </div>
        </div>
      </div>

      {/* =================================================
          FILTER TOOLBAR
      ================================================= */}

      <div className="quiz-attempts-toolbar">
        {/* SEARCH */}

        <div className="quiz-attempt-search">
          <LuSearch size={16} strokeWidth={1.8} />

          <input
            type="search"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Search by learner name or email..."
            aria-label="Search attempts"
          />

          {searchValue && (
            <button
              type="button"
              className="quiz-attempt-search-clear"
              onClick={() => setSearchValue("")}
              aria-label="Clear search"
            >
              <LuX size={13} strokeWidth={1.9} />
            </button>
          )}
        </div>

        {/* STATUS */}

        <div className="quiz-attempt-filter">
          <button
            type="button"
            className={`quiz-attempt-filter-trigger ${
              openFilter === "status" ? "active" : ""
            }`}
            onClick={(event) => handleFilterToggle(event, "status")}
          >
            <LuFilter size={15} strokeWidth={1.8} />

            <span>{selectedStatus}</span>

            <LuChevronDown
              className={openFilter === "status" ? "rotate" : ""}
              size={14}
              strokeWidth={1.8}
            />
          </button>

          {openFilter === "status" && (
            <div className="quiz-attempt-filter-dropdown">
              {statusOptions.map((option) => (
                <button
                  type="button"
                  key={option}
                  className={selectedStatus === option ? "selected" : ""}
                  onClick={() => handleStatusChange(option)}
                >
                  <span>{option}</span>

                  {selectedStatus === option && (
                    <LuCheck size={14} strokeWidth={2} />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* SCORE */}

        <div className="quiz-attempt-filter">
          <button
            type="button"
            className={`quiz-attempt-filter-trigger ${
              openFilter === "score" ? "active" : ""
            }`}
            onClick={(event) => handleFilterToggle(event, "score")}
          >
            <LuCircleCheck size={15} strokeWidth={1.8} />

            <span>{selectedScore}</span>

            <LuChevronDown
              className={openFilter === "score" ? "rotate" : ""}
              size={14}
              strokeWidth={1.8}
            />
          </button>

          {openFilter === "score" && (
            <div className="quiz-attempt-filter-dropdown">
              {scoreOptions.map((option) => (
                <button
                  type="button"
                  key={option}
                  className={selectedScore === option ? "selected" : ""}
                  onClick={() => handleScoreChange(option)}
                >
                  <span>{option}</span>

                  {selectedScore === option && (
                    <LuCheck size={14} strokeWidth={2} />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* SORT */}

        <div className="quiz-attempt-filter">
          <button
            type="button"
            className={`quiz-attempt-filter-trigger ${
              openFilter === "sort" ? "active" : ""
            }`}
            onClick={(event) => handleFilterToggle(event, "sort")}
          >
            <LuClock3 size={15} strokeWidth={1.8} />

            <span>{sortValue}</span>

            <LuChevronDown
              className={openFilter === "sort" ? "rotate" : ""}
              size={14}
              strokeWidth={1.8}
            />
          </button>

          {openFilter === "sort" && (
            <div className="quiz-attempt-filter-dropdown">
              {sortOptions.map((option) => (
                <button
                  type="button"
                  key={option}
                  className={sortValue === option ? "selected" : ""}
                  onClick={() => handleSortChange(option)}
                >
                  <span>{option}</span>

                  {sortValue === option && (
                    <LuCheck size={14} strokeWidth={2} />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RESET */}

        <button
          type="button"
          className="quiz-attempt-reset"
          onClick={handleReset}
          aria-label="Reset attempt filters"
        >
          <LuRefreshCw size={16} strokeWidth={1.8} />
        </button>
      </div>

      {/* =================================================
          TABLE
      ================================================= */}

      {visibleAttempts.length > 0 ? (
        <>
          <div className="quiz-attempt-table-wrapper">
            <table className="quiz-attempt-table">
              <thead>
                <tr>
                  <th className="attempt-number-column">#</th>

                  <th>Learner</th>

                  <th>Attempt</th>

                  <th>Score</th>

                  <th>Time Taken</th>

                  <th>Attempt Date</th>

                  <th>Status</th>

                  <th className="attempt-actions-column">Actions</th>
                </tr>
              </thead>

              <tbody>
                {visibleAttempts.map((attempt) => (
                  <tr
                    key={attempt.id}
                    className={`attempt-row attempt-row-${attempt.theme}`}
                  >
                    {/* NUMBER */}

                    <td className="attempt-number-cell">{attempt.id}</td>

                    {/* LEARNER */}

                    <td>
                      <div className="attempt-learner">
                        <div className="attempt-avatar">{attempt.initials}</div>

                        <div className="attempt-learner-info">
                          <strong>{attempt.learner}</strong>

                          <span>{attempt.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* ATTEMPT */}

                    <td>
                      <span className="attempt-number">#{attempt.attempt}</span>
                    </td>

                    {/* SCORE */}

                    <td>
                      <span
                        className={`attempt-score ${getScoreClass(
                          attempt.score,
                        )}`}
                      >
                        {attempt.score}%
                      </span>
                    </td>

                    {/* TIME */}

                    <td>
                      <div className="attempt-time">
                        <LuClock3 size={14} strokeWidth={1.7} />

                        <span>{attempt.timeTaken}</span>
                      </div>
                    </td>

                    {/* DATE */}

                    <td>
                      <div className="attempt-date">
                        <strong>{attempt.date}</strong>

                        <span>{attempt.time}</span>
                      </div>
                    </td>

                    {/* STATUS */}

                    <td>
                      <span
                        className={`attempt-status ${attempt.status.toLowerCase()}`}
                      >
                        <span className="attempt-status-dot" />

                        {attempt.status}
                      </span>
                    </td>

                    {/* ACTIONS */}

                    <td>
                      <div className="attempt-actions">
                        <button
                          type="button"
                          className="attempt-view-button"
                          onClick={() => handleViewAttempt(attempt)}
                          aria-label={`View ${attempt.learner}'s attempt`}
                        >
                          <LuEye size={15} strokeWidth={1.8} />
                        </button>

                        <div className="attempt-menu">
                          <button
                            type="button"
                            className={`attempt-menu-button ${
                              openMenu === attempt.id ? "active" : ""
                            }`}
                            onClick={(event) =>
                              handleMenuToggle(event, attempt.id)
                            }
                            aria-label={`More actions for ${attempt.learner}`}
                            aria-expanded={openMenu === attempt.id}
                          >
                            <LuEllipsis size={16} strokeWidth={1.9} />
                          </button>

                          {openMenu === attempt.id && (
                            <div className="attempt-action-menu">
                              <button
                                type="button"
                                onClick={() => handleViewAttempt(attempt)}
                              >
                                <LuEye size={14} strokeWidth={1.8} />

                                <span>View Attempt</span>
                              </button>

                              <button
                                type="button"
                                className="danger"
                                onClick={() => handleDeleteAttempt(attempt)}
                              >
                                <LuTrash2 size={14} strokeWidth={1.8} />

                                <span>Delete Record</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* =================================================
              MOBILE CARDS
          ================================================= */}

          <div className="quiz-attempt-mobile-list">
            {visibleAttempts.map((attempt) => (
              <article
                key={attempt.id}
                className={`quiz-attempt-mobile-card mobile-${attempt.theme}`}
              >
                <div className="mobile-attempt-top">
                  <div className="attempt-learner">
                    <div className="attempt-avatar">{attempt.initials}</div>

                    <div className="attempt-learner-info">
                      <strong>{attempt.learner}</strong>

                      <span>{attempt.email}</span>
                    </div>
                  </div>

                  <div className="attempt-menu">
                    <button
                      type="button"
                      className={`attempt-menu-button ${
                        openMenu === attempt.id ? "active" : ""
                      }`}
                      onClick={(event) => handleMenuToggle(event, attempt.id)}
                      aria-label="More actions"
                      aria-expanded={openMenu === attempt.id}
                    >
                      <LuEllipsis size={16} strokeWidth={1.9} />
                    </button>

                    {openMenu === attempt.id && (
                      <div className="attempt-action-menu">
                        <button
                          type="button"
                          onClick={() => handleViewAttempt(attempt)}
                        >
                          <LuEye size={14} strokeWidth={1.8} />

                          <span>View Attempt</span>
                        </button>

                        <button
                          type="button"
                          className="danger"
                          onClick={() => handleDeleteAttempt(attempt)}
                        >
                          <LuTrash2 size={14} strokeWidth={1.8} />

                          <span>Delete Record</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mobile-attempt-details">
                  <div>
                    <span>Attempt</span>
                    <strong>#{attempt.attempt}</strong>
                  </div>

                  <div>
                    <span>Score</span>

                    <strong
                      className={`mobile-score ${getScoreClass(attempt.score)}`}
                    >
                      {attempt.score}%
                    </strong>
                  </div>

                  <div>
                    <span>Time</span>

                    <strong>{attempt.timeTaken}</strong>
                  </div>

                  <div>
                    <span>Date</span>

                    <strong>{attempt.date}</strong>
                  </div>
                </div>

                <div className="mobile-attempt-footer">
                  <span
                    className={`attempt-status ${attempt.status.toLowerCase()}`}
                  >
                    <span className="attempt-status-dot" />

                    {attempt.status}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleViewAttempt(attempt)}
                  >
                    <LuEye size={14} strokeWidth={1.8} />

                    <span>View Attempt</span>
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="quiz-attempts-footer">
            <div className="quiz-attempts-showing">
              Showing <strong>{startIndex + 1}</strong> to{" "}
              <strong>
                {Math.min(startIndex + rowsPerPage, filteredAttempts.length)}
              </strong>{" "}
              of <strong>{filteredAttempts.length}</strong> attempts
            </div>

            <div className="quiz-attempt-pagination">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                aria-label="Previous page"
              >
                <LuChevronLeft size={15} strokeWidth={1.9} />
              </button>

              {renderPageNumbers()}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                aria-label="Next page"
              >
                <LuChevronRight size={15} strokeWidth={1.9} />
              </button>
            </div>

            <div className="quiz-attempt-rows">
              <span>Rows per page</span>

              <div className="quiz-attempt-native-select">
                <select
                  value={rowsPerPage}
                  onChange={(event) =>
                    setRowsPerPage(Number(event.target.value))
                  }
                  aria-label="Rows per page"
                >
                  <option value={5}>5</option>

                  <option value={10}>10</option>

                  <option value={15}>15</option>
                </select>

                <LuChevronDown size={13} strokeWidth={1.8} />
              </div>
            </div>
          </div>
        </>
      ) : (
        /* =================================================
           EMPTY STATE
        ================================================= */

        <div className="quiz-attempts-empty">
          <div className="quiz-attempts-empty-icon">
            <LuSearch size={22} strokeWidth={1.6} />
          </div>

          <h3>No attempts found</h3>

          <p>Try changing your search or attempt filters.</p>

          <button type="button" onClick={handleReset}>
            <LuRefreshCw size={14} strokeWidth={1.8} />

            <span>Clear Filters</span>
          </button>
        </div>
      )}

      {/* =================================================
          VIEW MODAL
      ================================================= */}

      {activeModal === "view" && selectedAttempt && (
        <div
          className="quiz-attempt-modal-backdrop"
          onClick={() => {
            setActiveModal(null);
            setSelectedAttempt(null);
          }}
        >
          <div
            className="quiz-attempt-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="quiz-attempt-modal-header">
              <div>
                <span>Attempt Details</span>

                <h3>{selectedAttempt.learner}</h3>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveModal(null);
                  setSelectedAttempt(null);
                }}
                aria-label="Close"
              >
                <LuX size={17} strokeWidth={1.8} />
              </button>
            </div>

            <div className="quiz-attempt-modal-body">
              <div className="quiz-modal-learner">
                <div className="quiz-modal-avatar">
                  {selectedAttempt.initials}
                </div>

                <div>
                  <strong>{selectedAttempt.learner}</strong>

                  <span>{selectedAttempt.email}</span>
                </div>
              </div>

              <div className="quiz-modal-score-panel">
                <span>Final Score</span>

                <strong>{selectedAttempt.score}%</strong>

                <small>{selectedAttempt.status}</small>
              </div>

              <div className="quiz-modal-info-grid">
                <div>
                  <span>Attempt</span>

                  <strong>#{selectedAttempt.attempt}</strong>
                </div>

                <div>
                  <span>Time Taken</span>

                  <strong>{selectedAttempt.timeTaken}</strong>
                </div>

                <div>
                  <span>Attempt Date</span>

                  <strong>{selectedAttempt.date}</strong>
                </div>

                <div>
                  <span>Completed At</span>

                  <strong>{selectedAttempt.time}</strong>
                </div>
              </div>

              {detailedResult && detailedResult.answers && detailedResult.answers.length > 0 && (
                <div
                  className="quiz-modal-answers-breakdown"
                  style={{
                    marginTop: "1.25rem",
                    paddingTop: "1rem",
                    borderTop: "1px solid rgba(0, 0, 0, 0.08)",
                  }}
                >
                  <h4
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      marginBottom: "0.75rem",
                    }}
                  >
                    Question Breakdown ({detailedResult.answers.length} Questions)
                  </h4>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                      maxHeight: "220px",
                      overflowY: "auto",
                      paddingRight: "0.25rem",
                    }}
                  >
                    {detailedResult.answers.map((ans, idx) => (
                      <div
                        key={ans.id || idx}
                        style={{
                          padding: "0.6rem 0.75rem",
                          borderRadius: "8px",
                          backgroundColor: ans.is_correct
                            ? "rgba(16, 185, 129, 0.08)"
                            : "rgba(239, 68, 68, 0.08)",
                          borderLeft: `3px solid ${
                            ans.is_correct ? "#10b981" : "#ef4444"
                          }`,
                        }}
                      >
                        <div
                          style={{
                            fontSize: "0.82rem",
                            fontWeight: 600,
                            marginBottom: "0.25rem",
                          }}
                        >
                          Q{idx + 1}. {ans.question_text}
                        </div>

                        <div
                          style={{
                            fontSize: "0.78rem",
                            display: "flex",
                            justifyContent: "space-between",
                            color: ans.is_correct ? "#047857" : "#b91c1c",
                          }}
                        >
                          <span>
                            Submitted Answer:{" "}
                            <strong>{ans.user_answer || "No answer"}</strong>
                          </span>

                          <span>
                            {ans.is_correct ? "✓ Correct" : `✗ Correct: ${ans.correct_answer}`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="quiz-attempt-modal-footer">
              <span>Attempt record #{selectedAttempt.id}</span>

              <button
                type="button"
                onClick={() => {
                  setActiveModal(null);
                  setSelectedAttempt(null);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================
          DELETE MODAL
      ================================================= */}

      {activeModal === "delete" && selectedAttempt && (
        <div
          className="quiz-attempt-modal-backdrop"
          onClick={() => {
            setActiveModal(null);
            setSelectedAttempt(null);
          }}
        >
          <div
            className="quiz-attempt-delete-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="quiz-attempt-delete-icon">
              <LuTrash2 size={20} strokeWidth={1.7} />
            </div>

            <h3>Delete Attempt Record?</h3>

            <p>
              This will remove the attempt record for{" "}
              <strong>{selectedAttempt.learner}</strong>. This action cannot be
              undone.
            </p>

            <div className="quiz-attempt-delete-actions">
              <button
                type="button"
                className="cancel"
                onClick={() => {
                  setActiveModal(null);
                  setSelectedAttempt(null);
                }}
              >
                Cancel
              </button>

              <button type="button" className="confirm" onClick={confirmDelete}>
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default QuizAttempts;
