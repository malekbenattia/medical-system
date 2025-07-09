import Database from 'better-sqlite3';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  const dbPath = path.join(process.cwd(), 'db', 'medical.db');
  const db = new Database(dbPath);

  const rows = db.prepare('SELECT visits.*, patients.* FROM visits JOIN patients ON visits.patient_ID = patients.patient_ID ').all();

  return NextResponse.json(rows);
}
