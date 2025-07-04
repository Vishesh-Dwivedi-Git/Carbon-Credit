"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Plus, Upload } from "lucide-react"
import toast from "react-hot-toast"

export default function CO2ReportsPage() {
  const [activeTab, setActiveTab] = useState("submit")

  const handleSubmitReport = () => {
    toast.success("Your CO2 consumption report has been submitted for verification.")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">CO2 Emissions Reports</h1>
        <Button onClick={() => setActiveTab("submit")}>
          <Plus className="h-4 w-4 mr-2" />
          New Report
        </Button>
      </div>

      <Tabs defaultValue="submit" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="submit">Submit Report</TabsTrigger>
          <TabsTrigger value="history">Report History</TabsTrigger>
        </TabsList>

        <TabsContent value="submit">
          <Card>
            <CardHeader>
              <CardTitle>Submit CO2 Consumption Report</CardTitle>
              <CardDescription>Report your organization's carbon emissions for verification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="report-year">Report Year</Label>
                    <Select>
                      <SelectTrigger id="report-year">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2025">2025</SelectItem>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="report-month">Report Month</Label>
                    <Select>
                      <SelectTrigger id="report-month">
                        <SelectValue placeholder="Select month" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "January", "February", "March", "April", "May", "June",
                          "July", "August", "September", "October", "November", "December"
                        ].map((month, i) => (
                          <SelectItem key={i} value={`${i + 1}`}>{month}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="total-emissions">Total Emissions (tons of CO2)</Label>
                  <Input id="total-emissions" type="number" placeholder="Enter total emissions" />
                </div>

                <div className="space-y-2">
                  <Label>Emission Sources</Label>
                  <div className="space-y-4">
                    <EmissionSourceInput index={0} />
                    <EmissionSourceInput index={1} />
                    <Button variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Another Source
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="document-proof">Supporting Documentation</Label>
                  <div className="border border-dashed border-border rounded-lg p-8 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag and drop your files here, or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">Supported formats: PDF, DOCX, XLSX (Max 10MB)</p>
                    <Input id="document-proof" type="file" className="hidden" />
                    <Button variant="outline" size="sm" className="mt-4">
                      Browse Files
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additional-notes">Additional Notes</Label>
                  <Textarea
                    id="additional-notes"
                    placeholder="Any additional information about your emissions report"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSubmitReport}>Submit CO2 Report</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <div className="space-y-6">
            <ReportCard month="March" year={2024} totalEmissions={850} status="PENDING" submittedDate="Apr 5, 2024" />
            <ReportCard
              month="February"
              year={2024}
              totalEmissions={920}
              status="VERIFIED"
              submittedDate="Mar 3, 2024"
              verifiedDate="Mar 10, 2024"
              starsEarned={5}
            />
            <ReportCard
              month="January"
              year={2024}
              totalEmissions={1050}
              status="VERIFIED"
              submittedDate="Feb 2, 2024"
              verifiedDate="Feb 8, 2024"
              starsEarned={3}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function EmissionSourceInput({ index }: { index: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2">
        <Input placeholder={`Emission source ${index + 1} (e.g., Electricity, Transportation)`} />
      </div>
      <div>
        <Input type="number" placeholder="Emissions (tons)" />
      </div>
    </div>
  )
}

function ReportCard({
  month,
  year,
  totalEmissions,
  status,
  submittedDate,
  verifiedDate,
  starsEarned,
}: {
  month: string
  year: number
  totalEmissions: number
  status: "PENDING" | "VERIFIED" | "REJECTED"
  submittedDate: string
  verifiedDate?: string
  starsEarned?: number
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>
            {month} {year} Report
          </CardTitle>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              status === "PENDING"
                ? "bg-yellow-500/20 text-yellow-500"
                : status === "VERIFIED"
                ? "bg-green-500/20 text-green-500"
                : "bg-red-500/20 text-red-500"
            }`}
          >
            {status}
          </span>
        </div>
        <CardDescription>Submitted on {submittedDate}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Total Emissions:</span>
            <span className="font-medium">{totalEmissions} tons of CO2</span>
          </div>

          {status === "VERIFIED" && (
            <>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Verified on:</span>
                <span className="font-medium">{verifiedDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Stars Earned:</span>
                <div className="flex">
                  {Array.from({ length: starsEarned || 0 }).map((_, i) => (
                    <span key={i} className="text-yellow-500">
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          <FileText className="h-4 w-4 mr-2" />
          View Full Report
        </Button>
      </CardFooter>
    </Card>
  )
}
