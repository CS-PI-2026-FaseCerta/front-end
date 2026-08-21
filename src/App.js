import "./App.css";

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import RegisterProduct from "./form/pages//RegisterProduct/RegisterProduct.jsx";
import Dashboard from "./home/pages/Dashboard.jsx";

import Login from "./auth/pages/login/Login.jsx";
import ChangePassword from "./auth/pages/changepassword/ChangePassword.jsx";
import RecoverPassword from "./auth/pages/recoverpassword/RecoverPassword.jsx";

import RegisterCity from "./form/pages/registercity/RegisterCity.jsx";
import ServiceInsert from "./form/pages/ServiceInsert/ServiceInsert.jsx";

import SectionPage from "./home/pages/SectionPage.jsx";
import protectedRoute from "./home/components/protectedRoute.jsx";

import UserRegistration from "./auth/pages/UserRegistration/UserRegistration.jsx";
import LoadingOverlay from "./global/components/loading/LoadingOverlay.jsx";

import CustomersListPage from "./home/pages/customers/CustomersListPage.jsx";
import RegisterCustomer from "./form/pages/registercustomer/RegisterCustomer.jsx";
import ProductsListPage from "./home/pages/products/ProductsListPage";

import ExpenseList from "./finance/pages/expenselist/ExpenseList.jsx";

import ServicesListPage from "./home/pages/services/ServicesListPage.jsx";
import RegisterService from "./form/pages/RegisterService/RegisterService.jsx";

import DashboardLayout from "./global/components/layout/DashboardLayout.jsx";

import OrdersListPage from "./home/pages/orders/OrdersListPage.jsx";

import ApplyDiscounts from "./home/components/submodule/pages/ApplyDiscounts/ApplyDiscounts.jsx";

import PaymentMethods from "./auth/pages/paymentMethods/PaymentMethods.jsx";
import PaymentTerms from "./auth/pages/paymentTerms/PaymentTerms.jsx";

import * as AppRoutes from "./routes/AppRoutes.jsx";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>

          {/* Redirect raiz */}
          <Route path="/" element={<Navigate to={AppRoutes.Login} />} />

          {/* Auth */}
          <Route path={AppRoutes.Login} element={<Login />} />
          <Route path={AppRoutes.UserRegistration} element={<UserRegistration />} />
          <Route path={AppRoutes.ChangePassword} element={<ChangePassword />} />
          <Route path={AppRoutes.RecoverPassword} element={<RecoverPassword />} />

          {/* Forms públicos/independentes */}
          <Route path={AppRoutes.RegisterService} element={<RegisterService />} />
          <Route path={AppRoutes.RegisterProduct} element={<RegisterProduct />} />
          <Route path={AppRoutes.ServiceInsert} element={<ServiceInsert />} />
          <Route path={AppRoutes.RegisterClient} element={<RegisterCustomer />} />
          <Route path={AppRoutes.RegisterCity} element={<RegisterCity />} />
          <Route path={AppRoutes.PaymentMethods} element={<PaymentMethods />} />
          <Route path={AppRoutes.PaymentTerms} element={<PaymentTerms />} />

          {/* Loading */}
          <Route path={AppRoutes.Loading} element={<LoadingOverlay />} />

          {/* Dashboard layout (rotas autenticadas) */}
          <Route element={<DashboardLayout />}>
            <Route path={AppRoutes.Dashboard} element={<Dashboard />} />

            {/* Listas principais */}
            <Route path={AppRoutes.Clientes} element={<CustomersListPage />} />

            <Route
              path={AppRoutes.ProdutosEstoque}
              element={<ProductsListPage />}
            />
            <Route path={AppRoutes.Servicos} element={<ServicesListPage />} />
            <Route path={AppRoutes.Pedidos} element={<OrdersListPage />} />


            <Route
              path={AppRoutes.ApplyDiscounts}
              element={<ApplyDiscounts />}
            />

            {/* Módulos futuros / placeholders */}          

            <Route
              path={AppRoutes.OrdensServico}
              element={
                <SectionPage
                  eyebrow="Módulo operacional"
                  title="Ordens de Serviço"
                  description="Área demonstrativa para a futura navegação do módulo de ordens de serviço."
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
                  description="Ainda não existe uma página de formulário dedicada para abertura de ordem de serviço."
                  ctaLabel="Voltar ao painel"
                  ctaPath="/dashboard"
                />
              }
            />

            <Route path={AppRoutes.Perfil} element={
              <SectionPage
                eyebrow="Perfil"
                title="Perfil e preferências de acesso"
                description="Configurações de usuário."
                ctaLabel="Voltar ao painel"
                ctaPath="/dashboard"
              />
            } />

            <Route path={AppRoutes.Relatorios} element={
              <SectionPage
                eyebrow="Relatórios"
                title="Relatórios"
                description="Indicadores e análises."
                ctaLabel="Voltar ao painel"
                ctaPath="/dashboard"
              />
            } />

            <Route path={AppRoutes.Configuracoes} element={
              <SectionPage
                eyebrow="Configurações"
                title="Configurações"
                description="Ajustes do sistema."
                ctaLabel="Voltar ao painel"
                ctaPath="/dashboard"
              />
            } />

            <Route
              path={AppRoutes.Financeiro}
              element={
                <ExpenseList/>
              }
            />

            <Route
              path={AppRoutes.FinanceiroDespesasNova}
              element={
                <SectionPage
                  eyebrow="Despesas"
                  title="Cadastrar Despesa"
                  description="Fallback temporário."
                  ctaLabel="Voltar ao painel"
                  ctaPath="/dashboard"
                />
              }
            />
          </Route>

          {/* fallback global */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;