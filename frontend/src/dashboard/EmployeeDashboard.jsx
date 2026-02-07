import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import client from "../apollo/client";
import "./EmployeeDashboard.css";

const MY_PERFORMANCE = gql`
  query MyPerformance {
    myPerformance {
      id
      rating
      skillLevel
      attendanceScore
      hikePercentage
      revisedSalary
      promotionRecommendation
      evaluator {
        name
      }
    }
  }
`;

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const { loading, error, data } = useQuery(MY_PERFORMANCE, {
    fetchPolicy: "network-only",
    skip: !token,
  });

  const performances = data?.myPerformance ?? [];

  const handleLogout = async () => {
    await client.clearStore();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  if (loading) return <p className="loading-text">Loading...</p>;
  if (error) return <p className="error-text">{error.message}</p>;

  return (
    <div className="employee-container">
      {/* HEADER */}
      <div className="employee-header">
        <h2>
          Employee Dashboard – Welcome
          <span className="employee-name"> {user?.name}</span>
        </h2>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* PERFORMANCE */}
      {performances.length === 0 ? (
        <p className="no-data-text">No performance evaluation done yet.</p>
      ) : (
        <div className="performance-list">
          {performances.map((p) => (
            <div className="performance-card" key={p.id}>
              <div className="performance-row">
                <span>Rating</span>
                <span>{p.rating}</span>
              </div>

              <div className="performance-row">
                <span>Skill Level</span>
                <span>{p.skillLevel}</span>
              </div>

              <div className="performance-row">
                <span>Attendance</span>
                <span>{p.attendanceScore}</span>
              </div>

              <div className="performance-row">
                <span>Hike %</span>
                <span className="hike">{p.hikePercentage}%</span>
              </div>

              <div className="performance-row">
                <span>Revised Salary</span>
                <span className="salary">₹{p.revisedSalary}</span>
              </div>

              <div className="performance-row">
                <span>Promotion</span>
                <span
                  className={
                    p.promotionRecommendation === "YES"
                      ? "promo-yes"
                      : "promo-no"
                  }
                >
                  {p.promotionRecommendation}
                </span>
              </div>

              <div className="performance-row">
                <span>Evaluator</span>
                <span>{p.evaluator?.name}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
