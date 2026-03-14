import styled from "styled-components"

const Section = styled.section`
  width: 700px;
  max-width: 100%;
  background-color: white;
  padding: 50px;
  border-radius: 15px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
`

export default function SectionForm({ children }) {
    return (
        <Section>
            {children}
        </Section>
    )
}
