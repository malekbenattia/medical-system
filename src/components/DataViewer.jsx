import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"

export function DataViewer() {
  const [patients, setPatients] = useState([])
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const patientsResponse = await fetch("http://localhost:8000/patients")
      const notesResponse = await fetch("http://localhost:8000/medical-notes")
      
      if (!patientsResponse.ok || !notesResponse.ok) {
        throw new Error("Failed to fetch data")
      }
      
      const patientsData = await patientsResponse.json()
      const notesData = await notesResponse.json()
      
      setPatients(patientsData)
      setNotes(notesData)
      
      console.log("Patients data:", patientsData)
      console.log("Notes data:", notesData)
      
    } catch (err) {
      setError(err.message)
      console.error("Error fetching data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Database Data Viewer</h1>
        <Button onClick={fetchData} disabled={loading}>
          {loading ? "Loading..." : "Refresh Data"}
        </Button>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-600">Error: {error}</p>
          </CardContent>
        </Card>
      )}

      {/* Patients Data */}
      <Card>
        <CardHeader>
          <CardTitle>Patients ({patients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {patients.length > 0 ? (
            <div className="space-y-2">
              {patients.slice(0, 5).map((patient, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded border">
                  <pre className="text-sm overflow-x-auto">
                    {JSON.stringify(patient, null, 2)}
                  </pre>
                </div>
              ))}
              {patients.length > 5 && (
                <p className="text-gray-500">... and {patients.length - 5} more</p>
              )}
            </div>
          ) : (
            <p className="text-gray-500">No patients found</p>
          )}
        </CardContent>
      </Card>

      {/* Medical Notes Data */}
      <Card>
        <CardHeader>
          <CardTitle>Medical Notes ({notes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {notes.length > 0 ? (
            <div className="space-y-2">
              {notes.slice(0, 3).map((note, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded border">
                  <pre className="text-sm overflow-x-auto">
                    {JSON.stringify(note, null, 2)}
                  </pre>
                </div>
              ))}
              {notes.length > 3 && (
                <p className="text-gray-500">... and {notes.length - 3} more</p>
              )}
            </div>
          ) : (
            <p className="text-gray-500">No medical notes found</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}