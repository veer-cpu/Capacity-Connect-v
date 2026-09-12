import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../../api/apiClient";

import WelcomeBanner from "../../../Components/Learner/WelcomeBanner/WelcomeBanner";
import StatCard from "../../../Components/Learner/StatCard/StatCard";
import LearningProgress from "../../../Components/Learner/LearningProgress/LearningProgress";
import SkillProgressCard from "../../../Components/Learner/SkillProgressCard/SkillProgressCard";
import SkillGapCard from "../../../Components/Learner/SkillGapCard/SkillGapCard";
import RecommendationCard from "../../../Components/Learner/RecommendationCard/RecommendationCard";
import ContinueLearningCard from "../../../Components/Learner/ContinueLearningCard/ContinueLearningCard";
import CertificateCard from "../../../Components/Learner/CertificateCard/CertificateCard";
import ResourceCard from "../../../Components/Learner/ResourceCard/ResourceCard";

import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [certificateCount, setCertificateCount] = useState(0);
  const [enrollments, setEnrollments] = useState([]);
  const [competencies, setCompetencies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const userData = await apiFetch("/auth/me");
        setUser(userData.data || userData);

        const certificateData = await apiFetch("/certificates/my");
        setCertificateCount(certificateData.count || certificateData.data?.length || 0);

        const enrollData = await apiFetch("/enrollments/my");
        setEnrollments(enrollData.data || []);

        const compData = await apiFetch("/competencies/profile");
        setCompetencies(compData.data || []);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const completedCourses = enrollments.filter(
    (e) => e.status === "COMPLETED" || e.completionPercentage === 100
  ).length;
  const activeCourses = enrollments.filter((e) => e.status === "ACTIVE").length;

  const totalProgressSum = enrollments.reduce(
    (sum, e) => sum + (e.completionPercentage || 0),
    0
  );
  const avgProgress =
    enrollments.length > 0 ? Math.round(totalProgressSum / enrollments.length) : 0;

  const dashboardStats = [
    {
      id: 1,
      title: "Courses Completed",
      value: completedCourses.toString(),
      description: "Courses successfully completed",
      icon: "completed",
      variant: "success",
    },
    {
      id: 2,
      title: "Learning Progress",
      value: `${avgProgress}%`,
      description: "Overall learning progress",
      icon: "progress",
      variant: "ocean",
    },
    {
      id: 3,
      title: "Certificates",
      value: certificateCount.toString(),
      description: "Certificates earned",
      icon: "certificates",
      variant: "achievement",
    },
    {
      id: 4,
      title: "Active Learning",
      value: activeCourses.toString(),
      description: "Courses currently in progress",
      icon: "learning",
      variant: "navy",
    },
  ];

  return (
    <div className="learner-dashboard">
      {/* ==========================================================
          WELCOME
      ========================================================== */}

      <WelcomeBanner
        name={user?.name || "Learner"}
        onProfileClick={() => navigate('/learner/profile')}
      />

      {/* ==========================================================
          STATISTICS
      ========================================================== */}

      <section
        className="dashboard-stats-section"
        aria-labelledby="dashboard-stats-title"
      >
        <div className="dashboard-section-header">
          <div>
            <span className="dashboard-section-eyebrow">YOUR OVERVIEW</span>

            <h2 id="dashboard-stats-title" className="dashboard-section-title">
              Learning at a glance
            </h2>
          </div>
        </div>

        <div className="dashboard-stats">
          {dashboardStats.map((stat) => (
            <StatCard
              key={stat.id}
              title={stat.title}
              value={stat.value}
              description={stat.description}
              icon={stat.icon}
              variant={stat.variant}
              trend={stat.trend}
              trendType={stat.trendType}
            />
          ))}
        </div>
      </section>

      {/* ==========================================================
          LEARNING PROGRESS
      ========================================================== */}

      <LearningProgress
        progress={avgProgress}
        totalCourses={enrollments.length}
        completedCourses={completedCourses}
      />

      {/* ==========================================================
          MY SKILL PROFILE
      ========================================================== */}

      <SkillProgressCard
        user={user}
        competencies={competencies}
        onViewSkills={() => navigate('/learner/skills')}
      />

      {/* ==========================================================
          SKILL GAP SUMMARY
      ========================================================== */}

      <SkillGapCard
        onViewSkillGaps={() => navigate('/learner/skill-gaps')}
        onExploreTraining={() => navigate('/learner/recommendations')}
      />
      <RecommendationCard
        onViewAllRecommendations={() => navigate('/learner/recommendations')}
        onStartLearning={() => navigate('/learner/learning')}
        onViewCourse={(course) => navigate(`/learner/courses/${course?.id || enrollments[0]?.course_id || 1}`)}
      />
      <ContinueLearningCard
        courseData={enrollments[0]}
        onContinueLearning={() => navigate('/learner/learning')}
        onViewCourse={() => navigate(`/learner/courses/${enrollments[0]?.course_id || 1}`)}
      />
      <CertificateCard
        onViewAllCertificates={() => navigate('/learner/certificates')}
        onViewCertificate={() => navigate('/learner/certificates')}
        onDownloadCertificate={() => navigate('/learner/certificates')}
      />
      <ResourceCard
        onViewAllResources={() => navigate('/learner/knowledge-hub')}
        onViewResource={() => navigate('/learner/knowledge-hub')}
      />
    </div>
  );
};

export default Dashboard;
