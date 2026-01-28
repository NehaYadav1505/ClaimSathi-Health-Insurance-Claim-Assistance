import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Menu, X } from "lucide-react";
import { useEffect,useState } from "react";
import { HealthcareButton } from "@/components/ui/healthcare-button";
import { useNavigate } from "react-router-dom";


const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
    const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(storedUser));
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, []);


 const navLinks = [
  { href: "/", label: "Home" },
  { href: "/how-it-works", label: "How It Works" },
  ...(isLoggedIn ? [{ href: "/dashboard", label: "Dashboard" }] : []),
];


  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center"
            >
              <Heart className="w-5 h-5 text-primary-foreground" />
            </motion.div>
            <span className="font-semibold text-lg text-foreground hidden sm:block">
              ClaimSathi  
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
         <div className="hidden md:flex items-center gap-3">
  {isLoggedIn ? (
    <div className="flex items-center gap-3">
      {/* Avatar Circle */}
      <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold cursor-pointer">
        {user?.name?.charAt(0).toUpperCase()}
      </div>

      <HealthcareButton
        variant="ghost"
        size="sm"
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
          window.location.reload();
        }}
      >
        Logout
      </HealthcareButton>
    </div>
  ) : (
    <>
      <Link to="/login">
        <HealthcareButton variant="ghost" size="sm">
          Login
        </HealthcareButton>
      </Link>
      <Link to="/register">
        <HealthcareButton size="sm">Get Started</HealthcareButton>
      </Link>
    </>
  )}
</div>


          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden py-4 border-t border-border/50"
          >
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-2 mt-4 px-4">
                <Link to="/login" className="flex-1">
                  <HealthcareButton variant="outline" className="w-full">
                    Login
                  </HealthcareButton>
                </Link>
                <Link to="/register" className="flex-1">
                  <HealthcareButton className="w-full">Register</HealthcareButton>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;
