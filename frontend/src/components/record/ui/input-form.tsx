import styled from "styled-components"

const Input = styled.input`
  width: 100%;
  padding: 9px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  background-color: ${({ readOnly }) => readOnly ? "#f5f5f5" : "white"};
  cursor: ${({ readOnly }) => readOnly ? "not-allowed" : "text"};
`

export default function InputForm({ type, name, value, onChange, placeholder, readOnly }) {
    return (
        <>
            <Input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                readOnly={readOnly}
                required
            />
        </>
    )
}
