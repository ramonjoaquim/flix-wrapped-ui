import React, { useState } from "react";
import { FaCode, FaFileUpload, FaTrash, FaSpinner } from "react-icons/fa";
import { TbBrandNetflix } from "react-icons/tb";
import { checkUploadStatus, uploadCsv, deleteHistory } from "../service/upload.service";

const Upload: React.FC = () => {
  const [isTutorialExpanded, setTutorialExpanded] = useState(true);
  const [fileName, setFileName] = useState<string | null>(null);
  const [, setUploadId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [removeInProgress, setRemoveInProgress] = useState(false);
  const [removeStatus, setRemoveStatus] = useState<string | null>(null);

  let interval: ReturnType<typeof setInterval>;

  const checkStatus = async (id: string) => {
    try {
      const res = await checkUploadStatus(id);
      const newStatus = res.status;
      setStatus(newStatus);

      if (newStatus === "COMPLETED" || newStatus === "ERROR") {
        clearInterval(interval);
        setUploading(false);
      }
    } catch (err) {
      console.error("Erro ao verificar status:", err);
      clearInterval(interval);
      setUploading(false);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setUploading(true);
    setStatus(null);

    const userIdUserLogged = sessionStorage.getItem("userId-flix-wrapped") ?? "";
    try {
      const idUpload = await uploadCsv(file, userIdUserLogged);
      if (idUpload) {
        setUploadId(idUpload);
        interval = setInterval(() => checkStatus(idUpload), 1000);
      }
    } catch (err) {
      console.error("Erro no upload:", err);
      setUploading(false);
      setStatus('ERROR')
    }
  };

  const handleRemoveAll = async () => {
    setRemoveInProgress(true);
    setRemoveStatus(null);
    const userId = sessionStorage.getItem("userId-flix-wrapped");
    if (!userId) {
      setRemoveStatus("Usuário não identificado.");
      setRemoveInProgress(false);
      return;
    }
    try {
      await deleteHistory()
      setRemoveStatus("Todos os seus dados foram removidos com sucesso.");
    } catch (err) {
      console.error("Erro ao remover dados:", err);
      setRemoveStatus("Erro ao remover os dados. Tente novamente.");
    } finally {
      setRemoveInProgress(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <main className="flex-grow px-8 py-6">
        <h2
          className="text-xl font-semibold mb-4 flex items-center space-x-2"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          <span>Envie seu histórico da Netflix</span>
          <TbBrandNetflix className="text-red-700" />
        </h2>

        {/* Tutorial */}
        <div className="bg-neutral-900 p-4 rounded-2xl shadow-lg mb-8">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setTutorialExpanded(!isTutorialExpanded)}
          >
            <h3
              className="text-sm font-bold text-white"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Como recuperar o histórico
            </h3>
            <span className="text-neutral-100 text-sm">
              {isTutorialExpanded ? "Recolher ▲" : "Expandir ▼"}
            </span>
          </div>
          {isTutorialExpanded && (
            <ol className="list-decimal list-inside space-y-2 mt-4 text-sm text-gray-300">
              <li>Acesse sua conta Netflix e faça login.</li>
              <li>Vá para <b>"Conta"</b> e clique no perfil desejado.</li>
              <li>Encontre a opção <b>"O que foi assistido"</b> e clique.</li>
              <li>Baixe o arquivo CSV no final da página.</li>
            </ol>
          )}
        </div>

        {/* Upload Card */}
        <div className="bg-neutral-900 p-6 rounded-2xl shadow-lg mb-8">
          <div className="flex justify-center">
            <label
              htmlFor="csv-upload"
              className="flex items-center space-x-2 cursor-pointer bg-red-800 text-white p-3 rounded-lg hover:bg-gray-700 transition"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              <FaFileUpload />
              <span>Escolher Arquivo CSV</span>
            </label>
            <input
              type="file"
              id="csv-upload"
              accept=".csv"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {fileName && (
            <p
              className="text-sm text-center text-gray-400 mt-4"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Arquivo selecionado: <span className="text-white">{fileName}</span>
            </p>
          )}

          {uploading && (
            <div className="mt-6">
              <p
                className="text-sm text-center text-white mb-2"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Upload em progresso...
              </p>
              <div className="w-full bg-neutral-700 rounded-full h-2 overflow-hidden relative">
                <div
                  className="absolute top-0 left-0 h-2 bg-red-700 rounded-full"
                  style={{
                    width: "100%",
                    animation: "marquee 5s ease-in-out infinite",
                  }}
                ></div>
              </div>
              <style>{`
                @keyframes marquee {
                  0% { transform: translateX(-100%); }
                  50% { transform: translateX(100%); }
                  100% { transform: translateX(-100%); }
                }
              `}</style>
            </div>
          )}

          {status === "COMPLETED" && (
            <>
              <p className="text-green-500 text-center mt-4 font-bold">
                Upload concluído com sucesso!
              </p>
              <p className="text-white text-sm text-center mt-2">
                Volte para a tela inicial para ver suas métricas.
              </p>
            </>
          )}

          {status === "ERROR" && (
            <p className="text-red-500 text-center mt-4 font-bold">
              Erro ao processar o arquivo. Tente novamente.
            </p>
          )}
        </div>

        {/* Delete Data Card */}
        <div className="bg-neutral-900 p-6 rounded-2xl shadow-lg mb-8">
          <h3
            className="text-lg font-semibold mb-2"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            <FaTrash className="inline-block mr-2 text-red-500" />
            Remover todos os dados importados
          </h3>
          <p
            className="text-sm text-gray-400 mb-4"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Todo CSV importado expira em <b className="text-red-700">7 dias</b>. Você pode excluir manualmente
            todos os seus dados importados agora.
          </p>
          <button
            onClick={handleRemoveAll}
            disabled={removeInProgress}
            className={`flex items-center justify-center bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition ${
              removeInProgress ? "opacity-50 cursor-not-allowed" : ""
            }`}
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            {removeInProgress ? (
              <FaSpinner className="animate-spin mr-2" />
            ) : (
              "Remover meus dados"
            )}
          </button>
          {removeStatus && (
            <p
              className={`mt-3 text-sm ${
                removeStatus.startsWith("Erro") ? "text-red-500" : "text-green-500"
              }`}
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              {removeStatus}
            </p>
          )}
        </div>
      </main>

      <footer className="mt-6 py-4 flex justify-center items-center text-white">
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

export default Upload;
