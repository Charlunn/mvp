import { a as useNuxtApp } from "../server.mjs";
import { u as useState } from "./Icon-Br3kPo9U.js";
const useStatsSync = () => {
  const { $api } = useNuxtApp();
  const userStats = useState("mvp-user-stats", () => null);
  const quizStats = useState("mvp-quiz-stats", () => null);
  const syncing = useState("mvp-stats-syncing", () => false);
  const refreshUserStats = async () => {
    const { data } = await $api.get("/users/stats/");
    userStats.value = data;
    return data;
  };
  const refreshQuizStats = async () => {
    const response = await $api.get("/quiz/stats/");
    const payload = {
      level_stats: response.data.level_stats ?? {},
      recent_attempts: response.data.recent_attempts ?? [],
      total_attempts: response.data.total_attempts ?? 0,
      average_score: response.data.average_score ?? 0,
      best_score: response.data.best_score ?? 0
    };
    quizStats.value = payload;
    return payload;
  };
  const refreshAllStats = async () => {
    syncing.value = true;
    try {
      const [user, quiz] = await Promise.all([refreshUserStats(), refreshQuizStats()]);
      return { user, quiz };
    } finally {
      syncing.value = false;
    }
  };
  return {
    userStats,
    quizStats,
    syncing,
    refreshUserStats,
    refreshQuizStats,
    refreshAllStats
  };
};
export {
  useStatsSync as u
};
//# sourceMappingURL=useStatsSync-DwhmJN9P.js.map
