"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, Save, File, X, CheckCircle, AlertCircle } from "lucide-react"

export function NoteAnalysis({ onAddNote }) {
  const [formData, setFormData] = useState({
    medicalSpecialty: "",
    doctorName: "",
    patientName: "",
    patientId: "",
    date: "",
    chiefComplaint: "",
    transcription: "",
  })

  const [uploadState, setUploadState] = useState({
    isUploading: false,
    uploadProgress: 0,
    uploadedFile: null,
    uploadError: null,
    uploadSuccess: false,
  })

  const fileInputRef = useRef(null)

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Reset upload state
    setUploadState({
      isUploading: true,
      uploadProgress: 0,
      uploadedFile: file,
      uploadError: null,
      uploadSuccess: false,
    })

    try {
      // Validate file type
      const allowedTypes = [
        "text/plain",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ]

      if (!allowedTypes.includes(file.type)) {
        throw new Error("Unsupported file type. Please upload TXT, PDF, DOC, or DOCX files.")
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error("File size too large. Please upload files smaller than 10MB.")
      }

      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        setUploadState((prev) => ({ ...prev, uploadProgress: progress }))
        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      // Process file based on type
      let extractedText = ""
      let extractedData = {}

      if (file.type === "text/plain") {
        extractedText = await readTextFile(file)
        extractedData = parseTextContent(extractedText)
      } else if (file.type === "application/pdf") {
        // For PDF files, we would typically use a PDF parsing library
        extractedText = await simulatePDFExtraction(file)
        extractedData = parseTextContent(extractedText)
      } else if (
        file.type === "application/msword" ||
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        // For Word documents, we would use a library like mammoth.js
        extractedText = await simulateWordExtraction(file)
        extractedData = parseTextContent(extractedText)
      }

      // Update form with extracted data
      setFormData((prev) => ({
        ...prev,
        transcription: extractedText,
        ...extractedData,
      }))

      setUploadState((prev) => ({
        ...prev,
        isUploading: false,
        uploadSuccess: true,
      }))
    } catch (error) {
      setUploadState((prev) => ({
        ...prev,
        isUploading: false,
        uploadError: error.message,
      }))
    }

    // Clear file input
    event.target.value = ""
  }

  const readTextFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result || "")
      reader.onerror = () => reject(new Error("Failed to read file"))
      reader.readAsText(file)
    })
  }

  const simulatePDFExtraction = async (file) => {
    // In a real implementation, you would use a library like pdf-parse or PDF.js
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return `[Extracted from PDF: ${file.name}]

PATIENT: John Doe
DATE: ${new Date().toISOString().split("T")[0]}
PROVIDER: Dr. Smith

CHIEF COMPLAINT: Follow-up visit for chronic condition management

SUBJECTIVE: Patient reports feeling well overall. No new complaints. Medication compliance good.

OBJECTIVE: Vital signs stable. Physical examination unremarkable.

ASSESSMENT: Chronic condition stable and well-controlled.

PLAN: Continue current medications. Follow-up in 3 months.`
  }

  const simulateWordExtraction = async (file) => {
    // In a real implementation, you would use mammoth.js or similar
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return `[Extracted from Word Document: ${file.name}]

Medical Note - Internal Medicine

Patient Name: Jane Smith
Date of Service: ${new Date().toISOString().split("T")[0]}
Provider: Dr. Johnson

Chief Complaint: Annual physical examination

History of Present Illness: 45-year-old female presents for routine annual physical. Reports feeling well.

Physical Examination: Normal physical examination findings.

Assessment and Plan: Continue preventive care measures. Return in one year.`
  }

  const parseTextContent = (text) => {
    const extractedData = {}

    // Simple pattern matching to extract common fields
    const patterns = {
      patientName: /(?:patient|name):\s*([^\n\r]+)/i,
      doctorName: /(?:provider|doctor|dr\.?):\s*([^\n\r]+)/i,
      date: /(?:date|service date):\s*(\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{4})/i,
      chiefComplaint: /(?:chief complaint|cc):\s*([^\n\r]+)/i,
      medicalSpecialty: /(?:specialty|department):\s*([^\n\r]+)/i,
    }

    for (const [field, pattern] of Object.entries(patterns)) {
      const match = text.match(pattern)
      if (match) {
        extractedData[field] = match[1].trim()
      }
    }

    return extractedData
  }

  const clearUploadState = () => {
    setUploadState({
      isUploading: false,
      uploadProgress: 0,
      uploadedFile: null,
      uploadError: null,
      uploadSuccess: false,
    })
  }

  const handleSaveNote = () => {
    if (!formData.transcription) {
      alert("Please fill in at least Patient Name and Transcription fields")
      return
    }

    // Create SOAP structure from transcription (simplified for demo)
    const newNote = {
      patientName: formData.patientName,
      patientId: formData.patientId || `P${Date.now().toString().slice(-6)}`,
      date: formData.date || new Date().toISOString().split("T")[0],
      provider: formData.doctorName || "Unknown Provider",
      noteType: "Clinical Note",
      medicalSpecialty: formData.medicalSpecialty || "General",
      chiefComplaint: formData.chiefComplaint,
      soap: {
        subjective: formData.chiefComplaint || "Patient complaint documented in transcription",
        objective: "Clinical findings documented in transcription",
        assessment: "Assessment documented in transcription",
        plan: "Treatment plan documented in transcription",
      },
      medications: [],
      allergies: [{ allergen: "No known drug allergies", reaction: "None", severity: "None" }],
      transcription: formData.transcription,
    }

    onAddNote(newNote)

    // Clear form after saving
    setFormData({
      medicalSpecialty: "",
      doctorName: "",
      patientName: "",
      patientId: "",
      date: "",
      chiefComplaint: "",
      transcription: "",
    })

    clearUploadState()
    alert("Medical note saved successfully!")
  }

  return (
    <div className="space-y-6">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.pdf,.doc,.docx"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Input Section */}
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Medical Note Input
            </CardTitle>
            <CardDescription>Enter or upload medical notes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Upload Status */}
            {(uploadState.isUploading || uploadState.uploadSuccess || uploadState.uploadError) && (
              <Card className="border-2 border-dashed">
                <CardContent className="p-4">
                  {uploadState.isUploading && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <File className="w-4 h-4" />
                        <span className="text-sm">Uploading {uploadState.uploadedFile?.name}...</span>
                      </div>
                      <Progress value={uploadState.uploadProgress} className="h-2" />
                      <p className="text-xs text-gray-500">{uploadState.uploadProgress}% complete</p>
                    </div>
                  )}

                  {uploadState.uploadSuccess && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">Successfully uploaded {uploadState.uploadedFile?.name}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={clearUploadState}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  {uploadState.uploadError && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">{uploadState.uploadError}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={clearUploadState}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Medical Specialty</label>
                <Input
                  placeholder="e.g., Cardiology, Internal Medicine"
                  value={formData.medicalSpecialty}
                  onChange={(e) => handleInputChange("medicalSpecialty", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Doctor Name</label>
                <Input
                  placeholder="Dr. John Smith"
                  value={formData.doctorName}
                  onChange={(e) => handleInputChange("doctorName", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Patient Name</label>
                <Input
                  placeholder="Patient full name"
                  value={formData.patientName}
                  onChange={(e) => handleInputChange("patientName", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Patient ID</label>
                <Input
                  placeholder="P001234"
                  value={formData.patientId}
                  onChange={(e) => handleInputChange("patientId", e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Date</label>
              <Input type="date" value={formData.date} onChange={(e) => handleInputChange("date", e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Chief Complaint</label>
              <Textarea
                placeholder="Brief description of patient's main concern..."
                className="min-h-[80px]"
                value={formData.chiefComplaint}
                onChange={(e) => handleInputChange("chiefComplaint", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Transcription</label>
              <Textarea
                placeholder="Enter detailed medical note transcription here..."
                value={formData.transcription}
                onChange={(e) => handleInputChange("transcription", e.target.value)}
                className="min-h-[200px]"
              />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSaveNote}>
                <Save className="w-4 h-4 mr-2" />
                Save Note
              </Button>
              <Button variant="outline" onClick={handleFileUpload} disabled={uploadState.isUploading}>
                <Upload className="w-4 h-4 mr-2" />
                {uploadState.isUploading ? "Uploading..." : "Upload File"}
              </Button>
            </div>

            {/* File Upload Instructions */}
            <div className="text-xs text-gray-500 mt-2">
              <p>Supported file types: TXT, PDF, DOC, DOCX (max 10MB)</p>
              <p>The system will automatically extract patient information and populate the form fields.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
