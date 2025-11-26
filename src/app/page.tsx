import { Sparkles, LogIn, Check } from "lucide-react";
import { TestLoginButton } from "./components/TestLoginButton";
import { BuyButton } from "./components/BuyButton";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("price", { ascending: true });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Test Login Button */}
      <div className="container mx-auto px-6 pt-4">
        <TestLoginButton />
      </div>

      {/* Navbar */}
      <nav className="container mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-blue-400" />
          <span className="text-xl font-bold">VibeCoding</span>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 hover:bg-blue-700 transition-colors">
          <LogIn className="w-4 h-4" />
          Login
        </button>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Transformez vos idées en réalité
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
          La plateforme transactionnelle qui propulse votre business vers de nouveaux sommets
        </p>
        <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg shadow-blue-500/50">
          Commencer maintenant
        </button>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-6 py-24">
        <h2 className="text-4xl font-bold text-center mb-16">Choisissez votre plan</h2>
        
        {error ? (
          <div className="text-center text-red-400">
            <p>Erreur lors du chargement des produits : {error.message}</p>
          </div>
        ) : !products || products.length === 0 ? (
          <div className="text-center text-gray-400">
            <p>Aucun produit disponible pour le moment.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {products.map((product, index) => {
              const isPopular = index === 1; // Mettre en évidence le 2ème produit
              const price = typeof product.price === 'number' 
                ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'CAD' }).format(product.price)
                : product.price;
              
              return (
                <div
                  key={product.id}
                  className={`rounded-xl p-8 border transition-all ${
                    isPopular
                      ? 'bg-gradient-to-b from-blue-900 to-gray-800 border-2 border-blue-500 hover:border-blue-400 transform hover:scale-105 shadow-lg shadow-blue-500/20'
                      : 'bg-gray-800 border-gray-700 hover:border-blue-500'
                  }`}
                >
                  {isPopular && (
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-3 py-1 bg-blue-500 rounded-full text-sm font-semibold">Populaire</span>
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{price}</span>
                    {product.price && typeof product.price === 'number' && (
                      <span className="text-gray-400">/mois</span>
                    )}
                  </div>
                  {product.description && (
                    <p className="text-gray-300 mb-8 min-h-[60px]">{product.description}</p>
                  )}
                  <BuyButton
                    price={typeof product.price === 'number' ? product.price : 0}
                    name={product.name}
                    description={product.description || ''}
                    isPopular={isPopular}
                  />
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
