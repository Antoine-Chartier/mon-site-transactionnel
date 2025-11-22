"use client";

import { useState } from "react";
import { createCheckoutSession } from "@/app/actions";

interface BuyButtonProps {
  price: number;
  name: string;
  description: string;
  isPopular?: boolean;
}

export function BuyButton({ price, name, description, isPopular = false }: BuyButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleBuy = async () => {
    setLoading(true);
    try {
      const result = await createCheckoutSession(price, name, description);
      
      if (result.url) {
        window.location.href = result.url;
      } else if (result.error) {
        console.error("Erreur:", result.error);
        alert(`Erreur lors de la création de la session de paiement: ${result.error}`);
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Une erreur est survenue lors du processus de paiement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleBuy}
      disabled={loading}
      className={`w-full py-3 rounded-lg transition-all font-semibold ${
        isPopular
          ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
          : "border border-gray-600 hover:border-blue-500 hover:bg-gray-700 disabled:opacity-50"
      }`}
    >
      {loading ? "Chargement..." : `Acheter ${name}`}
    </button>
  );
}

