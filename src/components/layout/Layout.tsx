import { HeaderNew } from "@/components/HeaderNew";
import { Footer } from "@/sections/Footer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <HeaderNew />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
