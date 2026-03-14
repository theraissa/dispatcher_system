import styled from "styled-components"

const Form = styled.form`
  display: flex;
  flex-direction: column;
`

export default function FormSubmit({ onSubmit = undefined, children }) {
    return (
        <Form onSubmit={onSubmit}>
            {children}
        </Form>
    )
}
