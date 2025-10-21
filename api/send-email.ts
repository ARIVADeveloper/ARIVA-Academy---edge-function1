import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Initialize Supabase client with service role key
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, subject, html } = req.body;

  if (!to || !subject || !html) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Invoke the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('sendgrid-email', {
      body: { to, subject, html },
    });

    console.log('Supabase invoke data:', data);
    console.log('Supabase invoke error:', error);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ success: true, data });
  } catch (err: any) {
    console.error('Unexpected error:', err);
    return res.status(500).json({ error: err.message });
  }
}
