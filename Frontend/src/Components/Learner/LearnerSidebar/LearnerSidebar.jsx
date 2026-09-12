import { NavLink, useNavigate } from "react-router-dom";

import {
  FiHome,
  FiBookOpen,
  FiGrid,
  FiCheckSquare,
  FiTarget,
  FiTrendingUp,
  FiCompass,
  FiBook,
  FiAward,
  FiUser,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

import "./LearnerSidebar.css";

/* =========================================================
   MAIN NAVIGATION
========================================================= */

const navigationGroups = [
  {
    title: "MAIN",

    items: [
      {
        label: "Dashboard",
        path: "/learner/dashboard",
        icon: FiHome,
      },
    ],
  },

  {
    title: "LEARNING",

    items: [
      {
        label: "My Learning",
        path: "/learner/learning",
        icon: FiBookOpen,
      },

      {
        label: "Course Catalog",
        path: "/learner/courses",
        icon: FiGrid,
      },

      {
        label: "Quizzes",
        path: "/learner/quizzes",
        icon: FiCheckSquare,
      },
    ],
  },

  {
    title: "COMPETENCY",

    items: [
      {
        label: "My Skills",
        path: "/learner/skills",
        icon: FiTarget,
      },

      {
        label: "Skill Gaps",
        path: "/learner/skill-gaps",
        icon: FiTrendingUp,
      },

      {
        label: "Recommended",
        path: "/learner/recommendations",
        icon: FiCompass,
      },
    ],
  },

  {
    title: "KNOWLEDGE",

    items: [
      {
        label: "Knowledge Hub",
        path: "/learner/knowledge-hub",
        icon: FiBook,
      },
    ],
  },

  {
    title: "ACHIEVEMENTS",

    items: [
      {
        label: "Certificates",
        path: "/learner/certificates",
        icon: FiAward,
      },
    ],
  },
];

/* =========================================================
   BOTTOM NAVIGATION
========================================================= */

const bottomNavigation = [
  {
    label: "Profile",
    path: "/learner/profile",
    icon: FiUser,
  },

  {
    label: "Settings",
    path: "/learner/settings",
    icon: FiSettings,
  },
];

/* =========================================================
   LEARNER SIDEBAR
========================================================= */

const LearnerSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <aside className="learner-sidebar">
      {/* =====================================================
          BRAND
      ===================================================== */}

      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <span>CC</span>
        </div>

        <div className="sidebar-brand-text">
          <span className="brand-title">CAPACITY</span>
          <span className="brand-subtitle">CONNECT</span>
        </div>
      </div>

      {/* =====================================================
          MAIN NAVIGATION
      ===================================================== */}

      <nav className="sidebar-navigation" aria-label="Learner navigation">
        {navigationGroups.map((group) => (
          <div className="sidebar-group" key={group.title}>
            {/* Section Title */}

            <div className="sidebar-group-title">{group.title}</div>

            {/* Section Items */}

            <div className="sidebar-group-items">
              {group.items.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `sidebar-nav-item ${isActive ? "active" : ""}`
                    }
                    data-tooltip={item.label}
                  >
                    <span className="sidebar-nav-icon">
                      <Icon />
                    </span>

                    <span className="sidebar-nav-label">{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* =====================================================
          BOTTOM NAVIGATION
      ===================================================== */}

      <div className="sidebar-bottom">
        <div className="sidebar-bottom-links">
          {bottomNavigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-bottom-item ${isActive ? "active" : ""}`
                }
                data-tooltip={item.label}
              >
                <span className="sidebar-nav-icon">
                  <Icon />
                </span>

                <span className="sidebar-nav-label">{item.label}</span>
              </NavLink>
            );
          })}

          {/* =================================================
              LOGOUT
          ================================================= */}

          <button
            type="button"
            className="sidebar-bottom-item sidebar-logout"
            onClick={handleLogout}
            data-tooltip="Logout"
          >
            <span className="sidebar-nav-icon">
              <FiLogOut />
            </span>

            <span className="sidebar-nav-label">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default LearnerSidebar;
