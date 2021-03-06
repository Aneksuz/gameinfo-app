import GameCard from "../components/GameCard";
import Navbar from "../components/Navbar";
import Head from "next/head";
import PageNavigation from "../components/PageNavigation";
import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import Search from "../components/Search";
import GenreMenu from "../components/GenreMenu";
import GameInfo from "../components/GameInfo";

export default function Home() {
  const [games, setGames] = useState([]);

  const [prevPageLink, setPrevPageLink] = useState("");
  const [nextPageLink, setNextPageLink] = useState("");

  const [currentPageNumber, setCurrentPageNumber] = useState(1);

  const [searchUrl, setSearchUrl] = useState("");
  const [filterUrl, setFilterUrl] = useState("&genres=");

  const [genreToggle, setGenreToggle] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const [specificGame, setSpecificGame] = useState("");

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const gameResponse = await fetch(
          "https://api.rawg.io/api/games?key=dc469c23c1bb4c1bbb5d9562b46e5082&platforms=4"
        );
        if (!gameResponse.ok) throw Error("Did not receive games.");
        const games = await gameResponse.json();
        setGames(games.results);
        setPrevPageLink(games.previous);
        setNextPageLink(games.next);
      } catch (err) {
        console.log(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    (async () => await fetchGames())();
  }, []);

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto&family=Rubik&display=swap"
          rel="stylesheet"
        />
      </Head>
      <a id="top"></a>
      <div className="flex flex-col bg-zinc-900">
        <Navbar />
        {specificGame !== "" ? (
          <GameInfo gameId={specificGame} setSpecificGame={setSpecificGame} />
        ) : (
          <div className="">
            <div className="py-8 text-center basis-2/5">
              <h1 className="text-2xl text-slate-50 font-Rubik">Games</h1>
              <h4 className="text-accent text-1xl font-Roboto">
                Featured in May
              </h4>
            </div>
            <Search
              setGames={setGames}
              setPrevPageLink={setPrevPageLink}
              setNextPageLink={setNextPageLink}
              setCurrentPageNumber={setCurrentPageNumber}
              setSearchUrl={setSearchUrl}
              filterUrl={filterUrl}
              genreToggle={genreToggle}
              setGenreToggle={setGenreToggle}
              setIsLoading={setIsLoading}
            />
            {genreToggle && (
              <GenreMenu 
              setGames={setGames}
              setPrevPageLink={setPrevPageLink}
              setNextPageLink={setNextPageLink}
              setCurrentPageNumber={setCurrentPageNumber}
              searchUrl={searchUrl}
              filterUrl={filterUrl}
              setFilterUrl={setFilterUrl}
              setIsLoading={setIsLoading}
            />
            )}
            <div className="flex items-center justify-center">
              <div className="flex flex-col flex-wrap items-center md:h-[3200px] md:w-[704px] xl:h-[2250px] xl:w-[1056px] 2xl:h-[1670px] 2xl:w-[1408px]">
                {isLoading && <p className="text-accent">Loading Games...</p>}
                {!isLoading && (
                  games.map((game) => (
                    <GameCard key={game.id} game={game} setSpecificGame={setSpecificGame}></GameCard>
                  ))
                )}
              </div>
            </div>
            <PageNavigation
              prevPageLink={prevPageLink}
              setPrevPageLink={setPrevPageLink}
              nextPageLink={nextPageLink}
              setNextPageLink={setNextPageLink}
              setGames={setGames}
              currentPageNumber={currentPageNumber}
              setCurrentPageNumber={setCurrentPageNumber}
            />
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
