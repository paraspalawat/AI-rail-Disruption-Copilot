import { Link } from "react-router-dom";
import { Train, Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container bg-gradient-to-r from-[#24243e] via-[#302b63] to-[#0f0c29] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className=" bg-gradient-to-r from-[#c31432] to-[#240b36] p-2 rounded-lg">
                <Train className="h-5 w-5 text-accent-foreground" />
              </div>
              <span className="font-bold">Rail Disruption Co-pilot</span>
            </div>
            <p className="text-sm text-primary-foreground/70 leading-relaxed">
              Smart monitoring and disruption management for Indian Railways. Ensuring safe and timely journeys for all passengers.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-accent">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-primary-foreground/70 hover:text-accent transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/passenger-login" className="text-primary-foreground/70 hover:text-accent transition-colors">
                  Passenger Portal
                </Link>
              </li>
              <li>
                <Link to="/admin-login" className="text-primary-foreground/70 hover:text-accent transition-colors">
                  Staff Portal
                </Link>
              </li>
              <li>
                <Link to="/system-reliability" className="text-primary-foreground/70 hover:text-accent transition-colors">
                  System Reliability
                </Link>
              </li>
            </ul>
          </div>

          {/* Important Links */}
          <div>
            <h4 className="font-semibold mb-4 text-accent">Important</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/security-privacy" className="text-primary-foreground/70 hover:text-accent transition-colors">
                  Security & Privacy
                </Link>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/70 hover:text-accent transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/70 hover:text-accent transition-colors">
                  Accessibility
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/70 hover:text-accent transition-colors">
                  RTI Information
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-accent">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-primary-foreground/70">
                <Phone className="h-4 w-4" />
                <span>139 (Rail Enquiry)</span>
              </li>
              <li className="flex items-center gap-2 text-primary-foreground/70">
                <Mail className="h-4 w-4" />
                <span>support@indianrailways.gov.in</span>
              </li>
              <li className="flex items-start gap-2 text-primary-foreground/70">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>Rail Bhavan, New Delhi - 110001</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/60">
            <p>© 2024 Ministry of Railways, Government of India. All rights reserved.</p>
            <p>Developed for Indian Railways Digital Initiative</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
