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
