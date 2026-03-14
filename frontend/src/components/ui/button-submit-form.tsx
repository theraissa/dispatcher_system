import styled from "styled-components"


const Button = styled.button`
  width: 500px;
  margin: 20px auto 0 auto;
  padding: 8px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 18px;

  &:hover {
    background-color: #555;
  }
`

export default function ButtonSubmitForm({ title }) {
  return (
    <>
      <Button type="submit">{title}</Button>
    </>
  )
}
