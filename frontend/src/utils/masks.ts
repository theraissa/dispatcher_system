/**
 * Remove qualquer caractere que não seja número.
 * Alterado para aceitar 'any' e garantir que seja string, evitando quebras.
 */
const onlyDigits = (value: any): string => {
    if (value === null || value === undefined) return "";
    return String(value).replace(/\D/g, "");
};

/**
 * Aplica máscara de telefone brasileiro.
 *
 * Suporta:
 * - Celular: (99) 99999-9999
 * - Fixo:    (99) 9999-9999
 *
 * @param value
 * @returns telefone formatado
 */
export const phoneMask = (value: string | undefined | null): string => {
    const digits = onlyDigits(value);
    if (!digits) return "";

    // Celular (11 dígitos: 2 DDD + 9 números)
    if (digits.length > 10) {
        return digits
            .slice(0, 11)
            .replace(/(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{5})(\d)/, "$1-$2");
    }

    // Fixo (10 dígitos: 2 DDD + 8 números)
    return digits
        .slice(0, 10)
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2");
};


/**
 * Aplica máscara de CPF.
 *
 * Formato: 999.999.999-99
 *
 * @param value
 * @returns CPF formatado
 */
export const cpfMask = (value: string | undefined | null): string => {
    const digits = onlyDigits(value).slice(0, 11);
    if (!digits) return "";

    return digits
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})/, "$1-$2");
};


/**
 * Valida CPF com cálculo oficial dos dígitos verificadores.
 *
 * @param value
 * @returns boolean
 */
export const isValidCPF = (value: string | undefined | null): boolean => {
    const cpf = onlyDigits(value);

    if (cpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpf)) return false;

    const calcCheckDigit = (base: string, factor: number) => {
        let total = 0;
        for (let i = 0; i < base.length; i++) {
            total += parseInt(base[i]) * (factor - i);
        }
        const remainder = (total * 10) % 11;
        return remainder === 10 ? 0 : remainder;
    };

    const digit1 = calcCheckDigit(cpf.slice(0, 9), 10);
    const digit2 = calcCheckDigit(cpf.slice(0, 10), 11);

    return digit1 === Number(cpf[9]) && digit2 === Number(cpf[10]);
};

/**
 * Aplica máscara de CEP.
 *
 * Formato: 99999-999
 *
 * @param value
 * @returns CEP formatado
 */
export const zipCodeMask = (value: string | undefined | null): string => {
    const digits = onlyDigits(value).slice(0, 8);
    if (!digits) return "";

    return digits.replace(/(\d{5})(\d)/, "$1-$2");
};
