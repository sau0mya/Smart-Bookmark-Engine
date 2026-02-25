import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Globe, Plus, Trash2, Edit3, Heart, ExternalLink, Search, Filter, BookOpen, CheckSquare, Square, X, Zap, Layers } from 'lucide-react';
import BookmarkForm from '../components/bookmarks/BookmarkForm';
import ReaderModal from '../components/bookmarks/ReaderModal';
import { getCollections, addBookmarksToCollection } from '../services/collections';
import { motion, AnimatePresence } from 'framer-motion';

const Bookmarks = () => {
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingBookmark, setEditingBookmark] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('');
    const [status, setStatus] = useState('');

    // New Feature States
    const [selectedIds, setSelectedIds] = useState([]);
    const [readingBookmark, setReadingBookmark] = useState(null);
    const [isScraping, setIsScraping] = useState(false);
    const [showClusterModal, setShowClusterModal] = useState(false);
    const [collections, setCollections] = useState([]);
    const [isAddingToCluster, setIsAddingToCluster] = useState(false);

    const fetchBookmarks = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchTerm) params.append('search', searchTerm);
            if (category) params.append('category', category);
            if (status) params.append('status', status);

            const res = await api.get(`/bookmarks?${params.toString()}`);
            setBookmarks(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchBookmarks();
        }, 500);
        return () => clearTimeout(delayDebounce);
    }, [searchTerm, category, status]);

    const handleCreate = async (data) => {
        try {
            await api.post('/bookmarks', data);
            setShowForm(false);
            fetchBookmarks();
        } catch (err) {
            alert(err.response?.data?.error || 'Something went wrong');
        }
    };

    const handleUpdate = async (data) => {
        try {
            await api.put(`/bookmarks/${editingBookmark._id}`, data);
            setEditingBookmark(null);
            fetchBookmarks();
        } catch (err) {
            alert(err.response?.data?.error || 'Something went wrong');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this bookmark?')) {
            try {
                await api.delete(`/bookmarks/${id}`);
                fetchBookmarks();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const toggleSelection = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleBulkDelete = async () => {
        if (window.confirm(`Are you sure you want to delete ${selectedIds.length} bookmarks?`)) {
            try {
                await api.post('/bookmarks/bulk-delete', { ids: selectedIds });
                setSelectedIds([]);
                fetchBookmarks();
            } catch (err) {
                alert('Bulk delete failed');
            }
        }
    };

    const handleBulkStatusUpdate = async (newStatus) => {
        try {
            await api.post('/bookmarks/bulk-update-status', { ids: selectedIds, status: newStatus });
            setSelectedIds([]);
            fetchBookmarks();
        } catch (err) {
            alert('Bulk update failed');
        }
    };

    const handleRead = async (id) => {
        try {
            const res = await api.get(`/bookmarks/${id}/read`);
            setReadingBookmark(res.data.data);
        } catch (err) {
            alert('Could not load reader content');
        }
    };

    const handleOpenClusterModal = async () => {
        try {
            const res = await getCollections();
            setCollections(res.data);
            setShowClusterModal(true);
        } catch (err) {
            alert('Failed to load collections');
        }
    };

    const handleAddToCluster = async (clusterId) => {
        setIsAddingToCluster(true);
        try {
            await addBookmarksToCollection(clusterId, selectedIds);
            setSelectedIds([]);
            setShowClusterModal(false);
            alert('Added to cluster successfully');
        } catch (err) {
            alert('Failed to add to cluster');
        } finally {
            setIsAddingToCluster(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Library Nodes</h2>
                    <p className="text-zinc-500 text-sm font-medium">Curation and management of your digital assets.</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-lg shadow-indigo-500/10 active:scale-95 flex items-center gap-2"
                >
                    <Plus size={16} strokeWidth={2.5} />
                    <span>Collect New Node</span>
                </button>
            </div>

            {/* Modern Search & Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 relative group">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-500 transition-colors" size={16} />
                    <input
                        type="text"
                        placeholder="Search for nodes, insights..."
                        className="w-full bg-white border border-zinc-200 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-indigo-500/30 focus:ring-4 focus:ring-indigo-500/5 transition-all text-zinc-700 text-sm font-medium placeholder:text-zinc-400 shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative group">
                    <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors" size={16} />
                    <select
                        className="w-full bg-white border border-zinc-200 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-indigo-500/30 focus:ring-4 focus:ring-indigo-500/5 transition-all text-zinc-600 text-sm font-semibold cursor-pointer appearance-none shadow-sm"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">All Streams</option>
                        <option value="General">General</option>
                        <option value="Technology">Technology</option>
                        <option value="Work">Work</option>
                        <option value="Personal">Personal</option>
                    </select>
                </div>
                <select
                    className="w-full bg-white border border-zinc-200 rounded-xl py-2.5 px-4 outline-none focus:border-indigo-500/30 focus:ring-4 focus:ring-indigo-500/5 transition-all text-zinc-600 text-sm font-semibold cursor-pointer appearance-none shadow-sm"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="">All Status</option>
                    <option value="normal">Active</option>
                    <option value="favorite">Prioritized</option>
                    <option value="archived">Vaulted</option>
                </select>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-56 bg-zinc-100 border border-zinc-200 rounded-xl animate-pulse shadow-sm"></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-32">
                    {bookmarks.map((bookmark) => (
                        <div
                            key={bookmark._id}
                            className={`saas-card p-6 flex flex-col h-full group ${selectedIds.includes(bookmark._id) ? 'border-indigo-500 bg-indigo-50/30 shadow-indigo-100' : ''
                                }`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => toggleSelection(bookmark._id)}
                                        className={`transition-all ${selectedIds.includes(bookmark._id) ? 'text-indigo-600 scale-110' : 'text-zinc-300 hover:text-zinc-400'}`}
                                    >
                                        {selectedIds.includes(bookmark._id) ? <CheckSquare size={18} /> : <Square size={18} />}
                                    </button>
                                    <div className="p-2 bg-zinc-50 text-zinc-500 rounded-lg border border-zinc-200 group-hover:border-zinc-300 transition-colors shadow-sm">
                                        <Globe size={18} />
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                                    <button
                                        onClick={() => setEditingBookmark(bookmark)}
                                        className="p-1.5 bg-white text-zinc-400 hover:text-zinc-900 rounded-md border border-zinc-200 hover:border-zinc-300 shadow-sm transition-colors"
                                    >
                                        <Edit3 size={14} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(bookmark._id)}
                                        className="p-1.5 bg-white text-zinc-400 hover:text-rose-600 rounded-md border border-zinc-200 hover:border-rose-200 shadow-sm transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-base font-bold text-zinc-900 mb-1.5 line-clamp-1 group-hover:text-indigo-600 transition-colors tracking-tight">
                                {bookmark.title}
                            </h3>
                            <p className="text-[13px] text-zinc-500 font-medium mb-5 line-clamp-2 leading-relaxed">
                                {bookmark.description || 'No description provided.'}
                            </p>

                            {/* Smart Summary Display */}
                            {bookmark.summary && (
                                <div className="bg-zinc-50/50 border border-zinc-200/60 p-3 rounded-lg mb-5 overflow-hidden">
                                    <div className="flex items-center gap-2 text-indigo-600/80 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                                        <Zap size={10} fill="currentColor" /> Intelligence
                                    </div>
                                    <p className="text-zinc-600 text-[11px] leading-relaxed line-clamp-3 italic">
                                        {bookmark.summary}
                                    </p>
                                </div>
                            )}

                            <div className="flex flex-wrap gap-1.5 mb-6 mt-auto">
                                {bookmark.category.map(cat => (
                                    <span key={cat} className="text-[10px] font-bold px-2 py-0.5 bg-zinc-100 rounded-md border border-zinc-200 text-zinc-500">
                                        {cat}
                                    </span>
                                ))}
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                                <div className="flex items-center text-zinc-400 text-[11px] font-bold gap-1.5">
                                    <Heart size={14} className={bookmark.status === 'favorite' ? 'fill-rose-500 text-rose-500' : ''} />
                                    <span>{bookmark.visitCount} SESSIONS</span>
                                </div>
                                <div className="flex gap-1.5">
                                    <button
                                        onClick={() => handleRead(bookmark._id)}
                                        className="flex items-center gap-1.5 bg-white border border-zinc-200 text-zinc-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-zinc-50 transition-all shadow-sm"
                                    >
                                        Read <BookOpen size={12} />
                                    </button>
                                    <a
                                        href={bookmark.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 bg-indigo-600/10 border border-indigo-200 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                                    >
                                        Visit <ExternalLink size={12} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Floating Bulk Actions Toolbar */}
            <AnimatePresence>
                {selectedIds.length > 0 && (
                    <motion.div
                        initial={{ y: 100, x: '-50%', opacity: 0 }}
                        animate={{ y: 0, x: '-50%', opacity: 1 }}
                        exit={{ y: 100, x: '-50%', opacity: 0 }}
                        className="fixed bottom-8 left-1/2 z-[90] bg-white/90 border border-zinc-200 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-8 backdrop-blur-xl"
                    >
                        <div className="flex items-center gap-4">
                            <span className="bg-indigo-600 text-white w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs">
                                {selectedIds.length}
                            </span>
                            <span className="text-zinc-900 font-bold text-xs uppercase tracking-widest">Selected</span>
                            <button
                                onClick={() => setSelectedIds([])}
                                className="text-zinc-400 hover:text-zinc-900 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="h-6 w-px bg-zinc-200" />

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleBulkStatusUpdate('favorite')}
                                className="bg-white hover:bg-zinc-50 text-zinc-700 px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all border border-zinc-200 shadow-sm"
                            >
                                Priority
                            </button>
                            <button
                                onClick={() => handleBulkStatusUpdate('archived')}
                                className="bg-white hover:bg-zinc-50 text-zinc-700 px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all border border-zinc-200 shadow-sm"
                            >
                                Vault
                            </button>
                            <button
                                onClick={handleOpenClusterModal}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all shadow-lg shadow-indigo-500/10 flex items-center gap-2"
                            >
                                <Layers size={14} /> Cluster
                            </button>
                            <button
                                onClick={handleBulkDelete}
                                className="bg-rose-600/10 border border-rose-200 hover:bg-rose-600 hover:text-white text-rose-600 px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all shadow-sm"
                            >
                                Remove
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal Container */}
            {(showForm || editingBookmark) && (
                <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-300">
                    <div className="bg-white border border-zinc-200 p-8 md:p-10 w-full max-w-lg rounded-2xl shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
                        <header className="mb-8">
                            <h3 className="text-xl font-bold text-zinc-900 tracking-tight">{editingBookmark ? 'Edit Stream Node' : 'Initialize New Node'}</h3>
                            <p className="text-zinc-500 text-sm mt-1">Configure your content stream parameters.</p>
                        </header>
                        <BookmarkForm
                            onSubmit={editingBookmark ? handleUpdate : handleCreate}
                            initialData={editingBookmark}
                            onCancel={() => { setShowForm(false); setEditingBookmark(null); }}
                        />
                    </div>
                </div>
            )}

            {/* Reader Modal */}
            <ReaderModal
                bookmark={readingBookmark}
                onClose={() => setReadingBookmark(null)}
            />

            {/* Cluster Selection Modal */}
            <AnimatePresence>
                {showClusterModal && (
                    <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white border border-zinc-200 p-8 w-full max-w-md rounded-2xl shadow-2xl relative"
                        >
                            <button
                                onClick={() => setShowClusterModal(false)}
                                className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900 transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <header className="mb-6">
                                <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Select Target Cluster</h3>
                                <p className="text-zinc-500 text-sm mt-1">Move {selectedIds.length} nodes to a neural cluster.</p>
                            </header>

                            <div className="space-y-2 max-h-64 overflow-y-auto pr-2 mb-8">
                                {collections.map(cluster => (
                                    <button
                                        key={cluster._id}
                                        onClick={() => handleAddToCluster(cluster._id)}
                                        disabled={isAddingToCluster}
                                        className="w-full flex items-center justify-between p-4 bg-zinc-50 hover:bg-indigo-50 border border-zinc-200 hover:border-indigo-200 rounded-xl transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white rounded-lg border border-zinc-200 group-hover:border-indigo-100 shadow-sm">
                                                <Layers size={16} className="text-zinc-400 group-hover:text-indigo-600" />
                                            </div>
                                            <span className="font-bold text-zinc-700 text-sm">{cluster.name}</span>
                                        </div>
                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-white px-2 py-1 rounded-md border border-zinc-100">
                                            {cluster.bookmarks?.length || 0} Nodes
                                        </span>
                                    </button>
                                ))}
                                {collections.length === 0 && (
                                    <div className="text-center py-8">
                                        <p className="text-zinc-500 text-sm font-medium">No clusters found. Create one first!</p>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => setShowClusterModal(false)}
                                className="w-full text-zinc-500 font-bold text-xs hover:text-zinc-900 transition-colors"
                            >
                                Cancel Operation
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Bookmarks;
