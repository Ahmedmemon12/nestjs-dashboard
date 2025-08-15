"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchJSON } from "@/lib/fetch-json";
import type { EventEntity } from "@/types/event";
import { EventFormDialog } from "./event-form-dialog";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Calendar,
  MapPin,
  User,
  Mail,
  Phone,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BASE_URL = "https://cyncity-api.codetors.dev";

export function EventTable() {
  const [events, setEvents] = useState<EventEntity[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<EventEntity | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();

  async function loadEvents() {
    setLoading(true);
    try {
      const url =
        statusFilter === "all"
          ? `${BASE_URL}/events-management`
          : `${BASE_URL}/events-management?status=${statusFilter}`;

      const data = await fetchJSON<EventEntity[]>(url);
      setEvents(data);
      setFilteredEvents(data);
    } catch (e: any) {
      toast({
        title: "Failed to load events",
        description: String(e),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, [statusFilter]);

  // Filter events based on search query
  useEffect(() => {
    const filtered = events.filter((event) => {
      const query = searchQuery.toLowerCase();
      return (
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query) ||
        event.organizerName.toLowerCase().includes(query)
      );
    });
    setFilteredEvents(filtered);
  }, [events, searchQuery]);

  async function createEvent(input: Omit<EventEntity, "id">) {
    try {
      const event = await fetchJSON<EventEntity>(
        `${BASE_URL}/events-management`,
        {
          method: "POST",
          body: JSON.stringify(input),
        }
      );
      setEvents((prev) => [event, ...prev]);
      toast({ title: "Event created successfully" });
    } catch (e: any) {
      toast({
        title: "Failed to create event",
        description: String(e),
        variant: "destructive",
      });
    }
  }

  async function updateEvent(id: number, patch: Partial<EventEntity>) {
    try {
      const event = await fetchJSON<EventEntity>(
        `${BASE_URL}/events-management/${id}`,
        {
          method: "PATCH",
          body: JSON.stringify(patch),
        }
      );
      setEvents((prev) => prev.map((x) => (x.id === id ? event : x)));
      toast({ title: "Event updated successfully" });
    } catch (e: any) {
      toast({
        title: "Failed to update event",
        description: String(e),
        variant: "destructive",
      });
    }
  }

  async function deleteEvent(id: number, title: string) {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await fetchJSON<{ ok: true }>(`${BASE_URL}/events-management/${id}`, {
        method: "DELETE",
      });
      setEvents((prev) => prev.filter((x) => x.id !== id));
      toast({ title: "Event deleted successfully" });
    } catch (e: any) {
      toast({
        title: "Failed to delete event",
        description: String(e),
        variant: "destructive",
      });
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "completed":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </div>

      {/* Events Table */}
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event Details</TableHead>
              <TableHead>Date & Location</TableHead>
              <TableHead>Organizer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-32 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  Loading events...
                </TableCell>
              </TableRow>
            ) : filteredEvents.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  {searchQuery || statusFilter !== "all"
                    ? "No events match your filters"
                    : "No events found"}
                </TableCell>
              </TableRow>
            ) : (
              filteredEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-muted-foreground line-clamp-2">
                        {event.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {new Date(event.eventDate).toLocaleDateString()} at{" "}
                        {new Date(event.eventDate).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <User className="h-3 w-3" />
                        {event.organizerName}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {event.contactEmail}
                      </div>
                      {event.contactPhone && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {event.contactPhone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getStatusColor(event.status)}
                      className="capitalize"
                    >
                      {event.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditing(event)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteEvent(event.id, event.title)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          Showing {filteredEvents.length} of {events.length} events
        </div>
        <div>
          {events.filter((e) => e.status === "active").length} active,{" "}
          {events.filter((e) => e.status === "completed").length} completed,{" "}
          {events.filter((e) => e.status === "cancelled").length} cancelled
        </div>
      </div>

      {/* Dialogs */}
      <EventFormDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={createEvent}
      />
      {editing && (
        <EventFormDialog
          open={!!editing}
          onOpenChange={(o) => !o && setEditing(null)}
          defaultValues={editing}
          mode="edit"
          onSubmit={async (payload) => {
            await updateEvent(editing.id, payload as any);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}
