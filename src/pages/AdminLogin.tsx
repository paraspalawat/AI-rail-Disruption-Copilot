
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import RailLoader from "@/components/ui/RailLoader";

import { ArrowLeft, User, Lock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/admin-dashboard");
    }, 1000);
  };

  if (loading) return <RailLoader />;

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* 🎥 Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/src/components/ui/adminbg.mp4" type="video/mp4" />
      </video>

      {/* Dark security overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* All UI */}
      <div className="relative z-10 min-h-screen text-white">

        {/* Header */}
        <div className="bg-black/40 py-4 backdrop-blur">
          <div className="container mx-auto px-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto">

            {/* Logo */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="bg-red-600/80 p-3 rounded-xl backdrop-blur">
                  <Shield className="h-8 w-8 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold mb-2">Staff Portal</h1>
              <p className="text-white/70">
                Railway Administration Dashboard
              </p>
            </div>

            {/* Security Notice */}
            <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-4 mb-6 backdrop-blur">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-red-400 mt-0.5" />
                <div>
                  <p className="font-medium">Authorized Personnel Only</p>
                  <p className="text-sm text-white/70">
                    Unauthorized access attempts are monitored and logged.
                  </p>
                </div>
              </div>
            </div>

            {/* Login Card */}
            <div className="bg-white/15 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-8">

              <form onSubmit={handleLogin} className="space-y-5">

                <div className="space-y-2">
                  <Label>Staff ID / Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
                    <Input
                      className="pl-10 bg-white/80 text-black"
                      placeholder="Enter Staff ID"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
                    <Input
                      type="password"
                      className="pl-10 bg-white/80 text-black"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Sign In to Dashboard
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-white/30 text-center text-sm text-white/70">
                For login issues, contact IT Helpdesk  
                <div className="font-semibold text-white mt-1">
                  1800-XXX-XXXX
                </div>
              </div>
            </div>

            <div className="text-center text-xs text-white/60 mt-6 space-y-1">
              <p>Ministry of Railways, Government of India</p>
              <p>All access is logged for security purposes</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
