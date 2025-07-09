/*import Database from 'better-sqlite3';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  const dbPath = path.join(process.cwd(), 'db', 'medical.db');
  const db = new Database(dbPath);

  const rows = db.prepare('SELECT * FROM extracted_features ').all();

  return NextResponse.json(rows);
}*/

// /app/api/extracted_features/route.js
import Database from 'better-sqlite3';
import path from 'path';
import { NextResponse } from 'next/server';

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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const fullName = searchParams.get("full_name");

    if (!fullName) {
      return NextResponse.json({ error: "Missing full_name" }, { status: 400 });
    }

    const dbPath = path.join(process.cwd(), 'db', 'medical.db');
    const db = new Database(dbPath);

    const row = db.prepare('SELECT * FROM extracted_features WHERE full_name = ?').get(fullName);

    if (!row) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    // Filter only "yes" features
    const yesFeatures = {};
    for (const [key, value] of Object.entries(row)) {
      if (value === "yes" && key !== "full_name") {
        yesFeatures[key] = value;
      }
    }

    db.close();
    return NextResponse.json(yesFeatures);
  } catch (error) {
    console.error("Error fetching features:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
