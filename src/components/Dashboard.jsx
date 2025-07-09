"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Brain, Search, Settings } from "lucide-react"

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
      </header>\
