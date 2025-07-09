"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Plus, Eye, AlertTriangle, Calendar, User, Phone, Mail } from "lucide-react"
import { PatientDetailsModal } from "./patient-details-modal"
import { AddPatient } from "./add-patient"
import React from "react"

export function PatientManagement({ patients: initialPatients, onUpdatePatient, onAddPatient }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [showPatientDetails, setShowPatientDetails] = useState(false)
  const [showAddPatient, setShowAddPatient] = useState(false)

  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true)
        setError(null)

        const [patientsRes, visitsRes] = await Promise.all([
          fetch("/api/patients"),
          fetch("/api/visits"),
        ])

        if (!patientsRes.ok || !visitsRes.ok) {
          throw new Error("Failed to fetch data")
        }

        const patientsData = await patientsRes.json()
        const visitsData = await visitsRes.json()

        if (!Array.isArray(visitsData)) {
          console.warn("visitsData is not an array:", visitsData)
          throw new Error("Visits data is not an array")
        }

        const mappedPatients = patientsData.map((patient) => {
          const patientVisits = visitsData
            .filter((visit) => visit.patient_ID === patient.patient_ID)
            .sort((a, b) => new Date(b.date) - new Date(a.date)) // latest first

          return {
            id: patient.patient_ID,
            name: patient.full_name || "",
            age: patient.age || 34,
            gender: patient.gender || "Unknown",
            phone: patient.phone || patient.phone_number || "+216 93 564 852",  //"Not provided",
            email: patient.email || "Not provided",
            lastVisit: patientVisits[0]?.date || "Unknown",
            riskLevel: patient.risk_level || "Low",
            conditions: Array.isArray(patient.conditions)
              ? patient.conditions
              : patient.conditions
              ? JSON.parse(patient.conditions)
              : [],
          }
        })

        setPatients(mappedPatients)
      } catch (err) {
        console.error("Failed to fetch patients:", err)
        setError(err.message)

        if (initialPatients) {
          setPatients(initialPatients)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchPatients()
  }, [initialPatients])

  const filteredPatients = patients.filter((patient) => {
    if (!patient) return false

    const nameMatch = patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false
    const conditionMatch =
      patient.conditions?.some((condition) => condition?.toLowerCase().includes(searchTerm.toLowerCase())) || false

    return nameMatch || conditionMatch
  })

  const handleUpdatePatient = (updatedPatient) => {
    setPatients((prev) =>
      prev.map((patient) => (patient.id === updatedPatient.id ? { ...patient, ...updatedPatient } : patient)),
    )

    if (selectedPatient && selectedPatient.id === updatedPatient.id) {
      setSelectedPatient(updatedPatient)
    }

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

  if (loading) return <p>Loading patients...</p>

  if (error && patients.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center text-red-600">
          <div className="text-lg font-semibold">Error loading patients</div>
          <div className="text-sm">{error}</div>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    )
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
      {showAddPatient && (
        <AddPatient onClose={() => setShowAddPatient(false)} onSave={handleAddPatient} />
      )}
    </div>
  )
}
