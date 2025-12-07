import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { ThreeDots } from "react-loader-spinner";
import { Navigate } from "react-router-dom";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

import "./admin-analytics.css";
// import AdminHeaderPage from "../AdminHeaderPage";   // if you have
// import AdminNavbarPage from "../AdminNavbarPage";   // if you have

const API_BASE = "https://recruiter-1-gjf3.onrender.com/api/admin-analytics";

const monthNames = [
  "",            // index 0 unused
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const AdminAnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true); // assume true, update if needed

  const [stats, setStats] = useState(null);
  const [growthData, setGrowthData] = useState([]);
  const [recruiterStats, setRecruiterStats] = useState([]);
  const [applicantStats, setApplicantStats] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [recent, setRecent] = useState(null);

  const [error, setError] = useState("");

  useEffect(() => {
    const token = Cookies.get("talentify_admin_jwtToken"); // use your admin token name

    if (!token) {
      setIsAdmin(false);
      setAuthChecked(true);
      setLoading(false);
      return;
    }

    const fetchAll = async () => {
      try {
        setLoading(true);
        setError("");

        const headers = { Authorization: `Bearer ${token}` };

        const [
          statsRes,
          growthRes,
          recruiterRes,
          applicantRes,
          categoriesRes,
          recentRes,
        ] = await Promise.all([
          axios.get(`${API_BASE}/stats`, { headers }),
          axios.get(`${API_BASE}/growth`, { headers }),
          axios.get(`${API_BASE}/recruiter-performance`, { headers }),
          axios.get(`${API_BASE}/applicant-performance`, { headers }),
          axios.get(`${API_BASE}/top-categories`, { headers }),
          axios.get(`${API_BASE}/recent`, { headers }),
        ]);

        // Overall stats
        setStats(statsRes.data.stats);

        // Growth data – merge applications + jobs by month
        const appStats = growthRes.data.applicationStats || [];
        const jobStats = growthRes.data.jobStats || [];

        const monthMap = {};

        appStats.forEach((m) => {
          monthMap[m._id] = {
            month: monthNames[m._id] || `M${m._id}`,
            applications: m.applications,
            jobs: 0,
          };
        });

        jobStats.forEach((m) => {
          if (!monthMap[m._id]) {
            monthMap[m._id] = {
              month: monthNames[m._id] || `M${m._id}`,
              applications: 0,
              jobs: m.jobs,
            };
          } else {
            monthMap[m._id].jobs = m.jobs;
          }
        });

        const mergedGrowth = Object.values(monthMap).sort((a, b) =>
          monthNames.indexOf(a.month) - monthNames.indexOf(b.month)
        );

        setGrowthData(mergedGrowth);

        // Recruiter & Applicant performance
        setRecruiterStats(recruiterRes.data.stats || []);
        setApplicantStats(applicantRes.data.stats || []);

        // Top categories
        setTopCategories(categoriesRes.data.categories || []);

        // Recent activity
        setRecent(recentRes.data.recent || null);

      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message ||
          "Failed to load admin analytics. Please try again."
        );
      } finally {
        setLoading(false);
        setAuthChecked(true);
      }
    };

    fetchAll();
  }, []);

  // If not admin / not logged in -> redirect to login (change route as per your app)
  if (authChecked && !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  if (loading) {
    return (
      <div className="admin-analytics-loader">
        <ThreeDots height={60} width={60} color="blue" />
      </div>
    );
  }

  return (
    <>
      {/* Uncomment if you have these */}
      {/* <AdminHeaderPage /> */}
      {/* <AdminNavbarPage /> */}

      <div className="admin-analytics-page">
        <h2 className="admin-analytics-title">Admin Analytics Dashboard</h2>

        {error && <p className="admin-analytics-error">{error}</p>}

        {/* ======= OVERALL STATS CARDS ======= */}
        {stats && (
          <div className="admin-analytics-stats-grid">
            <div className="admin-stat-card">
              <p className="admin-stat-label">Total Applicants</p>
              <p className="admin-stat-value">{stats.totalApplicants}</p>
            </div>
            <div className="admin-stat-card">
              <p className="admin-stat-label">Total Recruiters</p>
              <p className="admin-stat-value">{stats.totalRecruiters}</p>
            </div>
            <div className="admin-stat-card">
              <p className="admin-stat-label">Total Jobs</p>
              <p className="admin-stat-value">{stats.totalJobs}</p>
            </div>
            <div className="admin-stat-card">
              <p className="admin-stat-label">Total Applications</p>
              <p className="admin-stat-value">{stats.totalApplications}</p>
            </div>
            <div className="admin-stat-card">
              <p className="admin-stat-label">Total Interviews</p>
              <p className="admin-stat-value">{stats.totalInterviews}</p>
            </div>
          </div>
        )}

        {/* ======= GROWTH LINE CHART ======= */}
        <div className="admin-analytics-section">
          <h3 className="admin-section-title">Applications & Jobs Growth</h3>
          {growthData.length === 0 ? (
            <p className="admin-empty-text">No growth data available.</p>
          ) : (
            <div className="admin-chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="applications"
                    name="Applications"
                    stroke="#2563eb"
                  />
                  <Line
                    type="monotone"
                    dataKey="jobs"
                    name="Jobs"
                    stroke="#10b981"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* ======= TOP CATEGORIES BAR CHART ======= */}
        <div className="admin-analytics-section">
          <h3 className="admin-section-title">Top Job Categories</h3>
          {topCategories.length === 0 ? (
            <p className="admin-empty-text">No category data available.</p>
          ) : (
            <div className="admin-chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={topCategories.map((c) => ({
                    category: c._id || "Unknown",
                    count: c.count,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Jobs" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* ======= RECRUITER PERFORMANCE TABLE ======= */}
        <div className="admin-analytics-section">
          <h3 className="admin-section-title">Recruiter Performance</h3>
          {recruiterStats.length === 0 ? (
            <p className="admin-empty-text">No recruiter data available.</p>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Recruiter</th>
                    <th>Email</th>
                    <th>Total Jobs</th>
                    <th>Total Applications</th>
                    <th>Total Interviews</th>
                  </tr>
                </thead>
                <tbody>
                  {recruiterStats.map((r, idx) => (
                    <tr key={idx}>
                      <td>{r.recruiter}</td>
                      <td>{r.email}</td>
                      <td>{r.totalJobs}</td>
                      <td>{r.totalApplications}</td>
                      <td>{r.totalInterviews}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ======= APPLICANT PERFORMANCE TABLE ======= */}
        <div className="admin-analytics-section">
          <h3 className="admin-section-title">Applicant Performance</h3>
          {applicantStats.length === 0 ? (
            <p className="admin-empty-text">No applicant data available.</p>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Applicant</th>
                    <th>Email</th>
                    <th>Applications</th>
                    <th>Interviews</th>
                  </tr>
                </thead>
                <tbody>
                  {applicantStats.map((a, idx) => (
                    <tr key={idx}>
                      <td>{a.name}</td>
                      <td>{a.email}</td>
                      <td>{a.applications}</td>
                      <td>{a.interviews}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ======= RECENT ACTIVITY ======= */}
        <div className="admin-analytics-section">
          <h3 className="admin-section-title">Recent Activity</h3>
          {!recent ? (
            <p className="admin-empty-text">No recent activity available.</p>
          ) : (
            <div className="admin-recent-grid">
              <div className="admin-recent-column">
                <h4>Recent Jobs</h4>
                {recent.jobs && recent.jobs.length > 0 ? (
                  <ul className="admin-recent-list">
                    {recent.jobs.map((job) => (
                      <li key={job._id}>
                        <strong>{job.title}</strong>
                        <br />
                        <span>{new Date(job.createdAt).toLocaleString()}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="admin-empty-text">No recent jobs.</p>
                )}
              </div>

              <div className="admin-recent-column">
                <h4>Recent Applications</h4>
                {recent.applications && recent.applications.length > 0 ? (
                  <ul className="admin-recent-list">
                    {recent.applications.map((app) => (
                      <li key={app._id}>
                        <span>Application ID: {app._id}</span>
                        <br />
                        <span>
                          Applied:{" "}
                          {new Date(app.appliedAt).toLocaleString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="admin-empty-text">No recent applications.</p>
                )}
              </div>

              <div className="admin-recent-column">
                <h4>Recent Interviews</h4>
                {recent.interviews && recent.interviews.length > 0 ? (
                  <ul className="admin-recent-list">
                    {recent.interviews.map((intv) => (
                      <li key={intv._id}>
                        <span>Interview ID: {intv._id}</span>
                        <br />
                        <span>
                          Created:{" "}
                          {new Date(intv.createdAt).toLocaleString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="admin-empty-text">No recent interviews.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminAnalyticsPage;
