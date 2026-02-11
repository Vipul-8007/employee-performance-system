import { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

/* GraphQL Register Mutation */
const REGISTER_USER = gql`
  mutation Register(
    $name: String!
    $email: String!
    $password: String!
    $role: String!
    $companyCode: String
  ) {
    register(
      name: $name
      email: $email
      password: $password
      role: $role
      companyCode: $companyCode
    ) {
      token
      user {
        id
        name
        email
        role
      }
    }
  }
`;

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "EMPLOYEE",
    companyCode: "",
  });

  const [error, setError] = useState("");

  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    onCompleted: () => {
      navigate("/login");
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, email, password, confirmPassword, role, companyCode } =
      formData;

    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are mandatory");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password and Confirm Password must match");
      return;
    }

    // HR / Manager validation
    if ((role === "HR" || role === "MANAGER") && !companyCode) {
      setError("Company Unique ID is required for HR / Manager");
      return;
    }

    setError("");

    registerUser({
      variables: {
        name,
        email,
        password,
        role,
        companyCode: role === "EMPLOYEE" ? null : companyCode,
      },
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register</h2>

        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label>
            Name <span className="required">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label>
            Email <span className="required">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>
            Password <span className="required">*</span>
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <label>
            Confirm Password <span className="required">*</span>
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <label>
            Role <span className="required">*</span>
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="EMPLOYEE">Employee</option>
            <option value="MANAGER">Manager</option>
            <option value="HR">HR</option>
          </select>

          {/* Company Code only for HR / Manager */}
          {(formData.role === "HR" || formData.role === "MANAGER") && (
            <>
              <label>
                Company Unique ID <span className="required">*</span>
              </label>
              <input
                type="text"
                name="companyCode"
                value={formData.companyCode}
                onChange={handleChange}
                placeholder="Enter company unique ID"
                required
              />
            </>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
