import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { LuArrowLeft, LuFileText } from "react-icons/lu";

/* =========================================================
   QUIZ DETAILS COMPONENTS
========================================================= */

import QuizDetailsHeader from "../../../Components/Trainer/TrainerQuizzes/QuizDetails/QuizDetailsHeader/QuizDetailsHeader";

import QuizOverview from "../../../Components/Trainer/TrainerQuizzes/QuizDetails/QuizOverview/QuizOverview";

import QuizQuestions from "../../../Components/Trainer/TrainerQuizzes/QuizDetails/QuizQuestions/QuizQuestions";

import QuizAttempts from "../../../Components/Trainer/TrainerQuizzes/QuizDetails/QuizAttempts/QuizAttempts";

import QuizPerformance from "../../../Components/Trainer/TrainerQuizzes/QuizDetails/QuizPerformance/QuizPerformance";

/* =========================================================
   QUIZ DATA & API
========================================================= */

import { quizzes as mockQuizzes } from "../../../Components/Trainer/TrainerQuizzes/QuizList/QuizList";
import { getQuiz, getQuizAttempts, getQuizQuestions } from "../../../services/quizApi";

import "./QuizDetails.css";

/* =========================================================
   QUIZ DETAILS PAGE
========================================================= */

const QuizDetails = () => {
  const navigate = useNavigate();

  const { quizId } = useParams();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ======================================================
     FETCH QUIZ & QUESTIONS & ATTEMPTS
  ====================================================== */

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([
      getQuiz(quizId, "TRAINER"),
      getQuizQuestions(quizId, "TRAINER"),
      getQuizAttempts(quizId, "TRAINER"),
    ])
      .then(([quizData, questionsData, attemptsData]) => {
        if (isMounted && quizData) {
          setQuiz({
            ...quizData,
            course: quizData.course_title || quizData.course || "General",
            questions: questionsData.length,
            duration: quizData.duration || (quizData.time_limit_minutes ? `${quizData.time_limit_minutes} min` : "20 min"),
            status: quizData.status || "Published",
            type: quizData.type || "Assessment",
            score: quizData.score ?? quizData.passing_score ?? 60,
            icon: quizData.icon || "react",
            theme: quizData.theme || "blue",
          });
          setQuestions(questionsData);
          if (Array.isArray(attemptsData)) {
            setAttempts(attemptsData);
          }
        }
      })
      .catch((err) => {
        console.error("Failed to load real quiz details from backend:", err);
        if (isMounted) {
          const mockQuiz = mockQuizzes.find(
            (item) => String(item.id) === String(quizId),
          );
          if (mockQuiz) {
            setQuiz(mockQuiz);
          }
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [quizId]);

  /* ======================================================
     EDIT QUIZ
  ====================================================== */

  const handleEditQuiz = (selectedQuiz) => {
    window.dispatchEvent(
      new CustomEvent("trainer-edit-quiz", {
        detail: {
          quiz: selectedQuiz,
        },
      }),
    );
  };

  /* ======================================================
     INVALID QUIZ
  ====================================================== */

  if (!quiz) {
    return (
      <div className="quiz-details-page">
        <section className="quiz-details-not-found">
          <div className="quiz-details-not-found-icon">
            <LuFileText size={26} strokeWidth={1.7} />
          </div>

          <h1>Quiz not found</h1>

          <p>
            The quiz you're looking for doesn't exist or may have been removed.
          </p>

          <button
            type="button"
            onClick={() => navigate("/trainer/trainer-quizzes")}
          >
            <LuArrowLeft size={16} strokeWidth={1.8} />

            <span>Back to Quizzes</span>
          </button>
        </section>
      </div>
    );
  }

  /* ======================================================
     MAIN
  ====================================================== */

  return (
    <div className="quiz-details-page">
      {/* ==================================================
          QUIZ DETAILS HEADER
      ================================================== */}

      <QuizDetailsHeader quiz={quiz} onEditQuiz={handleEditQuiz} />

      {/* ==================================================
          QUIZ OVERVIEW
      ================================================== */}

      <QuizOverview quiz={quiz} />

      {/* ==================================================
          QUIZ QUESTIONS
      ================================================== */}

      <QuizQuestions quizId={quizId} questions={questions.length > 0 ? questions : undefined} />

      {/* ==================================================
          QUIZ ATTEMPTS
      ================================================== */}

      <QuizAttempts attempts={attempts.length > 0 ? attempts : undefined} />

      {/* ==================================================
          QUIZ PERFORMANCE
      ================================================== */}

      <QuizPerformance />
    </div>
  );
};

export default QuizDetails;
