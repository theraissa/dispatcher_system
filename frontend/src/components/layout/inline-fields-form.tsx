import styled from "styled-components"

export const InlineFields = styled.div`
  display: flex;
  gap: 20px;
  width: 100%;
`

export default function InlineFieldsForm({ children }) {
    return (
        <InlineFields>
            {children}
        </InlineFields>
    )
}
