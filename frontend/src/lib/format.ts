export function formatScore(score: number | null | undefined) {
  return score === null || score === undefined ? "Pending" : score.toFixed(2);
}

export function formatApplicationScore(
  resumeScore: number | null | undefined,
  qaScore: number | null | undefined,
) {
  if (resumeScore === null || resumeScore === undefined) {
    return "Pending";
  }
  if (qaScore === null || qaScore === undefined) {
    return resumeScore.toFixed(2);
  }

  return (resumeScore * 0.7 + qaScore * 10 * 0.3).toFixed(2);
}

export function formatDateTime(value: string | null | undefined) {
  if (!value) return "Not scheduled";
  return new Date(value).toLocaleString();
}

export function detailMessage(error: unknown) {
  if (error instanceof Error) {
    try {
      const parsed = JSON.parse(error.message) as { detail?: unknown };
      if (typeof parsed.detail === "string") {
        return parsed.detail;
      }
    } catch {
      // Fall through to the original message when it is not a JSON API error.
    }
    return error.message;
  }
  return "Something went wrong";
}
