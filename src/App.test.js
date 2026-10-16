import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProtectedRoute from "./home/components/protectedRoute";

test("rota protegida não renderiza seu conteúdo sem JWT", () => {
  localStorage.clear();
  sessionStorage.clear();
  render(<MemoryRouter><ProtectedRoute><div>Conteúdo restrito</div></ProtectedRoute></MemoryRouter>);
  expect(screen.queryByText("Conteúdo restrito")).not.toBeInTheDocument();
});
