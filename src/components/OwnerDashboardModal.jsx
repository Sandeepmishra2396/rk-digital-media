import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Crown,
  Music,
  Users,
  Inbox,
  ShieldCheck,
  Search,
  Filter,
  Play,
  Pause,
  Download,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Trash2,
  RefreshCw,
  Phone,
  Mail,
  MessageCircle,
  FileText,
  BadgeCheck,
  Disc,
  Radio,
  Lock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function OwnerDashboardModal() {
  const {
    user,
    isOwner,
    isOwnerDashboardOpen,
    closeOwnerDashboard,
    openAuthModal,
    loginOwner,
  } = useAuth();

  // Tab State: 'releases' | 'artists' | 'inquiries' | 'security'
  const [activeTab, setActiveTab] = useState('releases');

  // Loading & Data States
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [allReleases, setAllReleases] = useState([]);
  const [allArtists, setAllArtists] = useState([]);
  const [allInquiries, setAllInquiries] = useState([]);
  const [toast, setToast] = useState(null);

  // Filter & Search States
  const [releaseSearch, setReleaseSearch] = useState('');
  const [releaseStatusFilter, setReleaseStatusFilter] = useState('All');
  const [artistSearch, setArtistSearch] = useState('');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState('All');

  // Audio Playback State for Auditioning
  const [currentlyPlayingAudio, setCurrentlyPlayingAudio] = useState(null);

  // Security Login Form if not logged in
  const [ownerPasswordInput, setOwnerPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Artwork Zoom Modal
  const [zoomedArtwork, setZoomedArtwork] = useState(null);

  const showNotification = (msg, type = 'success') => {
    setToast({ text: msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch all label data directly from Supabase
  const fetchAllData = async () => {
    try {
      setRefreshing(true);
      const [releasesData, artistsData, inquiriesData] = await Promise.all([
        api.admin.getAllReleases(),
        api.admin.getAllArtists(),
        api.admin.getAllInquiries(),
      ]);

      setAllReleases(releasesData || []);
      setAllArtists(artistsData || []);
      setAllInquiries(inquiriesData || []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      showNotification('Could not load some data from server', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isOwnerDashboardOpen && isOwner) {
      fetchAllData();
    }
  }, [isOwnerDashboardOpen, isOwner]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOwnerDashboardOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setCurrentlyPlayingAudio(null);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOwnerDashboardOpen]);

  // Handle Release Status Update (Approve, Review, Reject)
  const handleUpdateStatus = async (releaseId, newStatus) => {
    try {
      await api.releases.updateReleaseStatus(releaseId, newStatus);
      setAllReleases((prev) =>
        prev.map((r) =>
          r.id === releaseId
            ? {
                ...r,
                status: newStatus,
                status_color:
                  newStatus === 'Live'
                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                    : newStatus === 'Action Required'
                    ? 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                    : 'text-amber-400 bg-amber-500/10 border-amber-500/20',
              }
            : r
        )
      );
      showNotification(`Release status updated to "${newStatus}"!`);
    } catch (err) {
      showNotification(err.message || 'Failed to update release status', 'error');
    }
  };

  // Handle Release Deletion
  const handleDeleteRelease = async (releaseId, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }
    try {
      await api.admin.deleteRelease(releaseId);
      setAllReleases((prev) => prev.filter((r) => r.id !== releaseId));
      showNotification(`"${title}" deleted successfully.`);
    } catch (err) {
      showNotification(err.message || 'Failed to delete release', 'error');
    }
  };

  // Handle Artist Verification Toggle
  const handleToggleVerification = async (artistId, currentStatus, artistName) => {
    try {
      const nextStatus = !currentStatus;
      await api.admin.updateArtistVerification(artistId, nextStatus);
      setAllArtists((prev) =>
        prev.map((a) => (a.id === artistId ? { ...a, verified: nextStatus } : a))
      );
      showNotification(
        `${artistName} is now ${nextStatus ? 'Verified ✓' : 'Unverified'}`
      );
    } catch (err) {
      showNotification('Failed to toggle verification', 'error');
    }
  };

  // Handle Inquiry Status Update
  const handleUpdateInquiryStatus = async (inquiryId, newStatus) => {
    try {
      await api.admin.updateInquiryStatus(inquiryId, newStatus);
      setAllInquiries((prev) =>
        prev.map((inq) => (inq.id === inquiryId ? { ...inq, status: newStatus } : inq))
      );
      showNotification(`Inquiry marked as "${newStatus}"!`);
    } catch (err) {
      showNotification('Failed to update inquiry status', 'error');
    }
  };

  // Handle Owner Login within modal
  const handleOwnerLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      const res = await loginOwner(ownerPasswordInput);
      if (!res.success) {
        setLoginError(res.error || 'Authentication failed');
      } else {
        setOwnerPasswordInput('');
        fetchAllData();
      }
    } catch (err) {
      setLoginError(err.message || 'Error logging in');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Filtered Releases
  const filteredReleases = useMemo(() => {
    return allReleases.filter((r) => {
      const matchesSearch =
        !releaseSearch ||
        r.title?.toLowerCase().includes(releaseSearch.toLowerCase()) ||
        r.artist?.toLowerCase().includes(releaseSearch.toLowerCase()) ||
        r.genre?.toLowerCase().includes(releaseSearch.toLowerCase()) ||
        r.language?.toLowerCase().includes(releaseSearch.toLowerCase()) ||
        r.isrc?.toLowerCase().includes(releaseSearch.toLowerCase()) ||
        r.upc?.toLowerCase().includes(releaseSearch.toLowerCase());

      const matchesStatus =
        releaseStatusFilter === 'All' ||
        (releaseStatusFilter === 'Pending' &&
          (r.status === 'In Review' || r.status === 'Pending' || !r.status)) ||
        (releaseStatusFilter === 'Live' && r.status === 'Live') ||
        (releaseStatusFilter === 'Action Required' && r.status === 'Action Required');

      return matchesSearch && matchesStatus;
    });
  }, [allReleases, releaseSearch, releaseStatusFilter]);

  // Filtered Artists
  const filteredArtists = useMemo(() => {
    return allArtists.filter((a) => {
      if (!artistSearch) return true;
      const q = artistSearch.toLowerCase();
      return (
        a.name?.toLowerCase().includes(q) ||
        a.email?.toLowerCase().includes(q) ||
        a.phone?.toLowerCase().includes(q) ||
        a.artist_id?.toLowerCase().includes(q)
      );
    });
  }, [allArtists, artistSearch]);

  // Filtered Inquiries
  const filteredInquiries = useMemo(() => {
    return allInquiries.filter((inq) => {
      if (inquiryStatusFilter === 'All') return true;
      return inq.status?.toLowerCase() === inquiryStatusFilter.toLowerCase();
    });
  }, [allInquiries, inquiryStatusFilter]);

  // Statistics
  const stats = useMemo(() => {
    const totalReleases = allReleases.length;
    const pendingReleases = allReleases.filter(
      (r) => r.status === 'In Review' || r.status === 'Pending' || !r.status
    ).length;
    const liveReleases = allReleases.filter((r) => r.status === 'Live').length;
    const totalArtistsCount = allArtists.length;
    const newInquiries = allInquiries.filter(
      (i) => i.status === 'New' || !i.status
    ).length;

    return {
      totalReleases,
      pendingReleases,
      liveReleases,
      totalArtistsCount,
      newInquiries,
    };
  }, [allReleases, allArtists, allInquiries]);

  if (!isOwnerDashboardOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/85 backdrop-blur-lg"
        onClick={closeOwnerDashboard}
      />

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-7xl max-h-[92vh] rounded-3xl border border-amber-500/30 shadow-2xl overflow-hidden my-auto z-10 flex flex-col"
        style={{
          background: 'linear-gradient(145deg, #080c16 0%, #05070f 100%)',
          boxShadow: '0 25px 60px -15px rgba(245, 158, 11, 0.15)',
        }}
      >
        {/* Crown Top Accent Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-yellow-400 to-indigo-600" />

        {/* Modal Header */}
        <div className="p-5 md:p-6 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 bg-black/30">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/25 border border-amber-400/40">
              <Crown className="w-6 h-6 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-white font-extrabold text-lg md:text-xl tracking-tight">
                  RK DIGITAL MEDIA
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/40 flex items-center gap-1">
                  <Crown className="w-3 h-3 text-amber-400" /> Label Owner
                </span>
              </div>
              <p className="text-gray-400 text-xs flex items-center gap-2 mt-0.5">
                <span>Account:</span>
                <span className="text-amber-300 font-mono font-semibold">
                  rkdigitalmediawork@gmail.com
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-emerald-400 text-[11px] font-medium">Founder Verified</span>
              </p>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2">
            {isOwner && (
              <button
                onClick={fetchAllData}
                disabled={refreshing}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold transition-all disabled:opacity-50"
                title="Refresh All Database Records"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-amber-400' : ''}`} />
                <span className="hidden sm:inline">Refresh Data</span>
              </button>
            )}

            <button
              onClick={closeOwnerDashboard}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors border border-transparent hover:border-white/10"
              aria-label="Close dashboard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Security Gate Check */}
        {!isOwner ? (
          <div className="p-8 md:p-12 text-center max-w-md mx-auto my-auto space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Owner Authorization Required</h2>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                This command center is strictly restricted to{' '}
                <span className="text-amber-300 font-medium font-mono">
                  rkdigitalmediawork@gmail.com
                </span>
                . Please enter the founder password to continue.
              </p>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs">
                {loginError}
              </div>
            )}

            <form onSubmit={handleOwnerLoginSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="Enter Owner Password..."
                  value={ownerPasswordInput}
                  onChange={(e) => setOwnerPasswordInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-amber-500"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={isLoggingIn || !ownerPasswordInput}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-bold text-sm shadow-lg shadow-amber-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoggingIn ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Unlock Owner Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    closeOwnerDashboard();
                    openAuthModal('forgot');
                  }}
                  className="text-xs text-amber-400 hover:text-amber-300 font-semibold transition-colors"
                >
                  Forgot Owner Password?
                </button>
                <button
                  type="button"
                  onClick={closeOwnerDashboard}
                  className="hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Authorized Owner Dashboard Content */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* KPI Counter Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-5 pb-3 bg-black/20 border-b border-white/5">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Music className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider">
                    Total Songs Uploaded
                  </p>
                  <p className="text-white text-xl font-extrabold">{stats.totalReleases}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/[0.05] border border-amber-500/20 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-amber-300 text-[11px] font-semibold uppercase tracking-wider">
                    Pending Review
                  </p>
                  <p className="text-amber-400 text-xl font-extrabold">
                    {stats.pendingReleases}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider">
                    Registered Artists
                  </p>
                  <p className="text-white text-xl font-extrabold">{stats.totalArtistsCount}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Inbox className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider">
                    Contact Inquiries
                  </p>
                  <p className="text-white text-xl font-extrabold">
                    {allInquiries.length}{' '}
                    {stats.newInquiries > 0 && (
                      <span className="text-emerald-400 text-xs font-normal">
                        ({stats.newInquiries} new)
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-white/10 px-5 pt-3 gap-2 overflow-x-auto bg-black/10">
              <button
                onClick={() => setActiveTab('releases')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-xl transition-all border-b-2 ${
                  activeTab === 'releases'
                    ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                    : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Music className="w-4 h-4" />
                <span>Uploaded Music & Requests ({allReleases.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('artists')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-xl transition-all border-b-2 ${
                  activeTab === 'artists'
                    ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                    : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Artists Directory ({allArtists.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('inquiries')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-xl transition-all border-b-2 ${
                  activeTab === 'inquiries'
                    ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                    : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Inbox className="w-4 h-4" />
                <span>Website Inquiries ({allInquiries.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-xl transition-all border-b-2 ${
                  activeTab === 'security'
                    ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                    : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Security & Label Status</span>
              </button>
            </div>

            {/* Tab Body */}
            <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-4">
              {/* TAB 1: ALL RELEASES / MUSIC SUBMISSIONS */}
              {activeTab === 'releases' && (
                <div className="space-y-4">
                  {/* Search and Filters Bar */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by song title, artist, genre, ISRC..."
                        value={releaseSearch}
                        onChange={(e) => setReleaseSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                      {['All', 'Pending', 'Live', 'Action Required'].map((st) => (
                        <button
                          key={st}
                          onClick={() => setReleaseStatusFilter(st)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                            releaseStatusFilter === st
                              ? 'bg-amber-500 text-black shadow-md'
                              : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Releases Table / Cards */}
                  {loading ? (
                    <div className="py-16 text-center text-gray-400 space-y-3">
                      <RefreshCw className="w-8 h-8 animate-spin mx-auto text-amber-400" />
                      <p className="text-sm">Connecting to Supabase Database...</p>
                    </div>
                  ) : filteredReleases.length === 0 ? (
                    <div className="py-16 text-center rounded-2xl bg-white/[0.02] border border-white/10 p-8">
                      <Music className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <h3 className="text-white font-bold text-base">No Releases Found</h3>
                      <p className="text-gray-400 text-xs mt-1 max-w-md mx-auto">
                        {releaseSearch || releaseStatusFilter !== 'All'
                          ? 'No song submissions match your current search or status filter.'
                          : 'No artists have uploaded music submissions yet. When an artist uploads a track, it will instantly appear here for your review and approval.'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredReleases.map((release) => {
                        const isAudioPlaying = currentlyPlayingAudio === release.id;
                        const isLive = release.status === 'Live';
                        const isPending =
                          release.status === 'In Review' ||
                          release.status === 'Pending' ||
                          !release.status;

                        return (
                          <div
                            key={release.id}
                            className="p-4 md:p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
                          >
                            {/* Left: Artwork + Title + Artist */}
                            <div className="flex items-start gap-4 flex-1">
                              {/* 3000x3000 Artwork Thumbnail with Zoom Button */}
                              <div className="relative group/art flex-shrink-0">
                                <img
                                  src={
                                    release.artwork_url ||
                                    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80'
                                  }
                                  alt={release.title}
                                  className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover border border-white/15 shadow-md group-hover/art:border-amber-400 transition-colors"
                                />
                                {release.artwork_url && (
                                  <button
                                    onClick={() => setZoomedArtwork(release.artwork_url)}
                                    className="absolute inset-0 bg-black/60 opacity-0 group-hover/art:opacity-100 transition-opacity rounded-xl flex items-center justify-center text-white text-[10px] font-bold"
                                    title="View High-Res Artwork"
                                  >
                                    View 3000×
                                  </button>
                                )}
                              </div>

                              {/* Details */}
                              <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3 className="text-white font-bold text-sm md:text-base">
                                    {release.title}
                                  </h3>
                                  <span
                                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${
                                      release.status === 'Live'
                                        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25'
                                        : release.status === 'Action Required'
                                        ? 'text-rose-400 bg-rose-500/10 border-rose-500/25'
                                        : 'text-amber-400 bg-amber-500/10 border-amber-500/25'
                                    }`}
                                  >
                                    {release.status || 'In Review'}
                                  </span>
                                </div>

                                <p className="text-gray-300 text-xs font-semibold">
                                  By: <span className="text-amber-300">{release.artist}</span>
                                </p>

                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-400">
                                  <span>Genre: <strong className="text-gray-300">{release.genre || 'N/A'}</strong></span>
                                  <span>•</span>
                                  <span>Language: <strong className="text-gray-300">{release.language || 'Hindi'}</strong></span>
                                  <span>•</span>
                                  <span>Release Date: <strong className="text-gray-300">{release.release_date || 'ASAP'}</strong></span>
                                  {release.isrc && (
                                    <>
                                      <span>•</span>
                                      <span className="font-mono text-indigo-300">ISRC: {release.isrc}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Center: In-Browser HTML5 Audio Player / Auditioning */}
                            <div className="w-full lg:w-72 bg-black/40 p-2.5 rounded-xl border border-white/10 space-y-1.5">
                              <div className="flex items-center justify-between text-[11px] text-gray-400">
                                <span className="flex items-center gap-1 text-amber-300 font-semibold">
                                  <Radio className="w-3 h-3 text-amber-400 animate-pulse" /> Audio Track
                                </span>
                                {release.audio_url ? (
                                  <a
                                    href={release.audio_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download
                                    className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
                                    title="Download Master Audio File"
                                  >
                                    <Download className="w-3 h-3" />
                                    <span>Download</span>
                                  </a>
                                ) : (
                                  <span className="text-gray-500 text-[10px]">No Audio File</span>
                                )}
                              </div>

                              {release.audio_url ? (
                                <audio
                                  controls
                                  preload="none"
                                  className="w-full h-8"
                                  src={release.audio_url}
                                  onPlay={() => setCurrentlyPlayingAudio(release.id)}
                                  onPause={() => {
                                    if (currentlyPlayingAudio === release.id) {
                                      setCurrentlyPlayingAudio(null);
                                    }
                                  }}
                                />
                              ) : (
                                <div className="py-1 text-center text-gray-500 text-[11px]">
                                  Audio file not attached
                                </div>
                              )}
                            </div>

                            {/* Right: Owner Action Controls */}
                            <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 w-full lg:w-auto justify-end">
                              {/* 1-Click Status Toggles */}
                              {!isLive && (
                                <button
                                  onClick={() => handleUpdateStatus(release.id, 'Live')}
                                  className="flex-1 lg:flex-none px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/25 transition-all"
                                  title="Approve song and mark Live on platforms"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Approve & Live</span>
                                </button>
                              )}

                              {!isPending && (
                                <button
                                  onClick={() => handleUpdateStatus(release.id, 'In Review')}
                                  className="flex-1 lg:flex-none px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                                  title="Move track to Review state"
                                >
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>Set In Review</span>
                                </button>
                              )}

                              {release.status !== 'Action Required' && (
                                <button
                                  onClick={() => handleUpdateStatus(release.id, 'Action Required')}
                                  className="flex-1 lg:flex-none px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                                  title="Notify artist that changes are required"
                                >
                                  <AlertTriangle className="w-3.5 h-3.5" />
                                  <span>Reject / Edit</span>
                                </button>
                              )}

                              {/* Delete button */}
                              <button
                                onClick={() => handleDeleteRelease(release.id, release.title)}
                                className="p-2 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                title="Delete submission"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: ARTISTS DIRECTORY */}
              {activeTab === 'artists' && (
                <div className="space-y-4">
                  {/* Search Artists */}
                  <div className="relative max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search artist by name, email, phone..."
                      value={artistSearch}
                      onChange={(e) => setArtistSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {filteredArtists.length === 0 ? (
                    <div className="py-16 text-center rounded-2xl bg-white/[0.02] border border-white/10 p-8">
                      <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <h3 className="text-white font-bold text-base">No Artists Registered Yet</h3>
                      <p className="text-gray-400 text-xs mt-1">
                        Artists who sign up on the portal will automatically appear in this master directory.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredArtists.map((artist) => {
                        const isArtistOwner =
                          artist.email?.toLowerCase() === 'rkdigitalmediawork@gmail.com' ||
                          artist.role === 'Founder & Label Head';

                        return (
                          <div
                            key={artist.id}
                            className={`p-4 rounded-2xl border transition-all ${
                              isArtistOwner
                                ? 'bg-amber-500/[0.04] border-amber-500/30 shadow-md shadow-amber-500/10'
                                : 'bg-white/[0.03] hover:bg-white/[0.05] border-white/10'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-base shadow-md">
                                  {artist.name ? artist.name[0].toUpperCase() : 'A'}
                                </div>
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <h4 className="text-white font-bold text-sm">
                                      {artist.name || 'Unnamed Artist'}
                                    </h4>
                                    {artist.verified && (
                                      <BadgeCheck
                                        className="w-4 h-4 text-blue-400 fill-blue-400/20"
                                        title="Verified Artist"
                                      />
                                    )}
                                  </div>
                                  <p className="text-gray-400 text-xs">
                                    {artist.role || 'Independent Artist'}
                                  </p>
                                </div>
                              </div>

                              {isArtistOwner ? (
                                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px] border border-amber-500/40">
                                  👑 Owner
                                </span>
                              ) : (
                                <button
                                  onClick={() =>
                                    handleToggleVerification(
                                      artist.id,
                                      artist.verified,
                                      artist.name
                                    )
                                  }
                                  className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-all ${
                                    artist.verified
                                      ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                                      : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
                                  }`}
                                  title="Toggle blue verification tick"
                                >
                                  {artist.verified ? 'Verified ✓' : 'Mark Verified'}
                                </button>
                              )}
                            </div>

                            {/* Contact Details */}
                            <div className="space-y-1.5 text-xs text-gray-300 bg-black/30 p-2.5 rounded-xl border border-white/5 mb-3">
                              <div className="flex items-center gap-2">
                                <Mail className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                <span className="truncate">{artist.email}</span>
                              </div>
                              {artist.phone && (
                                <div className="flex items-center gap-2">
                                  <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                  <span>{artist.phone}</span>
                                </div>
                              )}
                              <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[11px] text-gray-400">
                                <span>Releases: <strong className="text-white">{artist.releases_count || 0}</strong></span>
                                <span>Streams: <strong className="text-white">{artist.total_streams || '0'}</strong></span>
                              </div>
                            </div>

                            {/* 1-Click Connect */}
                            <div className="flex items-center gap-2">
                              {artist.phone && (
                                <a
                                  href={`https://wa.me/${artist.phone.replace(/[^0-9]/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 py-1.5 px-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                  <span>WhatsApp</span>
                                </a>
                              )}
                              <a
                                href={`mailto:${artist.email}`}
                                className="flex-1 py-1.5 px-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                              >
                                <Mail className="w-3.5 h-3.5" />
                                <span>Email</span>
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: CONTACT INQUIRIES */}
              {activeTab === 'inquiries' && (
                <div className="space-y-4">
                  {/* Status Filter */}
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-gray-400 text-xs">
                      Incoming contact messages & distribution requests from the website
                    </p>

                    <div className="flex items-center gap-1.5">
                      {['All', 'New', 'Contacted', 'Resolved'].map((st) => (
                        <button
                          key={st}
                          onClick={() => setInquiryStatusFilter(st)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            inquiryStatusFilter === st
                              ? 'bg-amber-500 text-black shadow-md'
                              : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  {filteredInquiries.length === 0 ? (
                    <div className="py-16 text-center rounded-2xl bg-white/[0.02] border border-white/10 p-8">
                      <Inbox className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <h3 className="text-white font-bold text-base">No Inquiries Found</h3>
                      <p className="text-gray-400 text-xs mt-1">
                        When visitors submit the contact form on your website, their requests will appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredInquiries.map((inq) => (
                        <div
                          key={inq.id}
                          className="p-4 md:p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                        >
                          <div className="space-y-1.5 flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-white font-bold text-sm md:text-base">
                                {inq.name}
                              </h4>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                  inq.status === 'Resolved'
                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                    : inq.status === 'Contacted'
                                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                }`}
                              >
                                {inq.status || 'New'}
                              </span>
                            </div>

                            <p className="text-gray-300 text-xs italic bg-black/30 p-2.5 rounded-xl border border-white/5">
                              "{inq.message}"
                            </p>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
                              <span className="flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5 text-gray-500" />
                                {inq.email}
                              </span>
                              {inq.phone && (
                                <span className="flex items-center gap-1.5">
                                  <Phone className="w-3.5 h-3.5 text-gray-500" />
                                  {inq.phone}
                                </span>
                              )}
                              <span>•</span>
                              <span>
                                {inq.created_at
                                  ? new Date(inq.created_at).toLocaleString()
                                  : 'Recently'}
                              </span>
                            </div>
                          </div>

                          {/* Quick response buttons */}
                          <div className="flex items-center gap-2 w-full md:w-auto">
                            {inq.phone && (
                              <a
                                href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-600/25"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span>WhatsApp</span>
                              </a>
                            )}
                            <a
                              href={`mailto:${inq.email}`}
                              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/25"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>Email Reply</span>
                            </a>
                            <select
                              value={inq.status || 'New'}
                              onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value)}
                              className="px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs font-semibold focus:outline-none focus:border-amber-500"
                            >
                              <option value="New" className="bg-navy-900 text-white">New</option>
                              <option value="Contacted" className="bg-navy-900 text-white">Contacted</option>
                              <option value="Resolved" className="bg-navy-900 text-white">Resolved</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: SECURITY & LABEL STATUS */}
              {activeTab === 'security' && (
                <div className="max-w-3xl space-y-5">
                  <div className="p-5 rounded-2xl bg-amber-500/[0.06] border border-amber-500/30 space-y-3">
                    <div className="flex items-center gap-2.5 text-amber-300 font-bold text-sm">
                      <ShieldCheck className="w-5 h-5" />
                      <span>Owner Security & Access Rights</span>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      The Owner Dashboard is cryptographically mapped to your dedicated email address:{' '}
                      <strong className="text-amber-300 font-mono">rkdigitalmediawork@gmail.com</strong>.
                      Row-Level Security (RLS) has been enabled on PostgreSQL so that independent artists cannot
                      tamper with, delete, or inspect other artists' releases, while your Founder account holds universal
                      curation privileges.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                        Primary Label Email
                      </p>
                      <p className="text-white font-mono font-bold text-sm">
                        rkdigitalmediawork@gmail.com
                      </p>
                      <p className="text-[11px] text-emerald-400">
                        ✓ Locked to Founder Account
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                        Supabase Database Status
                      </p>
                      <p className="text-white font-mono font-bold text-sm">
                        yeytelvcphrsgzflskel.supabase.co
                      </p>
                      <p className="text-[11px] text-emerald-400">
                        ✓ Connected & Live
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                        Audio Storage Bucket
                      </p>
                      <p className="text-white font-mono font-bold text-sm">music-tracks</p>
                      <p className="text-[11px] text-emerald-400">
                        ✓ Public Streaming Allowed
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                        Artwork Storage Bucket
                      </p>
                      <p className="text-white font-mono font-bold text-sm">music-artworks</p>
                      <p className="text-[11px] text-emerald-400">
                        ✓ 3000×3000 HD Support
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>

      {/* High Resolution Artwork Zoom Modal */}
      {zoomedArtwork && (
        <div
          className="fixed inset-0 z-[10001] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setZoomedArtwork(null)}
        >
          <div className="relative max-w-2xl max-h-[90vh] p-2 bg-navy-900 border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setZoomedArtwork(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-black/70 text-white hover:bg-black transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={zoomedArtwork}
              alt="Artwork Full"
              className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
            />
            <div className="p-3 flex items-center justify-between text-xs text-gray-300">
              <span>Full Resolution Cover Artwork (3000×3000)</span>
              <a
                href={zoomedArtwork}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
              >
                <Download className="w-4 h-4" /> Download Artwork
              </a>
            </div>
          </div>
        </div>
      )}

      {/* In-Modal Toast Notification */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-[10002] animate-bounce-short">
          <div
            className={`px-4 py-3 rounded-2xl shadow-2xl border text-xs font-semibold flex items-center gap-2.5 ${
              toast.type === 'error'
                ? 'bg-red-950 text-red-200 border-red-800'
                : 'bg-navy-900 text-amber-200 border-amber-500/40'
            }`}
            style={{ background: '#080c16' }}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                toast.type === 'error' ? 'bg-red-500' : 'bg-amber-400'
              }`}
            />
            <span>{toast.text}</span>
          </div>
        </div>
      )}
    </div>
  );
}
