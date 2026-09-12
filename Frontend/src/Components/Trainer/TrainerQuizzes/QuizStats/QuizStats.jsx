import React from "react";

import {
  LuClipboardCheck,
  LuUsersRound,
  LuCircleCheck,
  LuClock3,
  LuTrendingUp,
} from "react-icons/lu";

import "./QuizStats.css";

const quizStats = [
  {
    id: 1,
    title: "Total Quizzes",
    value: "24",
    change: "+12%",
    description: "+3 new quizzes this month",
    icon: LuClipboardCheck,
    theme: "blue",
    direction: "up",
  },
  {
    id: 2,
    title: "Total Attempts",
    value: "1,428",
    change: "+18%",
    description: "+220 from last month",
    icon: LuUsersRound,
    theme: "green",
    direction: "up",
  },
  {
    id: 3,
    title: "Average Score",
    value: "78%",
    change: "+5%",
    description: "+4% from last month",
    icon: LuCircleCheck,
    theme: "lavender",
    direction: "up",
  },
  {
    id: 4,
    title: "Active Learners",
    value: "892",
    change: "+16%",
    description: "+124 from last month",
    icon: LuUsersRound,
    theme: "peach",
    direction: "up",
  },
  {
    id: 5,
    title: "Avg. Completion Time",
    value: "12 min",
    change: "-8%",
    description: "-1 min from last month",
    icon: LuClock3,
    theme: "pink",
    direction: "down",
  },
];

const QuizStats = ({ totalQuizzes = 27 }) => {
  const statsList = quizStats.map(s => s.id === 1 ? { ...s, value: String(totalQuizzes) } : s);

  return (
    <section className="quiz-stats" aria-label="Quiz statistics">
      <div className="quiz-stats-grid">
        {statsList.map((stat) => {
          const Icon = stat.icon;

          return (
            <article
              key={stat.id}
              className={`quiz-stat-card quiz-stat-card-${stat.theme}`}
            >
              <div className="quiz-stat-card-top">
                <div className="quiz-stat-icon">
                  <Icon size={20} strokeWidth={1.65} />
                </div>

                <div className="quiz-stat-heading">
                  <p className="quiz-stat-title">{stat.title}</p>
                  <h2 className="quiz-stat-value">{stat.value}</h2>
                </div>
              </div>

              <div className="quiz-stat-change-row">
                <span
                  className={`quiz-stat-change ${
                    stat.direction === "down" ? "negative" : "positive"
                  }`}
                >
                  <LuTrendingUp
                    className={
                      stat.direction === "down" ? "quiz-stat-trend-down" : ""
                    }
                    size={14}
                    strokeWidth={2}
                  />

                  {stat.change}
                </span>
              </div>

              <p className="quiz-stat-description">{stat.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default QuizStats;
