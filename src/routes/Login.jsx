import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, GithubAuthProvider, getAuth, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const provider = new GoogleAuthProvider();
  const github = new GithubAuthProvider();
  const navigate = useNavigate();
  const auth = getAuth();

  // State for password visibility and password input
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState("");

  // State to store errors and control opacity
  const [error, setError] = useState(null);
  const [opacity, setOpacity] = useState(1);  // New state for handling opacity

  // Loading state to handle redirect
  const [loading, setLoading] = useState(true);

  // Check if the user is authenticated on component mount
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

  // Automatically dismiss the error message after 3 seconds with a fade-out effect
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setOpacity(0);  // Set opacity to 0 to trigger the fade-out effect
        setTimeout(() => {
          setError(null);  // After the transition, remove the error
        }, 300);  // This delay should match the duration of the CSS transition
      }, 1000);  // Show the error for 1 second before starting fade out

      return () => clearTimeout(timer); // Clear the timer if the component unmounts
    }
  }, [error]);

  const handleGithubLogin = (e) => {
    e.preventDefault();
    setError(null);  // Reset any previous errors
    signInWithPopup(auth, github)
      .then((result) => {
        const user = result.user;
        console.log("Github user signed in:", user);
      })
      .catch((error) => {
        setError(error); // Set the error state to display in the UI
        setOpacity(1);  // Reset the opacity for the new error message
      });
  };

  const handleGoogleLogin = (e) => {
    e.preventDefault();
    setError(null);  // Reset any previous errors
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log("Google user signed in:", user);
      })
      .catch((error) => {
        setError(error); // Set the error state to display in the UI
        setOpacity(1);  // Reset the opacity for the new error message
      });
  };

  const handleSignUpNavigate = () => {
    navigate('/signup');
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Show a loading indicator while checking authentication status
  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center p-2">
        <div className="loading-wrapper mt-auto mb-auto flex flex-col items-center">
          <span className="loading loading-infinity loading-md w-10 h-10"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen">
      <div className="login-container p-0 h-full flex flex-col gap-1 items-center">
        <h3 className="text-sm mt-10">Share idea, Share knowledge with</h3>
        <h1 className="text-[20px] font-semibold mb-10">Devs Portal</h1>
        <div className="login-form mt-auto bg-base-300 rounded-tr-[20px] rounded-tl-[20px] h-full w-full mt-auto flex flex-col gap-2 p-3 items-center mb-auto">

          {/* Show the error message if an error occurs */}
          {error && (
            <div role="alert" className="alert alert-error h-fit w-fit max-w-[100px] fixed top-10 shadow-lg p-4 rounded-md bg-red-500 text-white transition-opacity duration-300" style={{ opacity: opacity }} >
              <p className="text-xs">{error.code}</p>
            </div>
          )}

          <div className="flex flex-col gap-2 items-center max-w-[250px] mt-10">
            <input type="text" placeholder="Email | Username" className="input input-md email w-full bg-base-100" />

            {/* Password Input with Show/Hide Icon */}
            <div className="relative w-full">
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Password"
                className="input input-md password w-full bg-base-100"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" className="absolute right-4 top-1/2 transform -translate-y-1/2" onClick={togglePasswordVisibility}>
                {passwordVisible ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
              </button>
            </div>

            <button className="signin btn btn-primary btn-md w-full">Login</button>
            <a href="" className="btn btn-ghost btn-xs forgot text-xs underline">Forgot password</a>
            <div className="divider text-sm">or</div>

            <div className="option w-fit flex gap-5">
              <button onClick={handleGoogleLogin} className="google btn btn-md">
                <FcGoogle className="w-6 h-6" />
              </button>
              <button onClick={handleGithubLogin} className="github btn btn-md">
                <FaGithub className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="signup-container flex gap-2 text-xs mt-10 mb-5">
            <p>Don't have an account?</p>
            <a onClick={handleSignUpNavigate} className="font-extrabold underline">Sign up</a>
          </div>

          <div className="dev-mode max-w-[320px] text-center">
            <p className="description text-xs">Do you have trust issues with the login form?</p>
            <div className="anon-form flex gap-2">
              <p className="description text-xs">Try our anonymous mode.</p>
              <a href="" className="anonymous-login text-xs underline font-extrabold">Here</a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;