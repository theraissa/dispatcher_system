import styled from "styled-components";


const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #667085;
  border: 2px dashed #eaecf0;
  border-radius: 12px;
`;


export default function ProfileEmptyState({ children }) {

    return (
        <EmptyState>
            {children}
        </EmptyState>
    );
}
