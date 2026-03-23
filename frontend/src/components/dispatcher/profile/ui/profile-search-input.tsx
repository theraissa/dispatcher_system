import styled from "styled-components";


const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #d0d5dd;
  outline: none;
  font-size: 16px;
  transition: all 0.2s;
  box-sizing: border-box;

  &:focus {
    border-color: #213555;
    box-shadow: 0 0 0 4px rgba(33, 53, 85, 0.1);
  }
`;

export default function ProfileSearchInput({ value, onChange, placeholder }) {
  return (
    <SearchInput
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
}
