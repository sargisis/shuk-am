import { NextResponse } from "next/server";
import { isSupabaseConfigured, getSupabaseUrl } from "@/lib/supabase/config";
import { isSupabaseSchemaReady } from "@/lib/supabase/ready";

export async function GET() {
  const configured = isSupabaseConfigured();
  const schemaReady = configured ? await isSupabaseSchemaReady() : false;

  return NextResponse.json({
    supabase: {
      configured,
      schemaReady,
      url: configured ? getSupabaseUrl() : null,
    },
  });
}
