import React, { useState } from "react";
import { FaUsers, FaBoxOpen, FaClipboardList, FaFileInvoiceDollar, FaExclamationTriangle } from 'react-icons/fa';

import Header from "../../global/components/Header/Header";
import Footer from "../../global/components/Footer/Footer";
import ModuleCard from "../components/ModuleCard/ModuleCard";

import './dashboard.css';
import '../../index.css';

// =============================================================================
// MOCK DE DADOS E PERFIL DE USUÁRIO
// Em uma aplicação real, 'PERFIL_USUARIO' viria de um contexto de autenticação,
// token JWT ou estado global (Redux, Zustand, etc.).
// =============================================================================

// Alterne entre 'gestor' e 'tecnico' para testar os diferentes perfis.
const PERFIL_USUARIO = "gestor"; // ou "tecnico"

const modulesData = [
  {
    id: 1,
    title: 'Gestão de Clientes',
    description: 'Adicione, consulte e gerencie a base de clientes.',
    icon: <FaUsers size={30} />,
    path: '/clientes',
    allowedProfiles: ['gestor', 'tecnico']
  },
  {
    id: 2,
    title: 'Serviços e Estoque',
    description: 'Controle de serviços prestados e materiais em estoque.',
    icon: <FaBoxOpen size={30} />,
    path: '/servicos',
    allowedProfiles: ['gestor', 'tecnico']
  },
  {
    id: 3,
    title: 'Pedidos',
    description: 'Acompanhe e gerencie ordens de serviço e agendamentos.',
    icon: <FaClipboardList size={30} />,
    path: '/pedidos',
    allowedProfiles: ['gestor', 'tecnico']
  },
  {
    id: 4,
    title: 'Financeiro',
    description: 'Acesso a faturamentos, despesas e relatórios financeiros.',
    icon: <FaFileInvoiceDollar size={30} />,
    path: '/financeiro',
    allowedProfiles: ['gestor'] // Apenas 'gestor' pode ver este módulo
  }
];

// Componente simulado para a página Financeiro
const FinanceiroPage = ({ onBack }) => (
  <div className="page-content">
    <h1>Módulo Financeiro</h1>
    <p>Esta é a página do módulo financeiro. Apenas usuários com perfil 'gestor' podem vê-la.</p>
    <button onClick={onBack} className="back-button">Voltar ao Dashboard</button>
  </div>
);

// Componente simulado para acesso negado
const AccessDeniedPage = ({ onBack }) => (
    <div className="page-content access-denied">
        <FaExclamationTriangle size={50} />
        <h1>Acesso Negado</h1>
        <p>Você não tem permissão para acessar esta página. Contate o administrador.</p>
        <button onClick={onBack} className="back-button">Voltar ao Dashboard</button>
    </div>
);


const Dashboard = () => {
    // Simulação de roteamento interno da página
    const [currentPage, setCurrentPage] = useState('dashboard');

    // Filtra os módulos que o usuário atual pode ver
    const accessibleModules = modulesData.filter(module =>
        module.allowedProfiles.includes(PERFIL_USUARIO)
    );

    const handleCardClick = (path) => {
        // COMENTÁRIO DE SEGURANÇA:
        // A verificação abaixo é uma SIMULAÇÃO de proteção de rota no front-end.
        // Em um projeto real, a proteção principal deve estar no BACK-END.
        // O front-end apenas oculta e redireciona, mas a API deve barrar a requisição de dados.
        // Ocultar um botão/card não é segurança suficiente.
        const targetModule = modulesData.find(m => m.path === path);

        if (targetModule && targetModule.allowedProfiles.includes(PERFIL_USUARIO)) {
            // Se o usuário tem permissão, "navega" para a página
            setCurrentPage(path.replace('/', ''));
        } else {
            // Se não tem permissão (ex: técnico tentando acessar /financeiro por URL)
            setCurrentPage('access-denied');
        }
    };

    const renderContent = () => {
        if (currentPage === 'financeiro') return <FinanceiroPage onBack={() => setCurrentPage('dashboard')} />;
        if (currentPage === 'access-denied') return <AccessDeniedPage onBack={() => setCurrentPage('dashboard')} />;

        // Página padrão: Dashboard
        return (
            <div className="page-content">
                <h1>Dashboard</h1>
                <p>Bem-vindo ao FaseCerta! Selecione um módulo para começar.</p>
                <div className="modules-grid">
                    {accessibleModules.map(module => (
                        <ModuleCard key={module.id} {...module} onClick={handleCardClick} />
                    ))}
                </div>
            </div>
        );
    }

    return(
        <div className="page-container">
            <Header />
            <main>
                {renderContent()}
            </main>
            <Footer />
        </div>
    )

}
export default Dashboard;