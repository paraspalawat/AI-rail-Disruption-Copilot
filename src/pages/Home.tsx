import { Link } from "react-router-dom";
import { 
  Train, 
  AlertTriangle, 
  Clock, 
  Users, 
  Shield, 
  CloudRain, 
  Wrench, 
  TrendingUp,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";

const Home = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#24243e] via-[#302b63] to-[#0f0c29] text-primary-foreground py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Train className="h-4 w-4" />
              Indian Railways Digital Initiative
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              Agentic Rail Disruption Co-pilot
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/80 mb-8 leading-relaxed">
              Smart monitoring and disruption management for Indian Railways
            </p>
            <p className="text-lg text-primary-foreground/70 mb-10 max-w-2xl mx-auto">
              Helping passengers stay informed and railway staff manage disruptions effectively, ensuring safe and timely journeys across India.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="saffron" size="xl" asChild>
                <Link to="/passenger-login">
                  Passenger Login
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              <Button 
                variant="railway-outline" 
                size="xl" 
                asChild
                className="border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                <Link to="/admin-login">
                  Staff Login
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Disruptions Matter */}
      <section className="railway-section bg-background">
        <div className="railway-container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Why Disruptions Matter
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Railway disruptions affect millions of passengers daily. Understanding the causes helps us manage them better.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="railway-card text-center group hover:shadow-md transition-shadow">
              <div className="bg-secondary w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/10 transition-colors">
                <CloudRain className="h-7 w-7 text-railway-blue" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Weather Conditions</h3>
              <p className="text-sm text-muted-foreground">
                Heavy rainfall, fog, and extreme temperatures can slow down or halt train services.
              </p>
            </div>

            <div className="railway-card text-center group hover:shadow-md transition-shadow">
              <div className="bg-secondary w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/10 transition-colors">
                <Wrench className="h-7 w-7 text-railway-blue" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Technical Issues</h3>
              <p className="text-sm text-muted-foreground">
                Signal failures, engine problems, and track maintenance require immediate attention.
              </p>
            </div>

            <div className="railway-card text-center group hover:shadow-md transition-shadow">
              <div className="bg-secondary w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/10 transition-colors">
                <AlertTriangle className="h-7 w-7 text-railway-blue" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Accidents</h3>
              <p className="text-sm text-muted-foreground">
                Unforeseen incidents require careful handling and passenger safety measures.
              </p>
            </div>

            <div className="railway-card text-center group hover:shadow-md transition-shadow">
              <div className="bg-secondary w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/10 transition-colors">
                <Clock className="h-7 w-7 text-railway-blue" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Track Congestion</h3>
              <p className="text-sm text-muted-foreground">
                High traffic on busy routes can lead to scheduling conflicts and delays.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How the System Helps */}
      <section className="railway-section bg-secondary">
        <div className="railway-container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              How the System Helps
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our intelligent monitoring system works around the clock to keep you informed and railways running smoothly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-xl shadow-sm border border-border">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-xl mb-3">Live Monitoring</h3>
              <p className="text-muted-foreground mb-4">
                Real-time tracking of all trains across the network with instant status updates.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Current train positions</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Delay duration tracking</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Route status updates</span>
                </li>
              </ul>
            </div>

            <div className="bg-card p-8 rounded-xl shadow-sm border border-border">
              <div className="bg-warning/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <AlertTriangle className="h-6 w-6 text-warning" />
              </div>
              <h3 className="font-semibold text-xl mb-3">Early Detection</h3>
              <p className="text-muted-foreground mb-4">
                Identifies potential disruptions before they impact your journey.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Weather pattern analysis</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Maintenance scheduling</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Congestion prediction</span>
                </li>
              </ul>
            </div>

            <div className="bg-card p-8 rounded-xl shadow-sm border border-border">
              <div className="bg-success/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-success" />
              </div>
              <h3 className="font-semibold text-xl mb-3">Passenger Guidance</h3>
              <p className="text-muted-foreground mb-4">
                Clear instructions and alternatives when disruptions occur.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Alternate train options</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Rescheduling information</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Simple, clear updates</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Who It Helps */}
      <section className="railway-section bg-background">
        <div className="railway-container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Who It Helps
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Designed to serve everyone in the Indian Railways ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-secondary w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-10 w-10 text-primary" />
              </div>
              <h3 className="font-semibold text-xl mb-3">Passengers</h3>
              <p className="text-muted-foreground">
                Get real-time updates on your train status, delays, and alternative travel options. Stay informed every step of your journey.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-secondary w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-10 w-10 text-primary" />
              </div>
              <h3 className="font-semibold text-xl mb-3">Railway Staff</h3>
              <p className="text-muted-foreground">
                Access comprehensive tools to monitor trains, manage disruptions, and ensure passenger safety across all routes.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-secondary w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Train className="h-10 w-10 text-primary" />
              </div>
              <h3 className="font-semibold text-xl mb-3">Control Rooms</h3>
              <p className="text-muted-foreground">
                Centralized oversight with intelligent suggestions for managing network-wide operations efficiently.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="railway-section bg-gradient-to-r from-[#24243e] via-[#302b63] to-[#0f0c29] text-primary-foreground">
        <div className="railway-container text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Access real-time train information or manage railway operations from your dedicated portal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="saffron" size="lg" asChild>
              <Link to="/passenger-login">
                Passenger Login
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
            <Button 
              variant="railway-outline" 
              size="lg" 
              asChild
              className="border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              <Link to="/admin-login">
                Admin Login
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
