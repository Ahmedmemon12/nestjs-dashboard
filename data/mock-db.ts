import { z } from "zod";
import type { User } from "@/types/user";
import type { EventEntity } from "@/types/event";
import type {
  HealthData,
  LocationData,
  UserData,
  WatchData,
} from "@/types/user-data";

// In-memory store (mock). Resets on server reload.
const db = {
  users: [] as User[],
  events: [] as EventEntity[],
  userData: [] as UserData[],
  watches: [] as WatchData[],
  healthData: [] as HealthData[],
  locationData: [] as LocationData[],
};

let seeded = false;

function seed() {
  if (seeded) return;
  seeded = true;

  db.users = [
    {
      id: "u_1",
      name: "Jane Doe",
      email: "jane@gmail.com",
      role: "admin",
      status: "active",
      createdAt: new Date().toISOString(),
    },
    {
      id: "u_2",
      name: "John Smith",
      email: "john@gmail.com",
      role: "editor",
      status: "active",
      createdAt: new Date().toISOString(),
    },
    {
      id: "u_3",
      name: "Alex Kim",
      email: "alex@gmail.com",
      role: "viewer",
      status: "suspended",
      createdAt: new Date().toISOString(),
    },
  ];

  db.events = [
    {
      id: "ev_1",
      title: "Community Health Fair",
      venue: "Civic Center",
      date: new Date().toISOString().slice(0, 10),
      time: "10:00",
      organizer: "City Health",
      agenda: "Free screenings, vaccinations, and wellness talks.",
      attendees: ["guest1@gmail.com", "guest2@gmail.com"],
    },
  ];

  // Watch IDs
  const watchId1 = "550e8400-e29b-41d4-a716-446655440001";
  const watchId2 = "550e8400-e29b-41d4-a716-446655440002";
  const watchId3 = "550e8400-e29b-41d4-a716-446655440003";

  db.userData = [
    {
      id: 1,
      parentName: "Ayesha Khan",
      email: "ayesha.khan@gmail.com",
      password: null,
      isVerified: true,
      verificationToken: null,
      phoneNumber: "+92-300-1234567",
      resetPasswordToken: null,
      resetPasswordExpiry: null,
      refreshToken: null,
      watchIds: [watchId1, watchId2],
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 2,
      parentName: "Bilal Ahmed",
      email: "bilal.ahmed@gmail.com",
      password: null,
      isVerified: false,
      verificationToken: "verify_token_123",
      phoneNumber: "+92-301-2345678",
      resetPasswordToken: null,
      resetPasswordExpiry: null,
      refreshToken: null,
      watchIds: [watchId3],
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 3,
      parentName: null,
      email: "rehan@gmail.com",
      password: null,
      isVerified: false,
      verificationToken: null,
      phoneNumber: null,
      resetPasswordToken: null,
      resetPasswordExpiry: null,
      refreshToken: null,
      watchIds: [],
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  db.watches = [
    {
      id: 1,
      watchId: watchId1,
      name: "Zara's Watch",
      brand: "Apple Watch",
      username: "zara_watch",
      password: "encrypted_password",
      phoneNumber: "+92-302-3456789",
      caregiverDetails: [
        {
          name: "Ayesha Khan",
          relation: "Mother",
          phoneNumber: "+92-300-1234567",
        },
        {
          name: "Imran Khan",
          relation: "Father",
          phoneNumber: "+92-300-9876543",
        },
      ],
      caregiverPhoneNumbers: "+92-300-1234567,+92-300-9876543",
      refreshToken: null,
      userId: 1,
    },
    {
      id: 2,
      watchId: watchId2,
      name: "Ali's Watch",
      brand: "Samsung Galaxy Watch",
      username: "ali_watch",
      password: "encrypted_password",
      phoneNumber: "+92-303-4567890",
      caregiverDetails: [
        {
          name: "Ayesha Khan",
          relation: "Mother",
          phoneNumber: "+92-300-1234567",
        },
      ],
      caregiverPhoneNumbers: "+92-300-1234567",
      refreshToken: null,
      userId: 1,
    },
    {
      id: 3,
      watchId: watchId3,
      name: "Hassan's Watch",
      brand: "Fitbit Versa",
      username: "hassan_watch",
      password: "encrypted_password",
      phoneNumber: "+92-304-5678901",
      caregiverDetails: [
        {
          name: "Bilal Ahmed",
          relation: "Father",
          phoneNumber: "+92-301-2345678",
        },
        {
          name: "Fatima Ahmed",
          relation: "Mother",
          phoneNumber: "+92-301-8765432",
        },
      ],
      caregiverPhoneNumbers: "+92-301-2345678,+92-301-8765432",
      refreshToken: null,
      userId: 2,
    },
  ];

  // Generate health data for the last 7 days
  const now = new Date();
  const watchIds = [watchId1, watchId2, watchId3];

  for (let i = 0; i < 7; i++) {
    const timestamp = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);

    watchIds.forEach((watchId, idx) => {
      db.healthData.push({
        id: db.healthData.length + 1,
        watchId,
        stepCount: Math.floor(Math.random() * 10000) + 2000,
        heartRate: Math.floor(Math.random() * 40) + 60,
        activeCalories: Math.floor(Math.random() * 500) + 200,
        bloodOxygen: Math.floor(Math.random() * 5) + 95,
        sleepHours: Math.floor(Math.random() * 4) + 6,
        distance: Math.floor(Math.random() * 10) + 2,
        restingHeartRate: Math.floor(Math.random() * 20) + 50,
        floorsClimbed: Math.floor(Math.random() * 20) + 5,
        timestamp: timestamp.toISOString(),
      });
    });
  }

  // Generate location data for the last 3 days
  const locations = [
    { lat: 40.7128, lng: -74.006, name: "New York, NY" },
    { lat: 34.0522, lng: -118.2437, name: "Los Angeles, CA" },
    { lat: 41.8781, lng: -87.6298, name: "Chicago, IL" },
  ];

  for (let i = 0; i < 3; i++) {
    const timestamp = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);

    watchIds.forEach((watchId, idx) => {
      const location = locations[idx];
      db.locationData.push({
        id: db.locationData.length + 1,
        watchId,
        latitude: location.lat + (Math.random() - 0.5) * 0.01,
        longitude: location.lng + (Math.random() - 0.5) * 0.01,
        location: location.name,
        timestamp: timestamp.toISOString(),
      });
    });
  }
}

seed();

export const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(["admin", "editor", "viewer"]),
  status: z.enum(["active", "suspended"]),
});

export const userUpdateSchema = userSchema.partial();

export const eventSchema = z.object({
  title: z.string().min(2),
  venue: z.string().min(2),
  date: z.string(), // ISO date
  time: z.string(), // HH:mm
  organizer: z.string().min(2),
  agenda: z.string().min(2),
  attendees: z.array(z.string().email()).default([]),
});

export const eventUpdateSchema = eventSchema.partial();

export const MockDB = {
  listUsers(): User[] {
    return db.users.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  getUser(id: string) {
    return db.users.find((u) => u.id === id) || null;
  },

  createUser(input: z.infer<typeof userSchema>): User {
    const parsed = userSchema.parse(input);
    const user: User = {
      id: `u_${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
      ...parsed,
    };
    db.users.unshift(user);
    return user;
  },

  updateUser(id: string, input: z.infer<typeof userUpdateSchema>): User {
    const parsed = userUpdateSchema.parse(input);
    const i = db.users.findIndex((u) => u.id === id);
    if (i === -1) throw new Error("User not found");
    db.users[i] = { ...db.users[i], ...parsed };
    return db.users[i];
  },

  deleteUser(id: string) {
    const i = db.users.findIndex((u) => u.id === id);
    if (i === -1) throw new Error("User not found");
    db.users.splice(i, 1);
  },

  listEvents(): EventEntity[] {
    return db.events;
  },

  getEvent(id: string) {
    return db.events.find((e) => e.id === id) || null;
  },

  createEvent(input: z.infer<typeof eventSchema>): EventEntity {
    const parsed = eventSchema.parse(input);
    const entity: EventEntity = {
      id: `ev_${Math.random().toString(36).slice(2, 8)}`,
      ...parsed,
    };
    db.events.unshift(entity);
    return entity;
  },

  updateEvent(
    id: string,
    input: z.infer<typeof eventUpdateSchema>
  ): EventEntity {
    const parsed = eventUpdateSchema.parse(input);
    const i = db.events.findIndex((e) => e.id === id);
    if (i === -1) throw new Error("Event not found");
    db.events[i] = { ...db.events[i], ...parsed };
    return db.events[i];
  },

  deleteEvent(id: string) {
    const i = db.events.findIndex((e) => e.id === id);
    if (i === -1) throw new Error("Event not found");
    db.events.splice(i, 1);
  },

  // User Data methods
  listUserData(): UserData[] {
    return db.userData.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  getUserData(id: number) {
    return db.userData.find((u) => u.id === id) || null;
  },

  deleteUserData(id: number) {
    const userIndex = db.userData.findIndex((u) => u.id === id);
    if (userIndex === -1) throw new Error("User not found");

    // Delete associated watches
    db.watches = db.watches.filter((w) => w.userId !== id);

    // Delete associated health data
    const user = db.userData[userIndex];
    user.watchIds.forEach((watchId) => {
      db.healthData = db.healthData.filter((h) => h.watchId !== watchId);
      db.locationData = db.locationData.filter((l) => l.watchId !== watchId);
    });

    // Delete user
    db.userData.splice(userIndex, 1);
  },

  getUserWatches(userId: number): WatchData[] {
    return db.watches.filter((w) => w.userId === userId);
  },

  getUserHealthData(userId: number): HealthData[] {
    const user = db.userData.find((u) => u.id === userId);
    if (!user) return [];

    return db.healthData
      .filter((h) => user.watchIds.includes(h.watchId))
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  },

  getUserLocationData(userId: number): LocationData[] {
    const user = db.userData.find((u) => u.id === userId);
    if (!user) return [];

    return db.locationData
      .filter((l) => user.watchIds.includes(l.watchId))
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  },
};
