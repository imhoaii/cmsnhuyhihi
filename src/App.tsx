/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import confetti from "canvas-confetti";
import { 
  Terminal, 
  Cpu, 
  Activity, 
  Quote, 
  Image as ImageIcon, 
  Download,
  Ticket, 
  Music, 
  CheckCircle2,
  Lock,
  Unlock,
  ChevronRight,
  Database,
  Code2
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import React from "react";

// --- ASSET CONFIGURATION ---
// Tải file của bạn lên File Explorer và cập nhật tên file tại đây
const CORE_ASSET_IMAGE = "core-asset.jpg"; // Tên file ảnh bạn tải lên
const PEACE_MUSIC_FILE = "Music.mp3"; // Tên file nhạc bạn tải lên
// ---------------------------

export default function App() {
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passError, setPassError] = useState(false);
  const [isBooted, setIsBooted] = useState(false);
  const [progress, setProgress] = useState(0);

  // Audio Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const confettiIntervalRef = useRef<any>(null);

  const stopConfetti = () => {
    if (confettiIntervalRef.current) {
      clearInterval(confettiIntervalRef.current);
      confettiIntervalRef.current = null;
    }
  };

  const startConfetti = () => {
    stopConfetti();
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    confettiIntervalRef.current = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        stopConfetti();
        return;
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  useEffect(() => {
    if (isBooted && audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(e => console.log("Autoplay blocked or failed:", e));
    }
  }, [isBooted]);

  useEffect(() => {
    if (isAuthorized) {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            setTimeout(() => setIsBooted(true), 500);
            return 100;
          }
          return prev + 1;
        });
      }, 20);
      return () => clearInterval(timer);
    }
  }, [isAuthorized]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setAudioProgress((current / duration) * 100);
      }
    }
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.toUpperCase() === "PEACE") {
      setIsAuthorized(true);
      setPassError(false);
    } else {
      setPassError(true);
      setPassword("");
      // Reset error after a shake
      setTimeout(() => setPassError(false), 500);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center p-6 font-mono selection:bg-accent-blue/30 selection:text-accent-blue">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm glass-panel p-8 space-y-8 border-accent-blue/20"
        >
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-accent-blue/10 flex items-center justify-center text-accent-blue mx-auto border border-accent-blue/30">
              <Lock size={20} />
            </div>
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-accent-blue">Access Restricted</h2>
            <p className="text-[10px] text-ink-muted uppercase tracking-widest">Project HPD HARRY // Authorization Required</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] text-ink-muted uppercase tracking-widest block">Enter Access Key</label>
              <motion.input
                animate={passError ? { x: [-10, 10, -10, 10, 0] } : {}}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full bg-black/40 border ${passError ? 'border-red-500/50' : 'border-line'} rounded px-4 py-3 text-center tracking-[0.5em] focus:outline-none focus:border-accent-blue transition-colors text-ink placeholder:text-ink-muted/30`}
                autoFocus
              />
              {passError && (
                <p className="text-[10px] text-red-500 text-center uppercase tracking-widest animate-pulse">Invalid Credentials</p>
              )}
            </div>

            <button 
              type="submit"
              className="w-full py-3 bg-accent-blue/10 hover:bg-accent-blue/20 border border-accent-blue/30 text-accent-blue text-[10px] font-bold uppercase tracking-[0.2em] transition-all active:scale-95"
            >
              Verify Identity
            </button>
          </form>

          <div className="pt-4 border-t border-line text-center">
            <p className="text-[9px] text-ink-muted uppercase tracking-widest leading-relaxed">
              Hint: The core objective of this project (5 letters).
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!isBooted) {
    return (
      <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center p-6 font-mono">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="flex items-center justify-between text-accent-blue text-xs mb-2">
            <span className="flex items-center gap-2">
              <Terminal size={14} />
              SYSTEM_INIT_SEQUENCE
            </span>
            <span>{progress}%</span>
          </div>
          
          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-accent-blue"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>

          <div className="space-y-2 text-[10px] text-ink-muted uppercase tracking-widest">
            <p className={progress > 20 ? "text-accent-blue" : ""}>[ OK ] Initializing Logic Gates...</p>
            <p className={progress > 40 ? "text-accent-blue" : ""}>[ OK ] Loading Emotional Assets...</p>
            <p className={progress > 60 ? "text-accent-blue" : ""}>[ OK ] Clearing Glitch Fragments...</p>
            <p className={progress > 80 ? "text-accent-blue" : ""}>[ OK ] Verifying Stakeholder Credentials...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-ink selection:bg-accent-blue/30 selection:text-accent-blue overflow-x-hidden">
      {/* Header / Navigation Rail */}
      <nav className="fixed top-0 left-0 w-full z-50 border-b border-line bg-background/80 backdrop-blur-md px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-accent-blue/10 flex items-center justify-center text-accent-blue border border-accent-blue/20">
            <Cpu size={18} />
          </div>
          <div className="font-mono text-xs tracking-tighter">
            <p className="font-bold text-ink">PROJECT_HPD_HARRY</p>
            <p className="text-ink-muted">VER: 30.0.0_STABLE</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6 text-[10px] font-mono uppercase tracking-widest text-ink-muted">
          <a href="#system" className="hover:text-accent-blue transition-colors">System</a>
          <a href="#message" className="hover:text-accent-blue transition-colors">Stakeholder</a>
          <a href="#gallery" className="hover:text-accent-blue transition-colors">Visuals</a>
          <a href="#reward" className="hover:text-accent-blue transition-colors">Reward</a>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-accent-blue/30 bg-accent-blue/5 text-accent-blue text-[10px] font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse" />
          ENCRYPTED_SESSION
        </div>
      </nav>

      <main className="pt-24 pb-32 max-w-5xl mx-auto px-6 space-y-32">
        
        {/* SECTION 1: HERO & SYSTEM STATUS */}
        <section id="system" className="relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded border border-line bg-white/5 text-[10px] font-mono text-accent-blue uppercase tracking-widest"
              >
                <Activity size={12} />
                System Status: Deployed
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-5xl md:text-7xl font-bold tracking-tighter leading-none"
              >
                PROJECT <br />
                <span className="text-accent-blue glitch-text" data-text="HPD HARRY">HPD HARRY</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-ink-muted max-w-md leading-relaxed"
              >
                Final Deliverable for Senior Business Analyst. A synthesized environment designed for logic-shutdown and deep recovery.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-2 gap-4 font-mono text-[10px] uppercase tracking-widest"
              >
                <div className="p-4 border border-line rounded-lg bg-white/5">
                  <p className="text-ink-muted mb-1">Initialization</p>
                  <p className="text-ink font-bold">24 / 10</p>
                </div>
                <div className="p-4 border border-line rounded-lg bg-white/5">
                  <p className="text-ink-muted mb-1">Completion</p>
                  <p className="text-ink font-bold">13 / 04</p>
                </div>
              </motion.div>
            </div>

            <div className="flex justify-center md:justify-end relative">
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                {/* Circular Progress Visual */}
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="48%"
                    className="stroke-line fill-none"
                    strokeWidth="2"
                  />
                  <motion.circle
                    cx="50%"
                    cy="50%"
                    r="48%"
                    className="stroke-accent-blue fill-none"
                    strokeWidth="4"
                    strokeDasharray="100 100"
                    initial={{ strokeDashoffset: 100 }}
                    whileInView={{ strokeDashoffset: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 2, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    className="space-y-1"
                  >
                    <CheckCircle2 size={48} className="text-accent-blue mx-auto mb-2" />
                    <p className="text-3xl font-bold font-mono">100%</p>
                    <p className="text-[10px] font-mono text-ink-muted uppercase tracking-widest">Access Granted</p>
                  </motion.div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-12 h-12 border-t-2 border-r-2 border-accent-purple/30" />
                <div className="absolute -bottom-4 -left-4 w-12 h-12 border-b-2 border-l-2 border-accent-purple/30" />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: THE STAKEHOLDER’S MESSAGE */}
        <section id="message" className="relative">
          <div className="max-w-3xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-panel p-8 md:p-12 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Quote size={120} />
              </div>
              
              <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-4 text-accent-purple">
                  <div className="w-10 h-10 rounded-full bg-accent-purple/10 flex items-center justify-center">
                    <Quote size={20} />
                  </div>
                  <h2 className="font-mono text-xs uppercase tracking-[0.2em] font-bold">Stakeholder Transmission</h2>
                </div>

                <blockquote className="text-xl md:text-2xl font-light leading-relaxed italic text-ink/90">
                  "Chào Senior BA của tớ, chúc mừng cậu đã vượt qua chuỗi Logic 'hack não' để chạm đến điểm cuối cùng. Tớ biết 20 ngày qua hệ thống thỉnh thoảng có chút 'Glitch' 🗿, nhưng tất cả đều dẫn đến đây. Bước sang tuổi 30, tớ không chúc cậu thành công hơn, tớ chỉ mong cậu tìm thấy <span className="text-accent-blue font-bold not-italic">PEACE</span>. Cậu đã hoàn thành xuất sắc thử thách rồi, giờ là lúc Shut-down logic và tận hưởng thôi!"
                </blockquote>

                <div className="pt-8 border-t border-line flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple" />
                    <div>
                      <p className="text-sm font-bold">Tớ</p>
                      <p className="text-[10px] font-mono text-ink-muted uppercase tracking-widest">Project Lead / Support System</p>
                    </div>
                  </div>
                  <div className="font-mono text-[10px] text-ink-muted">
                    TIMESTAMP: 2026.03.25_02:49
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SECTION 3: THE DIGITAL ART GALLERY */}
        <section id="gallery" className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-accent-blue font-mono text-[10px] uppercase tracking-widest">
                <Database size={14} />
                Visual Data: The Core Asset
              </div>
              <h2 className="text-4xl font-bold tracking-tight">THE CORE ASSET</h2>
            </div>
            <p className="text-ink-muted font-mono text-[10px] uppercase tracking-widest md:text-right">
              FILE_TYPE: .ART_RENDER <br />
              RESOLUTION: 8K_EMOTIONAL_DEPTH
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="group relative min-h-[400px] md:min-h-[600px] w-full overflow-hidden rounded-2xl border border-line bg-white/5 flex items-center justify-center"
          >
            <img 
              src={CORE_ASSET_IMAGE} 
              alt="Digital Art Piece"
              className="max-w-full max-h-[80vh] object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-700"
              onError={(e) => {
                // Fallback if user hasn't uploaded the file yet
                (e.target as HTMLImageElement).src = "https://picsum.photos/seed/peaceful-zen/1920/1080";
              }}
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent opacity-60 pointer-events-none" />
            
            {/* Download Button */}
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <a 
                href={CORE_ASSET_IMAGE} 
                download="CORE_ASSET_PEACE.jpg"
                className="flex items-center gap-2 px-4 py-2 bg-accent-blue/20 hover:bg-accent-blue/40 border border-accent-blue/30 rounded-full text-accent-blue text-[10px] font-mono uppercase tracking-widest backdrop-blur-md transition-all"
              >
                <Download size={14} />
                Download Asset
              </a>
            </div>

            <div className="absolute bottom-0 left-0 p-8 md:p-12 space-y-4 w-full bg-gradient-to-t from-black/80 to-transparent">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-full border border-accent-blue/50 flex items-center justify-center text-accent-blue bg-background/50 backdrop-blur-sm">
                  <ImageIcon size={20} />
                </div>
                <p className="text-lg md:text-xl font-medium max-w-lg">
                  "Một bản phác thảo từ những quan sát thầm lặng. Năng lượng bình yên dành riêng cho cậu."
                </p>
              </motion.div>
            </div>

            {/* Scanning line effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <motion.div 
                animate={{ top: ["0%", "100%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 w-full h-[1px] bg-accent-blue/30 shadow-[0_0_15px_rgba(0,242,255,0.5)]"
              />
            </div>
          </motion.div>

          {/* Mobile Download Link */}
          <div className="flex justify-center pt-4">
            <a 
              href="https://drive.google.com/file/d/1ZdBJwDSxFqA2OpwxUQyBmVvuVm6VEVKl/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-blue text-[11px] font-mono uppercase tracking-widest border-b border-accent-blue/30 pb-1 hover:text-accent-purple hover:border-accent-purple transition-colors"
            >
              Tải ảnh ở đây (Google Drive)
            </a>
          </div>
        </section>

        {/* SECTION 4: REWARD MODULE - THE VOUCHER */}
        <section id="reward" className="relative py-12">
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
            <Lock size={400} />
          </div>

          <div className="max-w-2xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-purple/10 text-accent-purple text-[10px] font-mono uppercase tracking-widest border border-accent-purple/20">
                <Unlock size={12} />
                Reward Module Unlocked
              </div>
              <h2 className="text-4xl font-bold tracking-tight">LEVEL 30 REWARD</h2>
            </div>

            <motion.div 
              initial={{ opacity: 0, rotateX: 45 }}
              whileInView={{ opacity: 1, rotateX: 0 }}
              viewport={{ once: true }}
              className="relative perspective-1000"
            >
              <div className="bg-[#1a1a1a] border-2 border-line rounded-xl overflow-hidden shadow-2xl">
                {/* Ticket Header */}
                <div className="bg-line p-4 flex justify-between items-center border-b border-white/10">
                  <div className="flex items-center gap-2 font-mono text-[10px] text-ink-muted">
                    <Code2 size={14} className="text-accent-blue" />
                    QUERY_REWARD_DATA
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500/50" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                    <div className="w-2 h-2 rounded-full bg-green-500/50" />
                  </div>
                </div>

                {/* Ticket Body */}
                <div className="p-8 font-mono text-sm space-y-6 relative">
                  <div className="space-y-1">
                    <p className="text-accent-blue">SELECT <span className="text-ink">*</span> FROM <span className="text-accent-purple">Rewards</span></p>
                    <p className="text-accent-blue">WHERE <span className="text-ink">Recipient</span> = <span className="text-accent-purple">'Senior_BA'</span>;</p>
                  </div>

                  <div className="p-6 bg-black/40 rounded border border-line space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="text-[10px] text-ink-muted uppercase tracking-widest">Ticket ID</p>
                        <p className="text-accent-blue font-bold">#HBD1304</p>
                      </div>
                      <div className="px-2 py-1 bg-green-500/20 text-green-400 text-[10px] rounded border border-green-500/30 flex items-center gap-1">
                        <CheckCircle2 size={10} />
                        APPROVED
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <p className="text-[10px] text-ink-muted uppercase tracking-widest">Subject</p>
                        <p className="text-ink text-xs">🎟️ VOUCHER: UNLIMITED RECOVERY</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-ink-muted uppercase tracking-widest">Service</p>
                        <p className="text-ink text-xs">01 Recovery Session + 01 Bữa ăn/Đồ uống tùy chọn (User's Choice)</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-line/50 space-y-4">
                      <div className="flex justify-between text-xs">
                        <span className="text-ink-muted">Provider:</span>
                        <span className="text-accent-purple">[Tớ]</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-ink-muted">Term:</span>
                        <span className="text-ink text-right">Không giới hạn ngân sách. Không giới hạn thời gian (Nhưng khuyến nghị dùng khi User cần xả stress).</span>
                      </div>
                    </div>

                    <div className="pt-4 flex flex-col items-center gap-4">
                      <div className="w-full h-12 bg-white/5 rounded flex items-center justify-center overflow-hidden opacity-50">
                        {/* Mock Barcode */}
                        <div className="flex gap-1">
                          {[...Array(40)].map((_, i) => (
                            <div 
                              key={i} 
                              className="bg-ink" 
                              style={{ width: `${Math.random() * 3 + 1}px`, height: '24px' }} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-accent-blue animate-pulse uppercase tracking-[0.3em]">
                        Just send a signal when you're ready 🗿
                      </p>
                    </div>
                  </div>
                </div>

                {/* Approved Stamp Overlay */}
                <motion.div 
                  initial={{ opacity: 0, scale: 2, rotate: -20 }}
                  whileInView={{ opacity: 0.4, scale: 1, rotate: -15 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1, type: "spring" }}
                  className="absolute top-1/2 right-12 -translate-y-1/2 border-4 border-accent-blue text-accent-blue px-6 py-2 rounded-lg font-bold text-2xl uppercase tracking-widest pointer-events-none"
                >
                  Approved
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SECTION 5: SYSTEM LOG & MUSIC */}
        <section className="pt-20 border-t border-line">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 font-mono">
              <div className="flex items-center gap-2 text-ink-muted text-[10px] uppercase tracking-widest">
                <Terminal size={14} />
                System Log
              </div>
              <div className="space-y-2 text-xs">
                <p className="text-accent-blue flex items-center gap-2">
                  <ChevronRight size={14} />
                  Connection established...
                </p>
                <p className="text-accent-blue flex items-center gap-2">
                  <ChevronRight size={14} />
                  Peace mode: ON
                </p>
                <p className="text-ink-muted flex items-center gap-2">
                  <ChevronRight size={14} />
                  Logic gates: SHUTDOWN_SUCCESS
                </p>
                <p className="text-ink-muted flex items-center gap-2">
                  <ChevronRight size={14} />
                  Emotional buffer: OPTIMIZED
                </p>
              </div>
            </div>

            <div className="glass-panel p-6 flex items-center gap-6 relative overflow-hidden">
              <audio 
                ref={audioRef} 
                src={PEACE_MUSIC_FILE} 
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
                autoPlay
                loop
              />
              <button 
                onClick={togglePlay}
                className="w-16 h-16 rounded-lg bg-accent-purple/20 flex items-center justify-center text-accent-purple hover:bg-accent-purple/30 transition-colors group"
              >
                {isPlaying ? (
                  <div className="flex gap-1 items-end h-6">
                    <motion.div animate={{ height: [8, 24, 12, 20, 8] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-accent-purple" />
                    <motion.div animate={{ height: [12, 8, 24, 12, 16] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1 bg-accent-purple" />
                    <motion.div animate={{ height: [20, 12, 8, 24, 12] }} transition={{ repeat: Infinity, duration: 0.7 }} className="w-1 bg-accent-purple" />
                  </div>
                ) : (
                  <Music size={32} className="group-hover:scale-110 transition-transform" />
                )}
              </button>
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-bold">Thư giãn một chút đi nè</p>
                  <p className="text-[10px] font-mono text-accent-blue">{isPlaying ? "PLAYING" : "PAUSED"}</p>
                </div>
                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-accent-purple"
                    style={{ width: `${audioProgress}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-ink-muted">
                  <span>{audioRef.current ? Math.floor(audioRef.current.currentTime / 60).toString().padStart(2, '0') + ':' + Math.floor(audioRef.current.currentTime % 60).toString().padStart(2, '0') : "00:00"}</span>
                  <span>PEACE_STATION</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Birthday Greeting Section */}
      <section className="py-20 text-center space-y-6 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          onViewportEnter={startConfetti}
          onViewportLeave={stopConfetti}
          viewport={{ amount: 0.3 }}
          className="space-y-4 px-4"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-ink">
            🎂 CHÚC MỪNG SINH NHẬT QUANG HUY 🥳🎈
          </h2>
          <p className="text-accent-blue font-mono text-[9px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.4em] animate-pulse break-words max-w-xs mx-auto">
            SYSTEM_CELEBRATION_SEQUENCE_ACTIVE
          </p>
        </motion.div>
      </section>

      <footer className="py-12 border-t border-line bg-black/20">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-mono text-ink-muted uppercase tracking-widest">
          <p>© 2026 PROJECT HPD HARRY // ALL LOGIC RESERVED</p>
          <div className="flex items-center gap-6">
            <span className="text-accent-blue">Status: Stable</span>
            <span>Uptime: 30 Years</span>
            <span className="text-accent-purple">🗿 Glitch Level: 0%</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
