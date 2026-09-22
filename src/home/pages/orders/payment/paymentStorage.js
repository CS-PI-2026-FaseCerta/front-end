const PAYMENT_STORAGE_KEY = "fasecerta.os.payment";

const DEFAULT_PAYMENT_DATA = {
    terms: {
        paymentType: "cash",
        downPayment: "",
        installments: "",
        details: "",
    },
    methods: [],
};

const PAYMENT_METHOD_LABELS = {
    boleto: "Boleto",
    bank_transfer: "Transferência bancária",
    cash: "Dinheiro",
    check: "Cheque",
    credit_card: "Cartão de crédito",
    debit_card: "Cartão de débito",
    pix: "PIX",
};

const getStorageKey = (orderId) => {
    return `${PAYMENT_STORAGE_KEY}.${orderId}`;
};

const readPaymentData = (orderId) => {
    try {
        const storedData = localStorage.getItem(
            getStorageKey(orderId)
        );

        if (!storedData) {
            return DEFAULT_PAYMENT_DATA;
        }

        const parsedData = JSON.parse(storedData);

        return {
            terms: {
                ...DEFAULT_PAYMENT_DATA.terms,
                ...(parsedData.terms || {}),
            },
            methods: Array.isArray(parsedData.methods)
                ? parsedData.methods
                : [],
        };
    } catch {
        return DEFAULT_PAYMENT_DATA;
    }
};

const writePaymentData = (orderId, data) => {
    localStorage.setItem(
        getStorageKey(orderId),
        JSON.stringify(data)
    );
};

export const getPaymentData = (orderId) => {
    return readPaymentData(orderId);
};

export const savePaymentTerms = (orderId, terms) => {
    const currentData = readPaymentData(orderId);

    const nextData = {
        ...currentData,
        terms: {
            ...DEFAULT_PAYMENT_DATA.terms,
            ...terms,
        },
    };

    writePaymentData(orderId, nextData);

    return nextData;
};

export const savePaymentMethods = (orderId, methods) => {
    const currentData = readPaymentData(orderId);

    const nextData = {
        ...currentData,
        methods: Array.isArray(methods) ? methods : [],
    };

    writePaymentData(orderId, nextData);

    return nextData;
};

export const clearPaymentData = (orderId) => {
    localStorage.removeItem(getStorageKey(orderId));
};

export const getPaymentMethodLabel = (methodId) => {
    return PAYMENT_METHOD_LABELS[methodId] || methodId;
};

export const getPaymentMethodLabels = (methods) => {
    if (!Array.isArray(methods)) {
        return [];
    }

    return methods.map(getPaymentMethodLabel);
};

export const getPaymentMethodsSummary = (methods) => {
    return getPaymentMethodLabels(methods).join(", ");
};