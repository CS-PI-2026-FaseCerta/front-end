import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

import RegisterServiceForm from "./RegisterServiceForm.jsx";
import Header from "../../../global/components/header/Header";
import Footer from "../../../global/components/Footer/Footer";
import servicosService from "../../../services/servicos/servicosService";
import { getServiceErrorMessage } from "../../../services/servicos/servicosErrors";
import { mapServiceToForm } from "../../../services/servicos/servicosMapper";
import { canManageServices } from "../../../services/servicos/servicosPermissions";
import * as AppRoutes from "../../../routes/AppRoutes.jsx";
import "./RegisterService.css";
import "../../../global/components/form/Form.css";

export default function RegisterService() {
  const navigate = useNavigate();
  const { id } = useParams();
  const canWrite = canManageServices();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    if (!id || !canWrite) {
      setLoading(false);
      setInitialData(null);
      setErrorMessage("");
      return () => {
        active = false;
      };
    }

    setLoading(true);
    setErrorMessage("");

    servicosService
      .getServiceById(id)
      .then((service) => {
        if (active) setInitialData(mapServiceToForm(service));
      })
      .catch((error) => {
        if (active) {
          setErrorMessage(
            getServiceErrorMessage(error, "Não foi possível carregar o serviço."),
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [canWrite, id]);

  const handleSuccess = () => {
    navigate(AppRoutes.Servicos, { replace: true });
  };

  const isEdit = Boolean(id);

  return (
    <div className="register-service-page">
      <Header />
      <main className="service-page-content">
        <div className="service-form-card">
          <div className="card-header">
            <button
              className="back-button"
              onClick={() => navigate(-1)}
              type="button"
              aria-label="Voltar"
            >
              <FaArrowLeft size={20} className="back-button-icon" />
            </button>
            <h1>{isEdit ? "Editar Serviço" : "Cadastrar Serviço"}</h1>
          </div>

          {!canWrite ? (
            <div className="form-error-inline">
              Você não possui permissão para {isEdit ? "editar" : "cadastrar"} serviços.
            </div>
          ) : loading ? (
            <p>Carregando dados do serviço...</p>
          ) : errorMessage ? (
            <div className="form-error-inline">{errorMessage}</div>
          ) : (
            <RegisterServiceForm
              onSuccess={handleSuccess}
              onCancel={() => navigate(-1)}
              initialData={initialData}
              mode={isEdit ? "edit" : "create"}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
