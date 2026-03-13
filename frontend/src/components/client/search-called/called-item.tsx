
export default function CalledItem({ numero, servico, despachante, data, estado }) {
    return (
        <div className="chamado">
            <span>Nº {numero} - {servico}</span>

            <span>
                {despachante} - {data} - {estado}
            </span>
        </div>
    );
}
