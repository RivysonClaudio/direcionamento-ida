import { useNavigate } from "react-router-dom";
import { type FormEvent, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import DatabaseService from "../../services/database/DatabaseService";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const database = new DatabaseService();

  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_KEY
  );

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.session) {
        localStorage.setItem("authToken", data.session.access_token);

        const userInfo = await database.get_profissional_by_userid(
          data.session.user.id
        );
        if (userInfo) {
          localStorage.setItem("user", userInfo.nome);
        }

        navigate("/admin");
      }
    } catch (err) {
      setError("Erro ao fazer login. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center gap-2 w-screen h-dvh p-4 bg-(--blue)">
      <form
        onSubmit={handleLogin}
        className="bg-white rounded-md w-screen flex flex-col items-center p-4 max-w-md shadow-md shadow-neutral-500 gap-4"
      >
        <img
          src="ida-icon.png"
          alt="Instituto do Autismo Logo"
          className="w-25"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-2 py-2.5 bg-neutral-100 rounded-md text-center outline-none"
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-2 py-2.5 bg-neutral-100 rounded-md text-center outline-none"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 rounded-md bg-blue-400 text-white disabled:opacity-50"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
        <p className="text-sm text-center text-gray-600">
          Ainda não possui uma conta? Contate o suporte.
        </p>
      </form>
    </div>
  );
}

export default Login;
