"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { Search, Filter, Plus, Eye, AlertTriangle, Calendar, User, Phone, Mail } from "lucide-react"
import { PatientDetailsModal } from "./PatientDetailsModal"
import { AddPatient } from "./AddPatient"

// Update component props to receive patients and handlers from parent
export function PatientManagement({ patients: initialPatients, onUpdatePatient, onAddPatient }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [showPatientDetails, setShowPatientDetails] = useState(false)
  const [showAddPatient, setShowAddPatient] = useState(false)

  // Use patients from props if provided, otherwise use local state
  const [patients, setPatients] = useState(
    initialPatients || [
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
      {
        id: 3,
        name: "Mike Davis",
        age: 58,
        gender: "Male",
        lastVisit: "2024-01-10",
        riskLevel: "Low",
        conditions: ["Arthritis"],
        phone: "(555) 345-6789",
        email: "mike.davis@email.com",
      },
      {
        id: 4,
        name: "Emily Brown",
        age: 67,
        gender: "Female",
        lastVisit: "2024-01-08",
        riskLevel: "High",
        conditions: ["Heart Disease", "Diabetes"],
        phone: "(555) 456-7890",
        email: "emily.brown@email.com",
      },
    ],
  )

  // Update patients when props change
  useEffect(() => {
    if (initialPatients) {
      setPatients(initialPatients)
    }
  }, [initialPatients])

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.conditions.some((condition) => condition.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleUpdatePatient = (updatedPatient) => {
    // Update local state
    setPatients((prev) =>
      prev.map((patient) => (patient.id === updatedPatient.id ? { ...patient, ...updatedPatient } : patient)),
    )

    // Update selected patient if it's the one being edited
    if (selectedPatient && selectedPatient.id === updatedPatient.id) {
      setSelectedPatient(updatedPatient)
    }

    // Call parent update handler if provided
    if (onUpdatePatient) {
      onUpdatePatient(updatedPatient)
    }
  }

  const handleAddPatient = (newPatient) => {
    setPatients((prev) => [...prev, newPatient])
    if (onAddPatient) {
      onAddPatient(newPatient)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
        <Button onClick={() => setShowAddPatient(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Patient
        </Button>
      </div>

      {/* Patient Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => (
          <Card key={patient.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{patient.name}</CardTitle>
                    <CardDescription>
                      {patient.age} years, {patient.gender}
                    </CardDescription>
                  </div>
                </div>
                <Badge
                  variant={
                    patient.riskLevel === "High"
                      ? "destructive"
                      : patient.riskLevel === "Medium"
                        ? "default"
                        : "secondary"
                  }
                >
                  {patient.riskLevel} Risk
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  {patient.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  {patient.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  Last visit: {patient.lastVisit}
                </div>
              </div>

              {/* Conditions */}
              <div>
                <p className="text-sm font-medium mb-2">Conditions:</p>
                <div className="flex flex-wrap gap-1">
                  {patient.conditions.map((condition, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setSelectedPatient(patient)
                    setShowPatientDetails(true)
                  }}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
                {patient.riskLevel === "High" && (
                  <Button size="sm" variant="outline">
                    <AlertTriangle className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{patients.length}</div>
              <div className="text-sm text-gray-600">Total Patients</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {patients.filter((p) => p.riskLevel === "High").length}
              </div>
              <div className="text-sm text-gray-600">High Risk</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {patients.filter((p) => p.riskLevel === "Medium").length}
              </div>
              <div className="text-sm text-gray-600">Medium Risk</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {patients.filter((p) => p.riskLevel === "Low").length}
              </div>
              <div className="text-sm text-gray-600">Low Risk</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patient Details Modal */}
      {showPatientDetails && selectedPatient && (
        <PatientDetailsModal
          patient={selectedPatient}
          onClose={() => {
            setShowPatientDetails(false)
            setSelectedPatient(null)
          }}
          onUpdate={handleUpdatePatient}
        />
      )}

      {/* Add Patient Modal */}
      {showAddPatient && <AddPatient onClose={() => setShowAddPatient(false)} onSave={handleAddPatient} />}
    </div>
  )
}
