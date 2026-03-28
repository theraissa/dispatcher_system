import CardInfo from "../../components/record/client-record/card-info"
import Navbar from "../../components/record/ui/navbar-with-title"
import { FormClient } from "../../components/record/client-record/form-client"

export default function ClientRecord() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F3EDE2]">
      <Navbar title="Olá, Cliente." />

      {/* Container principal com espaçamento responsivo */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center px-8 lg:px-20 py-12 gap-16 lg:gap-32">
        <CardInfo />
        <FormClient />
      </main>
    </div>
  )
}
