import { useState } from "react";
import { CardContainer, CardBody, CardItem } from "./components/ThreeDCard";
import AiReviewCard from "./components/AiReviewCard";

export default function App() {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function scoutProfile() {
    if (username === "") return;
    setIsLoading(true);
    setError(null);
    setUserData(null);

    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      const data = await response.json();

      if (data.message === "Not Found") {
        setError("User not found on GitHub!");
      } else {
        setUserData(data);
      }
    } catch (err) {
      setError("Network error! Check your internet connection.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-slate-950 min-h-screen text-white p-4 sm:p-6 flex flex-col items-center font-sans">
      <h1 className="text-2xl font-bold tracking-tight text-white mb-6 select-none">
        GitHub Profile Scout
      </h1>

      <div className="relative w-full max-w-sm mb-6 group z-10">
        <div className="absolute -inset-1 bg-gradient-to-r from-sky-500/15 via-indigo-500/15 to-purple-500/15 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-500 -z-10 pointer-events-none" />

        <div className="relative flex items-center gap-1.5 p-1.5 bg-slate-900/90 hover:bg-slate-900 focus-within:bg-slate-950 border border-slate-800/80 focus-within:border-slate-700/80 rounded-xl shadow-2xl backdrop-blur-md transition-all duration-300">
          <input
            type="text"
            placeholder="Enter username (e.g., hello-shadow)..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && scoutProfile()}
            className="flex-1 px-3 py-2 bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
          />
          <button
            onClick={() => scoutProfile()}
            className="bg-sky-500/90 hover:bg-sky-500 active:bg-sky-600 text-white border border-sky-400/30 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 hover:shadow-lg hover:shadow-sky-500/20 active:scale-[0.97] cursor-pointer"
          >
            Search
          </button>
        </div>
      </div>

      {isLoading && (
        <p className="text-sky-400 animate-pulse font-mono text-xs mt-2">
          Scouting GitHub networks...
        </p>
      )}
      {error !== null && (
        <p className="text-red-400 bg-red-950/50 p-3 rounded-lg border border-red-800 text-xs mt-2">
          {error}
        </p>
      )}

      {userData !== null && (
        <CardContainer className="inter-var w-full max-w-[340px]">
          <CardBody className="bg-slate-900 relative group/card dark:hover:shadow-2xl dark:hover:shadow-sky-500/[0.1] dark:border-white/[0.1] border-black/[0.1] w-full h-auto rounded-xl p-4 sm:p-5 border flex flex-col items-center text-center border-slate-800 transition-all duration-300">
            <CardItem translateZ="60" className="mt-1">
              <img
                src={userData.avatar_url}
                className="w-20 h-20 rounded-full border-2 border-sky-400 object-cover shadow-md mx-auto"
                alt="profile"
              />
            </CardItem>

            <CardItem
              translateZ="40"
              className="text-lg font-bold text-white mt-3 w-full"
            >
              {userData.name || userData.login}
            </CardItem>

            <CardItem
              as="p"
              translateZ="30"
              className="text-slate-400 text-xs mt-1 max-w-[280px] mx-auto line-clamp-2 break-words"
            >
              {userData.bio || "No bio available."}
            </CardItem>

            <CardItem translateZ="40" className="mt-3 w-full">
              <div className="bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 font-mono text-[11px] text-sky-400 inline-block shadow-inner">
                Public Repos: {userData.public_repos}
              </div>
            </CardItem>

            <CardItem
              as="div"
              translateZ="30"
              className="mt-3 w-full flex-1 flex flex-col justify-end"
            >
              <AiReviewCard
                key={userData.id}
                name={userData.name || userData.login}
                bio={userData.bio}
                public_repos={userData.public_repos}
              />
            </CardItem>
          </CardBody>
        </CardContainer>
      )}
    </div>
  );
}
