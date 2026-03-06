import styled from "styled-components"

const CardsContainer = styled.section`
  display: grid;
  width: 70%;
  gap: 20px;
  grid-template-columns: repeat(3, 1fr);
  justify-items: center;
  align-items: center;
  margin: 0 auto;
`

const Card = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  width: 200px;
  height: 220px;
  padding: 10px;
  font-size: 12px;

  &:hover {
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    cursor: pointer;
  }
`

const ImagePlaceholder = styled.div`
  background-color: #e0e0e0;
  height: 150px;
  border-radius: 5px;
`

const Image = styled.img`
  width: 100%;
  height: auto;
`

const DispatcherName = styled.p`
  margin-top: 5px;
  font-weight: 700;
`

export default function CardDispatcher() {
  return (
    <CardsContainer>
      <Card>
        <ImagePlaceholder>
          <Image />
        </ImagePlaceholder>
        <DispatcherName>
          Nome do Despachante
        </DispatcherName>
      </Card>
    </CardsContainer>
  )
}
