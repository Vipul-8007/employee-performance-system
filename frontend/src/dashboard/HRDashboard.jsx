import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import client from "../apollo/client";

import "./HRDashboard.css";

const ALL_PERFORMANCES = gql`
  query AllPerformances {
    allPerformances {
      id
      employee {
        name
        email
      }
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

const HRDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const { loading, error, data } = useQuery(ALL_PERFORMANCES, {
    skip: !token,
    fetchPolicy: "network-only",
  });

  // LOGOUT
  const handleLogout = async () => {
    await client.clearStore();
    localStorage.clear();

    navigate("/login", { replace: true });
  };

  if (loading) return <p className="loading-text">Loading...</p>;
  if (error) return <p className="error-text">{error.message}</p>;

  return (
    <div className="hr-page">
      <div className="hr-card">
        <div className="hr-header">
          <h2>HR Dashboard – All Employee Performance</h2>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <table className="hr-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Email</th>
              <th>Rating</th>
              <th>Hike %</th>
              <th>Revised Salary</th>
              <th>Promotion</th>
              <th>Evaluator</th>
            </tr>
          </thead>
          <tbody>
            {data.allPerformances.map((item) => (
              <tr key={item.id}>
                <td>{item.employee.name}</td>
                <td>{item.employee.email}</td>
                <td>{item.rating}</td>
                <td className="hike">{item.hikePercentage}%</td>
                <td className="salary">₹{item.revisedSalary}</td>
                <td
                  className={
                    item.promotionRecommendation === "YES"
                      ? "promo-yes"
                      : "promo-no"
                  }
                >
                  {item.promotionRecommendation}
                </td>
                <td>{item.evaluator.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HRDashboard;
