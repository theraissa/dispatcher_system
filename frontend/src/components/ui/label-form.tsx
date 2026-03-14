import styled from "styled-components"

const Label = styled.label`
  display: block;
  font-size: 16px;
  text-align: left;
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
