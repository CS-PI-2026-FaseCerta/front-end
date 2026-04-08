import "./App.css";
import Login from "./auth/pages/login";
import CadastroCidade from "./auth/pages/CadastroCidade";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      {/* <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
      </BrowserRouter> */}

      <CadastroCidade />
    </div>
  );
}

export default App;
