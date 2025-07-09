"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { Search, Filter, FileText, Calendar, User, Eye } from "lucide-react"

// Update component to accept and handle patient updates
export function InsightsReports({ medicalNotes = [], patients = [] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedNote, setSelectedNote] = useState(null)

  // Create a map of patient IDs to current patient names for reference
  const patientNameMap = useMemo(() => {
    const map = {}
    patients.forEach((patient) => {
      map[`P${patient.id.toString().padStart(6, "0")}`] = patient.name
    })
    return map
  }, [patients])

  // Update filtered notes to use current patient names if available
  const filteredNotes = medicalNotes
    .map((note) => ({
      ...note,
      patientName: patientNameMap[note.patientId] || note.patientName,
    }))
    .filter(
      (note) =>
        note.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.noteType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (note.medicalSpecialty && note.medicalSpecialty.toLowerCase().includes(searchTerm.toLowerCase())),
    )

  const getSeverityVariant = (severity) => {
    switch (severity) {
      case "High":
      case "Severe":
        return "destructive"
      case "Medium":
      case "Moderate":
        return "default"
      case "Low":
      case "Mild":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Medical Notes Repository</h2>
          <p className="text-gray-600">Structured clinical documentation with SOAP format</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search notes..."
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
      </div>

      {/* Notes List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredNotes.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No medical notes found. Create your first note in the Note Analysis section.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredNotes.map((note) => (
            <Card key={note.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        {note.noteType} - {note.patientName}
                        {note.id > 2 && (
                          <Badge variant="secondary" className="ml-2">
                            New
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          Patient ID: {note.patientId}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {note.date}
                        </span>
                        <span>Provider: {note.provider}</span>
                        {note.medicalSpecialty && <span>Specialty: {note.medicalSpecialty}</span>}
                      </CardDescription>
                      {note.chiefComplaint && (
                        <p className="text-sm text-gray-600 mt-2">
                          <strong>Chief Complaint:</strong> {note.chiefComplaint}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedNote(selectedNote === note.id ? null : note.id)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      {selectedNote === note.id ? "Hide Details" : "View Details"}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {selectedNote === note.id && (
                <CardContent className="space-y-6">
                  {/* Show transcription if available */}
                  {note.transcription && (
                    <Card className="bg-gray-50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Original Transcription</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm whitespace-pre-wrap">{note.transcription}</p>
                      </CardContent>
                    </Card>
                  )}

                  {/* SOAP Notes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Subjective */}
                    <Card className="bg-blue-50 border-blue-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-blue-800">Subjective</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-blue-900">{note.soap.subjective}</p>
                      </CardContent>
                    </Card>

                    {/* Objective */}
                    <Card className="bg-green-50 border-green-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-green-800">Objective</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-green-900">{note.soap.objective}</p>
                      </CardContent>
                    </Card>

                    {/* Assessment */}
                    <Card className="bg-yellow-50 border-yellow-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-yellow-800">Assessment</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <pre className="text-sm text-yellow-900 whitespace-pre-wrap font-sans">
                          {note.soap.assessment}
                        </pre>
                      </CardContent>
                    </Card>

                    {/* Plan */}
                    <Card className="bg-purple-50 border-purple-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-purple-800">Plan</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <pre className="text-sm text-purple-900 whitespace-pre-wrap font-sans">{note.soap.plan}</pre>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
