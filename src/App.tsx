import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import ArtExplorer from "./components/ArtExplorer";
import ArtistPage from "./components/ArtistPage";

function App() {
  return (
    <BrowserRouter>
        <Routes location={location} key={location.pathname}>
          <Route index element={<ArtExplorer />} />
          <Route path="/artist/:artistName" element={<ArtistPage />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
