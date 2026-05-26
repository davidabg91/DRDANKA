import { redirect } from "next/navigation";

/** Legacy route — moved to /live. */
export default function TrainingsRedirect() {
  redirect("/live");
}
