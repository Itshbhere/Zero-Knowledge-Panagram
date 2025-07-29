import { BrowserRouter, Route, Routes } from "react-router-dom";
import { WalletProvider } from "./Components/WalletConnection/WalletContext";
import LandingPage from "./Pages/LandingPage";
import Panagram from "./Pages/Panagram";

function App() {
  return (
    <WalletProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/panagram" element={<Panagram />} />
        </Routes>
      </BrowserRouter>
    </WalletProvider>
  );
}

export default App;
