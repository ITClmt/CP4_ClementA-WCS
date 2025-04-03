import { useState } from "react";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <section className="min-h-screen bg-gradient-to-br from-indigo-100 to-white flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      {isLogin ? <LoginForm /> : <SignupForm />}
      <button
        type="button"
        onClick={() => setIsLogin(!isLogin)}
        className="mt-4 text-sm text-gray-500 hover:text-gray-700"
      >
        {isLogin ? "Créer un compte" : "Se connecter"}
      </button>
    </section>
  );
}
