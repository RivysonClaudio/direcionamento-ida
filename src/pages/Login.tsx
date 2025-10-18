import { Form } from "react-router-dom";

function Login() {
  return (
    <div className="flex justify-center items-center gap-2 w-screen h-screen p-4 bg-(--blue)">
      <Form
        action="/admin"
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
          className="w-full px-2 py-2.5 bg-neutral-100 rounded-md text-center outline-none"
        />
        <input
          type="password"
          placeholder="Senha"
          className="w-full px-2 py-2.5 bg-neutral-100 rounded-md text-center outline-none"
        />
        <button className="w-full p-2 rounded-md bg-blue-400 text-white">
          Entrar
        </button>
      </Form>
    </div>
  );
}

export default Login;
