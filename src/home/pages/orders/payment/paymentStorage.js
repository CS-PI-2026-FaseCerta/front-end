const PAYMENT_STORAGE_KEY = "fasecerta.os.payment";

const PAYMENT_METHOD_LABELS = {
    boleto: "Boleto",
    bank_transfer: "Transferência bancária",
    cash: "Dinheiro",
    check: "Cheque",
    credit_card: "Cartão de crédito",
    debit_card: "Cartão de débito",
    pix: "PIX",
};

const DEFAULT_PAYMENT_DATA = {
    terms: {
        paymentType: "cash",
        downPayment: "",
        installments: "",
        details: "",
    },
    methods: [],
};

const readPaymentData = () => {
    try {
        const storedData = localStorage.getItem(PAYMENT_STORAGE_KEY);

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

const writePaymentData = (data) => {
    localStorage.setItem(
        PAYMENT_STORAGE_KEY,
        JSON.stringify(data),
    );
};

export const getPaymentData = () => {
    return readPaymentData();
};

export const savePaymentTerms = (terms) => {
    const currentData = readPaymentData();

    const nextData = {
        ...currentData,
        terms: {
            ...DEFAULT_PAYMENT_DATA.terms,
            ...terms,
        },
    };

    writePaymentData(nextData);

    return nextData;
};

export const savePaymentMethods = (methods) => {
    const currentData = readPaymentData();

    const nextData = {
        ...currentData,
        methods: Array.isArray(methods) ? methods : [],
    };

    writePaymentData(nextData);

    return nextData;
};

export const clearPaymentData = () => {
    localStorage.removeItem(PAYMENT_STORAGE_KEY);
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