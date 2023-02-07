import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import Auth from "../utils/auth";
import { ADD_USER } from "../utils/mutations";

function Signup(props) {
  const [formState, setFormState] = useState({ email: "", password: "" });
  const [addUser] = useMutation(ADD_USER);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const mutationResponse = await addUser({
      variables: {
        firstName: formState.firstName,
        lastName: formState.lastName,
        email: formState.email,
        password: formState.password,
      },
    });
    const token = mutationResponse.data.addUser.token;
    Auth.login(token);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  return (
    <div className="container my-1">
      

      <h2 className="signup2">Signup</h2>
      <form onSubmit={handleFormSubmit} className="form">
        <div className="login2">
        <div className="flex-row space-between my-2">
          <label htmlFor="firstName" className="first-name">First Name:</label>
          <input
          className="first-name2"
            placeholder="First"
            name="firstName"
            type="firstName"
            id="firstName"
            onChange={handleChange}
          />
        </div>
        <div className="flex-row space-between my-2">
          <label htmlFor="lastName" className="last-name">Last Name:</label>
          <input
          className="last-name2"
            placeholder="Last"
            name="lastName"
            type="lastName"
            id="lastName"
            onChange={handleChange}
          />
        </div>
        <div className="flex-row space-between my-2">
          <label htmlFor="email" className="email">Email:</label>
          <input
          className="email2"
            placeholder="youremail@test.com"
            name="email"
            type="email"
            id="email"
            onChange={handleChange}
          />
        </div>
        <div className="flex-row space-between my-2">
          <label htmlFor="pwd" className="pass">Password:</label>
          <input
          className="pass2"
            placeholder="******"
            name="password"
            type="password"
            id="pwd"
            onChange={handleChange}
          />
        </div>
        </div>
        <div className="flex-row flex-end">
          <button type="submit" className="button">Submit</button>
        </div>

        <Link to="/login" className="loginbtn">Go to Login</Link>
      </form>
    </div>
  );
}

export default Signup;
