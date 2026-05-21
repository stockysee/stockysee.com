"use client";

import { useState } from "react";
import Link from "next/link";

interface BankAccount {
  id: string;
  name: string;
  accountNumber: string;
  accountOwner: string;
  logoUrl?: string;
  type: 'bank' | 'wallet';
}

export default function BankSettingsPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>([
    { id: '1', name: 'GoPay', accountNumber: '081331019725', accountOwner: 'Nur', logoUrl: '/gopay.png', type: 'wallet' },
    { id: '2', name: 'Dana', accountNumber: '081331019725', accountOwner: 'Nur', logoUrl: '/dana.png', type: 'wallet' }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    accountNumber: '',
    accountOwner: '',
    logoUrl: '',
    type: 'bank' as 'bank' | 'wallet'
  });

  const handleOpenModal = (account?: BankAccount) => {
    if (account) {
      setEditingAccount(account);
      setFormData({
        name: account.name,
        accountNumber: account.accountNumber,
        accountOwner: account.accountOwner,
        logoUrl: account.logoUrl || '',
        type: account.type
      });
    } else {
      setEditingAccount(null);
      setFormData({ name: '', accountNumber: '', accountOwner: '', logoUrl: '', type: 'bank' });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingAccount) {
      setAccounts(accounts.map(a => a.id === editingAccount.id ? { ...a, ...formData } : a));
    } else {
      setAccounts([...accounts, { id: Math.random().toString(), ...formData }]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Hapus metode pembayaran ini?")) {
      setAccounts(accounts.filter(a => a.id !== id));
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/dashboard/settings" className="text-[10px] font-black text-blue-600 hover:underline uppercase tracking-widest">Settings</Link>
            <span className="text-[10px] text-gray-500">/</span>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bank & E-Wallet</span>
          </div>
          <h2 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Metode Pembayaran</h2>
          <p className="text-[10px] md:text-sm text-slate-500 dark:text-gray-500 mt-1 uppercase tracking-widest font-bold">Kelola rekening tujuan transfer pelanggan.</p>
        </div>

        <button 
          onClick={() => handleOpenModal()}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-black rounded-xl shadow-lg shadow-blue-600/20 transition-all uppercase tracking-widest flex items-center justify-center gap-2"
        >
          <span>+ Tambah Akun</span>
        </button>
      </div>

      {/* Account Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map(acc => (
          <div key={acc.id} className="group relative p-6 bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-white/5 rounded-3xl hover:border-blue-500 transition-all overflow-hidden">
            <div className="absolute top-0 right-0 p-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleOpenModal(acc)} className="w-8 h-8 rounded-lg bg-blue-600/10 text-blue-500 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button onClick={() => handleDelete(acc.id)} className="w-8 h-8 rounded-lg bg-red-600/10 text-red-500 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
              </button>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-xl overflow-hidden border border-slate-200 dark:border-white/10 p-2">
                {acc.logoUrl ? <img src={acc.logoUrl} className="w-full h-full object-contain" /> : (acc.type === 'bank' ? '🏦' : '📱')}
              </div>
              <div>
                <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{acc.name}</h3>
                <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${acc.type === 'bank' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'}`}>
                  {acc.type === 'bank' ? 'Bank Transfer' : 'E-Wallet'}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Nomor Rekening</p>
                <p className="text-sm font-black text-slate-900 dark:text-white font-mono tracking-wider">{acc.accountNumber}</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Atas Nama</p>
                <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{acc.accountOwner}</p>
              </div>
            </div>
          </div>
        ))}

        {accounts.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 dark:border-white/5 rounded-3xl">
            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Belum ada akun bank terdaftar.</p>
          </div>
        )}
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden animate-panel-in">
            <div className="p-8">
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-6">
                {editingAccount ? 'Edit Akun Bank' : 'Tambah Akun Baru'}
              </h3>

              <div className="space-y-5">
                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Tipe Akun</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['bank', 'wallet'].map(t => (
                      <button 
                        key={t}
                        onClick={() => setFormData({ ...formData, type: t as any })}
                        className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                          formData.type === t 
                            ? "bg-blue-600 text-white border-blue-600" 
                            : "bg-slate-50 dark:bg-white/5 text-gray-500 border-slate-200 dark:border-white/5"
                        }`}
                      >
                        {t === 'bank' ? 'Bank' : 'E-Wallet'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Nama Bank / Wallet</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: BCA, Mandiri, GoPay"
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Nomor Rekening / HP</label>
                  <input 
                    type="text" 
                    value={formData.accountNumber}
                    onChange={e => setFormData({ ...formData, accountNumber: e.target.value })}
                    placeholder="Masukkan nomor akun"
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-500 transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Atas Nama</label>
                  <input 
                    type="text" 
                    value={formData.accountOwner}
                    onChange={e => setFormData({ ...formData, accountOwner: e.target.value })}
                    placeholder="Nama lengkap pemilik akun"
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Logo URL (Optional)</label>
                  <input 
                    type="text" 
                    value={formData.logoUrl}
                    onChange={e => setFormData({ ...formData, logoUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 text-[11px] font-black uppercase tracking-widest text-gray-500 hover:text-slate-900 dark:hover:text-white transition-all"
                >
                  Batal
                </button>
                <button 
                  onClick={handleSave}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-black rounded-xl shadow-lg shadow-blue-600/20 transition-all uppercase tracking-widest"
                >
                  Simpan Akun
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .animate-panel-in {
          animation: panel-in 0.4s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        @keyframes panel-in {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
