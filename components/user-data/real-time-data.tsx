"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import type { UserData } from "@/types/user-data"
import { fetchJSON } from "@/lib/fetch-json"

interface RealTimeDataProps {
  userId: number
  onDataUpdate?: (userData: UserData) => void
}

export function RealTimeData({ userId, onDataUpdate }: RealTimeDataProps) {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  async function fetchUserData() {
    setLoading(true)
    try {
      // Fetch specific user data
      const allUsers = await fetchJSON<UserData[]>("http://localhost:3001/auth/usersdata")
      const userData = allUsers.find((u) => u.id === userId)
      if (userData) {
        setUser(userData)
        setLastUpdate(new Date())
        onDataUpdate?.(userData)
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserData()
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchUserData, 30000)
    return () => clearInterval(interval)
  }, [userId])

  if (!user) return null

  const latestHealthData = user.watches
    ?.flatMap((w) => w.healthData || [])
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]

  const latestLocationData = user.watches
    ?.flatMap((w) => w.locationData || [])
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Real-time Data</CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </Badge>
          <Button variant="outline" size="sm" onClick={fetchUserData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {latestHealthData && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{latestHealthData.stepCount || 0}</div>
              <div className="text-xs text-muted-foreground">Steps</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{latestHealthData.heartRate || 0}</div>
              <div className="text-xs text-muted-foreground">BPM</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{latestHealthData.activeCalories || 0}</div>
              <div className="text-xs text-muted-foreground">Calories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{latestHealthData.bloodOxygen || 0}%</div>
              <div className="text-xs text-muted-foreground">Blood O2</div>
            </div>
          </div>
        )}

        {latestLocationData && (
          <div className="border-t pt-4">
            <div className="text-sm font-medium mb-2">Latest Location</div>
            <div className="text-sm text-muted-foreground">
              <div>📍 {latestLocationData.location}</div>
              <div className="text-xs mt-1">
                {latestLocationData.latitude.toFixed(6)}, {latestLocationData.longitude.toFixed(6)}
              </div>
              <div className="text-xs mt-1">{new Date(latestLocationData.timestamp).toLocaleString()}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
