import styled from "styled-components"


const Form = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 40px;
  margin-top: 50px;
  flex-wrap: wrap;
`

export default function FormsContainer({ children }) {

    return (
        <Form>
            {children}
        </Form>
    )
}
