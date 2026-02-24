export default function Login() {
  const handleSubmit = (e: React.FormEvent) => {
    console.log("submit, todo: implement login logic");
    e.preventDefault();
  };

  return (
    <div className="w-full min-h-screen bg-gray-800 flex items-center justify-center p-8">
      <div className="w-full max-w-75 min-h-25 aspect-3/4 bg-white rounded-2xl p-8 flex flex-col items-center justify-center gap-8">
        <p className="text-3xl">Sign in</p>

        <form className="flex flex-col w-full h-full" onSubmit={handleSubmit}>
          {" "}
          <label className="text-xs"> Email </label>
          <input
            className="border border-gray-300 rounded-md p-2 text-sm"
            required
            type="email"
          />
          <label className="text-xs"> Password </label>
          <input
            className="border border-gray-300 rounded-md p-2 text-sm"
            required
            type="password"
          />
          <button
            className="bg-blue-500 text-white rounded-md p-2 mt-auto"
            type="submit"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
