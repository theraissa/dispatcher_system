import {Main, Form, Container, SubmitButton} from "./form-dispatcher/form-dispatcher.styles"
import FormCommercial from "./form-dispatcher/form-commercial";
import FormPersonal from "./form-dispatcher/form-personal";


export default function FormDispatcher() {
  return (
    <Main>
      <Form>
        <Container>
          <FormPersonal />
          <FormCommercial />
        </Container>
        <SubmitButton type="submit">Enviar</SubmitButton>
      </Form>
    </Main>
  )
}
