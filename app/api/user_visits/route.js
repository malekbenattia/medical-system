import Database from 'better-sqlite3';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const dbPath = path.join(process.cwd(), 'db', 'medical.db');
  const db = new Database(dbPath);
  
  const url = new URL(request.url); // Construct a URL object
  const searchParams = url.searchParams; // Get the searchParams object
  const patient_id = searchParams.get('patient_ID'); 

  const rows = db.prepare('SELECT visits.*, patients.* FROM visits JOIN patients ON visits.patient_ID = patients.patient_ID where patients.patient_ID = ?').get(patient_id);

  return NextResponse.json(rows);
}
