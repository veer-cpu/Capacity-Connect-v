import {
  FiArrowRight,
  FiAward,
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiTarget,
  FiTrendingUp,
} from "react-icons/fi";

import Card from "../../../Reusable_components/Card/Card";
import Badge from "../../../Reusable_components/Badge/Badge";
import ProgressBar from "../../../Reusable_components/ProgressBar/ProgressBar";

import "./SkillProgressCard.css";

/*
|--------------------------------------------------------------------------
| STATIC DATA
|--------------------------------------------------------------------------
| This data is temporary.
| Later this component can receive everything through API / props.
|--------------------------------------------------------------------------
*/

const SkillProgressCard = ({ user, competencies = [], onViewSkills }) => {
  const learner = {
    name: user?.name || "Learner",
    role: user?.role || "Learner",
    designation: user?.bio || "Capacity Building",
    profileImage: "https://i.pravatar.cc/160?img=12",
    overallScore: competencies.length > 0 ? 80 : 0,
    skillsOnTrack: competencies.filter((c) => c.current_level === "ADVANCED" || c.current_level === "INTERMEDIATE").length,
    skillGaps: competencies.filter((c) => c.current_level === "BEGINNER" || !c.current_level).length,
    completedSkills: competencies.length,
  };

  const skills = competencies.map((c, index) => ({
    id: c.id || c.competency_id || index + 1,
    name: c.competency_name || c.name || "Competency",
    category: c.category || "Domain",
    level: c.current_level === "ADVANCED" ? 4 : c.current_level === "INTERMEDIATE" ? 3 : 2,
    levelLabel: c.current_level || "Beginner",
    color: index % 2 === 0 ? "violet" : "ocean",
    icon: "🎯",
  }));

  const weeklyActivity = [];
  /*
  |--------------------------------------------------------------------------
  | Helper Functions
  |--------------------------------------------------------------------------
  */

  const getSkillPercentage = (level) => {
    return (level / 5) * 100;
  };

  const getProgressVariant = (level) => {
    if (level >= 4) {
      return "success";
    }

    if (level === 3) {
      return "info";
    }

    if (level === 2) {
      return "warning";
    }

    return "danger";
  };

  const getActivityHeight = (hours) => {
    const maxHours = 5;

    return `${Math.max((hours / maxHours) * 100, 8)}%`;
  };

  return (
    <section
      className="skill-progress-section"
      aria-labelledby="skill-progress-title"
    >
      {/* ============================================================
          SECTION HEADER
      ============================================================ */}

      <div className="skill-progress-section__header">
        <div className="skill-progress-section__heading">
          <span className="skill-progress-section__eyebrow">
            COMPETENCY OVERVIEW
          </span>

          <h2
            id="skill-progress-title"
            className="skill-progress-section__title"
          >
            My Skill Profile
          </h2>

          <p className="skill-progress-section__description">
            Track your current competency and keep moving toward your learning
            goals.
          </p>
        </div>

        <button
          type="button"
          className="skill-progress-section__view-all"
          onClick={onViewSkills}
        >
          <span>View All Skills</span>
          <FiArrowRight aria-hidden="true" />
        </button>
      </div>

      {/* ============================================================
          TOP ROW
      ============================================================ */}

      <div className="skill-progress-section__top-grid">
        {/* ========================================================
            PROFILE CARD
        ======================================================== */}

        <Card variant="default" className="skill-profile-card">
          <div className="skill-profile-card__content">
            <div className="skill-profile-card__identity">
              <div className="skill-profile-card__avatar-wrapper">
                <img
                  src={learner.profileImage}
                  alt={`${learner.name}'s profile`}
                  className="skill-profile-card__avatar"
                />

                <span
                  className="skill-profile-card__online"
                  aria-label="Online"
                />
              </div>

              <div className="skill-profile-card__identity-content">
                <div className="skill-profile-card__name-row">
                  <h3>{learner.name}</h3>

                  <Badge variant="info" size="sm">
                    {learner.role}
                  </Badge>
                </div>

                <p className="skill-profile-card__designation">
                  {learner.designation}
                </p>

                <p className="skill-profile-card__member">
                  Building skills through continuous learning
                </p>
              </div>
            </div>

            <div className="skill-profile-card__divider" />

            <div className="skill-profile-card__quick-stats">
              <div className="skill-profile-card__quick-stat">
                <span className="skill-profile-card__quick-icon">
                  <FiCheckCircle aria-hidden="true" />
                </span>

                <div>
                  <strong>{learner.completedSkills}</strong>
                  <span>Skills completed</span>
                </div>
              </div>

              <div className="skill-profile-card__quick-stat">
                <span className="skill-profile-card__quick-icon">
                  <FiTarget aria-hidden="true" />
                </span>

                <div>
                  <strong>{learner.skillsOnTrack}</strong>
                  <span>Skills on track</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* ========================================================
            OVERALL SCORE CARD
        ======================================================== */}

        <Card variant="glass" className="skill-overall-card">
          <div className="skill-overall-card__content">
            <div className="skill-overall-card__header">
              <div>
                <span className="skill-card__eyebrow">OVERALL SCORE</span>

                <h3>Skill Progress</h3>
              </div>

              <span className="skill-overall-card__icon">
                <FiTrendingUp aria-hidden="true" />
              </span>
            </div>

            <div className="skill-overall-card__main">
              <div
                className="skill-score-ring"
                style={{
                  "--skill-score": `${learner.overallScore}%`,
                }}
              >
                <div className="skill-score-ring__inner">
                  <strong>{learner.overallScore}%</strong>
                  <span>Overall</span>
                </div>
              </div>

              <div className="skill-overall-card__summary">
                <span className="skill-overall-card__status">
                  Good Progress
                </span>

                <p>
                  You are making steady progress across your competency profile.
                </p>

                <div className="skill-overall-card__stats">
                  <div>
                    <strong>{learner.skillsOnTrack}</strong>
                    <span>On track</span>
                  </div>

                  <div>
                    <strong>{learner.skillGaps}</strong>
                    <span>Skill gaps</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* ============================================================
          MIDDLE ROW
      ============================================================ */}

      <div className="skill-progress-section__middle-grid">
        {/* ========================================================
            TOP SKILLS
        ======================================================== */}

        <Card variant="default" className="skill-top-card">
          <div className="skill-card__header">
            <div>
              <span className="skill-card__eyebrow">STRONGEST AREAS</span>

              <h3 className="skill-card__title">Top Skills</h3>
            </div>

            <FiAward className="skill-card__header-icon" aria-hidden="true" />
          </div>

          <div className="skill-top-card__list">
            {skills.slice(0, 4).map((skill) => (
              <div className="skill-top-item" key={skill.id}>
                <div className="skill-top-item__top">
                  <div className="skill-top-item__name">
                    <span
                      className={`skill-top-item__icon skill-top-item__icon--${skill.color}`}
                    >
                      {skill.icon}
                    </span>

                    <div>
                      <strong>{skill.name}</strong>
                      <span>{skill.category}</span>
                    </div>
                  </div>

                  <span className="skill-top-item__level">{skill.level}/5</span>
                </div>

                <ProgressBar
                  value={getSkillPercentage(skill.level)}
                  max={100}
                  variant={getProgressVariant(skill.level)}
                  appearance="solid"
                  size="sm"
                  radius="pill"
                  animated
                />
              </div>
            ))}
          </div>
        </Card>

        {/* ========================================================
            WEEKLY ACTIVITY
        ======================================================== */}

        <Card variant="glass" className="skill-activity-card">
          <div className="skill-card__header">
            <div>
              <span className="skill-card__eyebrow">LEARNING ACTIVITY</span>

              <h3 className="skill-card__title">Weekly Activity</h3>
            </div>

            <span className="skill-activity-card__total">18.2h</span>
          </div>

          <div className="skill-activity-card__chart">
            <div className="skill-activity-card__grid-line skill-activity-card__grid-line--top" />
            <div className="skill-activity-card__grid-line skill-activity-card__grid-line--middle" />
            <div className="skill-activity-card__grid-line skill-activity-card__grid-line--bottom" />

            <div className="skill-activity-card__bars">
              {weeklyActivity.map((item) => (
                <div className="skill-activity-bar" key={item.day}>
                  <div className="skill-activity-bar__track">
                    <span
                      className={`skill-activity-bar__fill skill-activity-bar__fill--${item.day.toLowerCase()}`}
                      style={{
                        height: getActivityHeight(item.hours),
                      }}
                      title={`${item.hours} hours`}
                    />
                  </div>

                  <span className="skill-activity-bar__day">{item.day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="skill-activity-card__footer">
            <div>
              <span className="skill-activity-card__footer-dot" />
              <span>Learning time</span>
            </div>

            <span className="skill-activity-card__comparison">
              +2.4h this week
            </span>
          </div>
        </Card>
      </div>

      {/* ============================================================
          SKILL SNAPSHOT
      ============================================================ */}

      <Card variant="default" className="skill-snapshot-card">
        <div className="skill-card__header skill-snapshot-card__header">
          <div>
            <span className="skill-card__eyebrow">COMPETENCY BREAKDOWN</span>

            <h3 className="skill-card__title">Skill Snapshot</h3>
          </div>

          <div className="skill-snapshot-card__legend">
            <span>
              <i className="skill-snapshot-card__legend-dot skill-snapshot-card__legend-dot--strong" />
              Strong
            </span>

            <span>
              <i className="skill-snapshot-card__legend-dot skill-snapshot-card__legend-dot--developing" />
              Developing
            </span>

            <span>
              <i className="skill-snapshot-card__legend-dot skill-snapshot-card__legend-dot--needs" />
              Needs Focus
            </span>
          </div>
        </div>

        <div className="skill-snapshot-card__grid">
          {skills.map((skill) => (
            <div
              className={`skill-snapshot-item skill-snapshot-item--${skill.color}`}
              key={skill.id}
            >
              <div className="skill-snapshot-item__top">
                <div className="skill-snapshot-item__name">
                  <span className="skill-snapshot-item__icon">
                    {skill.icon}
                  </span>

                  <div>
                    <strong>{skill.name}</strong>
                    <span>{skill.category}</span>
                  </div>
                </div>

                <span className="skill-snapshot-item__score">
                  {skill.level}/5
                </span>
              </div>

              <ProgressBar
                value={getSkillPercentage(skill.level)}
                max={100}
                variant={getProgressVariant(skill.level)}
                appearance="solid"
                size="sm"
                radius="pill"
                animated
              />

              <div className="skill-snapshot-item__bottom">
                <span>{skill.levelLabel}</span>

                <span>
                  {skill.level === 5
                    ? "Target reached"
                    : `${5 - skill.level} level${
                        5 - skill.level > 1 ? "s" : ""
                      } to target`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* ============================================================
          FOOTER ACTION
      ============================================================ */}

      <div className="skill-progress-section__footer">
        <div className="skill-progress-section__footer-message">
          <FiBookOpen aria-hidden="true" />

          <span>Keep learning to close your remaining skill gaps.</span>
        </div>

        <button
          type="button"
          className="skill-progress-section__footer-action"
          onClick={onViewSkills}
        >
          Explore My Skills
          <FiArrowRight aria-hidden="true" />
        </button>
      </div>
    </section>
  );
};

export default SkillProgressCard;
