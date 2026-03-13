import styled from "styled-components"

const Input = styled.input`
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 18px;
`

export default function InputForm({ type, name, value, onChange, placeholder }) {
    return (
        <>
            <Input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required
            />
        </>
    )
}
