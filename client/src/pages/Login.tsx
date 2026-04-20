import { useAuth } from "@/auth/useAuth";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="w-full min-h-screen bg-gray-800 flex items-center justify-center p-8">
      <div className="w-full max-w-75 min-h-25 aspect-3/4 bg-white rounded-2xl p-8 flex flex-col items-center justify-center gap-8">
        <h1 className="text-3xl cursor-default">Sign in</h1>

        <form className="flex flex-col w-full h-full" onSubmit={handleSubmit}>
          <label className="text-xs" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            className="border border-gray-300 rounded-md p-2 text-sm hover:border-black"
            required
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className="text-xs" htmlFor="password">
            {" "}
            Password{" "}
          </label>
          <input
            id="password"
            className="border border-gray-300 rounded-md p-2 text-sm hover:border-black"
            required
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white rounded-md p-2 mt-auto hover:bg-blue-800 cursor-pointer"
            type="submit"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
