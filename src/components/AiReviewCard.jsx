import { useState } from "react";
const apiKey = import.meta.env.VITE_GROQ_API_KEY;

export default function AiReviewCard(props) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function callAi() {
    setLoading(true);
    setSummary(null);
    setError(null);
    const repoSummary =
      props.recent_repos && props.recent_repos.length > 0
        ? props.recent_repos.map(
            (data) =>
              `Name: ${data.name}, Language: ${data.language || "Unknown"}`,
          )
        : "No public repositories found!";

    try {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              {
                role: "system",
                content:
                  "You are a savage GitHub roast bot. Roast ONLY using the exact data given: name, bio, repo count, and their top repos with languages. Use SIMPLE, EASY English — short common words, no fancy vocabulary. Max 2 short punchy sentences, no intro, no fluff. You MUST mention at least one real detail — a specific repo name, a specific language, or exact bio text. No generic roasts. No slurs, no appearance/race/gender jokes — stick to code, repo names, and language choices only. If bio is empty or repos = 0, roast that fact directly. End on the punchline, don't explain the joke.",
              },
              {
                role: "user",
                content: `
                  Name: ${props.name}
                  Bio: ${props.bio || "No bio"}
                  Public Repositories: ${props.public_repos}
                  Top Recent Repositories: ${repoSummary}`,
              },
            ],
            temperature: 0.8,
            max_completion_tokens: 100,
          }),
        },
      );

      const data = await response.json();

      if (data.error) {
        setError(data.error.message || "Failed to generate AI assessment.");
      } else {
        setSummary(data.choices[0].message.content);
      }
    } catch (err) {
      console.error(err);
      setError("AI inference failed. Check network or API key.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-3 w-full rounded-xl border border-violet-500/20 bg-slate-950/60 p-3.5 shadow-inner backdrop-blur-md transition-all duration-300 hover:border-violet-500/40">
      {error && (
        <div className="mb-2.5 rounded-lg border border-red-500/30 bg-red-950/40 p-2 text-center text-xs font-medium text-red-300">
          {error}
        </div>
      )}

      <button
        onClick={callAi}
        disabled={loading || summary !== null}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-3.5 py-2 text-xs font-semibold tracking-wide text-white shadow-md shadow-violet-500/10 transition-all duration-200 hover:from-violet-500 hover:to-indigo-500 hover:shadow-violet-500/25 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span>{summary ? "Roasted" : "Roast"}</span>
      </button>

      {loading && (
        <div className="mt-3 flex items-center justify-center gap-2 py-2 text-xs font-mono text-violet-300/70 animate-pulse">
          <div className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-bounce"></div>
          <span>Consulting Llama-3...</span>
        </div>
      )}

      {/* SUMMARY DISPLAY */}
      {summary && !loading && (
        <div className="mt-3 border-t border-violet-500/15 pt-2.5 text-left animate-fade-in">
          <p className="text-xs font-light leading-relaxed text-slate-200">
            {summary}
          </p>
        </div>
      )}
    </div>
  );
}
