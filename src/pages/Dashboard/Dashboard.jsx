import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAuth } from "../../context/useAuth";
import { useLanguage } from "../../context/useLanguage";
import "./Dashboard.css";

// أيقونة السهم الصغيرة بين أجزاء الـ breadcrumb
function BreadcrumbChevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M9 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DownloadIcon() {
  return <img src="/download.svg" alt="" width="16" height="16" />;
}

function CheckCircleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M8 12.5l2.5 2.5L16 9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3.5l9.5 16.5H2.5z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M12 10v4.2M12 17v.01"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
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
      <path
        d="M10 19.5a2 2 0 004 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MeterIcon() {
  return <img src="/services/Frame6.svg" alt="" width="28" height="28" />;
}

function ShieldCheckIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path
        d="M14 3.5l8.5 3.2v7c0 6-3.6 9.9-8.5 11.8-4.9-1.9-8.5-5.8-8.5-11.8v-7L14 3.5z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9.7 13.9l2.9 2.9 5.7-5.9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const statCards = [
  {
    id: "total",
    labelKey: "dashboard.stats.total",
    value: 12,
    tone: "blue",
    icon: "/services/Container.svg",
  },
  {
    id: "paid",
    labelKey: "dashboard.stats.paid",
    value: 5,
    tone: "green",
    icon: "/services/Container%20(1).svg",
  },
  {
    id: "pending",
    labelKey: "dashboard.stats.pending",
    value: 5,
    tone: "orange",
    icon: "/services/Container%20(2).svg",
  },
  {
    id: "overdue",
    labelKey: "dashboard.stats.overdue",
    value: 2,
    tone: "red",
    icon: "/services/Container%20(3).svg",
  },
];

const meterBoxes = [
  {
    id: "reading",
    Icon: MeterIcon,
    tone: "navy",
    titleKey: "dashboard.lastMeterReading",
    value: "125.50 m³",
    meta: "25 May 2025",
    ctaKey: "dashboard.viewDetails",
  },
  {
    id: "status",
    Icon: ShieldCheckIcon,
    tone: "green",
    titleKey: "dashboard.serviceStatus",
    badgeKey: "dashboard.active",
    descKey: "dashboard.noOutages",
    ctaKey: "dashboard.viewStatus",
  },
];

const consumptionData = [
  { date: "1 May", value: 6 },
  { date: "4 May", value: 10 },
  { date: "7 May", value: 8 },
  { date: "10 May", value: 13 },
  { date: "13 May", value: 16 },
  { date: "16 May", value: 12 },
  { date: "20 May", value: 18 },
  { date: "24 May", value: 16 },
  { date: "27 May", value: 23 },
  { date: "31 May", value: 28 },
];

const consumptionAxisTicks = ["1 May", "10 May", "20 May", "31 May"];

// شارت استهلاك المياه الحقيقي (Recharts) بدل الصورة الثابتة
function ConsumptionChart() {
  return (
    <ResponsiveContainer width="100%" height={170}>
      <AreaChart
        data={consumptionData}
        margin={{ top: 8, right: 12, left: 0, bottom: 4 }}
      >
        <defs>
          <linearGradient id="dash-chart-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0aa6a6" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#0aa6a6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="date"
          ticks={consumptionAxisTicks}
          interval={0}
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#a3a8b0", fontSize: 11 }}
          padding={{ left: 16, right: 16 }}
          dy={8}
        />
        <YAxis
          domain={[0, 30]}
          ticks={[0, 10, 20, 30]}
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#a3a8b0", fontSize: 11 }}
          width={32}
          tickMargin={4}
        />
        <Tooltip
          formatter={(value) => [`${value} m³`, "Consumption"]}
          contentStyle={{
            borderRadius: 8,
            border: "1px solid #eceef1",
            fontSize: 12,
          }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#0aa6a6"
          strokeWidth={3}
          fill="url(#dash-chart-fill)"
          dot={false}
          activeDot={{ r: 4, fill: "#0aa6a6" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

const requestSegments = [
  {
    id: "services",
    segmentKey: "dashboard.segments.services",
    tone: "blue",
    value: 10,
  },
  {
    id: "complaints",
    segmentKey: "dashboard.segments.complaints",
    tone: "orange",
    value: 5,
  },
  {
    id: "inquiries",
    segmentKey: "dashboard.segments.inquiries",
    tone: "teal",
    value: 5,
  },
];

const billList = [
  {
    id: "NFZ12345677",
    billDate: "03/02/2027",
    dueDate: "03/02/2027",
    amount: "23 OMR",
    status: "Overdue",
  },
  {
    id: "NFZ12345677",
    billDate: "03/02/2027",
    dueDate: "03/02/2027",
    amount: "66 OMR",
    status: "Pending",
  },
  {
    id: "NFZ12345677",
    billDate: "03/02/2027",
    dueDate: "03/02/2027",
    amount: "66 OMR",
    status: "Paid",
  },
  {
    id: "NFZ12345677",
    billDate: "03/02/2027",
    dueDate: "03/02/2027",
    amount: "66 OMR",
    status: "Paid",
  },
];

const requestTabs = [
  {
    id: "services",
    labelKey: "dashboard.tabs.services",
    rows: [
      {
        id: "NFZ12345677",
        nameKey: "dashboard.requestRows.noc",
        start: "03/02/2026",
        end: "03/02/2027",
        status: "Rejected",
      },
      {
        id: "NFZ12345677",
        nameKey: "dashboard.requestRows.waterConnection",
        start: "03/02/2026",
        end: "03/02/2027",
        status: "Approved",
      },
      {
        id: "NFZ12345677",
        nameKey: "dashboard.requestRows.dataUpdate",
        start: "03/02/2026",
        end: "03/02/2027",
        status: "Pending",
      },
    ],
  },
  {
    id: "complaints",
    labelKey: "dashboard.tabs.complaints",
    rows: [
      {
        id: "NFZ12345678",
        nameKey: "dashboard.requestRows.billingComplaint",
        start: "03/02/2026",
        end: "03/02/2027",
        status: "Pending",
      },
      {
        id: "NFZ12345679",
        nameKey: "dashboard.requestRows.serviceInterruption",
        start: "03/02/2026",
        end: "03/02/2027",
        status: "Approved",
      },
    ],
  },
  {
    id: "inquiries",
    labelKey: "dashboard.tabs.inquiries",
    rows: [
      {
        id: "NFZ12345680",
        nameKey: "dashboard.requestRows.meterReadingInquiry",
        start: "03/02/2026",
        end: "03/02/2027",
        status: "Approved",
      },
    ],
  },
  {
    id: "payments",
    labelKey: "dashboard.tabs.payments",
    rows: [
      {
        id: "NFZ12345681",
        nameKey: "dashboard.requestRows.januaryPayment",
        start: "03/02/2026",
        end: "03/02/2026",
        status: "Paid",
      },
      {
        id: "NFZ12345682",
        nameKey: "dashboard.requestRows.februaryPayment",
        start: "03/02/2026",
        end: "03/02/2026",
        status: "Paid",
      },
    ],
  },
];

const quickActions = [
  {
    id: "disconnection",
    tone: "red",
    Icon: WarningIcon,
    time: "10:30 AM",
    actionKey: "disconnection",
  },
  {
    id: "reminder",
    tone: "orange",
    Icon: BellIcon,
    time: "10:30 AM",
    actionKey: "reminder",
  },
  {
    id: "payment",
    tone: "green",
    Icon: CheckCircleIcon,
    time: "10:30 AM",
    actionKey: "payment",
  },
];

const recentServices = [
  { id: "inquiry", tone: "peach", itemKey: "inquiry" },
  { id: "water", tone: "blue", itemKey: "water" },
  { id: "complaints", tone: "mint", itemKey: "complaints" },
];

// المخطط الدائري (donut) لملخص الطلبات، أصل الصورة (public/cerlce.svg) فيه النسب مرسومة جواه كـ paths
function RequestsDonut() {
  return (
    <div className="dash-donut-ring">
      <img
        src="/cerlce.svg"
        alt="Requests summary donut chart"
        className="dash-donut-img"
      />
    </div>
  );
}

const statusClassMap = {
  Overdue: "dash-status-red",
  Pending: "dash-status-orange",
  Paid: "dash-status-green",
  Rejected: "dash-status-red",
  Approved: "dash-status-green",
};

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState(requestTabs[0].id);
  const [month, setMonth] = useState("January");
  const [year, setYear] = useState("2026");

  const currentTab = requestTabs.find((tab) => tab.id === activeTab);

  return (
    <div className="page-canvas">
      {/* شريط الـ breadcrumb (Home > My Dashboard) */}
      <div className="breadcrumb-bar">
        <div className="breadcrumb-inner container">
          <Link to="/" className="breadcrumb-link">
            {t("common.home")}
          </Link>
          <BreadcrumbChevron />
          <span className="breadcrumb-current">
            {t("dashboard.breadcrumbCurrent")}
          </span>
        </div>
      </div>

      <section className="dash-hero">
        <div className="container">
          <h1 className="dash-title">{t("dashboard.title")}</h1>
          <p className="dash-subtitle">{t("dashboard.subtitle")}</p>
          <p className="dash-desc">
            {t("dashboard.desc")}
            {user?.name ? `, ${user.name}` : ""}.
          </p>
        </div>
      </section>

      <section className="dash-body">
        <div className="container">
          <h2 className="dash-section-title">
            {t("dashboard.totalBillsOverview")}
          </h2>

          <div className="dash-stats-row">
            <p className="dash-stats-caption">{t("dashboard.statsCaption")}</p>

            <div className="dash-stats-grid">
              {statCards.map((card) => (
                <div
                  key={card.id}
                  className={`dash-stat-card dash-tone-${card.tone}`}
                >
                  <span className="dash-stat-icon">
                    <img src={card.icon} alt="" width="44" height="44" />
                  </span>
                  <span className="dash-stat-text">
                    <span className="dash-stat-value">{card.value}</span>
                    <span className="dash-stat-label">{t(card.labelKey)}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="dash-columns">
            <div className="dash-col-main">
              {/* Consumption Overview */}
              <div className="dash-card">
                <div className="dash-card-header">
                  <h3>{t("dashboard.consumptionOverview")}</h3>
                  <button type="button" className="dash-period-pill">
                    {t("dashboard.thisMonth")}
                    <ChevronDownIcon />
                  </button>
                </div>

                <div className="dash-consumption-grid">
                  <div className="dash-consumption-chart-wrap">
                    <p className="dash-consumption-value">
                      18.6 <span>m³</span>
                    </p>
                    <p className="dash-consumption-label">
                      {t("dashboard.waterConsumed")}
                    </p>
                    <p className="dash-consumption-delta">
                      {t("dashboard.consumptionDelta")}
                    </p>

                    <div className="dash-chart-area">
                      <ConsumptionChart />
                    </div>
                  </div>

                  <div className="dash-meter-boxes">
                    {meterBoxes.map((box) => (
                      <div key={box.id} className="dash-meter-box">
                        <div className="dash-meter-row">
                          <span
                            className={`dash-meter-icon dash-meter-icon-${box.tone}`}
                          >
                            <box.Icon />
                          </span>
                          <div className="dash-meter-text">
                            <p className="dash-meter-title">
                              {t(box.titleKey)}
                            </p>
                            {box.value && (
                              <p className="dash-meter-value">{box.value}</p>
                            )}
                            {box.badgeKey && (
                              <span className="dash-meter-badge">
                                {t(box.badgeKey)}
                              </span>
                            )}
                            {box.meta && (
                              <p className="dash-meter-meta">{box.meta}</p>
                            )}
                            {box.descKey && (
                              <p className="dash-meter-meta">
                                {t(box.descKey)}
                              </p>
                            )}
                          </div>
                        </div>
                        <button type="button" className="dash-outline-btn">
                          {t(box.ctaKey)}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Your Requests Summary */}
              <div className="dash-card dash-requests-card">
                <div className="dash-requests-text">
                  <h3>{t("dashboard.requestsSummary")}</h3>
                  <p className="dash-card-desc">
                    {t("dashboard.requestsSummaryDesc")}
                  </p>
                </div>

                <RequestsDonut />

                <ul className="dash-donut-legend">
                  {requestSegments.map((segment) => (
                    <li key={segment.id}>
                      <span
                        className={`dash-legend-dot dash-tone-${segment.tone}`}
                      />
                      {segment.value} {t(segment.segmentKey)}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bill List */}
              <div className="dash-card">
                <h3>{t("dashboard.billList")}</h3>
                <p className="dash-card-desc">{t("dashboard.billListDesc")}</p>

                <div className="dash-table-scroll">
                  <table className="dash-table">
                    <thead>
                      <tr>
                        <th>{t("dashboard.billsNb")}</th>
                        <th>{t("dashboard.billDate")}</th>
                        <th>{t("dashboard.dueDate")}</th>
                        <th>{t("dashboard.amount")}</th>
                        <th>{t("dashboard.status")}</th>
                        <th aria-hidden="true"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {billList.map((bill, index) => (
                        <tr key={`${bill.id}-${index}`}>
                          <td className="dash-table-link">{bill.id}</td>
                          <td>{bill.billDate}</td>
                          <td>{bill.dueDate}</td>
                          <td>{bill.amount}</td>
                          <td>
                            <span
                              className={`dash-status-pill ${statusClassMap[bill.status]}`}
                            >
                              {t(`dashboard.statusLabels.${bill.status}`)}
                            </span>
                            {bill.status !== "Paid" && (
                              <button
                                type="button"
                                className="dash-pay-now-btn"
                              >
                                {t("dashboard.payNow")}
                              </button>
                            )}
                          </td>
                          <td>
                            <button
                              type="button"
                              className="dash-icon-btn"
                              aria-label={t("dashboard.downloadBill")}
                            >
                              <DownloadIcon />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* My Requests */}
              <div className="dash-card">
                <div className="dash-card-header">
                  <h3>{t("dashboard.myRequests")}</h3>
                  <div className="dash-filters">
                    <div className="dash-select-pill">
                      <select
                        value={month}
                        onChange={(event) => setMonth(event.target.value)}
                      >
                        {["January", "February", "March", "April"].map(
                          (m, index) => (
                            <option key={m} value={m}>
                              {t("common.months")[index]}
                            </option>
                          ),
                        )}
                      </select>
                      <ChevronDownIcon />
                    </div>
                    <div className="dash-select-pill">
                      <select
                        value={year}
                        onChange={(event) => setYear(event.target.value)}
                      >
                        {["2024", "2025", "2026"].map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                      <ChevronDownIcon />
                    </div>
                  </div>
                </div>

                <div className="dash-tabs">
                  {requestTabs.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      className={`dash-tab${activeTab === tab.id ? " active" : ""}`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {t(tab.labelKey)}
                    </button>
                  ))}
                </div>

                <div className="dash-table-scroll">
                  <table className="dash-table">
                    <thead>
                      <tr>
                        <th>{t("dashboard.requestNb")}</th>
                        <th>{t("dashboard.requestName")}</th>
                        <th>{t("dashboard.startDate")}</th>
                        <th>{t("dashboard.endDate")}</th>
                        <th>{t("dashboard.status")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentTab.rows.map((row, index) => (
                        <tr key={`${row.id}-${index}`}>
                          <td>
                            <Link
                              to={`/dashboard/requests/${row.id}`}
                              className="dash-table-link"
                            >
                              {row.id}
                            </Link>
                          </td>
                          <td>{t(row.nameKey)}</td>
                          <td>{row.start}</td>
                          <td>{row.end}</td>
                          <td>
                            <span
                              className={`dash-status-pill ${statusClassMap[row.status]}`}
                            >
                              {t(`dashboard.statusLabels.${row.status}`)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="dash-col-side">
              {/* Quick Actions */}
              <div className="dash-card dash-quick-card">
                <h3>{t("dashboard.quickActions")}</h3>
                <ul className="dash-actions-list">
                  {quickActions.map((action) => (
                    <li key={action.id} className="dash-action-item">
                      <span
                        className={`dash-action-icon dash-tone-${action.tone}`}
                      >
                        <action.Icon />
                      </span>
                      <div className="dash-action-body">
                        <div className="dash-action-top">
                          <span className="dash-action-when">
                            {t("dashboard.today")}
                          </span>
                          <span className="dash-action-time">
                            {action.time}
                          </span>
                        </div>
                        <p
                          className={`dash-action-title dash-text-${action.tone}`}
                        >
                          {t(`dashboard.actions.${action.actionKey}.title`)}
                        </p>
                        <p className="dash-action-desc">
                          {t(`dashboard.actions.${action.actionKey}.desc`)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bill Overview */}
              <div className="dash-card dash-bill-overview">
                <h3>{t("dashboard.billOverview")}</h3>
                <p className="dash-bill-account">{t("dashboard.accountNb")}</p>
                <p className="dash-bill-label">
                  {t("dashboard.outstandingAmount")}
                </p>
                <p className="dash-bill-amount">
                  48.500 <span>OMR</span>
                </p>
                <p className="dash-bill-due">{t("dashboard.dueIn")}</p>
                <p className="dash-bill-date">{t("dashboard.dueDateLabel")}</p>
                <img
                  src="/services/Group%201597883364.svg"
                  alt=""
                  className="dash-bill-doc"
                />
              </div>

              {/* Recent Submitted Services */}
              <div className="dash-card">
                <h3>{t("dashboard.recentSubmittedServices")}</h3>
                <ul className="dash-recent-list">
                  {recentServices.map((service) => (
                    <li
                      key={service.id}
                      className={`dash-recent-item dash-recent-${service.tone}`}
                    >
                      <div>
                        <p className="dash-recent-title">
                          {t(`dashboard.recentItems.${service.itemKey}.title`)}
                        </p>
                        <p className="dash-recent-desc">
                          {t(`dashboard.recentItems.${service.itemKey}.desc`)}
                        </p>
                      </div>
                      <ArrowRightIcon />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
