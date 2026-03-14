import styled from "styled-components"


export const Title = styled.h3`
  font-size: 25px;
  text-align: center;
  padding: 15px;
`

export default function TitleForm({ title }) {

    return (
        <Title>{title}</Title>
    )
}
