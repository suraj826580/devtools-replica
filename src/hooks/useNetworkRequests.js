import { useState, useEffect, useCallback, useRef } from "react";

function useNetworkRequests() {
  const [requests, setRequests] = useState([]);
  const isIntercepting = useRef(false);

  const addRequest = useCallback((request) => {
    setRequests((prev) => [...prev, request]);
  }, []);

  const updateRequest = useCallback((id, updates) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, ...updates } : req))
    );
  }, []);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null) => {
      const request = {
        id: Date.now(),
        url,
        method,
        body: body ? JSON.stringify(body) : null,
        startTime: performance.now(),
        type: getRequestType(url),
        headers: {}, // Initialize headers
      };

      addRequest(request);

      try {
        isIntercepting.current = true;
        const options = {
          method,
          headers: {
            "Content-Type": "application/json",
          },
        };

        if (body) {
          options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);
        const responseBody = await response.text();
        let parsedResponseBody;
        try {
          parsedResponseBody = JSON.parse(responseBody);
        } catch {
          parsedResponseBody = responseBody;
        }

        // Capture response headers
        const headers = {};
        response.headers.forEach((value, key) => {
          headers[key] = value;
        });

        updateRequest(request.id, {
          status: response.status,
          responseBody: parsedResponseBody,
          endTime: performance.now(),
          ok: response.ok,
          headers: headers, // Add captured headers
        });
      } catch (error) {
        updateRequest(request.id, {
          error: error.message,
          endTime: performance.now(),
          ok: false,
        });
      } finally {
        isIntercepting.current = false;
      }
    },
    [addRequest, updateRequest]
  );
  useEffect(() => {
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      if (isIntercepting.current) {
        return originalFetch(...args);
      }

      const url = typeof args[0] === "string" ? args[0] : args[0].url;
      const method = args[1]?.method || "GET";

      const request = {
        id: Date.now(),
        url,
        method,
        startTime: performance.now(),
        type: getRequestType(url),
      };

      addRequest(request);

      try {
        const response = await originalFetch(...args);
        const clone = response.clone();
        const responseBody = await clone.text();

        updateRequest(request.id, {
          status: response.status,
          responseBody,
          endTime: performance.now(),
        });

        return response;
      } catch (error) {
        updateRequest(request.id, {
          error: error.message,
          endTime: performance.now(),
        });
        throw error;
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, [addRequest, updateRequest]);

  return { requests, sendRequest };
}

function getRequestType(url) {
  const extension = url.split(".").pop().toLowerCase();
  if (["jpg", "jpeg", "png", "gif", "svg"].includes(extension)) return "img";
  if (extension === "css") return "css";
  if (extension === "js") return "js";
  return "xhr";
}

export default useNetworkRequests;
