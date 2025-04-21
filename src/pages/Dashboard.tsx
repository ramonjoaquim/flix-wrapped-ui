import React, { useState, useEffect } from "react";
import { getInsights } from "../service/insight.service";
import { FaFilm, FaTv, FaLock, FaLockOpen, FaCode, FaInfoCircle } from "react-icons/fa";
import { TbRefresh } from "react-icons/tb";


// Definindo os tipos conforme a estrutura da resposta
type InsightData = {
  insightType: string;
  message: string;
  data: MostWatchedTypeData | MostWatchedByYearData | MostWatchedSeriesData | LastWatchedData;
};

type MostWatchedTypeData = {
  movies: number;
  series: number;
};

type MostWatchedByYearData = {
  yearlyData: Array<{
    year: number;
    moviesCount: number;
    episodesCount: number;
    moviesTitles: string[];
    seriesTitles: string[];
  }>;
};

type MostWatchedSeriesData = {
  topSeries: Array<{
    urlPoster: string;
    title: string;
    episodesCount: number;
  }>;
};

type LastWatchedData = {
  contentDetails: Array<{
    urlPoster: string;
    title: string;
    type: string;
    dateWatched: string;
  }>;
};

const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(true);

  const [data, setData] = useState({ movies: 0, series: 0 });
  const [yearlyData, setYearlyData] = useState<Array<{
    year: number;
    movies: number;
    series: number;
    movieTitles: string[];
    seriesTitles: string[];
  }>>([]);
  const [expandedYear, setExpandedYear] = useState<number | null>(null);

  const [topSeries, setTopSeries] = useState<Array<{
    title: string;
    episodesCount: number;
    posterUrl: string;
  }>>([]);

  const [lastContent, setLastContent] = useState<Array<{
    title: string;
    type: string;
    dateWatch: string;
    posterUrl: string;
  }>>([]);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const userId: any = localStorage.getItem('userId-flix-wrapped');

      const insights: InsightData[] = await getInsights(userId, true);
      // Totais de filmes e séries
      const movies = insights.reduce((acc, item) => {
        if (item?.insightType === "MOST_WATCHED_TYPE" && item.data) {
          const data = item.data as MostWatchedTypeData;  // Casting para o tipo correto
          return acc + data.movies;
        }
        return acc;
      }, 0);
      const series = insights.reduce((acc, item) => {
        if (item?.insightType === "MOST_WATCHED_TYPE" && item.data) {
          const data = item.data as MostWatchedTypeData;  // Casting para o tipo correto
          return acc + data.series;
        }
        return acc;
      }, 0);
      setData({ movies, series });

      // Dados por ano (MOST_WATCHED_BY_YEAR)
      const byYear = insights
        .filter(i => i?.insightType === "MOST_WATCHED_BY_YEAR" && i.data)
        .flatMap(i => (i.data as MostWatchedByYearData).yearlyData.map(yearData => ({
          year: yearData.year,
          movies: yearData.moviesCount || 0,
          series: yearData.episodesCount || 0,
          movieTitles: yearData.moviesTitles || [],
          seriesTitles: yearData.seriesTitles || []
        })));
      setYearlyData(byYear);

      // Top séries (MOST_WATCHED_SERIES)
      const top = insights
        .filter(i => i?.insightType === "MOST_WATCHED_SERIES" && i.data)
        .flatMap(i => (i.data as MostWatchedSeriesData).topSeries.map(series => ({
          title: series.title || "Série Desconhecida",
          episodesCount: series.episodesCount || 0,
          posterUrl: series.urlPoster || "https://via.placeholder.com/150"
        })))
        .slice(0, 5); // Limita a 5 top séries
      setTopSeries(top);

      // Últimos assistidos (LAST_WATCHED)
      const recent = insights
        .filter(i => i?.insightType === "LAST_WATCHED" && i.data)
        .flatMap(i => (i.data as LastWatchedData).contentDetails.map(content => ({
          title: content.title || "Título Desconhecido",
          type: content.type || "Desconhecido",
          dateWatch: content.dateWatched || "Data Não Informada",
          posterUrl: content.urlPoster || "https://via.placeholder.com/150"
        })));
      setLastContent(recent);
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Conteúdo principal */}
      <main className="flex-grow md:px-8 px-2 py-6">
        {/* Cabeçalho e botão de controle */}
        <div className="flex flex-wrap items-center justify-between mb-4">
          <h2
            className="text-xl font-semibold flex items-center space-x-2"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            <span>Bem-vindo ao Flix Wrapped!</span>
          </h2>
          <div className="flex gap-1">
          <button
            className="bg-neutral-900 text-white p-2 rounded-full shadow-md hover:bg-neutral-800 transition flex items-center space-x-2 mt-2 md:mt-0 cursor-pointer"
            onClick={() => setIsLocked(!isLocked)}
          >
            {isLocked && <FaLockOpen className='text-red-800' />}
            {!isLocked && <FaLock className='text-red-800' />}
            <span className="text-xs" style={{ fontFamily: "Poppins, sans-serif" }}>
              {isLocked ? "Desbloquear" : "Bloquear"}
            </span>
          </button>
          {
            !isLocked && <button
            className="bg-neutral-900 text-white p-2 rounded-full shadow-md hover:bg-neutral-800 transition flex items-center space-x-2 mt-2 md:mt-0 cursor-pointer"
            onClick={() => fetchData()}
          >
            <TbRefresh className='text-red-800' />
            <span className="text-xs" style={{ fontFamily: "Poppins, sans-serif" }}>
              Atualizar
            </span>
          </button>
          }
          </div>
        </div>


        <p style={{ fontFamily: "Poppins, sans-serif" }}>
          🎉 Aqui estão seus dados e métricas mais recentes. Realize o upload para desbloquear os insights.
        </p>

        {/* Container de Cards em estilo masonry */}
        <div className="columns-1 md:columns-2 gap-6 mt-8">
          {/* Card 1: Filmes x Séries */}
          <div className="break-inside-avoid mb-6">
            <div
              className={`relative bg-gradient-to-br from-red-900 to-neutral-950 p-6 rounded-2xl shadow-lg flex flex-col ${isLocked ? "blur-sm pointer-events-none" : "blur-0"
                }`}
            >
              {isLoading ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-red-600 border-opacity-75 mb-4"></div>
                  <span style={{ fontFamily: "Poppins, sans-serif" }}>Carregando...</span>
                </div>
              ) : (
                <>
                  {/* Título no canto esquerdo superior */}
                  <div className="absolute top-4 left-4 bg-neutral-900 opacity-80 text-white text-sm font-semibold rounded-3xl px-4 py-2" style={{ fontFamily: "Poppins, sans-serif" }}>
                    Tudo que você assistiu
                  </div>

                  {/* Conteúdo Central: Totalizadores */}
                  <div className="flex flex-row items-center justify-center space-x-6 md:space-x-16 mt-12">
                    {/* Filmes */}
                    <div className="flex flex-col items-center">
                      <div className="flex items-center justify-center w-16 h-16 bg-red-900 rounded-full mb-2">
                        <FaFilm className="text-white text-3xl" />
                      </div>
                      <span className="text-5xl font-bold text-white">{data.movies}</span>
                      <span className="text-lg font-medium text-white">Filmes</span>
                    </div>

                    {/* Séries */}
                    <div className="flex flex-col items-center">
                      <div className="flex items-center justify-center w-16 h-16 bg-red-900 rounded-full mb-2">
                        <FaTv className="text-white text-3xl" />
                      </div>
                      <span className="text-5xl font-bold text-white">{data.series}</span>
                      <span className="text-lg font-medium text-white">Séries</span>
                    </div>
                  </div>

                </>
              )}
            </div>
          </div>




          {/* Card 2: Consumo por Ano (com expansão interna) */}
          <div className="break-inside-avoid mb-6">
            <div
              className={`bg-neutral-900 p-6 rounded-2xl shadow-lg flex flex-col items-left justify-start relative ${isLocked ? "blur-sm pointer-events-none" : "blur-0"
                }`}
            >
              {isLoading ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-red-600 border-opacity-75 mb-4"></div>
                  <span style={{ fontFamily: "Poppins, sans-serif" }}>
                    Carregando...
                  </span>
                </div>
              ) : (
                <>
                  <h3
                    className="text-xl md:text-2xl font-bold mb-4 md:mb-8"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Consumo por Ano
                  </h3>
                  <div className="space-y-6 w-full">
                    {yearlyData.length > 0 && yearlyData.sort((a, b) => b.year - a.year).map((item) => (
                      <div
                        key={item.year}
                        className="bg-neutral-800 p-4 rounded-lg mb-4"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-neutral-100 bg-red-900 rounded-lg p-2">
                            {item.year}
                          </span>
                          <span className="text-white text-sm cursor-pointer"
                          onClick={() =>
                            setExpandedYear(expandedYear === item.year ? null : item.year)
                          }>
                            {expandedYear === item.year ? "Recolher ▲" : "Expandir ▼"}
                          </span>
                        </div>
                        <div className="flex justify-center mt-4 space-x-4 flex-wrap">
                            <div className="flex flex-col items-center justify-center w-full sm:w-30 h-20 bg-neutral-900 rounded-md mb-1 m-1 px-4 py-2">
                              <span className="text-4xl font-bold text-red-900">{item.movies}</span>
                              <span className="ml-2 text-sm font-medium text-white">Filmes</span>
                            </div>

                            <div className="flex flex-col items-center justify-center w-full sm:w-30 h-20 bg-neutral-900 rounded-md mb-1 m-1 px-4 py-2">
                              <span className="text-4xl font-bold text-red-900">{item.series}</span>
                              <span className="ml-2 text-sm font-medium text-white">Séries</span>
                            </div>
                          </div>


                        {expandedYear === item.year && (
                          <div className="mt-4 max-h-100 overflow-y-auto">
                            <table className="w-full text-sm text-neutral-300 border-collapse border-separate border-spacing-x-1 border-spacing-y-1">
                              <thead>
                                <tr>
                                  <th className="border-b border-neutral-600 pb-2 text-left text-white">
                                    Filmes
                                  </th>
                                  <th className="border-b border-neutral-600 pb-2 text-left text-white">
                                    Séries
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {(() => {
                                  const maxRows = Math.max(
                                    item.movieTitles.length,
                                    item.seriesTitles.length
                                  );
                                  return Array.from({ length: maxRows }, (_, i) => (
                                    <tr key={i}>
                                      <td className="pt-2 text-sm text-neutral-100 bg-neutral-900 rounded-lg p-2">{item.movieTitles[i] || ""}</td>
                                      <td className="pt-2 text-sm text-neutral-100 bg-neutral-900 rounded-lg p-2">{item.seriesTitles[i] || ""}</td>
                                    </tr>
                                  ));
                                })()}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    ))}
                    {
                      yearlyData.length === 0 && (
                        <div className="flex items-center justify-center gap-2 p-4 rounded-lg bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                          <FaInfoCircle className="w-5 h-5 text-white" />
                          <span className="text-sm font-medium text-white">
                            Nenhuma informação coletada ou sem resultados
                          </span>
                        </div>
                      )
                    }
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Card 3: Top 5 Séries Mais Assistidas */}
          <div className="break-inside-avoid mb-6">
            <div
              className={`bg-neutral-900 p-6 rounded-2xl shadow-lg flex flex-col items-left justify-start relative ${isLocked ? "blur-sm pointer-events-none" : "blur-0"
                }`}
            >
              {isLoading ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-red-600 border-opacity-75 mb-4"></div>
                  <span style={{ fontFamily: "Poppins, sans-serif" }}>Carregando...</span>
                </div>
              ) : (
                <>
                  <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-8" style={{ fontFamily: "Poppins, sans-serif" }}>
                    Top 5 Séries Mais Assistidas
                  </h3>
                  {/* Carrossel */}
                  <div className="w-full flex  overflow-x-auto space-x-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
                    {topSeries.map((s, i) => (
                      <div
                        key={i}
                        className="flex-none w-48 bg-neutral-800 p-4 rounded-lg shadow-md flex flex-col items-center"
                      >
                        {/* Imagem de capa simulada */}
                        <img
                          src={`${s.posterUrl}`} // Substitua pela URL real
                          alt={s.title}
                          className="rounded-md mb-4 w-full h-60 object-cover"
                        />
                        <h4 className="text-sm font-semibold text-white mb-2">{s.title}</h4>
                        <span className="text-sm text-neutral-300">Episódios: {s.episodesCount}</span>
                      </div>
                    ))}
                  </div>
                  {
                      topSeries.length === 0 && (
                        <div className="flex items-center justify-center gap-2 p-4 rounded-lg bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                          <FaInfoCircle className="w-5 h-5 text-white" />
                          <span className="text-sm font-medium text-white">
                            Nenhuma informação coletada ou sem resultados
                          </span>
                        </div>
                      )
                    }
                </>
              )}
            </div>
          </div>


          {/* Card 4: Últimos Conteúdos Assistidos */}
          <div className="break-inside-avoid mb-6">
            <div
              className={`bg-gradient-to-br from-red-600 to-neutral-950 p-6 rounded-2xl shadow-lg flex flex-col items-left justify-start relative ${isLocked ? "blur-sm pointer-events-none" : "blur-0"
                }`}
            >
              {isLoading ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-red-600 border-opacity-75 mb-4"></div>
                  <span style={{ fontFamily: "Poppins, sans-serif" }}>
                    Carregando...
                  </span>
                </div>
              ) : (
                <>
                  {/* Título no canto esquerdo superior */}
                  <div className="absolute top-4 left-4 bg-neutral-900 opacity-80 text-white text-sm font-semibold rounded-3xl px-4 py-2 mb-4 md:mb-8" style={{ fontFamily: "Poppins, sans-serif" }}>
                    Últimos Conteúdos Assistidos
                  </div>

                  {/* Carrossel */}
                  <div className="mt-10 w-full flex overflow-x-auto space-x-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
                    {lastContent.map((item, i) => (
                      <div
                        key={i}
                        className="flex-none w-48 bg-neutral-800 p-4 rounded-lg shadow-md flex flex-col items-center"
                      >
                        {/* Imagem de poster simulada */}
                        <img
                          src={`${item.posterUrl}`} // Substitua pela URL real
                          alt={item.title}
                          className="rounded-md mb-4 w-full h-60 object-cover"
                        />
                        <h4 className="text-sm font-semibold text-white mb-2">{item.title}</h4>
                        <span className="text-sm text-red-500 capitalize font-semibold">
                          {item.type.toLowerCase()}
                        </span>
                        <span className="text-sm text-white ">Data: {item.dateWatch}</span>
                      </div>
                    ))}
                  </div>
                  {
                      lastContent.length === 0 && (
                        <div className="flex items-center justify-center gap-2 p-4 rounded-lg bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300">
                          <FaInfoCircle className="w-5 h-5 text-white" />
                          <span className="text-sm font-medium text-white">
                            Nenhuma informação coletada ou sem resultados
                          </span>
                        </div>
                      )
                    }
                </>
              )}
            </div>
          </div>


        </div>
      </main>

      {/* Rodapé */}
      <footer className="mt-6 py-4 flex justify-center items-center text-white">
        <FaCode className="text-red-600 mr-2" />
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

export default Dashboard;
