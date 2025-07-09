"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, Brain, FileText, Search, Users, Settings, Activity, BarChart3, TrendingUp } from "lucide-react"
import { NoteAnalysis } from "./note-analysis"
import { PatientManagement } from "./patient-management"
import { InsightsReports } from "./insights-reports"

export function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  // Shared state for medical notes
  const [medicalNotes, setMedicalNotes] = useState([
    {
      id: 1,
      patientName: "John Smith",
      patientId: "P001234",
      date: "2024-01-15",
      provider: "Dr. Sarah Wilson",
      noteType: "Follow-up Visit",
      medicalSpecialty: "Endocrinology",
      chiefComplaint: "Follow-up for diabetes management",
      soap: {
        subjective:
          "Patient reports feeling tired and thirsty frequently. Has been checking blood glucose levels as instructed. Reports occasional dizziness when standing. Denies chest pain, shortness of breath, or palpitations. Sleep pattern has improved since last visit.",
        objective:
          "Vital Signs: BP 145/92, HR 78, Temp 98.6°F, Weight 185 lbs, BMI 28.5. Patient appears well-nourished but slightly overweight. No acute distress. HEENT: Normal. Cardiovascular: Regular rate and rhythm, no murmurs. Lungs: Clear to auscultation bilaterally. Extremities: No edema, pulses intact.",
        assessment:
          "1. Type 2 Diabetes Mellitus - improving control with current regimen\n2. Hypertension - suboptimal control, consider medication adjustment\n3. Obesity - BMI 28.5, counseled on lifestyle modifications",
        plan: "1. Continue Metformin 500mg BID\n2. Increase Lisinopril to 15mg daily\n3. Dietary consultation scheduled\n4. Return in 3 months for follow-up\n5. Continue home glucose monitoring\n6. Lab work: HbA1c, lipid panel in 3 months",
      },
      medications: [
        { name: "Metformin", dosage: "500mg", frequency: "Twice daily" },
        { name: "Lisinopril", dosage: "10mg", frequency: "Once daily" },
      ],
      allergies: [{ allergen: "Penicillin", reaction: "Rash, difficulty breathing", severity: "Severe" }],
    },
    {
      id: 2,
      patientName: "Sarah Johnson",
      patientId: "P001235",
      date: "2024-01-12",
      provider: "Dr. Michael Chen",
      noteType: "Annual Physical",
      medicalSpecialty: "Internal Medicine",
      chiefComplaint: "Annual physical examination",
      soap: {
        subjective:
          "32-year-old female presents for annual physical examination. Reports feeling well overall. Exercises regularly (3-4 times per week). Denies any significant health concerns. Occasional seasonal allergies. No family history of diabetes or heart disease.",
        objective:
          "Vital Signs: BP 118/76, HR 72, Temp 98.4°F, Weight 135 lbs, BMI 22.1. Well-appearing female in no acute distress. HEENT: Normal. Cardiovascular: Regular rate and rhythm. Lungs: Clear bilaterally. Abdomen: Soft, non-tender. Skin: No concerning lesions.",
        assessment:
          "1. Health maintenance visit - patient in excellent health\n2. Seasonal allergic rhinitis - well controlled",
        plan: "1. Continue current exercise routine\n2. Routine screening labs ordered\n3. Mammogram due next year\n4. Return in 1 year for annual physical\n5. Continue OTC antihistamine as needed for allergies",
      },
      medications: [{ name: "Loratadine", dosage: "10mg", frequency: "As needed for allergies" }],
      allergies: [{ allergen: "Environmental allergens", reaction: "Sneezing, runny nose", severity: "Mild" }],
    },
  ])

  useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch("/api/kpi")
          const data = await response.json()
          console.log(data)
        } catch (error) {
          console.error("Failed to fetch medical notes", error)
        }
      }    
  
      fetchData()
    }, [])

  // Function to add new medical note
  const addMedicalNote = (newNote) => {
    const noteWithId = {
      ...newNote,
      id: medicalNotes.length + 1,
    }
    setMedicalNotes((prev) => [noteWithId, ...prev])
  }

  // Add state for patients in Dashboard
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: "John Smith",
      age: 45,
      gender: "Male",
      lastVisit: "2024-01-15",
      riskLevel: "High",
      conditions: ["Diabetes", "Hypertension"],
      phone: "(555) 123-4567",
      email: "john.smith@email.com",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      age: 32,
      gender: "Female",
      lastVisit: "2024-01-12",
      riskLevel: "Medium",
      conditions: ["Asthma"],
      phone: "(555) 234-5678",
      email: "sarah.j@email.com",
    },
    // ... other patients
  ])

  // Add function to handle patient updates
  const handlePatientUpdate = (updatedPatient) => {
    setPatients((prev) =>
      prev.map((patient) => (patient.id === updatedPatient.id ? { ...patient, ...updatedPatient } : patient)),
    )

    // Also update medical notes if patient name changed
    setMedicalNotes((prev) =>
      prev.map((note) => {
        if (note.patientId === `P${updatedPatient.id.toString().padStart(6, "0")}`) {
          return { ...note, patientName: updatedPatient.name }
        }
        return note
      }),
    )
  }

  // Analytics data
  const totalNotes = medicalNotes.length + 1248
  const totalPatients = 1050
  const highRiskPredictions = 47

  const healthIndicators = [
    { indicator: "Blood Pressure Control", positiveRate: 78, total: 450 },
    { indicator: "Diabetes Management", positiveRate: 85, total: 320 },
    { indicator: "Cholesterol Levels", positiveRate: 72, total: 280 },
    { indicator: "Weight Management", positiveRate: 65, total: 380 },
    { indicator: "Medication Adherence", positiveRate: 89, total: 520 },
  ]

  const conditionsByGender = [
    { condition: "Diabetes", male: 45, female: 38 },
    { condition: "Hypertension", male: 52, female: 48 },
    { condition: "Heart Disease", male: 35, female: 22 },
    { condition: "Arthritis", male: 28, female: 42 },
    { condition: "Asthma", male: 18, female: 25 },
  ]

  const conditionsBySpecialty = [
    { specialty: "Cardiology", condition: "Hypertension", count: 89 },
    { specialty: "Endocrinology", condition: "Diabetes", count: 76 },
    { specialty: "Internal Medicine", condition: "Hypertension", count: 65 },
    { specialty: "Orthopedics", condition: "Arthritis", count: 54 },
    { specialty: "Pulmonology", condition: "Asthma", count: 43 },
  ]

  const missingSoapSections = [
    { section: "Subjective", missing: 12, total: totalNotes },
    { section: "Objective", missing: 8, total: totalNotes },
    { section: "Assessment", missing: 15, total: totalNotes },
    { section: "Plan", missing: 6, total: totalNotes },
  ]

  const patientsBySpecialty = [
    { specialty: "Internal Medicine", patients: 245 },
    { specialty: "Cardiology", patients: 189 },
    { specialty: "Endocrinology", patients: 156 },
    { specialty: "Orthopedics", patients: 134 },
    { specialty: "Pulmonology", patients: 98 },
    { specialty: "Dermatology", patients: 87 },
    { specialty: "Neurology", patients: 76 },
    { specialty: "Gastroenterology", patients: 65 },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">MedInsight AI</h1>
              <p className="text-sm text-gray-500">Medical Note Analysis & Predictive Insights</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="Search patients, notes..." className="pl-10 w-64" />
            </div>
            <Button variant="outline" size="icon">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 px-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-transparent h-12">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              Overview
            </TabsTrigger>
            <TabsTrigger value="analysis" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              Note Analysis
            </TabsTrigger>
            <TabsTrigger value="patients" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              Patients
            </TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              Insights & Reports
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            {/* Key Metrics - Total Notes, Total Patients, High-Risk Predictions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Number of Notes</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalNotes.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalPatients.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+5% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">High-Risk Predictions</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{highRiskPredictions}</div>
                  <p className="text-xs text-muted-foreground">Requiring immediate attention</p>
                </CardContent>
              </Card>
            </div>

            {/* Visualizations */}
            <div className="space-y-8">
              {/* Rate of Positive Responses for Health Indicators */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Rate of Positive Responses for Each Health Indicator
                  </CardTitle>
                  <CardDescription>
                    Percentage of patients showing positive outcomes for each health metric
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {healthIndicators.map((indicator, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{indicator.indicator}</span>
                          <span className="text-gray-600">
                            {indicator.positiveRate}% ({Math.round((indicator.positiveRate / 100) * indicator.total)}/
                            {indicator.total})
                          </span>
                        </div>
                        <Progress value={indicator.positiveRate} className="h-3" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Condition Frequency Compared by Gender */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Condition Frequency Compared by Gender
                  </CardTitle>
                  <CardDescription>
                    Distribution of common medical conditions between male and female patients
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {conditionsByGender.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                          <span>{item.condition}</span>
                          <span>
                            Male: {item.male} | Female: {item.female}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <div className="flex-1 bg-blue-100 rounded">
                            <div
                              className="bg-blue-500 h-3 rounded"
                              style={{ width: `${(item.male / (item.male + item.female)) * 100}%` }}
                            />
                          </div>
                          <div className="flex-1 bg-pink-100 rounded">
                            <div
                              className="bg-pink-500 h-3 rounded"
                              style={{ width: `${(item.female / (item.male + item.female)) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-center gap-4 text-xs text-gray-600 mt-4">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                        <span>Male</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-pink-500 rounded"></div>
                        <span>Female</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Most Common Condition by Specialty */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Most Common Condition by Specialty
                  </CardTitle>
                  <CardDescription>The most frequently diagnosed condition for each medical specialty</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {conditionsBySpecialty.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.specialty}</p>
                          <p className="text-sm text-gray-600">{item.condition}</p>
                        </div>
                        <Badge variant="secondary" className="text-sm font-medium">
                          {item.count} cases
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Missing SOAP Sections in Patient Notes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Missing SOAP Sections in Patient Notes
                  </CardTitle>
                  <CardDescription>Analysis of incomplete documentation across all medical notes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {missingSoapSections.map((section, index) => (
                      <div key={index} className="text-center p-4 border rounded-lg bg-white">
                        <div className="text-3xl font-bold text-red-600 mb-2">{section.missing}</div>
                        <div className="text-sm font-medium text-gray-900 mb-1">Missing {section.section}</div>
                        <div className="text-xs text-gray-500 mb-3">
                          {((section.missing / section.total) * 100).toFixed(1)}% of {section.total.toLocaleString()}{" "}
                          notes
                        </div>
                        <Progress value={((section.total - section.missing) / section.total) * 100} className="h-2" />
                        <div className="text-xs text-gray-600 mt-1">
                          {(((section.total - section.missing) / section.total) * 100).toFixed(1)}% complete
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Patient Number per Specialty */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Patient Number per Specialty
                  </CardTitle>
                  <CardDescription>Distribution of patients across different medical specialties</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {patientsBySpecialty.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 min-w-0 flex-1">{item.specialty}</span>
                        <div className="flex items-center gap-3 ml-4">
                          <div className="w-32 bg-gray-200 rounded-full h-3">
                            <div
                              className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                              style={{ width: `${(item.patients / totalPatients) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-700 w-16 text-right">
                            {item.patients.toLocaleString()}
                          </span>
                          <span className="text-xs text-gray-500 w-12 text-right">
                            {((item.patients / totalPatients) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Note Analysis Tab */}
          <TabsContent value="analysis" className="mt-6">
            <NoteAnalysis onAddNote={addMedicalNote} />
          </TabsContent>

          {/* Patients Tab */}
          <TabsContent value="patients" className="mt-6">
            <PatientManagement
              patients={patients}
              onUpdatePatient={handlePatientUpdate}
              onAddPatient={(newPatient) => setPatients((prev) => [...prev, newPatient])}
            />
          </TabsContent>

          {/* Insights & Reports Tab */}
          <TabsContent value="insights" className="mt-6">
            <InsightsReports medicalNotes={medicalNotes} patients={patients} />
          </TabsContent>
        </Tabs>
      </nav>
    </div>
  )
}
