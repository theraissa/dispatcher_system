import { useState } from "react"
import styled from "styled-components"

const Card = styled.div`
  background: white;
  padding: 25px;
  border-radius: 10px;
  max-width: 600px;
`

const ServiceItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`

const Button = styled.button`
  background-color: #213555;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 6px;
  cursor: pointer;
`

export default function ProfileServices() {

    const [services, setServices] = useState([
        "Transferência de veículo",
        "Licenciamento",
        "Emplacamento"
    ])

    return (
        <Card>

            {services.map((service, index) => (
                <ServiceItem key={index}>
                    {service}
                    <Button>Remover</Button>
                </ServiceItem>
            ))}

            <Button>Adicionar Serviço</Button>

        </Card>
    )
}
