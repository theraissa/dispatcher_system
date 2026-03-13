import CalledItem from "./called-item";

export default function CalledList({ chamados }) {
    return (
        <div className="chamados-lista">
            {chamados.map((chamado) => (
                <CalledItem
                    key={chamado.numero}
                    numero={chamado.numero}
                    servico={chamado.servico}
                    despachante={chamado.despachante}
                    data={chamado.data}
                    estado={chamado.estado}
                />
            ))}
        </div>
    );
}
