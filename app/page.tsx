import AppBar from "@/components/Appbar";
import ListUsers from "@/components/ListUsers";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="mb-8">
      <AppBar />
      </div>
      <ListUsers />
    </main>
  );
}
