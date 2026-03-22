import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import RailLoader from "@/components/ui/RailLoader";

import { Train, ArrowLeft, User, Lock, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PassengerLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/passenger-dashboard");
    }, 1000);
  };

  const handleGuestAccess = () => {
    setLoading(true);
    setTimeout(() => {
      navigate("/passenger-dashboard");
    }, 800);
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
        <source src="/src/components/ui/loginbg.mp4" type="video/mp4" />
      </video>

      {/* 🌑 Cinematic dark overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* 💻 All UI content */}
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
                <div className="bg-gradient-to-r from-[#c31432] to-[#240b36] p-3 rounded-xl backdrop-blur">
                  <Train className="h-8 w-8 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold mb-2">Passenger Portal</h1>
              <p className="text-white/70">
                Track your train and get travel updates
              </p>
            </div>

            {/* Login Card */}
            <div className="bg-white/15 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-8">

              <Tabs defaultValue="mobile" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/20">
                  <TabsTrigger value="mobile" className="gap-2">
                    <Phone className="h-4 w-4" /> Mobile
                  </TabsTrigger>
                  <TabsTrigger value="email" className="gap-2">
                    <Mail className="h-4 w-4" /> Email
                  </TabsTrigger>
                </TabsList>

                {/* Mobile Login */}
                <TabsContent value="mobile">
                  <form onSubmit={handleLogin} className="space-y-4">

                    <div className="space-y-2">
                      <Label>Mobile Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
                        <Input className="pl-10 bg-white/80 text-black" placeholder="Enter mobile number" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
                        <Input type="password" className="pl-10 bg-white/80 text-black" placeholder="Enter password" required />
                      </div>
                    </div>

                    <Button type="submit" className="w-full">
                      Sign In
                    </Button>

                  </form>
                </TabsContent>

                {/* Email Login */}
                <TabsContent value="email">
                  <form onSubmit={handleLogin} className="space-y-4">

                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
                        <Input className="pl-10 bg-white/80 text-black" placeholder="Enter email" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
                        <Input type="password" className="pl-10 bg-white/80 text-black" placeholder="Enter password" required />
                      </div>
                    </div>

                    <Button type="submit" className="w-full">
                      Sign In
                    </Button>

                  </form>
                </TabsContent>
              </Tabs>

              <div className="my-6 border-t border-white/30"></div>

              <Button
                variant="outline"
                className="w-full text-black bg-white"
                onClick={handleGuestAccess}
              >
                <User className="h-4 w-4 mr-2" />
                Continue as Guest
              </Button>

              <p className="text-center text-sm mt-6 text-white/80">
                Don't have an account? Register here
              </p>
            </div>

            <p className="text-center text-sm text-white/70 mt-6">
              Railway Enquiry: <strong>139</strong>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PassengerLogin;

