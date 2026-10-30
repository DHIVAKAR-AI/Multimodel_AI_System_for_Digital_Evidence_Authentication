import React, { useState, useMemo } from 'react';
import {
  Folder, FolderLock, FolderPlus, FolderOpen, Lock, Unlock,
  Key, KeyRound, Shield, ShieldCheck, ShieldAlert, Archive,
  History, Copy, Clock, Calendar, FileText, CheckCircle,
  AlertTriangle, Activity, Camera, Download, RefreshCw,
  Trash2, ArrowRight, Eye, EyeOff, Search, ChevronRight,
  ChevronDown, ChevronUp, Cpu, Database, ExternalLink,
  Sparkles, Layers, Image as ImageIcon, Video, Music
} from 'lucide-react';
import { DirectEvidenceViewerModal, getMediaType } from './DirectEvidenceViewerModal';
import { fileCache } from './fileCache';

// Default initial case folders organized by date and time with all modalities
export const DEFAULT_CASE_FOLDERS = [
  {
    id: 'folder-2026-10-09',
    name: 'Surveillance CCTV Archives',
    date: '2026-10-09',
    time: '21:00:00',
    createdAt: '2026-10-09T21:00:00',
    description: 'Optical CCTV sequential evidence packages & multi-camera incident feeds',
    cases: [
      {
        id: 'EVID-2026-904B',
        title: 'Downtown Traffic Incident',
        investigator: 'Investigator Doe',
        priority: 'High',
        status: 'Complete',
        savedDate: '2026-10-09',
        savedTime: '21:15:30',
        savedAt: '2026-10-09T21:15:30',
        incidentDate: '2026-10-07',
        confidenceScore: 42,
        risk: 'High',
        description: 'Multi-camera CCTV surveillance footage showing incident in Room 3 with optical OCR timestamp discrepancies and exterior transit.',
        password: 'veridex2026',
        passwordHint: 'Default system passcode: veridex2026',
        evidenceFiles: [
          { name: 'cctv_corridor_cam03_stream.mp4', size: '14.8 MB', type: 'video/mp4', sha256: '8b7a6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b' },
          { name: 'feed_cam05_wide.jpg', size: '1.42 MB', type: 'image/jpeg', sha256: '9f8e7d6c5b4a3120192837465abcedf0123456789abcdef0123456789abcdef0' },
          { name: '2b1a88e8-8ed4-479a-8d22-77c86c9874db.jpg', size: '2.15 MB', type: 'image/jpeg', sha256: '4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b' },
          { name: 'feed_cam09_exit.jpg', size: '1.88 MB', type: 'image/jpeg', sha256: '7c6b5a4d3e2f1098a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4' },
          { name: 'feed_artifact_blur_01.jpg', size: '890 KB', type: 'image/jpeg', sha256: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f901a2b3c4d5e6f7a8b9c0d1e2f3a' },
          { name: 'feed_artifact_noise_02.jpg', size: '760 KB', type: 'image/jpeg', sha256: '2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f901a2b3c4d5e6f7a8b9c0d1e2f3a4b' },
          { name: 'traffic_incident_police_dispatch.wav', size: '4.10 MB', type: 'audio/wav', sha256: '5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e' },
          { name: 'incident_initial_field_report.pdf', size: '1.25 MB', type: 'application/pdf', sha256: '3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f901a2b3c4d5e6f7a8b9c0d1e2f3a4b5c' }
        ],
        ocrResults: {
          "feed_cam05_wide.jpg": "CAM @5 - ROOM (WIDE VIEW) |) Wil Gy 2026-09-18\n22:17:23\n<i Tie Le\n2 ta | Ry\neh \\ y - NY <- SS f \"",
          "2b1a88e8-8ed4-479a-8d22-77c86c9874db.jpg": "= =\nCAM 3 - ROOM (INCIDENT) 4 2026-09-18 22:16:48\n7\" |",
          "feed_cam09_exit.jpg": "_ CAM @9 - MAIN EXIT (OUTSIDE) @ q 4 2026-09-18\n22:19:38\n: _ ; aa '\n\\ - | a Pe a eice?\n'eon jy ee ant ' ; {\nEde SO er Se SE A ~",
          "feed_artifact_blur_01.jpg": "a ? P é\n1 a \\ I\ny ( \\.\nee\nif",
          "feed_artifact_noise_02.jpg": "$ . : ; 4 ys - z oa 4 G. 1\n\nA - << 4 f\nen >) ee ad |\n\n7 ; By) J -\\ ~~"
        },
        crossModalFlags: [
          { type: 'temporal_mismatch', severity: 'high', description: 'OCR extracted timestamps do not match provided video metadata.' },
          { type: 'frame_discontinuity', severity: 'medium', description: 'Sequential transit delta between CAM 05 and CAM 09 exceeds nominal threshold.' }
        ],
        masterHash: 'SHA256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        notes: 'Sequential optical CCTV OCR processed. Origin event at 22:16:48, exit logged at 22:19:38.'
      }
    ]
  },
  {
    id: 'folder-2026-10-07',
    name: 'Corporate Audit & Contract Analysis',
    date: '2026-10-07',
    time: '14:20:00',
    createdAt: '2026-10-07T14:20:00',
    description: 'Document forensics, scanned ledger authentications, and corporate fraud investigations',
    cases: [
      {
        id: 'EVID-2026-882A',
        title: 'Corporate Fraud Audit',
        investigator: 'Analyst Sarah Chen',
        priority: 'High',
        status: 'Complete',
        savedDate: '2026-10-07',
        savedTime: '14:22:10',
        savedAt: '2026-10-07T14:22:10',
        incidentDate: '2026-10-05',
        confidenceScore: 78,
        risk: 'Medium',
        description: 'Audit of executive contract amendments and high-value authorization ledger PDFs.',
        password: 'veridex2026',
        passwordHint: 'Default system passcode: veridex2026',
        evidenceFiles: [
          { name: 'contract_amendment_scan.pdf', size: '3.40 MB', type: 'application/pdf', sha256: 'a1b2c3d4e5f60718293a4b5c6d7e8f901a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d' },
          { name: 'bank_wire_voucher_oct05.png', size: '1.12 MB', type: 'image/png', sha256: 'f0e1d2c3b4a5968778695a4b3c2d1e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d' },
          { name: 'executive_boardroom_cam01.mp4', size: '16.5 MB', type: 'video/mp4', sha256: '1f2e3d4c5b6a79880192837465abcedf0123456789abcdef0123456789abcdef0' },
          { name: 'auditor_interview_deposition.mp3', size: '5.80 MB', type: 'audio/mp3', sha256: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b' }
        ],
        ocrResults: {
          "contract_amendment_scan.pdf": "AMENDMENT TO CONSULTING AGREEMENT\nEXECUTED: 2026-10-05 11:30:00\nSIGNATURE: J. K. FORENSIC VERIFIED",
          "bank_wire_voucher_oct05.png": "FEDWIRE TRANSFER VOUCHER #994821\nDATE: 2026-10-05\nAMOUNT: $425,000.00 USD"
        },
        crossModalFlags: [
          { type: 'font_anomaly', severity: 'medium', description: 'Digital signature font kerning differs by 12% from base agreement.' }
        ],
        masterHash: 'SHA256: d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35',
        notes: 'Document structure parsed. Signature kerning variance flagged for secondary manual check.'
      }
    ]
  },
  {
    id: 'folder-2026-10-05',
    name: 'Claim & Incident Verifications',
    date: '2026-10-05',
    time: '09:40:00',
    createdAt: '2026-10-05T09:40:00',
    description: 'Vehicle damage photo inspections, audio dispatch verification, and tamper detection',
    cases: [
      {
        id: 'EVID-2026-871C',
        title: 'Insurance Claim #4029',
        investigator: 'Chief Inspector Marcus Vance',
        priority: 'Critical',
        status: 'Complete',
        savedDate: '2026-10-05',
        savedTime: '09:45:15',
        savedAt: '2026-10-05T09:45:15',
        incidentDate: '2026-10-02',
        confidenceScore: 28,
        risk: 'Critical',
        description: 'Vehicular collision photos submitted for claim verification. Suspected copy-paste splicing and EXIF timestamp alteration.',
        password: 'veridex2026',
        passwordHint: 'Default system passcode: veridex2026',
        evidenceFiles: [
          { name: 'dashcam_front_collision_feed.mp4', size: '24.2 MB', type: 'video/mp4', sha256: '7a6b5c4d3e2f1098a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4' },
          { name: 'vehicle_side_damage_01.jpg', size: '2.84 MB', type: 'image/jpeg', sha256: '5e4d3c2b1a0f9e8d7c6b5a4d3e2f1098a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2' },
          { name: 'dispatch_call_recording.wav', size: '5.20 MB', type: 'audio/wav', sha256: '6f5e4d3c2b1a0f9e8d7c6b5a4d3e2f1098a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3' },
          { name: 'police_accident_report_4029.pdf', size: '2.10 MB', type: 'application/pdf', sha256: '2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b' }
        ],
        ocrResults: {
          "vehicle_side_damage_01.jpg": "VIN: 1HGCR2F83HA029188\nTIMESTAMP: 2026-10-02 18:44:12\nLOCATION: INTERSECTION 4TH & BROAD"
        },
        crossModalFlags: [
          { type: 'metadata_tampering', severity: 'high', description: 'EXIF creation timestamp precedes vehicle manufacturing date.' },
          { type: 'image_splicing', severity: 'critical', description: 'Error Level Analysis (ELA) detected high-frequency quantization mismatch along fender edge.' }
        ],
        masterHash: 'SHA256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
        notes: 'Critical tampering identified in accident photos. Forwarded for fraud referral.'
      }
    ]
  }
];

// Main Case Folders View
export const CaseFoldersView = ({
  folders = [],
  unlockedCaseIds = new Set(),
  selectedCaseRecord = null,
  onSelectCaseRecord,
  onBackToFolders,
  onOpenUnlockModal,
  onLockCase,
  onLockAllCases,
  onOpenSaveModal,
  onOpenNewFolderModal,
  onRestoreCaseToWorkspace,
  onDeleteCase,
  onDeleteFolder,
  onExportReport
}) => {
  const [selectedFolderFilter, setSelectedFolderFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFolderIds, setExpandedFolderIds] = useState(() => {
    // Expand all folders by default
    return new Set(folders.map(f => f.id));
  });
  const [copiedHash, setCopiedHash] = useState(false);
  const [activeEvidenceModal, setActiveEvidenceModal] = useState({ file: null, caseItem: null });

  const handleOpenEvidence = (file, targetCase) => {
    const c = targetCase || selectedCaseRecord;
    const resolved = fileCache.resolve(file);
    setActiveEvidenceModal({ file: resolved, caseItem: c });
  };

  const toggleFolderExpand = (folderId) => {
    setExpandedFolderIds(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  // Calculate totals
  const totalCases = useMemo(() => {
    return folders.reduce((sum, f) => sum + (f.cases ? f.cases.length : 0), 0);
  }, [folders]);

  const unlockedCount = useMemo(() => {
    let count = 0;
    folders.forEach(f => {
      f.cases?.forEach(c => {
        if (unlockedCaseIds.has(c.id)) count++;
      });
    });
    return count;
  }, [folders, unlockedCaseIds]);

  const filteredFolders = useMemo(() => {
    let list = folders;
    if (selectedFolderFilter !== 'all') {
      list = list.filter(f => f.id === selectedFolderFilter);
    }
    if (!searchQuery.trim()) return list;

    const query = searchQuery.toLowerCase();
    return list.map(f => {
      const matchesFolder = f.name.toLowerCase().includes(query) || f.date.includes(query);
      const filteredCases = (f.cases || []).filter(c => 
        c.title.toLowerCase().includes(query) ||
        c.id.toLowerCase().includes(query) ||
        (c.investigator && c.investigator.toLowerCase().includes(query)) ||
        (c.savedDate && c.savedDate.includes(query))
      );
      if (matchesFolder) return f;
      if (filteredCases.length > 0) return { ...f, cases: filteredCases };
      return null;
    }).filter(Boolean);
  }, [folders, selectedFolderFilter, searchQuery]);

  const handleCopyHash = (hash) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(hash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  // =========================================================================
  // Render Unlocked Previous Record View
  // =========================================================================
  if (selectedCaseRecord) {
    const isUnlocked = unlockedCaseIds.has(selectedCaseRecord.id);

    // If somehow locked while viewed, show locked screen
    if (!isUnlocked) {
      return (
        <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in duration-300">
          <button
            onClick={onBackToFolders}
            className="flex items-center text-xs font-semibold text-slate-400 hover:text-cyan-400 mb-6 transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5 rotate-180 mr-1.5" /> Back to Case Folders
          </button>
          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-10 text-center shadow-2xl relative overflow-hidden backdrop-blur-md">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-5 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Case Record Encrypted</h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
              Case <span className="font-mono text-cyan-400 font-bold">#{selectedCaseRecord.id}</span> ({selectedCaseRecord.title}) is locked. Enter the security passcode to view this forensic dossier.
            </p>
            <button
              onClick={() => onOpenUnlockModal(selectedCaseRecord)}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold px-6 py-2.5 rounded-lg text-sm shadow-lg shadow-cyan-950/50 transition-all flex items-center mx-auto"
            >
              <KeyRound className="w-4 h-4 mr-2" /> Enter Decryption Password
            </button>
          </div>
        </div>
      );
    }

    // Full Previous Record Details
    const caseItem = selectedCaseRecord;
    const scoreColor = (caseItem.confidenceScore || 42) < 50 ? '#ef4444' : (caseItem.confidenceScore || 42) < 75 ? '#f59e0b' : '#10b981';

    return (
      <div className="max-w-6xl mx-auto pt-6 pb-16 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
        {/* Top Navigation & Status Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBackToFolders}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center transition-all"
            >
              <ArrowRight className="w-3.5 h-3.5 rotate-180 mr-1.5 text-cyan-400" />
              All Case Folders
            </button>
            <div className="h-5 w-px bg-slate-800"></div>
            <span className="flex items-center text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Decrypted Record Active
            </span>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => onRestoreCaseToWorkspace(caseItem)}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-md shadow-cyan-950/50 flex items-center"
              title="Load this case into the Active Pipeline workspace"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Restore to Active Pipeline
            </button>

            {onExportReport && (
              <button
                onClick={() => onExportReport(caseItem)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors flex items-center shadow"
              >
                <Download className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
                Export Dossier
              </button>
            )}

            <button
              onClick={() => onLockCase(caseItem.id)}
              className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center shadow"
              title="Lock this case record immediately"
            >
              <Lock className="w-3.5 h-3.5 mr-1.5" />
              Lock Record
            </button>
          </div>
        </div>

        {/* Case Record Dossier Header Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 relative z-10">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="font-mono text-sm font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-md">
                  #{caseItem.id}
                </span>
                <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border
                  ${caseItem.priority === 'Critical' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                    caseItem.priority === 'High' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                    'bg-blue-500/10 text-blue-400 border-blue-500/30'}`}
                >
                  {caseItem.priority} Priority
                </span>
                <span className="text-xs text-slate-400 font-mono bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800 flex items-center">
                  <Clock className="w-3 h-3 mr-1 text-slate-500" />
                  Saved: {caseItem.savedDate} at {caseItem.savedTime || 'N/A'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide mt-1">
                {caseItem.title}
              </h1>
              <p className="text-slate-400 text-sm mt-2 max-w-3xl leading-relaxed">
                {caseItem.description || 'Forensic multimodal evidence snapshot archived in encrypted vault.'}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-slate-800/80 text-xs font-mono">
                <div>
                  <span className="text-slate-500 uppercase block text-[10px] font-sans">Lead Investigator</span>
                  <span className="text-slate-200 font-bold">{caseItem.investigator || 'Investigator Doe'}</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase block text-[10px] font-sans">Incident Date</span>
                  <span className="text-slate-200 font-bold">{caseItem.incidentDate || caseItem.savedDate}</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase block text-[10px] font-sans">Evidence Files</span>
                  <span className="text-cyan-400 font-bold">{caseItem.evidenceFiles?.length || 0} Ingested Assets</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase block text-[10px] font-sans">Security Status</span>
                  <span className="text-emerald-400 font-bold flex items-center">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Password Protected
                  </span>
                </div>
              </div>
            </div>

            {/* Score Radial Preview */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 flex flex-col items-center justify-center min-w-[200px] shadow-inner">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Authenticity Score</span>
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="#1e293b" strokeWidth="8" fill="none" />
                  <circle
                    cx="48" cy="48" r="40"
                    stroke={scoreColor}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray="251.32"
                    strokeDashoffset={251.32 - (251.32 * (caseItem.confidenceScore || 42)) / 100}
                    style={{ filter: `drop-shadow(0 0 6px ${scoreColor})` }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-white">{caseItem.confidenceScore || 42}%</span>
                </div>
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 mt-2 rounded-full border
                ${(caseItem.confidenceScore || 42) < 50 ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'}`}
              >
                {caseItem.risk || 'High Risk'}
              </span>
            </div>
          </div>

          {/* Master SHA-256 Digest Bar */}
          <div className="mt-5 p-3 rounded-lg bg-slate-950/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-xs">
            <div className="flex items-center text-slate-400 truncate">
              <Database className="w-3.5 h-3.5 mr-2 text-cyan-400 shrink-0" />
              <span className="text-slate-500 mr-2 shrink-0">Master Hash:</span>
              <span className="text-slate-300 truncate">{caseItem.masterHash || 'SHA256: 8a73b49c0d1e2f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f90'}</span>
            </div>
            <button
              onClick={() => handleCopyHash(caseItem.masterHash || 'SHA256: 8a73b49c0d1e2f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f90')}
              className="text-cyan-400 hover:text-cyan-300 text-[11px] font-semibold flex items-center shrink-0"
            >
              <Copy className="w-3 h-3 mr-1" />
              {copiedHash ? 'Copied!' : 'Copy Hash'}
            </button>
          </div>
        </div>

        {/* Cross-Modal Findings & Anomalies */}
        {caseItem.crossModalFlags && caseItem.crossModalFlags.length > 0 && (
          <div className="bg-slate-900/80 border border-red-500/30 rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-4 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Cross-Modal Conflict & Tamper Flags ({caseItem.crossModalFlags.length})
            </h3>
            <div className="space-y-3">
              {caseItem.crossModalFlags.map((flag, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-red-500/5 border border-red-500/20 flex items-start space-x-3">
                  <div className="p-1 rounded bg-red-500/20 text-red-400 mt-0.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-red-300 uppercase">{flag.type.replace('_', ' ')}</span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.2 rounded bg-red-500/20 text-red-400">
                        {flag.severity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">{flag.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Evidence Assets Table & Direct Media Gallery */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center">
                <Layers className="w-5 h-5 mr-2 text-cyan-400" />
                Ingested Evidence Package Assets
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Stored forensic files. Click on any asset below to view videos, images, audios, and documents directly.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-full">
                {caseItem.evidenceFiles?.length || 0} Ingested Assets
              </span>
            </div>
          </div>

          {/* Quick Direct Media Preview Cards Grid */}
          {caseItem.evidenceFiles && caseItem.evidenceFiles.length > 0 && (
            <div>
              <div className="text-[11px] font-mono text-slate-400 uppercase font-semibold mb-3 flex items-center justify-between">
                <span className="flex items-center">
                  <Eye className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
                  Quick Direct Access Gallery (Click to View)
                </span>
                <span className="text-slate-500 text-[10px]">Supports Video, Image, Audio & Document</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {caseItem.evidenceFiles.map((file, idx) => {
                  const mType = getMediaType(file);
                  return (
                    <div
                      key={idx}
                      onClick={() => handleOpenEvidence(file, caseItem)}
                      className="group p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/40 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between shadow-md hover:shadow-cyan-950/30 hover:-translate-y-0.5"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className={`p-2 rounded-lg ${
                          mType === 'video' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30' :
                          mType === 'audio' ? 'bg-pink-500/10 text-pink-400 border border-pink-500/30' :
                          mType === 'document' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                          'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                        }`}>
                          {mType === 'video' ? <Video className="w-4 h-4" /> :
                           mType === 'audio' ? <Music className="w-4 h-4" /> :
                           mType === 'document' ? <FileText className="w-4 h-4" /> :
                           <ImageIcon className="w-4 h-4" />}
                        </div>
                        <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${
                          mType === 'video' ? 'bg-purple-500/10 text-purple-300 border-purple-500/20' :
                          mType === 'audio' ? 'bg-pink-500/10 text-pink-300 border-pink-500/20' :
                          mType === 'document' ? 'bg-amber-500/10 text-amber-300 border-amber-500/20' :
                          'bg-cyan-500/10 text-cyan-300 border-cyan-500/20'
                        }`}>
                          {mType}
                        </span>
                      </div>

                      <div className="mb-3">
                        <h4 className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors truncate" title={file.name}>
                          {file.name}
                        </h4>
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5 flex items-center justify-between">
                          <span>{file.size || '1.5 MB'}</span>
                          <span className="text-slate-500">{file.sha256 ? `${file.sha256.slice(0, 8)}...` : 'Verified'}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEvidence(file, caseItem);
                        }}
                        className="w-full py-1.5 px-2.5 rounded-lg bg-slate-900 group-hover:bg-cyan-500 text-slate-300 group-hover:text-slate-950 border border-slate-700/80 group-hover:border-cyan-400 text-[11px] font-bold font-sans flex items-center justify-center transition-all shadow"
                      >
                        <Eye className="w-3 h-3 mr-1.5" />
                        <span>View Directly</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Full Evidence Table */}
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Evidence Asset Name</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">File Size</th>
                  <th className="py-3 px-4">SHA-256 Checksum</th>
                  <th className="py-3 px-4 text-center">OCR Transcription</th>
                  <th className="py-3 px-4 text-right">Direct Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {(caseItem.evidenceFiles || []).map((file, idx) => {
                  const mType = getMediaType(file);
                  return (
                    <tr
                      key={idx}
                      onClick={() => handleOpenEvidence(file, caseItem)}
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4 font-sans font-medium text-slate-100 flex items-center space-x-2.5">
                        <div className={`p-1.5 rounded-lg ${
                          mType === 'video' ? 'bg-purple-500/10 text-purple-400' :
                          mType === 'audio' ? 'bg-pink-500/10 text-pink-400' :
                          mType === 'document' ? 'bg-amber-500/10 text-amber-400' :
                          'bg-blue-500/10 text-cyan-400'
                        }`}>
                          {mType === 'video' ? <Video className="w-4 h-4" /> :
                           mType === 'audio' ? <Music className="w-4 h-4" /> :
                           mType === 'document' ? <FileText className="w-4 h-4" /> :
                           <ImageIcon className="w-4 h-4" />}
                        </div>
                        <div className="truncate max-w-xs">
                          <span className="font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors block truncate">{file.name}</span>
                          <span className="text-[10px] text-slate-500 font-mono capitalize">{mType} asset</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">{file.type || 'image/jpeg'}</td>
                      <td className="py-3.5 px-4 text-slate-400">{file.size || '1.5 MB'}</td>
                      <td className="py-3.5 px-4 text-slate-500 truncate max-w-xs font-mono text-[11px]">
                        {file.sha256 ? `${file.sha256.slice(0, 16)}...${file.sha256.slice(-8)}` : 'sha256: verified'}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {caseItem.ocrResults && caseItem.ocrResults[file.name] ? (
                          <span className="inline-flex items-center text-[10px] font-bold uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                            <CheckCircle className="w-3 h-3 mr-1" /> Transcribed
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[10px]">None</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEvidence(file, caseItem);
                          }}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 hover:text-white border border-cyan-500/30 text-xs font-bold font-sans transition-all shadow-sm hover:scale-105"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          <span>View Directly</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* OCR Raw Extractions Inspection */}
        {caseItem.ocrResults && Object.keys(caseItem.ocrResults).length > 0 && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-1 flex items-center">
              <Camera className="w-5 h-5 mr-2 text-cyan-400" />
              Recorded OCR Transcripts & Optical Surveillance Feeds
            </h3>
            <p className="text-xs text-slate-400 mb-5">Gemini Vision OCR verbatim extractions recorded when this case was saved. Click to view source media directly.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(caseItem.ocrResults).map(([filename, text], idx) => {
                const targetFile = (caseItem.evidenceFiles || []).find(f => f.name === filename) || { name: filename, type: 'image/jpeg' };
                return (
                  <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 gap-2">
                      <span className="font-mono text-xs font-bold text-cyan-400 truncate max-w-[200px]">{filename}</span>
                      <div className="flex items-center space-x-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEvidence(targetFile, caseItem)}
                          className="text-[10px] font-bold text-cyan-300 hover:text-white bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 px-2 py-0.5 rounded flex items-center transition-colors"
                          title="Directly view the media with OCR data"
                        >
                          <Eye className="w-3 h-3 mr-1 text-cyan-400" />
                          View Media
                        </button>
                        <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-900 px-2 py-0.5 rounded">OCR Output</span>
                      </div>
                    </div>
                    <pre className="text-xs font-mono text-slate-300 bg-slate-900/50 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-36">
                      {text}
                    </pre>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Case Notes & Audit Trail */}
        {caseItem.notes && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center">
              <FileText className="w-4 h-4 mr-2 text-cyan-400" />
              Forensic Observations & Chain of Custody Notes
            </h3>
            <p className="text-xs text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800 leading-relaxed font-mono">
              {caseItem.notes}
            </p>
          </div>
        )}

        {/* Global Direct Evidence Media Viewer Modal */}
        {activeEvidenceModal.file && (
          <DirectEvidenceViewerModal
            file={activeEvidenceModal.file}
            caseItem={activeEvidenceModal.caseItem}
            allFiles={activeEvidenceModal.caseItem?.evidenceFiles || []}
            onClose={() => setActiveEvidenceModal({ file: null, caseItem: null })}
            onSelectFile={(nextFile) => handleOpenEvidence(nextFile, activeEvidenceModal.caseItem)}
          />
        )}
      </div>
    );
  }

  // =========================================================================
  // Render Folder Explorer Overview (Multiple Case Folders by Date & Time)
  // =========================================================================
  return (
    <div className="max-w-7xl mx-auto pt-6 pb-16 space-y-8 animate-in fade-in duration-500">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-1.5">
            <span className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
              <FolderLock className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide flex items-center">
                Case Folders & Evidence Vault
                <span className="ml-3 text-xs font-mono font-bold uppercase px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Password Protected
                </span>
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
                Saved case analyses organized across date and time folders. Encrypted with security passcode verification.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenSaveModal}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold px-4 py-2.5 rounded-lg text-xs shadow-lg shadow-cyan-950/50 hover:shadow-cyan-500/30 transition-all flex items-center"
          >
            <Archive className="w-4 h-4 mr-1.5" />
            Save Current Case to Folder
          </button>

          <button
            onClick={onOpenNewFolderModal}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors flex items-center"
          >
            <FolderPlus className="w-4 h-4 mr-1.5 text-cyan-400" />
            New Folder
          </button>

          {unlockedCount > 0 && (
            <button
              onClick={onLockAllCases}
              className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-2.5 rounded-lg text-xs font-bold transition-colors flex items-center"
              title="Lock all decrypted cases immediately"
            >
              <Lock className="w-3.5 h-3.5 mr-1.5" />
              Lock All ({unlockedCount})
            </button>
          )}
        </div>
      </div>

      {/* KPI Overview Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Case Folders</span>
            <Folder className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{folders.length}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Grouped by Date & Time</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Archived Case Records</span>
            <Database className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{totalCases}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Full forensic dossiers</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Vault Encryption Status</span>
            <Shield className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-sm font-bold text-emerald-400 flex items-center mt-1">
            <ShieldCheck className="w-4 h-4 mr-1.5" /> Password Locked
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block font-mono">SHA-256 + Access PIN</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Unlocked Sessions</span>
            <KeyRound className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 font-mono">
            {unlockedCount} <span className="text-xs text-slate-500 font-normal">/ {totalCases}</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {unlockedCount === 0 ? 'All dossiers locked' : `${unlockedCount} unlocked in session`}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Folder Date Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedFolderFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedFolderFilter === 'all'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            All Folders ({folders.length})
          </button>
          {folders.map(f => (
            <button
              key={f.id}
              onClick={() => setSelectedFolderFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center transition-all ${
                selectedFolderFilter === f.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Calendar className="w-3 h-3 mr-1" />
              {f.date} ({f.cases?.length || 0})
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cases or dates..."
            className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>
      </div>

      {/* Folder & Cases Grid */}
      <div className="space-y-6">
        {filteredFolders.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center">
            <FolderOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No Case Folders Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-5">
              {searchQuery ? 'No folders or cases match your search filter.' : 'Create a new folder or save the current case to begin archiving.'}
            </p>
            <button
              onClick={onOpenSaveModal}
              className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all"
            >
              Save Active Case to Folder
            </button>
          </div>
        ) : (
          filteredFolders.map((folder) => {
            const isExpanded = expandedFolderIds.has(folder.id);
            const folderCases = folder.cases || [];

            return (
              <div
                key={folder.id}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl transition-all"
              >
                {/* Folder Header */}
                <div
                  className="p-5 bg-slate-900/90 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-800/40 transition-colors"
                  onClick={() => toggleFolderExpand(folder.id)}
                >
                  <div className="flex items-center space-x-3.5">
                    <span className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                      {isExpanded ? <FolderOpen className="w-5 h-5" /> : <FolderLock className="w-5 h-5" />}
                    </span>
                    <div>
                      <div className="flex items-center space-x-2.5">
                        <h2 className="text-lg font-bold text-white tracking-wide">
                          {folder.name}
                        </h2>
                        <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                          {folderCases.length} {folderCases.length === 1 ? 'Case' : 'Cases'}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono mt-1">
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1 text-slate-500" /> {folder.date}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1 text-slate-500" /> {folder.time || '12:00:00'}
                        </span>
                        {folder.description && (
                          <span className="text-slate-500 font-sans truncate max-w-md hidden md:inline">
                            • {folder.description}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                    {onDeleteFolder && folderCases.length === 0 && (
                      <button
                        onClick={() => onDeleteFolder(folder.id)}
                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete empty folder"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => toggleFolderExpand(folder.id)}
                      className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Folder Cases List */}
                {isExpanded && (
                  <div className="p-5">
                    {folderCases.length === 0 ? (
                      <div className="py-8 text-center text-slate-500 text-xs">
                        This date folder is empty. Save a new case to store it here.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {folderCases.map((caseItem) => {
                          const isUnlocked = unlockedCaseIds.has(caseItem.id);

                          return (
                            <div
                              key={caseItem.id}
                              className={`rounded-xl p-5 border transition-all duration-300 relative flex flex-col justify-between
                                ${isUnlocked
                                  ? 'bg-slate-950 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.08)] hover:border-emerald-500'
                                  : 'bg-slate-950/80 border-slate-800 hover:border-cyan-500/50 shadow-md'}`}
                            >
                              <div>
                                {/* Status and Time Badges */}
                                <div className="flex items-center justify-between mb-3">
                                  <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                                    #{caseItem.id}
                                  </span>

                                  {isUnlocked ? (
                                    <span className="flex items-center text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                                      <Unlock className="w-3 h-3 mr-1" /> Decrypted
                                    </span>
                                  ) : (
                                    <span className="flex items-center text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
                                      <Lock className="w-3 h-3 mr-1" /> Password Locked
                                    </span>
                                  )}
                                </div>

                                <h3 className="text-base font-bold text-white tracking-wide mb-1.5 line-clamp-1">
                                  {caseItem.title}
                                </h3>

                                <div className="space-y-1 text-xs text-slate-400 font-mono mb-4">
                                  <div className="flex items-center text-slate-400">
                                    <Clock className="w-3 h-3 mr-1.5 text-cyan-400 shrink-0" />
                                    <span>Saved: <strong className="text-slate-200">{caseItem.savedDate} {caseItem.savedTime || ''}</strong></span>
                                  </div>
                                  <div className="flex items-center text-slate-400">
                                    <Layers className="w-3 h-3 mr-1.5 text-blue-400 shrink-0" />
                                    <span>Evidence: <strong className="text-slate-200">{caseItem.evidenceFiles?.length || 0} Assets</strong></span>
                                  </div>
                                </div>

                                {/* Clickable Stored Evidence Data Pills */}
                                {caseItem.evidenceFiles && caseItem.evidenceFiles.length > 0 && (
                                  <div className="mb-4 p-2.5 rounded-lg bg-slate-900/90 border border-slate-800/80">
                                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase font-semibold mb-2">
                                      <span className="flex items-center">
                                        <Eye className="w-3 h-3 mr-1 text-cyan-400" />
                                        Direct Stored Media
                                      </span>
                                      <span className="text-[10px] text-cyan-400">{caseItem.evidenceFiles.length} files</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                      {caseItem.evidenceFiles.slice(0, 3).map((f, i) => {
                                        const mType = getMediaType(f);
                                        return (
                                          <button
                                            key={i}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              if (isUnlocked) {
                                                handleOpenEvidence(f, caseItem);
                                              } else {
                                                onOpenUnlockModal(caseItem);
                                              }
                                            }}
                                            className={`text-[10px] font-mono px-2 py-1 rounded flex items-center transition-all group border ${
                                              isUnlocked
                                                ? 'bg-slate-950 hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-300 border-slate-800 hover:border-cyan-500/40'
                                                : 'bg-slate-950/60 text-slate-400 hover:text-amber-300 border-slate-800/60 hover:border-amber-500/40'
                                            }`}
                                            title={isUnlocked ? `Click to view ${f.name} directly` : 'Unlock case to view directly'}
                                          >
                                            {mType === 'video' ? <Video className="w-3 h-3 text-purple-400 mr-1 shrink-0" /> :
                                             mType === 'audio' ? <Music className="w-3 h-3 text-pink-400 mr-1 shrink-0" /> :
                                             mType === 'document' ? <FileText className="w-3 h-3 text-amber-400 mr-1 shrink-0" /> :
                                             <ImageIcon className="w-3 h-3 text-cyan-400 mr-1 shrink-0" />}
                                            <span className="truncate max-w-[85px]">{f.name}</span>
                                            <Eye className="w-2.5 h-2.5 ml-1 opacity-0 group-hover:opacity-100 text-cyan-400 transition-opacity shrink-0" />
                                          </button>
                                        );
                                      })}
                                      {caseItem.evidenceFiles.length > 3 && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            if (isUnlocked) {
                                              onSelectCaseRecord(caseItem);
                                            } else {
                                              onOpenUnlockModal(caseItem);
                                            }
                                          }}
                                          className="text-[10px] font-mono px-2 py-1 rounded bg-slate-950/80 text-slate-400 hover:text-slate-200 border border-slate-800/80 transition-colors"
                                        >
                                          +{caseItem.evidenceFiles.length - 3} more
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                )}

                                <div className="flex items-center space-x-2 mb-4">
                                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border
                                    ${caseItem.priority === 'Critical' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                      caseItem.priority === 'High' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                      'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}
                                  >
                                    {caseItem.priority}
                                  </span>

                                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border
                                    ${(caseItem.confidenceScore || 42) < 50 ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}
                                  >
                                    Score: {caseItem.confidenceScore || 42}%
                                  </span>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                                {isUnlocked ? (
                                  <>
                                    <button
                                      onClick={() => onSelectCaseRecord(caseItem)}
                                      className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold py-2 px-3 rounded-lg transition-all flex items-center justify-center shadow"
                                    >
                                      <FolderOpen className="w-3.5 h-3.5 mr-1.5" />
                                      View Previous Record
                                    </button>
                                    <button
                                      onClick={() => onLockCase(caseItem.id)}
                                      className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
                                      title="Lock record"
                                    >
                                      <Lock className="w-4 h-4" />
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    onClick={() => onOpenUnlockModal(caseItem)}
                                    className="w-full bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 text-xs font-bold py-2.5 px-3 rounded-lg transition-all flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.1)] group"
                                  >
                                    <KeyRound className="w-3.5 h-3.5 mr-1.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
                                    Unlock with Password
                                  </button>
                                )}

                                {onDeleteCase && (
                                  <button
                                    onClick={() => onDeleteCase(folder.id, caseItem.id)}
                                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                    title="Delete case record"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Global Direct Evidence Media Viewer Modal */}
      {activeEvidenceModal.file && (
        <DirectEvidenceViewerModal
          file={activeEvidenceModal.file}
          caseItem={activeEvidenceModal.caseItem}
          allFiles={activeEvidenceModal.caseItem?.evidenceFiles || []}
          onClose={() => setActiveEvidenceModal({ file: null, caseItem: null })}
          onSelectFile={(nextFile) => handleOpenEvidence(nextFile, activeEvidenceModal.caseItem)}
        />
      )}
    </div>
  );
};

// =========================================================================
// Password Unlock Modal (Requires Password to Decrypt Case Records)
// =========================================================================
export const UnlockCaseModal = ({
  caseItem,
  onClose,
  onUnlock
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [error, setError] = useState('');

  if (!caseItem) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const correctPassword = (caseItem.password || 'veridex2026').trim();
    if (password.trim() === correctPassword) {
      setError('');
      onUnlock(caseItem);
    } else {
      setError('Access Denied: Incorrect case security password. Verification failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-[0_0_50px_rgba(6,182,212,0.25)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex items-center space-x-3 mb-5">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-wide">Enter Case Password</h3>
            <p className="text-slate-400 text-xs">Evidence vault security verification</p>
          </div>
        </div>

        {/* Case Target Info */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 mb-5 text-xs font-mono">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span>Case ID:</span>
            <span className="text-cyan-400 font-bold">#{caseItem.id}</span>
          </div>
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span>Title:</span>
            <span className="text-slate-200 font-sans font-medium truncate max-w-[200px]">{caseItem.title}</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Saved At:</span>
            <span className="text-slate-300">{caseItem.savedDate} {caseItem.savedTime || ''}</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center text-xs text-red-400 animate-in shake">
            <AlertTriangle className="w-4 h-4 mr-2 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Security Passcode <span className="text-red-400">*</span></span>
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="text-[11px] text-cyan-400 hover:underline"
              >
                {showHint ? 'Hide Hint' : 'Show Hint'}
              </button>
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="Enter password to unlock record..."
                autoFocus
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {showHint && (
              <p className="text-[11px] text-amber-300/90 mt-1.5 bg-amber-500/10 p-2 rounded border border-amber-500/20">
                💡 Passcode hint: {caseItem.passwordHint || `Default password is: ${caseItem.password || 'veridex2026'}`}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 rounded-lg text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-2.5 rounded-lg text-xs shadow-lg shadow-cyan-950/50 transition-all flex items-center justify-center"
            >
              <Unlock className="w-3.5 h-3.5 mr-1.5" />
              Unlock Case Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// =========================================================================
// Save Case to Folder Modal (Archives Current Case with Timestamp & Password)
// =========================================================================
export const SaveCaseModal = ({
  folders = [],
  currentCaseDetails = {},
  onClose,
  onSaveCase
}) => {
  const now = new Date();
  const currentDate = now.toISOString().split('T')[0];
  const currentTime = now.toTimeString().split(' ')[0];

  const [folderMode, setFolderMode] = useState('new_date'); // 'new_date' or 'existing'
  const [selectedFolderId, setSelectedFolderId] = useState(folders[0]?.id || '');
  const [newFolderName, setNewFolderName] = useState(`Incident Archive - ${currentDate}`);
  const [caseTitle, setCaseTitle] = useState(currentCaseDetails.title || 'Downtown Traffic Incident');
  const [investigator, setInvestigator] = useState(currentCaseDetails.investigator || 'Investigator Doe');
  const [password, setPassword] = useState('veridex2026');
  const [confirmPassword, setConfirmPassword] = useState('veridex2026');
  const [passwordHint, setPasswordHint] = useState('Default system passcode: veridex2026');
  const [notes, setNotes] = useState(currentCaseDetails.description || 'Verified evidence package saved to archival vault.');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!caseTitle.trim()) {
      setError('Please provide a Case Title.');
      return;
    }
    if (!password.trim()) {
      setError('Password is required to lock this case record.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    onSaveCase({
      folderMode,
      selectedFolderId,
      newFolderName: newFolderName.trim() || `Case Archive - ${currentDate}`,
      caseTitle: caseTitle.trim(),
      investigator: investigator.trim() || 'Investigator Doe',
      password: password.trim(),
      passwordHint: passwordHint.trim() || `Passcode: ${password.trim()}`,
      notes: notes.trim(),
      savedDate: currentDate,
      savedTime: currentTime
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-[0_0_50px_rgba(6,182,212,0.25)] relative max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex items-center space-x-3 mb-5">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Archive className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-wide">Save Case to Folder</h3>
            <p className="text-slate-400 text-xs">Encrypt and archive current case analysis with date & time stamp</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center text-xs text-red-400">
            <AlertTriangle className="w-4 h-4 mr-2 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Folder Option */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">Target Case Folder</label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                type="button"
                onClick={() => setFolderMode('new_date')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all text-left flex items-center justify-between ${
                  folderMode === 'new_date'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>New Date Folder</span>
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              </button>

              <button
                type="button"
                onClick={() => setFolderMode('existing')}
                disabled={folders.length === 0}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all text-left flex items-center justify-between ${
                  folderMode === 'existing'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>Existing Folder</span>
                <Folder className="w-3.5 h-3.5 text-cyan-400" />
              </button>
            </div>

            {folderMode === 'new_date' ? (
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">New Folder Name</label>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="e.g. Traffic Incident Archive - 2026-10-09"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
                <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                  Timestamp: {currentDate} at {currentTime}
                </span>
              </div>
            ) : (
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Select Existing Folder</label>
                <select
                  value={selectedFolderId}
                  onChange={(e) => setSelectedFolderId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                >
                  {folders.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.date}) - {f.cases?.length || 0} cases
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Case Metadata */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Case Title <span className="text-red-400">*</span></label>
              <input
                type="text"
                value={caseTitle}
                onChange={(e) => setCaseTitle(e.target.value)}
                placeholder="Case Title"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Investigator</label>
              <input
                type="text"
                value={investigator}
                onChange={(e) => setInvestigator(e.target.value)}
                placeholder="Investigator Name"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Password Protection */}
          <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-3">
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold">
              <Lock className="w-4 h-4" />
              <span>Password Protection (Required to Unlock)</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Unlock Passcode <span className="text-red-400">*</span></label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Confirm Passcode <span className="text-red-400">*</span></label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Passcode Hint (Optional)</label>
              <input
                type="text"
                value={passwordHint}
                onChange={(e) => setPasswordHint(e.target.value)}
                placeholder="e.g. Default system passcode: veridex2026"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Forensic Context Notes</label>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add investigator observations or forensic chain notes..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 rounded-lg text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-2.5 rounded-lg text-xs shadow-lg shadow-cyan-950/50 transition-all flex items-center justify-center"
            >
              <Lock className="w-3.5 h-3.5 mr-1.5" />
              Encrypt & Save to Folder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// =========================================================================
// Create Folder Modal
// =========================================================================
export const CreateFolderModal = ({
  onClose,
  onCreateFolder
}) => {
  const now = new Date();
  const currentDate = now.toISOString().split('T')[0];
  const currentTime = now.toTimeString().split(' ')[0];

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(currentDate);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onCreateFolder({
      id: `folder-${Date.now()}`,
      name: name.trim(),
      date,
      time: currentTime,
      createdAt: now.toISOString(),
      description: description.trim() || 'Forensic case archive folder',
      cases: []
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
        <div className="flex items-center space-x-3 mb-5">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
            <FolderPlus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-wide">Create Case Folder</h3>
            <p className="text-slate-400 text-xs">Organize cases by date and operational tag</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Folder Name <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. CCTV Surveillance - Incident #904"
              autoFocus
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Folder Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Creation Time</label>
              <input
                type="text"
                value={currentTime}
                disabled
                className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Description (Optional)</label>
            <textarea
              rows="2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of cases to be archived in this folder..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 rounded-lg text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2.5 rounded-lg text-xs shadow-lg transition-all"
            >
              Create Folder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
