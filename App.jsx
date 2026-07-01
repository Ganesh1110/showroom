import { AnimatePresence, motion } from "framer-motion";
import useStore from "./stores/useStore";
import SplashScreen from "./components/ui/SplashScreen";
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

export default function App() {
  const { page } = useStore();

  // Show splash screen on initial load
  if (page === "splash") {
    return <SplashScreen />;
  }

  const PageComponent = pages[page];

  return (
    <div className="relative w-full min-h-screen bg-showroom-dark overflow-hidden">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/4 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/4 rounded-full blur-3xl" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, scale: page === "viewer" ? 0.97 : 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: page === "home" ? 0.97 : 1 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <PageComponent />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
