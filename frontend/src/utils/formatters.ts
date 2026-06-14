/**
 * Formata uma data em string para o padrão brasileiro (pt-BR).
 *
 * Converte uma data no formato ISO ou HTTP (ex: "Sat, 11 Apr 2026 23:44:10 GMT")
 * para uma representação legível ao usuário, incluindo data e hora no fuso local.
 *
 * Exemplo:
 * - Entrada: "Sat, 11 Apr 2026 23:44:10 GMT"
 * - Saída: "11/04/2026 20:44"
 *
 * @param dateString - Data em formato string (ISO, UTC ou HTTP)
 * @returns Data formatada no padrão brasileiro (dd/mm/aaaa hh:mm)
 */
export function formatDate(dateString: string) {
    return new Date(dateString).toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
    });
}


/**
 * Converte uma data em string para o formato compatível com inputs HTML do tipo "date".
 *
 * Essa função transforma datas em formatos como ISO ou HTTP (ex: "Tue, 21 Apr 2026 17:47:31 GMT")
 * para o padrão "YYYY-MM-DD", que é o formato esperado por <input type="date" />.
 *
 * É especialmente útil para comparar datas vindas da API com valores de formulários.
 *
 * Exemplo:
 * - Entrada: "Tue, 21 Apr 2026 17:47:31 GMT"
 * - Saída: "2026-04-21"
 *
 * @param dateString - Data em formato string (ISO, UTC ou HTTP)
 * @returns Data formatada no padrão "YYYY-MM-DD"
 */
export function formatToInputDate(dateString: string) {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
}


/**
 * Converte um timestamp (Data/Hora) para o formato compatível com inputs HTML do tipo "date".
 *
 * Garante uma conversão segura de valores do tipo timestamp, Date, nulos ou indefinidos
 * para o padrão "YYYY-MM-DD" exigido por componentes de formulário, tratando cenários
 * onde a informação de data possa estar ausente.
 *
 * Exemplo:
 * - Entrada: "2026-06-14T21:00:00.000Z"
 * - Saída: "2026-06-14"
 * - Entrada: null
 * - Saída: ""
 *
 * @param timestamp - O timestamp recebido (string, objeto Date, null ou undefined)
 * @returns Data formatada no padrão "YYYY-MM-DD" ou uma string vazia caso seja inválido
 */
export const formatTimestamp = (timestamp: string | Date | null | undefined) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    return date.toISOString().split("T")[0];
};
