"use client";

import { motion } from "framer-motion";
import { EventCalendar } from "@/components/events/event-calendar";
import { EventTable } from "@/components/events/event-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EventsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Event Management</h1>
          <p className="text-muted-foreground">
            Create, manage, and track your events
          </p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Calendar View</CardTitle>
        </CardHeader>
        <CardContent>
          <EventCalendar />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Events List</CardTitle>
        </CardHeader>
        <CardContent>
          <EventTable />
        </CardContent>
      </Card>
    </motion.div>
  );
}
