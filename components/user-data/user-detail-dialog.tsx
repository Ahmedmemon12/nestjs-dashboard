"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Watch, Heart, MapPin } from "lucide-react";
import { RealTimeData } from "./real-time-data";
import type {
  UserData,
  WatchData,
  HealthData,
  LocationData,
} from "@/types/user-data";

interface UserDetailDialogProps {
  user: UserData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailDialog({
  user,
  open,
  onOpenChange,
}: UserDetailDialogProps) {
  const [watches, setWatches] = useState<WatchData[]>([]);
  const [healthData, setHealthData] = useState<HealthData[]>([]);
  const [locationData, setLocationData] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open && user) {
      loadUserDetails();
    }
  }, [open, user]);

  async function loadUserDetails() {
    setLoading(true);
    try {
      // Since data is already nested in the user object, extract it directly
      const userWatches = user.watches || [];
      setWatches(userWatches);

      // Extract health data from all watches
      const allHealthData: HealthData[] = [];
      const allLocationData: LocationData[] = [];

      userWatches.forEach((watch) => {
        if (watch.healthData) {
          allHealthData.push(...watch.healthData);
        }
        if (watch.locationData) {
          allLocationData.push(...watch.locationData);
        }
      });

      // Sort by timestamp (newest first)
      allHealthData.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      allLocationData.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setHealthData(allHealthData);
      setLocationData(allLocationData);
    } catch (e: any) {
      toast({
        title: "Failed to load user details",
        description: String(e),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Watch className="h-5 w-5" />
            {user.parentName || "User"} Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* User Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">User Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Name
                </label>
                <p>{user.parentName || "Not provided"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Email
                </label>
                <p>{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Phone
                </label>
                <p>{user.phoneNumber || "Not provided"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Status
                </label>
                <div>
                  <Badge variant={user.isVerified ? "default" : "secondary"}>
                    {user.isVerified ? "Verified" : "Unverified"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* RealTimeData Component */}
          <RealTimeData
            userId={user.id}
            onDataUpdate={(updatedUser) => {
              // Update local state if needed
              console.log("User data updated:", updatedUser);
            }}
          />

          {/* Tabs for different data types */}
          <Tabs defaultValue="watches" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="watches" className="flex items-center gap-2">
                <Watch className="h-4 w-4" />
                Watches ({watches.length})
              </TabsTrigger>
              <TabsTrigger value="health" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Health ({healthData.length})
              </TabsTrigger>
              <TabsTrigger value="location" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location ({locationData.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="watches" className="space-y-4">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading...
                </div>
              ) : watches.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No watches found
                </div>
              ) : (
                <div className="grid gap-4">
                  {watches.map((watch) => (
                    <Card key={watch.id}>
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">
                              Name
                            </label>
                            <p className="font-medium">{watch.name}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">
                              Brand
                            </label>
                            <p>{watch.brand}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">
                              Watch ID
                            </label>
                            <p className="font-mono text-sm">{watch.watchId}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">
                              Username
                            </label>
                            <p>{watch.username}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">
                              Phone
                            </label>
                            <p>{watch.phoneNumber || "Not provided"}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">
                              Caregivers
                            </label>
                            <p>
                              {watch.caregiverDetails?.length || 0} assigned
                            </p>
                          </div>
                        </div>
                        {watch.caregiverDetails &&
                          watch.caregiverDetails.length > 0 && (
                            <div className="mt-4">
                              <label className="text-sm font-medium text-muted-foreground">
                                Caregiver Details
                              </label>
                              <div className="mt-2 space-y-2">
                                {watch.caregiverDetails.map(
                                  (caregiver, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center gap-4 text-sm bg-muted/50 p-2 rounded"
                                    >
                                      <span className="font-medium">
                                        {caregiver.name}
                                      </span>
                                      <Badge variant="outline">
                                        {caregiver.relation}
                                      </Badge>
                                      <span className="text-muted-foreground">
                                        {caregiver.phoneNumber}
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="health">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading...
                </div>
              ) : healthData.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No health data found
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Watch ID</TableHead>
                        <TableHead>Steps</TableHead>
                        <TableHead>Heart Rate</TableHead>
                        <TableHead>Calories</TableHead>
                        <TableHead>Blood O2</TableHead>
                        <TableHead>Sleep</TableHead>
                        <TableHead>Distance</TableHead>
                        <TableHead>Timestamp</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {healthData.slice(0, 10).map((health) => (
                        <TableRow key={health.id}>
                          <TableCell className="font-mono text-xs">
                            {health.watchId.slice(0, 8)}...
                          </TableCell>
                          <TableCell>{health.stepCount || "-"}</TableCell>
                          <TableCell>
                            {health.heartRate ? `${health.heartRate} bpm` : "-"}
                          </TableCell>
                          <TableCell>
                            {health.activeCalories
                              ? `${health.activeCalories} cal`
                              : "-"}
                          </TableCell>
                          <TableCell>
                            {health.bloodOxygen
                              ? `${health.bloodOxygen}%`
                              : "-"}
                          </TableCell>
                          <TableCell>
                            {health.sleepHours ? `${health.sleepHours}h` : "-"}
                          </TableCell>
                          <TableCell>
                            {health.distance ? `${health.distance}km` : "-"}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {new Date(health.timestamp).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {healthData.length > 10 && (
                    <p className="text-center text-sm text-muted-foreground mt-4">
                      Showing latest 10 entries of {healthData.length} total
                    </p>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="location">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading...
                </div>
              ) : locationData.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No location data found
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Watch ID</TableHead>
                        <TableHead>Latitude</TableHead>
                        <TableHead>Longitude</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Timestamp</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {locationData.slice(0, 10).map((location) => (
                        <TableRow key={location.id}>
                          <TableCell className="font-mono text-xs">
                            {location.watchId.slice(0, 8)}...
                          </TableCell>
                          <TableCell>{location.latitude.toFixed(6)}</TableCell>
                          <TableCell>{location.longitude.toFixed(6)}</TableCell>
                          <TableCell>
                            {location.location || "Unknown"}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {new Date(location.timestamp).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {locationData.length > 10 && (
                    <p className="text-center text-sm text-muted-foreground mt-4">
                      Showing latest 10 entries of {locationData.length} total
                    </p>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
