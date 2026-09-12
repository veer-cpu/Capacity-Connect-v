import React, { useMemo, useState } from "react";
import {
  LuCheck,
  LuChevronDown,
  LuChevronLeft,
  LuChevronRight,
  LuCircle,
  LuCopy,
  LuEllipsis,
  LuEye,
  LuFilePenLine,
  LuFileText,
  LuGrid2X2,
  LuList,
  LuPlus,
  LuSearch,
  LuTrash2,
  LuX,
} from "react-icons/lu";

import {
  addQuestion as addQuestionApi,
  updateQuestion as updateQuestionApi,
  deleteQuestion as deleteQuestionApi,
} from "../../../../../services/quizApi";

import "./QuizQuestions.css";

/* =========================================================
   QUESTION DATA
========================================================= */

const initialQuestions = [
  {
    id: 1,
    number: 1,
    type: "MCQ",
    question: "What is React?",
    description: "Select the correct answer from the options below.",
    options: [
      "A JavaScript library for building user interfaces",
      "A programming language",
      "A database management system",
      "An operating system",
    ],
    correctAnswer: 0,
    marks: 2,
    difficulty: "Easy",
    theme: "blue",
  },

  {
    id: 2,
    number: 2,
    type: "MCQ",
    question:
      "Which React hook is used to manage state in a functional component?",
    description: "Choose the correct option.",
    options: ["useEffect()", "useState()", "useContext()", "useReducer()"],
    correctAnswer: 1,
    marks: 2,
    difficulty: "Medium",
    theme: "lavender",
  },

  {
    id: 3,
    number: 3,
    type: "True/False",
    question: "React can only be used for building web applications.",
    description: "Select whether the statement is true or false.",
    options: ["True", "False"],
    correctAnswer: 1,
    marks: 1,
    difficulty: "Easy",
    theme: "rose",
  },

  {
    id: 4,
    number: 4,
    type: "MCQ",
    question: "Which of the following is a key feature of React?",
    description: "Select the most appropriate answer.",
    options: [
      "Two-way data binding",
      "Component-based architecture",
      "Built-in routing",
      "Direct DOM manipulation",
    ],
    correctAnswer: 1,
    marks: 2,
    difficulty: "Medium",
    theme: "sky",
  },

  {
    id: 5,
    number: 5,
    type: "MCQ",
    question: "What is JSX in React?",
    description: "Choose the best definition.",
    options: [
      "A syntax extension for JavaScript",
      "A database query language",
      "A CSS framework",
      "A testing library",
    ],
    correctAnswer: 0,
    marks: 2,
    difficulty: "Easy",
    theme: "mint",
  },

  {
    id: 6,
    number: 6,
    type: "True/False",
    question: "A React component must always return a single HTML element.",
    description: "Select whether the statement is true or false.",
    options: ["True", "False"],
    correctAnswer: 1,
    marks: 1,
    difficulty: "Medium",
    theme: "peach",
  },

  {
    id: 7,
    number: 7,
    type: "MCQ",
    question: "Which hook is commonly used for side effects in React?",
    description: "Select the correct hook.",
    options: ["useMemo()", "useEffect()", "useState()", "useRef()"],
    correctAnswer: 1,
    marks: 2,
    difficulty: "Easy",
    theme: "blue",
  },

  {
    id: 8,
    number: 8,
    type: "MCQ",
    question: "What does the virtual DOM help React optimize?",
    description: "Choose the most appropriate answer.",
    options: [
      "Database queries",
      "Network requests",
      "UI updates",
      "Server configuration",
    ],
    correctAnswer: 2,
    marks: 2,
    difficulty: "Medium",
    theme: "lavender",
  },

  {
    id: 9,
    number: 9,
    type: "MCQ",
    question: "Which prop is commonly used to identify list items in React?",
    description: "Select the correct property.",
    options: ["id", "key", "name", "index"],
    correctAnswer: 1,
    marks: 2,
    difficulty: "Easy",
    theme: "mint",
  },

  {
    id: 10,
    number: 10,
    type: "True/False",
    question:
      "Props are used to pass data from a parent component to a child component.",
    description: "Select whether the statement is true or false.",
    options: ["True", "False"],
    correctAnswer: 0,
    marks: 1,
    difficulty: "Easy",
    theme: "rose",
  },

  {
    id: 11,
    number: 11,
    type: "MCQ",
    question:
      "Which hook can store a mutable value without causing a re-render?",
    description: "Choose the correct hook.",
    options: ["useState()", "useEffect()", "useRef()", "useMemo()"],
    correctAnswer: 2,
    marks: 2,
    difficulty: "Medium",
    theme: "sky",
  },

  {
    id: 12,
    number: 12,
    type: "MCQ",
    question: "What is the purpose of React fragments?",
    description: "Choose the correct purpose.",
    options: [
      "To avoid unnecessary wrapper elements",
      "To create API requests",
      "To manage state",
      "To style components",
    ],
    correctAnswer: 0,
    marks: 2,
    difficulty: "Medium",
    theme: "peach",
  },

  {
    id: 13,
    number: 13,
    type: "MCQ",
    question: "Which command creates a new React application with Vite?",
    description: "Choose the correct command.",
    options: [
      "npm create vite@latest",
      "npm install react-app",
      "npm create react-server",
      "npm start react",
    ],
    correctAnswer: 0,
    marks: 2,
    difficulty: "Easy",
    theme: "blue",
  },

  {
    id: 14,
    number: 14,
    type: "True/False",
    question: "React state should be modified directly.",
    description: "Select whether the statement is true or false.",
    options: ["True", "False"],
    correctAnswer: 1,
    marks: 1,
    difficulty: "Medium",
    theme: "lavender",
  },

  {
    id: 15,
    number: 15,
    type: "MCQ",
    question: "Which method is commonly used to render an array of elements?",
    description: "Choose the correct JavaScript method.",
    options: ["filter()", "map()", "reduce()", "find()"],
    correctAnswer: 1,
    marks: 2,
    difficulty: "Easy",
    theme: "mint",
  },

  {
    id: 16,
    number: 16,
    type: "MCQ",
    question: "What does useMemo primarily help with?",
    description: "Select the most appropriate answer.",
    options: [
      "Memoizing expensive calculations",
      "Creating routes",
      "Sending HTTP requests",
      "Creating CSS classes",
    ],
    correctAnswer: 0,
    marks: 2,
    difficulty: "Hard",
    theme: "rose",
  },

  {
    id: 17,
    number: 17,
    type: "True/False",
    question: "React applications can contain reusable components.",
    description: "Select whether the statement is true or false.",
    options: ["True", "False"],
    correctAnswer: 0,
    marks: 1,
    difficulty: "Easy",
    theme: "sky",
  },

  {
    id: 18,
    number: 18,
    type: "MCQ",
    question:
      "Which file commonly contains the root React component in a Vite project?",
    description: "Choose the most appropriate answer.",
    options: ["App.jsx", "index.css", "package.json", "vite.config.js"],
    correctAnswer: 0,
    marks: 2,
    difficulty: "Easy",
    theme: "peach",
  },

  {
    id: 19,
    number: 19,
    type: "MCQ",
    question: "What is a controlled input in React?",
    description: "Choose the correct definition.",
    options: [
      "An input controlled by React state",
      "An input controlled only by CSS",
      "An input without a value",
      "An input controlled by the browser only",
    ],
    correctAnswer: 0,
    marks: 2,
    difficulty: "Medium",
    theme: "blue",
  },

  {
    id: 20,
    number: 20,
    type: "MCQ",
    question:
      "Which library is commonly used for client-side routing in React?",
    description: "Choose the correct library.",
    options: ["React Router", "Express", "Mongoose", "Axios"],
    correctAnswer: 0,
    marks: 2,
    difficulty: "Easy",
    theme: "lavender",
  },
];

/* =========================================================
   QUESTION TYPES
========================================================= */

const questionTypes = ["All Types", "MCQ", "True/False", "Short Answer"];

/* =========================================================
   DIFFICULTIES
========================================================= */

const difficulties = ["All Difficulties", "Easy", "Medium", "Hard"];

/* =========================================================
   SORT OPTIONS
========================================================= */

const sortOptions = [
  "Newest First",
  "Oldest First",
  "Highest Marks",
  "Easiest First",
  "Hardest First",
];

/* =========================================================
   QUIZ QUESTIONS
========================================================= */

const normalizeQuestion = (q, idx) => {
  let opts = q.options || [];
  if (typeof opts === "string") {
    try {
      opts = JSON.parse(opts);
    } catch (e) {
      opts = [opts];
    }
  }
  return {
    ...q,
    id: q.id || idx + 1,
    number: q.number || q.order_index || idx + 1,
    question: q.question || q.question_text || "",
    description: q.description || "Select the correct answer from the options below.",
    type: q.type || (q.question_type === "MULTIPLE_CHOICE" ? "MCQ" : q.question_type) || "MCQ",
    options: Array.isArray(opts) ? opts : [],
    correctAnswer: q.correctAnswer ?? q.correct_answer,
    marks: Number(q.marks) || 10,
    difficulty: q.difficulty || "Medium",
    theme: q.theme || ["blue", "lavender", "rose", "sky", "mint", "peach"][idx % 6],
  };
};

const QuizQuestions = ({
  quizId,
  questions: externalQuestions,
  onAddQuestion,
  onEditQuestion,
  onDeleteQuestion,
}) => {
  /* =======================================================
     STATE
  ======================================================= */

  const [questions, setQuestions] = useState(() =>
    (externalQuestions || initialQuestions).map(normalizeQuestion),
  );

  React.useEffect(() => {
    if (externalQuestions && externalQuestions.length > 0) {
      setQuestions(externalQuestions.map(normalizeQuestion));
    }
  }, [externalQuestions]);

  const [qText, setQText] = useState("");
  const [qOptionA, setQOptionA] = useState("");
  const [qOptionB, setQOptionB] = useState("");
  const [qOptionC, setQOptionC] = useState("");
  const [qOptionD, setQOptionD] = useState("");
  const [qCorrect, setQCorrect] = useState("");
  const [qMarks, setQMarks] = useState(10);

  const [searchValue, setSearchValue] = useState("");

  const [selectedType, setSelectedType] = useState("All Types");

  const [selectedDifficulty, setSelectedDifficulty] =
    useState("All Difficulties");

  const [sortValue, setSortValue] = useState("Newest First");

  const [viewMode, setViewMode] = useState("list");

  const [currentPage, setCurrentPage] = useState(1);

  const [rowsPerPage, setRowsPerPage] = useState(4);

  const [openMenu, setOpenMenu] = useState(null);

  const [openFilter, setOpenFilter] = useState(null);

  const [activeModal, setActiveModal] = useState(null);

  const [selectedQuestion, setSelectedQuestion] = useState(null);

  /* =======================================================
     FILTER + SORT
  ======================================================= */

  const filteredQuestions = useMemo(() => {
    let result = [...questions];

    const search = searchValue.trim().toLowerCase();

    if (search) {
      result = result.filter((question) => {
        return (
          question.question.toLowerCase().includes(search) ||
          question.description.toLowerCase().includes(search) ||
          question.type.toLowerCase().includes(search) ||
          question.difficulty.toLowerCase().includes(search)
        );
      });
    }

    if (selectedType !== "All Types") {
      result = result.filter((question) => question.type === selectedType);
    }

    if (selectedDifficulty !== "All Difficulties") {
      result = result.filter(
        (question) => question.difficulty === selectedDifficulty,
      );
    }

    switch (sortValue) {
      case "Oldest First":
        result.sort((a, b) => b.id - a.id);
        break;

      case "Highest Marks":
        result.sort((a, b) => b.marks - a.marks);
        break;

      case "Easiest First":
        result.sort((a, b) => {
          const order = {
            Easy: 1,
            Medium: 2,
            Hard: 3,
          };

          return order[a.difficulty] - order[b.difficulty];
        });
        break;

      case "Hardest First":
        result.sort((a, b) => {
          const order = {
            Easy: 1,
            Medium: 2,
            Hard: 3,
          };

          return order[b.difficulty] - order[a.difficulty];
        });
        break;

      case "Newest First":
      default:
        result.sort((a, b) => a.id - b.id);
        break;
    }

    return result;
  }, [questions, searchValue, selectedType, selectedDifficulty, sortValue]);

  /* =======================================================
     PAGINATION
  ======================================================= */

  const totalPages = Math.max(
    1,
    Math.ceil(filteredQuestions.length / rowsPerPage),
  );

  const startIndex = (currentPage - 1) * rowsPerPage;

  const visibleQuestions = filteredQuestions.slice(
    startIndex,
    startIndex + rowsPerPage,
  );

  /* =======================================================
     RESET PAGE WHEN FILTER CHANGES
  ======================================================= */

  React.useEffect(() => {
    setCurrentPage(1);
    setOpenMenu(null);
  }, [searchValue, selectedType, selectedDifficulty, sortValue, rowsPerPage]);

  /* =======================================================
     CLOSE MENUS
  ======================================================= */

  React.useEffect(() => {
    const handleDocumentClick = () => {
      setOpenMenu(null);
      setOpenFilter(null);
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  /* =======================================================
     ESCAPE
  ======================================================= */

  React.useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpenMenu(null);
        setOpenFilter(null);
        setActiveModal(null);
        setSelectedQuestion(null);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  /* =======================================================
     FILTER DROPDOWN
  ======================================================= */

  const handleFilterClick = (event, filterName) => {
    event.stopPropagation();

    setOpenMenu(null);

    setOpenFilter((previous) => (previous === filterName ? null : filterName));
  };

  /* =======================================================
     FILTER VALUE
  ======================================================= */

  const handleFilterValue = (value, setter) => {
    setter(value);
    setOpenFilter(null);
  };

  /* =======================================================
     MENU TOGGLE
  ======================================================= */

  const handleMenuToggle = (event, questionId) => {
    event.stopPropagation();

    setOpenFilter(null);

    setOpenMenu((previous) => (previous === questionId ? null : questionId));
  };

  /* =======================================================
     VIEW QUESTION
  ======================================================= */

  const handleViewQuestion = (question) => {
    setOpenMenu(null);
    setSelectedQuestion(question);
    setActiveModal("view");
  };

  /* =======================================================
     EDIT QUESTION
  ======================================================= */

  const handleEditQuestion = (question) => {
    setOpenMenu(null);
    setSelectedQuestion(question);
    const opts = question.options || [];
    setQText(question.question || question.question_text || "");
    setQOptionA(opts[0] || "");
    setQOptionB(opts[1] || "");
    setQOptionC(opts[2] || "");
    setQOptionD(opts[3] || "");
    setQCorrect((question.correctAnswer ?? question.correct_answer ?? opts[0]) || "");
    setQMarks(question.marks || 10);
    setActiveModal("edit");

    if (onEditQuestion) {
      onEditQuestion(question);
    }
  };

  /* =======================================================
     DUPLICATE QUESTION
  ======================================================= */

  const handleDuplicateQuestion = (question) => {
    const duplicatedQuestion = {
      ...question,
      id: Date.now(),
      number: questions.length + 1,
      question: `${question.question} (Copy)`,
    };

    setQuestions((previous) => [...previous, duplicatedQuestion]);

    setOpenMenu(null);
  };

  /* =======================================================
     DELETE QUESTION
  ======================================================= */

  const handleDeleteQuestion = (question) => {
    setOpenMenu(null);
    setSelectedQuestion(question);
    setActiveModal("delete");
  };

  const confirmDelete = () => {
    if (!selectedQuestion) {
      return;
    }

    const qId = selectedQuestion.id;
    if (qId && typeof qId === "number") {
      deleteQuestionApi(qId, "TRAINER").catch((err) =>
        console.error("Failed to delete question from backend:", err),
      );
    }

    setQuestions((previous) =>
      previous.filter((question) => question.id !== qId),
    );

    if (onDeleteQuestion) {
      onDeleteQuestion(selectedQuestion);
    }

    setSelectedQuestion(null);
    setActiveModal(null);
  };

  /* =======================================================
     ADD QUESTION
  ======================================================= */

  const handleAddQuestion = () => {
    setSelectedQuestion(null);
    setQText("");
    setQOptionA("");
    setQOptionB("");
    setQOptionC("");
    setQOptionD("");
    setQCorrect("");
    setQMarks(10);
    setActiveModal("add");

    if (onAddQuestion) {
      onAddQuestion();
    }
  };

  const saveNewQuestion = async () => {
    const opts = [qOptionA, qOptionB, qOptionC, qOptionD].filter(Boolean);
    const correctVal = qCorrect || opts[0] || "";
    const newOrder = questions.length + 1;

    try {
      if (quizId) {
        const created = await addQuestionApi(
          quizId,
          {
            questionText: qText || "New Question",
            questionType: "MULTIPLE_CHOICE",
            options: opts.length > 0 ? opts : ["Option A", "Option B", "Option C", "Option D"],
            correctAnswer: correctVal,
            marks: Number(qMarks) || 10,
            orderIndex: newOrder,
          },
          "TRAINER",
        );
        const norm = normalizeQuestion(created, questions.length);
        setQuestions((prev) => [...prev, norm]);
      } else {
        const localQ = normalizeQuestion(
          {
            id: Date.now(),
            question_text: qText || "New Question",
            options: opts,
            correct_answer: correctVal,
            marks: Number(qMarks) || 10,
            order_index: newOrder,
          },
          questions.length,
        );
        setQuestions((prev) => [...prev, localQ]);
      }
    } catch (err) {
      console.error("Failed to add question to backend:", err);
    }

    closeModal();
  };

  const saveEditedQuestion = async () => {
    if (!selectedQuestion) return;

    const opts = [qOptionA, qOptionB, qOptionC, qOptionD].filter(Boolean);
    const correctVal = qCorrect || opts[0] || "";

    try {
      if (selectedQuestion.id && typeof selectedQuestion.id === "number") {
        await updateQuestionApi(
          selectedQuestion.id,
          {
            questionText: qText,
            options: opts,
            correctAnswer: correctVal,
            marks: Number(qMarks) || 10,
          },
          "TRAINER",
        );
      }

      setQuestions((prev) =>
        prev.map((q) =>
          q.id === selectedQuestion.id
            ? normalizeQuestion(
                {
                  ...q,
                  question: qText,
                  question_text: qText,
                  options: opts,
                  correctAnswer: correctVal,
                  correct_answer: correctVal,
                  marks: Number(qMarks) || 10,
                },
                q.number - 1,
              )
            : q,
        ),
      );
    } catch (err) {
      console.error("Failed to update question on backend:", err);
    }

    closeModal();
  };

  /* =======================================================
     CLOSE MODAL
  ======================================================= */

  const closeModal = () => {
    setActiveModal(null);
    setSelectedQuestion(null);
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
     STATUS / DIFFICULTY CLASS
  ======================================================= */

  const getDifficultyClass = (difficulty) => {
    return difficulty.toLowerCase();
  };

  /* =======================================================
     PAGE NUMBERS
  ======================================================= */

  const renderPageNumbers = () => {
    return Array.from(
      {
        length: totalPages,
      },
      (_, index) => index + 1,
    ).map((page) => (
      <button
        type="button"
        key={page}
        className={`quiz-questions-page-number ${
          currentPage === page ? "active" : ""
        }`}
        onClick={() => handlePageChange(page)}
      >
        {page}
      </button>
    ));
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section className="quiz-questions">
      {/* =================================================
          SECTION HEADER
      ================================================= */}

      <div className="quiz-questions-header">
        <div className="quiz-questions-heading-group">
          <div className="quiz-questions-heading-icon">
            <LuFileText size={19} strokeWidth={1.7} />
          </div>

          <div className="quiz-questions-heading">
            <div className="quiz-questions-title-row">
              <h2>Quiz Questions</h2>

              <span className="quiz-questions-count">
                {filteredQuestions.length} Questions
              </span>
            </div>

            <p>Manage, edit and organize all questions in this quiz.</p>
          </div>
        </div>

        <button
          type="button"
          className="quiz-add-question-button"
          onClick={handleAddQuestion}
        >
          <LuPlus size={15} strokeWidth={2} />
          <span>Add Question</span>
        </button>
      </div>

      {/* =================================================
          FILTER TOOLBAR
      ================================================= */}

      <div className="quiz-questions-toolbar">
        {/* SEARCH */}

        <div className="quiz-question-search">
          <LuSearch size={16} strokeWidth={1.8} />

          <input
            type="search"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Search questions..."
            aria-label="Search questions"
          />

          {searchValue && (
            <button
              type="button"
              className="quiz-search-clear"
              onClick={() => setSearchValue("")}
              aria-label="Clear search"
            >
              <LuX size={13} strokeWidth={1.9} />
            </button>
          )}
        </div>

        {/* TYPE */}

        <div
          className="quiz-question-filter"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            className={`quiz-filter-trigger ${
              openFilter === "type" ? "active" : ""
            }`}
            onClick={(event) => handleFilterClick(event, "type")}
          >
            <LuList size={15} strokeWidth={1.8} />

            <span>{selectedType}</span>

            <LuChevronDown
              className={openFilter === "type" ? "rotate" : ""}
              size={14}
              strokeWidth={1.8}
            />
          </button>

          {openFilter === "type" && (
            <div className="quiz-filter-dropdown">
              {questionTypes.map((option) => (
                <button
                  type="button"
                  key={option}
                  className={selectedType === option ? "selected" : ""}
                  onClick={() => handleFilterValue(option, setSelectedType)}
                >
                  <span>{option}</span>

                  {selectedType === option && (
                    <LuCheck size={14} strokeWidth={2} />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* DIFFICULTY */}

        <div
          className="quiz-question-filter"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            className={`quiz-filter-trigger ${
              openFilter === "difficulty" ? "active" : ""
            }`}
            onClick={(event) => handleFilterClick(event, "difficulty")}
          >
            <LuCircle size={15} strokeWidth={1.8} />

            <span>{selectedDifficulty}</span>

            <LuChevronDown
              className={openFilter === "difficulty" ? "rotate" : ""}
              size={14}
              strokeWidth={1.8}
            />
          </button>

          {openFilter === "difficulty" && (
            <div className="quiz-filter-dropdown">
              {difficulties.map((option) => (
                <button
                  type="button"
                  key={option}
                  className={selectedDifficulty === option ? "selected" : ""}
                  onClick={() =>
                    handleFilterValue(option, setSelectedDifficulty)
                  }
                >
                  <span>{option}</span>

                  {selectedDifficulty === option && (
                    <LuCheck size={14} strokeWidth={2} />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* SORT */}

        <div
          className="quiz-question-filter"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            className={`quiz-filter-trigger ${
              openFilter === "sort" ? "active" : ""
            }`}
            onClick={(event) => handleFilterClick(event, "sort")}
          >
            <LuList size={15} strokeWidth={1.8} />

            <span>{sortValue}</span>

            <LuChevronDown
              className={openFilter === "sort" ? "rotate" : ""}
              size={14}
              strokeWidth={1.8}
            />
          </button>

          {openFilter === "sort" && (
            <div className="quiz-filter-dropdown">
              {sortOptions.map((option) => (
                <button
                  type="button"
                  key={option}
                  className={sortValue === option ? "selected" : ""}
                  onClick={() => handleFilterValue(option, setSortValue)}
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

        {/* VIEW SWITCH */}

        <div className="quiz-question-view-switch">
          <button
            type="button"
            className={viewMode === "list" ? "active" : ""}
            onClick={() => setViewMode("list")}
            aria-label="List view"
            aria-pressed={viewMode === "list"}
          >
            <LuList size={16} strokeWidth={1.8} />
          </button>

          <button
            type="button"
            className={viewMode === "grid" ? "active" : ""}
            onClick={() => setViewMode("grid")}
            aria-label="Grid view"
            aria-pressed={viewMode === "grid"}
          >
            <LuGrid2X2 size={15} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {/* =================================================
          QUESTION LIST
      ================================================= */}

      {visibleQuestions.length > 0 ? (
        <div
          className={`quiz-question-list ${
            viewMode === "grid" ? "quiz-question-grid-mode" : ""
          }`}
        >
          {visibleQuestions.map((question) => (
            <article
              key={question.id}
              className={`quiz-question-card quiz-question-${question.theme}`}
            >
              {/* =========================================
                  QUESTION NUMBER
              ========================================= */}

              <div className="quiz-question-number">
                Q{String(question.number).padStart(2, "0")}
                <span>{question.marks} marks</span>
              </div>

              {/* =========================================
                  QUESTION CONTENT
              ========================================= */}

              <div className="quiz-question-content">
                {/* TOP */}

                <div className="quiz-question-top">
                  <div className="quiz-question-title-area">
                    <div className="quiz-question-title-line">
                      <h3>{question.question}</h3>

                      <span
                        className={`quiz-question-type ${question.type
                          .toLowerCase()
                          .replace("/", "-")
                          .replace(/\s+/g, "-")}`}
                      >
                        {question.type}
                      </span>
                    </div>

                    <p>{question.description}</p>
                  </div>

                  {/* MENU */}

                  <div className="quiz-question-menu">
                    <button
                      type="button"
                      className={`quiz-question-menu-button ${
                        openMenu === question.id ? "active" : ""
                      }`}
                      onClick={(event) => handleMenuToggle(event, question.id)}
                      aria-label={`More actions for ${question.question}`}
                      aria-expanded={openMenu === question.id}
                    >
                      <LuEllipsis size={17} strokeWidth={1.9} />
                    </button>

                    {openMenu === question.id && (
                      <div className="quiz-question-action-menu">
                        <button
                          type="button"
                          onClick={() => handleViewQuestion(question)}
                        >
                          <LuEye size={14} strokeWidth={1.8} />

                          <span>View</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleEditQuestion(question)}
                        >
                          <LuFilePenLine size={14} strokeWidth={1.8} />

                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDuplicateQuestion(question)}
                        >
                          <LuCopy size={14} strokeWidth={1.8} />

                          <span>Duplicate</span>
                        </button>

                        <button
                          type="button"
                          className="danger"
                          onClick={() => handleDeleteQuestion(question)}
                        >
                          <LuTrash2 size={14} strokeWidth={1.8} />

                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* =======================================
                    OPTIONS
                ======================================= */}

                <div className="quiz-question-options">
                  {question.options.map((option, index) => {
                    const cVal = question.correctAnswer ?? question.correct_answer;
                    const isCorrect =
                      typeof cVal === "number"
                        ? index === cVal
                        : cVal !== undefined && cVal !== null
                        ? String(option).trim().toLowerCase() === String(cVal).trim().toLowerCase()
                        : false;

                    return (
                      <div
                        key={`${question.id}-${option}`}
                        className={`quiz-question-option ${
                          isCorrect ? "correct" : ""
                        }`}
                      >
                        <span className="quiz-option-radio">
                          {isCorrect ? (
                            <LuCheck size={11} strokeWidth={2.4} />
                          ) : (
                            <LuCircle size={13} strokeWidth={1.5} />
                          )}
                        </span>

                        <span className="quiz-option-text">
                          {String.fromCharCode(65 + index)}. {option}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* =======================================
                    BOTTOM INFORMATION
                ======================================= */}

                <div className="quiz-question-bottom">
                  <div className="quiz-question-meta">
                    <span
                      className={`quiz-difficulty-badge ${getDifficultyClass(
                        question.difficulty,
                      )}`}
                    >
                      <span className="quiz-difficulty-dot" />

                      {question.difficulty}
                    </span>

                    <span className="quiz-correct-answer">
                      <LuCheck size={12} strokeWidth={2} />
                      Correct Answer:{" "}
                      <strong>
                        {(() => {
                          const cVal = question.correctAnswer ?? question.correct_answer;
                          if (cVal === undefined || cVal === null) return "N/A";
                          if (typeof cVal === "number") return String.fromCharCode(65 + cVal);
                          if (Array.isArray(question.options)) {
                            const idx = question.options.findIndex(
                              (o) => String(o).trim().toLowerCase() === String(cVal).trim().toLowerCase()
                            );
                            if (idx !== -1) return `${String.fromCharCode(65 + idx)} (${cVal})`;
                          }
                          return String(cVal);
                        })()}
                      </strong>
                    </span>
                  </div>

                  <div className="quiz-question-actions">
                    <button
                      type="button"
                      className="quiz-question-action view"
                      onClick={() => handleViewQuestion(question)}
                    >
                      <LuEye size={14} strokeWidth={1.8} />

                      <span>View</span>
                    </button>

                    <button
                      type="button"
                      className="quiz-question-action edit"
                      onClick={() => handleEditQuestion(question)}
                    >
                      <LuFilePenLine size={14} strokeWidth={1.8} />

                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      className="quiz-question-action duplicate"
                      onClick={() => handleDuplicateQuestion(question)}
                    >
                      <LuCopy size={14} strokeWidth={1.8} />

                      <span>Duplicate</span>
                    </button>

                    <button
                      type="button"
                      className="quiz-question-action delete"
                      onClick={() => handleDeleteQuestion(question)}
                    >
                      <LuTrash2 size={14} strokeWidth={1.8} />

                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        /* =================================================
           EMPTY STATE
        ================================================= */

        <div className="quiz-questions-empty">
          <div className="quiz-questions-empty-icon">
            <LuSearch size={22} strokeWidth={1.6} />
          </div>

          <h3>No questions found</h3>

          <p>Try changing your search or question filters.</p>

          <button
            type="button"
            onClick={() => {
              setSearchValue("");
              setSelectedType("All Types");
              setSelectedDifficulty("All Difficulties");
              setSortValue("Newest First");
            }}
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* =================================================
          FOOTER
      ================================================= */}

      {filteredQuestions.length > 0 && (
        <div className="quiz-questions-footer">
          {/* SHOWING */}

          <div className="quiz-questions-showing">
            Showing <strong>{startIndex + 1}</strong> to{" "}
            <strong>
              {Math.min(startIndex + rowsPerPage, filteredQuestions.length)}
            </strong>{" "}
            of <strong>{filteredQuestions.length}</strong> questions
          </div>

          {/* PAGINATION */}

          <div className="quiz-questions-pagination">
            <button
              type="button"
              className="quiz-pagination-arrow"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              aria-label="Previous page"
            >
              <LuChevronLeft size={15} strokeWidth={1.9} />
            </button>

            {renderPageNumbers()}

            <button
              type="button"
              className="quiz-pagination-arrow"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              aria-label="Next page"
            >
              <LuChevronRight size={15} strokeWidth={1.9} />
            </button>
          </div>

          {/* ROWS */}

          <div className="quiz-question-rows">
            <span>Questions per page</span>

            <select
              value={rowsPerPage}
              onChange={(event) => setRowsPerPage(Number(event.target.value))}
              aria-label="Questions per page"
            >
              <option value={4}>4</option>
              <option value={8}>8</option>
              <option value={12}>12</option>
            </select>

            <LuChevronDown size={13} strokeWidth={1.8} />
          </div>
        </div>
      )}

      {/* =================================================
          VIEW MODAL
      ================================================= */}

      {activeModal === "view" && selectedQuestion && (
        <div className="quiz-question-modal-backdrop" onClick={closeModal}>
          <div
            className="quiz-question-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="quiz-modal-header">
              <div>
                <span>Question</span>

                <h3>Q{String(selectedQuestion.number).padStart(2, "0")}</h3>
              </div>

              <button type="button" onClick={closeModal} aria-label="Close">
                <LuX size={17} strokeWidth={1.8} />
              </button>
            </div>

            <div className="quiz-modal-question">
              <div className="quiz-modal-type-row">
                <span className="quiz-question-type">
                  {selectedQuestion.type}
                </span>

                <span
                  className={`quiz-difficulty-badge ${getDifficultyClass(
                    selectedQuestion.difficulty,
                  )}`}
                >
                  <span className="quiz-difficulty-dot" />
                  {selectedQuestion.difficulty}
                </span>
              </div>

              <h4>{selectedQuestion.question}</h4>

              <p>{selectedQuestion.description}</p>

              <div className="quiz-modal-options">
                {selectedQuestion.options.map((option, index) => (
                  <div
                    key={option}
                    className={`quiz-modal-option ${
                      index === selectedQuestion.correctAnswer ? "correct" : ""
                    }`}
                  >
                    <span>{String.fromCharCode(65 + index)}</span>

                    <p>{option}</p>

                    {index === selectedQuestion.correctAnswer && (
                      <LuCheck size={15} strokeWidth={2} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="quiz-modal-footer">
              <span>
                {selectedQuestion.marks}{" "}
                {selectedQuestion.marks === 1 ? "mark" : "marks"}
              </span>

              <button type="button" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================
          EDIT MODAL
      ================================================= */}

      {activeModal === "edit" && selectedQuestion && (
        <div className="quiz-question-modal-backdrop" onClick={closeModal}>
          <div
            className="quiz-question-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="quiz-modal-header">
              <div>
                <span>Edit Question</span>

                <h3>Q{String(selectedQuestion.number).padStart(2, "0")}</h3>
              </div>

              <button type="button" onClick={closeModal} aria-label="Close">
                <LuX size={17} strokeWidth={1.8} />
              </button>
            </div>

            <div
              className="quiz-question-modal-body"
              style={{
                padding: "1rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <div>
                <label
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    display: "block",
                    marginBottom: "0.25rem",
                  }}
                >
                  Question Text
                </label>
                <input
                  type="text"
                  value={qText}
                  onChange={(e) => setQText(e.target.value)}
                  placeholder="Enter question text..."
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.5rem",
                }}
              >
                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 500 }}>
                    Option A
                  </label>
                  <input
                    type="text"
                    value={qOptionA}
                    onChange={(e) => setQOptionA(e.target.value)}
                    placeholder="Option A"
                    style={{
                      width: "100%",
                      padding: "0.4rem",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 500 }}>
                    Option B
                  </label>
                  <input
                    type="text"
                    value={qOptionB}
                    onChange={(e) => setQOptionB(e.target.value)}
                    placeholder="Option B"
                    style={{
                      width: "100%",
                      padding: "0.4rem",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 500 }}>
                    Option C
                  </label>
                  <input
                    type="text"
                    value={qOptionC}
                    onChange={(e) => setQOptionC(e.target.value)}
                    placeholder="Option C"
                    style={{
                      width: "100%",
                      padding: "0.4rem",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 500 }}>
                    Option D
                  </label>
                  <input
                    type="text"
                    value={qOptionD}
                    onChange={(e) => setQOptionD(e.target.value)}
                    placeholder="Option D"
                    style={{
                      width: "100%",
                      padding: "0.4rem",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr",
                  gap: "0.5rem",
                }}
              >
                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 500 }}>
                    Correct Answer (Text)
                  </label>
                  <input
                    type="text"
                    value={qCorrect}
                    onChange={(e) => setQCorrect(e.target.value)}
                    placeholder="Exact correct option text..."
                    style={{
                      width: "100%",
                      padding: "0.4rem",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 500 }}>
                    Marks
                  </label>
                  <input
                    type="number"
                    value={qMarks}
                    onChange={(e) => setQMarks(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.4rem",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="quiz-modal-footer">
              <button type="button" className="secondary" onClick={closeModal}>
                Cancel
              </button>

              <button type="button" onClick={saveEditedQuestion}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================
          ADD MODAL
      ================================================= */}

      {activeModal === "add" && (
        <div className="quiz-question-modal-backdrop" onClick={closeModal}>
          <div
            className="quiz-question-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="quiz-modal-header">
              <div>
                <span>Question Management</span>

                <h3>Add Question</h3>
              </div>

              <button type="button" onClick={closeModal} aria-label="Close">
                <LuX size={17} strokeWidth={1.8} />
              </button>
            </div>

            <div
              className="quiz-question-modal-body"
              style={{
                padding: "1rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <div>
                <label
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    display: "block",
                    marginBottom: "0.25rem",
                  }}
                >
                  Question Text
                </label>
                <input
                  type="text"
                  value={qText}
                  onChange={(e) => setQText(e.target.value)}
                  placeholder="Enter question text..."
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.5rem",
                }}
              >
                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 500 }}>
                    Option A
                  </label>
                  <input
                    type="text"
                    value={qOptionA}
                    onChange={(e) => setQOptionA(e.target.value)}
                    placeholder="Option A"
                    style={{
                      width: "100%",
                      padding: "0.4rem",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 500 }}>
                    Option B
                  </label>
                  <input
                    type="text"
                    value={qOptionB}
                    onChange={(e) => setQOptionB(e.target.value)}
                    placeholder="Option B"
                    style={{
                      width: "100%",
                      padding: "0.4rem",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 500 }}>
                    Option C
                  </label>
                  <input
                    type="text"
                    value={qOptionC}
                    onChange={(e) => setQOptionC(e.target.value)}
                    placeholder="Option C"
                    style={{
                      width: "100%",
                      padding: "0.4rem",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 500 }}>
                    Option D
                  </label>
                  <input
                    type="text"
                    value={qOptionD}
                    onChange={(e) => setQOptionD(e.target.value)}
                    placeholder="Option D"
                    style={{
                      width: "100%",
                      padding: "0.4rem",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr",
                  gap: "0.5rem",
                }}
              >
                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 500 }}>
                    Correct Answer (Text)
                  </label>
                  <input
                    type="text"
                    value={qCorrect}
                    onChange={(e) => setQCorrect(e.target.value)}
                    placeholder="Exact correct option text..."
                    style={{
                      width: "100%",
                      padding: "0.4rem",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 500 }}>
                    Marks
                  </label>
                  <input
                    type="number"
                    value={qMarks}
                    onChange={(e) => setQMarks(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.4rem",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="quiz-modal-footer">
              <button type="button" className="secondary" onClick={closeModal}>
                Cancel
              </button>

              <button type="button" onClick={saveNewQuestion}>
                Save Question
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================
          DELETE MODAL
      ================================================= */}

      {activeModal === "delete" && selectedQuestion && (
        <div className="quiz-question-modal-backdrop" onClick={closeModal}>
          <div
            className="quiz-question-modal quiz-delete-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="quiz-delete-icon">
              <LuTrash2 size={20} strokeWidth={1.7} />
            </div>

            <h3>Delete Question?</h3>

            <p>
              Are you sure you want to delete this question? This action cannot
              be undone.
            </p>

            <div className="quiz-modal-footer">
              <button type="button" className="secondary" onClick={closeModal}>
                Cancel
              </button>

              <button
                type="button"
                className="danger-confirm"
                onClick={confirmDelete}
              >
                Delete Question
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default QuizQuestions;
