import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiAlertCircle, FiLoader, FiRefreshCw } from "react-icons/fi";
import { apiFetch } from "../../../api/apiClient";

import MyLearningHeader from "../../../Components/Learner/MyLearning/MyLearningHeader/MyLearningHeader";
import LearningStats from "../../../Components/Learner/MyLearning/LearningStats/LearningStats";
import ContinueLearning from "../../../Components/Learner/MyLearning/ContinueLearning/ContinueLearning";
import EnrolledCourseCard from "../../../Components/Learner/MyLearning/EnrolledCourseCard/EnrolledCourseCard";
import EmptyLearning from "../../../Components/Learner/MyLearning/EmptyLearning/EmptyLearning";

import Button from "../../../Reusable_components/Button/Button";

import "./MyLearning.css";

const MyLearning = () => {
  const navigate = useNavigate();

  /* =========================================================
     STATE
  ========================================================= */

  const [learningData, setLearningData] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState("");

  /* =========================================================
     FETCH MY LEARNING DATA FROM REAL BACKEND
  ========================================================= */

  const fetchMyLearning = async () => {
    setIsLoading(true);
    setError("");

    try {
      const res = await apiFetch("/enrollments/my");
      const enrollList = res.data || [];

      const mapped = enrollList.map((e) => ({
        enrollment: {
          id: e.id,
          courseId: e.course_id,
          status: e.status?.toLowerCase() || "active",
          progress: e.completionPercentage || 0,
          lastAccessed: e.enrolled_at,
          enrolledAt: e.enrolled_at,
          completedAt: e.completed_at,
        },
        course: {
          id: e.course_id,
          title: e.course_title,
          description: e.course_description,
          category: e.category,
          level: e.level,
          image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=60",
          modulesCount: e.total_modules || 5,
        },
      }));

      setLearningData(mapped);
    } catch (fetchError) {
      console.error("Failed to load My Learning:", fetchError);

      setError(
        fetchError.message ||
          "Something went wrong while loading your learning.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    fetchMyLearning();
  }, []);

  /* =========================================================
     LEARNING STATISTICS
  ========================================================= */

  const learningStats = useMemo(() => {
    const totalCourses = learningData.length;

    const completedCourses = learningData.filter(
      ({ enrollment }) =>
        enrollment?.status === "completed" ||
        Number(enrollment?.progress) >= 100,
    ).length;

    const inProgressCourses = learningData.filter(
      ({ enrollment }) =>
        enrollment?.status === "active" &&
        Number(enrollment?.progress) > 0 &&
        Number(enrollment?.progress) < 100,
    ).length;

    const notStartedCourses = learningData.filter(
      ({ enrollment }) =>
        enrollment?.status === "active" &&
        Number(enrollment?.progress) === 0,
    ).length;

    const totalProgress = learningData.reduce(
      (total, { enrollment }) => {
        return total + (Number(enrollment?.progress) || 0);
      },
      0,
    );

    const overallProgress =
      totalCourses > 0
        ? Math.round(totalProgress / totalCourses)
        : 0;

    return {
      totalCourses,
      completedCourses,
      inProgressCourses,
      notStartedCourses,
      overallProgress,
    };
  }, [learningData]);

  /* =========================================================
     CONTINUE LEARNING COURSE

     Priority:
     1. Active course with progress
     2. Active course at 0%
     3. First available course
  ========================================================= */

  const continueLearning = useMemo(() => {
    if (learningData.length === 0) {
      return null;
    }

    const activeWithProgress = learningData.find(
      ({ enrollment }) =>
        enrollment?.status === "active" &&
        Number(enrollment?.progress) > 0 &&
        Number(enrollment?.progress) < 100,
    );

    if (activeWithProgress) {
      return activeWithProgress;
    }

    const activeNotStarted = learningData.find(
      ({ enrollment }) =>
        enrollment?.status === "active" &&
        Number(enrollment?.progress) === 0,
    );

    if (activeNotStarted) {
      return activeNotStarted;
    }

    return learningData[0];
  }, [learningData]);

  /* =========================================================
     OPEN COURSE DETAILS
  ========================================================= */

  const handleOpenCourse = (courseId) => {
    if (!courseId) {
      return;
    }

    navigate(`/learner/courses/${courseId}`);
  };

  /* =========================================================
     CONTINUE COURSE
  ========================================================= */

  const handleContinueLearning = (courseId) => {
    if (!courseId) {
      return;
    }

    navigate(`/learner/courses/${courseId}/learn`);
  };

  /* =========================================================
     VIEW LEARNING DETAILS
  ========================================================= */

  const handleViewLearningDetails = () => {
    navigate("/learner/courses");
  };

  /* =========================================================
     VIEW LEARNING PATH
  ========================================================= */

  const handleViewLearningPath = () => {
    navigate("/learner/skills");
  };

  /* =========================================================
     VIEW LAST LESSON
  ========================================================= */

  const handleGoToLastLesson = (course, enrollment) => {
    if (!enrollment?.courseId) {
      return;
    }

    /*
      For now this opens the Learning Player.

      Later, when the Learning Player has a specific
      lesson route, we can navigate directly to the
      exact last lesson.
    */

    navigate(`/learner/courses/${enrollment.courseId}/learn`);
  };

  /* =========================================================
     SAVE / UNSAVE COURSE
  ========================================================= */

  const handleToggleSaveCourse = (course, isSaved) => {
    if (!course?.id) {
      return;
    }

    /*
      For now this is a local UI action.

      Later this can be connected to the backend:
      PATCH /courses/:courseId
      or preferably a learner saved-courses endpoint.
    */

    console.log(
      `${isSaved ? "Saved" : "Removed from saved"} course:`,
      course.id,
    );
  };

  /* =========================================================
     LOADING STATE
  ========================================================= */

  if (isLoading) {
    return (
      <main className="my-learning-page">
        <div className="my-learning-page__state">
          <div className="my-learning-page__state-icon my-learning-page__state-icon--loading">
            <FiLoader />
          </div>

          <h1>Loading your learning</h1>

          <p>
            Please wait while we prepare your courses.
          </p>
        </div>
      </main>
    );
  }

  /* =========================================================
     ERROR STATE
  ========================================================= */

  if (error) {
    return (
      <main className="my-learning-page">
        <div className="my-learning-page__state my-learning-page__state--error">
          <div className="my-learning-page__state-icon my-learning-page__state-icon--error">
            <FiAlertCircle />
          </div>

          <h1>Unable to load My Learning</h1>

          <p>{error}</p>

          <Button
            variant="primary"
            size="md"
            rounded="lg"
            leftIcon={<FiRefreshCw />}
            onClick={fetchMyLearning}
          >
            Try Again
          </Button>
        </div>
      </main>
    );
  }

  /* =========================================================
     EMPTY LEARNING STATE

     No enrolled courses:

     MyLearningHeader
          ↓
     EmptyLearning
          ↓
     Course Catalog / Recommendations
  ========================================================= */

  if (learningData.length === 0) {
    return (
      <main className="my-learning-page">
        {/* ===================================================
            MY LEARNING HEADER
        =================================================== */}

        <MyLearningHeader
          totalCourses={learningStats.totalCourses}
          inProgressCourses={learningStats.inProgressCourses}
          completedCourses={learningStats.completedCourses}
          overallProgress={learningStats.overallProgress}
          onExploreCourses={() =>
            navigate("/learner/courses")
          }
        />

        {/* ===================================================
            EMPTY LEARNING
        =================================================== */}

        <EmptyLearning
          onExploreCourses={() =>
            navigate("/learner/courses")
          }
          onViewRecommendations={() =>
            navigate("/learner/recommendations")
          }
        />
      </main>
    );
  }

  /* =========================================================
     MAIN PAGE
  ========================================================= */

  return (
    <main className="my-learning-page">

      {/* =====================================================
          1. MY LEARNING HEADER
      ===================================================== */}

      <MyLearningHeader
        totalCourses={learningStats.totalCourses}
        inProgressCourses={learningStats.inProgressCourses}
        completedCourses={learningStats.completedCourses}
        overallProgress={learningStats.overallProgress}
        onExploreCourses={() =>
          navigate("/learner/courses")
        }
      />

      {/* =====================================================
          2. LEARNING STATS
      ===================================================== */}

      <LearningStats
        totalCourses={learningStats.totalCourses}
        inProgressCourses={learningStats.inProgressCourses}
        completedCourses={learningStats.completedCourses}
        overallProgress={learningStats.overallProgress}
        onViewDetails={handleViewLearningDetails}
        onViewCourses={() =>
          navigate("/learner/courses")
        }
        onContinueLearning={() => {
          if (continueLearning?.enrollment?.courseId) {
            handleContinueLearning(
              continueLearning.enrollment.courseId,
            );
          }
        }}
        onViewCertificates={() =>
          navigate("/learner/certificates")
        }
        onViewLearningPath={handleViewLearningPath}
      />

      {/* =====================================================
          3. CONTINUE LEARNING

          One featured course only.
      ===================================================== */}

      {continueLearning && (
        <ContinueLearning
          course={continueLearning.course}
          enrollment={continueLearning.enrollment}
          onContinueLearning={() => {
            handleContinueLearning(
              continueLearning.enrollment?.courseId,
            );
          }}
          onViewCourse={() => {
            handleOpenCourse(
              continueLearning.enrollment?.courseId,
            );
          }}
          onViewAllCourses={() => {
            navigate("/learner/courses");
          }}
          onGoToLastLesson={(course, enrollment) => {
            handleGoToLastLesson(course, enrollment);
          }}
        />
      )}

      {/* =====================================================
          4. ENROLLED COURSES
      ===================================================== */}

      <section className="my-learning-page__courses-container">

        <div className="my-learning-page__section-heading">
          <div>
            <span>MY COURSES</span>

            <h2>Your enrolled courses</h2>
          </div>

          <span className="my-learning-page__course-count">
            {learningData.length} Course
            {learningData.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="my-learning-page__courses-grid">
          {learningData.map(
            ({ enrollment, course, error: courseError }) => (
              <React.Fragment key={enrollment.id}>

                {/* ==========================================
                    COURSE LOAD ERROR
                ========================================== */}

                {courseError ? (
                  <article className="my-learning-page__course-error-card">

                    <div className="my-learning-page__course-error-icon">
                      <FiAlertCircle />
                    </div>

                    <div className="my-learning-page__course-error-content">
                      <h3>
                        Course information unavailable
                      </h3>

                      <p>
                        We could not load the details for this
                        enrolled course.
                      </p>

                      <Button
                        variant="outline"
                        size="sm"
                        rounded="lg"
                        onClick={() =>
                          handleOpenCourse(
                            enrollment.courseId,
                          )
                        }
                      >
                        Try Course
                      </Button>
                    </div>

                  </article>
                ) : (

                  /* ========================================
                     ENROLLED COURSE CARD
                  ======================================== */

                  <EnrolledCourseCard
                    enrollment={enrollment}
                    course={course}
                    onViewCourse={handleOpenCourse}
                    onContinueLearning={
                      handleContinueLearning
                    }
                    onToggleSave={
                      handleToggleSaveCourse
                    }
                            />

                )}

              </React.Fragment>
            ),
          )}
        </div>
      </section>

      {/* =====================================================
          5. END OF CURRENT MY LEARNING CONTENT

          Additional learning discovery sections can be
          added here later if required.
      ===================================================== */}

    </main>
  );
};

export default MyLearning;