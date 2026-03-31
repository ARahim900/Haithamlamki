import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type');

  // Handle PKCE flow (code exchange)
  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(origin);
    }
  }

  // Handle token hash flow (email confirmation link)
  if (token_hash && type) {
    // Redirect to app root — the client-side auth listener will pick up the session
    const redirectUrl = new URL('/', origin);
    redirectUrl.searchParams.set('token_hash', token_hash);
    redirectUrl.searchParams.set('type', type);
    return NextResponse.redirect(redirectUrl);
  }

  // Fallback: redirect to home
  return NextResponse.redirect(origin);
}
