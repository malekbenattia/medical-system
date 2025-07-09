import Database from 'better-sqlite3';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  const dbPath = path.join(process.cwd(), 'db', 'medical.db');
  const db = new Database(dbPath);
  let final = {}

  final['kpi_df'] = db.prepare('SELECT * FROM kpi_df').all();

  final['sel_df2'] = db.prepare('SELECT * FROM sel_df2').all();

  final['soap_missing_df'] = db.prepare('SELECT * FROM soap_missing_df').all();

  final['patient_count_df'] = db.prepare('SELECT * FROM patient_count_df').all();

  return NextResponse.json(final);
}


