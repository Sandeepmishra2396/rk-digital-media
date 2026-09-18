import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, SortAsc, SortDesc, Youtube, ExternalLink,
  Users, ChevronDown, Filter, Grid, AlertCircle
} from 'lucide-react';
import networkChannels, { channelCategories } from '../data/networkChannels';

const ITEMS_PER_PAGE = 24;

function getInitials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

function getAvatarColor(name) {
  const colors = [
    'from-indigo-500 to-purple-600',
    'from-red-500 to-pink-600',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
    'from-blue-500 to-cyan-600',
    'from-rose-500 to-red-600',
    'from-violet-500 to-purple-600',
    'from-sky-500 to-blue-600',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function formatSubscribers(sub, display) {
  if (display === 'Channel removed') return display;
  if (display === 'N/A' || sub === 0) return display || '—';
  return display;
}

export default function Network() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = [...networkChannels];

    // Filter by search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (ch) =>
          ch.name.toLowerCase().includes(q) ||
          ch.handle.toLowerCase().includes(q)
      );
    }

    // Filter by category
    if (category !== 'All') {
      list = list.filter((ch) => ch.category === category);
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === 'name') {
        const cmp = a.name.localeCompare(b.name);
        return sortDir === 'asc' ? cmp : -cmp;
      }
      if (sortBy === 'subscribers') {
        const cmp = a.subscribers - b.subscribers;
        return sortDir === 'asc' ? cmp : -cmp;
      }
      return 0;
    });

    return list;
  }, [search, category, sortBy, sortDir]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortDir('asc');
    }
    setPage(1);
  };

  return (
    <section id="network" className="py-16 lg:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="section-tag">Our Network</span>
          <h2 className="section-title mt-2">
            Powering a Growing{' '}
            <span className="text-gradient">Music Network</span>
          </h2>
          <p className="section-desc mt-4">
            RK DIGITAL MEDIA works with artists, labels, and digital music channels to help their content
            reach audiences across platforms. Browse our network of{' '}
            <strong className="text-gray-900">{networkChannels.length} managed channels</strong>.
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by channel name or @handle..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Category filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={category}
                onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                className="pl-10 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none cursor-pointer transition-all"
              >
                {channelCategories.map((c) => (
                  <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Sort buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => toggleSort('name')}
                className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                  sortBy === 'name'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-indigo-300'
                }`}
              >
                {sortBy === 'name' && sortDir === 'desc' ? <SortDesc className="w-4 h-4" /> : <SortAsc className="w-4 h-4" />}
                Name
              </button>
              <button
                onClick={() => toggleSort('subscribers')}
                className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                  sortBy === 'subscribers'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-indigo-300'
                }`}
              >
                {sortBy === 'subscribers' && sortDir === 'desc' ? <SortDesc className="w-4 h-4" /> : <SortAsc className="w-4 h-4" />}
                Subs
              </button>
            </div>
          </div>

          {/* Results info */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Showing{' '}
              <strong className="text-gray-900">{filtered.length}</strong> of{' '}
              <strong className="text-gray-900">{networkChannels.length}</strong> channels
            </p>
            {(search || category !== 'All') && (
              <button
                onClick={() => { setSearch(''); setCategory('All'); setPage(1); }}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Channel Grid */}
        {paginated.length === 0 ? (
          <div className="text-center py-20">
            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">No channels found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            <AnimatePresence>
              {paginated.map((channel) => {
                const avatarGradient = getAvatarColor(channel.name);
                const initials = getInitials(channel.name);
                const isRemoved = channel.status === 'removed';

                return (
                  <motion.div
                    key={channel.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`channel-card bg-white rounded-2xl border p-5 flex flex-col ${
                      isRemoved ? 'border-red-100 opacity-60' : 'border-gray-100 hover:border-indigo-200'
                    }`}
                  >
                    {/* Avatar + Owner badge */}
                    <div className="flex items-start gap-3 mb-4">
                      <div
                        className={`w-14 h-14 rounded-full flex-shrink-0 bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white font-bold text-lg shadow-sm`}
                      >
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3
                            className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 min-h-[2.5rem] break-words"
                            title={channel.name}
                          >
                            {channel.name}
                          </h3>
                          {channel.isOwner && (
                            <span className="flex-shrink-0 text-xs font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">
                              Founder
                            </span>
                          )}
                        </div>
                        <p className="text-indigo-600 text-xs font-medium mt-1">
                          {channel.handle !== 'N/A' ? channel.handle : 'Handle unavailable'}
                        </p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-gray-400" />
                        <span
                          className={`text-xs font-semibold ${
                            isRemoved ? 'text-rose-500' : 'text-gray-700'
                          }`}
                        >
                          {formatSubscribers(channel.subscribers, channel.subscribersDisplay)}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          isRemoved
                            ? 'bg-rose-50 text-rose-600 border border-rose-100'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {channel.category}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-1.5 mb-4">
                      <div
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          isRemoved ? 'bg-rose-400' : 'bg-emerald-400'
                        }`}
                      />
                      <span className="text-xs text-gray-500">
                        {isRemoved ? 'Channel Removed' : 'Active Channel'}
                      </span>
                    </div>

                    {/* Visit action (Refined for Issue 15) */}
                    <div className="mt-auto">
                      {channel.url && !isRemoved ? (
                        <a
                          href={channel.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 text-xs font-medium border border-gray-200 hover:border-red-200 transition-all duration-200"
                        >
                          <Youtube className="w-3.5 h-3.5 text-gray-400 group-hover:text-red-500" />
                          <span>Visit Channel</span>
                          <ExternalLink className="w-3 h-3 opacity-60" />
                        </a>
                      ) : (
                        <div className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-gray-50 text-gray-400 text-xs font-medium border border-gray-100 cursor-not-allowed">
                          {isRemoved ? 'Channel Unavailable' : 'Handle Unavailable'}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${
                  p === page
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600'
                }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
