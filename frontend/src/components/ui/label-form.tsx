import styled from "styled-components"

const Label = styled.label`
  font-size: 18px;
  margin-top: 20px;
  font-weight: bold;
`

export default function LabelForm({ title }) {

    return (
        <>
            <Label>{title}</Label>
        </>
    )
}
