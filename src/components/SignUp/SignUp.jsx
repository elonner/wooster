import { signUp } from "../../utilities/users-service";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../pages/AuthPage/AuthPage.css";

export default function SignUp({ setUser, showLogin, setShowLogin, compId }) {
  const [credentials, setCredentials] = useState({
    first: "",
    last: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const { first, last, username, password } = credentials;
      const formData = { first, last, username, password };
      // The promise returned by the signUp service
      // method will resolve to the user object included
      // in the payload of the JSON Web Token (JWT)
      const user = await signUp(formData);
      setUser(user);
      navigate("/survey", { state: { id: compId } });
    } catch {
      // An error occurred
      // Probably due to a duplicate username
      setError("Sign Up Failed - Try Again");
    }
  }

  return (
    <div>
      <div className="form-container">
        <form autoComplete="off" onSubmit={handleSubmit} className="form login">
          <img
            src="https://icons.iconarchive.com/icons/sykonist/looney-tunes/256/Foghorn-Leghorn-icon.png"
            alt=""
            srcSet=""
          />
          <h2 className="form-title">Wooster</h2>
          <label>First Name:</label>
          <input
            type="text"
            name="first"
            value={credentials.first}
            onChange={handleChange}
            required
          />
          <label>Last Name:</label>
          <input
            type="text"
            name="last"
            value={credentials.last}
            onChange={handleChange}
            required
          />
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            required
          />
          <button type="submit" className="sbmt-btn">
            START QUIZ
          </button>
          <p className="switchForms">
            Already taken quiz? &nbsp;
            <span
              onClick={() => setShowLogin(!showLogin)}
              className="switchLink"
            >
              Log In
            </span>
          </p>
        </form>
      </div>
      <p className="error-message">&nbsp;{error}</p>
    </div>
  );
}
