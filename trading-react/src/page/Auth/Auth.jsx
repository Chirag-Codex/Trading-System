import { Button } from "@/components/ui/button";
import SignupForm from "./SignupForm";
import SigninForm from "./SigninForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { useLocation, useNavigate } from "react-router-dom";
import "./Auth.css";

function Auth() {
  const navigate = useNavigate();
  const location = useLocation();

  const renderForm = () => {
    if (location.pathname === "/signup") {
      return (
        <section className="w-full max-w-md">
          <SignupForm />
          <div className="flex items-center justify-center mt-4">
            <span className="text-gray-300">Have already an account?</span>
            <Button 
              onClick={() => navigate("/signin")} 
              variant="ghost"
              className="text-blue-400 hover:text-blue-300 ml-2"
            >
              Sign In
            </Button>
          </div>
        </section>
      );
    }

    if (location.pathname === "/forgot-password") {
      return (
        <section className="w-full max-w-md">
          <ForgotPasswordForm />
          <div className="flex items-center justify-center mt-4">
            <span className="text-gray-300">Back to login</span>
            <Button 
              onClick={() => navigate("/signin")} 
              variant="ghost"
              className="text-blue-400 hover:text-blue-300 ml-2"
            >
              Sign In
            </Button>
          </div>
        </section>
      );
    }

    // Default to signin
    return (
      <section className="w-full max-w-md">
        <SigninForm />
        <div className="flex items-center justify-center mt-4">
          <span className="text-gray-300">Don't have an account?</span>
          <Button 
            onClick={() => navigate("/signup")} 
            variant="ghost"
            className="text-blue-400 hover:text-blue-300 ml-2"
          >
            Sign Up
          </Button>
        </div>
        <div className="flex items-center justify-center mt-6">
          <Button 
            className="w-full py-5 mt-2"
            onClick={() => navigate("/forgot-password")} 
            variant="outline"
          >
            Forgot Password
          </Button>
        </div>
      </section>
    );
  };

  return (
    <div className="auth-container">
      <div className="overlay">
        <div className="auth-modal">
          <h1 className="title">Trading Platform</h1>
          {renderForm()}
        </div>
      </div>
    </div>
  );
}

export default Auth;