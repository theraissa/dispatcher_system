import FormDispatcher from "../../components/record/dispatcher-record/form-dispatcher.tsx";
import Navbar from "../../components/record/ui/navbar-with-title.tsx";


export default function DispatcherRecord() {
  return (
    <div className="min-h-screen bg-[#F3EDE2] flex flex-col">
      <Navbar title={"Olá, Despachante."} />
      <FormDispatcher />
    </div>
  );
}
