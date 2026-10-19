export async function getUserRoyalties(req, res, next) {
  try {
    const userId = req.user.id;

    const { data: royalties, error } = await req.supabase
      .from('royalties')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    // Calculate aggregated totals safely
    const totalStreams = (royalties || []).reduce((acc, r) => acc + (r.streams || 0), 0);
    const totalEarnings = (royalties || []).reduce((acc, r) => acc + (parseFloat(r.net_amount) || 0), 0);

    return res.status(200).json({
      success: true,
      summary: {
        totalStreams,
        totalEarningsFormatted: `₹${totalEarnings.toLocaleString('en-IN')}`,
        payoutsCount: royalties ? royalties.length : 0,
      },
      royalties: royalties || [],
    });
  } catch (err) {
    next(err);
  }
}
