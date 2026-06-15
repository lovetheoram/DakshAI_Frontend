// // src/components/auth/LoginModal.jsx
// import React from "react";
// import { X } from "lucide-react";


// export default function LoginModal({ onClose }) {
//   return (
//     <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur flex items-center justify-center">
      
//       <div className="bg-slate-900 rounded-2xl w-full max-w-md p-6 border border-white/10 relative">
        
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-white/60 hover:text-white"
//         >
//           <X />
//         </button>

//         <h2 className="text-xl font-semibold text-white mb-2">
//           Welcome Back
//         </h2>

//         <p className="text-sm text-gray-400 mb-6">
//           Log in to continue tracking your mastery.
//         </p>

//         {/* Your existing login form goes here */}

//       </div>
//     </div>
//   );
// }



// // src/components/auth/LoginModal.jsx
// import { X } from "lucide-react";

// export default function LoginModal({ onClose }) {
//   return (
//     <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur flex items-center justify-center px-4">
//       <div className="bg-slate-900 w-full max-w-sm rounded-2xl p-6 border border-white/10 relative">

//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-white/60 hover:text-white"
//         >
//           <X />
//         </button>

//         <h2 className="text-xl font-semibold text-white mb-1">
//           Welcome Back
//         </h2>

//         <p className="text-sm text-gray-400 mb-6">
//           Log in to continue your journey.
//         </p>

//         {/* LOGIN FORM */}
//         <form className="space-y-4">
//           <input
//             type="email"
//             placeholder="Email"
//             className="w-full px-4 py-2 rounded-lg bg-black border border-white/10 text-white focus:outline-none focus:border-white"
//           />

//           <input
//             type="password"
//             placeholder="Password"
//             className="w-full px-4 py-2 rounded-lg bg-black border border-white/10 text-white focus:outline-none focus:border-white"
//           />

//           <button
//             type="submit"
//             className="w-full py-2.5 rounded-lg bg-white text-black font-semibold hover:bg-gray-200"
//           >
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }



// src/components/auth/LoginModal.jsx
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import authApi from "../../api/authApi";
import { AuthContext } from "../../context/AuthContext";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function LoginModal({ onClose }) {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await authApi.login(form);
      login(res.user, res.tokens);
      onClose();        // close modal
      navigate("/");   // optional redirect
    } catch {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur flex items-center justify-center px-4">
      
      <div className="relative w-full max-w-sm bg-slate-900 rounded-2xl p-6 border border-white/10">
        
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold text-white text-center mb-1">
          Welcome Back
        </h2>
        <p className="text-sm text-gray-400 text-center mb-5">
          Log in to continue tracking your mastery
        </p>

        {error && (
          <p className="text-red-400 text-sm text-center mb-3">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-4">
          <Input
            label="Username"
            name="username"
            value={form.username}
            onChange={update}
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={update}
          />

          <Button onClick={submit} loading={loading}>
            Login
          </Button>
        </div>

        <p className="text-center mt-4 text-xs text-gray-400">
          New here?{" "}
          <span
            className="text-purple-400 cursor-pointer"
            onClick={() => {
              onClose();
              navigate("/signup");
            }}
          >
            Create an account
          </span>
        </p>
      </div>
    </div>
  );
}
