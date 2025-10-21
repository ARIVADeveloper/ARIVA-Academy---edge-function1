import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Initialize Supabase client with service role key
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing!');
}

const supabase = createClient(supabaseUrl!, supabaseKey!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('Received request:', req.method, req.body);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, subject, html } = req.body;

  if (!to || !subject || !html) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    console.log(
      `Invoking Supabase Edge Function "sendgrid-email" with to=${to}`,
    );

    const { data, error } = await supabase.functions.invoke('sendgrid-email', {
      body: { to, subject, html },
    });

    console.log('Supabase invoke response data:', data);
    console.log('Supabase invoke response error:', error);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true, data });
  } catch (err: any) {
    console.error('Unexpected error invoking Supabase Edge Function:', err);
    return res.status(500).json({ error: err.message });
  }
}
