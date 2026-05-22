import { useState } from "react";
import "./App.css";

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MaterialRegistration from "./form/pages/MaterialRegistration/MaterialRegistration.jsx";
import Dashboard from "./home/pages/Dashboard.jsx";
import Login from "./auth/pages/login/Login.jsx";
import ChangePassword from "./auth/pages/changepassword/ChangePassword.jsx";
import RecoverPassword from "./auth/pages/recoverpassword/RecoverPassword.jsx";
import RegisterService from "./form/pages/RegisterService/RegisterService.jsx";
import RegisterCity from "./form/pages/registercity/RegisterCity.jsx";
import ServiceInsert from "./form/pages/ServiceInsert/ServiceInsert.jsx";
import SectionPage from "./home/pages/SectionPage.jsx";
import ProtectedRoute from "./home/components/ProtectedRoute.jsx";
import UserRegistration from "./auth/pages/UserRegistration/UserRegistration.jsx";

import * as AppRoutes from "./routes/AppRoutes.jsx";

function App() {
  const [tela, setTela] = useState("recuperar");

  return (
    <div className="App">
      {
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to={AppRoutes.Login} />} />
            <Route path={AppRoutes.Login} element={<Login />} />
            <Route path={AppRoutes.Dashboard} element={<Dashboard />} />
            <Route
              path={AppRoutes.UserRegistration}
              element={<UserRegistration />}
            />
            <Route
              path={AppRoutes.ChangePassword}
              element={<ChangePassword />}
            />
            <Route
              path={AppRoutes.RecoverPassword}
              element={<RecoverPassword />}
            />
            <Route
              path={AppRoutes.RegisterService}
              element={<RegisterService />}
            />
            <Route
              path={AppRoutes.ServiceInsert}
              element={<ServiceInsert />}
            />
            <Route
              path={AppRoutes.MaterialRegistration}
              element={<MaterialRegistration />}
            />
            <Route
              path={AppRoutes.UserRegistration}
              element={<UserRegistration />}
            />
            <Route path={AppRoutes.RegisterCity} element={<RegisterCity />} />
            /* Fallbacks temporarios para areas do dashboard que ainda nao
            possuem telas dedicadas. */
            <Route
              path={AppRoutes.Perfil}
              element={
                <SectionPage
                  eyebrow="Gerenciamento do Perfil"
                  title="Perfil e preferências de acesso"
                  description="Este é um exemplo de tela para a futura integração com perfil autenticado, preferências e troca de credenciais."
                  ctaLabel="Voltar ao painel"
                  ctaPath="/dashboard"
                />
              }
            />
            <Route
              path={AppRoutes.Relatorios}
              element={
                <SectionPage
                  eyebrow="Inteligência operacional"
                  title="Relatórios"
                  description="Visualize indicadores de desempenho, produtividade da equipe e evolução das ordens de serviço."
                  ctaLabel="Voltar ao painel"
                  ctaPath="/dashboard"
                />
              }
            />
            <Route
              path={AppRoutes.Configuracoes}
              element={
                <SectionPage
                  eyebrow="Administração do sistema"
                  title="Configurações"
                  description="Ajuste parâmetros da operação, preferências de uso e regras internas do FaseCerta."
                  ctaLabel="Voltar ao painel"
                  ctaPath="/dashboard"
                />
              }
            />
            <Route
              path={AppRoutes.Clientes}
              element={
                <SectionPage
                  eyebrow="Módulo operacional"
                  title="Gestão de Clientes"
                  description="Área demonstrativa para a futura navegação do módulo de clientes."
                  ctaLabel="Voltar ao painel"
                  ctaPath="/dashboard"
                />
              }
            />
            <Route
              path={AppRoutes.ServicosEstoque}
              element={
                <SectionPage
                  eyebrow="Módulo operacional"
                  title="Serviços e Estoque"
                  description="Área demonstrativa para a futura navegação do módulo de serviços e estoque."
                  ctaLabel="Voltar ao painel"
                  ctaPath="/dashboard"
                />
              }
            />
            <Route
              path={AppRoutes.ServicosEstoqueNovoItem}
              element={
                <SectionPage
                  eyebrow="Fallback temporário"
                  title="Novo Item"
                  description="Ainda não existe uma tela dedicada para cadastro de itens no estoque. Esta rota permanece como placeholder até a implementação do formulário real."
                  ctaLabel="Voltar ao painel"
                  ctaPath="/dashboard"
                />
              }
            />
            <Route
              path={AppRoutes.Pedidos}
              element={
                <SectionPage
                  eyebrow="Módulo operacional"
                  title="Pedidos / Ordens de Serviço"
                  description="Área demonstrativa para a futura navegação do módulo de pedidos e ordens de serviço."
                  ctaLabel="Voltar ao painel"
                  ctaPath="/dashboard"
                />
              }
            />
            <Route
              path={AppRoutes.OrdensServicoNovo}
              element={
                <SectionPage
                  eyebrow="Fallback temporário"
                  title="Criar OS"
                  description="Ainda não existe uma página de formulário dedicada para abertura de ordem de serviço. Esta rota foi mantida como placeholder até a tela real ser criada."
                  ctaLabel="Voltar ao painel"
                  ctaPath="/dashboard"
                />
              }
            />
            <Route
              path={AppRoutes.Financeiro}
              element={
                <ProtectedRoute allowedProfiles={["gestor"]} redirectTo="/">
                  <SectionPage
                    eyebrow="Módulo restrito"
                    title="Financeiro"
                    description="Acesso permitido somente para o perfil administrativo / gestor. A ocultação visual não substitui a validação real no backend."
                    ctaLabel="Voltar ao painel"
                    ctaPath="/dashboard"
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path={AppRoutes.FinanceiroDespesasNova}
              element={
                <SectionPage
                  eyebrow="Fallback temporário"
                  title="Cadastrar Despesa"
                  description="Ainda não existe uma tela financeira específica para lançamento de despesas. Esta rota foi conectada como placeholder funcional."
                  ctaLabel="Voltar ao painel"
                  ctaPath="/dashboard"
                />
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
