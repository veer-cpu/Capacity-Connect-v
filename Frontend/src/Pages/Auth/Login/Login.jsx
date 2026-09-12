import { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

// Zero-dependency SVG Icons for complete reusability across any React project
const Icons = {
  Logo: () => (
    <svg
      width="30"
      height="30"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="32" height="32" rx="9" fill="#171717" />
      <circle cx="11" cy="11" r="3.5" fill="#FFD45A" />
      <circle cx="21" cy="11" r="3.5" fill="#FFFFFF" />
      <circle cx="16" cy="21" r="3.5" fill="#FFD45A" />
      <path
        d="M11 11L21 11M11 11L16 21M21 11L16 21"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeOpacity="0.4"
        strokeLinecap="round"
      />
    </svg>
  ),
  Mail: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  Lock: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  Eye: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  EyeOff: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  ),
  Check: () => (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#171717"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Google: () => (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.94 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  ),
  Apple: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.98.6-2.61 1.34-.56.64-1.05 1.69-.92 2.71 1 .08 2.02-.45 2.6-1.2" />
    </svg>
  ),
  Calendar: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Clock: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  TrendingUp: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  ),
  Users: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
};

export default function Login({
  onNavigateToRegister,
  onForgotPassword,
  onLoginSuccess,
  imageSrc,
}) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const navigate = useNavigate();

  // Email format validation helper
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));

    // Clear specific field error as user types
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!isValidEmail(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

 const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
    }

    setErrors({});
    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: formData.email,
                password: formData.password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Login failed");
        }

        if (data.data?.token) {
            localStorage.setItem("token", data.data.token);
            localStorage.setItem("user", JSON.stringify(data.data.user || {}));
        }

        setSubmitSuccess(true);

        if (onLoginSuccess) {
            onLoginSuccess(data);
        }

        setTimeout(() => {
            const role = String(data.data?.user?.role || "").toUpperCase();
            if (role === "TRAINER" || role === "ADMIN") {
                navigate("/trainer");
            } else {
                navigate("/learner");
            }
        }, 400);

    } catch (error) {
        console.error("Login error:", error);

        setErrors({
            general: error.message || "Unable to login"
        });

    } finally {
        setIsSubmitting(false);
    }
};

  const handleSocialClick = (provider) => {
    window.alert(`Sign in with ${provider} is ready for integration.`);
  };

  const heroImage =
    imageSrc ||
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="cc-log-page-wrapper">
      <div className="cc-log-backdrop" aria-hidden="true" />
      <button
        type="button"
        className="cc-log-back-link"
        onClick={() => navigate("/")}
        aria-label="Back to Capacity Connect"
      >
        <span aria-hidden="true">←</span>
        <span>Back to Capacity Connect</span>
      </button>
      <div className="cc-log-auth-container">
        {/* Left Side: Authentication Form */}
        <div className="cc-log-form-pane">
          {/* Capacity Connect Branding */}
          <div className="cc-log-brand">
            <Icons.Logo />
            <div className="cc-log-brand-text">
              <span className="cc-log-brand-name">Capacity</span>
              <span className="cc-log-brand-highlight">Connect</span>
            </div>
          </div>

          {/* Heading & Subtitle */}
          <div className="cc-log-header-block">
            <h1 className="cc-log-heading">Welcome back</h1>
            <p className="cc-log-subtitle">
              Sign in to continue to Capacity Connect.
            </p>
          </div>

          {/* Social Sign-In Buttons */}
          <div className="cc-log-social-group">
            <button
              type="button"
              className="cc-log-social-btn"
              disabled
              title="Social login disabled in demo mode"
              aria-label="Sign in with Google (Disabled)"
              style={{ opacity: 0.6, cursor: "not-allowed" }}
            >
              <Icons.Google />
              <span>Google</span>
            </button>
            <button
              type="button"
              className="cc-log-social-btn"
              disabled
              title="Social login disabled in demo mode"
              aria-label="Sign in with Apple (Disabled)"
              style={{ opacity: 0.6, cursor: "not-allowed" }}
            >
              <Icons.Apple />
              <span>Apple</span>
            </button>
          </div>

          {/* Divider */}
          <div className="cc-log-divider">
            <span className="cc-log-divider-line" />
            <span className="cc-log-divider-text">or sign in with email</span>
            <span className="cc-log-divider-line" />
          </div>

          {/* Submission Success Alert */}
          {submitSuccess && (
            <div className="cc-log-success-banner">
              <span className="cc-log-success-icon">✓</span>
              <span>Welcome back! Signing you into your dashboard...</span>
            </div>
          )}

          {/* Login Form */}
          <form className="cc-log-form" onSubmit={handleSubmit} noValidate>
            {/* Email Input */}
            <div className="cc-log-field-group">
              <label className="cc-log-label" htmlFor="log-email">
                Email Address
              </label>
              <div className="cc-log-input-wrapper">
                <span className="cc-log-input-icon">
                  <Icons.Mail />
                </span>
                <input
                  id="log-email"
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`cc-log-input ${errors.email ? "has-error" : ""}`}
                />
              </div>
              {errors.email && (
                <span className="cc-log-error-text">{errors.email}</span>
              )}
            </div>

            {/* Password Input */}
            <div className="cc-log-field-group">
              <label className="cc-log-label" htmlFor="log-password">
                Password
              </label>
              <div className="cc-log-input-wrapper">
                <span className="cc-log-input-icon">
                  <Icons.Lock />
                </span>
                <input
                  id="log-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`cc-log-input ${errors.password ? "has-error" : ""}`}
                />
                <button
                  type="button"
                  className="cc-log-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                </button>
              </div>
              {errors.password && (
                <span className="cc-log-error-text">{errors.password}</span>
              )}
            </div>

            {/* Remember Me & Forgot Password Row */}
            <div className="cc-log-options-row">
              <label className="cc-log-checkbox-label">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="cc-log-checkbox-hidden"
                />
                <span
                  className={`cc-log-custom-checkbox ${formData.rememberMe ? "checked" : ""}`}
                >
                  {formData.rememberMe && <Icons.Check />}
                </span>
                <span className="cc-log-remember-text">Remember Me</span>
              </label>

              <a
                href="#forgot-password"
                className="cc-log-forgot-link"
                onClick={(e) => {
                  if (onForgotPassword) {
                    e.preventDefault();
                    onForgotPassword();
                  }
                }}
              >
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="cc-log-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing In..." : "Login"}
            </button>
          </form>

          {/* Switch to Register Text */}
          <p className="cc-log-auth-switch">
            Don't have an account?{" "}
            <a
              href="/register"
              className="cc-log-auth-switch-link"
              onClick={(e) => {
                if (onNavigateToRegister) {
                  e.preventDefault();
                  onNavigateToRegister();
                }
              }}
            >
              Create one
            </a>
          </p>
        </div>

        {/* Right Side: Professional Teamwork Visual with Floating UI Cards */}
        <div className="cc-log-visual-pane">
          <img
            src={heroImage}
            alt="Capacity Connect Team Collaboration"
            className="cc-log-hero-image"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=80";
            }}
          />
          <div className="cc-log-hero-overlay" />

          {/* Live Status Pill */}
          <div className="cc-log-live-pill">
            <span className="cc-log-pulse-dot" />
            <span>Capacity Hub • Live</span>
          </div>

          {/* Floating UI Cards */}
          <div className="cc-log-floating-cards">
            {/* Card 1: Meeting Card */}
            <div className="cc-log-float-card cc-log-float-card-1">
              <div className="cc-log-card-header">
                <span className="cc-log-card-icon">
                  <Icons.Clock />
                </span>
                <span className="cc-log-card-label">Upcoming Sync</span>
              </div>
              <h4 className="cc-log-card-title">
                Sprint Architecture & Planning
              </h4>
              <p className="cc-log-card-sub">
                <Icons.Calendar /> Today, 10:30 AM • Conf Room A
              </p>
            </div>

            {/* Card 2: Task / Productivity Card */}
            <div className="cc-log-float-card cc-log-float-card-2">
              <div className="cc-log-card-header">
                <span className="cc-log-card-icon">
                  <Icons.TrendingUp />
                </span>
                <span className="cc-log-card-label">Capacity Utilization</span>
              </div>
              <div className="cc-log-stat-row">
                <span className="cc-log-stat-val">94.2%</span>
                <span className="cc-log-stat-badge">+18.4%</span>
              </div>
              <div className="cc-log-progress-track">
                <div
                  className="cc-log-progress-fill"
                  style={{ width: "94.2%" }}
                />
              </div>
            </div>

            {/* Card 3: Calendar / Milestone Card */}
            <div className="cc-log-float-card cc-log-float-card-3">
              <div className="cc-log-card-header">
                <span className="cc-log-card-icon">
                  <Icons.Calendar />
                </span>
                <span className="cc-log-card-label">Milestone Active</span>
              </div>
              <h4 className="cc-log-card-title">SIH Hackathon Phase 1</h4>
              <p className="cc-log-card-sub">
                All deliverables submitted on track
              </p>
            </div>

            {/* Card 4: Small Avatar Circles */}
            <div className="cc-log-float-card cc-log-float-card-4">
              <div className="cc-log-card-header">
                <span className="cc-log-card-icon">
                  <Icons.Users />
                </span>
                <span className="cc-log-card-label">Collaborators</span>
              </div>
              <div className="cc-log-avatar-cluster">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                  alt="Avatar"
                  className="cc-log-avatar-circle"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                  alt="Avatar"
                  className="cc-log-avatar-circle"
                />
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
                  alt="Avatar"
                  className="cc-log-avatar-circle"
                />
                <span className="cc-log-avatar-counter">+12</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
