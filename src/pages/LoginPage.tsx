import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCode, FaSpinner } from "react-icons/fa";
import { TbLetterW } from "react-icons/tb";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { loginWithGoogle } from "../service/login.service";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSuccess = async (response: CredentialResponse) => {
    setLoading(true);
    setErrorMessage(null); 
    const idToken = response.credential;

    if (!idToken) {
      setErrorMessage("Não foi possível obter o ID Token do Google.");
      setLoading(false);
      return;
    }

    try {
      const data = await loginWithGoogle(idToken);

      if (data.token) {
        sessionStorage.setItem("token-flix-wrapped", data.token);
        navigate("/dashboard");
      } else {
        setErrorMessage("Erro na autenticação. Tente novamente.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Erro ao autenticar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleError = () => {
    console.error("Erro ao fazer login com o Google");
    setErrorMessage("Erro ao fazer login com o Google.");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-black px-4">
      <div className="w-full max-w-xs sm:max-w-md bg-neutral-900 border rounded-4xl p-8 mx-auto">
        <div className="flex flex-col items-center mb-4">
          <div
            className="flex items-center text-2xl font-bold text-red-700 cursor-pointer"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Flix<span className="ml-2"><TbLetterW size={34} /></span>rapped
          </div>
        </div>

        {errorMessage && (
          <div className="text-red-600 text-sm text-center mt-2">
            {errorMessage}
          </div>
        )}
        <div className="flex justify-center">
          {loading && (
            <FaSpinner
              size={24}
              className="text-red-700 animate-spin absolute"
            />
          )}
        </div>

        <div className={`flex justify-center ${loading ? 'mt-10' : 'mt-2'} relative`}>
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            type="standard"
            shape="circle"
            theme="outline"
            size="large"
            width="48"
          />
        </div>
      </div>

      <footer className="mt-6 flex justify-center items-center text-white">
        <FaCode className="text-red-700 mr-2" />
        <a
          href="https://github.com/ramonjoaquim"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          @ramonjoaquim
        </a>
      </footer>
    </div>
  );
};

export default LoginPage;
