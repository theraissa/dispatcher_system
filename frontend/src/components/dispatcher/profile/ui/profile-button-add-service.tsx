import styled from "styled-components";

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  background-color: #213555;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background-color: #1a2a44;
    box-shadow: 0 4px 12px rgba(33, 53, 85, 0.25);
  }
`;


export default function ButtonAddService({ onClick, children }) {
    return (
        <Button onClick={onClick}>{children}</Button>
    );
}
