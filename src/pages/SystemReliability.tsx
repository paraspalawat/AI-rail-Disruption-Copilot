import { 
  Shield, 
  Server, 
  RefreshCw, 
  CheckCircle, 
  Users, 
  Clock,
  Database,
  Zap,
  Lock
} from "lucide-react";
import Layout from "@/components/layout/Layout";

const SystemReliability = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-r from-[#24243e] via-[#302b63] to-[#0f0c29] text-primary-foreground py-16">
        <div className="container bg-gradient-to-r from-[#24243e] via-[#302b63] to-[#0f0c29] mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="h-4 w-4" />
            Trust & Safety
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            System Reliability & Safety
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Built with passenger safety as the highest priority. Our system ensures reliable operations even in challenging conditions.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="railway-section bg-background">
        <div className="railway-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Continuous Monitoring */}
            <div className="railway-card">
              <div className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                <RefreshCw className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-3">Continuous Monitoring</h2>
              <p className="text-muted-foreground mb-4">
                Our system operates around the clock, monitoring train movements and conditions across the entire railway network.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>24/7 real-time surveillance</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Automatic status updates</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Instant alert notifications</span>
                </li>
              </ul>
            </div>

            {/* Backup Systems */}
            <div className="railway-card">
              <div className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                <Database className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-3">Backup Data Systems</h2>
              <p className="text-muted-foreground mb-4">
                When live data becomes temporarily unavailable, the system automatically switches to verified backup sources.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Redundant data storage</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Automatic failover mechanisms</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Historical data analysis</span>
                </li>
              </ul>
            </div>

            {/* Human Control */}
            <div className="railway-card">
              <div className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                <Users className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-3">Human Oversight</h2>
              <p className="text-muted-foreground mb-4">
                Final decisions always rest with trained railway staff. The system provides recommendations, but humans make the calls.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Staff approval for all actions</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Manual override capabilities</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Trained control room operators</span>
                </li>
              </ul>
            </div>

            {/* Partial Failures */}
            <div className="railway-card">
              <div className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                <Server className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-3">Handling System Issues</h2>
              <p className="text-muted-foreground mb-4">
                Even if parts of the system experience difficulties, core functions continue operating to ensure uninterrupted service.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Graceful degradation protocols</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Essential services maintained</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>Quick recovery procedures</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Passenger Safety Highlight */}
          <div className="mt-12 bg-success/5 border border-success/20 rounded-2xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="bg-success/10 p-6 rounded-2xl">
                <Shield className="h-12 w-12 text-success" />
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold mb-2">Passenger Safety is Our Highest Priority</h2>
                <p className="text-muted-foreground max-w-2xl">
                  Every feature of this system is designed with one goal in mind: ensuring safe journeys for all passengers. 
                  From early warning systems to real-time communication, safety comes first in everything we do.
                </p>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-card rounded-xl border border-border">
              <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
              <p className="text-sm text-muted-foreground">System Uptime</p>
            </div>
            <div className="text-center p-6 bg-card rounded-xl border border-border">
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <p className="text-sm text-muted-foreground">Monitoring</p>
            </div>
            <div className="text-center p-6 bg-card rounded-xl border border-border">
              <div className="text-3xl font-bold text-primary mb-2">&lt;2 min</div>
              <p className="text-sm text-muted-foreground">Alert Response</p>
            </div>
            <div className="text-center p-6 bg-card rounded-xl border border-border">
              <div className="text-3xl font-bold text-primary mb-2">100%</div>
              <p className="text-sm text-muted-foreground">Human Control</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default SystemReliability;
