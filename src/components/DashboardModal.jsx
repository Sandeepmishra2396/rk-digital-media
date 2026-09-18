import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  User,
  Music,
  TrendingUp,
  Globe,
  Radio,
  CheckCircle2,
  Clock,
  DollarSign,
  Upload,
  LogOut,
  ShieldCheck,
  Headphones,
  FileText,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Phone,
  Mail,
  Award,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DEMO_RELEASES = [
  {
    id: 'TRK-901',
    title: 'Mithila Ke Shaan (Original Mix)',
    artist: 'Raushan Pathak & Team',
    genre: 'Folk / Regional',
    isrc: 'IN-RKD-26-00192',
    upc: '8901234567890',
    releaseDate: 'Feb 14, 2026',
    status: 'Live',
    statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    platforms: ['Spotify', 'Apple Music', 'YouTube Music', 'JioSaavn', 'Wynk', 'CRBT'],
    streams: '142,500',
    earnings: '₹21,380',
  },
  {
    id: 'TRK-902',
    title: 'Pardesiya Re (Bhojpuri Beats)',
    artist: 'Pooja Mishra ft. RK Studio',
    genre: 'Bhojpuri Pop',
    isrc: 'IN-RKD-26-00193',
    upc: '8901234567891',
    releaseDate: 'Jan 28, 2026',
    status: 'Live',
    statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    platforms: ['Spotify', 'YouTube Music', 'Instagram Reels', 'JioSaavn'],
    streams: '98,200',
    earnings: '₹14,730',
  },
  {
    id: 'TRK-903',
    title: 'Bhakti Mahaganga Aarti (Special)',
    artist: 'RK Digital Choir',
    genre: 'Devotional / Bhakti',
    isrc: 'IN-RKD-26-00194',
    upc: '8901234567892',
    releaseDate: 'Jan 10, 2026',
    status: 'Live',
    statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    platforms: ['Spotify', 'Apple Music', 'JioSaavn', 'Wynk Caller Tune', 'Vi'],
    streams: '67,100',
    earnings: '₹10,065',
  },
  {
    id: 'TRK-904',
    title: 'Naina Me Basal (Acoustic Version)',
    artist: 'Guest Vocalist',
    genre: 'Romantic',
    isrc: 'IN-RKD-26-00195',
    upc: '8901234567893',
    releaseDate: 'Submitting (March 2026)',
    status: 'In Review',
    statusColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    platforms: ['All 20+ Platforms Selected'],
    streams: 'Processing',
    earnings: 'Pending QC',
  },
];

export default function DashboardModal() {
  const { user, isDashboardOpen, closeDashboard, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('releases'); // 'releases' | 'royalties' | 'platforms' | 'submit'
  const [showSubmissionSuccess, setShowSubmissionSuccess] = useState(false);

  // New release submission form states
  const [newTrackTitle, setNewTrackTitle] = useState('');
  const [newArtistName, setNewArtistName] = useState('');
  const [newGenre, setNewGenre] = useState('Regional / Folk');
  const [newLanguage, setNewLanguage] = useState('Maithili / Bhojpuri');

  if (!isDashboardOpen || !user) return null;

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    setShowSubmissionSuccess(true);
    setTimeout(() => {
      setShowSubmissionSuccess(false);
      setActiveTab('releases');
      setNewTrackTitle('');
      setNewArtistName('');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/85 backdrop-blur-md"
        onClick={closeDashboard}
      />

      {/* Main Dashboard Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-5xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden my-auto z-10 max-h-[92vh] flex flex-col"
        style={{ background: 'linear-gradient(155deg, #0d1224 0%, #060913 100%)' }}
      >
        {/* Top Gradient Banner */}
        <div className="h-2 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 flex-shrink-0" />

        {/* Dashboard Top Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 flex-shrink-0 bg-white/[0.02]">
          <div className="flex items-center gap-4">
            {/* User Avatar */}
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-blue-600 flex items-center justify-center text-white font-black text-xl shadow-xl shadow-indigo-500/30">
                {user.name ? user.name[0].toUpperCase() : 'A'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#0d1224] flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-white font-bold text-lg sm:text-xl">{user.name}</h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                  <Award className="w-3 h-3 text-amber-400" />
                  {user.role || 'Artist Partner'}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  Verified
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-400 mt-1 flex-wrap">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-gray-500" />
                  {user.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-gray-500" />
                  {user.phone || '+91 7631350084'}
                </span>
                <span className="text-indigo-400 font-mono">ID: {user.artistId || 'RK-ART-001'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setActiveTab('submit')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs sm:text-sm font-semibold hover:from-blue-500 hover:to-indigo-500 transition-all shadow-md"
            >
              <Upload className="w-4 h-4" />
              <span>Submit Track</span>
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs sm:text-sm font-semibold hover:bg-red-500/20 transition-all"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
            <button
              onClick={closeDashboard}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Stats Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-5 sm:px-6 bg-black/20 border-b border-white/5 flex-shrink-0">
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400 font-medium">Releases</span>
              <Music className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-white">{user.releasesCount || 4}</p>
            <p className="text-[11px] text-emerald-400">All DSPs Active</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400 font-medium">Total Streams</span>
              <Headphones className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-white">{user.totalStreams || '342.8K'}</p>
            <p className="text-[11px] text-blue-400">Global & Indian</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400 font-medium">Royalties Earned</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-emerald-400">{user.earnings || '₹48,650'}</p>
            <p className="text-[11px] text-gray-400">Next Payout: 1st of Month</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400 font-medium">Content ID Claims</span>
              <ShieldCheck className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-white">{user.claimsCount || 26}</p>
            <p className="text-[11px] text-purple-400">100% Monetized</p>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex border-b border-white/10 px-6 gap-2 pt-3 flex-shrink-0 bg-white/[0.01] overflow-x-auto">
          {[
            { id: 'releases', label: 'My Releases & Status', icon: Music },
            { id: 'royalties', label: 'Royalties & Analytics', icon: TrendingUp },
            { id: 'platforms', label: 'Connected Platforms', icon: Globe },
            { id: 'submit', label: 'Upload / Submit Release', icon: Upload },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-3 px-3.5 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-white bg-indigo-500/10 rounded-t-xl'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          {/* TAB 1: RELEASES */}
          {activeTab === 'releases' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold text-base">Catalog Releases</h3>
                  <p className="text-xs text-gray-400">
                    Track the live status of your songs across Spotify, Apple Music, YouTube & JioSaavn.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('submit')}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>New Song</span>
                </button>
              </div>

              <div className="space-y-3">
                {DEMO_RELEASES.map((track) => (
                  <div
                    key={track.id}
                    className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-indigo-500/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-800 flex items-center justify-center text-white flex-shrink-0 shadow-md">
                        <Music className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-white font-bold text-sm sm:text-base">{track.title}</h4>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${track.statusColor}`}
                          >
                            {track.status}
                          </span>
                        </div>
                        <p className="text-xs text-indigo-300 font-medium">{track.artist}</p>
                        <div className="flex items-center gap-3 text-[11px] text-gray-500 mt-1 flex-wrap">
                          <span>Genre: {track.genre}</span>
                          <span>•</span>
                          <span className="font-mono">ISRC: {track.isrc}</span>
                          <span>•</span>
                          <span>Released: {track.releaseDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                      <div className="text-left sm:text-right">
                        <p className="text-xs font-bold text-white">{track.streams} streams</p>
                        <p className="text-xs text-emerald-400 font-semibold">{track.earnings}</p>
                      </div>
                      <div className="flex gap-1 mt-1.5">
                        {['🎵', '🍎', '▶️', '🎤'].map((icon, i) => (
                          <span
                            key={i}
                            className="w-5 h-5 rounded bg-white/10 flex items-center justify-center text-[10px]"
                          >
                            {icon}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: ROYALTIES */}
          {activeTab === 'royalties' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-white font-bold text-base">Royalties & Earnings Breakdown</h3>
                <p className="text-xs text-gray-400">
                  RK DIGITAL MEDIA passes on maximum revenue to artists with transparent reporting.
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                  <p className="text-xs text-indigo-300 font-medium">Current Balance</p>
                  <p className="text-2xl font-black text-white mt-1">₹48,650</p>
                  <p className="text-[11px] text-gray-400 mt-1">Ready for monthly payout</p>
                </div>
                <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                  <p className="text-xs text-purple-300 font-medium">Payout Method</p>
                  <p className="text-base font-bold text-white mt-1">Direct Bank / UPI</p>
                  <p className="text-[11px] text-gray-400 mt-1">Verified on file</p>
                </div>
                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                  <p className="text-xs text-blue-300 font-medium">Royalty Cycle</p>
                  <p className="text-base font-bold text-white mt-1">Monthly (Net 30)</p>
                  <p className="text-[11px] text-gray-400 mt-1">Free ISRC / UPC Provided</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                <h4 className="text-white font-semibold text-sm mb-3">Platform Revenue Distribution</h4>
                <div className="space-y-3">
                  {[
                    { platform: 'Spotify & Apple Music', percent: 42, color: 'bg-emerald-500', amount: '₹20,433' },
                    { platform: 'YouTube Content ID & YouTube Music', percent: 31, color: 'bg-red-500', amount: '₹15,081' },
                    { platform: 'JioSaavn & Wynk Music', percent: 18, color: 'bg-indigo-500', amount: '₹8,757' },
                    { platform: 'Telecom Caller Tunes (CRBT)', percent: 9, color: 'bg-amber-500', amount: '₹4,378' },
                  ].map((item, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-300">{item.platform}</span>
                        <span className="text-white font-semibold">{item.amount} ({item.percent}%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className={`h-full ${item.color} rounded-full`}
                          style={{ width: `${item.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PLATFORMS */}
          {activeTab === 'platforms' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-white font-bold text-base">Connected Streaming Stores</h3>
                <p className="text-xs text-gray-400">
                  Your songs are automatically piped to these platforms upon approval.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { name: 'Spotify for Artists', status: 'Connected', badge: 'Verified', icon: '🎵' },
                  { name: 'Apple Music for Artists', status: 'Connected', badge: 'Active', icon: '🍎' },
                  { name: 'YouTube Official Artist Channel', status: 'OAC Active', badge: 'Verified', icon: '▶️' },
                  { name: 'JioSaavn Artist Portal', status: 'Delivered', badge: 'Active', icon: '🎤' },
                  { name: 'Wynk Music & Airtel Tunes', status: 'Delivered', badge: 'Active', icon: '📻' },
                  { name: 'Instagram & Facebook Reels', status: 'Audio Library', badge: 'Active', icon: '📸' },
                  { name: 'Jio CRBT / Caller Tunes', status: 'Live Across India', badge: 'CRBT', icon: '📞' },
                  { name: 'Amazon Music', status: 'Delivered', badge: 'Active', icon: '📦' },
                  { name: 'SoundCloud / Deezer', status: 'Live', badge: 'Active', icon: '☁️' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{item.icon}</span>
                      <div>
                        <p className="text-white font-semibold text-xs">{item.name}</p>
                        <p className="text-[11px] text-gray-400">{item.status}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {item.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SUBMIT NEW RELEASE */}
          {activeTab === 'submit' && (
            <div className="max-w-2xl mx-auto py-2">
              <div className="text-center mb-5">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto mb-2">
                  <Upload className="w-6 h-6" />
                </div>
                <h3 className="text-white font-bold text-base">Submit New Music Release</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Deliver your next track to Spotify, Apple Music, YouTube Music, JioSaavn & 20+ platforms.
                </p>
              </div>

              {showSubmissionSuccess ? (
                <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="text-white font-bold text-base">Release Details Submitted!</h4>
                  <p className="text-xs text-emerald-200">
                    RK DIGITAL MEDIA QC team will review your audio and artwork. We will contact you at {user.email}.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleTrackSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Track Title / Song Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mithila Ke Sugandh"
                      value={newTrackTitle}
                      onChange={(e) => setNewTrackTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">
                        Main Artist(s)
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Singer / Performer name"
                        value={newArtistName || user.name}
                        onChange={(e) => setNewArtistName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">Genre</label>
                      <select
                        value={newGenre}
                        onChange={(e) => setNewGenre(e.target.value)}
                        className="w-full px-3 py-2.5 bg-black/40 border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                      >
                        <option value="Regional / Folk" className="bg-navy-900 text-white">Regional / Folk</option>
                        <option value="Bhojpuri Pop" className="bg-navy-900 text-white">Bhojpuri Pop</option>
                        <option value="Maithili Music" className="bg-navy-900 text-white">Maithili Music</option>
                        <option value="Devotional / Bhakti" className="bg-navy-900 text-white">Devotional / Bhakti</option>
                        <option value="Bollywood / Hindi" className="bg-navy-900 text-white">Bollywood / Hindi</option>
                        <option value="Hip Hop / Rap" className="bg-navy-900 text-white">Hip Hop / Rap</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.02] border border-dashed border-white/20 text-center">
                    <Music className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-300 font-semibold">
                      Send your WAV audio file & 3000×3000 Artwork to:
                    </p>
                    <a
                      href={`mailto:rkdigitalmediawork@gmail.com?subject=New Release: ${encodeURIComponent(
                        newTrackTitle || 'My New Song'
                      )}&body=Artist: ${encodeURIComponent(user.name)}%0D%0APhone: ${encodeURIComponent(
                        user.phone || ''
                      )}%0D%0AArtist ID: ${user.artistId}`}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-mono mt-1 inline-block"
                    >
                      rkdigitalmediawork@gmail.com
                    </a>
                    <p className="text-[11px] text-gray-500 mt-1">or send via WhatsApp to 7631350084</p>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Submit Track for Distribution Review</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-black/40 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-gray-400 flex-shrink-0">
          <span>RK DIGITAL MEDIA Artist Dashboard • Founder: Raushan Pathak</span>
          <span>WhatsApp Helpdesk: +91 7631350084</span>
        </div>
      </motion.div>
    </div>
  );
}
