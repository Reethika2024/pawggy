import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  const { userId } = await auth();

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div>
        <h1 className="text-4xl font-bold">🐾 Pawggy</h1>
        <p>User ID: {userId ?? "Not signed in"}</p>
      </div>
    </main>
  );
}