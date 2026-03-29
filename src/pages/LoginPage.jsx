import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

const LoginPage = () => {
  const { login } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData);
  };

  return (
    <div className="h-screen flex">

      {/* LEFT SIDE (FORM) */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-base-100">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm space-y-4"
        >
          <h2 className="text-2xl font-semibold text-center">
            Login
          </h2>

          <input
            type="email"
            placeholder="Email"
            className="input input-bordered w-full"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="input input-bordered w-full"
            value={formData.password}
            onChange={(e) =>
              setFormData({
                ...formData,
                password: e.target.value,
              })
            }
          />

          <button className="btn btn-primary w-full">
            Login
          </button>

          <p className="text-sm text-center">
            No account?{" "}
            <a href="/signup" className="text-primary">
              Signup
            </a>
          </p>
        </form>
      </div>

      {/* right image */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-base-200">
        <img
          src="/login.png"
          alt="login"
          className="max-w-md w-full object-contain animate-pulse "
        />
      </div>

    </div>
  );
};

export default LoginPage;