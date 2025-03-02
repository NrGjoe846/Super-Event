import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ButtonCustom } from "../components/ui/button-custom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isVenueOwner, setIsVenueOwner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login, signup, continueAsGuest } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(name, email, password);
      }
      
      toast({
        title: isLogin ? "Logged in successfully" : "Account created successfully",
        description: isLogin ? "Welcome back!" : "Welcome to GatherHaven!",
        variant: "default",
      });

      navigate("/home");
    } catch (error) {
      toast({
        title: "Authentication failed",
        description: "Please check your credentials and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestAccess = () => {
    continueAsGuest();
    toast({
      title: "Continuing as guest",
      description: "You can sign up or log in anytime",
      variant: "default",
    });
    navigate("/home");
  };

  const checkPasswordStrength = (password: string) => {
    // Simple password strength checker
    let strength = 0;
    
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    setPasswordStrength(strength);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-blue">
            gather<span className="text-brand-gold">haven</span>
          </h1>
          <p className="text-gray-600 mt-2">
            Find the perfect venue for your next event
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden glass-card transition-all duration-300">
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-brand-blue">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-gray-600 mt-2">
                {isLogin
                  ? "Sign in to access your account"
                  : "Join GatherHaven to start booking venues"}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-colors"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              )}

              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-colors"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    checkPasswordStrength(e.target.value);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-colors"
                  placeholder={isLogin ? "Enter your password" : "Create a password"}
                  required
                />
                
                {!isLogin && password && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="text-xs font-medium text-gray-600">Password Strength:</div>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all ${
                            passwordStrength === 0 ? "w-0" :
                            passwordStrength === 1 ? "w-1/4 bg-red-500" : 
                            passwordStrength === 2 ? "w-2/4 bg-yellow-500" :
                            passwordStrength === 3 ? "w-3/4 bg-blue-500" :
                            "w-full bg-green-500"
                          }`}
                        ></div>
                      </div>
                      <div className="text-xs font-medium text-gray-600">
                        {passwordStrength === 0 ? "Poor" :
                         passwordStrength === 1 ? "Weak" : 
                         passwordStrength === 2 ? "Fair" :
                         passwordStrength === 3 ? "Good" :
                         "Strong"}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Use 8+ characters with a mix of uppercase, numbers, and symbols
                    </p>
                  </div>
                )}
              </div>

              {!isLogin && (
                <div className="mb-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-brand-blue rounded border-gray-300 focus:ring-brand-blue"
                      checked={isVenueOwner}
                      onChange={(e) => setIsVenueOwner(e.target.checked)}
                    />
                    <span className="ml-2 text-gray-700 text-sm">
                      I am a venue owner
                    </span>
                  </label>
                </div>
              )}

              {isLogin && (
                <div className="flex justify-end mb-6">
                  <button type="button" className="text-sm text-brand-blue hover:underline transition-colors">
                    Forgot password?
                  </button>
                </div>
              )}

              <ButtonCustom
                type="submit"
                variant="gold"
                size="lg"
                className="w-full mb-4"
                isLoading={isLoading}
              >
                {isLogin ? "Sign In" : "Create Account"}
              </ButtonCustom>

              <div className="relative flex items-center justify-center my-6">
                <div className="border-t w-full border-gray-300"></div>
                <span className="bg-white px-3 text-sm text-gray-500 absolute">
                  OR
                </span>
              </div>

              <ButtonCustom
                type="button"
                variant="outline"
                size="lg"
                className="w-full mb-4"
                onClick={handleGuestAccess}
              >
                Continue as Guest
              </ButtonCustom>

              <div className="space-y-3">
                <button
                  type="button"
                  className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 flex items-center justify-center text-sm text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                >
                  <svg viewBox="0 0 48 48" width="20" height="20" className="mr-2">
                    <path
                      fill="#FFC107"
                      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                    />
                    <path
                      fill="#FF3D00"
                      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                    />
                    <path
                      fill="#4CAF50"
                      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                    />
                    <path
                      fill="#1976D2"
                      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                    />
                  </svg>
                  Continue with Google
                </button>

                <button
                  type="button"
                  className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 flex items-center justify-center text-sm text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" className="mr-2">
                    <path
                      fill="#1877F2"
                      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                    />
                  </svg>
                  Continue with Facebook
                </button>
              </div>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600 text-sm">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-brand-blue hover:underline ml-1 font-medium"
                >
                  {isLogin ? "Sign up" : "Log in"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;