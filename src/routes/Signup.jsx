import { GoogleAuthProvider, GithubAuthProvider, getAuth, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

const Signup = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isNextStep, setIsNextStep] = useState(false); // Manage form switching
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate()
  const auth = getAuth()

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // If the user is authenticated, navigate to the main app
        navigate('/');
      } else {
        // If no user is authenticated, show the login form
        setLoading(false);
      }
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, [auth, navigate]);
  
  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setEmailError(newEmail && !validateEmail(newEmail));
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordError(repeatPassword && newPassword !== repeatPassword);
  };

  const handleRepeatPasswordChange = (e) => {
    const newRepeatPassword = e.target.value;
    setRepeatPassword(newRepeatPassword);
    setPasswordError(password && newRepeatPassword !== password);
  };

  const isFormValid = email && username && password && repeatPassword && !emailError && !passwordError;

  const handleNext = () => {
    if (isFormValid) {
      setIsNextStep(true); // Move to next form
    }
  };

  const handleBack = () => {
    setIsNextStep(false); // Return to previous form
  };

  const handleLoginNavigate = () => {
    navigate('/login')
  }
  
  if (loading) {
    return <div className="h-screen flex flex-col items-center p-2">
      <div className="loading-wrapper mt-auto mb-auto flex flex-col items-center">
        <span className="loading loading-infinity loading-md w-10 h-10"></span>
      </div>
    </div>;
  }

  return (
    <div className="signup-container h-screen flex flex-col items-center">
      {!isNextStep ? (
        // First Step: Login Information Form
        <>
          <p className="mt-10 text-sm">Join and Create an account with</p>
          <h1 className="title text-[20px] font-semibold mb-10">Devs Portal</h1>
          <div className="signup-form p-2 bg-base-300 flex flex-col items-center h-full w-full rounded-tr-[20px] rounded-tl-[20px]">
            <form className="signup-form max-w-[250px] p-2 flex flex-col gap-3 items-center mt-5">
              <h1 className="text-sm">Create your Account</h1>

              {/* Email Input */}
              <div className="w-full">
                <label className="text-xs text-left block">Email</label> {/* Label above the input */}
                <input type="text" placeholder="e.g., user@example.com" value={email} onChange={handleEmailChange} className={`input input-md w-full text-sm outline-none border-none ${emailError ? 'border-2 border-red-500' : ''}`} />
                {emailError && <span className="text-red-500 text-xs">Invalid email format</span>}
              </div>

              {/* Username Input */}
              <div className="w-full">
                <label className="text-xs text-left block">Username</label>
                <input type="text" placeholder="Choose a unique username" value={username} onChange={(e) => setUsername(e.target.value)} className="input input-md w-full text-sm outline-none" disabled={!email || emailError} />
              </div>

              {/* Password Input */}
              <div className="w-full">
                <label className="text-xs text-left block">Password</label>
                <input type="password" placeholder="At least 8 characters" value={password} onChange={handlePasswordChange} className="input input-md w-full text-sm outline-none border-none" disabled={!username} />
              </div>

              {/* Repeat Password Input */}
              <div className="w-full">
                <label className="text-xs text-left block">Repeat Password</label>
                <input type="password" placeholder="Retype your password" value={repeatPassword} onChange={handleRepeatPasswordChange} className={`input input-md w-full text-sm outline-none border-none ${passwordError ? 'border-2 border-red-500' : ''}`} disabled={!password} />
                {passwordError && <span className="text-red-500 text-xs">Passwords do not match</span>}
              </div>

              {/* Next Button */}
              <button className="next-page btn btn-primary w-full" disabled={!isFormValid} onClick={handleNext}>
                Next
              </button>

              <div className="divider">or</div>

              {/* Social Login Buttons */}
              <div className="option w-fit flex gap-5">
                <button className="google btn btn-md">
                  <FcGoogle className="w-6 h-6" />
                </button>
                <button className="github btn btn-md">
                  <FaGithub className="w-6 h-6" />
                </button>
              </div>
            </form>

            <div className="login flex gap-2">
              <h1 className="text-xs">Already have an account?.</h1>
              <a onClick={handleLoginNavigate} className="login-page font-extrabold underline text-xs">Login</a>
            </div>
          </div>
        </>
      ) : (
        // Second Step: User Information Form
        <>
          <p className="mt-10 text-sm">Complete Your Information</p>
          <h1 className="title text-[20px] font-semibold mb-10">Devs Portal</h1>
          <div className="signup-form p-2 bg-base-300 flex flex-col items-center h-full w-full rounded-tr-[20px] rounded-tl-[20px]">
            <form className="signup-form max-w-[250px] p-2 flex flex-col gap-3 items-center mt-5">
              {/* Full Name Input */}
              <div className="w-full">
                <label className="text-xs text-left block">Full Name</label>
                <input type="text" placeholder="e.g., John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} className="input input-md w-full text-sm outline-none border-none" />
              </div>

              {/* Gender Input */}
              <div className="w-full">
                <label className="text-xs text-left block">Gender</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)} className="input input-md w-full text-sm outline-none" >
                  <option value="" disabled>Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Age Input */}
              <div className="w-full">
                <label className="text-xs text-left block">Age</label>
                <input type="number" placeholder="Enter your age" value={age} onChange={(e) => setAge(e.target.value)} className="input input-md w-full text-sm outline-none border-none" />
              </div>

              {/* Sign Up Button */}
              <button className="signup-page btn btn-primary w-full">
                Sign Up
              </button>

              {/* Back Button */}
              <button className="back-page btn btn-secondary w-full mt-2" onClick={handleBack}>
                Back
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default Signup;