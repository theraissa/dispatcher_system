import FormDispatcher from "../../components/record/dispatcher-record/form-dispatcher.tsx"
import Navbar from "../../components/ui/navbar-with-title.tsx";


export default function DispatcherRecord() {
  return (
    <>
      <Navbar title={"Olá, Despachante."} />
      <FormDispatcher />
    </>
  );
}
