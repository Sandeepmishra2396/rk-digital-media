export async function getUserReleases(req, res, next) {
  try {
    const userId = req.user.id;

    // Strict user-scoped query through authenticated Supabase client
    const { data: releases, error } = await req.supabase
      .from('releases')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      count: releases ? releases.length : 0,
      releases: releases || [],
    });
  } catch (err) {
    next(err);
  }
}

export async function createRelease(req, res, next) {
  try {
    const userId = req.user.id;
    const { title, artist, genre, language, platforms } = req.body;

    if (!title || !artist) {
      return res.status(400).json({
        success: false,
        error: 'Track title and artist name are required.',
      });
    }

    const randomNum = Math.floor(100 + Math.random() * 900);
    const trackId = `TRK-${Math.floor(1000 + Math.random() * 9000)}`;
    const isrc = `IN-RKD-26-${randomNum}`;
    const upc = `8901${Math.floor(10000000 + Math.random() * 90000000)}`;
    const defaultPlatforms = platforms && Array.isArray(platforms) && platforms.length > 0
      ? platforms
      : ['Spotify', 'Apple Music', 'YouTube Music', 'JioSaavn', 'Wynk', 'CRBT'];

    const newRelease = {
      user_id: userId,
      track_id: trackId,
      title: title.trim(),
      artist: artist.trim(),
      genre: genre || 'Folk / Regional',
      language: language || 'Hindi / Bhojpuri',
      isrc: isrc,
      upc: upc,
      release_date: 'Submitted (Processing QC)',
      status: 'In Review',
      status_color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      platforms: defaultPlatforms,
      streams: 'Processing',
      earnings: 'Pending QC',
    };

    const { data, error } = await req.supabase
      .from('releases')
      .insert(newRelease)
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    // Update releases_count on user profile
    try {
      const { data: countData } = await req.supabase
        .from('releases')
        .select('id', { count: 'exact' })
        .eq('user_id', userId);

      if (countData) {
        await req.supabase
          .from('profiles')
          .update({ releases_count: countData.length })
          .eq('id', userId);
      }
    } catch (countErr) {
      console.warn('[ReleaseController] Profile count update warning:', countErr);
    }

    return res.status(201).json({
      success: true,
      message: 'Music release submitted successfully for QC verification!',
      release: data,
    });
  } catch (err) {
    next(err);
  }
}

export async function getReleaseById(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const { data: release, error } = await req.supabase
      .from('releases')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !release) {
      return res.status(404).json({
        success: false,
        error: 'Release not found or you do not have permission to access it.',
      });
    }

    return res.status(200).json({
      success: true,
      release,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteRelease(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const { error } = await req.supabase
      .from('releases')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Release deleted successfully.',
    });
  } catch (err) {
    next(err);
  }
}
