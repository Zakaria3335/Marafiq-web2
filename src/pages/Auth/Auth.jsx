import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { useLanguage } from "../../context/useLanguage";
import {
  registerAccount,
  requestLoginOtp,
  verifyRegistration,
} from "../../api/auth";
import { ApiError } from "../../api/client";
import { lookupEntities } from "../../api/lookup";
import "./Auth.css";

// TODO: تأكيد القيم الرقمية الفعلية لـ AccountType من فريق الـ backend
const ACCOUNT_TYPE_VALUES = { personal: 1, company: 2 };

// TODO: تأكيد اسم الـ entity وأسماء الأعمدة الفعلية لقائمة Al-Wilaya من
// فريق الـ backend — ما قدرنا نجربها Live بسبب مشكلة الـ 401 الحالية
const AL_WILAYA_ID_FIELD = "cr7c8_alwilayaid";
const AL_WILAYA_NAME_FIELD = "cr7c8_name";
const AL_WILAYA_LOOKUP = {
  entityName: "cr7c8_alwilaya",
  columns: `${AL_WILAYA_ID_FIELD},${AL_WILAYA_NAME_FIELD}`,
};

function maskMobile(mobile) {
  const digits = mobile.replace(/\D/g, "");
  if (!digits) return "xxxxxxxx";
  const visible = digits.slice(-2);
  return "x".repeat(Math.max(digits.length - 2, 0)) + visible;
}

function VerificationIcon() {
  return <img src="/services/Group.svg" alt="" className="auth-otp-icon" />;
}

function PersonIcon() {
  return (
    <img src="/services/Icon-left.svg" alt="" className="auth-input-icon" />
  );
}

function MailIcon() {
  return (
    <img
      src="/services/Icon-left%20(1).svg"
      alt=""
      className="auth-input-icon"
    />
  );
}

function PhoneIcon() {
  return (
    <img
      src="/services/Icon-left%20(2).svg"
      alt=""
      className="auth-input-icon"
    />
  );
}

export default function Auth() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();
  const isSignup = pathname === "/signup";

  const [loginForm, setLoginForm] = useState({ mobile: "" });
  const [signupForm, setSignupForm] = useState({
    firstName: "",
    lastName: "",
    civilId: "",
    email: "",
    mobile: "",
    alWilayaId: "",
    address: "",
    accountType: "personal",
    companyName: "",
    crNumber: "",
    companyPhone: "",
    companyAddress: "",
  });

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [otpValues, setOtpValues] = useState(["", "", "", ""]);
  const [otpMobile, setOtpMobile] = useState("");
  const [otpContext, setOtpContext] = useState("login");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [wilayaOptions, setWilayaOptions] = useState([]);
  const [wilayaLoading, setWilayaLoading] = useState(true);
  const [wilayaError, setWilayaError] = useState("");
  const otpInputRefs = useRef([]);

  // بنجيب قائمة Al-Wilaya الحقيقية أول ما تنفتح صفحة التسجيل
  useEffect(() => {
    if (!isSignup) return undefined;
    let cancelled = false;
    lookupEntities(AL_WILAYA_LOOKUP)
      .then((rows) => {
        if (cancelled) return;
        setWilayaOptions(rows || []);
        setWilayaError("");
      })
      .catch((error) => {
        if (cancelled) return;
        setWilayaError(
          error instanceof ApiError ? error.message : t("auth.alWilayaError"),
        );
      })
      .finally(() => {
        if (!cancelled) setWilayaLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isSignup]);

  // تسجيل الدخول الحقيقي: بيبعت رقم التلفون لـ /auth/login/request-otp
  // ولما يوصل رد ناجح، بيفتح نافذة إدخال الكود
  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      await requestLoginOtp({ phone: loginForm.mobile });
      setOtpContext("login");
      setOtpMobile(loginForm.mobile);
      setOtpValues(["", "", "", ""]);
      setOtpError("");
      setShowOtpModal(true);
    } catch (error) {
      setLoginError(
        error instanceof ApiError ? error.message : t("auth.genericError"),
      );
    } finally {
      setLoginLoading(false);
    }
  };

  // خطوة 1 من التسجيل الحقيقي: بس رقم التلفون + رقم البطاقة المدنية بينبعتو
  // هون (لـ /auth/register)، وباقي بيانات البروفايل منجمعهن مع الكود بخطوة
  // التحقق (/auth/register/verify) لأنو هيك بالضبط شكل الـ API
  const handleSignupSubmit = async (event) => {
    event.preventDefault();
    setSignupError("");
    setSignupLoading(true);
    try {
      await registerAccount({
        phone: signupForm.mobile,
        civilId: signupForm.civilId,
      });
      setOtpContext("signup");
      setOtpMobile(signupForm.mobile);
      setOtpValues(["", "", "", ""]);
      setOtpError("");
      setShowOtpModal(true);
    } catch (error) {
      setSignupError(
        error instanceof ApiError ? error.message : t("auth.genericError"),
      );
    } finally {
      setSignupLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setOtpValues((values) => {
      const next = [...values];
      next[index] = digit;
      return next;
    });
    if (digit && index < otpInputRefs.current.length - 1) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, event) => {
    if (event.key === "Backspace" && !otpValues[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifySubmit = async (event) => {
    event.preventDefault();

    if (otpContext === "signup") {
      setOtpError("");
      setOtpLoading(true);
      try {
        await verifyRegistration({
          code: otpValues.join(""),
          accountType: ACCOUNT_TYPE_VALUES[signupForm.accountType],
          firstName: signupForm.firstName,
          lastName: signupForm.lastName,
          civilId: signupForm.civilId,
          email: signupForm.email,
          address: signupForm.address || null,
          alWilayaId: signupForm.alWilayaId,
          phone: signupForm.mobile,
          companyName:
            signupForm.accountType === "company"
              ? signupForm.companyName
              : null,
          crNumber:
            signupForm.accountType === "company" ? signupForm.crNumber : null,
          companyPhone:
            signupForm.accountType === "company"
              ? signupForm.companyPhone
              : null,
          companyAddress:
            signupForm.accountType === "company"
              ? signupForm.companyAddress
              : null,
        });
        setShowOtpModal(false);
        setShowSuccessModal(true);
      } catch (error) {
        setOtpError(
          error instanceof ApiError ? error.message : t("auth.invalidCode"),
        );
      } finally {
        setOtpLoading(false);
      }
      return;
    }

    login({
      initials: "GU",
      name: "Guest User",
      type: "Personal Account",
      mobile: otpMobile,
      email: "",
      address: "",
    });
    setShowOtpModal(false);
    navigate("/");
  };

  const handleSuccessDone = () => {
    setShowSuccessModal(false);
    navigate("/login");
  };

  return (
    <div className="auth-page">
      <img src="/logo.svg" alt="Marafiq" className="auth-visual-logo" />

      <div className="auth-visual-text">
        <h2>{t("auth.visualTitle")}</h2>
        <p>{t("auth.visualDesc")}</p>
      </div>

      <div className="auth-visual-dots">
        <span className="auth-dot auth-dot-active" />
        <span className="auth-dot" />
        <span className="auth-dot" />
      </div>

      <div className="auth-panel">
        <div className="auth-card">
          <img src="/logo1.svg" alt="Marafiq" className="auth-card-logo" />

          {isSignup ? (
            <>
              <h1 className="auth-title">{t("auth.createAccountTitle")}</h1>

              <form className="auth-form" onSubmit={handleSignupSubmit}>
                <div className="auth-account-type-toggle">
                  <button
                    type="button"
                    className={`auth-account-type-btn${signupForm.accountType === "personal" ? " active" : ""}`}
                    onClick={() =>
                      setSignupForm((form) => ({
                        ...form,
                        accountType: "personal",
                      }))
                    }
                  >
                    {t("auth.personalAccount")}
                  </button>
                  <button
                    type="button"
                    className={`auth-account-type-btn${signupForm.accountType === "company" ? " active" : ""}`}
                    onClick={() =>
                      setSignupForm((form) => ({
                        ...form,
                        accountType: "company",
                      }))
                    }
                  >
                    {t("auth.companyAccount")}
                  </button>
                </div>

                <label className="auth-input">
                  <PersonIcon />
                  <input
                    type="text"
                    required
                    placeholder={t("auth.firstName")}
                    value={signupForm.firstName}
                    onChange={(event) =>
                      setSignupForm((form) => ({
                        ...form,
                        firstName: event.target.value,
                      }))
                    }
                  />
                </label>

                <label className="auth-input">
                  <PersonIcon />
                  <input
                    type="text"
                    required
                    placeholder={t("auth.lastName")}
                    value={signupForm.lastName}
                    onChange={(event) =>
                      setSignupForm((form) => ({
                        ...form,
                        lastName: event.target.value,
                      }))
                    }
                  />
                </label>

                <label className="auth-input">
                  <PersonIcon />
                  <input
                    type="text"
                    required
                    inputMode="numeric"
                    pattern="[0-9]{7}"
                    title="7 digits"
                    placeholder={t("auth.civilId")}
                    value={signupForm.civilId}
                    onChange={(event) =>
                      setSignupForm((form) => ({
                        ...form,
                        civilId: event.target.value
                          .replace(/\D/g, "")
                          .slice(0, 7),
                      }))
                    }
                  />
                </label>

                <label className="auth-input">
                  <MailIcon />
                  <input
                    type="email"
                    required
                    placeholder={t("auth.email")}
                    value={signupForm.email}
                    onChange={(event) =>
                      setSignupForm((form) => ({
                        ...form,
                        email: event.target.value,
                      }))
                    }
                  />
                </label>

                <label className="auth-input">
                  <PhoneIcon />
                  <input
                    type="tel"
                    required
                    placeholder={t("auth.mobile")}
                    value={signupForm.mobile}
                    onChange={(event) =>
                      setSignupForm((form) => ({
                        ...form,
                        mobile: event.target.value,
                      }))
                    }
                  />
                </label>

                <div className="auth-input-group">
                  <label
                    className={
                      wilayaError ? "auth-input auth-input-error" : "auth-input"
                    }
                  >
                    <select
                      required
                      className="auth-select"
                      value={signupForm.alWilayaId}
                      disabled={wilayaLoading || wilayaOptions.length === 0}
                      onChange={(event) =>
                        setSignupForm((form) => ({
                          ...form,
                          alWilayaId: event.target.value,
                        }))
                      }
                    >
                      <option value="" disabled>
                        {wilayaLoading ? t("auth.loadingAlWilaya") : t("auth.alWilaya")}
                      </option>
                      {wilayaOptions.map((option) => (
                        <option
                          key={option[AL_WILAYA_ID_FIELD]}
                          value={option[AL_WILAYA_ID_FIELD]}
                        >
                          {option[AL_WILAYA_NAME_FIELD]}
                        </option>
                      ))}
                    </select>
                  </label>
                  {wilayaError && (
                    <p className="auth-field-error">{wilayaError}</p>
                  )}
                </div>

                <label className="auth-input">
                  <input
                    type="text"
                    placeholder={t("auth.address")}
                    value={signupForm.address}
                    onChange={(event) =>
                      setSignupForm((form) => ({
                        ...form,
                        address: event.target.value,
                      }))
                    }
                  />
                </label>

                {signupForm.accountType === "company" && (
                  <>
                    <label className="auth-input">
                      <input
                        type="text"
                        required
                        placeholder={t("auth.companyName")}
                        value={signupForm.companyName}
                        onChange={(event) =>
                          setSignupForm((form) => ({
                            ...form,
                            companyName: event.target.value,
                          }))
                        }
                      />
                    </label>
                    <label className="auth-input">
                      <input
                        type="text"
                        required
                        inputMode="numeric"
                        pattern="[0-9]{7}"
                        title="7 digits"
                        placeholder={t("auth.crNumber")}
                        value={signupForm.crNumber}
                        onChange={(event) =>
                          setSignupForm((form) => ({
                            ...form,
                            crNumber: event.target.value
                              .replace(/\D/g, "")
                              .slice(0, 7),
                          }))
                        }
                      />
                    </label>
                    <label className="auth-input">
                      <PhoneIcon />
                      <input
                        type="tel"
                        required
                        placeholder={t("auth.companyPhone")}
                        value={signupForm.companyPhone}
                        onChange={(event) =>
                          setSignupForm((form) => ({
                            ...form,
                            companyPhone: event.target.value,
                          }))
                        }
                      />
                    </label>
                    <label className="auth-input">
                      <input
                        type="text"
                        required
                        placeholder={t("auth.companyAddress")}
                        value={signupForm.companyAddress}
                        onChange={(event) =>
                          setSignupForm((form) => ({
                            ...form,
                            companyAddress: event.target.value,
                          }))
                        }
                      />
                    </label>
                  </>
                )}

                <Link to="/login" className="auth-switch-link">
                  {t("auth.alreadyHaveAccount")}
                </Link>

                {signupError && (
                  <p className="auth-field-error">{signupError}</p>
                )}

                <button
                  type="submit"
                  className="auth-submit-btn"
                  disabled={
                    signupLoading || wilayaLoading || wilayaOptions.length === 0
                  }
                >
                  {signupLoading ? t("auth.creating") : t("auth.createAccountTitle")}
                </button>
              </form>
            </>
          ) : (
            <>
              <h1 className="auth-title">{t("auth.welcomeTitle")}</h1>
              <p className="auth-subtitle">{t("auth.welcomeDesc")}</p>

              <h2 className="auth-section-title">{t("auth.signInHeading")}</h2>

              <form className="auth-form" onSubmit={handleLoginSubmit}>
                <label className="auth-input">
                  <PhoneIcon />
                  <input
                    type="tel"
                    required
                    placeholder={t("auth.mobile")}
                    value={loginForm.mobile}
                    onChange={(event) =>
                      setLoginForm({ mobile: event.target.value })
                    }
                  />
                </label>

                {loginError && <p className="auth-field-error">{loginError}</p>}

                <button
                  type="submit"
                  className="auth-submit-btn"
                  disabled={loginLoading}
                >
                  {loginLoading ? t("auth.sendingCode") : t("auth.login")}
                </button>

                <div className="auth-divider">
                  <span />
                  {t("auth.or")}
                  <span />
                </div>

                <Link to="/signup" className="auth-secondary-btn">
                  {t("auth.createNewAccount")}
                </Link>
              </form>
            </>
          )}
        </div>
      </div>

      {showOtpModal && (
        <div className="auth-otp-overlay">
          <div className="auth-otp-modal">
            <button
              type="button"
              className="auth-otp-close"
              aria-label="Close"
              onClick={() => setShowOtpModal(false)}
            >
              ×
            </button>

            <VerificationIcon />

            <p className="auth-otp-text">
              {t("auth.otpPrompt")}{" "}
              <span className="auth-otp-highlight">{t("auth.otpPromptHighlight")}</span>
            </p>
            <p className="auth-otp-number">+968 {maskMobile(otpMobile)}</p>

            <form className="auth-otp-form" onSubmit={handleVerifySubmit}>
              <div className="auth-otp-inputs">
                {otpValues.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpInputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className="auth-otp-input"
                    value={digit}
                    onChange={(event) =>
                      handleOtpChange(index, event.target.value)
                    }
                    onKeyDown={(event) => handleOtpKeyDown(index, event)}
                  />
                ))}
              </div>

              {otpError && <p className="auth-field-error">{otpError}</p>}

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={otpLoading}
              >
                {otpLoading ? t("auth.verifying") : t("auth.verify")}
              </button>
            </form>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="auth-otp-overlay">
          <div className="auth-otp-modal">
            <button
              type="button"
              className="auth-otp-close"
              aria-label="Close"
              onClick={() => setShowSuccessModal(false)}
            >
              ×
            </button>

            <img
              src="/services/Success%20icon.svg"
              alt=""
              className="auth-success-icon"
            />

            <h3 className="auth-success-title">{t("auth.successTitle")}</h3>
            <p className="auth-otp-text">{t("auth.successDesc")}</p>

            <button
              type="button"
              className="auth-submit-btn"
              onClick={handleSuccessDone}
            >
              {t("auth.done")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
