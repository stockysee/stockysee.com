"use client";

import React, { useState, useEffect } from "react";
import { useUI } from "@/components/ui/UIProvider";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Client {
  id: string;
  name: string; // Business Name
  slug: string;
  plan: string;
  status: string;
  hasChatbot: boolean;
  themeId: string;
  createdAt: string;
  _count?: { products: number };

  // Profiling
  ownerName?: string;
  email?: string;
  phone?: string;
  password?: string;
  customDomain?: string;
  logoUrl?: string;
  ktpUrl?: string;
  qrisUrl?: string;
  bankAccounts?: any;
  referralLimit?: number;
  lastVerificationAt?: string | null;
}

export default function AdminPanel() {
  const { showToast, showConfirm } = useUI();
  const [activeTab, setActiveTab] = useState("home");
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [verificationRequests, setVerificationRequests] = useState<any[]>([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('edit');
  const [editingClient, setEditingClient] = useState<Partial<Client> | null>(null);
  const [originalClient, setOriginalClient] = useState<Partial<Client> | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [impersonateLoading, setImpersonateLoading] = useState<string | null>(null);
  const [viewingReceiptUrl, setViewingReceiptUrl] = useState<string | null>(null);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [selectedVerificationGroup, setSelectedVerificationGroup] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [editingBankIndex, setEditingBankIndex] = useState<number | null>(null);
  const [tempBankData, setTempBankData] = useState<any>(null);
  const [platformAccounts, setPlatformAccounts] = useState<any[]>([]);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem("stockysee_theme") as 'dark' | 'light';
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem("stockysee_theme", newTheme);
    if (newTheme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  // Bank Modal State
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [editingBank, setEditingBank] = useState<any | null>(null);
  const [bankFormData, setBankFormData] = useState({
    name: '',
    accountNumber: '',
    accountOwner: '',
    logoUrl: '',
    type: 'bank'
  });

  const fetchData = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const [clientsRes, invoicesRes, verificationRes, platformAccountsRes] = await Promise.all([
        fetch("/api/admin/clients"),
        fetch("/api/admin/invoices"),
        fetch("/api/admin/verification"),
        fetch("/api/admin/platform-accounts")
      ]);

      if (clientsRes.status === 401) {
        setError("UNAUTHORIZED");
        return;
      }

      if (clientsRes.ok) {
        const data = await clientsRes.json();
        setClients(data);
      } else {
        const err = await clientsRes.json();
        setError(err.error || "Gagal memuat daftar client");
        return;
      }

      if (invoicesRes.ok) {
        const data = await invoicesRes.json();
        setInvoices(data);
      }

      if (verificationRes.ok) {
        const data = await verificationRes.json();
        setVerificationRequests(data);
      } else {
        const err = await verificationRes.json();
        setError(err.error || "Gagal memuat data verifikasi");
        return;
      }

      if (platformAccountsRes.ok) {
        const data = await platformAccountsRes.json();
        setPlatformAccounts(data);
      }

      setError(null);
    } catch (err) {
      console.error(err);
      setError("Kesalahan koneksi ke server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Inisialisasi Realtime Listener (Ganti Polling)
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'Client' },
        () => {
          console.log('[Realtime] Client table changed, syncing...');
          fetchData(true); // Kirim flag silent refresh
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'Invoice' },
        () => {
          console.log('[Realtime] Invoice table changed, syncing...');
          fetchData(true);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'VerificationRequest' },
        () => {
          console.log('[Realtime] VerificationRequest table changed, syncing...');
          fetchData(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const savePlatformAccounts = async (newAccounts: any[]) => {
    console.log('[Admin] Attempting to save platform accounts:', newAccounts.length, 'accounts');
    console.log("Saving Platform Accounts:", newAccounts);
    try {
      const res = await fetch("/api/admin/platform-accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAccounts)
      });
      const result = await res.json();
      console.log("Save Result:", result);

      if (res.ok) {
        showToast("Pengaturan pembayaran disimpan", "success");
        fetchData();
      } else {
        showToast("Gagal menyimpan: " + (result.error || "Unknown error"), "error");
      }
    } catch (err) {
      console.error("Save Error:", err);
      showToast("Terjadi kesalahan koneksi", "error");
    }
  };

  const handleApproveInvoice = async (invoiceId: string) => {
    showConfirm({
      title: "Konfirmasi Pembayaran",
      message: "Apakah Anda ingin menyetujui pembayaran ini secara manual? Status akan langsung menjadi PAID.",
      confirmText: "Ya, Setujui",
      onConfirm: async () => {
        try {
          const res = await fetch("/api/admin/invoices", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ invoiceId, status: "PAID" }),
          });
          if (res.ok) {
            showToast("Invoice berhasil disetujui", "success");
            fetchData();
          } else {
            showToast("Gagal menyetujui invoice", "error");
          }
        } catch (err) {
          showToast("Terjadi kesalahan koneksi", "error");
        }
      }
    });
  };

  const handleEdit = (client: any) => {
    setModalMode('edit');
    setEditingClient(client);
    setOriginalClient(JSON.parse(JSON.stringify(client))); // Deep copy
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setModalMode('add');
    const newClient = {
      name: "",
      slug: "",
      plan: "BASIC",
      status: "ACTIVE",
      themeId: "1",
      ownerName: "",
      email: "",
      phone: "",
      password: "",
      hasChatbot: false,
      bankAccounts: [],
    };
    setEditingClient(newClient);
    setOriginalClient(JSON.parse(JSON.stringify(newClient)));
    setIsModalOpen(true);
  };

  const isDataChanged = () => {
    if (!editingClient || !originalClient) return false;
    return JSON.stringify(editingClient) !== JSON.stringify(originalClient);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[Admin] Attempting to save client:', editingClient?.name);
    if (!editingClient) return;

    setUpdateLoading(true);
    try {
      const url = modalMode === 'add' ? "/api/admin/clients" : `/api/admin/clients/${editingClient.id}`;
      const method = modalMode === 'add' ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingClient),
      });

      if (res.ok) {
        console.log('[Admin] Client saved successfully');
        showToast(modalMode === 'add' ? "Akun berhasil dibuat!" : "Data berhasil diperbarui!", "success");
        setOriginalClient(JSON.parse(JSON.stringify(editingClient))); // Sync original state
        setIsModalOpen(false);
        fetchData();
      } else {
        const errData = await res.json();
        showToast(`Gagal: ${errData.error || 'Terjadi kesalahan'}`, "error");
      }
    } catch (err) {
      showToast("Gagal menyimpan data!", "error");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleImpersonate = async (clientId: string) => {
    setImpersonateLoading(clientId);
    try {
      const res = await fetch("/api/admin/impersonate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId }),
      });
      if (res.ok) {
        const data = await res.json();
        const redirectUrl = `${data.redirect}?t=${Date.now()}`;
        showToast("Membuka sesi client...", "info");
        window.open(redirectUrl, "_blank");
      } else {
        showToast("Gagal melakukan impersonasi.", "error");
      }
    } catch (err) {
      showToast("Terjadi kesalahan sistem.", "error");
    } finally {
      setImpersonateLoading(null);
    }
  };

  const handleBatchProcessVerification = async (requests: any[], status: 'APPROVED' | 'REJECTED', message?: string) => {
    setIsProcessing(true);
    try {
      for (const req of requests) {
        const res = await fetch("/api/admin/verification", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ requestId: req.id, status, message }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.details || errData.error || "Gagal memproses pengajuan");
        }
      }

      showToast(status === 'APPROVED' ? "Semua pengajuan disetujui!" : "Pengajuan ditolak.", "success");
      setIsVerificationModalOpen(false);
      fetchData();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Terjadi kesalahan sistem", "error");
      fetchData();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!editingClient?.id) return;
    console.log('[Admin] Attempting to delete client:', editingClient.name);
    showConfirm({
      title: "Hapus Akun",
      message: `Apakah Anda yakin ingin menghapus akun ${editingClient.name} secara permanen? Semua data produk dan transaksi akan ikut terhapus.`,
      variant: "danger",
      onConfirm: async () => {
        try {
          setUpdateLoading(true);
          const res = await fetch(`/api/admin/clients/${editingClient.id}`, { method: "DELETE" });
          if (res.ok) {
            showToast("Akun berhasil dihapus", "success");
            setIsModalOpen(false);
            fetchData();
          } else {
            showToast("Gagal menghapus akun", "error");
          }
        } catch (err) {
          showToast("Terjadi kesalahan sistem", "error");
        } finally {
          setUpdateLoading(false);
        }
      }
    });
  };

  const renderInvoicesTab = () => (
    <div className={`${theme === 'dark' ? 'bg-zinc-900/30 border-white/5' : 'bg-white border-slate-200 shadow-sm'} border rounded-2xl overflow-hidden animate-in fade-in duration-500`}>
      <div className={`px-8 py-6 border-b ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
        <h3 className="text-sm font-black uppercase tracking-widest text-blue-500">Transaction History</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-white/[0.02]">
            <tr className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
              <th className="px-8 py-6">Invoice ID</th>
              <th className="px-8 py-6">Client</th>
              <th className="px-8 py-6">Amount</th>
              <th className="px-8 py-6">Status</th>
              <th className="px-8 py-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {invoices.map(inv => (
              <tr key={inv.id} className={`${theme === 'dark' ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50'} transition-all`}>
                <td className={`px-8 py-6 font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>#{inv.id.slice(-6).toUpperCase()}</td>
                <td className="px-8 py-6">
                  <p className={`font-bold ${theme === 'dark' ? 'text-zinc-300' : 'text-slate-700'}`}>{inv.client?.name}</p>
                  <p className="text-[10px] text-zinc-500">{inv.client?.email}</p>
                </td>
                <td className={`px-8 py-6 font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Rp {inv.amount.toLocaleString()}</td>
                <td className="px-8 py-6">
                  <span className={`text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${inv.status === 'PAID' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                      'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                    }`}>
                    {inv.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-3">
                    {inv.receiptUrl && inv.receiptUrl !== "AI_VERIFIED" && (
                      <button
                        onClick={() => setViewingReceiptUrl(inv.receiptUrl)}
                        className="bg-blue-600/10 hover:bg-blue-600 text-blue-500 hover:text-white text-[10px] font-black px-4 py-2 rounded-xl transition-all uppercase tracking-widest border border-blue-500/20"
                      >
                        Lihat Foto
                      </button>
                    )}
                    {inv.status !== 'PAID' && inv.client?.status !== 'ACTIVE' && (
                      <button onClick={() => handleApproveInvoice(inv.id)} className="bg-green-600/10 hover:bg-green-600 text-green-500 hover:text-white text-[10px] font-black px-4 py-2 rounded-xl transition-all uppercase tracking-widest border border-green-500/20">
                        Approve
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderVerificationTab = () => {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
        <div className={`${theme === 'dark' ? 'bg-zinc-900/30 border-white/5' : 'bg-white border-slate-200 shadow-sm'} border rounded-2xl p-8`}>
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-blue-500">Verification Hub</h3>
              <span className="bg-blue-500/10 text-blue-500 border border-blue-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                {verificationRequests.length} PENDING
              </span>
              <button 
                onClick={() => fetchData()} 
                disabled={!!loading || !!error}
                className="p-3 hover:bg-white/5 rounded-xl transition-all text-zinc-500 hover:text-white border border-white/5"
                title="Refresh Manual"
              >
                🔄
              </button>
            </div>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Bank & Identity Review</p>
          </div>

          <div className="space-y-4">
            {(() => {
              const groups: Record<string, any> = {};
              verificationRequests.forEach(req => {
                if (!groups[req.clientId]) {
                  groups[req.clientId] = {
                    clientId: req.clientId,
                    client: req.client,
                    requests: [],
                    createdAt: req.createdAt
                  };
                }
                groups[req.clientId].requests.push(req);
                if (new Date(req.createdAt) > new Date(groups[req.clientId].createdAt)) {
                  groups[req.clientId].createdAt = req.createdAt;
                }
              });

              const groupedList = Object.values(groups).sort((a: any, b: any) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              );

              if (groupedList.length === 0) {
                return <p className="text-center text-zinc-600 py-20 text-sm italic">Tidak ada pengajuan verifikasi baru...</p>;
              }

              return groupedList.map((group: any) => (
                <div
                  key={group.clientId}
                  onClick={() => {
                    setSelectedVerificationGroup(group);
                    setRejectReason("");
                    setIsVerificationModalOpen(true);
                  }}
                  className={`p-4 ${theme === 'dark' ? 'bg-white/[0.02] border-white/5' : 'bg-white border-slate-200 shadow-sm'} border rounded-xl hover:border-blue-500/30 transition-all flex flex-col gap-4 cursor-pointer group`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center text-xl border border-white/5 group-hover:border-blue-500/50 transition-all">
                        {group.requests.some((r: any) => r.type === 'IDENTITY') ? '🪪' : '🏦'}
                      </div>
                      <div>
                        <p className={`text-sm font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{group.client?.name || 'Unknown'}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {group.requests.map((r: any) => (
                            <span key={r.id} className="text-[7px] font-black px-1.5 py-0.5 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded uppercase tracking-widest">
                              {r.type}
                            </span>
                          ))}
                          <span className="text-[9px] text-zinc-600 font-bold ml-1">• {new Date(group.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <button className="px-4 py-1.5 bg-white/5 text-zinc-500 border border-white/5 rounded-lg text-[9px] font-black uppercase tracking-widest group-hover:bg-blue-600 group-hover:text-white transition-all">
                      Review
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pointer-events-none">
                    <div className="bg-black/20 p-3 rounded-lg border border-white/5 flex items-center gap-3">
                      <p className="text-[7px] font-black text-zinc-600 uppercase tracking-widest">Assets:</p>
                      <div className="flex gap-2">
                        {(() => {
                           if (group.requests.length > 0) console.log("[Admin] Group Requests for", group.client?.name, group.requests);
                           return group.requests.map((r: any) => (
                            <React.Fragment key={r.id}>
                              {r.ktpUrl && <img src={r.ktpUrl} className="w-20 h-12 object-cover rounded-lg border border-white/10 shadow-lg" alt="KTP" />}
                              {r.qrisUrl && <img src={r.qrisUrl} className="w-20 h-12 object-cover rounded-lg border border-white/10 shadow-lg" alt="QRIS" />}
                            </React.Fragment>
                           ));
                        })()}
                      </div>
                    </div>

                    <div className="bg-black/20 p-3 rounded-lg border border-white/5 flex items-center">
                      <p className="text-[9px] font-bold text-zinc-500 italic">
                        {group.requests.length} pending review(s)
                      </p>
                    </div>
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      </div>
    );
  };

  const renderSettingsTab = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className={`flex justify-between items-center ${theme === 'dark' ? 'bg-zinc-900/30 border-white/5' : 'bg-white border-slate-200 shadow-sm'} border p-8 rounded-2xl`}>
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-blue-500">Platform Payout Settings</h3>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Kelola rekening tujuan untuk pendaftaran client baru.</p>
        </div>
        <button
          onClick={() => {
            setEditingBank(null);
            setBankFormData({ name: '', accountNumber: '', accountOwner: '', logoUrl: '', type: 'bank' });
            setIsBankModalOpen(true);
          }}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20"
        >
          + Tambah Rekening
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {platformAccounts.map(acc => (
          <div key={acc.id} className={`group relative p-6 ${theme === 'dark' ? 'bg-zinc-900/30 border-white/5' : 'bg-white border-slate-200 shadow-sm'} border rounded-2xl hover:border-blue-500/50 transition-all overflow-hidden`}>
            <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
              <button
                onClick={() => {
                  setEditingBank(acc);
                  setBankFormData({ ...acc });
                  setIsBankModalOpen(true);
                }}
                className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-500 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all border border-blue-500/20"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
              </button>
              <button
                onClick={() => {
                  if (confirm("Hapus rekening ini dari platform?")) {
                    const newAccs = platformAccounts.filter(a => a.id !== acc.id);
                    setPlatformAccounts(newAccs);
                    savePlatformAccounts(newAccs);
                  }
                }}
                className="w-10 h-10 rounded-xl bg-red-600/10 text-red-500 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all border border-red-500/20"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
              </button>
            </div>

            <div className="flex items-center gap-5 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-2xl p-2.5 overflow-hidden">
                {acc.logoUrl ? <img src={acc.logoUrl} className="w-full h-full object-contain" /> : '🏦'}
              </div>
              <div>
                <h4 className="text-lg font-black text-white tracking-tight">{acc.name}</h4>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <p className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-1.5">Nomor Rekening</p>
                <p className="text-base font-black text-white font-mono tracking-widest">{acc.accountNumber}</p>
              </div>
              <div>
                <p className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-1.5">Atas Nama</p>
                <p className="text-sm font-black text-white uppercase tracking-tight">{acc.accountOwner}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "home":
        const pendingClients = clients.filter(c => (c as any).status === "PENDING" || (c as any).status === "PAID");
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-black uppercase tracking-widest flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-3 animate-pulse"></span>
                    Need Your Approval
                  </h3>
                  <div className="bg-orange-500/10 text-orange-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border border-orange-500/20">
                    {pendingClients.length} Antrean
                  </div>
                </div>
                <div className="space-y-4">
                  {pendingClients.length === 0 ? (
                    <p className="text-center text-zinc-600 italic py-10 text-sm">Tidak ada pendaftaran baru yang menunggu...</p>
                  ) : (
                    pendingClients.map(c => (
                      <div key={c.id} className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:border-blue-600/30 transition-all group">
                        <div className="flex items-center space-x-6">
                          <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center overflow-hidden border border-white/5">
                            {c.logoUrl ? (
                              <img src={c.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                            ) : (
                              <span className="text-xl">🏪</span>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-3">
                              <p className="text-sm font-bold text-white">{c.name}</p>
                              {c.status === 'PAID' && (
                                <span className="px-2 py-0.5 bg-green-500/20 text-green-500 text-[8px] font-black rounded-md border border-green-500/30 animate-pulse">
                                  PAID (AI OK)
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-3 mt-1">
                              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">{c.plan} PLAN</p>
                              <span className="text-[10px] text-blue-500 font-bold">
                                {c.plan !== 'BASIC' && c.customDomain ? c.customDomain : `${c.slug}.stockysee.com`}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-3">
                          <button onClick={() => handleEdit(c)} className="text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:text-white transition-all px-4 py-2">Detail</button>
                          <button
                            onClick={() => {
                              showConfirm({
                                title: "Aktivasi Toko",
                                message: `Apakah Anda yakin ingin mengaktifkan toko ${c.name}? Client akan bisa mengakses dashboard mereka.`,
                                onConfirm: async () => {
                                  const res = await fetch(`/api/admin/clients/${c.id}`, {
                                    method: "PATCH",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ status: "ACTIVE" }),
                                  });
                                  if (res.ok) {
                                    showToast("Toko berhasil diaktifkan", "success");
                                    fetchData();
                                  } else {
                                    showToast("Gagal mengaktifkan toko", "error");
                                  }
                                }
                              });
                            }}
                            className="bg-green-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-500 transition-all shadow-lg shadow-green-600/20"
                          >
                            APPROVE
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            <div className="lg:col-span-4 space-y-8">
              <div className={`${theme === 'dark' ? 'bg-zinc-900/30 border-white/5' : 'bg-white border-slate-200 shadow-sm'} border rounded-2xl p-8 h-full min-h-[400px] flex flex-col items-center justify-center text-center relative overflow-hidden group`}>
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                <div className="w-16 h-16 bg-blue-600/10 rounded-full flex items-center justify-center mb-6 border border-blue-500/20">
                  <div className="w-8 h-8 bg-blue-600/20 rounded-full animate-ping"></div>
                  <span className="absolute text-xl">📡</span>
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white mb-2">System Radar</h3>
                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Global Traffic Monitoring</p>
                <div className="mt-8 pt-8 border-t border-white/5 w-full space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] font-black text-zinc-600 uppercase">Uptime</span>
                    <span className="text-[8px] font-black text-green-500 uppercase">99.9%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] font-black text-zinc-600 uppercase">Load</span>
                    <span className="text-[8px] font-black text-blue-500 uppercase">Normal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "invoices":
        return renderInvoicesTab();
      case "manage":
        return (
          <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Header Area */}
            <div className={`flex justify-between items-end ${theme === 'dark' ? 'bg-zinc-900/20 border-white/5' : 'bg-white border-slate-200 shadow-sm'} border p-8 rounded-2xl`}>
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Client List</h3>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em] mt-1">Total Managed Instances: {clients.length}</p>
              </div>
              <button
                onClick={handleAdd}
                className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black px-8 py-3.5 rounded-xl transition-all uppercase tracking-widest shadow-xl shadow-blue-600/20 active:scale-95"
              >
                + ADD AKUN
              </button>
            </div>

            <div className={`${theme === 'dark' ? 'bg-zinc-950/50 border-white/5' : 'bg-white border-slate-200 shadow-md'} border rounded-2xl overflow-hidden shadow-2xl`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-white/[0.02] border-b border-white/5">
                    <tr className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                      <th className="px-8 py-5">Identity</th>
                      <th className="px-8 py-5">Tier</th>
                      <th className="px-8 py-5">Status</th>
                      <th className="px-8 py-5 text-right">Control</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {clients.filter(c => c.status !== 'PENDING' && c.status !== 'PAID').map(c => (
                      <tr
                        key={c.id}
                        onClick={() => handleEdit(c)}
                        className="group hover:bg-white/[0.02] transition-all cursor-pointer"
                      >
                        <td className="px-8 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:border-blue-500/30 transition-all">
                              {c.logoUrl ? (
                                <img src={c.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                              ) : (
                                <span className="text-xs">🖼️</span>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{c.name}</p>
                              <p className="text-[10px] text-zinc-500 font-bold tracking-tight lowercase opacity-60">
                                {c.plan !== 'BASIC' && c.customDomain ? c.customDomain : `${c.slug}.stockysee.com`}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          <span className={`text-[9px] font-black px-3 py-1 rounded-md uppercase tracking-tighter ${c.plan === 'PREMIUM' || c.plan === 'STANDARD_PRO' || c.plan === 'BASIC_PLUS' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                            c.plan === 'STANDARD' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 'bg-zinc-500/10 text-zinc-500 border border-zinc-500/20'
                            }`}>
                            {c.plan.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-8 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${c.status === 'ACTIVE' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`}></div>
                            <span className={`text-[9px] font-black uppercase tracking-widest ${c.status === 'ACTIVE' ? 'text-green-500' : 'text-red-500'}`}>
                              {c.status || 'UNKNOWN'}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleImpersonate(c.id);
                            }}
                            className="bg-white/5 hover:bg-blue-600 text-[10px] font-black px-6 py-2 rounded-lg transition-all uppercase tracking-widest border border-white/5 hover:border-blue-500 active:scale-95"
                          >
                            {impersonateLoading === c.id ? '...' : 'Login'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case "verification":
        return renderVerificationTab();
      case "stats":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className={`md:col-span-2 ${theme === 'dark' ? 'bg-zinc-900/30 border-white/5' : 'bg-white border-slate-200 shadow-sm'} border p-10 rounded-2xl`}>
              <h3 className="text-sm font-black uppercase tracking-widest mb-10 text-blue-500">Platform Growth</h3>
              <div className="h-48 flex items-end space-x-3">
                {[30, 45, 60, 40, 80, 95, 100].map((h, i) => (
                  <div key={i} className="flex-1 bg-blue-600/20 rounded-t-lg relative group transition-all hover:bg-blue-600/40" style={{ height: `${h}%` }}>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[8px] font-black opacity-0 group-hover:opacity-100 transition-all">{h}%</div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-6 text-[8px] font-black text-zinc-700 uppercase tracking-[0.3em]">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
            </div>
            <div className={`${theme === 'dark' ? 'bg-zinc-900/30 border-white/5' : 'bg-white border-slate-200 shadow-sm'} border p-10 rounded-2xl flex flex-col justify-center text-center`}>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Conversion Rate</h3>
              <div className="text-5xl font-black text-white">84%</div>
              <div className="mt-4 text-[10px] font-black text-green-500">+4.2% THIS WEEK</div>
            </div>
          </div>
        );
      case "themes":
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className={`${theme === 'dark' ? 'bg-zinc-900/30 border-white/5' : 'bg-white border-slate-200 shadow-sm'} border p-10 rounded-2xl`}>
              <h3 className="text-sm font-black uppercase tracking-widest mb-10 text-blue-500">Theme Quick Preview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((t) => (
                  <button
                    key={t}
                    onClick={() => window.open(`http://test-store.localhost:3000/?theme=${t}`, "_blank")}
                    className="group bg-black/40 border border-white/5 p-8 rounded-2xl hover:border-blue-600 transition-all text-left"
                  >
                    <div className="text-3xl mb-4">{t === 1 ? "✨" : t === 2 ? "🛍️" : t === 3 ? "💎" : "🎯"}</div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-white mb-2">Theme {t}</h4>
                    <p className="text-[10px] text-zinc-500 font-bold leading-relaxed mb-6">
                      {t === 1 ? "Premium Galaxy Theme" : t === 2 ? "Landing Page Focus" : t === 3 ? "Digital Marketplace" : "Retail E-Commerce"}
                    </p>
                    <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest group-hover:pl-2 transition-all">Launch Preview &rarr;</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-blue-600/10 border border-blue-600/20 p-8 rounded-2xl flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="text-3xl">💡</div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-white">Pro Tip</h4>
                  <p className="text-[10px] text-zinc-500 font-bold mt-1">Gunakan parameter <code className="text-blue-400">?theme=N</code> di URL untuk mengetes tampilan secara instan.</p>
                </div>
              </div>
            </div>
          </div>
        );
      case "domains":
        return (
          <div className="bg-zinc-900/30 border border-white/5 rounded-2xl overflow-hidden animate-in fade-in duration-500">
            <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-sm font-black uppercase tracking-widest text-blue-500">Custom Domain Approvals</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/[0.02]">
                  <tr className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    <th className="px-8 py-6">Identity</th>
                    <th className="px-8 py-6">Requested Domain</th>
                    <th className="px-8 py-6">Status</th>
                    <th className="px-8 py-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {clients.filter(c => c.customDomain && c.status !== 'PENDING').map(c => (
                    <tr key={c.id} className="hover:bg-white/[0.02] transition-all">
                      <td className="px-8 py-6">
                        <p className="font-bold text-white">{c.name}</p>
                        <p className="text-[10px] text-zinc-500">{c.email}</p>
                      </td>
                      <td className="px-8 py-6 font-mono text-blue-400 font-bold">{c.customDomain}</td>
                      <td className="px-8 py-6">
                        <span className={`text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${c.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                            'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                          }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button
                          onClick={async () => {
                            showToast("Processing domain approval...", "info");
                            const res = await fetch("/api/admin/domains", {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ clientId: c.id, status: "APPROVED" })
                            });
                            if (res.ok) {
                              showToast("Domain approved & linked to Vercel!", "success");
                              fetchData();
                            } else {
                              showToast("Failed to approve domain.", "error");
                            }
                          }}
                          className="bg-blue-600/10 hover:bg-blue-600 text-blue-500 hover:text-white text-[10px] font-black px-4 py-2 rounded-xl transition-all uppercase tracking-widest border border-blue-500/20"
                        >
                          Approve Domain
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case "settings":
        return renderSettingsTab();
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#050505] text-white' : 'bg-[#f2f2f2] text-slate-900'} font-sans selection:bg-blue-600/30 transition-colors duration-500`}>
      <div className={`fixed left-0 top-0 bottom-0 w-24 ${theme === 'dark' ? 'bg-zinc-950 border-white/5' : 'bg-white border-slate-200'} border-r flex flex-col items-center py-8 z-50`}>
        <img src="/logo2.png" alt="Logo" className="w-10 h-10 object-contain mb-10 shadow-lg shadow-blue-600/10" />
        <div className="flex flex-col space-y-8">
          {[
            { id: "home", icon: "🏠", label: "Home" },
            { id: "invoices", icon: "💰", label: "Invoices" },
            { id: "manage", icon: "👥", label: "Manage Client" },
            { id: "domains", icon: "🌐", label: "Domains" },
            { id: "verification", icon: "🛡️", label: "Verification" },
            { id: "stats", icon: "📈", label: "Stats Client" },
            { id: "themes", icon: "🏢", label: "Models" },
            { id: "settings", icon: "⚙️", label: "Settings" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center space-y-1 transition-all relative ${activeTab === tab.id ? "scale-110 opacity-100" : "opacity-30 hover:opacity-50"}`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="text-[8px] font-black uppercase tracking-widest">{tab.label}</span>

              {tab.id === 'verification' && verificationRequests.length > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full border-2 border-zinc-950 flex items-center justify-center animate-bounce">
                  <span className="text-[8px] font-black text-white">!</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="pl-24 pt-8 pr-8">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h2 className={`text-3xl font-black italic uppercase tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'} relative inline-block`}>
              Super Dashboard
              <div className="absolute -bottom-1 left-0 w-1/2 h-1 bg-blue-600 rounded-full"></div>
            </h2>
            <p className={`text-[10px] ${theme === 'dark' ? 'text-zinc-600' : 'text-slate-500'} font-bold uppercase tracking-[0.4em] mt-2 flex items-center`}>
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2 animate-pulse"></span>
              Platform Management Terminal
            </p>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={toggleTheme}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${theme === 'dark' ? 'bg-white/5 text-yellow-400 border border-white/10' : 'bg-white text-blue-600 border border-slate-200 shadow-sm'}`}
            >
              {theme === 'dark' ? "☀️" : "🌙"}
            </button>
            <div className="text-right">
              <p className={`text-[8px] font-black ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-400'} uppercase tracking-widest mb-1`}>Total Active Clients</p>
              <p className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{clients.length}</p>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-40">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error === "UNAUTHORIZED" ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in fade-in duration-700">
            <div className="relative">
              <div className="w-24 h-24 bg-blue-600/10 rounded-full flex items-center justify-center text-5xl border border-blue-500/20 shadow-2xl shadow-blue-600/20">
                🔐
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full border-4 border-[#050505] flex items-center justify-center text-[10px] font-black">
                !
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Session Expired</h3>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em]">Otoritas Super Admin Diperlukan</p>
            </div>
            <button
              onClick={() => window.location.href = "/super-gate"}
              className="bg-blue-600 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/30 active:scale-95"
            >
              Authorize via Super Gate
            </button>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-40 space-y-4">
            <p className="text-red-500 font-black text-sm uppercase tracking-widest">{error}</p>
            <button onClick={() => fetchData()} className="text-zinc-500 hover:text-white text-[10px] font-black uppercase tracking-widest underline">Coba Lagi</button>
          </div>
        ) : (
          renderTabContent()
        )}
      </div>

      {isModalOpen && editingClient && (
        <div className="fixed inset-0 z-[200] flex flex-col bg-[#0a0a0a] animate-in fade-in duration-200">
          {/* Header Simpel */}
          <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-zinc-950">
            <div className="flex-1">
              <h3 className="text-lg font-black text-white uppercase tracking-tight">
                {modalMode === 'add' ? 'Create New Client' : 'Manage Client'}
              </h3>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">ID: {editingClient.id || 'NEW_INSTANCE'}</p>
            </div>

            <div className="flex items-center gap-4">
              {modalMode === 'edit' && editingClient.id && (
                <button
                  onClick={() => handleImpersonate(editingClient.id as string)}
                  disabled={!!impersonateLoading}
                  className="px-6 py-2 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border border-white/5"
                >
                  {impersonateLoading ? 'Loading...' : 'Login as Client'}
                </button>
              )}
              <button
                onClick={(e) => handleSave(e as any)}
                disabled={updateLoading || !isDataChanged()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed"
              >
                {updateLoading ? 'Saving...' : 'Save Changes'}
              </button>
              <div className="w-[1px] h-8 bg-white/5 mx-2" />
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 flex items-center justify-center text-zinc-500 hover:text-white transition-all text-xl"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
            {/* Kolom Kiri: Data Utama */}
            <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-10 no-scrollbar">
              <div className="space-y-8">
                <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Data Bisnis & Akses
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase ml-1">Nama Bisnis</label>
                    <input
                      required
                      value={editingClient.name}
                      onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase ml-1">Store Slug</label>
                    <input
                      required
                      value={editingClient.slug}
                      onChange={(e) => setEditingClient({ ...editingClient, slug: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-all font-mono text-blue-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase ml-1">Service Plan</label>
                    <select
                      value={editingClient.plan}
                      onChange={(e) => setEditingClient({ ...editingClient, plan: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-all text-white"
                    >
                      <option value="BASIC" className="bg-zinc-900">BASIC</option>
                      <option value="BASIC_PLUS" className="bg-zinc-900">BASIC+</option>
                      <option value="STANDARD" className="bg-zinc-900">STANDARD</option>
                      <option value="STANDARD_PRO" className="bg-zinc-900">STANDARD PRO</option>
                      <option value="PREMIUM" className="bg-zinc-900">PREMIUM</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase ml-1">Status Akun</label>
                    <select
                      value={editingClient.status}
                      onChange={(e) => setEditingClient({ ...editingClient, status: e.target.value })}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-all text-white"
                    >
                      <option value="ACTIVE" className="bg-zinc-900 text-green-500">ACTIVE</option>
                      <option value="DISABLED" className="bg-zinc-900 text-red-500">DISABLED</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl space-y-8">
                <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full"></span> Owner Credentials
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-600 uppercase ml-1">Owner Name</label>
                    <input
                      value={editingClient.ownerName || ""}
                      onChange={(e) => setEditingClient({ ...editingClient, ownerName: e.target.value })}
                      className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-600 uppercase ml-1">Email</label>
                    <input
                      type="email"
                      value={editingClient.email || ""}
                      onChange={(e) => setEditingClient({ ...editingClient, email: e.target.value })}
                      className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-600 uppercase ml-1">Phone</label>
                    <input
                      value={editingClient.phone || ""}
                      onChange={(e) => setEditingClient({ ...editingClient, phone: e.target.value })}
                      className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-600 uppercase ml-1">Password Hash (Locked)</label>
                    <input
                      type="text"
                      disabled
                      value={editingClient.password || ""}
                      className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-[10px] font-mono text-zinc-600 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons Inside Body */}
              <div className="pt-10 flex flex-wrap items-center justify-between gap-6 border-t border-white/5">
                {modalMode === 'edit' && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="text-[10px] font-black text-red-500/50 hover:text-red-500 uppercase tracking-widest transition-all"
                  >
                    Terminate Account
                  </button>
                )}
              </div>
            </div>

            {/* Kolom Kanan: Bank & Identity */}
            <div className="w-full md:w-[450px] overflow-y-auto p-8 md:p-12 bg-zinc-950/50 border-l border-white/5 space-y-10 no-scrollbar">
              <div className="space-y-8">
                <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Identity & Bank Hub
                </h4>

                {/* KTP & QRIS Previews */}
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-600 uppercase ml-1">KTP Preview</label>
                    <div className="relative aspect-video w-full bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden group">
                      {editingClient.ktpUrl ? (
                        <img src={editingClient.ktpUrl} className="w-full h-full object-cover cursor-zoom-in" onClick={() => window.open(editingClient.ktpUrl, '_blank')} alt="KTP" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-700 font-bold uppercase tracking-widest italic">No KTP Document</div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-600 uppercase ml-1">QRIS Preview</label>
                    <div className="relative aspect-square w-full max-w-[200px] mx-auto bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
                      {editingClient.qrisUrl ? (
                        <img src={editingClient.qrisUrl} className="w-full h-full object-contain p-2" alt="QRIS" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-700 font-bold uppercase tracking-widest italic">No QRIS Image</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Cooldown Reset */}
                <div className="p-6 bg-amber-500/[0.03] border border-amber-500/10 rounded-2xl flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-amber-500/50 uppercase tracking-widest">Bank Lock Status</p>
                    {(() => {
                      const lastUpdate = editingClient.lastVerificationAt ? new Date(editingClient.lastVerificationAt) : null;
                      if (!lastUpdate) return <p className="text-xs font-black text-green-500 uppercase">READY</p>;
                      const now = new Date();
                      const diffDays = Math.floor(Math.abs(now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));
                      const daysLeft = 14 - diffDays;
                      return daysLeft <= 0
                        ? <p className="text-xs font-black text-green-500 uppercase">READY</p>
                        : <p className="text-xs font-black text-amber-500 uppercase tracking-tighter">LOCKED ({daysLeft}D)</p>;
                    })()}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingClient({ ...editingClient, lastVerificationAt: null });
                      showToast("Cooldown reset!", "info");
                    }}
                    className="text-[9px] font-black bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-2 uppercase tracking-widest transition-all"
                  >
                    RESET
                  </button>
                </div>

                {/* Bank List */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Verified Accounts</label>
                  {(() => {
                    let accounts = [];
                    try {
                      if (Array.isArray(editingClient.bankAccounts)) accounts = editingClient.bankAccounts;
                      else if (typeof editingClient.bankAccounts === 'string') accounts = JSON.parse(editingClient.bankAccounts);
                    } catch (e) { }

                    if (accounts.length === 0) return <p className="text-[10px] text-zinc-700 font-bold uppercase italic ml-1">Empty...</p>;

                    return (
                      <div className="space-y-3">
                        {accounts.map((bank: any, idx: number) => (
                          <div key={idx} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl flex justify-between items-center group">
                            {editingBankIndex === idx ? (
                              <div className="flex-1 space-y-3 pr-4">
                                <input 
                                  value={tempBankData?.bankName || tempBankData?.name || ""}
                                  onChange={(e) => setTempBankData({...tempBankData, name: e.target.value, bankName: e.target.value})}
                                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs focus:border-blue-500 outline-none text-white"
                                  placeholder="Bank Name"
                                />
                                <input 
                                  value={tempBankData?.accountNumber || ""}
                                  onChange={(e) => setTempBankData({...tempBankData, accountNumber: e.target.value})}
                                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs focus:border-blue-500 outline-none text-white"
                                  placeholder="Account Number"
                                />
                                <div className="flex gap-2">
                                  <button 
                                    type="button"
                                    onClick={() => {
                                      const newAccs = [...accounts];
                                      newAccs[idx] = tempBankData;
                                      setEditingClient({...editingClient, bankAccounts: newAccs});
                                      setEditingBankIndex(null);
                                      showToast("Perubahan bank disimpan (lokal)", "info");
                                    }}
                                    className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest"
                                  >
                                    Save
                                  </button>
                                  <button 
                                    type="button"
                                    onClick={() => setEditingBankIndex(null)}
                                    className="bg-white/10 text-zinc-400 px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="text-xs font-bold text-white">{bank.bankName || bank.name}</p>
                                    {bank.status === 'APPROVED' ? (
                                      <span className="text-[7px] font-black bg-green-500/20 text-green-500 px-1.5 py-0.5 rounded uppercase tracking-widest">Verified</span>
                                    ) : bank.status === 'PENDING' ? (
                                      <span className="text-[7px] font-black bg-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded uppercase tracking-widest">Pending</span>
                                    ) : null}
                                  </div>
                                  <p className="text-[10px] text-zinc-500 font-bold mt-0.5">{bank.accountNumber}</p>
                                </div>
                                <div className="flex gap-3 items-center opacity-0 group-hover:opacity-100 transition-all">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingBankIndex(idx);
                                      setTempBankData({...bank});
                                    }}
                                    className="text-blue-500/50 hover:text-blue-500 transition-all p-1"
                                    title="Edit Rekening"
                                  >
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newAccs = accounts.filter((_: any, i: number) => i !== idx);
                                      setEditingClient({ ...editingClient, bankAccounts: newAccs });
                                    }}
                                    className="text-red-500/50 hover:text-red-500 transition-all p-1"
                                    title="Hapus"
                                  >
                                    ✕
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- PLATFORM BANK MODAL --- */}
      {isBankModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsBankModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden animate-in zoom-in-95 duration-300 shadow-2xl">
            <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-zinc-950/50">
              <h3 className="text-sm font-black text-white uppercase tracking-widest italic">
                {editingBank ? '🛠️ Edit Payment Method' : '✨ Add Payment Method'}
              </h3>
              <button onClick={() => setIsBankModalOpen(false)} className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white transition-all">✕</button>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Provider Name</label>
                  <input
                    value={bankFormData.name}
                    onChange={(e) => setBankFormData({ ...bankFormData, name: e.target.value })}
                    placeholder="BCA / GoPay"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Type</label>
                  <select
                    value={bankFormData.type}
                    onChange={(e) => setBankFormData({ ...bankFormData, type: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 transition-all text-white"
                  >
                    <option value="bank" className="bg-zinc-900">BANK</option>
                    <option value="wallet" className="bg-zinc-900">E-WALLET</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Account Number</label>
                <input
                  value={bankFormData.accountNumber}
                  onChange={(e) => setBankFormData({ ...bankFormData, accountNumber: e.target.value })}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 transition-all font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Account Owner Name</label>
                <input
                  value={bankFormData.accountOwner}
                  onChange={(e) => setBankFormData({ ...bankFormData, accountOwner: e.target.value })}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Logo URL (Optional)</label>
                <input
                  value={bankFormData.logoUrl}
                  onChange={(e) => setBankFormData({ ...bankFormData, logoUrl: e.target.value })}
                  placeholder="/bca.png"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>
            </div>

            <div className="p-8 border-t border-white/5 bg-zinc-950/50 flex gap-4">
              <button
                onClick={() => setIsBankModalOpen(false)}
                className="flex-1 py-3 bg-white/5 text-zinc-500 hover:text-white border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  let newAccs;
                  if (editingBank) {
                    newAccs = platformAccounts.map(a => a.id === editingBank.id ? { ...bankFormData, id: a.id } : a);
                  } else {
                    newAccs = [...platformAccounts, { ...bankFormData, id: Date.now().toString() }];
                  }
                  setPlatformAccounts(newAccs);
                  savePlatformAccounts(newAccs);
                  setIsBankModalOpen(false);
                }}
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20"
              >
                {editingBank ? 'Update Account' : 'Add Account'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- VERIFICATION DETAIL MODAL --- */}
      {isVerificationModalOpen && selectedVerificationGroup && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !isProcessing && setIsVerificationModalOpen(false)} />
          <div className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden animate-in zoom-in-95 duration-300 shadow-2xl flex flex-col max-h-[85vh]">

            <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-zinc-950/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600/10 rounded-lg flex items-center justify-center text-lg border border-blue-500/20 text-blue-500">
                  🛡️
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-tight italic">Verification Review</h3>
                  <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">{selectedVerificationGroup.client?.name}</p>
                </div>
              </div>
              <button
                onClick={() => setIsVerificationModalOpen(false)}
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white transition-all text-xs"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
              {/* --- AGGREGATED ASSETS SECTION --- */}
              <div className="bg-blue-600/5 border border-blue-500/10 rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span> Verification Assets
                  </h4>
                  <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-tighter">Images from all requests</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Collect all URLs from group */}
                  {(() => {
                    const allKtpUrls = Array.from(new Set(selectedVerificationGroup.requests.map((r: any) => r.ktpUrl).filter(Boolean)));
                    const allQrisUrls = Array.from(new Set(selectedVerificationGroup.requests.map((r: any) => r.qrisUrl).filter(Boolean)));
                    
                    return (
                      <>
                        <div className="space-y-2">
                          <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest ml-1">KTP Image</p>
                          <div className="aspect-video bg-black/40 border border-white/5 rounded-xl overflow-hidden group/img relative">
                            {allKtpUrls.length > 0 ? (
                              allKtpUrls.map((url: any, i) => (
                                <img key={i} src={url} className="w-full h-full object-cover cursor-zoom-in" onClick={() => window.open(url, '_blank')} alt="KTP" />
                              ))
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center opacity-30">
                                <span className="text-2xl mb-1">🪪</span>
                                <span className="text-[8px] font-black uppercase">No KTP Attached</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest ml-1">QRIS Image</p>
                          <div className="aspect-video bg-black/40 border border-white/5 rounded-xl overflow-hidden group/img relative">
                            {allQrisUrls.length > 0 ? (
                              allQrisUrls.map((url: any, i) => (
                                <img key={i} src={url} className="w-full h-full object-contain p-2 cursor-zoom-in" onClick={() => window.open(url, '_blank')} alt="QRIS" />
                              ))
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center opacity-30">
                                <span className="text-2xl mb-1">🏦</span>
                                <span className="text-[8px] font-black uppercase">No QRIS Attached</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* --- REQUEST DETAILS --- */}
              <div className="space-y-4">
                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-1">Request History</p>
                {selectedVerificationGroup.requests.map((req: any) => (
                  <div key={req.id} className="bg-white/[0.02] border border-white/5 rounded-xl p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] font-black px-2 py-0.5 bg-zinc-800 text-zinc-400 border border-white/5 rounded uppercase tracking-widest">
                        {req.type} REQUEST
                      </span>
                      <span className="text-[8px] text-zinc-600 font-bold">{new Date(req.createdAt).toLocaleString()}</span>
                    </div>

                    {req.type === 'BANK' && req.data ? (
                      <div className="bg-black/20 p-4 rounded-lg border border-white/5 space-y-3">
                         {(() => {
                           const banks = typeof req.data === 'string' ? JSON.parse(req.data) : req.data;
                           return Array.isArray(banks) && banks.map((bank: any, i: number) => (
                            <div key={i} className="flex justify-between items-center border-b border-white/5 last:border-0 pb-2 last:pb-0">
                              <div>
                                <p className="text-[10px] font-black text-white uppercase">{bank.bankName}</p>
                                <p className="text-[9px] text-zinc-500 font-bold">{bank.accountHolder}</p>
                              </div>
                              <p className="text-sm font-black text-blue-500 font-mono tracking-tighter">{bank.accountNumber}</p>
                            </div>
                           ));
                         })()}
                      </div>
                    ) : req.type === 'IDENTITY' ? (
                      <div className="flex items-center gap-3 text-zinc-400">
                        <span className="text-lg">🪪</span>
                        <p className="text-[9px] font-bold uppercase tracking-widest">Identity Verification Submitted</p>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2 block ml-1">Rejection Reason (Optional)</label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Contoh: Foto KTP blur..."
                  className="w-full h-20 bg-white/[0.03] border border-white/10 rounded-xl p-4 text-xs font-medium text-white focus:outline-none focus:border-red-500/50 transition-all placeholder:text-zinc-700 resize-none"
                />
              </div>
            </div>

            <div className="p-6 border-t border-white/5 bg-zinc-950/50 flex gap-3">
              <button
                disabled={isProcessing}
                onClick={() => handleBatchProcessVerification(selectedVerificationGroup.requests, 'REJECTED', rejectReason || "Data tidak valid / tidak sesuai.")}
                className="flex-1 py-3 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-30"
              >
                {isProcessing ? 'Wait...' : 'Reject'}
              </button>
              <button
                disabled={isProcessing}
                onClick={() => handleBatchProcessVerification(selectedVerificationGroup.requests, 'APPROVED')}
                className="flex-1 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-green-600/20 disabled:opacity-30"
              >
                {isProcessing ? 'Wait...' : 'Approve'}
              </button>
            </div>
          </div>
        </div>
      )}

      {viewingReceiptUrl && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-sm cursor-zoom-out"
            onClick={() => setViewingReceiptUrl(null)}
          />
          <div className="relative max-w-4xl w-full max-h-full flex flex-col items-center animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setViewingReceiptUrl(null)}
              className="absolute -top-12 right-0 text-white/50 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all"
            >
              Close [ESC]
              <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">✕</div>
            </button>
            <div className="bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-black/50">
              <img
                src={viewingReceiptUrl}
                alt="Bukti Transfer"
                className="max-w-full max-h-[80vh] object-contain"
              />
              <div className="p-6 bg-zinc-900 border-t border-white/5 flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Bukti Transfer Client</p>
                  <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Verified by AI & Secure Storage</p>
                </div>
                <a
                  href={viewingReceiptUrl}
                  target="_blank"
                  className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white text-[9px] font-black rounded-xl border border-white/10 transition-all uppercase tracking-widest"
                >
                  Buka di Tab Baru ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
