import React, { useEffect, useRef, useState } from "react";

import {
  LuArrowUpDown,
  LuBookOpen,
  LuChevronDown,
  LuCircleCheck,
  LuFileText,
  LuFilter,
  LuGrid2X2,
  LuList,
  LuPlus,
  LuRotateCcw,
  LuSearch,
  LuTrash2,
  LuX,
} from "react-icons/lu";

import "./QuizFilters.css";

const QuizFilters = ({
  /* ======================================================
     VALUES FROM TRAINER QUIZZES
  ====================================================== */

  searchValue = "",
  course = "All Courses",
  status = "All Status",
  type = "All Types",
  sortValue = "Latest First",
  viewMode = "grid",

  /* ======================================================
     CALLBACKS TO TRAINER QUIZZES
  ====================================================== */

  onSearchChange,
  onCourseChange,
  onStatusChange,
  onTypeChange,
  onSortChange,
  onViewChange,
  onResetFilters,
  onCreateQuiz,
}) => {
  /* ======================================================
     LOCAL UI STATE

     This state is ONLY for UI behavior.
     Filter values themselves now belong to TrainerQuizzes.
  ====================================================== */

  const [openDropdown, setOpenDropdown] = useState(null);

  const filterRef = useRef(null);
  const searchRef = useRef(null);

  /* ======================================================
     OUTSIDE CLICK
  ====================================================== */

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  /* ======================================================
     KEYBOARD SHORTCUT
  ====================================================== */

  useEffect(() => {
    const handleKeyboard = (event) => {
      const isShortcut =
        (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k";

      if (isShortcut) {
        event.preventDefault();
        searchRef.current?.focus();
      }

      if (event.key === "Escape") {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("keydown", handleKeyboard);

    return () => {
      document.removeEventListener("keydown", handleKeyboard);
    };
  }, []);

  /* ======================================================
     OPTIONS
  ====================================================== */

  const courseOptions = [
    "All Courses",
    "Fundamentals of Meteorological Observations",
    "Weather Forecasting Techniques",
    "Doppler Weather Radar (DWR) Operations and Maintenance",
    "Climate Data Analysis and Management",
    "Disaster Warning and Dissemination Systems",
  ];

  const statusOptions = ["All Status", "Published", "Draft", "Archived"];

  const typeOptions = ["All Types", "Assessment", "Practice", "Final"];

  const sortOptions = [
    "Latest First",
    "Oldest First",
    "Name: A → Z",
    "Name: Z → A",
    "Most Attempts",
    "Highest Score",
  ];

  /* ======================================================
     SEARCH
  ====================================================== */

  const handleSearchChange = (event) => {
    const value = event.target.value;

    onSearchChange?.(value);
  };

  /* ======================================================
     COURSE
  ====================================================== */

  const handleCourseChange = (value) => {
    setOpenDropdown(null);

    onCourseChange?.(value);
  };

  /* ======================================================
     STATUS
  ====================================================== */

  const handleStatusChange = (value) => {
    setOpenDropdown(null);

    onStatusChange?.(value);
  };

  /* ======================================================
     TYPE
  ====================================================== */

  const handleTypeChange = (value) => {
    setOpenDropdown(null);

    onTypeChange?.(value);
  };

  /* ======================================================
     SORT
  ====================================================== */

  const handleSortChange = (value) => {
    setOpenDropdown(null);

    onSortChange?.(value);
  };

  /* ======================================================
     VIEW MODE
  ====================================================== */

  const handleViewChange = (mode) => {
    onViewChange?.(mode);
  };

  /* ======================================================
     RESET
  ====================================================== */

  const handleReset = () => {
    setOpenDropdown(null);

    onResetFilters?.();

    window.dispatchEvent(new CustomEvent("trainer-reset-quiz-filters"));
  };

  /* ======================================================
     CLEAR SEARCH
  ====================================================== */

  const handleClearSearch = () => {
    onSearchChange?.("");

    searchRef.current?.focus();
  };

  /* ======================================================
     CREATE QUIZ
  ====================================================== */

  const handleCreateQuiz = () => {
    if (onCreateQuiz) {
      onCreateQuiz();
      return;
    }

    window.dispatchEvent(new CustomEvent("trainer-create-quiz"));
  };

  /* ======================================================
     REMOVE INDIVIDUAL FILTER
  ====================================================== */

  const removeFilter = (filterName) => {
    switch (filterName) {
      case "search":
        onSearchChange?.("");
        break;

      case "course":
        onCourseChange?.("All Courses");
        break;

      case "status":
        onStatusChange?.("All Status");
        break;

      case "type":
        onTypeChange?.("All Types");
        break;

      default:
        break;
    }
  };

  /* ======================================================
     DROPDOWN TOGGLE
  ====================================================== */

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown((previous) =>
      previous === dropdownName ? null : dropdownName,
    );
  };

  /* ======================================================
     DROPDOWN COMPONENT
  ====================================================== */

  const renderDropdown = ({
    name,
    value,
    options,
    icon: Icon,
    theme,
    onChange,
  }) => {
    return (
      <div className={`quiz-filter-control ${theme}`}>
        <button
          type="button"
          className={`quiz-filter-trigger ${
            openDropdown === name ? "is-open" : ""
          }`}
          aria-haspopup="listbox"
          aria-expanded={openDropdown === name}
          onClick={() => toggleDropdown(name)}
        >
          <span className="quiz-filter-trigger-icon">
            <Icon size={16} strokeWidth={1.8} />
          </span>

          <span className="quiz-filter-trigger-value">{value}</span>

          <LuChevronDown
            className={`quiz-filter-chevron ${
              openDropdown === name ? "rotate" : ""
            }`}
            size={15}
            strokeWidth={1.9}
          />
        </button>

        {openDropdown === name && (
          <div
            className="quiz-filter-dropdown"
            role="listbox"
            aria-label={name}
          >
            {options.map((option) => (
              <button
                type="button"
                role="option"
                aria-selected={value === option}
                key={option}
                className={`quiz-filter-option ${
                  value === option ? "selected" : ""
                }`}
                onClick={() => onChange(option)}
              >
                <span>{option}</span>

                {value === option && (
                  <LuCircleCheck size={15} strokeWidth={1.8} />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  /* ======================================================
     ACTIVE FILTERS
  ====================================================== */

  const activeFilters = [];

  if (searchValue.trim()) {
    activeFilters.push({
      id: "search",
      label: `Search: ${searchValue.trim()}`,
      className: "search-chip",
    });
  }

  if (course !== "All Courses") {
    activeFilters.push({
      id: "course",
      label: `Course: ${course}`,
      className: "course-chip",
    });
  }

  if (status !== "All Status") {
    activeFilters.push({
      id: "status",
      label: `Status: ${status}`,
      className: "status-chip",
    });
  }

  if (type !== "All Types") {
    activeFilters.push({
      id: "type",
      label: `Type: ${type}`,
      className: "type-chip",
    });
  }

  /* ======================================================
     JSX
  ====================================================== */

  return (
    <section className="quiz-filters" ref={filterRef} aria-label="Quiz filters">
      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="quiz-filters-header">
        <div className="quiz-filters-title-area">
          <div className="quiz-filters-title-icon">
            <LuFilter size={19} strokeWidth={1.7} />
          </div>

          <div className="quiz-filters-heading">
            <div className="quiz-filters-title-row">
              <h2>Quiz Filters</h2>

              <span className="quiz-filters-count">24 Total Quizzes</span>
            </div>

            <p>Search and filter quizzes to find what you need.</p>
          </div>
        </div>

        {/* ================================================
            VIEW MODE
        ================================================= */}

        <div className="quiz-filters-header-actions">
          <div className="quiz-view-switch">
            <button
              type="button"
              className={viewMode === "grid" ? "active" : ""}
              onClick={() => handleViewChange("grid")}
              aria-label="Grid view"
              aria-pressed={viewMode === "grid"}
            >
              <LuGrid2X2 size={16} strokeWidth={1.8} />

              <span>Grid</span>
            </button>

            <button
              type="button"
              className={viewMode === "list" ? "active" : ""}
              onClick={() => handleViewChange("list")}
              aria-label="List view"
              aria-pressed={viewMode === "list"}
            >
              <LuList size={17} strokeWidth={1.8} />

              <span>List</span>
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================
          FILTER CONTROLS
      ================================================== */}

      <div className="quiz-filters-controls">
        {/* ================================================
            SEARCH
        ================================================= */}

        <div className="quiz-search-control">
          <LuSearch className="quiz-search-icon" size={18} strokeWidth={1.8} />

          <input
            ref={searchRef}
            type="search"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Search quizzes, topics or keywords..."
            aria-label="Search quizzes"
          />

          {searchValue ? (
            <button
              type="button"
              className="quiz-search-clear"
              onClick={handleClearSearch}
              aria-label="Clear search"
            >
              <LuX size={15} strokeWidth={2} />
            </button>
          ) : (
            <span className="quiz-search-shortcut">Ctrl K</span>
          )}
        </div>

        {/* ================================================
            COURSE
        ================================================= */}

        {renderDropdown({
          name: "course",
          value: course,
          options: courseOptions,
          icon: LuBookOpen,
          theme: "course-theme",
          onChange: handleCourseChange,
        })}

        {/* ================================================
            STATUS
        ================================================= */}

        {renderDropdown({
          name: "status",
          value: status,
          options: statusOptions,
          icon: LuCircleCheck,
          theme: "status-theme",
          onChange: handleStatusChange,
        })}

        {/* ================================================
            TYPE
        ================================================= */}

        {renderDropdown({
          name: "type",
          value: type,
          options: typeOptions,
          icon: LuFileText,
          theme: "type-theme",
          onChange: handleTypeChange,
        })}

        {/* ================================================
            SORT
        ================================================= */}

        {renderDropdown({
          name: "sort",
          value: sortValue,
          options: sortOptions,
          icon: LuArrowUpDown,
          theme: "sort-theme",
          onChange: handleSortChange,
        })}

        {/* ================================================
            RESET
        ================================================= */}

        <button
          type="button"
          className="quiz-reset-button"
          onClick={handleReset}
        >
          <LuRotateCcw size={16} strokeWidth={1.8} />

          <span>Reset</span>
        </button>

        {/* ================================================
            CREATE QUIZ
        ================================================= */}

        <button
          type="button"
          className="quiz-create-button"
          onClick={handleCreateQuiz}
        >
          <LuPlus size={17} strokeWidth={1.9} />

          <span>Create Quiz</span>
        </button>
      </div>

      {/* ==================================================
          ACTIVE FILTERS
      ================================================== */}

      <div className="quiz-active-filters">
        <div className="quiz-active-left">
          <span className="quiz-active-label">Active Filters:</span>

          {activeFilters.length > 0 ? (
            <div className="quiz-active-chips">
              {activeFilters.map((filter) => (
                <span
                  key={filter.id}
                  className={`quiz-filter-chip ${filter.className}`}
                >
                  <span>{filter.label}</span>

                  <button
                    type="button"
                    onClick={() => removeFilter(filter.id)}
                    aria-label={`Remove ${filter.label}`}
                  >
                    <LuX size={14} strokeWidth={2} />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <span className="quiz-no-active-filters">No active filters</span>
          )}
        </div>

        {/* ================================================
            CLEAR ALL
        ================================================= */}

        {activeFilters.length > 0 && (
          <button
            type="button"
            className="quiz-clear-all-button"
            onClick={handleReset}
          >
            <LuTrash2 size={15} strokeWidth={1.8} />

            <span>Clear All</span>
          </button>
        )}
      </div>
    </section>
  );
};

export default QuizFilters;
