import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ButtonCustom } from "../components/ui/button-custom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";

const Auth = () => {
  const [activeTab, setActiveTab] = useState("login");
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
      if (activeTab === "login") {
        await login(email, password);
        toast({
          title: "Logged in successfully",
          description: "Welcome back!",
          variant: "default",
        });
      } else {
        await signup(name, email, password, isVenueOwner);
        toast({
          title: "Account created successfully",
          description: "Welcome to Super Events!",
          variant: "default",
        });
      }
      navigate("/home");
    } catch (error) {
      toast({
        title: activeTab === "login" ? "Login failed" : "Signup failed",
        description: error instanceof Error ? error.message : "Please try again",
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

  const handleGoogleLogin = () => {
    // Google login implementation will go here
    toast({
      title: "Google login",
      description: "Coming soon!",
      variant: "default",
    });
  };

  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4 bg-gradient-to-br from-brand-blue/5 to-brand-gold/5">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-blue">
            Suoer<span className="text-brand-gold">Events</span>
          </h1>
          <p className="text-gray-600 mt-2">
            Find the perfect venue for your next event
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden border border-white/20"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-2 bg-transparent border-b">
              <TabsTrigger
                value="login"
                className="py-4 text-base data-[state=active]:text-brand-blue data-[state=active]:border-b-2 data-[state=active]:border-brand-blue"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="py-4 text-base data-[state=active]:text-brand-blue data-[state=active]:border-b-2 data-[state=active]:border-brand-blue"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <div className="p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: activeTab === "login" ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: activeTab === "login" ? 20 : -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <TabsContent value="login" className="mt-0">
                    <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="relative">
                        <input
                          type="email"
                          id="login-email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-colors peer placeholder-transparent"
                          placeholder="Email"
                          required
                        />
                        <label
                          htmlFor="login-email"
                          className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm"
                        >
                          Email Address
                        </label>
                      </div>

                      <div className="relative">
                        <input
                          type="password"
                          id="login-password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-colors peer placeholder-transparent"
                          placeholder="Password"
                          required
                        />
                        <label
                          htmlFor="login-password"
                          className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm"
                        >
                          Password
                        </label>
                      </div>

                      <div className="flex justify-end">
                        <button type="button" className="text-sm text-brand-blue hover:underline transition-colors">
                          Forgot password?
                        </button>
                      </div>

                      <ButtonCustom
                        type="submit"
                        variant="gold"
                        size="lg"
                        className="w-full"
                        isLoading={isLoading}
                      >
                        Sign In
                      </ButtonCustom>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup" className="mt-0">
                    <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="relative">
                        <input
                          type="text"
                          id="signup-name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-colors peer placeholder-transparent"
                          placeholder="Full Name"
                          required
                        />
                        <label
                          htmlFor="signup-name"
                          className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm"
                        >
                          Full Name
                        </label>
                      </div>

                      <div className="relative">
                        <input
                          type="email"
                          id="signup-email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-colors peer placeholder-transparent"
                          placeholder="Email"
                          required
                        />
                        <label
                          htmlFor="signup-email"
                          className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm"
                        >
                          Email Address
                        </label>
                      </div>

                      <div className="relative">
                        <input
                          type="password"
                          id="signup-password"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            checkPasswordStrength(e.target.value);
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-colors peer placeholder-transparent"
                          placeholder="Password"
                          required
                        />
                        <label
                          htmlFor="signup-password"
                          className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm"
                        >
                          Password
                        </label>
                      </div>

                      {password && (
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

                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="form-checkbox h-5 w-5 text-brand-blue rounded border-gray-300 focus:ring-brand-blue"
                          checked={isVenueOwner}
                          onChange={(e) => setIsVenueOwner(e.target.checked)}
                        />
                        <span className="text-sm text-gray-700">
                          I am a venue owner
                        </span>
                      </label>

                      <ButtonCustom
                        type="submit"
                        variant="gold"
                        size="lg"
                        className="w-full"
                        isLoading={isLoading}
                      >
                        Create Account
                      </ButtonCustom>
                    </form>
                  </TabsContent>
                </motion.div>
              </AnimatePresence>

              <div className="relative flex items-center justify-center my-6">
                <div className="border-t w-full border-gray-300"></div>
                <span className="bg-white px-3 text-sm text-gray-500 absolute">
                  OR
                </span>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full bg-white border border-gray-300 rounded-md py-3 px-4 flex items-center justify-center text-sm text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                >
                  <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="Google"
                    className="w-5 h-5 mr-2"
                  />
                  Continue with Google
                </button>

                <ButtonCustom
                  type="button"
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={handleGuestAccess}
                >
                  Continue as Guest
                </ButtonCustom>
              </div>
            </div>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
