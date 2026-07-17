import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { registerAccount, requestLoginOtp, verifyLoginOtp, verifyRegistration } from "../../api/auth";
import { ApiError } from "../../api/client";
import { lookupEntities } from "../../api/lookup";
import "./Auth.css";

// TODO: تأكيد القيم الرقمية الفعلية لـ AccountType من فريق الـ backend —
// الـ Swagger بيوصفها كرقم بس بدون تعداد أسماء، فهاي قيم افتراضية شائعة
const ACCOUNT_TYPE_VALUES = { personal: 1, company: 2 };

// TODO: تأكيد اسم الـ entity وأسماء الأعمدة الفعلية لقائمة Al-Wilaya من
// فريق الـ backend — ما قدرنا نجربها Live بسبب مشكلة الـ 401/CORS الحالية
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
  return (
    <img src="/services/Group.svg" alt="" className="auth-otp-icon" />
  );
}

function PersonIcon() {
  return <img src="/services/Icon-left.svg" alt="" className="auth-input-icon" />;
}

function MailIcon() {
  return <img src="/services/Icon-left%20(1).svg" alt="" className="auth-input-icon" />;
}

function PhoneIcon() {
  return <img src="/services/Icon-left%20(2).svg" alt="" className="auth-input-icon" />;
}

export default function Auth() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { loginWithTokens } = useAuth();
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
          error instanceof ApiError ? error.message : "Could not load Al-Wilaya list.",
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
        error instanceof ApiError ? error.message : "Something went wrong. Please try again.",
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
      await registerAccount({ phone: signupForm.mobile, civilId: signupForm.civilId });
      setOtpContext("signup");
      setOtpMobile(signupForm.mobile);
      setOtpValues(["", "", "", ""]);
      setOtpError("");
      setShowOtpModal(true);
    } catch (error) {
      setSignupError(
        error instanceof ApiError ? error.message : "Something went wrong. Please try again.",
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
    setOtpError("");
    setOtpLoading(true);

    if (otpContext === "signup") {
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
          companyName: signupForm.accountType === "company" ? signupForm.companyName : null,
          crNumber: signupForm.accountType === "company" ? signupForm.crNumber : null,
          companyPhone: signupForm.accountType === "company" ? signupForm.companyPhone : null,
          companyAddress: signupForm.accountType === "company" ? signupForm.companyAddress : null,
        });
        setShowOtpModal(false);
        setShowSuccessModal(true);
      } catch (error) {
        setOtpError(
          error instanceof ApiError ? error.message : "Invalid code. Please try again.",
        );
      } finally {
        setOtpLoading(false);
      }
      return;
    }

    try {
      const tokens = await verifyLoginOtp({ phone: otpMobile, code: otpValues.join("") });
      await loginWithTokens(tokens);
      setShowOtpModal(false);
      navigate("/");
    } catch (error) {
      setOtpError(
        error instanceof ApiError ? error.message : "Invalid code. Please try again.",
      );
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSuccessDone = () => {
    setShowSuccessModal(false);
    navigate("/login");
  };

  return (
    <div className="auth-page">
      <img src="/logo.svg" alt="Marafiq" className="auth-visual-logo" />

      <div className="auth-visual-text">
        <h2>Easy Requests, Fast Processing</h2>
        <p>
          Submit service requests, track their progress, and receive updates
          seamlessly without the need for in-person visits.
        </p>
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
              <h1 className="auth-title">Create New Account</h1>

              <form className="auth-form" onSubmit={handleSignupSubmit}>
                <div className="auth-account-type-toggle">
                  <button
                    type="button"
                    className={`auth-account-type-btn${signupForm.accountType === "personal" ? " active" : ""}`}
                    onClick={() => setSignupForm((form) => ({ ...form, accountType: "personal" }))}
                  >
                    Personal Account
                  </button>
                  <button
                    type="button"
                    className={`auth-account-type-btn${signupForm.accountType === "company" ? " active" : ""}`}
                    onClick={() => setSignupForm((form) => ({ ...form, accountType: "company" }))}
                  >
                    Company Account
                  </button>
                </div>

                <label className="auth-input">
                  <PersonIcon />
                  <input
                    type="text"
                    required
                    placeholder="First Name"
                    value={signupForm.firstName}
                    onChange={(event) =>
                      setSignupForm((form) => ({ ...form, firstName: event.target.value }))
                    }
                  />
                </label>

                <label className="auth-input">
                  <PersonIcon />
                  <input
                    type="text"
                    required
                    placeholder="Last Name"
                    value={signupForm.lastName}
                    onChange={(event) =>
                      setSignupForm((form) => ({ ...form, lastName: event.target.value }))
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
                    placeholder="Civil ID (7 digits)"
                    value={signupForm.civilId}
                    onChange={(event) =>
                      setSignupForm((form) => ({
                        ...form,
                        civilId: event.target.value.replace(/\D/g, "").slice(0, 7),
                      }))
                    }
                  />
                </label>

                <label className="auth-input">
                  <MailIcon />
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    value={signupForm.email}
                    onChange={(event) =>
                      setSignupForm((form) => ({ ...form, email: event.target.value }))
                    }
                  />
                </label>

                <label className="auth-input">
                  <PhoneIcon />
                  <input
                    type="tel"
                    required
                    placeholder="Mobile Number"
                    value={signupForm.mobile}
                    onChange={(event) =>
                      setSignupForm((form) => ({ ...form, mobile: event.target.value }))
                    }
                  />
                </label>

                <div className="auth-input-group">
                  <label className={wilayaError ? "auth-input auth-input-error" : "auth-input"}>
                    <select
                      required
                      className="auth-select"
                      value={signupForm.alWilayaId}
                      disabled={wilayaLoading || wilayaOptions.length === 0}
                      onChange={(event) =>
                        setSignupForm((form) => ({ ...form, alWilayaId: event.target.value }))
                      }
                    >
                      <option value="" disabled>
                        {wilayaLoading ? "Loading Al-Wilaya…" : "Al-Wilaya"}
                      </option>
                      {wilayaOptions.map((option) => (
                        <option key={option[AL_WILAYA_ID_FIELD]} value={option[AL_WILAYA_ID_FIELD]}>
                          {option[AL_WILAYA_NAME_FIELD]}
                        </option>
                      ))}
                    </select>
                  </label>
                  {wilayaError && <p className="auth-field-error">{wilayaError}</p>}
                </div>

                <label className="auth-input">
                  <input
                    type="text"
                    placeholder="Address (optional)"
                    value={signupForm.address}
                    onChange={(event) =>
                      setSignupForm((form) => ({ ...form, address: event.target.value }))
                    }
                  />
                </label>

                {signupForm.accountType === "company" && (
                  <>
                    <label className="auth-input">
                      <input
                        type="text"
                        required
                        placeholder="Company Name"
                        value={signupForm.companyName}
                        onChange={(event) =>
                          setSignupForm((form) => ({ ...form, companyName: event.target.value }))
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
                        placeholder="CR Number (7 digits)"
                        value={signupForm.crNumber}
                        onChange={(event) =>
                          setSignupForm((form) => ({
                            ...form,
                            crNumber: event.target.value.replace(/\D/g, "").slice(0, 7),
                          }))
                        }
                      />
                    </label>
                    <label className="auth-input">
                      <PhoneIcon />
                      <input
                        type="tel"
                        required
                        placeholder="Company Phone"
                        value={signupForm.companyPhone}
                        onChange={(event) =>
                          setSignupForm((form) => ({ ...form, companyPhone: event.target.value }))
                        }
                      />
                    </label>
                    <label className="auth-input">
                      <input
                        type="text"
                        required
                        placeholder="Company Address"
                        value={signupForm.companyAddress}
                        onChange={(event) =>
                          setSignupForm((form) => ({ ...form, companyAddress: event.target.value }))
                        }
                      />
                    </label>
                  </>
                )}

                <Link to="/login" className="auth-switch-link">
                  Already have an account?
                </Link>

                {signupError && <p className="auth-field-error">{signupError}</p>}

                <button
                  type="submit"
                  className="auth-submit-btn"
                  disabled={signupLoading || wilayaLoading || wilayaOptions.length === 0}
                >
                  {signupLoading ? "Creating…" : "Create New Account"}
                </button>
              </form>
            </>
          ) : (
            <>
              <h1 className="auth-title">Welcome To Marafiq,</h1>
              <p className="auth-subtitle">
                Log in to access your services, track requests, and stay
                connected.
              </p>

              <h2 className="auth-section-title">Sign in to your account</h2>

              <form className="auth-form" onSubmit={handleLoginSubmit}>
                <label className="auth-input">
                  <PhoneIcon />
                  <input
                    type="tel"
                    required
                    placeholder="Mobile Number"
                    value={loginForm.mobile}
                    onChange={(event) =>
                      setLoginForm({ mobile: event.target.value })
                    }
                  />
                </label>

                {loginError && <p className="auth-field-error">{loginError}</p>}

                <button type="submit" className="auth-submit-btn" disabled={loginLoading}>
                  {loginLoading ? "Sending code…" : "Log In"}
                </button>

                <div className="auth-divider">
                  <span />
                  or
                  <span />
                </div>

                <Link to="/signup" className="auth-secondary-btn">
                  Create New Account
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
              Please enter the verification code sent to your{" "}
              <span className="auth-otp-highlight">mobile number</span>
            </p>
            <p className="auth-otp-number">
              +968 {maskMobile(otpMobile)}
            </p>

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

              <button type="submit" className="auth-submit-btn" disabled={otpLoading}>
                {otpLoading ? "Verifying…" : "Verify"}
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

            <h3 className="auth-success-title">Profile created successfully</h3>
            <p className="auth-otp-text">
              You have successfully set up your profile. You can now view or
              update it at any time.
            </p>

            <button
              type="button"
              className="auth-submit-btn"
              onClick={handleSuccessDone}
            >
              Done
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

