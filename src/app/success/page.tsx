import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center px-6">
      <div className="text-center">
        <div className="animate-scale-in">
          <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6 drop-shadow-lg" />
        </div>
        <div className="animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Paiement réussi !</h1>
          <p className="text-xl text-gray-300 mb-8">
            Merci pour votre achat. Votre transaction a été traitée avec succès.
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg shadow-blue-500/50"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

