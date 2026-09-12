import React, { useEffect, useState } from "react";

import QuizzesHeader from "../../../Components/Trainer/TrainerQuizzes/QuizzesHeader/QuizzesHeader";
import QuizStats from "../../../Components/Trainer/TrainerQuizzes/QuizStats/QuizStats";
import QuizFilters from "../../../Components/Trainer/TrainerQuizzes/QuizFilters/QuizFilters";
import QuizList from "../../../Components/Trainer/TrainerQuizzes/QuizList/QuizList";
import { createQuiz, getModulesByCourse, getQuizzes, updateQuiz } from "../../../services/quizApi";

import "./TrainerQuizzes.css";

const MOES_COURSES = [
  { id: 4, title: "Fundamentals of Meteorological Observations" },
  { id: 5, title: "Weather Forecasting Techniques" },
  { id: 6, title: "Doppler Weather Radar (DWR) Operations and Maintenance" },
  { id: 7, title: "Climate Data Analysis and Management" },
  { id: 8, title: "Disaster Warning and Dissemination Systems" },
];

const TrainerQuizzes = () => {
  const [realQuizzes, setRealQuizzes] = useState(null);

  useEffect(() => {
    let isMounted = true;
    getQuizzes("TRAINER")
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setRealQuizzes(data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch trainer quizzes:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  /* ======================================================
     QUIZ MODAL STATE & HANDLERS
  ====================================================== */

  const [showQuizModal, setShowQuizModal] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formCourseId, setFormCourseId] = useState(4);
  const [formModuleId, setFormModuleId] = useState(6);
  const [availableModules, setAvailableModules] = useState([]);
  const [formPassing, setFormPassing] = useState(60);
  const [formTimeLimit, setFormTimeLimit] = useState(30);

  useEffect(() => {
    if (!formCourseId) return;
    let isMounted = true;
    getModulesByCourse(formCourseId, "TRAINER")
      .then((mods) => {
        if (isMounted && Array.isArray(mods) && mods.length > 0) {
          setAvailableModules(mods);
          setFormModuleId((prev) => {
            if (mods.some((m) => Number(m.id) === Number(prev))) {
              return prev;
            }
            return mods[0].id;
          });
        }
      })
      .catch((err) => {
        console.error("Failed to fetch modules for course:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [formCourseId]);

  useEffect(() => {
    const onCreate = () => {
      setEditingQuiz(null);
      setFormTitle("");
      setFormDesc("");
      setFormCourseId(4);
      setFormModuleId(6);
      setFormPassing(60);
      setFormTimeLimit(30);
      setShowQuizModal(true);
    };

    const onEdit = (e) => {
      const q = e.detail?.quiz;
      if (q) {
        setEditingQuiz(q);
        setFormTitle(q.title || "");
        setFormDesc(q.description || "");
        setFormCourseId(q.course_id || 4);
        setFormModuleId(q.module_id || 6);
        setFormPassing(q.passing_score ?? q.score ?? 60);
        setFormTimeLimit(q.time_limit_minutes ?? 30);
        setShowQuizModal(true);
      }
    };

    window.addEventListener("trainer-create-quiz", onCreate);
    window.addEventListener("trainer-edit-quiz", onEdit);

    return () => {
      window.removeEventListener("trainer-create-quiz", onCreate);
      window.removeEventListener("trainer-edit-quiz", onEdit);
    };
  }, []);

  const handleSaveQuiz = async () => {
    try {
      if (editingQuiz && editingQuiz.id && typeof editingQuiz.id === "number") {
        const updated = await updateQuiz(
          editingQuiz.id,
          {
            title: formTitle,
            description: formDesc,
            courseId: Number(formCourseId) || 4,
            moduleId: Number(formModuleId) || null,
            passingScore: Number(formPassing) || 60,
            timeLimitMinutes: Number(formTimeLimit) || 30,
          },
          "TRAINER"
        );
        setRealQuizzes((prev) =>
          (prev || []).map((q) => (q.id === editingQuiz.id ? { ...q, ...updated } : q))
        );
      } else {
        const created = await createQuiz(
          {
            courseId: Number(formCourseId) || 4,
            moduleId: Number(formModuleId) || null,
            title: formTitle || "New Quiz",
            description: formDesc || "",
            passingScore: Number(formPassing) || 60,
            totalMarks: 100,
            timeLimitMinutes: Number(formTimeLimit) || 30,
          },
          "TRAINER"
        );
        setRealQuizzes((prev) => [created, ...(prev || [])]);
      }
    } catch (err) {
      console.error("Failed to save quiz to backend:", err);
    }
    setShowQuizModal(false);
  };

  /* ======================================================
     SHARED QUIZ FILTER STATE
  ====================================================== */

  const [searchValue, setSearchValue] = useState("");

  const [course, setCourse] = useState("All Courses");

  const [status, setStatus] = useState("All Status");

  const [type, setType] = useState("All Types");

  const [sortValue, setSortValue] = useState("Latest First");

  const [viewMode, setViewMode] = useState("grid");

  /* ======================================================
     RESET ALL FILTERS
  ====================================================== */

  const handleResetFilters = () => {
    setSearchValue("");
    setCourse("All Courses");
    setStatus("All Status");
    setType("All Types");
    setSortValue("Latest First");
    setViewMode("grid");
  };

  /* ======================================================
     CREATE QUIZ
  ====================================================== */

  const handleCreateQuiz = () => {
    window.dispatchEvent(new CustomEvent("trainer-create-quiz"));
  };

  /* ======================================================
     EDIT QUIZ
  ====================================================== */

  const handleEditQuiz = (quiz) => {
    window.dispatchEvent(
      new CustomEvent("trainer-edit-quiz", {
        detail: { quiz },
      }),
    );
  };

  /* ======================================================
     VIEW QUIZ
  ====================================================== */

  const handleViewQuiz = (quiz) => {
    window.dispatchEvent(
      new CustomEvent("trainer-view-quiz", {
        detail: { quiz },
      }),
    );
  };

  return (
    <div className="trainer-quizzes">
      {/* ========================================
          Quizzes Header
      ======================================== */}

      <QuizzesHeader />

      {/* ========================================
          Quiz Statistics
      ======================================== */}

      <QuizStats />

      {/* ========================================
          Quiz Filters
      ======================================== */}

      <QuizFilters
        searchValue={searchValue}
        course={course}
        status={status}
        type={type}
        sortValue={sortValue}
        viewMode={viewMode}
        onSearchChange={setSearchValue}
        onCourseChange={setCourse}
        onStatusChange={setStatus}
        onTypeChange={setType}
        onSortChange={setSortValue}
        onViewChange={setViewMode}
        onResetFilters={handleResetFilters}
        onCreateQuiz={handleCreateQuiz}
      />

      {/* ========================================
          Quiz List
      ======================================== */}

      <QuizList
        quizzes={realQuizzes || undefined}
        searchValue={searchValue}
        course={course}
        status={status}
        type={type}
        sortValue={sortValue}
        viewMode={viewMode}
        onViewChange={setViewMode}
        onEditQuiz={handleEditQuiz}
        onViewQuiz={handleViewQuiz}
      />

      {/* ========================================
          CREATE / EDIT QUIZ MODAL
      ======================================== */}

      {showQuizModal && (
        <div
          className="quiz-modal-backdrop"
          onClick={() => setShowQuizModal(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="quiz-modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              padding: "1.5rem",
              width: "100%",
              maxWidth: "500px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3 style={{ margin: 0, marginBottom: "1rem" }}>
              {editingQuiz ? "Edit Quiz Metadata" : "Create New Quiz"}
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 600, display: "block", marginBottom: "0.25rem" }}>
                  Quiz Title
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Atmospheric Physics Assessment"
                  style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 600, display: "block", marginBottom: "0.25rem" }}>
                  Description
                </label>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Short summary of this quiz..."
                  rows={3}
                  style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 600, display: "block", marginBottom: "0.25rem" }}>
                  Course
                </label>
                <select
                  value={formCourseId}
                  onChange={(e) => setFormCourseId(Number(e.target.value))}
                  style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc", background: "#fff" }}
                >
                  {MOES_COURSES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 600, display: "block", marginBottom: "0.25rem" }}>
                  Module / Unit
                </label>
                <select
                  value={formModuleId}
                  onChange={(e) => setFormModuleId(Number(e.target.value))}
                  style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc", background: "#fff" }}
                >
                  {availableModules.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 500 }}>Passing %</label>
                  <input
                    type="number"
                    value={formPassing}
                    onChange={(e) => setFormPassing(e.target.value)}
                    style={{ width: "100%", padding: "0.4rem", borderRadius: "6px", border: "1px solid #ccc" }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 500 }}>Time (Mins)</label>
                  <input
                    type="number"
                    value={formTimeLimit}
                    onChange={(e) => setFormTimeLimit(e.target.value)}
                    style={{ width: "100%", padding: "0.4rem", borderRadius: "6px", border: "1px solid #ccc" }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1.25rem" }}>
              <button
                type="button"
                onClick={() => setShowQuizModal(false)}
                style={{ padding: "0.5rem 1rem", borderRadius: "6px", border: "1px solid #ccc", background: "#f3f4f6" }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveQuiz}
                style={{ padding: "0.5rem 1rem", borderRadius: "6px", border: "none", background: "#2563eb", color: "#fff", fontWeight: 600 }}
              >
                {editingQuiz ? "Save Changes" : "Create Quiz"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerQuizzes;
