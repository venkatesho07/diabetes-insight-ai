import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { loginApi } from "@/lib/api";
import { Lock, User, HeartPulse, ArrowLeft, Shield } from "lucide-react";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-doctor.jpg";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await loginApi(username, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel - image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img src={heroImage} alt="Medical environment" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 to-foreground/60" />
        <div className="absolute inset-0 flex flex-col justify-end p-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <HeartPulse className="w-10 h-10 text-primary mb-4" />
            <h2 className="text-3xl font-bold font-display text-primary-foreground mb-3">
              Diabetes Prediction System
            </h2>
            <p className="text-primary-foreground/70 max-w-md">
              Secure access for healthcare professionals. Manage patient predictions, view history, and generate medical reports.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <Card className="shadow-premium border-border rounded-2xl">
            <CardHeader className="text-center space-y-3 pb-2">
              <div className="mx-auto w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
                <Shield className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl font-display text-foreground">Doctor Login</CardTitle>
              <CardDescription className="text-muted-foreground">
                Sign in to access the prediction dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="username" className="text-foreground text-sm font-medium">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="username"
                      placeholder="admin"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10 h-11 rounded-xl"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-foreground text-sm font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 h-11 rounded-xl"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-destructive text-center bg-destructive/5 rounded-xl p-3">{error}</p>
                )}

                <Button
                  type="submit"
                  className="w-full gradient-primary text-primary-foreground font-semibold h-12 rounded-xl shadow-glow hover:shadow-elevated transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? "Signing in…" : "Sign In"}
                </Button>

                <p className="text-xs text-center text-muted-foreground pt-2">
                  Default: <code className="bg-muted px-1.5 py-0.5 rounded-md font-semibold">admin</code> / <code className="bg-muted px-1.5 py-0.5 rounded-md font-semibold">admin123</code>
                </p>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
