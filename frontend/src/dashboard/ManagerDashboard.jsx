import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../apollo/client";

import "./ManagerDashboard.css";

// Get Employees
const GET_EMPLOYEES = gql`
  query GetEmployees {
    employees {
      id
      name
      email
    }
  }
`;

// Evaluate Performance
const EVALUATE_EMPLOYEE = gql`
  mutation EvaluatePerformance(
    $employeeId: ID!
    $rating: Int!
    $skillLevel: Int!
    $attendanceScore: Int!
    $currentSalary: Float!
  ) {
    evaluatePerformance(
      employeeId: $employeeId
      rating: $rating
      skillLevel: $skillLevel
      attendanceScore: $attendanceScore
      currentSalary: $currentSalary
    ) {
      hikePercentage
      revisedSalary
      promotionRecommendation
    }
  }
`;

const ManagerDashboard = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    employeeId: "",
    rating: "",
    skillLevel: "",
    attendanceScore: "",
    currentSalary: "",
  });

  const [message, setMessage] = useState("");

  // Fetch employees
  const token = localStorage.getItem("token");

  const {
    data,
    loading: empLoading,
    error: empError,
  } = useQuery(GET_EMPLOYEES, {
    skip: !token,
    fetchPolicy: "network-only",
  });

  const [evaluateEmployee, { loading }] = useMutation(EVALUATE_EMPLOYEE, {
    onCompleted: (data) => {
      setMessage(
        `✅ Evaluation done | Hike: ${data.evaluatePerformance.hikePercentage}% | Revised Salary: ₹${data.evaluatePerformance.revisedSalary}`,
      );
    },
    onError: (err) => {
      setMessage(`${err.message}`);
    },
  });

  //LOGOUT
  const handleLogout = async () => {
    await client.clearStore();
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { employeeId, rating, skillLevel, attendanceScore, currentSalary } =
      formData;

    if (
      !employeeId ||
      !rating ||
      !skillLevel ||
      !attendanceScore ||
      !currentSalary
    ) {
      setMessage("All fields are mandatory");
      return;
    }

    evaluateEmployee({
      variables: {
        employeeId,
        rating: Number(rating),
        skillLevel: Number(skillLevel),
        attendanceScore: Number(attendanceScore),
        currentSalary: Number(currentSalary),
      },
    });
  };

  return (
    <div className="manager-page">
      <div className="manager-header">
        <h2>Manager Dashboard</h2>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="manager-card">
        <h3>Evaluate Employee</h3>

        {message && <p className="info-text">{message}</p>}

        <form onSubmit={handleSubmit}>
          <label>Employee *</label>
          <select
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            required
          >
            <option value="">Select Employee</option>

            {empLoading && <option disabled>Loading employees...</option>}
            {empError && <option disabled>Error loading employees</option>}

            {!empLoading && !empError && data?.employees?.length === 0 && (
              <option disabled>No employees found</option>
            )}

            {!empLoading &&
              !empError &&
              data?.employees?.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.email})
                </option>
              ))}
          </select>

          <label>Rating (1–5) *</label>
          <input
            type="number"
            name="rating"
            min="1"
            max="5"
            value={formData.rating}
            onChange={handleChange}
            required
          />

          <label>Skill Level (1–5) *</label>
          <input
            type="number"
            name="skillLevel"
            min="1"
            max="5"
            value={formData.skillLevel}
            onChange={handleChange}
            required
          />

          <label>Attendance Score (1–5) *</label>
          <input
            type="number"
            name="attendanceScore"
            min="1"
            max="5"
            value={formData.attendanceScore}
            onChange={handleChange}
            required
          />

          <label>Current Salary *</label>
          <input
            type="number"
            name="currentSalary"
            value={formData.currentSalary}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Evaluating..." : "Evaluate Employee"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManagerDashboard;
