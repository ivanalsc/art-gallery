import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import ArtExplorer from "./components/ArtExplorer";
import ArtistPage from "./components/ArtistPage";
import { AnimatePresence } from "framer-motion";

function App() {
  return (
    <BrowserRouter>
    <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route index element={<ArtExplorer />} />
          <Route path="/artist/:artistName" element={<ArtistPage />} />
        </Routes>
        </AnimatePresence>
    </BrowserRouter>
  );
}

export default App;
