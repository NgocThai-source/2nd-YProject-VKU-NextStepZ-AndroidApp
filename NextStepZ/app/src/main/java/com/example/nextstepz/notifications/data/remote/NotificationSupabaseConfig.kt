package com.example.nextstepz.notifications.data.remote

/**
 * Connection details for the NextStepZ Supabase project. The Notifications tab
 * reads the `notifications` table directly via PostgREST.
 *
 * ⚠️ Security note: the service-role key bypasses Row Level Security. It is used
 * here only because this app authenticates against the custom Node backend (not
 * Supabase Auth), so there is no Supabase session to drive RLS. For a public
 * production release these calls should go through an authenticated backend.
 */
object NotificationSupabaseConfig {
    const val BASE_URL = "https://isnerjcpwzxduvklwvfx.supabase.co/"

    const val API_KEY =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzbmVyamNwd3p4ZHV2a2x3dmZ4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzk4NDQzNywiZXhwIjoyMDkzNTYwNDM3fQ.oKKpHmV0hanLZYcRgoztp9CUARTU9HvqwmJXoiyVwu0"
}
