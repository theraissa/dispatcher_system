import styled from "styled-components";


const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;


export default function ProfileCardHeader({ children }) {

  return (
    <Header>
      {children}
    </Header>
  );
}
