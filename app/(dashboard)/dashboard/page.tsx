import { Suspense } from "react"
import { KpiCards } from "@/components/kpi-cards"
import { UserGrowthChart } from "@/components/charts/user-growth-chart"
import { ServiceUsageChart } from "@/components/charts/service-usage-chart"
import { RecentActivities } from "@/components/recent-activities"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <KpiCards />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Growth Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="h-64 animate-pulse rounded-md bg-muted" />}>
              <UserGrowthChart />
            </Suspense>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Service Usage Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="h-64 animate-pulse rounded-md bg-muted" />}>
              <ServiceUsageChart />
            </Suspense>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentActivities />
        </CardContent>
      </Card>
    </div>
  )
}
