"use client";
import { useParams } from "next/navigation";
import JoinLobbyForm from "../../../components/forms/join-lobby-form";

export default function JoinPage() {
  const params = useParams();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Congresso Simulator 👁️</h1>

      <div className="w-full max-w-md space-y-4">
        <JoinLobbyForm 
          initialValues={{
            code: params.id as string,
          }}
          focus
        />
      </div>

      <footer className="mt-8 text-center text-sm text-gray-500">
        <p>&copy; 2025 Congresso Simulator. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
