"use client";

import { useCacheFetch } from "@/hooks/useCacheFetch";
import { useState, useEffect } from "react";
import { Layout, Palette, Monitor, Rocket, ArrowRight, Settings, Share2, Eye, Instagram, Facebook, Twitter, Youtube, MessageCircle, Link as LinkIcon, Globe, Save, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useUI } from "@/components/ui/UIProvider";

const Skeleton = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-white/5 rounded-xl ${className}`} />
);

const SocialInput = ({ platform, value, onChange, onRemove, validateLink }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 10, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
    className="group relative"
  >
    <div className="flex items-center justify-between mb-2 ml-1">
      <div className="flex items-center gap-2">
        <div className={`${platform.color} opacity-80 scale-75 md:scale-100`}>{platform.icon}</div>
        <label className="text-[9px] md:text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">{platform.label}</label>
      </div>
      <button
        onClick={onRemove}
        className="w-7 h-7 md:w-8 md:h-8 bg-white/5 hover:bg-red-500/20 text-gray-500 hover:text-red-500 rounded-lg flex items-center justify-center transition-all"
      >
        <X className="w-3.5 h-3.5 md:w-4 md:h-4" />
      </button>
    </div>
    <input
      type="text"
      autoFocus={!value}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={platform.placeholder}
      className={`w-full bg-slate-50 dark:bg-black/40 border ${value && !validateLink(platform.id, value) ? 'border-red-500/50' : 'border-slate-200 dark:border-white/5'} rounded-xl py-3 md:py-4 px-4 md:px-6 text-[10px] md:text-xs text-slate-900 dark:text-white focus:border-blue-500/50 outline-none transition-all group-hover:bg-slate-100 dark:group-hover:bg-black/60`}
    />
    {value && !validateLink(platform.id, value) && (
      <p className="text-[7px] font-bold text-red-500 uppercase tracking-widest mt-1.5 ml-1">Domain tidak sesuai ({platform.placeholder.split('/')[2]})</p>
    )}
  </motion.div>
);

export default function StorefrontSettings() {
  const router = useRouter();
  const { showToast } = useUI();
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [socialLinks, setSocialLinks] = useState<any>({});
  const [activePlatforms, setActivePlatforms] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const platforms = [
    { id: "instagram", label: "Instagram", icon: <img src="/instagram.png" className="w-6 h-6 object-contain" />, color: "text-pink-500", bg: "bg-pink-500/10", placeholder: "https://instagram.com/username" },
    { id: "facebook", label: "Facebook", icon: <img src="/facebook.png" className="w-6 h-6 object-contain" />, color: "text-blue-500", bg: "bg-blue-500/10", placeholder: "https://facebook.com/username" },
    { id: "tiktok", label: "TikTok", icon: <img src="/tiktok.png" className="w-6 h-6 object-contain" />, color: "text-slate-900 dark:text-white", bg: "bg-black/5 dark:bg-white/10", placeholder: "https://tiktok.com/@username" },
    { id: "twitter", label: "Twitter / X", icon: <img src="/twitter.png" className="w-6 h-6 object-contain" />, color: "text-sky-400", bg: "bg-sky-400/10", placeholder: "https://twitter.com/username" },
    { id: "youtube", label: "YouTube", icon: <img src="/youtube.png" className="w-6 h-6 object-contain" />, color: "text-red-500", bg: "bg-red-500/10", placeholder: "https://youtube.com/@channel" },
    { id: "whatsapp", label: "WhatsApp", icon: <img src="/whatsapp.png" className="w-6 h-6 object-contain" />, color: "text-green-500", bg: "bg-green-500/10", placeholder: "https://wa.me/number" }
  ];

  // Fetch current profile with Smart Cache
  const { data: cachedProfile, loading: profileLoading } = useCacheFetch<any>("/api/profile", "client_profile");

  useEffect(() => {
    if (cachedProfile) {
      setClient(cachedProfile);
      if (cachedProfile.socialLinks) {
        setSocialLinks(cachedProfile.socialLinks);
        const active = Object.keys(cachedProfile.socialLinks).filter(key => cachedProfile.socialLinks[key] && key !== 'whatsapp');
        setActivePlatforms(active);
      }
    }
    setLoading(profileLoading);
  }, [cachedProfile, profileLoading]);

  useEffect(() => {
    // Initial fetch handled by useCacheFetch
  }, []);

  const handleAddPlatform = (id: string) => {
    if (!activePlatforms.includes(id)) {
      setActivePlatforms([...activePlatforms, id]);
    }
  };

  const handleRemovePlatform = (id: string) => {
    setActivePlatforms(activePlatforms.filter(p => p !== id));
    const newLinks = { ...socialLinks };
    delete newLinks[id];
    setSocialLinks(newLinks);
  };

  const validateLink = (id: string, value: string) => {
    if (!value) return true;
    const platformDomains: any = {
      instagram: /instagram\.com/i,
      facebook: /facebook\.com|fb\.com/i,
      tiktok: /tiktok\.com/i,
      twitter: /twitter\.com|x\.com/i,
      youtube: /youtube\.com|youtu\.be/i
    };
    return platformDomains[id] ? platformDomains[id].test(value) : true;
  };

  const handleSaveSocial = async () => {
    if (!client) return;

    // Check for invalid links before saving
    const invalidPlatforms = activePlatforms.filter(p => p !== 'whatsapp' && socialLinks[p] && !validateLink(p, socialLinks[p]));
    if (invalidPlatforms.length > 0) {
      const names = invalidPlatforms.map(p => platforms.find(x => x.id === p)?.label).join(", ");
      showToast(`Format link untuk ${names} sepertinya salah. Pastikan menyertakan domain yang benar.`, "error");
      return;
    }

    setIsSaving(true);
    try {
      const filteredLinks: any = {};
      activePlatforms.forEach(p => {
        if (p === 'whatsapp') {
          filteredLinks[p] = `https://wa.me/${client.phone}`;
        } else if (socialLinks[p]) {
          filteredLinks[p] = socialLinks[p];
        }
      });

      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: client.id,
          socialLinks: filteredLinks
        }),
      });

      if (!res.ok) throw new Error("Gagal simpan");
      showToast("Pengaturan sosial media disimpan!", "success");
    } catch (err) {
      showToast("Gagal menyimpan pengaturan.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return (
    <div className="space-y-6 md:space-y-10 pb-20">
      <Skeleton className="h-[150px] md:h-[200px] w-full rounded-2xl" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <Skeleton className="h-[300px] md:h-[400px] w-full rounded-xl md:rounded-2xl" />
        <Skeleton className="h-[300px] md:h-[400px] w-full rounded-xl md:rounded-2xl" />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 md:space-y-10 pb-20 max-w-full overflow-x-hidden">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 bg-slate-50 dark:bg-white/5 p-4 md:p-10 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] -mr-32 -mt-32"></div>
        <div className="relative z-10 w-full md:w-auto">
          <h2 className="text-lg md:text-xl font-black text-slate-950 dark:text-white tracking-tighter uppercase italic drop-shadow-sm">Storefront Builder</h2>
          <div className="h-1 w-12 bg-blue-600 mt-2 mb-3 rounded-full" />
          <p className="text-[10px] md:text-xs text-slate-700 dark:text-gray-500 uppercase tracking-widest font-black opacity-90">Tampilan & Identitas Toko Anda.</p>
        </div>
        <div className="flex flex-row items-center gap-2 w-full md:w-auto relative z-10">
          <button
            onClick={() => window.open(`https://${client?.slug}.stockysee.com`, "_blank")}
            className="flex-1 md:w-auto px-4 py-3 md:px-6 md:py-3.5 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-900 dark:text-white rounded-xl text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 md:gap-3 border border-slate-200 dark:border-white/10"
          >
            <Eye className="w-3.5 h-3.5 md:w-4 md:h-4" /> <span className="xs:inline">Toko</span>
          </button>
          <button
            onClick={() => router.push("/dashboard/storefront/builder")}
            className="flex-1 md:w-auto px-4 py-3 md:px-8 md:py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[8px] md:text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] transition-all flex items-center justify-center gap-2 md:gap-3 shadow-xl shadow-blue-600/30 active:scale-95"
          >
            ✨ <span className="xs:inline">Editor</span> <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </button>
        </div>
      </div>      {/* FULL WIDTH SOCIAL MEDIA SECTION */}
      <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 md:p-10 space-y-8 shadow-sm dark:shadow-none">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
              <Share2 className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <h3 className="text-[12px] md:text-sm font-black text-slate-950 dark:text-white uppercase tracking-widest">Social Media Footer</h3>
              <p className="text-[7px] md:text-[9px] text-slate-700 dark:text-gray-500 font-bold uppercase tracking-widest mt-1">salin link profile anda dari halaman profile di setiap akun</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left: Platform Selection */}
          <div className="w-full lg:w-1/4 space-y-4">
            <h4 className="text-[8px] md:text-[9px] font-black text-slate-600 dark:text-gray-500 uppercase tracking-widest ml-1">Klik untuk Menambah:</h4>
            <div className="grid grid-cols-5 lg:grid-cols-3 gap-3">
              {platforms.filter(p => p.id !== 'whatsapp').map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleAddPlatform(p.id)}
                  disabled={activePlatforms.includes(p.id)}
                  className={`flex flex-col items-center gap-2 transition-all group ${activePlatforms.includes(p.id) ? 'opacity-20 grayscale' : 'hover:scale-110 active:scale-95'}`}
                >
                  <div className={`w-full aspect-square ${p.bg} ${p.color} rounded-lg md:rounded-xl flex items-center justify-center border border-slate-200 dark:border-white/5 group-hover:border-blue-500/30 transition-all`}>
                    {p.icon}
                  </div>
                  <span className="text-[7px] md:text-[8px] font-bold text-slate-700 dark:text-gray-500 uppercase truncate w-full text-center">{p.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right: 3-Column Grid for Inputs (Desktop) */}
          <div className="flex-1">
            <AnimatePresence mode="popLayout">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                {/* Always First: Static WhatsApp */}
                <div className="group relative opacity-70">
                  <div className="flex items-center justify-between mb-2 ml-1">
                    <div className="flex items-center gap-2">
                      <div className="text-green-500 opacity-80 scale-75 md:scale-100">
                        <img src="/whatsapp.png" className="w-6 h-6 object-contain" />
                      </div>
                      <label className="text-[9px] md:text-[10px] font-black text-slate-950 dark:text-white uppercase tracking-widest">WhatsApp (Default)</label>
                    </div>
                    <span className="text-[7px] font-black text-slate-700 dark:text-gray-600 uppercase tracking-widest mr-2">Locked</span>
                  </div>
                  <input
                    type="text"
                    disabled
                    value={`https://wa.me/${client?.phone || "number"}`}
                    className="w-full bg-slate-100 dark:bg-black/20 border border-slate-300 dark:border-white/5 rounded-xl py-3 md:py-4 px-4 md:px-6 text-[10px] md:text-xs text-slate-800 dark:text-gray-500 cursor-not-allowed font-bold"
                  />
                </div>

                {/* Other Active Platforms */}
                {activePlatforms.map((platformId) => {
                  const p = platforms.find(x => x.id === platformId)!;
                  if (platformId === 'whatsapp') return null;
                  return <SocialInput key={platformId} platform={p} value={socialLinks[platformId]} onChange={(val: any) => setSocialLinks({ ...socialLinks, [platformId]: val })} onRemove={() => handleRemovePlatform(platformId)} validateLink={validateLink} />;
                })}

                {/* Empty Slots for Balance - Only show if not all platforms added */}
                {activePlatforms.length < (platforms.length - 1) && (
                  <div className="hidden lg:flex h-full min-h-[100px] items-center justify-center border-2 border-dashed border-slate-200 dark:border-white/5 rounded-2xl">
                    <p className="text-[7px] font-black uppercase tracking-[0.2em] text-slate-600 dark:text-gray-400">Ready for link</p>
                  </div>
                )}
              </div>
            </AnimatePresence>
          </div>
        </div>

        {/* Compact Save Button at Bottom Right (Mobile focused) */}
        <div className="flex justify-end pt-4">
          <button
            onClick={handleSaveSocial}
            disabled={isSaving}
            className="w-auto px-6 py-3 md:px-10 md:py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 text-white rounded-xl flex items-center justify-center gap-2 md:gap-3 transition-all shadow-lg shadow-blue-600/20 active:scale-95 border border-white/10"
          >
            {isSaving ? <Loader2 className="w-3 h-3 md:w-4 md:h-4 animate-spin" /> : <Save className="w-3 h-3 md:w-4 md:h-4" />}
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Simpan Perubahan</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
        {/* Left Side: Layout Config (30%) */}
        <div className="w-full lg:w-[30%] bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 md:p-8 space-y-6 md:space-y-8 flex flex-col h-full shadow-sm dark:shadow-none">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-500">
              <Layout className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <h3 className="text-[12px] md:text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Header & Style</h3>
              <p className="text-[8px] md:text-[9px] text-slate-500 dark:text-gray-500 font-bold uppercase tracking-widest mt-1">Navigasi Toko</p>
            </div>
          </div>

          <div className="flex-1 space-y-4 md:space-y-6">
            <div className="p-4 md:p-8 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-xl md:rounded-2xl hover:bg-slate-100 dark:hover:bg-black/40 transition-all">
              <h4 className="text-[8px] md:text-[9px] font-black text-slate-500 dark:text-gray-400 uppercase tracking-[0.2em] mb-3 md:mb-6">Header Style</h4>
              <div className="flex gap-3">
                <div className="px-3 py-2 md:px-4 md:py-2.5 bg-blue-600 text-white text-[8px] md:text-[9px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-blue-600/20">Minimalist Default</div>
              </div>
              <p className="text-[8px] md:text-[9px] text-slate-600 dark:text-gray-600 font-bold uppercase tracking-widest mt-3 md:mt-6 italic leading-relaxed">Mode sticky dengan backdrop blur aktif.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Visual Editor (70%) */}
        <div className="w-full lg:w-[70%] bg-gradient-to-br from-blue-600/10 to-purple-600/10 dark:from-blue-600/20 dark:to-purple-600/20 border border-blue-200 dark:border-white/10 rounded-2xl p-8 md:p-12 flex flex-col items-center justify-center text-center space-y-6 md:space-y-8 relative overflow-hidden group shadow-sm dark:shadow-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 blur-[120px] rounded-full -mr-48 -mt-48 group-hover:bg-white/10 transition-all duration-700"></div>
          <Rocket className="w-12 h-12 md:w-16 md:h-16 text-blue-600 dark:text-white mb-1 md:mb-2 relative z-10 animate-bounce-slow" />
          <div className="max-w-xl space-y-3 md:space-y-4 relative z-10">
            <h3 className="text-xl md:text-3xl font-black text-slate-950 dark:text-white uppercase tracking-tighter italic drop-shadow-sm">Visual Page Builder</h3>
            <p className="text-slate-700 dark:text-white/80 text-[11px] md:text-sm font-black leading-relaxed max-w-sm mx-auto uppercase tracking-widest opacity-80">Susun komponen secara real-time dengan teknologi yang intuitif.</p>
          </div>
          <button
            onClick={() => router.push("/dashboard/storefront/builder")}
            className="w-full sm:w-auto px-10 py-5 bg-white dark:bg-white text-black border-2 border-slate-200 dark:border-none rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-2xl relative z-10"
          >
            🚀 Buka Visual Editor
          </button>
        </div>
      </div>
    </div>
  );
}
