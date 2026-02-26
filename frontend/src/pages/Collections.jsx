import React, { useEffect, useState } from 'react';
import { getCollections, createCollection, deleteCollection, addBookmarksToCollection } from '../services/collections';
import api from '../services/api';
import { Layers, Plus, Trash2, FolderOpen, MoreVertical, X, Loader2, CheckSquare, Square, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Collections = () => {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newCollection, setNewCollection] = useState({ name: '', description: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [activeCluster, setActiveCluster] = useState(null);
    const [allBookmarks, setAllBookmarks] = useState([]);
    const [selectedBookmarkIds, setSelectedBookmarkIds] = useState([]);
    const [isAddingNodes, setIsAddingNodes] = useState(false);
    const [bookmarkSearch, setBookmarkSearch] = useState('');

    const fetchCollections = async () => {
        setLoading(true);
        try {
            const res = await getCollections();
            setCollections(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCollections();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await createCollection(newCollection);
            setNewCollection({ name: '', description: '' });
            setShowModal(false);
            fetchCollections();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to create collection');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this collection? (Bookmarks will not be deleted)')) {
            try {
                await deleteCollection(id);
                fetchCollections();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleOpenAddModal = async (cluster) => {
        setActiveCluster(cluster);
        setShowAddModal(true);
        try {
            const res = await api.get('/bookmarks');
            // Filter out bookmarks already in this cluster
            const existingIds = cluster.bookmarks.map(b => b._id || b);
            setAllBookmarks(res.data.data.filter(b => !existingIds.includes(b._id)));
        } catch (err) {
            console.error('Failed to fetch bookmarks', err);
        }
    };

    const handleAddNodes = async () => {
        if (selectedBookmarkIds.length === 0) return;
        setIsAddingNodes(true);
        try {
            await addBookmarksToCollection(activeCluster._id, selectedBookmarkIds);
            setShowAddModal(false);
            setSelectedBookmarkIds([]);
            fetchCollections();
        } catch (err) {
            alert('Failed to add nodes to cluster');
        } finally {
            setIsAddingNodes(false);
        }
    };

    const toggleBookmarkSelection = (id) => {
        setSelectedBookmarkIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const filteredBookmarks = allBookmarks.filter(b =>
        b.title.toLowerCase().includes(bookmarkSearch.toLowerCase()) ||
        b.url.toLowerCase().includes(bookmarkSearch.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Neural Clusters</h2>
                    <p className="text-zinc-500 text-sm font-medium">Organize your knowledge nodes into structured collections.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-lg shadow-indigo-500/10 active:scale-95 flex items-center gap-2"
                >
                    <Plus size={16} strokeWidth={2.5} />
                    <span>Create Cluster</span>
                </button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-48 bg-zinc-100 border border-zinc-200 rounded-2xl animate-pulse shadow-sm"></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {collections.map((collection) => (
                        <motion.div
                            key={collection._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="saas-card p-6 flex flex-col h-full group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full -mr-12 -mt-12 transition-all group-hover:bg-indigo-500/10 group-hover:scale-150 blur-3xl" />

                            <div className="flex justify-between items-start mb-6 relative">
                                <div className="p-3 bg-zinc-950 text-white rounded-xl shadow-xl shadow-zinc-950/20 group-hover:bg-indigo-600 transition-colors">
                                    <Layers size={20} />
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <button
                                        onClick={() => handleOpenAddModal(collection)}
                                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                        title="Add Nodes"
                                    >
                                        <Plus size={16} strokeWidth={2.5} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(collection._id)}
                                        className="p-2 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="relative">
                                <h3 className="text-lg font-bold text-zinc-900 mb-2 truncate group-hover:text-indigo-600 transition-colors">
                                    {collection.name}
                                </h3>
                                <p className="text-sm text-zinc-500 font-medium line-clamp-2 mb-6 h-10">
                                    {collection.description || 'No description provided for this cluster.'}
                                </p>
                            </div>

                            <div className="mt-auto flex items-center justify-between pt-5 border-t border-zinc-100 bg-white relative">
                                <div className="flex items-center gap-2">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-zinc-100 flex items-center justify-center">
                                                <div className="w-2 h-2 rounded-full bg-zinc-300" />
                                            </div>
                                        ))}
                                    </div>
                                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest pl-2">
                                        {collection.bookmarks?.length || 0} Nodes
                                    </span>
                                </div>
                                <button className="text-indigo-600 hover:text-indigo-700 font-bold text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-all">
                                    Explore <FolderOpen size={14} />
                                </button>
                            </div>
                        </motion.div>
                    ))}

                    {collections.length === 0 && (
                        <div className="col-span-full py-24 flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center border border-zinc-100 shadow-inner">
                                <Layers size={32} className="text-zinc-300" />
                            </div>
                            <div className="max-w-xs space-y-2">
                                <h4 className="text-lg font-bold text-zinc-900">Initialize Your First Cluster</h4>
                                <p className="text-zinc-500 text-sm font-medium">Collections allow you to group your digital stream into logical domains.</p>
                            </div>
                            <button
                                onClick={() => setShowModal(true)}
                                className="text-indigo-600 font-bold text-sm hover:underline underline-offset-4"
                            >
                                Start Building +
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Modals */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white border border-zinc-200 p-8 w-full max-md rounded-2xl shadow-2xl relative"
                        >
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900 transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <header className="mb-8">
                                <h3 className="text-xl font-bold text-zinc-900 tracking-tight">New Knowledge Cluster</h3>
                                <p className="text-zinc-500 text-sm mt-1">Define the parameters of your new collection.</p>
                            </header>

                            <form onSubmit={handleCreate} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Cluster Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-zinc-50/50 border border-zinc-200 rounded-xl py-3 px-4 outline-none focus:bg-white focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all text-zinc-900 font-bold placeholder:text-zinc-400"
                                        placeholder="e.g. Research Papers"
                                        value={newCollection.name}
                                        onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Contextual Description</label>
                                    <textarea
                                        className="w-full bg-zinc-50/50 border border-zinc-200 rounded-xl py-3 px-4 outline-none focus:bg-white focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all text-zinc-900 font-medium placeholder:text-zinc-400 min-h-[100px]"
                                        placeholder="What kind of nodes live here?"
                                        value={newCollection.description}
                                        onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold text-sm py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
                                >
                                    {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Establish Cluster'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white border border-zinc-200 p-8 w-full max-w-2xl rounded-2xl shadow-2xl relative"
                        >
                            <button
                                onClick={() => { setShowAddModal(false); setSelectedBookmarkIds([]); }}
                                className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900 transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <header className="mb-6">
                                <h3 className="text-xl font-bold text-zinc-900 tracking-tight">Add Nodes to {activeCluster?.name}</h3>
                                <p className="text-zinc-500 text-sm mt-1">Select knowledge nodes to incorporate into this cluster.</p>
                            </header>

                            <div className="relative mb-6">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search your library..."
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:bg-white focus:border-indigo-500/50 transition-all text-sm"
                                    value={bookmarkSearch}
                                    onChange={(e) => setBookmarkSearch(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2 max-h-80 overflow-y-auto pr-2 mb-8 custom-scrollbar">
                                {filteredBookmarks.map(bookmark => (
                                    <button
                                        key={bookmark._id}
                                        onClick={() => toggleBookmarkSelection(bookmark._id)}
                                        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all group ${selectedBookmarkIds.includes(bookmark._id)
                                            ? 'bg-indigo-50 border-indigo-200'
                                            : 'bg-zinc-50 border-zinc-100 hover:border-zinc-200'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`${selectedBookmarkIds.includes(bookmark._id) ? 'text-indigo-600' : 'text-zinc-300'}`}>
                                                {selectedBookmarkIds.includes(bookmark._id) ? <CheckSquare size={18} /> : <Square size={18} />}
                                            </div>
                                            <div className="text-left">
                                                <div className="font-bold text-zinc-700 text-sm truncate max-w-[300px]">{bookmark.title}</div>
                                                <div className="text-[11px] text-zinc-400 truncate max-w-[300px]">{bookmark.url}</div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                                {filteredBookmarks.length === 0 && (
                                    <div className="text-center py-12 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
                                        <p className="text-zinc-400 text-sm font-medium">No available nodes found to add.</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-zinc-100">
                                <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                                    {selectedBookmarkIds.length} Nodes Selected
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => { setShowAddModal(false); setSelectedBookmarkIds([]); }}
                                        className="px-5 py-2.5 text-zinc-500 hover:text-zinc-900 text-[11px] font-bold uppercase tracking-widest"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAddNodes}
                                        disabled={isAddingNodes || selectedBookmarkIds.length === 0}
                                        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold text-[11px] uppercase tracking-widest px-8 py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/20"
                                    >
                                        {isAddingNodes ? <Loader2 size={16} className="animate-spin" /> : 'Confirm Addition'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Collections;
