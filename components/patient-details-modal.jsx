"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Progress } from "./ui/progress"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import {
  X,
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
  FileText,
  Pill,
  Clock,
  Edit,
  Save,
  Plus,
  Trash2,
} from "lucide-react"
import { Textarea } from "./ui/textarea"

const FEATURE_NAME_MAP = {
  allergy_allergies: "Allergies",
  allergy_asthma: "Asthma",
  allergy_nasal: "Nasal Allergy",
  allergy_hives: "Hives",
  allergy_rhinitis: "Rhinitis",
  bariatrics_gastric: "Gastric Surgery",
  bariatrics_bypass: "Gastric Bypass",
  cardiopulm_embolism: "Pulmonary Embolism",
  cardiopulm_bronchitis: "Bronchitis",
  cardiopulm_asthma: "Asthma (Cardiopulmonary)",
  cardiopulm_arrhythmia: "Arrhythmia",
  cardiopulm_hypertension: "Hypertension (Cardiopulmonary)",
  chiro_cervical_pain: "Cervical Pain",
  chiro_spine_alignment_issue: "Spine Alignment Issue",
  chiro_lumbar_pain: "Lumbar Pain",
  chiro_thoracic_pain: "Thoracic Pain",
  cosmetic_implant: "Cosmetic Implant",
  cosmetic_scar: "Cosmetic Scar",
  cosmetic_liposuction: "Liposuction",
  dent_dental_extraction: "Dental Extraction",
  dent_caries: "Caries",
  dent_cavity: "Cavity",
  dent_implant: "Dental Implant",
  dent_prosthesis: "Dental Prosthesis",
  derm_lesion: "Skin Lesion",
  derm_biopsy: "Skin Biopsy",
  derm_acne: "Acne",
  derm_psoriasis: "Psoriasis",
  derm_eczema: "Eczema",
  diet_weight_loss: "Weight Loss Program",
  diet_diabetes: "Diabetes Diet",
  diet_bmi: "BMI Management",
  diet_obesity: "Obesity Management",
  diet_cholesterol: "Cholesterol Diet",
  endo_thyroid: "Thyroid Condition",
  endo_diabetes: "Endocrine Diabetes",
  endo_parathyroid: "Parathyroid Condition",
  endo_calcium: "Calcium Disorder",
  ent_otitis: "Otitis",
  ent_hearing_loss: "Hearing Loss",
  ent_tonsillitis: "Tonsillitis",
  ent_sleep_apnea: "Sleep Apnea",
  ent_sinusitis: "Sinusitis",
  gi_colonoscopy: "Colonoscopy",
  gi_abdominal_pain: "Abdominal Pain",
  gi_endoscopy: "Endoscopy",
  gi_nausea: "Nausea",
  gi_vomiting: "Vomiting",
  gi_diarrhea: "Diarrhea",
  gi_constipation: "Constipation",
  hemeonc_tumor_mass: "Tumor or Mass",
  hemeonc_radiation: "Radiation Therapy",
  hemeonc_chemotherapy: "Chemotherapy",
  hemeonc_lymphoma: "Lymphoma",
  hemeonc_breast_cancer: "Breast Cancer",
  neph_creatinine: "Creatinine Issues",
  neph_renal_failure: "Renal Failure",
  neph_dialysis: "Dialysis",
  neph_hematuria: "Hematuria",
  neph_renal_stone: "Kidney Stones",
  neuro_weakness: "Neurological Weakness",
  neuro_numbness: "Numbness",
  neuro_headache: "Headache",
  neuro_migraine: "Migraine",
  neuro_stroke: "Stroke",
  neuro_seizure: "Seizure",
  neuro_aphasia: "Aphasia",
  obgyn_pregnancy: "Pregnancy",
  obgyn_hysterectomy: "Hysterectomy",
  obgyn_labor: "Labor",
  obgyn_delivery: "Delivery",
  obgyn_pelvic_pain: "Pelvic Pain",
  obgyn_endometriosis: "Endometriosis",
  oph_cataract: "Cataract",
  oph_intraocular_pressure: "Intraocular Pressure",
  oph_glaucoma: "Glaucoma",
  oph_retinal_detachment: "Retinal Detachment",
  ortho_fracture: "Bone Fracture",
  ortho_spinal_fusion: "Spinal Fusion",
  ortho_joint_replacement: "Joint Replacement",
  ortho_carpal_tunnel: "Carpal Tunnel Syndrome",
  ortho_arthroscopy: "Arthroscopy",
  peds_respiratory_distress_syndrome: "Respiratory Distress Syndrome (Peds)",
  peds_neonatal_sepsis: "Neonatal Sepsis",
  peds_neonatal_jaundice: "Neonatal Jaundice",
  peds_prematurity: "Prematurity",
  psych_depression: "Depression",
  psych_anxiety: "Anxiety",
  psych_bipolar_disorder: "Bipolar Disorder",
  psych_substance_abuse: "Substance Abuse",
  psych_suicidal_ideation: "Suicidal Ideation",
  psych_insomnia: "Insomnia",
  rad_mri: "MRI Scan",
  rad_ct_scan: "CT Scan",
  rad_contrast_administered: "Contrast Administered",
  rad_mass___lesion: "Mass / Lesion",
  rad_ultrasound: "Ultrasound",
  uro_hematuria: "Hematuria (Urology)",
  uro_prostate_cancer: "Prostate Cancer",
  uro_urinary_incontinence: "Urinary Incontinence",
  uro_urinary_retention: "Urinary Retention",
}

// Update the component props to include onUpdate
export function PatientDetailsModal({ patient, onClose, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [editedData, setEditedData] = useState({
    id: patient.id,
    name: patient.name,
    age: patient.age,
    gender: patient.gender,
    phone: patient.phone,
    email: patient.email,
    riskLevel: patient.riskLevel,
    conditions: [],
    pastMedicalHistory: [],
    medications: [],
    allergies: [],
  })

  // State for fetched data
  const [conditions, setConditions] = useState([])
  const [pastMedicalHistory, setPastMedicalHistory] = useState([])
  const [allergies, setAllergies] = useState([])
  const [medicalNotes, setMedicalNotes] = useState([])
  

  // Static medications data (you can also fetch this from another table if needed)
  const medications = [
    {
      name: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      prescribedDate: "2024-01-15",
      prescriber: "Dr. Smith",
    },
    {
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      prescribedDate: "2023-08-22",
      prescriber: "Dr. Johnson",
    },
    {
      name: "Atorvastatin",
      dosage: "20mg",
      frequency: "Once daily",
      prescribedDate: "2023-03-10",
      prescriber: "Dr. Wilson",
    },
    {
      name: "Aspirin",
      dosage: "81mg",
      frequency: "Once daily",
      prescribedDate: "2023-08-22",
      prescriber: "Dr. Johnson",
    },
  ]

  // Fetch patient conditions and medical data
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch conditions from extracted_features table
        console.log("Patient object:", patient);
        const conditionsResponse = await fetch(`/api/extracted_features?full_name=${encodeURIComponent(patient.name)}`)

        if (!conditionsResponse.ok) {
          throw new Error(`Failed to fetch conditions: ${conditionsResponse.status}`)
}

        const featuresData = await conditionsResponse.json()
       // setConditions(featuresData)


        //const featuresData = await conditionsResponse.json()
        //console.log("Fetched features data:", featuresData) // Debug log

        const mappedConditions = Object.entries(featuresData).map(([condition, value]) => ({
          condition: FEATURE_NAME_MAP[condition] || condition,              
          status: "Active",       // default
          severity: "Medium",     // default
          diagnosedDate: new Date().toISOString().split("T")[0], // today
}));


        console.log("Mapped conditions:", mappedConditions) // Debug log

        setConditions(mappedConditions)

        // Update editedData with fetched conditions
        setEditedData((prev) => ({
          ...prev,
          conditions: mappedConditions,
        }))

        // Fetch patient PMH and medical data

        useEffect(() => {
            console.log(11)

            const fetchPastMedicalHistory = async () => {
              try {
                const response = await fetch(`/api/user_visits?patient_ID=${patient.id}`);
                const data = await response.json();
            
                if (!response.ok) {
                  throw new Error(data.error || "Failed to fetch");
              }
                console.log(data)
                // setPastMedicalHistory(data.past_medical_history);
            } catch (err) {
              console.error("Error fetching past medical history:", err);
              setPastMedicalHistory([]);        //("Unavailable");
            }
          };

          if (patient?.id) {
            fetchPastMedicalHistory();
            console.log(33)
          }
        }, [patient.id]);

        // Placeholder for past medical history (replace with actual API call if you have this data)
        const defaultPastHistory = [
          {
            date: "2022-11-05",
            condition: "Osteoarthritis",
            status: "Chronic",
            severity: "Medium",
            notes: "Bilateral knee involvement",
          },
          {
            date: "2021-06-15",
            condition: "Appendectomy",
            status: "Resolved",
            severity: "Low",
            notes: "Laparoscopic procedure, no complications",
          },
        ]

        setPastMedicalHistory(defaultPastHistory)

        // Placeholder for allergies (replace with actual API call if you have this data)
        const defaultAllergies = [
          {
            allergen: "Penicillin",
            reaction: "Rash, difficulty breathing",
            severity: "Severe",
            discoveredDate: "2015-05-12",
          },
          {
            allergen: "Shellfish",
            reaction: "Hives, swelling",
            severity: "Moderate",
            discoveredDate: "2018-07-20",
          },
        ]

        setAllergies(defaultAllergies)

        setEditedData((prev) => ({
          ...prev,
          pastMedicalHistory: defaultPastHistory,
          medications: medications,
          allergies: defaultAllergies,
        }))
      } catch (err) {
        console.error("Error fetching patient data:", err)
        setError(err.message)

        // Fallback to default data if API fails
        const fallbackConditions = [
          {
            condition: "No conditions found",
            status: "Active",
            severity: "Low",
            diagnosedDate: new Date().toISOString().split("T")[0],
          },
        ]

        setConditions(fallbackConditions)
        setEditedData((prev) => ({
          ...prev,
          conditions: fallbackConditions,
        }))
      } finally {
        setLoading(false)
      }
    }

    if (patient?.name) {
      fetchPatientData()
    }
  }, [patient?.name])

//FETCHIING PMH
    useEffect(() => {
    const fetchPastMedicalHistory = async () => {
      try {
        const response = await fetch(`/api/user_visits?patient_ID=${patient.id}`);
        const data = await response.json();
    
        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch");
      }

      console.log(data)

//       const mappedPMH = Object.entries(data).map(([pastMedicalHistory, value]) => ({
//           pastMedicalHistory,       
//           status: "Active",       
//           severity: "Medium",     
//          diagnosedDate: new Date().toISOString().split("T")[0], // today
// }))
//       console.log(mappedPMH)
        setPastMedicalHistory([
          {
            date: "",
            condition: "",
            status: "",
            severity: "",
            notes: data.past_medical_history,
          }]);
    } catch (err) {
      console.error("Error fetching past medical history:", err);
      setPastMedicalHistory([]);       
    }
  };

  if (patient?.id) {
    fetchPastMedicalHistory();
  }
}, [patient.id]);  

  const addCondition = () => {
    setEditedData((prev) => ({
      ...prev,
      conditions: [...prev.conditions, { condition: "", status: "Active", severity: "Low", diagnosedDate: "" }],
    }))
  }

  // Update filtered notes to use current patient names if available
  const filteredNotes = medicalNotes
    .map((data) => ({
      ...data,
      patientName: data.full_name || patientNameMap[data.patientId]  ,
    }))

  const removeCondition = (index) => {
    setEditedData((prev) => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index),
    }))
  }

  const updateCondition = (index, field, value) => {
    setEditedData((prev) => ({
      ...prev,
      conditions: prev.conditions.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }))
  }

  // Similar functions for pastMedicalHistory, medications, and allergies
  const addMedication = () => {
    setEditedData((prev) => ({
      ...prev,
      medications: [...prev.medications, { name: "", dosage: "", frequency: "", prescribedDate: "", prescriber: "" }],
    }))
  }

  const removeMedication = (index) => {
    setEditedData((prev) => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index),
    }))
  }

  const updateMedication = (index, field, value) => {
    setEditedData((prev) => ({
      ...prev,
      medications: prev.medications.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }))
  }

  const addAllergy = () => {
    setEditedData((prev) => ({
      ...prev,
      allergies: [...prev.allergies, { allergen: "", reaction: "", severity: "Mild", discoveredDate: "" }],
    }))
  }

  const removeAllergy = (index) => {
    setEditedData((prev) => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index),
    }))
  }

  const updateAllergy = (index, field, value) => {
    setEditedData((prev) => ({
      ...prev,
      allergies: prev.allergies.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }))
  }

  const addHistory = () => {
    setEditedData((prev) => ({
      ...prev,
      pastMedicalHistory: [
        ...prev.pastMedicalHistory,
        { condition: "", status: "Resolved", severity: "Low", date: "", notes: "" },
      ],
    }))
  }

  const removeHistory = (index) => {
    setEditedData((prev) => ({
      ...prev,
      pastMedicalHistory: prev.pastMedicalHistory.filter((_, i) => i !== index),
    }))
  }

  const updateHistory = (index, field, value) => {
    setEditedData((prev) => ({
      ...prev,
      pastMedicalHistory: prev.pastMedicalHistory.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }))
  }

  // Calculate risk percentage based on patient risk level
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

  const handleEdit = () => {
    setIsEditing(true)
  }

  // Update the handleSave function to call onUpdate
  const handleSave = () => {
    // Create updated patient object with all changes
    const updatedPatient = {
      id: patient.id,
      name: editedData.name,
      age: Number.parseInt(editedData.age) || patient.age,
      gender: editedData.gender,
      phone: editedData.phone,
      email: editedData.email,
      riskLevel: editedData.riskLevel,
      lastVisit: patient.lastVisit,
      conditions: editedData.conditions.map((c) => c.condition).filter((c) => c.trim() !== ""),
      // Add other fields that might be displayed in patient cards
    }

    // Update all the local state with edited data
    setConditions(editedData.conditions)
    setPastMedicalHistory(editedData.pastMedicalHistory)
    setAllergies(editedData.allergies)

    // Call the parent update function to sync changes across the app
    if (onUpdate) {
      onUpdate(updatedPatient)
    }

    console.log("Saving patient data:", editedData)
    setIsEditing(false)
    alert("Patient information updated successfully!")
  }

  const handleCancel = () => {
    setEditedData({
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      phone: patient.phone,
      email: patient.email,
      riskLevel: patient.riskLevel,
      conditions: [...conditions],
      pastMedicalHistory: [...pastMedicalHistory],
      medications: [...medications],
      allergies: [...allergies],
    })
    setIsEditing(false)
  }

  const handleInputChange = (field, value) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const riskPercentage = getRiskPercentage(isEditing ? editedData.riskLevel : patient.riskLevel)

  // Show loading state
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-8">
          <div className="text-center">
            <div className="text-lg font-semibold">Loading patient details...</div>
            <div className="text-gray-600">Fetching medical data...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              {isEditing ? (
                <div className="space-y-2">
                  <Input
                    value={editedData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="text-2xl font-bold"
                  />
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={editedData.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                      className="w-20"
                      placeholder="Age"
                    />
                    <Select value={editedData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold">{editedData.name}</h2>
                  <p className="text-gray-600">
                    {editedData.age} years old • {editedData.gender} • Patient ID:{" "}
                    {patient.id.toString().padStart(6, "0")}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={handleEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Show error message if there was an issue fetching data */}
          {error && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-yellow-800">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm">Warning: {error}. Showing default data.</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contact & Risk Assessment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <Input
                        value={editedData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="Phone number"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <Input
                        value={editedData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="Email address"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>123 Main St, City, State 12345</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>Last Visit: {patient.lastVisit}</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>{editedData.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span>{editedData.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>123 Main St, City, State 12345</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>Last Visit: {patient.lastVisit}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Overall Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">Risk Level</span>
                  {isEditing ? (
                    <Select
                      value={editedData.riskLevel}
                      onValueChange={(value) => handleInputChange("riskLevel", value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge
                      variant={
                        editedData.riskLevel === "High"
                          ? "destructive"
                          : editedData.riskLevel === "Medium"
                            ? "default"
                            : "secondary"
                      }
                      className="text-lg px-4 py-2"
                    >
                      {editedData.riskLevel}
                    </Badge>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Risk Percentage</span>
                    <span>{riskPercentage}%</span>
                  </div>
                  <Progress
                    value={riskPercentage}
                    className={`h-3 ${
                      editedData.riskLevel === "High"
                        ? "[&>div]:bg-red-500"
                        : editedData.riskLevel === "Medium"
                          ? "[&>div]:bg-yellow-500"
                          : "[&>div]:bg-green-500"
                    }`}
                  />
                </div>
                <p className="text-sm text-gray-600">Based on current conditions and medical history</p>
              </CardContent>
            </Card>
          </div>

          {/* Current Conditions - Now fetched from database */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Current Conditions
                <Badge variant="secondary" className="ml-2 text-xs">
                  Active Features
                </Badge>
                {isEditing && (
                  <Button size="sm" variant="outline" onClick={addCondition}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {conditions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No active conditions found for this patient</p>
                  <p className="text-sm">All extracted features returned "no" values</p>
                </div>
              ) : isEditing ? (
                <div className="space-y-4">
                  {editedData.conditions.map((condition, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
                      <div>
                        <label className="block text-sm font-medium mb-2">Condition</label>
                        <Input
                          value={condition.condition}
                          onChange={(e) => updateCondition(index, "condition", e.target.value)}
                          placeholder="e.g., Diabetes"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Status</label>
                        <Select
                          value={condition.status}
                          onValueChange={(value) => updateCondition(index, "status", value)}
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
                          onValueChange={(value) => updateCondition(index, "severity", value)}
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
                          onChange={(e) => updateCondition(index, "diagnosedDate", e.target.value)}
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removeCondition(index)}
                          disabled={editedData.conditions.length === 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {conditions.map((condition, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <p className="text-sm text-gray-600">{condition.condition}</p>
                      <p className="text-lg font-semibold">{condition.status}</p>
                      <div className="flex justify-between items-center mt-2">
                        <Badge variant={getSeverityVariant(condition.severity)}>{condition.severity}</Badge>
                        <span className="text-xs text-gray-500">{condition.diagnosedDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Past Medical History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Past Medical History
                {isEditing && (
                  <Button size="sm" variant="outline" onClick={addHistory}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
                       
                         
              {isEditing ? ( 


                <div className="space-y-3">
                  
                   { editedData.pastMedicalHistory.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 space-y-1">
                        <label className="block text-sm font-medium">Condition</label>
                        <Input
                         // value={medicalNotes.past_medical_history}
                          //onChange={(e) => updateHistory(index, "condition", e.target.value)}
                         // placeholder="Condition"
                        />
                        <label className="block text-sm font-medium">Notes</label>
                        <Textarea
                          value={data.past_medical_history}
                         // onChange={(e) => updateHistory(index, "notes", e.target.value)}
                          //placeholder="Notes"
                        />
                        <div className="flex gap-2">
                          <div>
                            <label className="block text-sm font-medium">Date</label>
                            <Input
                              type="date"
                              value={item.date}
                              onChange={(e) => updateHistory(index, "date", e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium">Status</label>
                            <Select
                              value={item.status}
                              onValueChange={(value) => updateHistory(index, "status", value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Chronic">Chronic</SelectItem>
                                <SelectItem value="Resolved">Resolved</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium">Severity</label>
                            <Select
                              value={item.severity}
                              onValueChange={(value) => updateHistory(index, "severity", value)}
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
                        </div>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removeHistory(index)}
                          disabled={editedData.pastMedicalHistory.length === 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {pastMedicalHistory.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{item.condition}</p>
                        <p className="text-sm text-gray-600">{item.notes}</p>
                        <p className="text-xs text-gray-500">Date: {item.date}</p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Badge variant="outline">{item.status}</Badge>
                        <Badge variant={getSeverityVariant(item.severity)}>{item.severity}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Current Medications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="w-5 h-5" />
                Current Medications
                {isEditing && (
                  <Button size="sm" variant="outline" onClick={addMedication}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  {editedData.medications.map((med, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                      <div>
                        <label className="block text-sm font-medium mb-2">Name</label>
                        <Input
                          value={med.name}
                          onChange={(e) => updateMedication(index, "name", e.target.value)}
                          placeholder="e.g., Metformin"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Dosage</label>
                        <Input
                          value={med.dosage}
                          onChange={(e) => updateMedication(index, "dosage", e.target.value)}
                          placeholder="e.g., 500mg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Frequency</label>
                        <Input
                          value={med.frequency}
                          onChange={(e) => updateMedication(index, "frequency", e.target.value)}
                          placeholder="e.g., Twice daily"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Prescribed Date</label>
                        <Input
                          type="date"
                          value={med.prescribedDate}
                          onChange={(e) => updateMedication(index, "prescribedDate", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Prescriber</label>
                        <Input
                          value={med.prescriber}
                          onChange={(e) => updateMedication(index, "prescriber", e.target.value)}
                          placeholder="e.g., Dr. Smith"
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removeMedication(index)}
                          disabled={editedData.medications.length === 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {medications.map((med, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <h4 className="font-semibold">{med.name}</h4>
                      <p className="text-sm text-gray-600">
                        {med.dosage} - {med.frequency}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Prescribed: {med.prescribedDate} by {med.prescriber}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Allergies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Allergies
                {isEditing && (
                  <Button size="sm" variant="outline" onClick={addAllergy}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-3">
                  {editedData.allergies.map((allergy, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200"
                    >
                      <div className="flex-1 space-y-1">
                        <label className="block text-sm font-medium">Allergen</label>
                        <Input
                          value={allergy.allergen}
                          onChange={(e) => updateAllergy(index, "allergen", e.target.value)}
                          placeholder="Allergen"
                        />
                        <label className="block text-sm font-medium">Reaction</label>
                        <Input
                          value={allergy.reaction}
                          onChange={(e) => updateAllergy(index, "reaction", e.target.value)}
                          placeholder="Reaction"
                        />
                        <div className="flex gap-2">
                          <div>
                            <label className="block text-sm font-medium">Discovered Date</label>
                            <Input
                              type="date"
                              value={allergy.discoveredDate}
                              onChange={(e) => updateAllergy(index, "discoveredDate", e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium">Severity</label>
                            <Select
                              value={allergy.severity}
                              onValueChange={(value) => updateAllergy(index, "severity", value)}
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
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeAllergy(index)}
                        disabled={editedData.allergies.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {allergies.map((allergy, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        allergy.severity === "Severe"
                          ? "bg-red-50 border border-red-200"
                          : allergy.severity === "Moderate"
                            ? "bg-yellow-50 border border-yellow-200"
                            : "bg-blue-50 border border-blue-200"
                      }`}
                    >
                      <div className="flex-1">
                        <p className="font-medium">{allergy.allergen}</p>
                        <p className="text-sm text-gray-600">{allergy.reaction}</p>
                        <p className="text-xs text-gray-500">Discovered: {allergy.discoveredDate}</p>
                      </div>
                      <Badge variant={getSeverityVariant(allergy.severity)}>{allergy.severity}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
