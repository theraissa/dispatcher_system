import styled from "styled-components"

export const Button = styled.button`
  background-color: #333;
  color: white;
  padding: 8px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin: 10px auto 50px auto;
  width: 40%;
  font-size: 16px;
  font-weight: bold;
`


export default function ButtonAppendForm({ title }) {
    return (
        <>
            <Button type="button">{title}</Button>
        </>
    )
}
