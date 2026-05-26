import { redirect } from "next/navigation";

/** Legacy route — bookstore was renamed /library. */
export default function BookstoreRedirect() {
  redirect("/library");
}
