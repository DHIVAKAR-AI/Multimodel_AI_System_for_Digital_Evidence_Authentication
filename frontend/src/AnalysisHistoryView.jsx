import React, { useState, useMemo } from 'react';
import { 
  History, Clock, Building2, User, Search, Filter, Trash2, 
  Download, ExternalLink, Copy, Check, Calendar, AlertTriangle, 
  CheckCircle, ArrowUpRight, ShieldCheck, Database, FileText, 
  RotateCcw, Sparkles, Layers, Eye, X, ChevronRight, FileDigit
} from 'lucide-react';

export const PRESET_OFFICES = [
  'Metropolitan Cyber Forensics Division',
  'Federal Digital Forensics Laboratory',
  'Central Police Crime Branch - Unit 4',
  'National Financial Intelligence & Fraud Bureau',
  'State Forensic Science Laboratory (SFSL)',
  'Interpol Cybercrime Directorate'
];

export const DEFAULT_ANALYSIS_HISTORY = [
  {
    id: 'HIST-20261011-091522',
    caseId: 'EVID-2026-904B',
    caseTitle: 'Downtown Traffic Incident & CCTV Surveillance',
    analyzedAt: '2026-10-11T09:15:22.000Z',
    analyzedDate: '2026-10-11',
    analyzedTime: '09:15:22 AM',
    office: 'Metropolitan Cyber Forensics Division',
    investigator: 'Investigator Doe',
    priority: 'High',
    status: 'conflicts',
    verdict: 'Cross-Modal Conflicts Detected',
    evidenceCount: 5,
    modalitiesSummary: 'Images (3), Video Feeds (2)',
    files: [
      { name: 'feed_cam05_wide.jpg', type: 'image/jpeg', size: '1.42 MB' },
      { name: '2b1a88e8-8ed4-479a-8d22-77c86c9874db.jpg', type: 'image/jpeg', size: '2.15 MB' },
      { name: 'feed_cam09_exit.jpg', type: 'image/jpeg', size: '1.88 MB' },
      { name: 'feed_artifact_blur_01.jpg', type: 'image/jpeg', size: '890 KB' },
      { name: 'feed_artifact_noise_02.jpg', type: 'image/jpeg', size: '760 KB' }
    ],
    engine: 'Gemini 3.8 Flash Vision + Tesseract OCR',
    integrityHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    duration: '1.84s',
    ocrCount: 5,
    description: 'Surveillance feed timestamp discrepancy across room wide view and main exit cameras.'
  },
  {
    id: 'HIST-20261010-144015',
    caseId: 'EVID-2026-882A',
    caseTitle: 'Corporate Financial Fraud & Altered Ledger',
    analyzedAt: '2026-10-10T14:40:15.000Z',
    analyzedDate: '2026-10-10',
    analyzedTime: '02:40:15 PM',
    office: 'Federal Digital Forensics Laboratory',
    investigator: 'Analyst Sarah Chen',
    priority: 'Critical',
    status: 'complete',
    verdict: 'Verified Authentic',
    evidenceCount: 4,
    modalitiesSummary: 'PDF Documents (3), High-Res Scans (1)',
    files: [
      { name: 'quarterly_ledger_2026_q2.pdf', type: 'application/pdf', size: '3.40 MB' },
      { name: 'bank_wire_receipt_scan.png', type: 'image/png', size: '1.20 MB' },
      { name: 'audit_board_minutes.pdf', type: 'application/pdf', size: '2.10 MB' },
      { name: 'executive_signature_sample.jpg', type: 'image/jpeg', size: '640 KB' }
    ],
    engine: 'Gemini 3.8 Flash Vision + Cryptographic Hasher',
    integrityHash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    duration: '2.41s',
    ocrCount: 4,
    description: 'Multi-page balance sheet forensic validation and signature watermark inspection.'
  },
  {
    id: 'HIST-20261008-182204',
    caseId: 'EVID-2026-871C',
    caseTitle: 'Substation Wiretapping & Telemetry Intercept',
    analyzedAt: '2026-10-08T18:22:04.000Z',
    analyzedDate: '2026-10-08',
    analyzedTime: '06:22:04 PM',
    office: 'Central Police Crime Branch - Unit 4',
    investigator: 'Chief Inspector Marcus Vance',
    priority: 'Standard',
    status: 'complete',
    verdict: 'Verified Authentic',
    evidenceCount: 2,
    modalitiesSummary: 'Audio Intercepts (2)',
    files: [
      { name: 'substation_feed_ch01.wav', type: 'audio/wav', size: '5.60 MB' },
      { name: 'radio_dispatch_911.mp3', type: 'audio/mp3', size: '3.12 MB' }
    ],
    engine: 'Acoustic Spectral Analysis + Core Neural Engine',
    integrityHash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    duration: '1.12s',
    ocrCount: 0,
    description: 'Ambient noise frequency verification and synthetic voice cloning screening.'
  }
];

export const AnalysisHistoryView = ({
  history = [],
  onClearHistory,
  onDeleteRecord,
  onRestoreToWorkspace,
  onNavigateToIngestion
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOffice, setSelectedOffice] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedPriority, setSelectedPriority] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' | 'oldest'
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'
  const [selectedDetailRecord, setSelectedDetailRecord] = useState(null);
  const [copiedHashId, setCopiedHashId] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Extract all unique offices present in the history
  const uniqueOffices = useMemo(() => {
    const set = new Set();
    history.forEach(item => {
      if (item.office) set.add(item.office);
    });
    return Array.from(set);
  }, [history]);

  // Filtered and sorted history
  const filteredHistory = useMemo(() => {
    return history.filter(item => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.caseTitle?.toLowerCase().includes(query);
        const matchesId = item.caseId?.toLowerCase().includes(query);
        const matchesOffice = item.office?.toLowerCase().includes(query);
        const matchesInvestigator = item.investigator?.toLowerCase().includes(query);
        const matchesHash = item.integrityHash?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesId && !matchesOffice && !matchesInvestigator && !matchesHash) {
          return false;
        }
      }

      // Office filter
      if (selectedOffice !== 'ALL' && item.office !== selectedOffice) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'ALL') {
        if (selectedStatus === 'conflicts' && item.status !== 'conflicts') return false;
        if (selectedStatus === 'authentic' && item.status === 'conflicts') return false;
      }

      // Priority filter
      if (selectedPriority !== 'ALL' && item.priority !== selectedPriority) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      const timeA = new Date(a.analyzedAt || 0).getTime();
      const timeB = new Date(b.analyzedAt || 0).getTime();
      return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
    });
  }, [history, searchQuery, selectedOffice, selectedStatus, selectedPriority, sortOrder]);

  // Statistics
  const stats = useMemo(() => {
    const total = history.length;
    const officesCount = uniqueOffices.length;
    const conflicts = history.filter(h => h.status === 'conflicts').length;
    const authentic = total - conflicts;
    return {
      total,
      officesCount,
      conflicts,
      authentic,
      conflictRate: total > 0 ? Math.round((conflicts / total) * 100) : 0,
      authenticRate: total > 0 ? Math.round((authentic / total) * 100) : 0
    };
  }, [history, uniqueOffices]);

  const handleCopyHash = (hash, id) => {
    if (!hash) return;
    navigator.clipboard.writeText(hash);
    setCopiedHashId(id);
    setTimeout(() => setCopiedHashId(null), 2000);
  };

  const handleExportFullAuditJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `veridex_case_analysis_audit_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const formatRelativeTime = (isoString) => {
    if (!isoString) return '';
    try {
      const now = new Date();
      const past = new Date(isoString);
      const diffMs = now - past;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
      if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
      if (diffDays === 1) return 'Yesterday';
      return `${diffDays} days ago`;
    } catch {
      return '';
    }
  };

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500 pt-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center space-x-3 mb-1.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-wide flex items-center gap-2">
                Case Analysis History
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {history.length} Cases
                </span>
              </h2>
              <p className="text-slate-400 text-sm mt-0.5">
                Verifiable forensic chain of custody logging date, timestamp, analysing office, and cryptographic integrity.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleExportFullAuditJson}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center space-x-1.5 hover:border-slate-600 shadow-sm"
            title="Export all analysis history logs as JSON"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export Audit Trail</span>
          </button>

          {history.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-bold transition-all flex items-center space-x-1.5"
              title="Clear all stored history"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}

          <button
            onClick={onNavigateToIngestion}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all flex items-center space-x-1.5 shadow-md"
          >
            <RotateCcw className="w-3.5 h-3.5 text-white" />
            <span>New Analysis</span>
          </button>
        </div>
      </div>

      {/* Forensic Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs uppercase font-medium tracking-wider">Total Analysed</p>
            <p className="text-2xl font-bold text-white mt-1 font-mono">{stats.total}</p>
            <span className="text-[11px] text-cyan-400">Cryptographically signed</span>
          </div>
          <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Database className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs uppercase font-medium tracking-wider">Analysing Offices</p>
            <p className="text-2xl font-bold text-white mt-1 font-mono">{stats.officesCount}</p>
            <span className="text-[11px] text-slate-400">Active participating units</span>
          </div>
          <div className="p-3 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs uppercase font-medium tracking-wider">Anomalies Detected</p>
            <p className="text-2xl font-bold text-amber-400 mt-1 font-mono">{stats.conflicts} <span className="text-xs font-sans text-slate-400">({stats.conflictRate}%)</span></p>
            <span className="text-[11px] text-amber-400/80">Cross-modal conflicts</span>
          </div>
          <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs uppercase font-medium tracking-wider">Verified Authentic</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1 font-mono">{stats.authentic} <span className="text-xs font-sans text-slate-400">({stats.authenticRate}%)</span></p>
            <span className="text-[11px] text-emerald-400/80">Full chain integrity</span>
          </div>
          <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 mb-6 space-y-3">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Case Title, ID, Office name, Lead Officer, or SHA-256..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Office Filter */}
            <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5">
              <Building2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <select
                value={selectedOffice}
                onChange={(e) => setSelectedOffice(e.target.value)}
                className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer max-w-[200px] truncate"
              >
                <option value="ALL" className="bg-slate-900 text-slate-200">All Offices ({history.length})</option>
                {uniqueOffices.map((office) => (
                  <option key={office} value={office} className="bg-slate-900 text-slate-200">
                    {office}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="ALL" className="bg-slate-900 text-slate-200">All Verdicts</option>
                <option value="conflicts" className="bg-slate-900 text-amber-400">Conflicts Detected</option>
                <option value="authentic" className="bg-slate-900 text-emerald-400">Verified Authentic</option>
              </select>
            </div>

            {/* Priority Filter */}
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Standard">Standard</option>
            </select>

            {/* Sorting */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  viewMode === 'cards' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Cards
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  viewMode === 'table' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Table
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Indicators */}
        {(selectedOffice !== 'ALL' || selectedStatus !== 'ALL' || selectedPriority !== 'ALL' || searchQuery) && (
          <div className="flex items-center gap-2 pt-2 border-t border-slate-800 text-xs text-slate-400">
            <span>Filtered by:</span>
            {selectedOffice !== 'ALL' && (
              <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 flex items-center gap-1">
                Office: {selectedOffice}
                <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setSelectedOffice('ALL')} />
              </span>
            )}
            {selectedStatus !== 'ALL' && (
              <span className="px-2 py-0.5 rounded bg-slate-700 text-slate-200 flex items-center gap-1">
                Verdict: {selectedStatus}
                <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setSelectedStatus('ALL')} />
              </span>
            )}
            {selectedPriority !== 'ALL' && (
              <span className="px-2 py-0.5 rounded bg-slate-700 text-slate-200 flex items-center gap-1">
                Priority: {selectedPriority}
                <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setSelectedPriority('ALL')} />
              </span>
            )}
            <button
              onClick={() => {
                setSelectedOffice('ALL');
                setSelectedStatus('ALL');
                setSelectedPriority('ALL');
                setSearchQuery('');
              }}
              className="text-cyan-400 hover:underline ml-auto"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area: Cards or Table */}
      {filteredHistory.length === 0 ? (
        <div className="bg-slate-800/30 border border-slate-700/40 rounded-2xl p-12 text-center max-w-xl mx-auto my-8">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-4 text-cyan-400">
            <History className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No Analysis Records Found</h3>
          <p className="text-slate-400 text-sm mb-6">
            {history.length === 0 
              ? 'No case analyses have been executed yet. Ingest digital evidence and run an analysis to automatically record forensic history.'
              : 'No records match your selected filter criteria. Try adjusting your search query or reset the filters.'}
          </p>
          <button
            onClick={onNavigateToIngestion}
            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-md inline-flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4 text-white" />
            <span>Start New Case Analysis</span>
          </button>
        </div>
      ) : viewMode === 'cards' ? (
        /* Card View */
        <div className="space-y-4">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700/50 hover:border-cyan-500/40 rounded-xl p-5 transition-all duration-200 shadow-md group relative overflow-hidden"
            >
              {/* Left Accent Bar depending on status */}
              <div
                className={`absolute top-0 left-0 bottom-0 w-1.5 ${
                  item.status === 'conflicts' ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
              />

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pl-2">
                {/* Core Case Information */}
                <div className="flex-1 space-y-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      {item.caseId}
                    </span>

                    <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {item.caseTitle}
                    </h4>

                    {/* Priority Badge */}
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        item.priority === 'Critical'
                          ? 'bg-red-500/10 text-red-400 border-red-500/30'
                          : item.priority === 'High'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                      }`}
                    >
                      {item.priority}
                    </span>

                    {/* Verdict Pill */}
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center space-x-1.5 border ${
                        item.status === 'conflicts'
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                          : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      {item.status === 'conflicts' ? (
                        <>
                          <AlertTriangle className="w-3 h-3 text-amber-400" />
                          <span>{item.verdict || 'Conflicts Flagged'}</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-3 h-3 text-emerald-400" />
                          <span>{item.verdict || 'Verified Authentic'}</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* Metadata Row: Time & Date of Analysis, Office, Lead Officer */}
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-slate-300">
                    {/* Timestamp & Date */}
                    <div className="flex items-center space-x-1.5 text-cyan-300/90 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{item.analyzedDate}</span>
                      <span className="text-slate-500">•</span>
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{item.analyzedTime}</span>
                      {item.analyzedAt && (
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-900/60 px-1.5 py-0.5 rounded">
                          {formatRelativeTime(item.analyzedAt)}
                        </span>
                      )}
                    </div>

                    {/* Analysing Office */}
                    <div className="flex items-center space-x-1.5 bg-slate-900/70 border border-slate-700/60 px-2.5 py-1 rounded-md text-slate-200">
                      <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-slate-400 font-sans">Office:</span>
                      <span className="font-semibold text-white tracking-tight">{item.office || 'Metropolitan Cyber Forensics'}</span>
                    </div>

                    {/* Lead Officer */}
                    <div className="flex items-center space-x-1.5 bg-slate-900/70 border border-slate-700/60 px-2 py-1 rounded-md text-slate-300">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-400">Analyst:</span>
                      <span className="font-medium text-slate-200">{item.investigator || 'Investigator Doe'}</span>
                    </div>

                    {/* Files / Modalities */}
                    <div className="flex items-center space-x-1.5 text-slate-400">
                      <Layers className="w-3.5 h-3.5 text-slate-500" />
                      <span>{item.modalitiesSummary || `${item.evidenceCount || 0} Files Analysed`}</span>
                    </div>
                  </div>

                  {/* Cryptographic SHA-256 Signature Snippet */}
                  {item.integrityHash && (
                    <div className="flex items-center space-x-2 pt-1">
                      <span className="text-[11px] font-mono text-slate-500 flex items-center">
                        <ShieldCheck className="w-3 h-3 mr-1 text-cyan-500/80" />
                        SHA-256 Audit Seal:
                      </span>
                      <code className="text-[11px] font-mono text-cyan-400/90 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800 max-w-[280px] truncate">
                        {item.integrityHash}
                      </code>
                      <button
                        onClick={() => handleCopyHash(item.integrityHash, item.id)}
                        className="text-slate-400 hover:text-cyan-300 p-1 rounded hover:bg-slate-700/40 transition-colors"
                        title="Copy SHA-256 Hash"
                      >
                        {copiedHashId === item.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center space-x-2 self-end lg:self-center shrink-0">
                  <button
                    onClick={() => setSelectedDetailRecord(item)}
                    className="px-3 py-2 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Audit</span>
                  </button>

                  <button
                    onClick={() => onRestoreToWorkspace(item)}
                    className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center space-x-1.5 hover:border-cyan-500/40 shadow-sm"
                    title="Load this case and findings into active workspace"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Restore</span>
                  </button>

                  {onDeleteRecord && (
                    <button
                      onClick={() => onDeleteRecord(item.id)}
                      className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
                      title="Delete this historical entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-700/60 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3 font-semibold">Date & Time</th>
                  <th className="px-5 py-3 font-semibold">Case ID / Title</th>
                  <th className="px-5 py-3 font-semibold">Analysing Office</th>
                  <th className="px-5 py-3 font-semibold">Lead Officer</th>
                  <th className="px-5 py-3 font-semibold">Priority</th>
                  <th className="px-5 py-3 font-semibold">Verdict</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/40 text-slate-300">
                {filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-700/25 transition-colors">
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="font-medium text-white flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-cyan-400" />
                        {item.analyzedDate}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {item.analyzedTime}
                      </div>
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="font-mono text-cyan-400 font-bold">{item.caseId}</div>
                      <div className="text-slate-200 font-medium truncate max-w-xs">{item.caseTitle}</div>
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="flex items-center space-x-1.5 text-white font-medium">
                        <Building2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="truncate max-w-[220px]">{item.office || 'Metropolitan Cyber Forensics'}</span>
                      </div>
                    </td>

                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex items-center space-x-1.5 text-slate-300">
                        <User className="w-3 h-3 text-slate-400" />
                        <span>{item.investigator || 'Investigator Doe'}</span>
                      </div>
                    </td>

                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          item.priority === 'Critical'
                            ? 'bg-red-500/10 text-red-400 border-red-500/30'
                            : item.priority === 'High'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                        }`}
                      >
                        {item.priority}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center space-x-1 border ${
                          item.status === 'conflicts'
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                            : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        }`}
                      >
                        {item.status === 'conflicts' ? (
                          <>
                            <AlertTriangle className="w-3 h-3 text-amber-400 mr-1" />
                            <span>Conflicts</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-3 h-3 text-emerald-400 mr-1" />
                            <span>Authentic</span>
                          </>
                        )}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 text-right whitespace-nowrap space-x-1.5">
                      <button
                        onClick={() => setSelectedDetailRecord(item)}
                        className="px-2.5 py-1 rounded bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-[11px] font-bold transition-all inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Audit</span>
                      </button>
                      <button
                        onClick={() => onRestoreToWorkspace(item)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-bold transition-all inline-flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3 text-cyan-400" />
                        <span>Restore</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detailed Forensic Audit Modal */}
      {selectedDetailRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl p-6 relative">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-5">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {selectedDetailRecord.caseId}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Audit Record ID: {selectedDetailRecord.id}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  {selectedDetailRecord.caseTitle}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDetailRecord(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Core Attribution Grid: Time & Date, Analysing Office, Officer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Analysing Office Card */}
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
                <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  <Building2 className="w-4 h-4" />
                  <span>Analysing Office</span>
                </div>
                <p className="text-base font-bold text-white mb-1">
                  {selectedDetailRecord.office || 'Metropolitan Cyber Forensics Division'}
                </p>
                <p className="text-xs text-slate-400">
                  Accredited Forensics & Digital Chain of Custody Unit
                </p>
              </div>

              {/* Time and Date Card */}
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
                <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>Time and Date of Analysis</span>
                </div>
                <p className="text-base font-bold text-white mb-1">
                  {selectedDetailRecord.analyzedDate} at {selectedDetailRecord.analyzedTime}
                </p>
                <p className="text-xs font-mono text-slate-400">
                  ISO: {selectedDetailRecord.analyzedAt || 'N/A'}
                </p>
              </div>

              {/* Lead Officer Card */}
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
                <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  <User className="w-4 h-4" />
                  <span>Lead Investigator</span>
                </div>
                <p className="text-base font-bold text-white mb-1">
                  {selectedDetailRecord.investigator || 'Investigator Doe'}
                </p>
                <p className="text-xs text-slate-400">
                  Verified Level 4 Security Clearance
                </p>
              </div>

              {/* Execution Duration & Engine */}
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
                <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Core Analysis Engine</span>
                </div>
                <p className="text-sm font-bold text-white mb-1">
                  {selectedDetailRecord.engine || 'Gemini 3.8 Flash Vision OCR'}
                </p>
                <p className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
                  Runtime: {selectedDetailRecord.duration || '1.8s'} • Complete
                </p>
              </div>
            </div>

            {/* Cryptographic Hash Audit Seal */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Cryptographic Audit Signature (SHA-256)
                </span>
                <button
                  onClick={() => handleCopyHash(selectedDetailRecord.integrityHash, 'modal')}
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  {copiedHashId === 'modal' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Signature</span>
                    </>
                  )}
                </button>
              </div>
              <p className="font-mono text-xs text-cyan-300 break-all bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                {selectedDetailRecord.integrityHash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
              </p>
            </div>

            {/* Files & Modalities Analysed */}
            {selectedDetailRecord.files && selectedDetailRecord.files.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  Evidence Files in Package ({selectedDetailRecord.files.length})
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                  {selectedDetailRecord.files.map((file, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-2.5 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <FileDigit className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span className="text-slate-200 font-medium truncate">{file.name}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-slate-400 shrink-0">
                        <span>{file.size}</span>
                        <span className="text-[10px] font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                          {file.type || 'unknown'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Forensic Description Notes */}
            {selectedDetailRecord.description && (
              <div className="mb-6 bg-slate-800/30 p-3.5 rounded-xl border border-slate-800">
                <span className="text-[11px] font-semibold uppercase text-slate-400 block mb-1">
                  Forensic Ingestion Notes
                </span>
                <p className="text-xs text-slate-300 italic">
                  "{selectedDetailRecord.description}"
                </p>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedDetailRecord(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                Close Audit
              </button>
              <button
                onClick={() => {
                  onRestoreToWorkspace(selectedDetailRecord);
                  setSelectedDetailRecord(null);
                }}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all flex items-center space-x-1.5 shadow-md"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restore Case to Workspace</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4 text-red-400">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Clear Analysis History?</h3>
            <p className="text-slate-400 text-xs mb-6">
              This will permanently delete all stored analysis history and chain-of-custody audit logs from local storage. This action cannot be undone.
            </p>
            <div className="flex items-center justify-center space-x-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onClearHistory();
                  setShowClearConfirm(false);
                }}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors"
              >
                Yes, Clear All History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
