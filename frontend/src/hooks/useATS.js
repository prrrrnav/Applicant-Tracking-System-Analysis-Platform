import { useCallback, useMemo, useState } from "react";
import { api } from "../services/api";

function normalizeAnalyzeResponse(payload) {
  if (!payload) return null;
  // Backend returns { message, analysis: { score, keywords, ... } }
  return payload;
}

export function useATS() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [lastRequest, setLastRequest] = useState(null);

  const analyze = useCallback(async (file, jd, authToken) => {
    setLoading(true);
    setError(null);
    setLastRequest({ file, jd: jd || "", authToken: authToken || "" });

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jd", jd || "");

      const res = await api.post("/api/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(authToken ? { Authorization: authToken } : {}),
        },
      });

      const normalized = normalizeAnalyzeResponse(res.data);
      setData(normalized);
      return normalized;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Request failed";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const optimize = useCallback(async () => {
    if (!lastRequest?.file) throw new Error("No resume uploaded yet.");

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("resume", lastRequest.file);
      formData.append("jd", lastRequest.jd || "");

      const res = await api.post("/api/analyze/generate-optimized-resume", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(lastRequest.authToken ? { Authorization: lastRequest.authToken } : {}),
        },
        // Backend now returns JSON, not plain text
      });

      // res.data = { message, optimizedResume: { name, title, contact, skills, ... } }
      const optimized = res.data?.optimizedResume ?? res.data;

      setData((prev) => ({
        ...(prev ?? {}),
        optimizedResume: optimized,
      }));

      return optimized;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Request failed";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [lastRequest]);

  const score = useMemo(() => data?.analysis?.score ?? null, [data]);

  return { loading, error, data, score, analyze, optimize };
}