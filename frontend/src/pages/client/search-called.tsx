import styled from "styled-components"

const Container = styled.div`
  width: 90%;
  max-width: 1000px;
  margin: 0 auto;
`

const SearchContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 20px 0;
`

const SearchInput = styled.input`
  padding: 10px;
  width: 23%;
  border: 1px solid #ccc;
  border-radius: 30px;
  font-size: 11px;
`

const ChamadosLista = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  margin: 0 20px;
  box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
`

const Chamado = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 15px;
  border-radius: 5px;
  background-color: #f5f5f5;
  font-size: 12px;
  cursor: pointer;

  &:hover {
    box-shadow: 0px 5px 5px rgba(0,0,0,0.1);
  }
`

const ChamadoTitulo = styled.span``

const ChamadoInfo = styled.span``


export default function ChamadosPage() {

    const chamados = [
        {
            numero: "0001",
            servico: "Transferência de Veículo",
            despachante: "João Silva",
            data: "10/03/2026",
            estado: "Aberto"
        },
        {
            numero: "0002",
            servico: "Licenciamento",
            despachante: "Maria Souza",
            data: "08/03/2026",
            estado: "Em andamento"
        }
    ]

    return (
        <Container>

            <SearchContainer>
                <SearchInput placeholder="Pesquisar por Serviço" />
                <SearchInput placeholder="Pesquisar por Número" />
                <SearchInput placeholder="Pesquisar Data Abertura" />
                <SearchInput placeholder="Pesquisar por Estado" />
            </SearchContainer>

            <ChamadosLista>

                {chamados.map((chamado) => (
                    <Chamado key={chamado.numero}>

                        <ChamadoTitulo>
                            Nº {chamado.numero} - {chamado.servico}
                        </ChamadoTitulo>

                        <ChamadoInfo>
                            {chamado.despachante} - {chamado.data} - {chamado.estado}
                        </ChamadoInfo>

                    </Chamado>
                ))}

            </ChamadosLista>

        </Container>
    )
}
