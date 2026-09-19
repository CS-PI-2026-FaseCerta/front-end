import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FaPen,
  FaClipboardList,
  FaPlus,
  FaTrash,
} from "react-icons/fa";

import GenericListPage from "../../../global/components/lists/GenericListPage";
import { customersColumns } from "./Customers.columns";
import RegisterCustomerModal from "../../../form/pages/registercustomer/RegisterCustomerModal.jsx";
import DeleteCustomerModal from "./DeleteCustomerModal.jsx";

import customersService from "../../../services/customers/customersService";
import { getCustomerErrorMessage } from "../../../services/customers/customerErrors";
import { mapCustomerToForm } from "../../../services/customers/customerMapper";

import * as AppRoutes from "../../../routes/AppRoutes.jsx";

const CustomersListPage = () => {
  const [customers, setCustomers] = useState([]);
  const [totalItems, setTotalItems] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [editData, setEditData] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  const currentQuery = useRef({
    searchTerm: "",
    page: 1,
    pageSize: 10,
  });

  const requestId = useRef(0);
  const debounceId = useRef(null);

  /**
   * Carrega os clientes utilizando a consulta atual.
   *
   * - Pesquisa possui debounce de 400ms.
   * - Paginação é executada imediatamente.
   * - Não existe retry automático.
   * - Requisições antigas não sobrescrevem resultados mais novos.
   */
  const loadCustomers = useCallback((query = currentQuery.current) => {
    const normalizedQuery = {
      searchTerm: query?.searchTerm ?? "",
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
        const result = await customersService.listCustomers({
          page: normalizedQuery.page,
          limit: normalizedQuery.pageSize,
          ...customersService.buildSearchParams(
            normalizedQuery.searchTerm
          ),
        });

        /**
         * Caso outra consulta tenha sido iniciada depois desta,
         * ignoramos o resultado antigo.
         */
        if (requestNumber !== requestId.current) {
          return;
        }

        setCustomers(result?.items ?? []);
        setTotalItems(result?.totalItems ?? 0);
      } catch (requestError) {
        /**
         * Ignora erro de uma requisição antiga.
         */
        if (requestNumber !== requestId.current) {
          return;
        }

        setCustomers([]);
        setTotalItems(0);

        setError({
          title: "Não foi possível carregar os clientes",
          message: getCustomerErrorMessage(
            requestError,
            "Não foi possível conectar à API de clientes."
          ),
        });
      } finally {
        if (requestNumber === requestId.current) {
          setLoading(false);
        }
      }
    }, delay);
  }, []);

  /**
   * Limpa o debounce quando a página for desmontada.
   */
  useEffect(() => {
    return () => {
      window.clearTimeout(debounceId.current);
    };
  }, []);

  /**
   * Chamado pelo GenericListPage quando:
   *
   * - busca muda;
   * - página muda;
   * - quantidade de registros muda.
   */
  const handleQueryChange = useCallback(
    (query) => {
      loadCustomers(query);
    },
    [loadCustomers]
  );

  /**
   * Retry somente quando o usuário solicitar.
   *
   * Não existe tentativa automática após erro.
   */
  const handleRetry = useCallback(() => {
    loadCustomers(currentQuery.current);
  }, [loadCustomers]);

  /**
   * Edição do cliente.
   */
  const handleEdit = async (customer) => {
    setSelectedCustomer(customer);

    setEditData(null);
    setEditError("");
    setEditLoading(true);

    setIsCustomerModalOpen(true);

    try {
      const detail = await customersService.getCustomerById(customer.id);

      setEditData(mapCustomerToForm(detail));
    } catch (requestError) {
      setEditError(
        getCustomerErrorMessage(
          requestError,
          "Não foi possível carregar o cliente."
        )
      );
    } finally {
      setEditLoading(false);
    }
  };

  /**
   * Fecha o modal de cadastro/edição.
   */
  const closeCustomerModal = () => {
    setIsCustomerModalOpen(false);
    setSelectedCustomer(null);
    setEditData(null);
    setEditError("");
    setEditLoading(false);
  };

  /**
   * Abre confirmação de exclusão.
   */
  const handleDelete = (customer) => {
    setSelectedCustomer(customer);
    setIsDeleteModalOpen(true);
  };

  /**
   * Confirma exclusão.
   */
  const confirmDelete = async (id) => {
    try {
      await customersService.deleteCustomer(id);

      /**
       * Atualiza a página atual depois da exclusão.
       */
      loadCustomers(currentQuery.current);
    } catch (requestError) {
      /**
       * Se o cliente já tiver sido removido,
       * atualizamos a lista para refletir o estado real.
       */
      if (requestError?.response?.status === 404) {
        loadCustomers(currentQuery.current);
      }

      throw requestError;
    }
  };

  /**
   * Fecha modal de exclusão.
   */
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedCustomer(null);
  };

  /**
   * Atualiza a lista depois de cadastro/edição.
   */
  const handleCustomerSuccess = useCallback(() => {
    loadCustomers(currentQuery.current);
  }, [loadCustomers]);

  return (
    <>
      <GenericListPage
        title="Clientes"
        description="Gerencie e acompanhe todos os clientes em tempo real."
        columns={customersColumns}
        data={customers}
        clientSide={false}
        totalItems={totalItems}
        loading={loading}
        error={error}
        onRetry={handleRetry}
        onQueryChange={handleQueryChange}
        search={{
          placeholder: "Buscar por nome ou CPF/CNPJ...",
        }}
        actions={[
          {
            key: "novo-cliente",
            label: "Novo Cliente",
            icon: FaPlus,
            onCreate: {
              mobile: AppRoutes.RegisterClient,
              desktop: () => {
                setSelectedCustomer(null);
                setEditData(null);
                setEditError("");
                setIsCustomerModalOpen(true);
              },
            },
            variant: "primary",
          },
        ]}
        rowActions={[
          {
            key: "visualizar",
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
        ]}
        emptyState={{
          icon: FaClipboardList,
          title: "Nenhum cliente encontrado",
          description:
            "Use filtros, busca ou crie um novo cliente para começar a alimentar a listagem.",
          actionLabel: "Criar novo cliente",
          onCreate: {
            mobile: AppRoutes.RegisterClient,
            desktop: () => {
              setSelectedCustomer(null);
              setEditData(null);
              setEditError("");
              setIsCustomerModalOpen(true);
            },
          },
        }}
      />

      <RegisterCustomerModal
        isOpen={isCustomerModalOpen}
        onClose={closeCustomerModal}
        onSuccessCallback={handleCustomerSuccess}
        mode={selectedCustomer ? "edit" : "create"}
        initialData={editData}
        loading={editLoading}
        errorMessage={editError}
      />

      <DeleteCustomerModal
        customer={selectedCustomer}
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default CustomersListPage;