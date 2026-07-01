import { AnimatePresence, motion } from "framer-motion";
import useStore from "./stores/useStore";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import SplashScreen from "./components/ui/SplashScreen";
import PreferenceOverlay from "./components/ui/PreferenceOverlay";
import SettingsModal from "./components/ui/SettingsModal";
import ExitButton from "./components/ui/ExitButton";
import Home from "./pages/Home";
import FloorDirectory from "./pages/FloorDirectory";
import ShowroomPage from "./pages/ShowroomPage";
import ViewerPage from "./pages/ViewerPage";

const pages = {
  home: Home,
  directory: FloorDirectory,
  showroom: ShowroomPage,
  viewer: ViewerPage,
};

function PageRouter() {
  const { page, motionPreference } = useStore();
  const isLowMotion = motionPreference === "low";

  const PageComponent = pages[page];

  if (!PageComponent) {
    return <Home />;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={page}
        initial={{ opacity: 0, scale: page === "viewer" ? 0.97 : 1 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: page === "home" ? 0.97 : 1 }}
        transition={{
          duration: isLowMotion ? 0.1 : 0.45,
          ease: "easeInOut",
        }}
        className="absolute inset-0"
      >
        <PageComponent />
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const { page } = useStore();

  if (page === "splash") {
    return (
      <ErrorBoundary>
        <SplashScreen />
      </ErrorBoundary>
    );
  }

  if (page === "onboarding") {
    return (
      <div className="fixed inset-0 bg-[#09090b]">
        <PreferenceOverlay />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="relative w-full min-h-screen bg-showroom-dark overflow-hidden">
        {/* Ambient background glows */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/4 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/4 rounded-full blur-3xl" />
        </div>

        <PageRouter />

        {/* Global overlays */}
        <SettingsModal />
        <ExitButton />
      </div>
    </ErrorBoundary>
  );
}
