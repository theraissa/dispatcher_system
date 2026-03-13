import styled from "styled-components"

const LoginSection = styled.section`
  width: 40%;
  background-color: white;
  padding: 50px;
  border-radius: 15px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
`

export default function SectionForm({ onSubmit, children }) {
    return (
        <LoginSection>
            <Form onSubmit={onSubmit}>
                {children}
            </Form>
        </LoginSection>
    )
}
