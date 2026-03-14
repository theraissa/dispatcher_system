import styled from "styled-components"

export const InlineField = styled.div`
  flex: 1;
`
export default function InlineFieldForm({ children }) {
    return (
        <InlineField>
            {children}
        </InlineField>
    )
}
