import "./App.css";

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./home/pages/dashboard.jsx";
import Login from "./auth/pages/login/Login.jsx";
import ChangePassword from "./auth/pages/changepassword/ChangePassword.jsx";
import RegisterService from "./form/pages/registerservice/RegisterService.jsx";
import RegisterCity from "./form/pages/registercity/RegisterCity.jsx";
import SectionPage from "./home/pages/SectionPage";
import ProtectedRoute from "./home/components/ProtectedRoute";
import CadastroUsuario from "./auth/pages/CadastroUsuario.jsx";

function App() {
  return (
    <div className="App">
      {
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RegisterService />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Navigate to="/" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/changepassword" element={<ChangePassword />} />
            <Route path="/registerservice" element={<RegisterService />} />
            <Route path="/registercity" element={<RegisterCity />} />
            <Route
              path="/perfil"
              element={
                <SectionPage
                  eyebrow="Gerenciamento do Perfil"
                  title="Perfil e preferências de acesso"
                  description="Este é um exemplo de tela para a futura integração com perfil autenticado, preferências e troca de credenciais."
                  ctaLabel="Voltar ao painel"
                  ctaPath="/"
                />
              }
            />
            <Route
              path="/relatorios"
              element={
                <SectionPage
                  eyebrow="Inteligência operacional"
                  title="Relatórios"
                  description="Visualize indicadores de desempenho, produtividade da equipe e evolução das ordens de serviço."
                  ctaLabel="Voltar ao painel"
                  ctaPath="/"
                />
              }
            />
            <Route
              path="/configuracoes"
              element={
                <SectionPage
                  eyebrow="Administração do sistema"
                  title="Configurações"
                  description="Ajuste parâmetros da operação, preferências de uso e regras internas do FaseCerta."
                  ctaLabel="Voltar ao painel"
                  ctaPath="/"
                />
              }
            />
            <Route
              path="/clientes"
              element={
                <SectionPage
                  eyebrow="Módulo operacional"
                  title="Gestão de Clientes"
                  description="Área demonstrativa para a futura navegação do módulo de clientes."
                  ctaLabel="Voltar ao painel"
                  ctaPath="/"
                />
              }
            />
            <Route
              path="/servicos-estoque"
              element={
                <SectionPage
                  eyebrow="Módulo operacional"
                  title="Serviços e Estoque"
                  description="Área demonstrativa para a futura navegação do módulo de serviços e estoque."
                  ctaLabel="Voltar ao painel"
                  ctaPath="/"
                />
              }
            />
            <Route
              path="/pedidos"
              element={
                <SectionPage
                  eyebrow="Módulo operacional"
                  title="Pedidos / Ordens de Serviço"
                  description="Área demonstrativa para a futura navegação do módulo de pedidos e ordens de serviço."
                  ctaLabel="Voltar ao painel"
                  ctaPath="/"
                />
              }
            />
            <Route
              path="/financeiro"
              element={
                <ProtectedRoute allowedProfiles={["gestor"]} redirectTo="/">
                  <SectionPage
                    eyebrow="Módulo restrito"
                    title="Financeiro"
                    description="Acesso permitido somente para o perfil administrativo / gestor. A ocultação visual não substitui a validação real no backend."
                    ctaLabel="Voltar ao painel"
                    ctaPath="/"
                  />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      }
    </div>
  );
}

export default App;
