import { 
  Shield, 
  Lock, 
  UserCheck, 
  Eye, 
  FileText,
  Server,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import Layout from "@/components/layout/Layout";

const SecurityPrivacy = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-r from-[#24243e] via-[#302b63] to-[#0f0c29] text-primary-foreground py-16">
        <div className="container bg-gradient-to-r from-[#24243e] via-[#302b63] to-[#0f0c29] mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Lock className="h-4 w-4" />
            Data Protection
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Security & Privacy Policy
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Your data is protected with strict security measures and privacy guidelines in accordance with government regulations.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="railway-section bg-background">
        <div className="railway-container">
          <div className="max-w-4xl mx-auto">
            {/* Passenger Data Protection */}
            <div className="railway-card mb-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-primary/10 p-3 rounded-xl">
                  <UserCheck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Passenger Data Protection</h2>
                  <p className="text-muted-foreground">
                    We are committed to protecting the personal information of all passengers using this service.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3 p-4 bg-secondary/50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                  <div>
                    <p className="font-medium">Minimal Data Collection</p>
                    <p className="text-muted-foreground">
                      We only collect information that is essential for providing train status updates and travel assistance. No unnecessary personal data is requested or stored.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-secondary/50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                  <div>
                    <p className="font-medium">Encrypted Storage</p>
                    <p className="text-muted-foreground">
                      All passenger information is stored using industry-standard encryption methods to prevent unauthorized access.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-secondary/50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                  <div>
                    <p className="font-medium">No Third-Party Sharing</p>
                    <p className="text-muted-foreground">
                      Your personal information is never shared with third parties for commercial purposes. Data is used solely for railway operations.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Staff Access Control */}
            <div className="railway-card mb-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-primary/10 p-3 rounded-xl">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Secure Staff Access</h2>
                  <p className="text-muted-foreground">
                    Access to the administrative dashboard is strictly controlled and monitored.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3 p-4 bg-secondary/50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                  <div>
                    <p className="font-medium">Authorized Personnel Only</p>
                    <p className="text-muted-foreground">
                      Only verified Indian Railways staff with proper credentials can access the administrative systems.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-secondary/50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                  <div>
                    <p className="font-medium">Role-Based Access</p>
                    <p className="text-muted-foreground">
                      Staff members can only access features and data relevant to their designated responsibilities.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-secondary/50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                  <div>
                    <p className="font-medium">Activity Logging</p>
                    <p className="text-muted-foreground">
                      All access and actions within the system are logged for audit and security purposes.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Usage Policy */}
            <div className="railway-card mb-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-primary/10 p-3 rounded-xl">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">How We Use Your Data</h2>
                  <p className="text-muted-foreground">
                    Complete transparency about the purposes for which your information is used.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="p-4 bg-success/5 border border-success/20 rounded-lg">
                  <p className="font-medium text-success mb-2">✓ We Use Data For:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Providing train status updates</li>
                    <li>• Sending delay notifications</li>
                    <li>• Improving service quality</li>
                    <li>• Emergency communications</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
                  <p className="font-medium text-destructive mb-2">✗ We Never:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Sell your information</li>
                    <li>• Share with advertisers</li>
                    <li>• Use for unauthorized purposes</li>
                    <li>• Store data beyond necessity</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* System Security */}
            <div className="railway-card mb-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-primary/10 p-3 rounded-xl">
                  <Server className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">System Security Measures</h2>
                  <p className="text-muted-foreground">
                    Multiple layers of security protect the entire system infrastructure.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
                  <Lock className="h-4 w-4 text-primary" />
                  <span>Secure data transmission</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>Firewall protection</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
                  <UserCheck className="h-4 w-4 text-primary" />
                  <span>Multi-factor authentication</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-primary" />
                  <span>Intrusion detection</span>
                </div>
              </div>
            </div>

            {/* Compliance */}
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8">
              <div className="flex items-start gap-4">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <h2 className="text-xl font-semibold mb-2">Regulatory Compliance</h2>
                  <p className="text-muted-foreground mb-4">
                    This system operates in full compliance with:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span>Information Technology Act, 2000</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span>Personal Data Protection guidelines</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span>Railway Board security directives</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span>Government of India cyber security policies</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="mt-8 text-center p-6 bg-card rounded-xl border border-border">
              <h3 className="font-semibold mb-2">Questions About Your Data?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                For any privacy-related concerns or data requests, please contact:
              </p>
              <p className="text-primary font-medium">privacy@indianrailways.gov.in</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default SecurityPrivacy;
