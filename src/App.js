import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Deshboard from "./home/pages/dashboard.jsx";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Deshboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
