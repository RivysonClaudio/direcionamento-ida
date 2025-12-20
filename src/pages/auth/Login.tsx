import { useNavigate } from "react-router-dom";
import { type FormEvent, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Eye, EyeOff } from "lucide-react";
import DatabaseService from "../../services/database/DatabaseService";
import Util from "../../util/util";
import { mostrarNotificacao } from "../../util/notificacao";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(() => {
    return localStorage.getItem("rememberedEmail") || "";
  });
  const [password, setPassword] = useState(() => {
    return localStorage.getItem("rememberedPassword") || "";
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    return localStorage.getItem("rememberMe") === "true";
  });
  const database = new DatabaseService();

  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_KEY
  );

  const inputRef = useRef(null);

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

        // Salvar credenciais se "lembrar de mim" estiver marcado
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
          localStorage.setItem("rememberedPassword", password);
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("rememberedEmail");
          localStorage.removeItem("rememberedPassword");
          localStorage.removeItem("rememberMe");
        }

        const userInfo = await database.get_profissional_by_userid(
          data.session.user.id
        );

        if (userInfo) {
          localStorage.setItem("user", userInfo.nome);

          if (userInfo?.role == "ADMIN") {
            navigate("/admin");
          }
          if (userInfo?.role == "MEMBER") {
            navigate(`/member/${userInfo.id}/agenda`);
          }
        }
      }
    } catch (err) {
      setError("Erro ao fazer login. Tente novamente.");
      mostrarNotificacao(
        "Erro ao fazer login. Tente novamente. " + err,
        "error"
      );
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
          ref={inputRef}
          onFocus={() => Util.handleFocus(inputRef)}
        />
        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-2 py-2.5 bg-neutral-100 rounded-md text-center outline-none pr-10"
            ref={inputRef}
            onFocus={() => Util.handleFocus(inputRef)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <div className="flex items-center w-full gap-2">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <label
            htmlFor="rememberMe"
            className="text-sm text-neutral-700 cursor-pointer"
          >
            Lembrar de mim
          </label>
        </div>
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
