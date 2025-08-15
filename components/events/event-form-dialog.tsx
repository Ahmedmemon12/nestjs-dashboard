"use client";

import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { EventEntity } from "@/types/event";

const schema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().min(2, "Description is required"),
  eventDate: z.string().min(1, "Event date is required"),
  location: z.string().min(2, "Location is required"),
  organizerName: z.string().min(2, "Organizer name is required"),
  contactEmail: z.string().email("Valid email is required"),
  contactPhone: z.string().min(1, "Contact phone is required"),
  notes: z.string().default(""),
  status: z.enum(["active", "cancelled", "completed"]).default("active"),
});

type FormValues = z.infer<typeof schema>;

export function EventFormDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  mode = "create",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (input: Omit<EventEntity, "id">) => Promise<void>;
  defaultValues?: Partial<EventEntity>;
  mode?: "create" | "edit";
}) {
  const { register, handleSubmit, formState, reset, setValue, watch } =
    useForm<FormValues>({
      resolver: zodResolver(schema),
      defaultValues: {
        title: "",
        description: "",
        eventDate: new Date().toISOString().slice(0, 16), // YYYY-MM-DDTHH:mm format
        location: "",
        organizerName: "",
        contactEmail: "",
        contactPhone: "",
        notes: "",
        status: "active",
      },
    });

  const statusValue = watch("status");

  useEffect(() => {
    if (defaultValues) {
      const formattedValues = {
        ...defaultValues,
        eventDate: defaultValues.eventDate
          ? new Date(defaultValues.eventDate).toISOString().slice(0, 16)
          : new Date().toISOString().slice(0, 16),
      };
      reset(formattedValues as any);
    }
  }, [defaultValues, reset]);

  const onFormSubmit = async (values: FormValues) => {
    try {
      // Convert the datetime-local input back to ISO string
      const eventData = {
        ...values,
        eventDate: new Date(values.eventDate).toISOString(),
      };
      await onSubmit(eventData as any);
      onOpenChange(false);
      if (mode === "create") {
        reset();
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create New Event" : "Edit Event"}
          </DialogTitle>
        </DialogHeader>
        <form
          id="event-form"
          className="grid gap-4"
          onSubmit={handleSubmit(onFormSubmit)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="Enter event title"
              />
              {formState.errors.title && (
                <p className="text-sm text-destructive">
                  {formState.errors.title.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={statusValue}
                onValueChange={(value) => setValue("status", value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Describe your event"
              rows={3}
            />
            {formState.errors.description && (
              <p className="text-sm text-destructive">
                {formState.errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="eventDate">Event Date & Time *</Label>
              <Input
                id="eventDate"
                type="datetime-local"
                {...register("eventDate")}
              />
              {formState.errors.eventDate && (
                <p className="text-sm text-destructive">
                  {formState.errors.eventDate.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                {...register("location")}
                placeholder="Event location"
              />
              {formState.errors.location && (
                <p className="text-sm text-destructive">
                  {formState.errors.location.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="organizerName">Organizer Name *</Label>
              <Input
                id="organizerName"
                {...register("organizerName")}
                placeholder="Organizer name"
              />
              {formState.errors.organizerName && (
                <p className="text-sm text-destructive">
                  {formState.errors.organizerName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone *</Label>
              <Input
                id="contactPhone"
                {...register("contactPhone")}
                placeholder="03001234567"
              />
              {formState.errors.contactPhone && (
                <p className="text-sm text-destructive">
                  {formState.errors.contactPhone.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactEmail">Contact Email *</Label>
            <Input
              id="contactEmail"
              type="email"
              {...register("contactEmail")}
              placeholder="contact@example.com"
            />
            {formState.errors.contactEmail && (
              <p className="text-sm text-destructive">
                {formState.errors.contactEmail.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...register("notes")}
              placeholder="Additional notes or special instructions"
              rows={2}
            />
          </div>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form="event-form">
            {mode === "create" ? "Create Event" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
