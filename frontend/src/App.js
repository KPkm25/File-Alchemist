import React, { useState } from "react";
import "./styles.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SignInForm from "./SignIn";
import SignUpForm from "./SignUp";

export default function App() {
  const [type, setType] = useState("signUp");
  const handleOnClick = text => {
    if (text !== type) {
      setType(text);
      return;
    }
  };
  const containerClass =
    "container " + (type === "signUp" ? "right-panel-active" : "");
  return (
    <div className="App">
      <h2>File Alchemist: Transform & Retrieve</h2>
      <div className={containerClass} id="container">
        <SignInForm />
        <SignUpForm />
        <ToastContainer />
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Want to Upload a file to Database?</h1>

              <button
                className="ghost"
                id="signIn"
                onClick={() => handleOnClick("signIn")}
              >
                Upload Now!
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Want to Convert Excel File to PDF?</h1>
              {/* <p>Enter your personal details and start journey with us</p> */}
              <button
                className="ghost "
                id="signUp"
                onClick={() => handleOnClick("signUp")}
              >
                Convert Now!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
