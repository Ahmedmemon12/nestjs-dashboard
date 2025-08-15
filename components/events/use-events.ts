"use client";

import { useEffect, useState } from "react";
import { fetchJSON } from "@/lib/fetch-json";
import type { EventEntity } from "@/types/event";

const BASE_URL = "https://cyncity-api.codetors.dev";

export function useEvents() {
  const [events, setEvents] = useState<EventEntity[]>([]);
  const [loading, setLoading] = useState(false);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await fetchJSON<EventEntity[]>(
        `${BASE_URL}/events-management`
      );
      setEvents(data);
    } catch (error) {
      console.error("Failed to load events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  return { events, setEvents, loading, refetch: loadEvents };
}
