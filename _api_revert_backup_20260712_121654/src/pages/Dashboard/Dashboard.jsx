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
      <path d="M12 10v4.2M12 17v.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
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
      <path d="M10 19.5a2 2 0 004 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
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
  { id: "total", label: "Total Bills", value: 12, tone: "blue", icon: "/services/Container.svg" },
  { id: "paid", label: "Paid", value: 5, tone: "green", icon: "/services/Container%20(1).svg" },
  { id: "pending", label: "Pending Bills", value: 5, tone: "orange", icon: "/services/Container%20(2).svg" },
  { id: "overdue", label: "Overdue Bills", value: 2, tone: "red", icon: "/services/Container%20(3).svg" },
];

const meterBoxes = [
  {
    id: "reading",
    Icon: MeterIcon,
    tone: "navy",
    title: "Last Meter Reading",
    value: "125.50 m³",
    meta: "25 May 2025",
    cta: "View Details",
  },
  {
    id: "status",
    Icon: ShieldCheckIcon,
    tone: "green",
    title: "Service Status",
    badge: "Active",
    desc: "No active outages in your area",
    cta: "View Status",
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
      <AreaChart data={consumptionData} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
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
          contentStyle={{ borderRadius: 8, border: "1px solid #eceef1", fontSize: 12 }}
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
  { id: "services", label: "10 Services", tone: "blue", value: 10 },
  { id: "complaints", label: "5 Complaints", tone: "orange", value: 5 },
  { id: "inquiries", label: "5 Inquiries", tone: "teal", value: 5 },
];

const billList = [
  { id: "NFZ12345677", billDate: "03/02/2027", dueDate: "03/02/2027", amount: "23 OMR", status: "Overdue" },
  { id: "NFZ12345677", billDate: "03/02/2027", dueDate: "03/02/2027", amount: "66 OMR", status: "Pending" },
  { id: "NFZ12345677", billDate: "03/02/2027", dueDate: "03/02/2027", amount: "66 OMR", status: "Paid" },
  { id: "NFZ12345677", billDate: "03/02/2027", dueDate: "03/02/2027", amount: "66 OMR", status: "Paid" },
];

const requestTabs = [
  {
    id: "services",
    label: "My Services",
    rows: [
      { id: "NFZ12345677", name: "NOC Request", start: "03/02/2026", end: "03/02/2027", status: "Rejected" },
      { id: "NFZ12345677", name: "Water Service Connection", start: "03/02/2026", end: "03/02/2027", status: "Approved" },
      { id: "NFZ12345677", name: "Data Update Request", start: "03/02/2026", end: "03/02/2027", status: "Pending" },
    ],
  },
  {
    id: "complaints",
    label: "My Complaints",
    rows: [
      { id: "NFZ12345678", name: "Billing Complaint", start: "03/02/2026", end: "03/02/2027", status: "Pending" },
      { id: "NFZ12345679", name: "Service Interruption", start: "03/02/2026", end: "03/02/2027", status: "Approved" },
    ],
  },
  {
    id: "inquiries",
    label: "My Inquiries",
    rows: [
      { id: "NFZ12345680", name: "Meter Reading Inquiry", start: "03/02/2026", end: "03/02/2027", status: "Approved" },
    ],
  },
  {
    id: "payments",
    label: "My Payments",
    rows: [
      { id: "NFZ12345681", name: "January Bill Payment", start: "03/02/2026", end: "03/02/2026", status: "Paid" },
      { id: "NFZ12345682", name: "February Bill Payment", start: "03/02/2026", end: "03/02/2026", status: "Paid" },
    ],
  },
];

const quickActions = [
  {
    id: "disconnection",
    tone: "red",
    Icon: WarningIcon,
    time: "10:30 AM",
    title: "Disconnection Warning",
    desc: "Your service may be temporarily suspended due to pending payment.",
  },
  {
    id: "reminder",
    tone: "orange",
    Icon: BellIcon,
    time: "10:30 AM",
    title: "Reminder",
    desc: "Friendly reminder about your upcoming due date or scheduled service.",
  },
  {
    id: "payment",
    tone: "green",
    Icon: CheckCircleIcon,
    time: "10:30 AM",
    title: "Payment Success",
    desc: "Your recent request has been successfully processed. Thank you!",
  },
];

const recentServices = [
  {
    id: "inquiry",
    tone: "peach",
    title: "Inquiry",
    desc: "A recently submitted inquiry waiting for a response.",
  },
  {
    id: "water",
    tone: "blue",
    title: "Water Service Connection",
    desc: "A recently submitted service request being processed.",
  },
  {
    id: "complaints",
    tone: "mint",
    title: "Complaints",
    desc: "A recently submitted complaint that is currently under review.",
  },
];

// المخطط الدائري (donut) لملخص الطلبات، أصل الصورة (public/cerlce.svg) فيه النسب مرسومة جواه كـ paths
function RequestsDonut() {
  return (
    <div className="dash-donut-ring">
      <img src="/cerlce.svg" alt="Requests summary donut chart" className="dash-donut-img" />
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
            Home
          </Link>
          <BreadcrumbChevron />
          <span className="breadcrumb-current">My Dashboard</span>
        </div>
      </div>

      <section className="dash-hero">
        <div className="container">
          <h1 className="dash-title">My Dashboard</h1>
          <p className="dash-subtitle">All In One View</p>
          <p className="dash-desc">
            Everything you need to track, manage, and grow all in one simple and intuitive
            space{user?.name ? `, ${user.name}` : ""}.
          </p>
        </div>
      </section>

      <section className="dash-body">
        <div className="container">
          <h2 className="dash-section-title">Total Bills Overview</h2>

          <div className="dash-stats-row">
            <p className="dash-stats-caption">Overview of your billing status</p>

            <div className="dash-stats-grid">
              {statCards.map((card) => (
                <div key={card.id} className={`dash-stat-card dash-tone-${card.tone}`}>
                  <span className="dash-stat-icon">
                    <img src={card.icon} alt="" width="44" height="44" />
                  </span>
                  <span className="dash-stat-text">
                    <span className="dash-stat-value">{card.value}</span>
                    <span className="dash-stat-label">{card.label}</span>
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
                  <h3>Consumption Overview</h3>
                  <button type="button" className="dash-period-pill">
                    This Month
                    <ChevronDownIcon />
                  </button>
                </div>

                <div className="dash-consumption-grid">
                  <div className="dash-consumption-chart-wrap">
                    <p className="dash-consumption-value">
                      18.6 <span>m³</span>
                    </p>
                    <p className="dash-consumption-label">Water Consumed</p>
                    <p className="dash-consumption-delta">↓ 8% less than last month</p>

                    <div className="dash-chart-area">
                      <ConsumptionChart />
                    </div>
                  </div>

                  <div className="dash-meter-boxes">
                    {meterBoxes.map((box) => (
                      <div key={box.id} className="dash-meter-box">
                        <div className="dash-meter-row">
                          <span className={`dash-meter-icon dash-meter-icon-${box.tone}`}>
                            <box.Icon />
                          </span>
                          <div className="dash-meter-text">
                            <p className="dash-meter-title">{box.title}</p>
                            {box.value && <p className="dash-meter-value">{box.value}</p>}
                            {box.badge && <span className="dash-meter-badge">{box.badge}</span>}
                            {box.meta && <p className="dash-meter-meta">{box.meta}</p>}
                            {box.desc && <p className="dash-meter-meta">{box.desc}</p>}
                          </div>
                        </div>
                        <button type="button" className="dash-outline-btn">
                          {box.cta}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Your Requests Summary */}
              <div className="dash-card dash-requests-card">
                <div className="dash-requests-text">
                  <h3>Your Requests Summary</h3>
                  <p className="dash-card-desc">
                    A quick overview of all requests submitted by the user, including
                    complaints, inquiries, and service requests, displayed in a clear visual
                    breakdown.
                  </p>
                </div>

                <RequestsDonut />

                <ul className="dash-donut-legend">
                  {requestSegments.map((segment) => (
                    <li key={segment.id}>
                      <span className={`dash-legend-dot dash-tone-${segment.tone}`} />
                      {segment.label}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bill List */}
              <div className="dash-card">
                <h3>Bill List</h3>
                <p className="dash-card-desc">View and download your billing statements.</p>

                <div className="dash-table-scroll">
                  <table className="dash-table">
                    <thead>
                      <tr>
                        <th>Bills Nb.</th>
                        <th>Bill Date</th>
                        <th>Due Date</th>
                        <th>Amount</th>
                        <th>Status</th>
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
                            <span className={`dash-status-pill ${statusClassMap[bill.status]}`}>
                              {bill.status}
                            </span>
                            {bill.status !== "Paid" && (
                              <button type="button" className="dash-pay-now-btn">
                                Pay Now
                              </button>
                            )}
                          </td>
                          <td>
                            <button type="button" className="dash-icon-btn" aria-label="Download bill">
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
                  <h3>My Requests</h3>
                  <div className="dash-filters">
                    <div className="dash-select-pill">
                      <select value={month} onChange={(event) => setMonth(event.target.value)}>
                        {["January", "February", "March", "April"].map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                      <ChevronDownIcon />
                    </div>
                    <div className="dash-select-pill">
                      <select value={year} onChange={(event) => setYear(event.target.value)}>
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
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="dash-table-scroll">
                  <table className="dash-table">
                    <thead>
                      <tr>
                        <th>Request Nb.</th>
                        <th>Request Name</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentTab.rows.map((row, index) => (
                        <tr key={`${row.id}-${index}`}>
                          <td>
                            <Link to={`/dashboard/requests/${row.id}`} className="dash-table-link">
                              {row.id}
                            </Link>
                          </td>
                          <td>{row.name}</td>
                          <td>{row.start}</td>
                          <td>{row.end}</td>
                          <td>
                            <span className={`dash-status-pill ${statusClassMap[row.status]}`}>
                              {row.status}
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
                <h3>Quick Actions</h3>
                <ul className="dash-actions-list">
                  {quickActions.map((action) => (
                    <li key={action.id} className="dash-action-item">
                      <span className={`dash-action-icon dash-tone-${action.tone}`}>
                        <action.Icon />
                      </span>
                      <div className="dash-action-body">
                        <div className="dash-action-top">
                          <span className="dash-action-when">TODAY</span>
                          <span className="dash-action-time">{action.time}</span>
                        </div>
                        <p className={`dash-action-title dash-text-${action.tone}`}>{action.title}</p>
                        <p className="dash-action-desc">{action.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bill Overview */}
              <div className="dash-card dash-bill-overview">
                <h3>Bill Overview</h3>
                <p className="dash-bill-account">Account Nb: 234567890</p>
                <p className="dash-bill-label">Outstanding Amount</p>
                <p className="dash-bill-amount">
                  48.500 <span>OMR</span>
                </p>
                <p className="dash-bill-due">Due in 3 days</p>
                <p className="dash-bill-date">Due Date: 05 Jun 2025</p>
                <img src="/services/Group%201597883364.svg" alt="" className="dash-bill-doc" />
              </div>

              {/* Recent Submitted Services */}
              <div className="dash-card">
                <h3>Recent Submitted Services</h3>
                <ul className="dash-recent-list">
                  {recentServices.map((service) => (
                    <li key={service.id} className={`dash-recent-item dash-recent-${service.tone}`}>
                      <div>
                        <p className="dash-recent-title">{service.title}</p>
                        <p className="dash-recent-desc">{service.desc}</p>
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
