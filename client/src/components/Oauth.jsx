import React from "react";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import toast from "react-hot-toast";
import { app } from "../../firebase";
import { useDispatch } from "react-redux";
import { signInFail, signInSuccess } from "../state/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function Oauth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(signInFail);
        throw new Error(data.message);
      }

      dispatch(signInSuccess(data));
      toast.success("Successfully signed In");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <button
      onClick={handleClick}
      type="button"
      className="bg-white p-2 border-slate-700 border-2  rounded-lg flex justify-center items-center gap-3"
    >
      <FcGoogle className="text-2xl" />
      Continue with Google
    </button>
  );
}
