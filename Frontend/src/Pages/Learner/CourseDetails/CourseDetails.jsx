import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiAlertCircle, FiArrowLeft, FiLoader } from "react-icons/fi";

/* =========================================================
   LOCAL MOCK ENROLLMENT DATA
========================================================= */

import {
  CURRENT_LEARNER_ID,
  getEnrollment,
  createEnrollment,
} from "../../../../data/mock/enrollments";
import { apiFetch } from "../../../api/apiClient";

/* =========================================================
   COURSE DETAILS COMPONENTS
========================================================= */

import CourseDetailsHero from "../../../Components/Learner/CourseDetails/CourseDetailsHero/CourseDetailsHero";
import CourseOverview from "../../../Components/Learner/CourseDetails/CourseOverview/CourseOverview";
import CourseModules from "../../../Components/Learner/CourseDetails/CourseModules/CourseModules";
import CourseTrainer from "../../../Components/Learner/CourseDetails/CourseTrainer/CourseTrainer";

/* =========================================================
   REUSABLE COMPONENTS
========================================================= */

import Button from "../../../Reusable_components/Button/Button";

import "./CourseDetails.css";

/* =========================================================
   API URLS
========================================================= */

const COURSES_API_URL =
  "https://6a9ff1473e0d88d3d7e534f8.mockapi.io/api/courses";

const TRAINERS_API_URL =
  "https://6a9ff1473e0d88d3d7e534f8.mockapi.io/api/trainers";

/* =========================================================
   COURSE DETAILS
========================================================= */

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  /* =========================================================
     COURSE STATE
  ========================================================= */

  const [course, setCourse] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState("");

  /* =========================================================
     TRAINER STATE
  ========================================================= */

  const [trainer, setTrainer] = useState(null);

  const [isTrainerLoading, setIsTrainerLoading] = useState(false);

  const [trainerError, setTrainerError] = useState("");

  /* =========================================================
     ENROLLMENT STATE
  ========================================================= */

  const [enrollment, setEnrollment] = useState(null);

  const [isEnrollmentLoading, setIsEnrollmentLoading] = useState(true);

  const [isEnrolling, setIsEnrolling] = useState(false);

  const [enrollmentError, setEnrollmentError] = useState("");

  /* =========================================================
     FETCH SELECTED COURSE
  ========================================================= */

  /* =========================================================
     FETCH SELECTED COURSE FROM REAL BACKEND
  ========================================================= */

  useEffect(() => {
    let isMounted = true;

    const fetchCourse = async () => {
      setIsLoading(true);
      setError("");
      setCourse(null);
      setTrainer(null);
      setTrainerError("");
      setEnrollment(null);
      setEnrollmentError("");
      setIsEnrollmentLoading(true);

      try {
        const res = await apiFetch(`/courses/${courseId}`, {}, "LEARNER");
        const courseData = res.data || res;

        if (!courseData || !courseData.id) {
          throw new Error("Course not found.");
        }

        // Fetch units for this course
        let unitsList = [];
        try {
          const unitsRes = await apiFetch(`/units/course/${courseId}`, {}, "LEARNER");
          unitsList = unitsRes.units || unitsRes.data || [];

          // Fetch topics for each unit
          for (let u of unitsList) {
            try {
              const topicsRes = await apiFetch(`/topics/unit/${u.id}`, {}, "LEARNER");
              u.topics = topicsRes.topics || topicsRes.data || [];
            } catch (e) {
              u.topics = [];
            }
          }
        } catch (e) {
          console.warn("Units fetch notice:", e.message);
        }

        const formattedCourse = {
          id: courseData.id,
          title: courseData.title,
          description: courseData.description,
          category: courseData.category,
          level: courseData.level,
          trainerName: courseData.trainer_name || "IMD Faculty Specialist",
          trainerBio: courseData.trainer_bio || "Subject Matter Expert",
          trainerEmail: courseData.trainer_email || "",
          modules: unitsList.length > 0 ? unitsList : (courseData.modules || []),
          units: unitsList,
        };

        if (isMounted) {
          setCourse(formattedCourse);
          if (courseData.trainer_name) {
            setTrainer({
              name: courseData.trainer_name,
              bio: courseData.trainer_bio || "Lead Instructor",
              email: courseData.trainer_email,
            });
          }
        }

        // Check learner enrollment status
        try {
          const myEnrollRes = await apiFetch("/enrollments/my", {}, "LEARNER");
          const myEnrollments = myEnrollRes.data || [];
          const match = myEnrollments.find(
            (e) => String(e.course_id) === String(courseId)
          );
          if (isMounted) {
            if (match) {
              setEnrollment({
                id: match.id,
                courseId: match.course_id,
                status: match.status?.toLowerCase() || "active",
                progress: match.completionPercentage || 0,
              });
            } else {
              setEnrollment(null);
            }
          }
        } catch (e) {
          console.warn("Enrollment check notice:", e.message);
        }
      } catch (fetchError) {
        console.error("Failed to fetch course:", fetchError);
        if (isMounted) {
          setError(
            fetchError.message ||
              "Something went wrong while loading the course."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setIsEnrollmentLoading(false);
        }
      }
    };

    if (courseId) {
      fetchCourse();
    }

    return () => {
      isMounted = false;
    };
  }, [courseId]);

  /* =========================================================
     BACK TO COURSE CATALOG
  ========================================================= */

  const handleBack = () => {
    navigate("/learner/courses");
  };

  /* =========================================================
     ENROLL IN COURSE
  ========================================================= */

  const handleEnroll = async (selectedCourse) => {
    if (!selectedCourse?.id || isEnrolling || enrollment) {
      return;
    }

    setIsEnrolling(true);
    setEnrollmentError("");

    try {
      const res = await apiFetch("/enrollments", {
        method: "POST",
        body: JSON.stringify({ course_id: selectedCourse.id }),
      }, "LEARNER");

      if (res.data || res.success) {
        setEnrollment({
          id: res.data?.id || Date.now(),
          courseId: selectedCourse.id,
          status: "active",
          progress: 0,
        });
      } else {
        setEnrollmentError(res.message || "Unable to enroll in this course.");
      }
    } catch (enrollmentCreateError) {
      console.error("Failed to create enrollment:", enrollmentCreateError);
      setEnrollmentError(enrollmentCreateError.message || "Something went wrong while enrolling.");
    } finally {
      setIsEnrolling(false);
    }
  };

  /* =========================================================
     CONTINUE LEARNING
  ========================================================= */

  const handleContinueLearning = () => {
    if (!course?.id) {
      return;
    }

    navigate(`/learner/courses/${course.id}/learn`);
  };

  /* =========================================================
     FAVORITE
  ========================================================= */

  const handleFavorite = (selectedCourse) => {
    console.log(
      "Favorite changed:",
      selectedCourse.id,
      selectedCourse.isFavorite,
    );

    /*
      Favorite API will be connected later.
    */
  };

  /* =========================================================
     VIEW TRAINER PROFILE
  ========================================================= */

  const handleViewTrainerProfile = (selectedTrainer) => {
    console.log("View trainer profile:", selectedTrainer);

    /*
      Trainer Profile page will be connected later.

      Future route:

      /learner/trainers/:trainerId
    */
  };

  /* =========================================================
     COURSE LOADING
  ========================================================= */

  if (isLoading) {
    return (
      <div className="course-details-page">
        <div className="course-details-page__state">
          <div className="course-details-page__state-icon course-details-page__state-icon--loading">
            <FiLoader />
          </div>

          <h2>Loading course</h2>

          <p>Please wait while we load the course details.</p>

          <span className="course-details-page__loading-text">
            Preparing your learning experience...
          </span>
        </div>
      </div>
    );
  }

  /* =========================================================
     COURSE ERROR
  ========================================================= */

  if (error) {
    return (
      <div className="course-details-page">
        <div className="course-details-page__state course-details-page__state--error">
          <div className="course-details-page__state-icon course-details-page__state-icon--error">
            <FiAlertCircle />
          </div>

          <h2>Unable to load course</h2>

          <p>{error}</p>

          <Button
            variant="primary"
            size="md"
            rounded="lg"
            leftIcon={<FiArrowLeft />}
            onClick={handleBack}
          >
            Back to Course Catalog
          </Button>
        </div>
      </div>
    );
  }

  /* =========================================================
     COURSE NOT FOUND
  ========================================================= */

  if (!course) {
    return (
      <div className="course-details-page">
        <div className="course-details-page__state">
          <div className="course-details-page__state-icon course-details-page__state-icon--error">
            <FiAlertCircle />
          </div>

          <h2>Course not found</h2>

          <p>The course you are looking for could not be found.</p>

          <Button
            variant="primary"
            size="md"
            rounded="lg"
            leftIcon={<FiArrowLeft />}
            onClick={handleBack}
          >
            Back to Course Catalog
          </Button>
        </div>
      </div>
    );
  }

  /* =========================================================
     DETERMINE ENROLLMENT STATUS
  ========================================================= */

  const isEnrolled = Boolean(enrollment);

  const isCompleted =
    enrollment?.status === "completed" || Number(enrollment?.progress) >= 100;

  /* =========================================================
     COURSE DETAILS PAGE
  ========================================================= */

  return (
    <div className="course-details-page">
      {/* =====================================================
          1. COURSE DETAILS HERO
      ===================================================== */}

      <CourseDetailsHero
        course={course}
        onBack={handleBack}
        onEnroll={handleEnroll}
        onFavorite={handleFavorite}
        enrollment={enrollment}
        isEnrolled={isEnrolled}
        isCompleted={isCompleted}
        isEnrollmentLoading={isEnrollmentLoading}
        isEnrolling={isEnrolling}
        onContinueLearning={handleContinueLearning}
      />

      {/* =====================================================
          ENROLLMENT ERROR
      ===================================================== */}

      {enrollmentError && (
        <div className="course-details-page__enrollment-message course-details-page__enrollment-message--error">
          <FiAlertCircle />

          <span>{enrollmentError}</span>
        </div>
      )}

      {/* =====================================================
          2. COURSE OVERVIEW
      ===================================================== */}

      <CourseOverview course={course} />

      {/* =====================================================
          3. COURSE CURRICULUM
      ===================================================== */}

      <CourseModules course={course} />

      {/* =====================================================
          4. COURSE TRAINER
      ===================================================== */}

      {isTrainerLoading && (
        <section className="course-details-page__trainer-state">
          <div className="course-details-page__trainer-loading">
            <div className="course-details-page__trainer-loading-icon">
              <FiLoader />
            </div>

            <div className="course-details-page__trainer-loading-content">
              <strong>Loading course trainer</strong>

              <span>Preparing expert information...</span>
            </div>
          </div>
        </section>
      )}

      {!isTrainerLoading && trainer && (
        <CourseTrainer
          trainer={trainer}
          onViewProfile={handleViewTrainerProfile}
        />
      )}

      {/* =====================================================
          TRAINER ERROR

          Course remains usable even if trainer
          information fails to load.
      ===================================================== */}

      {!isTrainerLoading && trainerError && (
        <section className="course-details-page__trainer-state">
          <div className="course-details-page__trainer-error">
            <div className="course-details-page__trainer-error-icon">
              <FiAlertCircle />
            </div>

            <div className="course-details-page__trainer-error-content">
              <strong>Trainer information unavailable</strong>

              <p>
                The course is available, but trainer information could not be
                loaded right now.
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default CourseDetails;
