import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  Radio, MapPin, ThumbsUp, Plus, Search, LogOut, User, Building2,
  GraduationCap, Briefcase, ShieldCheck, Clock, CheckCircle2, Lock,
  AlertTriangle, Coins, FileText, Award, Eye, BarChart2, Bell,
  Activity, Check, X, PlusCircle, Send, Layers, Target,
  ChevronDown, Mic, MicOff, Image, Volume2, Globe, Camera,
  Headphones, Play, TrendingUp, Users, CheckSquare, XCircle,
  ThumbsDown, ArrowRight, Sparkles, Info, MoreHorizontal,
} from 'lucide-react';

import {
  SEED_PROBLEMS, STUDENT_ROSTER, DEMO_PERSONAS,
  STATUS_CONFIG, CATEGORIES, UNIVERSITIES, DISTRICTS, SEED_ACTIVITY_LOG,
} from './mockData';

// ─── Format helpers ───────────────────────────────────────────────────────────
const fmt = (n) => !n ? '₹0' : n >= 100000 ? `₹${(n/100000).toFixed(1)}L` : `₹${(n/1000).toFixed(0)}K`;
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

// ─── Toast ────────────────────────────────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState([]);
  const toast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200);
  }, []);
  return { toasts, toast };
}

function ToastContainer({ toasts }) {
  const colors = { success: 'bg-emerald-600', error: 'bg-rose-600', info: 'bg-blue-600', warning: 'bg-amber-500' };
  const icons  = { success: <Check className="w-4 h-4"/>, error: <X className="w-4 h-4"/>, info: <Info className="w-4 h-4"/>, warning: <AlertTriangle className="w-4 h-4"/> };
  if (!toasts.length) return null;
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className={`toast-in flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-white text-sm font-semibold ${colors[t.type]||colors.info} max-w-xs`}>
          {icons[t.type]||icons.info}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Atoms ────────────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.OPEN;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`}/>
      {cfg.label}
    </span>
  );
};

const Ava = ({ src, name, size=8 }) => (
  <img src={src} alt={name} onError={e=>{e.target.src=`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`;}}
    className={`w-${size} h-${size} rounded-full object-cover ring-2 ring-white shadow-sm flex-shrink-0`}/>
);

const Card = ({ children, className='' }) => (
  <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm ${className}`}>{children}</div>
);

const Badge = ({ children, color='slate' }) => {
  const c = {slate:'bg-slate-100 text-slate-600',blue:'bg-blue-50 text-blue-700',emerald:'bg-emerald-50 text-emerald-700',amber:'bg-amber-50 text-amber-700',violet:'bg-violet-50 text-violet-700',rose:'bg-rose-50 text-rose-700',green:'bg-green-50 text-green-700',orange:'bg-orange-50 text-orange-700',cyan:'bg-cyan-50 text-cyan-700',red:'bg-red-50 text-red-700'};
  return <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${c[color]||c.slate}`}>{children}</span>;
};

const MeterBar = ({ value, max, color='bg-emerald-500', height='h-1.5' }) => (
  <div className={`w-full bg-slate-100 rounded-full ${height} overflow-hidden`}>
    <div className={`${color} h-full rounded-full transition-all duration-700`}
      style={{width:`${clamp(max>0?(value/max)*100:0,0,100)}%`}}/>
  </div>
);

const FormField = ({ label, children, hint, error }) => (
  <div>
    <label className="block text-xs font-bold text-slate-600 mb-1.5">{label}</label>
    {children}
    {error && <p className="text-[11px] text-rose-500 mt-1 font-medium">{error}</p>}
    {hint && !error && <p className="text-[11px] text-slate-400 mt-1">{hint}</p>}
  </div>
);

const inputCls = "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-slate-400 transition-all";
const inputErrCls = "w-full border border-rose-300 rounded-xl px-4 py-2.5 text-sm text-slate-800 bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent placeholder-rose-300 transition-all";

// ─── Audio note card ──────────────────────────────────────────────────────────
const AudioNoteCard = ({ note }) => {
  const [playing, setPlaying] = useState(false);
  const handlePlay = () => { setPlaying(true); setTimeout(() => setPlaying(false), 2000); };
  return (
    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
      <div className="w-9 h-9 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center flex-shrink-0">
        <Headphones className="w-4 h-4 text-blue-600"/>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-800 truncate">{note.label}</p>
        <p className="text-[10px] text-slate-400 mt-0.5">{note.recordedAt} · {note.duration}</p>
      </div>
      {playing ? (
        <div className="flex items-end gap-[3px] h-6 flex-shrink-0">
          {[1,2,3,4,5].map(i=><div key={i} className="w-1 bg-blue-500 rounded-full wave-bar"/>)}
        </div>
      ) : (
        <button onClick={handlePlay}
          className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center hover:bg-blue-700 transition-colors flex-shrink-0">
          <Play className="w-3 h-3 text-white ml-0.5"/>
        </button>
      )}
    </div>
  );
};

// ─── Photo grid ───────────────────────────────────────────────────────────────
const PhotoGrid = ({ photos, onLightbox }) => {
  if (!photos?.length) return null;
  return (
    <div className={`grid gap-2 ${photos.length===1?'grid-cols-1':photos.length===2?'grid-cols-2':'grid-cols-3'}`}>
      {photos.map((url,i) => (
        <button key={i} onClick={()=>onLightbox&&onLightbox(url)}
          className="relative aspect-video rounded-xl overflow-hidden group">
          <img src={url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
            <Eye className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity"/>
          </div>
        </button>
      ))}
    </div>
  );
};

// ─── Modal ────────────────────────────────────────────────────────────────────
const Modal = ({ title, onClose, children, wide=false }) => {
  useEffect(()=>{
    document.body.style.overflow='hidden';
    return ()=>{document.body.style.overflow='';};
  },[]);
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${wide?'max-w-2xl':'max-w-lg'} my-auto`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-extrabold text-slate-900 text-base">{title}</h3>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
            <X className="w-4 h-4"/>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// ─── Lightbox ────────────────────────────────────────────────────────────────
const Lightbox = ({ url, onClose }) => (
  <div className="fixed inset-0 z-[60] bg-black/92 flex items-center justify-center p-4" onClick={onClose}>
    <img src={url} alt="" className="max-w-full max-h-[90vh] rounded-xl object-contain" onClick={e=>e.stopPropagation()}/>
    <button className="absolute top-4 right-4 w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors" onClick={onClose}>
      <X className="w-5 h-5"/>
    </button>
  </div>
);

// ─── AppShell ────────────────────────────────────────────────────────────────
function AppShell({ persona, handleLogout, handleSwitchPersona, accentBg, children }) {
  const [showMenu, setShowMenu] = useState(false);
  const ref = useRef(null);
  useEffect(()=>{
    const h = e=>{if(ref.current&&!ref.current.contains(e.target))setShowMenu(false);};
    document.addEventListener('mousedown',h);
    return ()=>document.removeEventListener('mousedown',h);
  },[]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-2.5">
            <div className={`w-7 h-7 rounded-lg ${accentBg} flex items-center justify-center shadow-sm`}>
              <Radio className="w-4 h-4 text-white"/>
            </div>
            <span className="text-base font-extrabold text-slate-900 tracking-tight">BEACON</span>
            <span className="hidden sm:inline text-slate-300">·</span>
            <span className="hidden sm:inline text-xs text-slate-400 font-medium">{persona.roleName}</span>
          </div>

          <div className="relative" ref={ref}>
            <button onClick={()=>setShowMenu(v=>!v)}
              className="flex items-center gap-2 hover:bg-slate-100 pl-1 pr-3 py-1 rounded-xl transition-colors">
              <Ava src={persona.user.avatar} name={persona.user.name} size={8}/>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-800 leading-tight">{persona.user.name}</div>
                <div className="text-[10px] text-slate-400">{persona.roleName}</div>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 ml-1 transition-transform ${showMenu?'rotate-180':''}`}/>
            </button>

            {showMenu && (
              <div className="absolute right-0 top-12 w-72 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Switch Role</p>
                </div>
                <div className="py-1">
                  {DEMO_PERSONAS.map(p=>{
                    const I={citizen:User,university:Building2,student:GraduationCap,industry:Briefcase,government:ShieldCheck}[p.id]||User;
                    return (
                      <button key={p.id} onClick={()=>{handleSwitchPersona(p.id);setShowMenu(false);}}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-50 transition-colors ${persona.id===p.id?'bg-blue-50':''}`}>
                        <div className={`w-7 h-7 rounded-lg ${p.iconColor} flex items-center justify-center flex-shrink-0 shadow-sm`}><I className="w-3.5 h-3.5 text-white"/></div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-slate-800 truncate">{p.roleName}</div>
                          <div className="text-xs text-slate-400 truncate">{p.user.name}</div>
                        </div>
                        {persona.id===p.id && <Check className="w-3.5 h-3.5 text-blue-500 flex-shrink-0"/>}
                      </button>
                    );
                  })}
                </div>
                <div className="border-t border-slate-100 p-2">
                  <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-xl transition-colors font-semibold">
                    <LogOut className="w-4 h-4"/> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}

// ─── Sidebar nav ─────────────────────────────────────────────────────────────
const SideNav = ({ tabs, active, onSelect, activeColor='bg-blue-600' }) => (
  <nav className="space-y-0.5">
    {tabs.map(t=>(
      <button key={t.id} onClick={()=>onSelect(t.id)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-semibold transition-all ${active===t.id?`${activeColor} text-white shadow-sm`:'text-slate-600 hover:bg-slate-100'}`}>
        <t.icon className="w-4 h-4 flex-shrink-0"/>
        <span className="flex-1 truncate">{t.label}</span>
        {t.count!==undefined && t.count>0 && (
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold min-w-[18px] text-center ${active===t.id?'bg-white/25 text-white':'bg-slate-200 text-slate-600'}`}>{t.count}</span>
        )}
      </button>
    ))}
  </nav>
);

// ─── Empty state ──────────────────────────────────────────────────────────────
const Empty = ({ icon: Icon, title, subtitle, action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
      <Icon className="w-8 h-8 text-slate-300"/>
    </div>
    <p className="font-bold text-slate-600">{title}</p>
    {subtitle && <p className="text-sm text-slate-400 mt-1 max-w-xs">{subtitle}</p>}
    {action && <button onClick={action.fn} className="mt-4 text-sm text-blue-600 font-semibold hover:underline">{action.label}</button>}
  </div>
);

// ══════════════════════════════════════════════════════════════════════════════
// ROOT APP
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [personaId, setPersonaId] = useState('citizen');
  const [email, setEmail] = useState(DEMO_PERSONAS[0].email);
  const [password, setPassword] = useState('');
  const [problems, setProblems] = useState(SEED_PROBLEMS);
  const [students, setStudents] = useState(STUDENT_ROSTER);
  const [activityLog, setActivityLog] = useState(SEED_ACTIVITY_LOG);
  const { toasts, toast } = useToast();

  const persona = DEMO_PERSONAS.find(p=>p.id===personaId)||DEMO_PERSONAS[0];

  const handleLogin = e => { e?.preventDefault(); setIsLoggedIn(true); };
  const handleLogout = () => setIsLoggedIn(false);
  const handleSwitchPersona = id => {
    setPersonaId(id);
    setEmail(DEMO_PERSONAS.find(p=>p.id===id)?.email||'');
    setIsLoggedIn(true);
  };

  const addLog = useCallback((actor,action,problemId,type) =>
    setActivityLog(prev=>[{id:`A${Date.now()}`,time:'Just now',actor,action,problemId,type},...prev]),[]);

  const updateProblem = useCallback((id,patch) =>
    setProblems(prev=>prev.map(p=>p.id===id?{...p,...patch}:p)),[]);

  const addProblem = useCallback(newP =>
    setProblems(prev=>[newP,...prev]),[]);

  const deleteProblem = useCallback(id =>
    setProblems(prev=>prev.filter(p=>p.id!==id)),[]);

  const updateStudent = useCallback((id,patch) =>
    setStudents(prev=>prev.map(s=>s.id===id?{...s,...patch}:s)),[]);

  // ── Login ─────────────────────────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-sans flex flex-col">
        <header className="bg-white border-b border-slate-200 px-6 py-3.5">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-md">
                <Radio className="w-4 h-4 text-white"/>
              </div>
              <span className="text-lg font-extrabold text-slate-900 tracking-tight">BEACON</span>
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">Civic Innovation Network</span>
            </div>
            <span className="text-xs text-slate-400">Jharkhand</span>
          </div>
        </header>

        <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-10 space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-2">
              <Sparkles className="w-3.5 h-3.5"/> Citizens · Universities · Industry · Government
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">One platform. Real civic impact.</h1>
            <p className="text-slate-500 text-sm max-w-md mx-auto">Select your role and sign in to access your personalised dashboard.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {DEMO_PERSONAS.map(p=>{
              const selected=personaId===p.id;
              const I={citizen:User,university:Building2,student:GraduationCap,industry:Briefcase,government:ShieldCheck}[p.id]||User;
              return (
                <button key={p.id} onClick={()=>handleSwitchPersona(p.id)}
                  className={`text-left p-4 rounded-2xl border-2 transition-all card-hover ${selected?'border-blue-500 bg-blue-50 shadow-md':'border-slate-200 bg-white hover:border-slate-300'}`}>
                  <div className={`w-9 h-9 rounded-xl ${p.iconColor} flex items-center justify-center mb-3 shadow-sm`}><I className="w-4 h-4 text-white"/></div>
                  <div className="font-bold text-sm text-slate-800">{p.roleName}</div>
                  <div className="text-xs text-slate-500 mt-1 leading-snug">{p.subtitle}</div>
                  {selected && <div className="mt-2 flex items-center gap-1 text-blue-600 text-xs font-bold"><Check className="w-3 h-3"/> Selected</div>}
                </button>
              );
            })}
          </div>

          <div className="max-w-sm mx-auto">
            <Card className="p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
                <Ava src={persona.user.avatar} name={persona.user.name} size={11}/>
                <div>
                  <div className="font-bold text-slate-900 text-sm">{persona.user.name}</div>
                  <div className="text-xs text-slate-500 leading-snug">{persona.user.title}</div>
                </div>
              </div>
              <form onSubmit={handleLogin} className="space-y-3">
                <FormField label="Email">
                  <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className={inputCls} required/>
                </FormField>
                <FormField label="Password" hint="Any password works in demo mode">
                  <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" className={inputCls}/>
                </FormField>
                <button type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold py-3 rounded-xl text-sm transition-all shadow-sm mt-1">
                  Sign In as {persona.roleName} →
                </button>
              </form>
            </Card>
          </div>
        </main>

        <footer className="bg-white border-t border-slate-200 py-3 text-center text-xs text-slate-400">
          BEACON Civic Innovation Platform · Jharkhand
        </footer>
      </div>
    );
  }

  const shared = { persona, problems, setProblems, students, setStudents, activityLog, addLog, updateProblem, addProblem, deleteProblem, updateStudent, handleLogout, handleSwitchPersona, toast };
  return (
    <>
      {personaId==='citizen'    && <CitizenDashboard    {...shared}/>}
      {personaId==='university' && <UniversityDashboard {...shared}/>}
      {personaId==='student'    && <StudentDashboard    {...shared}/>}
      {personaId==='industry'   && <IndustryDashboard   {...shared}/>}
      {personaId==='government' && <GovernmentDashboard {...shared}/>}
      <ToastContainer toasts={toasts}/>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// CITIZEN DASHBOARD
// ══════════════════════════════════════════════════════════════════════════════
function CitizenDashboard({ persona, problems, updateProblem, addProblem, deleteProblem, addLog, handleLogout, handleSwitchPersona, toast }) {
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [filterDist, setFilterDist] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showPost, setShowPost] = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState(null);
  const [votedIds, setVotedIds] = useState([]);
  const [detailProb, setDetailProb] = useState(null);

  const filtered = useMemo(()=>problems.filter(p=>{
    if(search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.description.toLowerCase().includes(search.toLowerCase())) return false;
    if(filterCat!=='All' && p.category!==filterCat) return false;
    if(filterDist!=='All' && p.district!==filterDist) return false;
    if(filterStatus!=='All' && p.status!==filterStatus) return false;
    return true;
  }),[problems,search,filterCat,filterDist,filterStatus]);

  const handleVote = id=>{
    if(votedIds.includes(id)){toast('You already voted for this problem','info');return;}
    setVotedIds(prev=>[...prev,id]);
    updateProblem(id,{votes:(problems.find(p=>p.id===id)?.votes||0)+1});
    toast('Vote recorded!');
  };

  const handleAssign=(id,univId)=>{
    updateProblem(id,{assignedUniversity:univId});
    addLog(persona.user.name,`Problem assigned to ${UNIVERSITIES.find(u=>u.id===univId)?.name}`,id,'assignment');
    toast(`Assigned to ${UNIVERSITIES.find(u=>u.id===univId)?.name}`);
  };

  const handleDelete=id=>{
    deleteProblem(id);
    addLog(persona.user.name,`Problem report deleted`,id,'submit');
    toast('Problem report deleted','info');
  };

  return (
    <AppShell persona={persona} handleLogout={handleLogout} handleSwitchPersona={handleSwitchPersona} accentBg="bg-rose-500">
      {/* Hero bar */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4">
        <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-extrabold text-slate-900">Community Problem Feed</h1>
            <p className="text-xs text-slate-500 mt-0.5">Browse & vote on civic challenges · report new problems · assign to universities</p>
          </div>
          <button onClick={()=>setShowPost(true)}
            className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 active:scale-[0.98] text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm whitespace-nowrap">
            <Plus className="w-4 h-4"/> Report a Problem
          </button>
        </div>

        {/* Stats strip */}
        <div className="max-w-screen-xl mx-auto mt-3 flex items-center gap-5 overflow-x-auto pb-px">
          {[
            {l:'Total Problems',v:problems.length,c:'text-slate-700'},
            {l:'Open',v:problems.filter(p=>p.status==='OPEN').length,c:'text-blue-600'},
            {l:'Being Solved',v:problems.filter(p=>['ENGAGED','SOLUTION_PROPOSED','FUNDED','IN_PROGRESS','PROTOTYPE'].includes(p.status)).length,c:'text-violet-600'},
            {l:'Completed',v:problems.filter(p=>p.status==='COMPLETED').length,c:'text-emerald-600'},
          ].map(s=>(
            <div key={s.l} className="flex items-center gap-1.5 flex-shrink-0">
              <span className={`text-base font-extrabold ${s.c}`}>{s.v}</span>
              <span className="text-xs text-slate-400">{s.l}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-5 flex gap-5 w-full">
        {/* Sidebar */}
        <aside className="hidden lg:block w-52 flex-shrink-0 space-y-4">
          <Card className="p-4 space-y-3">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Filters</h3>
            {[
              {label:'Category',value:filterCat,onChange:setFilterCat,options:['All',...CATEGORIES]},
              {label:'District',value:filterDist,onChange:setFilterDist,options:['All',...DISTRICTS]},
              {label:'Status',value:filterStatus,onChange:setFilterStatus,options:['All',...Object.keys(STATUS_CONFIG)]},
            ].map(f=>(
              <div key={f.label}>
                <label className="text-xs font-semibold text-slate-600 block mb-1">{f.label}</label>
                <select value={f.value} onChange={e=>f.onChange(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-400">
                  {f.options.map(o=><option key={o} value={o}>{o==='All'?`All ${f.label}s`:STATUS_CONFIG[o]?.label||o}</option>)}
                </select>
              </div>
            ))}
            {(filterCat!=='All'||filterDist!=='All'||filterStatus!=='All'||search) && (
              <button onClick={()=>{setFilterCat('All');setFilterDist('All');setFilterStatus('All');setSearch('');}}
                className="text-xs text-rose-500 hover:text-rose-700 font-semibold transition-colors">
                × Clear all filters
              </button>
            )}
          </Card>
        </aside>

        {/* Feed */}
        <main className="flex-1 min-w-0 space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search problems…"
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-400"/>
          </div>

          <p className="text-xs text-slate-400 font-medium">{filtered.length} problem{filtered.length!==1?'s':''} found</p>

          {filtered.map(prob=>(
            <CitizenProblemCard key={prob.id} prob={prob}
              voted={votedIds.includes(prob.id)}
              onVote={()=>handleVote(prob.id)}
              onView={()=>setDetailProb(prob.id)}
              onLightbox={setLightboxUrl}
              onAssign={(univId)=>handleAssign(prob.id,univId)}
              onDelete={prob.submittedBy.id===persona.user.id?()=>handleDelete(prob.id):null}
            />
          ))}

          {filtered.length===0 && (
            <Card className="py-4">
              <Empty icon={Search} title="No problems match your filters" subtitle="Try adjusting or clearing your filters"/>
            </Card>
          )}
        </main>
      </div>

      {showPost && (
        <PostProblemModal persona={persona} onClose={()=>setShowPost(false)} problemsCount={problems.length}
          onSubmit={newP=>{addProblem(newP);addLog(persona.user.name,`New problem submitted: "${newP.title}"`,newP.id,'submit');setShowPost(false);toast('Problem reported successfully!');}}
        />
      )}
      {detailProb && (
        <ProblemDetailModal prob={problems.find(p=>p.id===detailProb)} onClose={()=>setDetailProb(null)} onLightbox={setLightboxUrl}/>
      )}
      {lightboxUrl && <Lightbox url={lightboxUrl} onClose={()=>setLightboxUrl(null)}/>}
    </AppShell>
  );
}

// ─── Citizen Problem Card ─────────────────────────────────────────────────────
function CitizenProblemCard({ prob, voted, onVote, onView, onLightbox, onAssign, onDelete }) {
  const [showAssign, setShowAssign] = useState(false);
  const [selUniv, setSelUniv] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm card-hover overflow-hidden">
      {prob.mediaFiles?.photos?.[0] && (
        <div className="relative h-36 overflow-hidden cursor-pointer" onClick={()=>onLightbox(prob.mediaFiles.photos[0])}>
          <img src={prob.mediaFiles.photos[0]} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"/>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"/>
          {prob.mediaFiles.photos.length>1 && (
            <span className="absolute bottom-2 right-3 bg-black/50 text-white text-[11px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
              <Image className="w-3 h-3"/> +{prob.mediaFiles.photos.length-1}
            </span>
          )}
          {prob.mediaFiles?.audioNotes?.length>0 && (
            <span className="absolute bottom-2 left-3 bg-black/50 text-white text-[11px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
              <Volume2 className="w-3 h-3"/> {prob.mediaFiles.audioNotes.length} audio
            </span>
          )}
        </div>
      )}

      <div className="p-4 flex gap-3">
        {/* Vote column */}
        <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
          <button onClick={onVote} disabled={voted}
            className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${voted?'bg-rose-500 border-rose-500 text-white shadow-sm':'border-slate-200 hover:border-rose-400 hover:bg-rose-50 text-slate-400'}`}>
            <ThumbsUp className="w-3.5 h-3.5"/>
          </button>
          <span className={`text-xs font-bold ${voted?'text-rose-500':'text-slate-500'}`}>{prob.votes}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
            <StatusBadge status={prob.status}/>
            <Badge color="slate">{prob.category.split('&')[0].trim()}</Badge>
            <Badge color="blue">{prob.district}</Badge>
            {prob.targetUniversity
              ? <Badge color="violet">{UNIVERSITIES.find(u=>u.id===prob.targetUniversity)?.name}</Badge>
              : <Badge color="slate">Public</Badge>}
          </div>

          <h3 className="font-bold text-slate-900 text-sm leading-snug mb-1">{prob.title}</h3>
          <p className="text-xs text-slate-500 line-clamp-2 mb-2">{prob.description}</p>

          {!prob.mediaFiles?.photos?.length && prob.mediaFiles?.audioNotes?.length>0 && (
            <div className="flex items-center gap-1 text-[11px] text-blue-600 font-semibold mb-2">
              <Volume2 className="w-3 h-3"/> {prob.mediaFiles.audioNotes.length} audio note{prob.mediaFiles.audioNotes.length>1?'s':''}
            </div>
          )}

          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1"><User className="w-3 h-3"/> {prob.submittedBy.name}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {prob.submittedAt}</span>
            {prob.assignedUniversity && (
              <span className="flex items-center gap-1 text-violet-500 font-semibold">
                <Building2 className="w-3 h-3"/> {UNIVERSITIES.find(u=>u.id===prob.assignedUniversity)?.name}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 mt-2.5 flex-wrap">
            <button onClick={onView} className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
              <Eye className="w-3 h-3"/> View Details
            </button>
            {prob.status==='OPEN' && !prob.assignedUniversity && (
              <button onClick={()=>setShowAssign(v=>!v)}
                className={`text-xs font-semibold flex items-center gap-1 transition-colors ${showAssign?'text-slate-400':'text-violet-600 hover:text-violet-700'}`}>
                <Building2 className="w-3 h-3"/> {showAssign?'Cancel':'Assign University'}
              </button>
            )}
            {onDelete && (
              !confirmDelete
                ? <button onClick={()=>setConfirmDelete(true)} className="text-xs font-semibold text-rose-400 hover:text-rose-600 flex items-center gap-1 transition-colors ml-auto">
                    <X className="w-3 h-3"/> Delete
                  </button>
                : <div className="ml-auto flex items-center gap-2">
                    <span className="text-xs text-slate-500">Sure?</span>
                    <button onClick={onDelete} className="text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors">Yes, delete</button>
                    <button onClick={()=>setConfirmDelete(false)} className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Cancel</button>
                  </div>
            )}
          </div>

          {showAssign && (
            <div className="mt-2.5 flex gap-2">
              <select value={selUniv} onChange={e=>setSelUniv(e.target.value)}
                className="flex-1 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-violet-400">
                <option value="">Select university…</option>
                {UNIVERSITIES.map(u=><option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
              <button onClick={()=>{if(selUniv){onAssign(selUniv);setShowAssign(false);}}}
                disabled={!selUniv}
                className="bg-violet-600 disabled:bg-slate-200 disabled:text-slate-400 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-violet-700 transition-colors">
                Assign
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Post Problem Modal (2-step) ──────────────────────────────────────────────
function PostProblemModal({ persona, onClose, onSubmit, problemsCount }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ title:'', desc:'', category:'', district:'Ranchi' });
  const [errors, setErrors] = useState({});
  const [photos, setPhotos] = useState([]);
  const [audioNotes, setAudioNotes] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recTime, setRecTime] = useState(0);
  const timerRef = useRef(null);
  const fileRef = useRef(null);

  const validate1 = () => {
    const e = {};
    if(!form.title.trim()) e.title='Title is required';
    else if(form.title.trim().length<10) e.title='Title too short — be more specific';
    if(!form.desc.trim()) e.desc='Description is required';
    else if(form.desc.trim().length<20) e.desc='Please provide more detail';
    if(!form.category) e.category='Please select a category';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handlePhotoUpload = e=>{
    Array.from(e.target.files).forEach(file=>{
      const reader=new FileReader();
      reader.onload=ev=>setPhotos(prev=>[...prev,ev.target.result]);
      reader.readAsDataURL(file);
    });
  };

  const startRecording = ()=>{ setIsRecording(true); setRecTime(0); timerRef.current=setInterval(()=>setRecTime(t=>t+1),1000); };
  const stopRecording = ()=>{
    clearInterval(timerRef.current); setIsRecording(false);
    const dur=`${Math.floor(recTime/60)}:${String(recTime%60).padStart(2,'0')}`;
    setAudioNotes(prev=>[...prev,{id:`AUD-${Date.now()}`,label:`Voice Note — ${persona.user.name}`,duration:dur,recordedAt:new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}]);
  };
  useEffect(()=>()=>clearInterval(timerRef.current),[]);

  const handleSubmit = ()=>{
    const newP = {
      id:`PROB-${String(problemsCount+1).padStart(3,'0')}`,
      title:form.title.trim(), description:form.desc.trim(), category:form.category, district:form.district,
      submittedBy:{id:persona.user.id,name:persona.user.name,role:persona.user.title},
      submittedAt:new Date().toISOString().split('T')[0],
      votes:0, status:'OPEN',
      targetUniversity:null,
      mediaFiles:{photos,audioNotes},
      assignedUniversity:null, engagedTeam:null, proposedSolution:null, funding:null,
      milestones:[], pendingMilestones:[], studentCredits:{}, studentHours:{}, prototypeImage:null,
    };
    onSubmit(newP);
  };

  const steps=['Problem Details','Photos & Audio'];

  return (
    <Modal title="Report a Civic Problem" onClose={onClose} wide>
      {/* Stepper */}
      <div className="flex items-center gap-1.5 mb-6">
        {steps.map((s,i)=>(
          <React.Fragment key={s}>
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step>i+1?'bg-emerald-500 text-white':step===i+1?'bg-blue-600 text-white':'bg-slate-100 text-slate-400'}`}>
                {step>i+1?<Check className="w-3.5 h-3.5"/>:i+1}
              </div>
              <span className={`text-xs font-semibold transition-colors ${step===i+1?'text-blue-700':step>i+1?'text-emerald-600':'text-slate-400'}`}>{s}</span>
            </div>
            {i<steps.length-1&&<div className={`flex-1 h-px transition-colors ${step>i+1?'bg-emerald-400':'bg-slate-200'}`}/>}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1 */}
      {step===1&&(
        <div className="space-y-4">
          <FormField label="Problem Title *" error={errors.title}>
            <input value={form.title} onChange={e=>{setForm(f=>({...f,title:e.target.value}));setErrors(x=>({...x,title:''}));}}
              placeholder="e.g. Cracked bridge pier on National Highway 33"
              className={errors.title?inputErrCls:inputCls}/>
            <p className="text-[10px] text-slate-400 mt-1">{form.title.length}/100 characters</p>
          </FormField>
          <FormField label="Detailed Description *" error={errors.desc}>
            <textarea rows={4} value={form.desc} onChange={e=>{setForm(f=>({...f,desc:e.target.value}));setErrors(x=>({...x,desc:''}));}}
              placeholder="Describe the problem, who is affected, how long it has existed, and any immediate risks…"
              className={`${errors.desc?inputErrCls:inputCls} resize-none`}/>
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Category *" error={errors.category}>
              <select value={form.category} onChange={e=>{setForm(f=>({...f,category:e.target.value}));setErrors(x=>({...x,category:''}));}}
                className={errors.category?inputErrCls:inputCls}>
                <option value="">Select…</option>
                {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </FormField>
            <FormField label="District *">
              <select value={form.district} onChange={e=>setForm(f=>({...f,district:e.target.value}))} className={inputCls}>
                {DISTRICTS.map(d=><option key={d} value={d}>{d}</option>)}
              </select>
            </FormField>
          </div>
          <button onClick={()=>{if(validate1())setStep(2);}}
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold py-3 rounded-xl text-sm transition-all shadow-sm">
            Next: Add Photos & Audio →
          </button>
        </div>
      )}

      {/* Step 2 */}
      {step===2&&(
        <div className="space-y-5">
          {/* Photos */}
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-2">Attach Photos <span className="font-normal text-slate-400">(optional)</span></label>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload}/>
            <button onClick={()=>fileRef.current.click()}
              className="w-full border-2 border-dashed border-slate-200 hover:border-blue-300 bg-slate-50 hover:bg-blue-50 rounded-xl py-6 flex flex-col items-center gap-2 text-slate-400 hover:text-blue-500 transition-all">
              <Camera className="w-7 h-7"/>
              <span className="text-sm font-semibold">Click to upload photos</span>
              <span className="text-xs">JPG, PNG, WEBP — multiple files supported</span>
            </button>
            {photos.length>0 && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {photos.map((url,i)=>(
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
                    <img src={url} alt="" className="w-full h-full object-cover"/>
                    <button onClick={()=>setPhotos(p=>p.filter((_,j)=>j!==i))}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-5 h-5 text-white"/>
                    </button>
                  </div>
                ))}
                <button onClick={()=>fileRef.current.click()}
                  className="aspect-square rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-300 flex items-center justify-center text-slate-300 hover:text-blue-400 transition-colors">
                  <Plus className="w-6 h-6"/>
                </button>
              </div>
            )}
          </div>

          {/* Audio */}
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-2">Record Audio Note <span className="font-normal text-slate-400">(optional)</span></label>
            <div className={`p-5 rounded-xl border-2 transition-all ${isRecording?'border-rose-300 bg-rose-50':'border-slate-200 bg-slate-50'}`}>
              <div className="flex flex-col items-center gap-3">
                {isRecording && (
                  <div className="flex items-end gap-[3px] h-8 mb-1">
                    {[1,2,3,4,5,6,7].map(i=><div key={i} className="w-1.5 bg-rose-400 rounded-full wave-bar"/>)}
                  </div>
                )}
                <button onClick={isRecording?stopRecording:startRecording}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-md ${isRecording?'bg-rose-500 hover:bg-rose-600':'bg-blue-600 hover:bg-blue-700'}`}>
                  {isRecording?<MicOff className="w-6 h-6 text-white"/>:<Mic className="w-6 h-6 text-white"/>}
                </button>
                {isRecording?(
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-rose-500 rounded-full pulse-dot"/>
                    <span className="text-sm font-bold text-rose-600">{Math.floor(recTime/60)}:{String(recTime%60).padStart(2,'0')}</span>
                    <span className="text-xs text-rose-400">Recording…</span>
                  </div>
                ):(
                  <p className="text-xs text-slate-500 text-center">Press to record a voice description of the problem</p>
                )}
              </div>
            </div>
            {audioNotes.length>0&&<div className="mt-2 space-y-2">{audioNotes.map(n=><AudioNoteCard key={n.id} note={n}/>)}</div>}
          </div>

          <div className="flex gap-3">
            <button onClick={()=>setStep(1)} className="flex-1 border border-slate-200 text-slate-600 font-bold py-2.5 rounded-xl text-sm hover:bg-slate-50 transition-colors">← Back</button>
            <button onClick={handleSubmit}
              className="flex-1 bg-rose-500 hover:bg-rose-600 active:scale-[0.98] text-white font-bold py-2.5 rounded-xl text-sm transition-all shadow-sm">
              Submit Problem ✓
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

// ─── Problem Detail Modal ─────────────────────────────────────────────────────
function ProblemDetailModal({ prob, onClose, onLightbox }) {
  if(!prob) return null;
  const univ=UNIVERSITIES.find(u=>u.id===prob.assignedUniversity);
  return (
    <Modal title="Problem Details" onClose={onClose} wide>
      <div className="max-h-[70vh] overflow-y-auto space-y-4 pr-1">
        <div className="flex flex-wrap gap-2">
          <StatusBadge status={prob.status}/>
          <Badge color="slate">{prob.category}</Badge>
          <Badge color="blue">{prob.district}</Badge>
          {prob.targetUniversity?<Badge color="violet">{UNIVERSITIES.find(u=>u.id===prob.targetUniversity)?.name}</Badge>:<Badge color="slate">Public</Badge>}
        </div>
        <h2 className="text-lg font-extrabold text-slate-900">{prob.title}</h2>
        <p className="text-sm text-slate-600 leading-relaxed">{prob.description}</p>

        {prob.mediaFiles?.photos?.length>0&&(
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Attached Photos</p>
            <PhotoGrid photos={prob.mediaFiles.photos} onLightbox={onLightbox}/>
          </div>
        )}
        {prob.mediaFiles?.audioNotes?.length>0&&(
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Audio Notes</p>
            <div className="space-y-2">{prob.mediaFiles.audioNotes.map(n=><AudioNoteCard key={n.id} note={n}/>)}</div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3">
          {[{l:'Votes',v:prob.votes},{l:'Submitted',v:prob.submittedAt},{l:'University',v:univ?.name||'Unassigned'}].map(m=>(
            <div key={m.l} className="p-3 bg-slate-50 rounded-xl text-center border border-slate-100">
              <div className="font-extrabold text-slate-800 text-sm">{m.v}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{m.l}</div>
            </div>
          ))}
        </div>

        {prob.proposedSolution&&(
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
            <p className="text-[10px] font-bold text-amber-600 uppercase mb-1">Proposed Solution</p>
            <p className="font-bold text-slate-800 text-sm">{prob.proposedSolution.title}</p>
            <p className="text-xs text-slate-600 mt-1">{prob.proposedSolution.summary}</p>
            <p className="text-xs font-bold text-amber-700 mt-2">Funding Ask: {fmt(prob.proposedSolution.fundingAsk)}</p>
          </div>
        )}
        {prob.funding&&(
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
            <p className="text-[10px] font-bold text-emerald-600 uppercase mb-1">Funding Status</p>
            <p className="font-semibold text-slate-800 text-sm">{prob.funding.partner}</p>
            <p className="text-xs text-slate-500 mt-0.5">Grant: {fmt(prob.funding.totalGranted)} · Tranche {prob.funding.trancheReleased}/4 released</p>
          </div>
        )}
      </div>
    </Modal>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// UNIVERSITY DASHBOARD
// ══════════════════════════════════════════════════════════════════════════════
function UniversityDashboard({ persona, problems, students, setStudents, updateProblem, addLog, handleLogout, handleSwitchPersona, toast }) {
  const [tab, setTab] = useState('inbox');
  const univId = persona.user.universityId;
  const univ = UNIVERSITIES.find(u=>u.id===univId);

  const myProblems = problems.filter(p=>p.assignedUniversity===univId||p.targetUniversity===univId);
  const publicOpen = problems.filter(p=>p.status==='OPEN'&&!p.assignedUniversity&&!p.targetUniversity);
  const myStudents = students.filter(s=>s.university===univId);
  const engaged = myProblems.filter(p=>!['OPEN','COMPLETED'].includes(p.status));
  const completed = myProblems.filter(p=>p.status==='COMPLETED');
  const pendingApprovals = problems.filter(p=>
    p.assignedUniversity===univId && p.pendingMilestones?.filter(m=>m.status==='PENDING').length>0
  );
  const pendingCount = pendingApprovals.reduce((a,p)=>a+p.pendingMilestones.filter(m=>m.status==='PENDING').length,0);

  const handleEngage = prob=>{
    updateProblem(prob.id,{status:'ENGAGED',assignedUniversity:univId});
    addLog(`${persona.user.name} (${univ?.name})`,`Problem accepted and marked as ENGAGED`,prob.id,'engage');
    toast(`Problem engaged — ${prob.title.substring(0,40)}…`);
  };

  const handleApproveMilestone = (prob,ms)=>{
    const updatedPending = prob.pendingMilestones.filter(m=>m.id!==ms.id);
    const creditsToAdd = parseFloat((ms.hours*0.12).toFixed(1));
    const newCredits = {...prob.studentCredits,[ms.studentId]:parseFloat(((prob.studentCredits?.[ms.studentId]||0)+creditsToAdd).toFixed(1))};
    const newHours = {...prob.studentHours,[ms.studentId]:(prob.studentHours?.[ms.studentId]||0)+ms.hours};
    updateProblem(prob.id,{pendingMilestones:updatedPending,studentCredits:newCredits,studentHours:newHours});
    addLog(`${persona.user.name}`,`Milestone approved: "${ms.title}". +${creditsToAdd} credits awarded.`,prob.id,'approval');
    toast(`Approved! +${creditsToAdd} credits awarded`);
  };

  const handleRejectMilestone = (prob,ms)=>{
    const updated=prob.pendingMilestones.map(m=>m.id===ms.id?{...m,status:'REJECTED'}:m);
    updateProblem(prob.id,{pendingMilestones:updated});
    addLog(`${persona.user.name}`,`Milestone rejected: "${ms.title}" — revision requested`,prob.id,'rejection');
    toast('Revision requested — student notified','warning');
  };

  const handleUpdateCredits = (probId,studentId,val)=>{
    const prob=problems.find(p=>p.id===probId);
    if(!prob) return;
    const v=parseFloat(val)||0;
    updateProblem(probId,{studentCredits:{...prob.studentCredits,[studentId]:v}});
    addLog(`${persona.user.name}`,`Credits manually set to ${v} for student ${studentId}`,probId,'credit');
    toast('Credits updated');
  };

  const handleUpdateHours = (probId,studentId,val)=>{
    const prob=problems.find(p=>p.id===probId);
    if(!prob) return;
    const v=clamp(parseInt(val)||0,0,999);
    updateProblem(probId,{studentHours:{...prob.studentHours,[studentId]:v}});
    addLog(`${persona.user.name}`,`Hours adjusted to ${v}h for student ${studentId}`,probId,'credit');
    toast('Hours updated');
  };

  const tabs=[
    {id:'inbox',label:'Problem Inbox',icon:Bell,count:myProblems.length+publicOpen.length},
    {id:'approvals',label:'Milestone Approvals',icon:CheckSquare,count:pendingCount},
    {id:'students',label:'Student Roster',icon:Users,count:myStudents.length},
    {id:'completed',label:'Completed',icon:CheckCircle2,count:completed.length},
  ];

  return (
    <AppShell persona={persona} handleLogout={handleLogout} handleSwitchPersona={handleSwitchPersona} accentBg="bg-violet-600">
      <div className="bg-violet-600 text-white px-4 sm:px-6 py-4">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="w-5 h-5 opacity-70"/>
            <div>
              <h1 className="text-lg font-extrabold">{univ?.name}</h1>
              <p className="text-violet-200 text-xs">{persona.user.name} · {persona.user.title}</p>
            </div>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-px">
            {[
              {l:'Assigned',v:myProblems.length},{l:'Active',v:engaged.length},
              {l:'Pending Approvals',v:pendingCount},{l:'Students',v:myStudents.length},{l:'Completed',v:completed.length},
            ].map(s=>(
              <div key={s.l} className="text-center flex-shrink-0">
                <div className="text-xl font-extrabold">{s.v}</div>
                <div className="text-violet-200 text-[11px]">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-5 flex gap-5 w-full">
        <aside className="w-52 flex-shrink-0">
          <SideNav tabs={tabs} active={tab} onSelect={setTab} activeColor="bg-violet-600"/>
        </aside>

        <main className="flex-1 min-w-0 space-y-4">
          {/* INBOX */}
          {tab==='inbox'&&(
            <div className="space-y-5">
              {myProblems.filter(p=>p.status==='OPEN').length>0&&(
                <section>
                  <h2 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-violet-500"/> Assigned / Targeted to You ({myProblems.filter(p=>p.status==='OPEN').length})
                  </h2>
                  <div className="space-y-3">
                    {myProblems.filter(p=>p.status==='OPEN').map(prob=>(
                      <UniInboxCard key={prob.id} prob={prob} onEngage={()=>handleEngage(prob)} cta="Engage Problem" primary/>
                    ))}
                  </div>
                </section>
              )}

              {publicOpen.length>0&&(
                <section>
                  <h2 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-400"/> Public Problems — Available to Claim ({publicOpen.length})
                  </h2>
                  <div className="space-y-3">
                    {publicOpen.slice(0,5).map(prob=>(
                      <UniInboxCard key={prob.id} prob={prob} onEngage={()=>handleEngage(prob)} cta="Claim & Engage"/>
                    ))}
                  </div>
                </section>
              )}

              {engaged.length>0&&(
                <section>
                  <h2 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-500"/> Active Projects ({engaged.length})
                  </h2>
                  <div className="space-y-3">
                    {engaged.map(prob=>{
                      const teamStus=(prob.engagedTeam?.students||[]).map(sid=>students.find(s=>s.id===sid)).filter(Boolean);
                      return (
                        <Card key={prob.id} className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap gap-1.5 mb-1.5"><StatusBadge status={prob.status}/><Badge color="slate">{prob.category}</Badge></div>
                              <h3 className="font-bold text-slate-900 text-sm">{prob.title}</h3>
                              {prob.engagedTeam?.faculty&&<p className="text-xs text-slate-500 mt-0.5">Mentor: {prob.engagedTeam.faculty.name}</p>}
                            </div>
                            {teamStus.length>0&&(
                              <div className="flex -space-x-2 flex-shrink-0">
                                {teamStus.slice(0,4).map(s=><Ava key={s.id} src={s.avatar} name={s.name} size={7}/>)}
                              </div>
                            )}
                          </div>
                          {prob.milestones?.length>0&&(
                            <div className="mt-3 pt-3 border-t border-slate-100">
                              <div className="flex justify-between text-[11px] text-slate-400 mb-1.5">
                                <span>Milestones</span>
                                <span>{prob.milestones.filter(m=>m.status==='DONE').length}/{prob.milestones.length} done</span>
                              </div>
                              <MeterBar value={prob.milestones.filter(m=>m.status==='DONE').length} max={prob.milestones.length} color="bg-violet-500"/>
                            </div>
                          )}
                        </Card>
                      );
                    })}
                  </div>
                </section>
              )}

              {myProblems.length===0&&publicOpen.length===0&&(
                <Card className="py-4"><Empty icon={Bell} title="Inbox is empty" subtitle="Problems assigned or targeted to your university will appear here"/></Card>
              )}
            </div>
          )}

          {/* MILESTONE APPROVALS */}
          {tab==='approvals'&&(
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-slate-700">Pending Student Milestone Submissions</h2>
              {pendingCount===0?(
                <Card className="py-4"><Empty icon={CheckCircle2} title="All caught up!" subtitle="No pending milestone approvals"/></Card>
              ):(
                pendingApprovals.map(prob=>
                  prob.pendingMilestones.filter(m=>m.status==='PENDING').map(ms=>{
                    const student=students.find(s=>s.id===ms.studentId);
                    return (
                      <Card key={ms.id} className="p-5">
                        <p className="text-[10px] font-bold text-violet-600 uppercase tracking-wider mb-2 truncate">{prob.title}</p>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-slate-900 text-sm">{ms.title}</h3>
                            {student&&(
                              <div className="flex items-center gap-2 mt-1.5">
                                <Ava src={student.avatar} name={student.name} size={6}/>
                                <div>
                                  <span className="text-xs font-semibold text-slate-700">{student.name}</span>
                                  <span className="text-[10px] text-slate-400 ml-1">· {student.dept}</span>
                                </div>
                              </div>
                            )}
                            <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
                              <span>{ms.hours}h worked</span>
                              <span>·</span>
                              <span>{ms.submittedAt}</span>
                              <span>·</span>
                              <span className="text-emerald-600 font-semibold">+{(ms.hours*0.12).toFixed(1)} credits on approval</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button onClick={()=>handleRejectMilestone(prob,ms)}
                              className="flex items-center gap-1 border border-rose-200 text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                              <X className="w-3.5 h-3.5"/> Reject
                            </button>
                            <button onClick={()=>handleApproveMilestone(prob,ms)}
                              className="flex items-center gap-1 bg-violet-600 hover:bg-violet-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm">
                              <Check className="w-3.5 h-3.5"/> Approve
                            </button>
                          </div>
                        </div>
                      </Card>
                    );
                  })
                )
              )}
            </div>
          )}

          {/* STUDENTS */}
          {tab==='students'&&(
            <div className="space-y-3">
              <div>
                <h2 className="text-sm font-bold text-slate-700">Student Roster — {univ?.name}</h2>
                <p className="text-xs text-slate-400 mt-0.5">Overview of all students working on problems assigned to {univ?.name}</p>
              </div>
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>{['Student','Dept / Sem','Active Problem','Hours Worked','Status'].map(h=>(
                        <th key={h} className="px-4 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}</tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {myStudents.map(s=>{
                        const activeProb=problems.find(p=>p.engagedTeam?.students?.includes(s.id)||p.id===s.activeProblem);
                        const hours=activeProb?.studentHours?.[s.id]||0;
                        return (
                          <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2.5">
                                <Ava src={s.avatar} name={s.name} size={8}/>
                                <div><div className="font-semibold text-slate-900 text-sm">{s.name}</div><div className="text-[10px] text-slate-400">{s.email}</div></div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-xs text-slate-600"><div>{s.dept}</div><div className="text-slate-400">{s.semester}</div></td>
                            <td className="px-4 py-3">
                              {activeProb?<span className="text-xs font-medium text-violet-700 bg-violet-50 px-2 py-0.5 rounded-lg">{activeProb.title.substring(0,32)}…</span>
                                :<span className="text-xs text-slate-300">Not assigned</span>}
                            </td>
                            <td className="px-4 py-3 min-w-[120px]">
                              <div className="text-sm font-bold text-slate-700 mb-1">{hours}h</div>
                              <MeterBar value={hours} max={60} color="bg-blue-400"/>
                            </td>
                            <td className="px-4 py-3">{s.activeProblem||activeProb?<Badge color="emerald">Active</Badge>:<Badge color="slate">Idle</Badge>}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}



          {/* COMPLETED */}
          {tab==='completed'&&(
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-slate-700">Completed Projects</h2>
              {completed.map(prob=>(
                <Card key={prob.id} className="p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <StatusBadge status={prob.status}/>
                      <h3 className="font-bold text-slate-900 mt-1.5">{prob.title}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{prob.district} · {prob.category}</p>
                    </div>
                    {prob.funding&&(
                      <div className="text-right flex-shrink-0">
                        <div className="text-lg font-extrabold text-emerald-600">{fmt(prob.funding.totalGranted)}</div>
                        <div className="text-xs text-slate-400">Grant Utilized</div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
              {completed.length===0&&<Card className="py-4"><Empty icon={CheckCircle2} title="No completed projects yet"/></Card>}
            </div>
          )}
        </main>
      </div>
    </AppShell>
  );
}

// ─── Uni Inbox Card ───────────────────────────────────────────────────────────
function UniInboxCard({ prob, onEngage, cta, primary }) {
  return (
    <Card className="p-4 card-hover">
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-1.5 mb-1.5">
            <StatusBadge status={prob.status}/>
            <Badge color="slate">{prob.category}</Badge>
            <Badge color="blue">{prob.district}</Badge>
            {prob.targetUniversity?<Badge color="violet">Targeted to You</Badge>:<Badge color="slate">Public</Badge>}
          </div>
          <h3 className="font-bold text-slate-900 text-sm leading-snug">{prob.title}</h3>
          <p className="text-xs text-slate-500 mt-1 line-clamp-1">{prob.description}</p>
          <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400">
            <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3"/>{prob.votes}</span>
            <span>{prob.submittedBy.name}</span>
            {prob.mediaFiles?.photos?.length>0&&<span className="flex items-center gap-1 text-blue-500"><Image className="w-3 h-3"/>{prob.mediaFiles.photos.length}</span>}
            {prob.mediaFiles?.audioNotes?.length>0&&<span className="flex items-center gap-1 text-blue-500"><Volume2 className="w-3 h-3"/>{prob.mediaFiles.audioNotes.length}</span>}
          </div>
        </div>
        <button onClick={onEngage}
          className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm whitespace-nowrap ${primary?'bg-violet-600 hover:bg-violet-700 text-white':'border-2 border-violet-300 text-violet-700 hover:bg-violet-50'}`}>
          {cta}
        </button>
      </div>
    </Card>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// STUDENT DASHBOARD
// ══════════════════════════════════════════════════════════════════════════════
function StudentDashboard({ persona, problems, students, setStudents, updateProblem, addLog, handleLogout, handleSwitchPersona, toast }) {
  const [tab, setTab] = useState('available');
  const [showMilestone, setShowMilestone] = useState(false);
  const [showProposal, setShowProposal] = useState(false);
  const [msNote, setMsNote] = useState('');
  const [msHours, setMsHours] = useState(4);
  const [proposal, setProposal] = useState({title:'',summary:'',fundingAsk:''});
  const [lightboxUrl, setLightboxUrl] = useState(null);

  // Find the student's active problem properly
  const myActiveProblem = useMemo(()=>
    problems.find(p=>p.engagedTeam?.students?.includes(persona.user.id))
    || problems.find(p=>{const s=students.find(st=>st.id===persona.user.id); return s&&p.id===s.activeProblem;})
  ,[problems,students,persona.user.id]);

  const myCredits = myActiveProblem?.studentCredits?.[persona.user.id]||0;
  const myHours = myActiveProblem?.studentHours?.[persona.user.id]||0;
  const myMaxCredits = students.find(s=>s.id===persona.user.id)?.maxCredits||6.0;
  const myPendingMs = myActiveProblem?.pendingMilestones?.filter(m=>m.studentId===persona.user.id)||[];

  const availableProblems = problems.filter(p=>['OPEN','ENGAGED'].includes(p.status));

  const handleClaim = prob=>{
    if(myActiveProblem){toast('You already have an active project','warning');return;}
    updateProblem(prob.id,{status:'ENGAGED'});
    // Update student's activeProblem
    setStudents(prev=>prev.map(s=>s.id===persona.user.id?{...s,activeProblem:prob.id}:s));
    addLog(persona.user.name,`Claimed problem — status changed to ENGAGED`,prob.id,'engage');
    toast(`Problem claimed! You're now working on "${prob.title.substring(0,30)}…"`);
    setTab('myproject');
  };

  const handleSubmitMilestone = ()=>{
    if(!msNote.trim()||!myActiveProblem) return;
    const ms={id:`PM-${Date.now()}`,studentId:persona.user.id,title:msNote.trim(),hours:parseInt(msHours)||1,submittedAt:new Date().toISOString().split('T')[0],status:'PENDING'};
    updateProblem(myActiveProblem.id,{pendingMilestones:[...(myActiveProblem.pendingMilestones||[]),ms]});
    addLog(persona.user.name,`Milestone submitted for approval: "${ms.title}"`,myActiveProblem.id,'milestone');
    setMsNote(''); setMsHours(4); setShowMilestone(false);
    toast('Milestone submitted — awaiting university approval');
  };

  const handleSubmitProposal = ()=>{
    if(!proposal.title.trim()||!myActiveProblem) return;
    updateProblem(myActiveProblem.id,{
      status:'SOLUTION_PROPOSED',
      proposedSolution:{title:proposal.title.trim(),summary:proposal.summary.trim(),submittedAt:new Date().toISOString().split('T')[0],fundingAsk:parseInt(proposal.fundingAsk)||500000,breakdown:{}}
    });
    addLog(persona.user.name,`Solution proposal submitted: "${proposal.title}"`,myActiveProblem.id,'proposal');
    setShowProposal(false);
    toast('Proposal submitted to Industry portal!');
  };

  const tabs=[
    {id:'available',label:'Available Problems',icon:Search},
    {id:'myproject',label:'My Project',icon:Target},
  ];

  const LIFECYCLE=['ENGAGED','SOLUTION_PROPOSED','FUNDED','IN_PROGRESS','PROTOTYPE','COMPLETED'];

  return (
    <AppShell persona={persona} handleLogout={handleLogout} handleSwitchPersona={handleSwitchPersona} accentBg="bg-emerald-600">
      <div className="bg-emerald-600 text-white px-4 sm:px-6 py-4">
        <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Ava src={persona.user.avatar} name={persona.user.name} size={12}/>
            <div>
              <h1 className="text-lg font-extrabold">{persona.user.name}</h1>
              <p className="text-emerald-200 text-xs">{persona.user.title}</p>
            </div>
          </div>
          <div className="flex gap-5">
            {[
              {l:'Hours Logged',v:`${myHours}h`},
              {l:'Credits Earned',v:`${myCredits}/${myMaxCredits}`},
              {l:'Active Project',v:myActiveProblem?'1':'0'},
            ].map(s=>(
              <div key={s.l} className="text-center flex-shrink-0">
                <div className="text-xl font-extrabold">{s.v}</div>
                <div className="text-emerald-200 text-[11px]">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-5 flex gap-5 w-full">
        <aside className="w-52 flex-shrink-0">
          <SideNav tabs={tabs} active={tab} onSelect={setTab} activeColor="bg-emerald-600"/>
        </aside>

        <main className="flex-1 min-w-0 space-y-4">
          {/* AVAILABLE PROBLEMS */}
          {tab==='available'&&(
            <div className="space-y-3">
              <div>
                <h2 className="text-sm font-bold text-slate-700">Available Problems</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {myActiveProblem?'You have an active project. Complete it before claiming another.':'Find a civic challenge to solve and claim it to start working.'}
                </p>
              </div>
              {availableProblems.map(prob=>(
                <Card key={prob.id} className="p-4 card-hover">
                  <div className="flex gap-3">
                    {prob.mediaFiles?.photos?.[0]&&(
                      <img src={prob.mediaFiles.photos[0]} alt="" className="w-20 h-16 rounded-xl object-cover flex-shrink-0"/>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap gap-1.5 mb-1"><StatusBadge status={prob.status}/><Badge color="blue">{prob.district}</Badge><Badge color="slate">{prob.category}</Badge></div>
                      <h3 className="font-bold text-slate-900 text-sm leading-snug">{prob.title}</h3>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{prob.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-slate-400 flex items-center gap-1"><ThumbsUp className="w-3 h-3"/>{prob.votes}</span>
                        {prob.mediaFiles?.audioNotes?.length>0&&<span className="text-xs text-blue-500 flex items-center gap-1"><Volume2 className="w-3 h-3"/>{prob.mediaFiles.audioNotes.length} audio</span>}
                        {!myActiveProblem&&prob.status==='OPEN'&&(
                          <button onClick={()=>handleClaim(prob)}
                            className="ml-auto bg-emerald-600 hover:bg-emerald-700 active:scale-[0.97] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm">
                            Claim Problem
                          </button>
                        )}
                        {prob.status==='ENGAGED'&&prob.engagedTeam&&<Badge color="violet">Team Active</Badge>}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              {availableProblems.length===0&&<Card className="py-4"><Empty icon={Search} title="No open problems" subtitle="Check back soon — citizens are posting new problems daily"/></Card>}
            </div>
          )}

          {/* MY PROJECT */}
          {tab==='myproject'&&(
            <div className="space-y-4">
              {!myActiveProblem?(
                <Card className="py-4">
                  <Empty icon={Target} title="No active project" subtitle="Browse available problems and claim one to get started"
                    action={{label:'Browse Available Problems →',fn:()=>setTab('available')}}/>
                </Card>
              ):(
                <>
                  <Card className="p-5">
                    <div className="flex flex-wrap gap-2 mb-3"><StatusBadge status={myActiveProblem.status}/><Badge color="slate">{myActiveProblem.category}</Badge><Badge color="blue">{myActiveProblem.district}</Badge></div>
                    <h2 className="text-base font-extrabold text-slate-900 mb-2">{myActiveProblem.title}</h2>
                    <p className="text-sm text-slate-500 leading-relaxed">{myActiveProblem.description}</p>

                    {myActiveProblem.mediaFiles?.photos?.length>0&&(
                      <div className="mt-3"><PhotoGrid photos={myActiveProblem.mediaFiles.photos} onLightbox={setLightboxUrl}/></div>
                    )}
                    {myActiveProblem.mediaFiles?.audioNotes?.length>0&&(
                      <div className="mt-3 space-y-2">{myActiveProblem.mediaFiles.audioNotes.map(n=><AudioNoteCard key={n.id} note={n}/>)}</div>
                    )}
                    {myActiveProblem.engagedTeam?.faculty&&(
                      <div className="mt-4 p-3 bg-violet-50 rounded-xl border border-violet-100">
                        <p className="text-[10px] font-bold text-violet-500 uppercase mb-1">Faculty Mentor</p>
                        <p className="text-sm font-bold text-slate-800">{myActiveProblem.engagedTeam.faculty.name}</p>
                        <p className="text-xs text-slate-500">{myActiveProblem.engagedTeam.faculty.dept}</p>
                      </div>
                    )}
                  </Card>

                  {/* Lifecycle */}
                  <Card className="p-5">
                    <h3 className="text-sm font-bold text-slate-700 mb-4">Project Lifecycle</h3>
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
                      {LIFECYCLE.map((s,i,arr)=>{
                        const curIdx=arr.indexOf(myActiveProblem.status);
                        const isCur=i===curIdx,isDone=i<curIdx;
                        return (
                          <React.Fragment key={s}>
                            <div className={`flex flex-col items-center gap-1 flex-shrink-0 transition-opacity ${!isCur&&!isDone?'opacity-30':''}`}>
                              <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold ${isCur?'border-emerald-500 bg-emerald-500 text-white':isDone?'border-emerald-400 bg-emerald-100 text-emerald-600':'border-slate-200 bg-white text-slate-400'}`}>
                                {isDone?<Check className="w-3.5 h-3.5"/>:i+1}
                              </div>
                              <span className="text-[9px] font-medium text-slate-500 text-center w-14 leading-tight">{STATUS_CONFIG[s]?.label}</span>
                            </div>
                            {i<arr.length-1&&<div className={`h-px flex-1 min-w-2 transition-colors ${isDone?'bg-emerald-400':'bg-slate-200'}`}/>}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </Card>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    <button onClick={()=>setShowMilestone(true)}
                      className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.97] text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all">
                      <PlusCircle className="w-4 h-4"/> Submit Milestone
                    </button>
                    {myActiveProblem.status==='ENGAGED'&&!myActiveProblem.proposedSolution&&(
                      <button onClick={()=>setShowProposal(true)}
                        className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 active:scale-[0.97] text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all">
                        <Send className="w-4 h-4"/> Submit Solution Proposal
                      </button>
                    )}
                  </div>

                  {/* Pending milestones */}
                  {myPendingMs.length>0&&(
                    <Card className="p-5">
                      <h3 className="text-sm font-bold text-slate-700 mb-3">Submitted Milestones — Awaiting University Review</h3>
                      <div className="space-y-2">
                        {myPendingMs.map(ms=>(
                          <div key={ms.id} className={`flex items-center justify-between p-3 rounded-xl border text-sm ${ms.status==='PENDING'?'bg-amber-50 border-amber-200':ms.status==='REJECTED'?'bg-rose-50 border-rose-200':'bg-emerald-50 border-emerald-200'}`}>
                            <div>
                              <span className="font-semibold text-slate-800">{ms.title}</span>
                              <p className="text-[10px] text-slate-400 mt-0.5">{ms.submittedAt} · {ms.hours}h</p>
                            </div>
                            <div className="flex items-center gap-2">
                              {ms.status==='PENDING'&&<Badge color="amber">Pending Review</Badge>}
                              {ms.status==='REJECTED'&&<Badge color="red">Revision Needed</Badge>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}

                  {/* Milestones */}
                  {myActiveProblem.milestones?.length>0&&(
                    <Card className="p-5">
                      <h3 className="text-sm font-bold text-slate-700 mb-3">Escrow Milestone Tranches</h3>
                      <div className="space-y-2">
                        {myActiveProblem.milestones.map(m=>(
                          <div key={m.id} className={`p-3 rounded-xl border ${m.status==='DONE'?'bg-emerald-50 border-emerald-200':m.status==='ACTIVE'?'bg-cyan-50 border-cyan-200':'bg-slate-50 border-slate-100 opacity-50'}`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {m.status==='DONE'&&<CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0"/>}
                                {m.status==='ACTIVE'&&<Clock className="w-4 h-4 text-cyan-500 flex-shrink-0"/>}
                                {m.status==='LOCKED'&&<Lock className="w-4 h-4 text-slate-300 flex-shrink-0"/>}
                                <span className="text-sm font-semibold text-slate-800">{m.title}</span>
                              </div>
                              <span className="text-xs font-bold text-slate-500">{m.pct}%</span>
                            </div>
                            {m.hash&&<p className="text-xs text-emerald-600 font-mono mt-1">Hash: {m.hash}</p>}
                            {m.approvedBy&&<p className="text-[10px] text-slate-400 mt-0.5">Approved by: {m.approvedBy}</p>}
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}

                  {/* Solution proposal */}
                  {myActiveProblem.proposedSolution&&(
                    <Card className="p-5 border-amber-200 bg-amber-50">
                      <div className="flex items-center gap-2 mb-2"><FileText className="w-4 h-4 text-amber-600"/><h3 className="font-bold text-amber-800 text-sm">Submitted Solution Proposal</h3></div>
                      <p className="text-sm font-bold text-slate-900">{myActiveProblem.proposedSolution.title}</p>
                      <p className="text-xs text-slate-600 mt-1">{myActiveProblem.proposedSolution.summary}</p>
                      <p className="text-xs font-bold text-amber-700 mt-2">Funding Ask: {fmt(myActiveProblem.proposedSolution.fundingAsk)}</p>
                    </Card>
                  )}
                </>
              )}
            </div>
          )}


        </main>
      </div>

      {showMilestone&&(
        <Modal title="Submit Milestone for Approval" onClose={()=>setShowMilestone(false)}>
          <div className="space-y-4">
            <div className="p-3 bg-violet-50 rounded-xl border border-violet-100 text-xs text-violet-700 flex items-start gap-2">
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5"/>
              Your university admin will review this and award credits on approval.
            </div>
            <FormField label="What did you complete? *">
              <textarea rows={3} value={msNote} onChange={e=>setMsNote(e.target.value)}
                placeholder="Describe the deliverable, test result, or research output…"
                className={`${inputCls} resize-none`}/>
            </FormField>
            <FormField label="Hours Worked" hint={`Credits on approval: +${(msHours*0.12).toFixed(1)} credits`}>
              <input type="number" value={msHours} onChange={e=>setMsHours(Math.max(1,parseInt(e.target.value)||1))} min="1" max="40" className={inputCls}/>
            </FormField>
            <button onClick={handleSubmitMilestone} disabled={!msNote.trim()}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-3 rounded-xl text-sm transition-all">
              Submit for University Review
            </button>
          </div>
        </Modal>
      )}

      {showProposal&&(
        <Modal title="Submit Solution Proposal" onClose={()=>setShowProposal(false)}>
          <div className="space-y-4">
            <FormField label="Solution Title *">
              <input value={proposal.title} onChange={e=>setProposal(p=>({...p,title:e.target.value}))} placeholder="e.g. IoT Sensor Network for Bridge Monitoring" className={inputCls}/>
            </FormField>
            <FormField label="Technical Summary *">
              <textarea rows={4} value={proposal.summary} onChange={e=>setProposal(p=>({...p,summary:e.target.value}))}
                placeholder="Describe your approach, technology stack, team, and expected impact…" className={`${inputCls} resize-none`}/>
            </FormField>
            <FormField label="Funding Ask (₹)" hint="This will be visible to CSR/Industry partners">
              <input type="number" value={proposal.fundingAsk} onChange={e=>setProposal(p=>({...p,fundingAsk:e.target.value}))} placeholder="e.g. 750000" className={inputCls}/>
            </FormField>
            <button onClick={handleSubmitProposal} disabled={!proposal.title.trim()||!proposal.summary.trim()}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-3 rounded-xl text-sm transition-all">
              Submit to Industry Portal →
            </button>
          </div>
        </Modal>
      )}
      {lightboxUrl&&<Lightbox url={lightboxUrl} onClose={()=>setLightboxUrl(null)}/>}
    </AppShell>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// INDUSTRY DASHBOARD
// ══════════════════════════════════════════════════════════════════════════════
function IndustryDashboard({ persona, problems, updateProblem, addLog, handleLogout, handleSwitchPersona, toast }) {
  const [tab, setTab] = useState('explore');
  const [showFund, setShowFund] = useState(null);
  const [grantAmt, setGrantAmt] = useState('');
  const [fundedIds, setFundedIds] = useState(['PROB-001','PROB-002','PROB-008']);
  const [lightboxUrl, setLightboxUrl] = useState(null);
  const [calcAmt, setCalcAmt] = useState('');

  const proposalProblems = problems.filter(p=>['SOLUTION_PROPOSED','PROTOTYPE','FUNDED','IN_PROGRESS'].includes(p.status));
  const myFunded = problems.filter(p=>fundedIds.includes(p.id));
  const taxSave = n => Math.round(n*0.25);

  const handleFund = ()=>{
    const amount = parseInt(grantAmt)||showFund?.proposedSolution?.fundingAsk||500000;
    updateProblem(showFund.id,{status:'FUNDED',funding:{partner:persona.user.company,totalGranted:amount,trancheReleased:1,escrowBalance:amount}});
    setFundedIds(prev=>[...prev,showFund.id]);
    addLog(`${persona.user.name} (${persona.user.company})`,`CSR Grant of ${fmt(amount)} deployed to smart escrow`,showFund.id,'funding');
    setShowFund(null); setGrantAmt('');
    toast(`${fmt(amount)} CSR grant deployed!`);
  };

  const tabs=[
    {id:'explore',label:'Explore Proposals',icon:Search},
    {id:'portfolio',label:'My Portfolio',icon:Briefcase},
    {id:'equity',label:'Stage-2 Equity',icon:TrendingUp},
  ];

  return (
    <AppShell persona={persona} handleLogout={handleLogout} handleSwitchPersona={handleSwitchPersona} accentBg="bg-amber-500">
      <div className="bg-amber-500 text-white px-4 sm:px-6 py-4">
        <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-extrabold">{persona.user.company}</h1>
            <p className="text-amber-100 text-xs">{persona.user.name} · {persona.user.title}</p>
          </div>
          <div className="flex gap-5">
            {[{l:'Funded',v:myFunded.length},{l:'Deployed',v:fmt(myFunded.reduce((a,p)=>a+(p.funding?.totalGranted||0),0))},{l:'Tax Benefit',v:'100% 80GGA'}].map(s=>(
              <div key={s.l} className="text-center flex-shrink-0">
                <div className="text-lg font-extrabold">{s.v}</div>
                <div className="text-amber-100 text-[11px]">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Compliance bar */}
      <div className="bg-amber-50 border-b border-amber-100 px-4 py-2 overflow-x-auto">
        <div className="max-w-screen-xl mx-auto flex gap-5 text-[11px] whitespace-nowrap">
          {[['Sec 135 & Schedule VII(ix)','Companies Act 2013'],['100% Tax Deduction','Sec 80GGA / Sec 35'],['No 3-Yr NGO Rule','University incubators exempt'],['Public ROI','4x on foregone tax']].map(([k,v])=>(
            <div key={k} className="flex items-center gap-1.5 text-amber-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0"/>
              <span className="font-bold">{k}:</span>
              <span>{v}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-5 flex gap-5 w-full">
        <aside className="w-52 flex-shrink-0 space-y-4">
          <SideNav tabs={tabs} active={tab} onSelect={setTab} activeColor="bg-amber-500"/>

          <Card className="p-4 border-amber-100 bg-amber-50">
            <h4 className="text-xs font-bold text-amber-800 mb-2 flex items-center gap-1.5"><Coins className="w-3.5 h-3.5"/>Tax Savings Calculator</h4>
            <input type="number" value={calcAmt} onChange={e=>setCalcAmt(e.target.value)} placeholder="Grant amount ₹"
              className="w-full text-xs border border-amber-200 rounded-lg px-2.5 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-amber-400"/>
            {calcAmt&&parseInt(calcAmt)>0&&(
              <p className="text-xs text-emerald-700 font-bold mt-2">Tax saved: <span className="text-emerald-600">{fmt(taxSave(parseInt(calcAmt)))}</span></p>
            )}
          </Card>
        </aside>

        <main className="flex-1 min-w-0 space-y-4">
          {/* EXPLORE */}
          {tab==='explore'&&(
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-bold text-slate-700">Validated Solution Proposals</h2>
                <p className="text-xs text-slate-400 mt-0.5">University-backed projects with active teams and submitted proposals — ready for CSR funding</p>
              </div>
              {proposalProblems.length===0&&<Card className="py-4"><Empty icon={Search} title="No proposals yet" subtitle="Check back as university teams submit their solutions"/></Card>}
              {proposalProblems.map(prob=>(
                <Card key={prob.id} className="overflow-hidden card-hover">
                  {prob.mediaFiles?.photos?.[0]&&(
                    <div className="relative h-32 cursor-pointer" onClick={()=>setLightboxUrl(prob.mediaFiles.photos[0])}>
                      <img src={prob.mediaFiles.photos[0]} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"/>
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"/>
                      <div className="absolute bottom-2 left-3 flex items-center gap-2">
                        {prob.mediaFiles.audioNotes?.length>0&&<span className="bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-lg flex items-center gap-1"><Volume2 className="w-3 h-3"/> {prob.mediaFiles.audioNotes.length} audio</span>}
                        {prob.mediaFiles.photos.length>1&&<span className="bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-lg flex items-center gap-1"><Image className="w-3 h-3"/> +{prob.mediaFiles.photos.length-1}</span>}
                      </div>
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap gap-1.5 mb-2"><StatusBadge status={prob.status}/><Badge color="slate">{prob.category}</Badge><Badge color="blue">{prob.district}</Badge></div>
                        <h3 className="font-bold text-slate-900">{prob.title}</h3>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{prob.description}</p>
                        {prob.engagedTeam?.faculty&&(
                          <p className="text-xs text-violet-600 font-medium mt-1 flex items-center gap-1">
                            <Building2 className="w-3 h-3"/>{prob.engagedTeam.faculty.name} · {UNIVERSITIES.find(u=>u.id===prob.assignedUniversity)?.name}
                          </p>
                        )}
                        {(() => {
                          const totalHours=Object.values(prob.studentHours||{}).reduce((a,h)=>a+h,0);
                          return totalHours>0?<p className="text-[11px] text-blue-600 font-semibold mt-1 flex items-center gap-1"><Clock className="w-3 h-3"/>{totalHours}h R&D logged</p>:null;
                        })()}
                      </div>
                      {!fundedIds.includes(prob.id)?(
                        <button onClick={()=>setShowFund(prob)}
                          className="flex-shrink-0 bg-amber-500 hover:bg-amber-600 active:scale-[0.97] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all whitespace-nowrap">
                          Deploy CSR Grant
                        </button>
                      ):<Badge color="green">✓ You Funded This</Badge>}
                    </div>
                    {prob.proposedSolution&&(
                      <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100">
                        <p className="text-[10px] font-bold text-amber-600 uppercase mb-1">Solution Proposal</p>
                        <p className="text-sm font-bold text-slate-800">{prob.proposedSolution.title}</p>
                        <p className="text-xs text-slate-600 mt-1">{prob.proposedSolution.summary}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm font-extrabold text-amber-700">Ask: {fmt(prob.proposedSolution.fundingAsk)}</span>
                          <span className="text-xs text-emerald-600 font-semibold">You save: {fmt(taxSave(prob.proposedSolution.fundingAsk))}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* PORTFOLIO */}
          {tab==='portfolio'&&(
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-slate-700">Funded Projects Portfolio</h2>
              {myFunded.length===0&&<Card className="py-4"><Empty icon={Briefcase} title="No funded projects yet" subtitle="Go to Explore Proposals to deploy your first CSR grant" action={{label:'Explore Proposals →',fn:()=>setTab('explore')}}/></Card>}
              {myFunded.map(prob=>(
                <Card key={prob.id} className="p-5 card-hover">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap gap-1.5 mb-1.5"><StatusBadge status={prob.status}/><Badge color="amber">{prob.district}</Badge></div>
                      <h3 className="font-bold text-slate-900">{prob.title}</h3>
                      {prob.funding&&<p className="text-xs text-slate-400 mt-1">{prob.funding.partner} · Tranche {prob.funding.trancheReleased}/4</p>}
                      {(() => {
                        const h=Object.values(prob.studentHours||{}).reduce((a,v)=>a+v,0);
                        return h>0?<p className="text-[11px] text-blue-600 font-semibold mt-1 flex items-center gap-1"><Clock className="w-3 h-3"/>{h}h logged by team</p>:null;
                      })()}
                    </div>
                    {prob.funding&&<div className="text-right flex-shrink-0"><div className="text-xl font-extrabold text-amber-600">{fmt(prob.funding.totalGranted)}</div><div className="text-xs text-slate-400">Grant</div></div>}
                  </div>
                  {prob.milestones?.length>0&&(
                    <div className="mt-4 space-y-1.5 pt-3 border-t border-slate-100">
                      {prob.milestones.map(m=>(
                        <div key={m.id} className={`flex items-center gap-2 text-xs ${m.status==='DONE'?'text-emerald-600':m.status==='ACTIVE'?'text-cyan-600':'text-slate-300'}`}>
                          {m.status==='DONE'&&<CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0"/>}
                          {m.status==='ACTIVE'&&<Clock className="w-3.5 h-3.5 flex-shrink-0"/>}
                          {m.status==='LOCKED'&&<Lock className="w-3.5 h-3.5 flex-shrink-0"/>}
                          <span className="flex-1">{m.title}</span>
                          <span className="font-bold">{m.pct}%</span>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}

          {/* EQUITY */}
          {tab==='equity'&&(
            <div className="space-y-4">
              <Card className="p-4 border-orange-200 bg-orange-50">
                <p className="text-sm font-bold text-orange-800 mb-1 flex items-center gap-2"><AlertTriangle className="w-4 h-4"/> Legal Decoupling Notice</p>
                <p className="text-xs text-orange-700">Stage-1 CSR grants are legally separate from Stage-2 commercial equity (Companies Act 2013). Your venture arm must execute a separate Share Subscription Agreement (SSA). CSR funds cannot receive returns.</p>
              </Card>
              <h2 className="text-sm font-bold text-slate-700">Prototype-Ready Projects — Eligible for Equity</h2>
              {problems.filter(p=>['PROTOTYPE','COMPLETED'].includes(p.status)).map(prob=>(
                <Card key={prob.id} className="p-5 card-hover">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <StatusBadge status={prob.status}/>
                      <h3 className="font-bold text-slate-900 mt-2">{prob.title}</h3>
                      <p className="text-xs text-slate-500 mt-1">{prob.description.substring(0,100)}…</p>
                    </div>
                    <button className="flex-shrink-0 border-2 border-orange-300 text-orange-600 hover:bg-orange-50 active:scale-[0.97] px-4 py-2 rounded-xl text-xs font-bold transition-all">Initiate SSA</button>
                  </div>
                  <div className="mt-3 p-3 bg-slate-50 rounded-xl grid grid-cols-3 gap-3 text-center text-xs border border-slate-100">
                    {[['₹3.0L','Equity Ask'],['20%','Stake Offered'],['GeM Listed','Procurement Ready']].map(([v,l])=>(
                      <div key={l}><div className="font-extrabold text-slate-800">{v}</div><div className="text-slate-400">{l}</div></div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>

      {showFund&&(
        <Modal title="Deploy CSR Grant via Smart Escrow" onClose={()=>setShowFund(null)}>
          <div className="space-y-4">
            <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-800">
              <strong>Legal Basis:</strong> Sec 135 & Schedule VII(ix), Companies Act 2013. 100% deduction under Sec 80GGA.
            </div>
            <p className="text-sm font-bold text-slate-800">{showFund.title}</p>
            {showFund.proposedSolution&&(
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm">
                Recommended: <span className="font-bold text-amber-700">{fmt(showFund.proposedSolution.fundingAsk)}</span>
                {' '}· Tax saved: <span className="font-bold text-emerald-600">{fmt(taxSave(showFund.proposedSolution.fundingAsk))}</span>
              </div>
            )}
            <FormField label="Grant Amount (₹)">
              <input type="number" value={grantAmt} onChange={e=>setGrantAmt(e.target.value)}
                placeholder={String(showFund.proposedSolution?.fundingAsk||500000)} className={inputCls}/>
              {grantAmt&&parseInt(grantAmt)>0&&(
                <p className="text-xs text-emerald-600 font-bold mt-1">Tax saved: {fmt(taxSave(parseInt(grantAmt)))}</p>
              )}
            </FormField>
            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1.5 border border-slate-100">
              <p className="font-bold text-slate-700 mb-1">4-Tranche Release Schedule</p>
              {['15% · Problem Validation','35% · Prototype Build','35% · Field Testing','15% · Final Handover & GeM'].map((t,i)=>(
                <div key={i} className="flex items-center gap-2"><span className={`w-2 h-2 rounded-full flex-shrink-0 ${i===0?'bg-emerald-500':'bg-slate-300'}`}/><span className="text-slate-600">{t}</span></div>
              ))}
            </div>
            <button onClick={handleFund}
              className="w-full bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white font-bold py-3 rounded-xl text-sm transition-all shadow-sm">
              Confirm & Deploy to Escrow ✓
            </button>
          </div>
        </Modal>
      )}
      {lightboxUrl&&<Lightbox url={lightboxUrl} onClose={()=>setLightboxUrl(null)}/>}
    </AppShell>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// GOVERNMENT DASHBOARD
// ══════════════════════════════════════════════════════════════════════════════
function GovernmentDashboard({ persona, problems, students, activityLog, updateProblem, addLog, handleLogout, handleSwitchPersona, toast }) {
  const [tab, setTab] = useState('overview');
  const [filterDist, setFilterDist] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showGem, setShowGem] = useState(null);
  const [lightboxUrl, setLightboxUrl] = useState(null);

  const filtered = useMemo(()=>problems.filter(p=>{
    if(filterDist!=='All'&&p.district!==filterDist) return false;
    if(filterStatus!=='All'&&p.status!==filterStatus) return false;
    return true;
  }),[problems,filterDist,filterStatus]);

  const distStats = useMemo(()=>DISTRICTS.slice(0,8).map(d=>({
    name:d,
    open:problems.filter(p=>p.district===d&&p.status==='OPEN').length,
    active:problems.filter(p=>p.district===d&&['ENGAGED','SOLUTION_PROPOSED','FUNDED','IN_PROGRESS','PROTOTYPE'].includes(p.status)).length,
    done:problems.filter(p=>p.district===d&&p.status==='COMPLETED').length,
    total:problems.filter(p=>p.district===d).length,
  })),[problems]);

  const totalFunding=problems.reduce((a,p)=>a+(p.funding?.totalGranted||0),0);
  const completed=problems.filter(p=>p.status==='COMPLETED');

  const tabs=[
    {id:'overview',label:'Overview',icon:BarChart2},
    {id:'problems',label:'All Problems',icon:Layers},
    {id:'heatmap',label:'District Map',icon:MapPin},
    {id:'gem',label:'GeM Procurement',icon:ShieldCheck},
    {id:'audit',label:'Audit Log',icon:Activity},
  ];

  const typeColor={funding:'bg-amber-100 text-amber-700',milestone:'bg-emerald-100 text-emerald-700',submit:'bg-rose-100 text-rose-700',engage:'bg-violet-100 text-violet-700',approval:'bg-blue-100 text-blue-700',assignment:'bg-cyan-100 text-cyan-700',rejection:'bg-red-100 text-red-700',credit:'bg-green-100 text-green-700'};
  const typeDot={funding:'bg-amber-400',milestone:'bg-emerald-400',submit:'bg-rose-400',engage:'bg-violet-400',approval:'bg-blue-400',assignment:'bg-cyan-400',rejection:'bg-red-400',credit:'bg-green-400'};

  return (
    <AppShell persona={persona} handleLogout={handleLogout} handleSwitchPersona={handleSwitchPersona} accentBg="bg-blue-700">
      <div className="bg-blue-700 text-white px-4 sm:px-6 py-4">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="w-5 h-5 opacity-70"/>
            <div>
              <h1 className="text-lg font-extrabold">Mission Control — Jharkhand</h1>
              <p className="text-blue-200 text-xs">{persona.user.name} · {persona.user.title}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              {l:'Total Problems',v:problems.length},
              {l:'Open / Unassigned',v:problems.filter(p=>p.status==='OPEN').length},
              {l:'Universities Active',v:new Set(problems.filter(p=>p.assignedUniversity).map(p=>p.assignedUniversity)).size},
              {l:'Total CSR Deployed',v:fmt(totalFunding)},
              {l:'Completed',v:completed.length},
            ].map(s=>(
              <div key={s.l} className="bg-white/10 rounded-xl p-3 text-center">
                <div className="text-xl font-extrabold">{s.v}</div>
                <div className="text-blue-200 text-[10px] mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-5 flex gap-5 w-full">
        <aside className="w-52 flex-shrink-0">
          <SideNav tabs={tabs} active={tab} onSelect={setTab} activeColor="bg-blue-700"/>
        </aside>

        <main className="flex-1 min-w-0 space-y-4">
          {/* OVERVIEW */}
          {tab==='overview'&&(
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="p-5">
                <h3 className="text-sm font-bold text-slate-700 mb-4">Status Breakdown</h3>
                <div className="space-y-2.5">
                  {Object.entries(STATUS_CONFIG).map(([status,cfg])=>{
                    const count=problems.filter(p=>p.status===status).length;
                    return (
                      <div key={status} className="flex items-center gap-3">
                        <span className="w-28 text-xs text-slate-600 font-medium flex-shrink-0">{cfg.label}</span>
                        <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div className={`${cfg.dot} h-full rounded-full transition-all duration-500`} style={{width:`${problems.length>0?(count/problems.length)*100:0}%`}}/>
                        </div>
                        <span className="w-5 text-xs font-bold text-slate-700 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card className="p-5">
                <h3 className="text-sm font-bold text-slate-700 mb-4">University Engagement</h3>
                <div className="space-y-3">
                  {UNIVERSITIES.map(u=>{
                    const uProbs=problems.filter(p=>p.assignedUniversity===u.id);
                    const uStudents=students.filter(s=>s.university===u.id);
                    return (
                      <div key={u.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-bold text-slate-800">{u.name}</span>
                          <span className="text-xs text-slate-400">{uStudents.length} students</span>
                        </div>
                        <div className="flex gap-2 text-xs text-slate-500">
                          <span>{uProbs.length} assigned</span>·
                          <span>{uProbs.filter(p=>!['OPEN','COMPLETED'].includes(p.status)).length} active</span>·
                          <span>{uProbs.filter(p=>p.status==='COMPLETED').length} done</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card className="p-5 lg:col-span-2">
                <h3 className="text-sm font-bold text-slate-700 mb-3">Recent Platform Activity</h3>
                <div className="space-y-px">
                  {activityLog.slice(0,6).map(log=>(
                    <div key={log.id} className="flex items-start gap-3 px-2 py-2.5 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${typeDot[log.type]||'bg-slate-300'}`}/>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-700 leading-snug">{log.action}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{log.actor} · {log.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* ALL PROBLEMS */}
          {tab==='problems'&&(
            <>
              <div className="flex items-center gap-3 flex-wrap">
                <select value={filterDist} onChange={e=>setFilterDist(e.target.value)} className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="All">All Districts</option>
                  {DISTRICTS.map(d=><option key={d} value={d}>{d}</option>)}
                </select>
                <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="All">All Statuses</option>
                  {Object.entries(STATUS_CONFIG).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                </select>
                <span className="text-xs text-slate-400">{filtered.length} result{filtered.length!==1?'s':''}</span>
                {(filterDist!=='All'||filterStatus!=='All')&&(
                  <button onClick={()=>{setFilterDist('All');setFilterStatus('All');}} className="text-xs text-blue-600 font-semibold hover:underline">Clear</button>
                )}
              </div>
              <Card>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>{['Problem','District','Category','Status','University','Media','Hours','Funding','Votes'].map(h=>(
                        <th key={h} className="px-4 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}</tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filtered.map(prob=>{
                        const totalHours=Object.values(prob.studentHours||{}).reduce((a,h)=>a+h,0);
                        return (
                          <tr key={prob.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 max-w-xs">
                              <div className="font-semibold text-slate-900 text-sm truncate">{prob.title}</div>
                              <div className="text-[10px] text-slate-400 font-mono">{prob.id}</div>
                            </td>
                            <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{prob.district}</td>
                            <td className="px-4 py-3"><Badge color="slate">{prob.category.split('&')[0].trim()}</Badge></td>
                            <td className="px-4 py-3"><StatusBadge status={prob.status}/></td>
                            <td className="px-4 py-3 text-xs text-violet-600 font-medium whitespace-nowrap">
                              {prob.assignedUniversity?UNIVERSITIES.find(u=>u.id===prob.assignedUniversity)?.name:<span className="text-slate-300">—</span>}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1.5 text-[11px]">
                                {prob.mediaFiles?.photos?.length>0&&<span className="flex items-center gap-0.5 text-blue-500"><Image className="w-3 h-3"/>{prob.mediaFiles.photos.length}</span>}
                                {prob.mediaFiles?.audioNotes?.length>0&&<span className="flex items-center gap-0.5 text-blue-500"><Volume2 className="w-3 h-3"/>{prob.mediaFiles.audioNotes.length}</span>}
                                {!prob.mediaFiles?.photos?.length&&!prob.mediaFiles?.audioNotes?.length&&<span className="text-slate-300">—</span>}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              {totalHours>0?<span className="text-xs font-bold text-blue-600">{totalHours}h</span>:<span className="text-slate-300 text-xs">—</span>}
                            </td>
                            <td className="px-4 py-3 text-xs font-bold text-emerald-600 whitespace-nowrap">
                              {prob.funding?fmt(prob.funding.totalGranted):<span className="text-slate-300">—</span>}
                            </td>
                            <td className="px-4 py-3 text-xs text-slate-500">
                              <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3"/>{prob.votes}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {filtered.length===0&&<div className="py-16 text-center text-slate-400"><p>No problems match your filters</p></div>}
                </div>
              </Card>
            </>
          )}

          {/* HEATMAP */}
          {tab==='heatmap'&&(
            <>
              <div>
                <h2 className="text-sm font-bold text-slate-700">District Problem Map</h2>
                <p className="text-xs text-slate-400 mt-0.5">Red = high open problems · Amber = active projects · Green = completed</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {distStats.map(d=>{
                  const urgency=d.open>2?'border-rose-300 bg-rose-50':d.active>0?'border-amber-200 bg-amber-50':'border-slate-200 bg-white';
                  return (
                    <Card key={d.name} className={`p-4 border-2 ${urgency} card-hover`}>
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="font-bold text-slate-800 text-sm">{d.name}</span>
                        <MapPin className="w-4 h-4 text-slate-300"/>
                      </div>
                      {[{l:'Open',c:d.open,col:'text-blue-600'},{l:'Active',c:d.active,col:'text-amber-600'},{l:'Done',c:d.done,col:'text-emerald-600'}].map(i=>(
                        <div key={i.l} className="flex justify-between items-center py-0.5 text-xs">
                          <span className="text-slate-400">{i.l}</span>
                          <span className={`font-bold ${i.col}`}>{i.c}</span>
                        </div>
                      ))}
                      {d.total===0&&<p className="text-xs text-slate-300 mt-1 text-center">No reports yet</p>}
                    </Card>
                  );
                })}
              </div>
            </>
          )}

          {/* GEM */}
          {tab==='gem'&&(
            <div className="space-y-4">
              <Card className="p-4 border-blue-200 bg-blue-50">
                <h3 className="text-sm font-bold text-blue-800 mb-2">GeM Startup Runway Exemptions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {['Zero Prior Annual Turnover Required','Zero Prior Experience Required','Earnest Money Deposit (EMD) Waiver'].map(e=>(
                    <div key={e} className="flex items-center gap-1.5 text-blue-700 font-semibold"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0"/>{e}</div>
                  ))}
                </div>
              </Card>
              <h2 className="text-sm font-bold text-slate-700">Completed Projects — Eligible for Direct Pilot Purchase Orders</h2>
              {completed.length===0&&<Card className="py-4"><Empty icon={ShieldCheck} title="No completed projects yet" subtitle="Projects will appear here once the team delivers and closes all milestones"/></Card>}
              {completed.map(prob=>(
                <Card key={prob.id} className="p-5 card-hover">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <StatusBadge status={prob.status}/>
                      <h3 className="font-bold text-slate-900 mt-2">{prob.title}</h3>
                      {prob.mediaFiles?.photos?.[0]&&(
                        <img src={prob.mediaFiles.photos[0]} alt="" onClick={()=>setLightboxUrl(prob.mediaFiles.photos[0])}
                          className="mt-2 w-full h-24 object-cover rounded-xl cursor-pointer hover:brightness-90 transition"/>
                      )}
                      <p className="text-xs text-slate-400 mt-2">{UNIVERSITIES.find(u=>u.id===prob.assignedUniversity)?.name} · {prob.district}</p>
                      {prob.proposedSolution&&<p className="text-xs text-violet-600 font-semibold mt-0.5">{prob.proposedSolution.title}</p>}
                    </div>
                    <button onClick={()=>setShowGem(prob)}
                      className="flex-shrink-0 bg-blue-700 hover:bg-blue-800 active:scale-[0.97] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all whitespace-nowrap">
                      Issue Work Order
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* AUDIT */}
          {tab==='audit'&&(
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-slate-700">Full Platform Audit Log</h2>
              <Card>
                <div className="divide-y divide-slate-100">
                  {activityLog.map(log=>(
                    <div key={log.id} className="px-5 py-3 flex items-start gap-3 hover:bg-slate-50 transition-colors">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase flex-shrink-0 mt-0.5 ${typeColor[log.type]||'bg-slate-100 text-slate-600'}`}>{log.type}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-700 leading-snug">{log.action}</p>
                        <div className="flex flex-wrap gap-2 mt-0.5 text-[10px] text-slate-400">
                          <span>{log.actor}</span>·<span>{log.time}</span>
                          {log.problemId&&<span className="font-mono">{log.problemId}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </main>
      </div>

      {/* GeM Modal */}
      {showGem&&(
        <Modal title="Issue GeM Pilot Work Order" onClose={()=>setShowGem(null)}>
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-xs text-blue-800 space-y-1">
              <p><strong>Authority:</strong> {persona.user.name} · District Collectorate</p>
              <p><strong>Problem:</strong> {showGem.title}</p>
              <p><strong>Vendor:</strong> Student startup team — GeM exempted</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1.5">
              <p className="font-bold text-slate-700 mb-1">Exemptions Applied</p>
              {['Zero Prior Annual Turnover','Zero Prior Experience','EMD Cash Waiver','No Open Tender Required'].map(e=>(
                <div key={e} className="flex items-center gap-1.5 text-emerald-700"><Check className="w-3 h-3 flex-shrink-0"/>{e}</div>
              ))}
            </div>
            <button onClick={()=>{addLog(persona.user.name,`GeM work order issued for: "${showGem.title}"`,showGem.id,'approval');setShowGem(null);toast('Pilot work order issued!');}}
              className="w-full bg-blue-700 hover:bg-blue-800 active:scale-[0.98] text-white font-bold py-3 rounded-xl text-sm transition-all shadow-sm">
              Confirm & Issue Pilot Work Order ✓
            </button>
          </div>
        </Modal>
      )}
      {lightboxUrl&&<Lightbox url={lightboxUrl} onClose={()=>setLightboxUrl(null)}/>}
    </AppShell>
  );
}
