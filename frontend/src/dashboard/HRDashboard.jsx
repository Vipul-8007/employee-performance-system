import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import client from "../apollo/client";

import "./HRDashboard.css";

const HR_EMPLOYEE_OVERVIEW = gql`
  query HrEmployeeOverview {
    hrEmployeeOverview {
      employee {
        id
        name
        email
      }
      performance {
        rating
        hikePercentage
        revisedSalary
        promotionRecommendation
        evaluator {
          name
        }
      }
    }
  }
`;

const HRDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const { loading, error, data } = useQuery(HR_EMPLOYEE_OVERVIEW, {
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
            {data.hrEmployeeOverview.map((item) => (
              <tr key={item.employee.id}>
                <td>{item.employee.name}</td>
                <td>{item.employee.email}</td>

                <td>
                  {item.performance ? item.performance.rating : "Not Evaluated"}
                </td>

                <td className="hike">
                  {item.performance
                    ? `${item.performance.hikePercentage}%`
                    : "-"}
                </td>

                <td className="salary">
                  {item.performance
                    ? `₹${item.performance.revisedSalary}`
                    : "-"}
                </td>

                <td
                  className={
                    item.performance?.promotionRecommendation === "YES"
                      ? "promo-yes"
                      : item.performance
                        ? "promo-no"
                        : ""
                  }
                >
                  {item.performance
                    ? item.performance.promotionRecommendation
                    : "Not Evaluated"}
                </td>

                <td>{item.performance?.evaluator?.name || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HRDashboard;
