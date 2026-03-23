import styled from "styled-components";


const Card = styled.div`
  background: white;
  padding: 32px;
  border-radius: 20px;
  width: 100%;
  max-width: 800px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  gap: 24px;
`


export default function ProfileCard({ children }) {

    return (
        <Card>
            {children}
        </Card>
    );
}
