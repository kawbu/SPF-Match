import { useState, useEffect, useRef } from "react";
import { HashRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { HomePage } from "./components/HomePage";
import { QuizPage } from "./components/QuizPage";
import { calculateFitzpatrickType } from "./utils/fitzpatrick";
import { ResultsPage } from "./components/ResultsPage";
import { ResourcesPage } from "./components/ResourcesPage";
import { ReminderPage } from "./components/ReminderPage";

function AppContent() {
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string | string[]> | null>(null);
  const [fitzpatrickType, setFitzpatrickType] = useState<number | undefined>(undefined);

  // Update page title based on current route
  useEffect(() => {
    const pathToTitle: Record<string, string> = {
      "/": "Home",
      "/quiz": "Quiz",
      "/results": "Results",
      "/resources": "Resources",
      "/reminder": "Reminder"
    };
    const title = pathToTitle[routerLocation.pathname] || "Home";
    document.title = `${title} | SPFMatch`;
  }, [routerLocation.pathname]);

  // Timer state lifted to App level for persistence
  const [geoLocation, setGeoLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [uvIndex, setUvIndex] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer effect that runs at App level
  useEffect(() => {
    if (isActive && timeRemaining !== null && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null || prev <= 1) {
            // Timer reached 0
            if (timerRef.current) clearInterval(timerRef.current);
            setIsActive(false);

            // Show notification
            if (
              "Notification" in window &&
              Notification.permission === "granted"
            ) {
              new Notification("SPFMatch Reminder", {
                body: "Time to reapply your sunscreen!",
                icon: "/images/logo.png",
                badge: "/images/logo.png",
              });
            }

            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, timeRemaining]);

  const handleNavigate = (page: string) => {
    // Scroll to top of page
    window.scrollTo(0, 0);

    // If navigating to quiz but answers exist, go to results instead
    if (page === "quiz" && quizAnswers) {
      navigate("/results");
    } else {
      navigate(`/${page === "home" ? "" : page}`);
    }
  };

  const handleQuizSubmit = (answers: Record<string, string | string[]>) => {
    setQuizAnswers(answers);

    // Calculate Fitzpatrick type for the reminder page
    const calculatedType = calculateFitzpatrickType(answers);
    setFitzpatrickType(calculatedType);
    window.scrollTo(0, 0);
    navigate("/results");
  };

  const handleRestartQuiz = () => {
    window.scrollTo(0, 0);
    setQuizAnswers(null);
    navigate("/quiz");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        currentPage={routerLocation.pathname === "/" ? "home" : routerLocation.pathname.substring(1)}
        onNavigate={handleNavigate}
        isTimerActive={isActive}
        timeRemaining={timeRemaining}
      />

      <Routes>
        <Route path="/" element={<HomePage onNavigate={handleNavigate} />} />
        <Route path="/quiz" element={<QuizPage onSubmit={handleQuizSubmit} />} />
        <Route
          path="/results"
          element={
            quizAnswers ? (
              <ResultsPage answers={quizAnswers} onRestart={handleRestartQuiz} />
            ) : (
              <Navigate to="/quiz" replace />
            )
          }
        />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route
          path="/reminder"
          element={
            <ReminderPage
              fitzpatrickType={fitzpatrickType}
              location={geoLocation}
              setLocation={setGeoLocation}
              uvIndex={uvIndex}
              setUvIndex={setUvIndex}
              timeRemaining={timeRemaining}
              setTimeRemaining={setTimeRemaining}
              isActive={isActive}
              setIsActive={setIsActive}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}
