"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Progress } from "./ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { X, User, FileText, Pill, AlertTriangle, Plus, Trash2, Save } from "lucide-react"

export function AddPatient({ onClose, onSave }) {
  const [patientData, setPatientData] = useState({
    // Basic Information
    name: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    dateOfBirth: "",
    emergencyContact: "",
    emergencyPhone: "",

    // Risk Assessment
    riskLevel: "Low",

    // Current Conditions
    conditions: [{ condition: "", status: "Active", severity: "Low", diagnosedDate: "" }],

    // Past Medical History
    pastHistory: [{ condition: "", status: "Resolved", severity: "Low", date: "", notes: "" }],

    // Medications
    medications: [{ name: "", dosage: "", frequency: "", prescribedDate: "", prescriber: "" }],

    // Allergies
    allergies: [{ allergen: "", reaction: "", severity: "Mild", discoveredDate: "" }],
  })

  const handleInputChange = (field, value) => {
    setPatientData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleArrayItemChange = (arrayName, index, field, value) => {
    setPatientData((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }))
  }

  const addArrayItem = (arrayName, defaultItem) => {
    setPatientData((prev) => ({
      ...prev,
      [arrayName]: [...prev[arrayName], defaultItem],
    }))
  }

  const removeArrayItem = (arrayName, index) => {
    setPatientData((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index),
    }))
  }

  const getRiskPercentage = (riskLevel) => {
    switch (riskLevel) {
      case "High":
        return 85
      case "Medium":
        return 55
      case "Low":
        return 25
      default:
        return 0
    }
  }

  const handleSave = () => {
    // Basic validation
    if (!patientData.name || !patientData.phone) {
      alert("Please fill in at least Name and Phone number")
      return
    }

    // Create patient object that matches the expected format
    const newPatient = {
      id: Date.now(), // Simple ID generation
      name: patientData.name,
      age: Number.parseInt(patientData.age) || 0,
      gender: patientData.gender,
      phone: patientData.phone,
      email: patientData.email,
      address: patientData.address,
      dateOfBirth: patientData.dateOfBirth,
      emergencyContact: patientData.emergencyContact,
      emergencyPhone: patientData.emergencyPhone,
      riskLevel: patientData.riskLevel,
      lastVisit: new Date().toISOString().split("T")[0],
      // Format conditions for patient card display
      conditions: patientData.conditions.filter((c) => c.condition.trim() !== "").map((c) => c.condition),
      // Store full medical data for detailed view
      fullMedicalData: {
        conditions: patientData.conditions.filter((c) => c.condition.trim() !== ""),
        pastHistory: patientData.pastHistory.filter((h) => h.condition.trim() !== ""),
        medications: patientData.medications.filter((m) => m.name.trim() !== ""),
        allergies: patientData.allergies.filter((a) => a.allergen.trim() !== ""),
      },
    }

    onSave(newPatient)
    onClose()
  }

  const riskPercentage = getRiskPercentage(patientData.riskLevel)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Add New Patient</h2>
              <p className="text-gray-600">Enter patient information and medical details</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <Input
                    placeholder="Enter patient's full name"
                    value={patientData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Age</label>
                  <Input
                    type="number"
                    placeholder="Age"
                    value={patientData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Gender</label>
                  <Select value={patientData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Date of Birth</label>
                  <Input
                    type="date"
                    value={patientData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number *</label>
                  <Input
                    placeholder="(555) 123-4567"
                    value={patientData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    type="email"
                    placeholder="patient@email.com"
                    value={patientData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Address</label>
                <Input
                  placeholder="Street address, City, State, ZIP"
                  value={patientData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Emergency Contact</label>
                  <Input
                    placeholder="Emergency contact name"
                    value={patientData.emergencyContact}
                    onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Emergency Phone</label>
                  <Input
                    placeholder="Emergency contact phone"
                    value={patientData.emergencyPhone}
                    onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Assessment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Overall Risk Level</label>
                <Select value={patientData.riskLevel} onValueChange={(value) => handleInputChange("riskLevel", value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High Risk</SelectItem>
                    <SelectItem value="Medium">Medium Risk</SelectItem>
                    <SelectItem value="Low">Low Risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Risk Percentage</span>
                  <span>{riskPercentage}%</span>
                </div>
                <Progress
                  value={riskPercentage}
                  className={`h-3 ${
                    patientData.riskLevel === "High"
                      ? "[&>div]:bg-red-500"
                      : patientData.riskLevel === "Medium"
                        ? "[&>div]:bg-yellow-500"
                        : "[&>div]:bg-green-500"
                  }`}
                />
              </div>
            </CardContent>
          </Card>

          {/* Current Conditions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Current Conditions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {patientData.conditions.map((condition, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
                  <div>
                    <label className="block text-sm font-medium mb-2">Condition</label>
                    <Input
                      placeholder="e.g., Diabetes"
                      value={condition.condition}
                      onChange={(e) => handleArrayItemChange("conditions", index, "condition", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Status</label>
                    <Select
                      value={condition.status}
                      onValueChange={(value) => handleArrayItemChange("conditions", index, "status", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Controlled">Controlled</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Severity</label>
                    <Select
                      value={condition.severity}
                      onValueChange={(value) => handleArrayItemChange("conditions", index, "severity", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Diagnosed Date</label>
                    <Input
                      type="date"
                      value={condition.diagnosedDate}
                      onChange={(e) => handleArrayItemChange("conditions", index, "diagnosedDate", e.target.value)}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeArrayItem("conditions", index)}
                      disabled={patientData.conditions.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() =>
                  addArrayItem("conditions", { condition: "", status: "Active", severity: "Low", diagnosedDate: "" })
                }
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Condition
              </Button>
            </CardContent>
          </Card>

          {/* Past Medical History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Past Medical History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {patientData.pastHistory.map((history, index) => (
                <div key={index} className="grid grid-cols-1 gap-4 p-4 border rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Condition</label>
                      <Input
                        placeholder="e.g., Appendectomy"
                        value={history.condition}
                        onChange={(e) => handleArrayItemChange("pastHistory", index, "condition", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Status</label>
                      <Select
                        value={history.status}
                        onValueChange={(value) => handleArrayItemChange("pastHistory", index, "status", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Resolved">Resolved</SelectItem>
                          <SelectItem value="Chronic">Chronic</SelectItem>
                          <SelectItem value="Ongoing">Ongoing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Severity</label>
                      <Select
                        value={history.severity}
                        onValueChange={(value) => handleArrayItemChange("pastHistory", index, "severity", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Date</label>
                      <Input
                        type="date"
                        value={history.date}
                        onChange={(e) => handleArrayItemChange("pastHistory", index, "date", e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Notes</label>
                    <Textarea
                      placeholder="Additional notes about this condition..."
                      value={history.notes}
                      onChange={(e) => handleArrayItemChange("pastHistory", index, "notes", e.target.value)}
                      className="min-h-[60px]"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem("pastHistory", index)}
                      disabled={patientData.pastHistory.length === 1}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() =>
                  addArrayItem("pastHistory", {
                    condition: "",
                    status: "Resolved",
                    severity: "Low",
                    date: "",
                    notes: "",
                  })
                }
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Medical History
              </Button>
            </CardContent>
          </Card>

          {/* Medications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="w-5 h-5" />
                Current Medications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {patientData.medications.map((medication, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border rounded-lg">
                  <div>
                    <label className="block text-sm font-medium mb-2">Medication</label>
                    <Input
                      placeholder="e.g., Metformin"
                      value={medication.name}
                      onChange={(e) => handleArrayItemChange("medications", index, "name", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Dosage</label>
                    <Input
                      placeholder="e.g., 500mg"
                      value={medication.dosage}
                      onChange={(e) => handleArrayItemChange("medications", index, "dosage", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Frequency</label>
                    <Input
                      placeholder="e.g., Twice daily"
                      value={medication.frequency}
                      onChange={(e) => handleArrayItemChange("medications", index, "frequency", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Prescribed Date</label>
                    <Input
                      type="date"
                      value={medication.prescribedDate}
                      onChange={(e) => handleArrayItemChange("medications", index, "prescribedDate", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Prescriber</label>
                    <Input
                      placeholder="Dr. Smith"
                      value={medication.prescriber}
                      onChange={(e) => handleArrayItemChange("medications", index, "prescriber", e.target.value)}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeArrayItem("medications", index)}
                      disabled={patientData.medications.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() =>
                  addArrayItem("medications", {
                    name: "",
                    dosage: "",
                    frequency: "",
                    prescribedDate: "",
                    prescriber: "",
                  })
                }
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Medication
              </Button>
            </CardContent>
          </Card>

          {/* Allergies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Allergies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {patientData.allergies.map((allergy, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
                  <div>
                    <label className="block text-sm font-medium mb-2">Allergen</label>
                    <Input
                      placeholder="e.g., Penicillin"
                      value={allergy.allergen}
                      onChange={(e) => handleArrayItemChange("allergies", index, "allergen", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Reaction</label>
                    <Input
                      placeholder="e.g., Rash, swelling"
                      value={allergy.reaction}
                      onChange={(e) => handleArrayItemChange("allergies", index, "reaction", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Severity</label>
                    <Select
                      value={allergy.severity}
                      onValueChange={(value) => handleArrayItemChange("allergies", index, "severity", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Severe">Severe</SelectItem>
                        <SelectItem value="Moderate">Moderate</SelectItem>
                        <SelectItem value="Mild">Mild</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Discovered Date</label>
                    <Input
                      type="date"
                      value={allergy.discoveredDate}
                      onChange={(e) => handleArrayItemChange("allergies", index, "discoveredDate", e.target.value)}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeArrayItem("allergies", index)}
                      disabled={patientData.allergies.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() =>
                  addArrayItem("allergies", { allergen: "", reaction: "", severity: "Mild", discoveredDate: "" })
                }
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Allergy
              </Button>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Patient
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
