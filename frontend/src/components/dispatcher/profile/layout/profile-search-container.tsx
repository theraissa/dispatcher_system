import styled from "styled-components";


const SearchContainer = styled.div`
  position: relative;
  width: 100%;
`;


export default function ProfileSearchContainer({ children }) {

    return (
        <SearchContainer>
            {children}
        </SearchContainer>
    );
}
