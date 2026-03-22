import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
  hideHeader?: boolean;
  hideFooter?: boolean;
}

const Layout = ({ children, hideHeader = false, hideFooter = false }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-[#24243e] via-[#302b63] to-[#0f0c29]">
      {!hideHeader && <Header />}
      <main className="flex-1">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default Layout;
