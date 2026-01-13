import React, { useState } from "react";
import assets from "../assets/images/assets";
const LoginPage = () => {
  
  const [currentState, setCurrentState] = useState("Sign Up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmit, setIsDataSubmit] = useState(false);

  const onSubmitHandler = (e) => {
    e.preventDefault();

    if (currentState === "Sign Up" && !isDataSubmit) {
      setIsDataSubmit(true);
      return;
    }

    console.log(fullName, email, password, bio);

    setFullName("");
    setEmail("");
    setPassword("");
    setBio("");
    setIsDataSubmit(false);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-zinc-50/10 flex items-center
      justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl"
    >
      {/* left */}
      <img src={assets.logo_big} className="w-52 h-52" alt="logo" />

      {/* right */}
      <form
        onSubmit={onSubmitHandler}
        className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg"
      >
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {currentState}
          {isDataSubmit && (
            <img
              onClick={() => setIsDataSubmit(false)}
              src={assets.arrow_icon}
              className="w-5 cursor-pointer"
              alt="back"
            />
          )}
        </h2>

        {currentState === "Sign Up" && !isDataSubmit && (
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            type="text"
            className="p-2 border border-gray-500 rounded-md focus:outline-none"
            placeholder="Full Name"
            required
          />
        )}

        {!isDataSubmit && (
          <>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="border p-2 border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Email Address"
              required
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="border p-2 border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Password"
              required
            />
          </>
        )}

        {currentState === "Sign Up" && isDataSubmit && (
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="provide a short Bio"
            rows={4}
            required
          />
        )}

        <button
          type="submit"
          className="py-3 bg-purple-300 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer"
        >
          {currentState === "Sign Up" ? "create account" : "Login now"}
        </button>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <input type="checkbox" required />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>

        <div className="flex flex-col gap-2">
          {currentState === "Sign Up" ? (
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <span
                onClick={() => {
                  setCurrentState("Login");
                  setIsDataSubmit(false);
                }}
                className="text-purple-400 cursor-pointer"
              >
                Login
              </span>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              create an account?{" "}
              <span
                onClick={() => setCurrentState("Sign Up")}
                className="text-purple-400 cursor-pointer"
              >
                click here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
