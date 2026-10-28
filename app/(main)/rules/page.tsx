import { redirect } from "next/navigation";

/** The comp navigation uses /methodology — keep the old slug working. */
export default function RulesPage() {
  redirect("/methodology");
}
