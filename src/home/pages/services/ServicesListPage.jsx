import React, { useCallback, useEffect, useRef, useState } from "react";
import { FaPen, FaClipboardList, FaPlus, FaTrash } from "react-icons/fa";

import GenericListPage from "../../../global/components/lists/GenericListPage";
import RegisterServiceModal from "../../../form/pages/RegisterService/RegisterServiceModal.jsx";
import DeleteServiceModal from "./DeleteServiceModal.jsx";
import { servicesColumns } from "./Services.columns";
import { servicesFilters } from "./Services.filters";
import servicosService from "../../../services/servicos/servicosService";
import { getServiceErrorMessage } from "../../../services/servicos/servicosErrors";
import { mapServiceToForm } from "../../../services/servicos/servicosMapper";
import { canManageServices } from "../../../services/servicos/servicosPermissions";
import * as AppRoutes from "../../../routes/AppRoutes.jsx";

const REGISTER_SERVICE_CREATE_PATH = AppRoutes.RegisterService.replace("/:id?", "");

const ServicesListPage = () => {
  const [services, setServices] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [editData, setEditData] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  const currentQuery = useRef({
    searchTerm: "",
    filters: {},
    page: 1,
    pageSize: 10,
  });
  const requestId = useRef(0);
  const debounceId = useRef(null);
  const editRequestId = useRef(0);

  const canWrite = canManageServices();

  const loadServices = useCallback((query = currentQuery.current) => {
    const normalizedQuery = {
      searchTerm: query?.searchTerm ?? "",
      filters: query?.filters ?? {},
      page: query?.page ?? 1,
      pageSize: query?.pageSize ?? 10,
    };

    currentQuery.current = normalizedQuery;
    const requestNumber = ++requestId.current;
    const delay = normalizedQuery.searchTerm ? 400 : 0;

    window.clearTimeout(debounceId.current);
    debounceId.current = window.setTimeout(async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await servicosService.listServices({
          page: normalizedQuery.page,
          limit: normalizedQuery.pageSize,
          nome: normalizedQuery.searchTerm,
          categoria: normalizedQuery.filters.categoria,
          tipo_cobranca: normalizedQuery.filters.tipo_cobranca,
        });

        if (requestNumber !== requestId.current) return;

        setServices(result.items);
        setTotalItems(result.totalItems);
      } catch (requestError) {
        if (requestNumber !== requestId.current) return;

        setServices([]);
        setTotalItems(0);
        setError({
          title: "Não foi possível carregar os serviços",
          message: getServiceErrorMessage(
            requestError,
            "Não foi possível consultar o catálogo de serviços.",
          ),
        });
      } finally {
        if (requestNumber === requestId.current) setLoading(false);
      }
    }, delay);
  }, []);

  useEffect(() => {
    return () => {
      window.clearTimeout(debounceId.current);
      requestId.current += 1;
      editRequestId.current += 1;
    };
  }, []);

  const handleQueryChange = useCallback(
    (query) => {
      loadServices(query);
    },
    [loadServices],
  );

  const handleRetry = useCallback(() => {
    loadServices(currentQuery.current);
  }, [loadServices]);

  const openCreateServiceModal = () => {
    editRequestId.current += 1;
    setSelectedService(null);
    setEditData(null);
    setEditError("");
    setEditLoading(false);
    setIsServiceModalOpen(true);
  };

  const handleEdit = async (service) => {
    const requestNumber = ++editRequestId.current;

    setSelectedService(service);
    setEditData(null);
    setEditError("");
    setEditLoading(true);
    setIsServiceModalOpen(true);

    try {
      const detail = await servicosService.getServiceById(service.id);
      if (requestNumber !== editRequestId.current) return;
      setEditData(mapServiceToForm(detail));
    } catch (requestError) {
      if (requestNumber !== editRequestId.current) return;
      setEditError(
        getServiceErrorMessage(
          requestError,
          "Não foi possível carregar o serviço.",
        ),
      );
    } finally {
      if (requestNumber === editRequestId.current) setEditLoading(false);
    }
  };

  const closeServiceModal = () => {
    editRequestId.current += 1;
    setIsServiceModalOpen(false);
    setSelectedService(null);
    setEditData(null);
    setEditError("");
    setEditLoading(false);
  };

  const handleDelete = (service) => {
    setSelectedService(service);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedService(null);
  };

  const confirmDelete = async (id) => {
    try {
      await servicosService.deleteService(id);

      setServices((current) => current.filter((service) => service.id !== id));
      setTotalItems((current) => Math.max(0, current - 1));

      const shouldGoToPreviousPage =
        services.length === 1 && currentQuery.current.page > 1;

      loadServices({
        ...currentQuery.current,
        page: shouldGoToPreviousPage
          ? currentQuery.current.page - 1
          : currentQuery.current.page,
      });
    } catch (requestError) {
      if (requestError?.response?.status === 404) {
        loadServices(currentQuery.current);
      }
      throw requestError;
    }
  };

  const handleServiceSuccess = useCallback(() => {
    loadServices(currentQuery.current);
  }, [loadServices]);

  const actions = canWrite
    ? [
        {
          key: "novo-servico",
          label: "Cadastrar Serviço",
          icon: FaPlus,
          onCreate: {
            mobile: REGISTER_SERVICE_CREATE_PATH,
            desktop: openCreateServiceModal,
          },
          variant: "primary",
        },
      ]
    : [];

  const rowActions = canWrite
    ? [
        {
          key: "editar",
          title: "Editar",
          icon: FaPen,
          iconOnly: true,
          onClick: handleEdit,
          variant: "ghost",
        },
        {
          key: "excluir",
          title: "Excluir",
          icon: FaTrash,
          iconOnly: true,
          onClick: handleDelete,
          variant: "ghost",
        },
      ]
    : [];

  return (
    <>
      <GenericListPage
        title="Catálogo de Serviços"
        description="Gerencie e organize todos os serviços prestados."
        columns={servicesColumns}
        data={services}
        filters={servicesFilters}
        clientSide={false}
        totalItems={totalItems}
        loading={loading}
        error={error}
        onRetry={handleRetry}
        onQueryChange={handleQueryChange}
        search={{ placeholder: "Buscar por nome..." }}
        actions={actions}
        rowActions={rowActions}
        emptyState={{
          icon: FaClipboardList,
          title: "Nenhum serviço encontrado",
          description: "Quando houver serviços cadastrados, eles aparecerão nesta listagem.",
          ...(canWrite
            ? {
                actionLabel: "+ CADASTRAR SERVIÇO",
                onCreate: {
                  mobile: REGISTER_SERVICE_CREATE_PATH,
                  desktop: openCreateServiceModal,
                },
              }
            : {}),
        }}
      />

      <RegisterServiceModal
        isOpen={isServiceModalOpen}
        onClose={closeServiceModal}
        onSuccessCallback={handleServiceSuccess}
        mode={selectedService ? "edit" : "create"}
        initialData={editData}
        loading={editLoading}
        errorMessage={editError}
      />

      <DeleteServiceModal
        service={selectedService}
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default ServicesListPage;
