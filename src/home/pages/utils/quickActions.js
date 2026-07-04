import { QUICK_ACTIONS } from "../../data/quickActions";

const QUICK_ACTIONS_STORAGE_KEY = "quickActions";

export const getQuickActionsByProfile = (perfil) =>
    QUICK_ACTIONS.filter((atalho) =>
        atalho.allowedProfiles.includes(perfil),
    ).sort((a, b) => {
        const orderA = a.order[perfil] ?? 99;
        const orderB = b.order[perfil] ?? 99;

        return orderA - orderB;
    });

export const sanitizeQuickActionIdsByProfile = (perfil, selectedIds = []) => {
    if (!Array.isArray(selectedIds)) {
        return [];
    }

    const allowedActions = getQuickActionsByProfile(perfil);
    const allowedIds = new Set(allowedActions.map((action) => action.id));

    return selectedIds.filter((id) => allowedIds.has(id));
};

export const getSelectedQuickActionsByProfile = (perfil, selectedIds = []) => {
    const allowedActions = getQuickActionsByProfile(perfil);

    if (!Array.isArray(selectedIds) || selectedIds.length === 0) {
        return allowedActions;
    }

    const validIds = new Set(
        sanitizeQuickActionIdsByProfile(perfil, selectedIds),
    );

    return allowedActions.filter((action) => validIds.has(action.id));
};

export const loadQuickActionSelection = (perfil) => {
    if (typeof window === "undefined") {
        return [];
    }

    try {
        const storedValue = window.localStorage.getItem(QUICK_ACTIONS_STORAGE_KEY);

        if (!storedValue) {
            return [];
        }

        const parsed = JSON.parse(storedValue);
        const profileSelection = parsed?.[perfil];

        return sanitizeQuickActionIdsByProfile(perfil, profileSelection);
    } catch (error) {
        console.error("Falha ao ler atalhos personalizados do localStorage", error);
        return [];
    }
};

export const saveQuickActionSelection = (perfil, selectedIds = []) => {
    if (typeof window === "undefined") {
        return;
    }

    try {
        const validIds = sanitizeQuickActionIdsByProfile(perfil, selectedIds);
        const storedValue = window.localStorage.getItem(QUICK_ACTIONS_STORAGE_KEY);
        const parsed = storedValue ? JSON.parse(storedValue) : {};

        const nextValue = {
            ...(parsed && typeof parsed === "object" ? parsed : {}),
            [perfil]: validIds,
        };

        // Persistencia temporaria ate integracao com backend de preferencias.
        window.localStorage.setItem(
            QUICK_ACTIONS_STORAGE_KEY,
            JSON.stringify(nextValue),
        );
    } catch (error) {
        console.error(
            "Falha ao salvar atalhos personalizados no localStorage",
            error,
        );
    }
};

// TODO: No futuro, combinar permissões + preferências do usuário para ordenar/esconder atalhos.