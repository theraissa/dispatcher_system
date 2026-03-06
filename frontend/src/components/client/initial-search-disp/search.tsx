import styled from "styled-components"

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
`

const SearchInput = styled.input`
  padding: 8px;
  width: 250px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 12px;
`

export default function Search() {
  return (
    <SearchContainer>
      <SearchInput
        type="text"
        placeholder="Pesquisar por Despachantes"
      />
      <SearchInput
        type="text"
        placeholder="Informar o Município"
      />
    </SearchContainer>
  )
}
