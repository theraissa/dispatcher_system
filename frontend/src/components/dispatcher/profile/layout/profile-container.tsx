import styled from "styled-components";


const Container = styled.div`
  display: flex;
  justify-content: center;
  padding: 40px 20px;
  min-height: 100vh;
`;


export default function ProfileContainer({ children }) {

    return (
        <Container>
            {children}
        </Container>
    );
}
