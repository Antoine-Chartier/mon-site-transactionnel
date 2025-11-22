"use client";

import { createClient } from "@/utils/supabase/client";

export function TestLoginButton() {
  const handleTest = () => {
    const supabase = createClient();
    console.log("Supabase client:", supabase);
  };

  return (
    <button
      onClick={handleTest}
      className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 transition-colors text-sm font-medium"
    >
      Test Login
    </button>
  );
}

