// app/page.tsx
import { createClient } from "../lib/server";
import { AppClient } from "./Appclient";

// This is a SERVER COMPONENT. It is async and has NO hooks.
export default async function HomePage() {
  const supabase = createClient();
  
  // Fetch the session on the server
  const { data: { session } } = await supabase.auth.getSession();

  // Pass the session data as a prop to the Client Component
  return <AppClient serverSession={session} />;
}