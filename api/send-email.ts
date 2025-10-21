export default async function handler(req, res) {
  try {
    console.log('Request body:', req.body);

    const { data, error } = await supabase.functions.invoke('sendgrid-email', {
      body: req.body,
    });

    console.log('Supabase response data:', data);
    console.log('Supabase response error:', error);

    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true, data });
  } catch (err: any) {
    console.error('Unexpected error:', err);
    return res.status(500).json({ error: err.message });
  }
}
