"use client";

import { useMemo, useState, useEffect } from "react";
import {
  addDays,
  format,
  startOfMonth,
  startOfWeek,
  isSameDay,
} from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchJSON } from "@/lib/fetch-json";
import type { EventEntity } from "@/types/event";

const BASE_URL = "https://cyncity-api.codetors.dev";

type View = "month" | "week" | "day";

export function EventCalendar() {
  const [view, setView] = useState<View>("month");
  const [cursor, setCursor] = useState(new Date());
  const [events, setEvents] = useState<EventEntity[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadEvents() {
    setLoading(true);
    try {
      const data = await fetchJSON<EventEntity[]>(
        `${BASE_URL}/events-management`
      );
      setEvents(data);
    } catch (error) {
      console.error("Failed to load events:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  const grid = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 });
    const days: Date[] = [];
    for (let i = 0; i < 42; i++) days.push(addDays(start, i));
    return days;
  }, [cursor]);

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.eventDate);
      return isSameDay(eventDate, date);
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="text-lg font-semibold">
          {format(cursor, "MMMM yyyy")}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant={view === "month" ? "default" : "outline"}
            onClick={() => setView("month")}
          >
            Month
          </Button>
          <Button
            variant={view === "week" ? "default" : "outline"}
            onClick={() => setView("week")}
          >
            Week
          </Button>
          <Button
            variant={view === "day" ? "default" : "outline"}
            onClick={() => setView("day")}
          >
            Day
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCursor(addDays(cursor, -30))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCursor(addDays(cursor, 30))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8 text-muted-foreground">
          Loading events...
        </div>
      )}

      {/* Month View */}
      {view === "month" && !loading && (
        <div className="grid grid-cols-7 gap-2">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div
              key={day}
              className="px-2 py-1 text-center text-sm font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
          {grid.map((date) => {
            const dayEvents = getEventsForDate(date);
            const isCurrentMonth = date.getMonth() === cursor.getMonth();
            const isToday = isSameDay(date, new Date());

            return (
              <div
                key={date.toISOString()}
                className={cn(
                  "min-h-24 rounded-md border p-2 text-sm",
                  !isCurrentMonth && "opacity-50 bg-muted/20",
                  isToday &&
                    "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800"
                )}
              >
                <div className="mb-1 text-right text-xs text-muted-foreground font-medium">
                  {date.getDate()}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className={cn(
                        "truncate rounded px-1 py-0.5 text-xs text-white",
                        getStatusColor(event.status)
                      )}
                      title={`${event.title} - ${event.location} (${event.status})`}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-muted-foreground px-1">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Week/Day View Placeholder */}
      {view !== "month" && (
        <div className="rounded-md border p-8 text-center text-muted-foreground">
          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">
            {view === "week" ? "Week" : "Day"} View
          </p>
          <p>This view is coming soon. Use month view to see all events.</p>
        </div>
      )}

      {/* Events Summary */}
      {!loading && events.length > 0 && (
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-500"></div>
            <span>
              Active ({events.filter((e) => e.status === "active").length})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-500"></div>
            <span>
              Completed ({events.filter((e) => e.status === "completed").length}
              )
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-500"></div>
            <span>
              Cancelled ({events.filter((e) => e.status === "cancelled").length}
              )
            </span>
          </div>
        </div>
      )}

      {/* No Events State */}
      {!loading && events.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">No Events Found</p>
          <p>Create your first event to see it on the calendar.</p>
        </div>
      )}
    </div>
  );
}
