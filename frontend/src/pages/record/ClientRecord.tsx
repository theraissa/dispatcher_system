import HeaderClient from "../../components/record/client-record/HeaderClient.tsx"
import CardInfo from "../../components/record/client-record/CardInfo.tsx"
import FormClient from "../../components/record/client-record/FormClient.tsx"
import "../../styles/client-record.css"

export default function ClientRecord() {
  return (
    <>
      <HeaderClient />
      <main>
        <CardInfo />
        <FormClient />
      </main>
    </>
  );
}
