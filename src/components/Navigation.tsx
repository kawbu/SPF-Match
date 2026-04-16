import { useState } from "react";
import { Sun, Menu, X, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isTimerActive?: boolean;
  timeRemaining?: number | null;
}

interface NavItem {
  id: string;
  label: string;
  external?: boolean;
  url?: string;
}

export function Navigation({
  currentPage,
  onNavigate,
  isTimerActive = false,
  timeRemaining = null,
}: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { id: "home", label: "Home" },
    { id: "quiz", label: "Quiz" },
    { id: "resources", label: "Resources" },
    { id: "reminder", label: "Reminder" },
  ];

  const handleNavigate = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <nav className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => handleNavigate("home")}
          >
            <Sun className="w-6 h-6" />
            <span className="text-xl">SPFMatch</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-2 lg:gap-4 items-center">
            {navItems.map((item) =>
              item.external ? (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded transition-colors whitespace-nowrap hover:bg-primary-foreground/10"
                >
                  {item.label}
                </a>
              ) : (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`px-3 py-2 rounded transition-colors whitespace-nowrap ${
                    currentPage === item.id
                      ? "bg-primary-foreground/20"
                      : "hover:bg-primary-foreground/10"
                  }`}
                >
                  {item.label}
                </button>
              )
            )}
            {isTimerActive && timeRemaining !== null && timeRemaining > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 bg-primary-foreground/20 rounded ml-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm tabular-nums min-w-[2.75rem]">{formatTime(timeRemaining)}</span>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded hover:bg-primary-foreground/10 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <motion.div
              animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </motion.div>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-16 left-0 right-0 bg-primary md:hidden shadow-lg"
            >
              <div className="container mx-auto px-4">
                <div className="pb-4 border-t border-primary-foreground/20 pt-2">
                  <div className="flex flex-col gap-2">
                    {navItems.map((item) =>
                      item.external ? (
                        <a
                          key={item.id}
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-3 rounded transition-colors text-left hover:bg-primary-foreground/10"
                        >
                          {item.label}
                        </a>
                      ) : (
                        <button
                          key={item.id}
                          onClick={() => handleNavigate(item.id)}
                          className={`px-4 py-3 rounded transition-colors text-left ${
                            currentPage === item.id
                              ? "bg-primary-foreground/20"
                              : "hover:bg-primary-foreground/10"
                          }`}
                        >
                          {item.label}
                        </button>
                      )
                    )}
                    {isTimerActive && timeRemaining !== null && timeRemaining > 0 && (
                      <div className="flex items-center gap-2 px-4 py-3 bg-primary-foreground/20 rounded">
                        <Clock className="w-4 h-4" />
                        <span>Timer: {formatTime(timeRemaining)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}