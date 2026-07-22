import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { useLanguage } from "../../context/useLanguage";
import { getMyAccounts } from "../../api/profile";
import { ApiError } from "../../api/client";
import "./Profile.css";

// أيقونة السهم الصغيرة بين أجزاء الـ breadcrumb (بتتقلب لما اللغة عربي)
function BreadcrumbChevron() {
  const { language } = useLanguage();
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ transform: language === "ar" ? "rotate(180deg)" : undefined }}>
      <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="2.5" y="5" width="19" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M2.5 10h19" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function HistoryIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 12a9 9 0 109-9 9 9 0 00-7.5 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path d="M3 4v4h4M12 7v5l3.5 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 10a6 6 0 1112 0c0 4.2 1.4 5.8 2 6.5H4c.6-.7 2-2.3 2-6.5z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M10.3 19.5a1.8 1.8 0 003.4 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.6 15a1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// أرقام accountType الرقمية من الـ API (1=شخصي، 2=شركة) — نفس القيم
// المستخدمة بصفحة التسجيل (ACCOUNT_TYPE_VALUES)
function accountTypeLabel(t, accountType) {
  const isCompany = accountType === "company" || accountType === 2;
  return isCompany ? t("auth.companyAccount") : t("auth.personalAccount");
}

// جدول أرقام حسابات الفوترة (Bill Account Number) — الـ API الحقيقي لهاد
// الجدول مش موجود لهلق، فهاي بيانات وهمية بس لحد ما نعرف الـ endpoint الصحيح
const MOCK_BILL_ACCOUNTS = [
  { id: "ACC-1001", amount: "125,430.00", status: "Active" },
  { id: "ACC-1002", amount: "32,150.00", status: "Active" },
  { id: "ACC-1003", amount: "0.00", status: "Pending" },
  { id: "ACC-1004", amount: "0.00", status: "Inactive" },
];

const billStatusClassMap = {
  Active: "profile-status-green",
  Pending: "profile-status-orange",
  Inactive: "profile-status-gray",
};

export default function Profile() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [accounts, setAccounts] = useState([]);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [accountsError, setAccountsError] = useState("");

  useEffect(() => {
    let cancelled = false;
    getMyAccounts()
      .then((result) => {
        if (cancelled) return;
        setAccounts(Array.isArray(result) ? result : result?.result || []);
      })
      .catch((error) => {
        if (!cancelled) setAccountsError(error instanceof ApiError ? error.message : t("profile.genericError"));
      })
      .finally(() => {
        if (!cancelled) setAccountsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [t]);

  return (
    <div className="page-canvas">
      <div className="breadcrumb-bar">
        <div className="breadcrumb-inner container">
          <Link to="/" className="breadcrumb-link">
            {t("common.home")}
          </Link>
          <BreadcrumbChevron />
          <span className="breadcrumb-current">{t("profile.breadcrumbCurrent")}</span>
        </div>
      </div>

      <section className="profile-hero">
        <div className="container">
          <div className="profile-hero-row">
            <div>
              <h1 className="profile-title">{t("profile.title")}</h1>
              <p className="profile-subtitle">{t("profile.subtitle")}</p>
            </div>
            <button type="button" className="profile-add-account-btn">
              <PlusIcon />
              {t("profile.addAccount")}
            </button>
          </div>
        </div>
      </section>

      <section className="profile-body">
        <div className="container">
          <div className="profile-main-grid">
            <div className="profile-card profile-summary-card">
              <span className="profile-avatar-lg">{user?.initials || "GU"}</span>
              <h2 className="profile-name">{user?.name}</h2>
              <span className="profile-type-badge">{accountTypeLabel(t, user?.accountType)}</span>

              <div className="profile-account-nb">
                <span className="profile-account-nb-label">{t("profile.accountNb")}</span>
                <span className="profile-account-nb-value">{user?.accountNo || "-"}</span>
              </div>

              <button type="button" className="profile-edit-btn">
                <EditIcon />
                {t("profile.editProfile")}
              </button>
            </div>

            <div className="profile-card profile-overview-card">
              <h3>{t("profile.accountOverview")}</h3>
              <p className="profile-card-desc">{t("profile.accountOverviewDesc")}</p>

              <dl className="profile-overview-list">
                <div className="profile-overview-row">
                  <dt>{t("profile.accountType")}</dt>
                  <dd>{accountTypeLabel(t, user?.accountType)}</dd>
                </div>
                <div className="profile-overview-row">
                  <dt>{t("profile.email")}</dt>
                  <dd>{user?.email || "-"}</dd>
                </div>
                <div className="profile-overview-row">
                  <dt>{t("profile.phoneNumber")}</dt>
                  <dd>{user?.mobile || "-"}</dd>
                </div>
                <div className="profile-overview-row">
                  <dt>{t("profile.civilId")}</dt>
                  <dd>{user?.civilId || "-"}</dd>
                </div>
                <div className="profile-overview-row">
                  <dt>{t("profile.address")}</dt>
                  <dd>{user?.address || "-"}</dd>
                </div>
              </dl>
            </div>

            <div className="profile-card profile-accounts-card">
              <h3>{t("profile.myAccount")}</h3>
              <p className="profile-card-desc">{t("profile.selectAccount")}</p>

              {accountsLoading && <p className="profile-status-text">{t("profile.loading")}</p>}
              {!accountsLoading && accountsError && <p className="profile-status-text">{accountsError}</p>}
              {!accountsLoading && !accountsError && accounts.length === 0 && (
                <p className="profile-status-text">{t("profile.noAccounts")}</p>
              )}

              {!accountsLoading && !accountsError && accounts.length > 0 && (
                <ul className="profile-account-list">
                  {accounts.map((account) => (
                    <li
                      key={account.accountId}
                      className={`profile-account-item${account.accountId === user?.accountNo ? " active" : ""}`}
                    >
                      <span className="profile-avatar-sm">{user?.initials || "GU"}</span>
                      <div className="profile-account-item-body">
                        <p className="profile-account-item-type">{accountTypeLabel(t, account.accountType)}</p>
                        <span className="profile-account-item-id">{account.accountId}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="profile-bottom-grid">
            <div className="profile-card">
              <h3>{t("profile.billAccountNumber")}</h3>
              <p className="profile-card-desc">{t("profile.billAccountDesc")}</p>

              <div className="profile-bill-table-scroll">
                <table className="profile-bill-table">
                  <thead>
                    <tr>
                      <th>{t("profile.billsAccountNb")}</th>
                      <th>{t("profile.totalOutstanding")}</th>
                      <th>{t("profile.status")}</th>
                      <th aria-hidden="true" />
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_BILL_ACCOUNTS.map((bill) => (
                      <tr key={bill.id}>
                        <td className="profile-bill-id">{bill.id}</td>
                        <td>
                          {bill.amount} {t("profile.omr")}
                        </td>
                        <td>
                          <span className={`profile-status-pill ${billStatusClassMap[bill.status]}`}>
                            {t(`profile.billStatusLabels.${bill.status}`)}
                          </span>
                        </td>
                        <td className="profile-bill-arrow">
                          <BreadcrumbChevron />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="profile-card">
              <h3>{t("profile.quickAction")}</h3>
              <p className="profile-card-desc">{t("profile.fastAccess")}</p>

              <div className="profile-quick-grid">
                <button type="button" className="profile-quick-tile">
                  <span className="profile-quick-icon">
                    <CardIcon />
                  </span>
                  <span>
                    <span className="profile-quick-title">{t("profile.payBills")}</span>
                    <span className="profile-quick-desc">{t("profile.makePayment")}</span>
                  </span>
                </button>

                <button type="button" className="profile-quick-tile">
                  <span className="profile-quick-icon">
                    <HistoryIcon />
                  </span>
                  <span>
                    <span className="profile-quick-title">{t("profile.billingHistory")}</span>
                    <span className="profile-quick-desc">{t("profile.viewPostBills")}</span>
                  </span>
                </button>

                <Link to="/notifications" className="profile-quick-tile">
                  <span className="profile-quick-icon">
                    <BellIcon />
                  </span>
                  <span>
                    <span className="profile-quick-title">{t("profile.notifications")}</span>
                    <span className="profile-quick-desc">{t("profile.manageAlerts")}</span>
                  </span>
                </Link>

                <button type="button" className="profile-quick-tile">
                  <span className="profile-quick-icon">
                    <SettingsIcon />
                  </span>
                  <span>
                    <span className="profile-quick-title">{t("profile.accountSettings")}</span>
                    <span className="profile-quick-desc">{t("profile.managePreferences")}</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
