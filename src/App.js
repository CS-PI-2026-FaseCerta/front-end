import "./App.css";
import Login from "./auth/pages/login";
import CadastroServico from "./auth/pages/cadastroservico";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      {/* <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
      </BrowserRouter> */}

      <CadastroServico />
    </div>
  );
}

export default App;
