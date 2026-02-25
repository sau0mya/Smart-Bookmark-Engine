import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Clock, PlusCircle, RefreshCw, Trash, MousePointer2, Heart, ArrowRight } from 'lucide-react';

const Activity = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/activity?page=${page}&limit=10`);
            setLogs(res.data.data);
            setTotal(res.data.pagination.total);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [page]);

    const getActionStyles = (action) => {
        switch (action) {
            case 'CREATE': return { icon: <PlusCircle size={18} />, color: 'text-emerald-700', bg: 'bg-emerald-50' };
            case 'UPDATE': return { icon: <RefreshCw size={18} />, color: 'text-indigo-700', bg: 'bg-indigo-50' };
            case 'DELETE': return { icon: <Trash size={18} />, color: 'text-rose-700', bg: 'bg-rose-50' };
            case 'VISIT': return { icon: <MousePointer2 size={18} />, color: 'text-zinc-700', bg: 'bg-zinc-50' };
            case 'FAVORITE': return { icon: <Heart size={18} />, color: 'text-amber-700', bg: 'bg-amber-50' };
            default: return { icon: <Clock size={18} />, color: 'text-zinc-600', bg: 'bg-zinc-50' };
        }
    };

    return (
        <div className="space-y-8">
            <header className="space-y-1">
                <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Temporal Stream</h2>
                <p className="text-zinc-500 text-sm font-medium">A chronological history of your digital workspace interactions.</p>
            </header>

            {loading && page === 1 ? (
                <div className="space-y-4">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-20 bg-zinc-100 border border-zinc-200 rounded-xl animate-pulse"></div>)}
                </div>
            ) : (
                <div className="space-y-4">
                    {logs.map((log) => {
                        const styles = getActionStyles(log.action);
                        return (
                            <div key={log._id} className="saas-card p-4 flex flex-col md:flex-row items-start md:items-center gap-4 group">
                                <div className={`p-2.5 ${styles.bg} ${styles.color} rounded-lg border border-zinc-200/50 transition-colors duration-200 shadow-sm`}>
                                    {styles.icon}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${styles.bg} ${styles.color} tracking-wider border border-zinc-200/50 uppercase`}>
                                                {log.action}
                                            </span>
                                            <p className="text-[14px] font-bold text-zinc-900 leading-tight truncate max-w-[200px] sm:max-w-md group-hover:text-indigo-600 transition-colors">
                                                {log.bookmarkId?.title || 'System Protocol Action'}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[11px] font-bold text-zinc-400 whitespace-nowrap">
                                                {new Date(log.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                            <div className="h-1 w-1 rounded-full bg-zinc-200" />
                                            <span className="text-[11px] font-bold text-zinc-400 flex items-center gap-1.5 whitespace-nowrap">
                                                <Clock size={10} />
                                                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {log.bookmarkId?.url && (
                                    <a
                                        href={log.bookmarkId.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-lg text-[11px] font-bold text-zinc-500 hover:text-zinc-900 transition-all group/btn shadow-sm"
                                    >
                                        Inspect Node <ArrowRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
                                    </a>
                                )}
                            </div>
                        );
                    })}

                    <div className="flex flex-col sm:flex-row justify-between items-center mt-10 gap-4 p-5 rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50/30">
                        <p className="text-[12px] font-bold text-zinc-500">
                            Telemetry: <span className="text-zinc-900">{logs.length}</span> of <span className="text-zinc-900">{total}</span> events mapped.
                        </p>
                        <div className="flex gap-2">
                            <button
                                disabled={page === 1}
                                onClick={() => { setPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                className="px-5 py-2.5 bg-white border border-zinc-200 rounded-xl text-[12px] font-bold text-zinc-500 disabled:opacity-30 hover:bg-zinc-50 hover:text-zinc-900 transition-all shadow-sm"
                            >
                                Previous
                            </button>
                            <button
                                disabled={logs.length < 10}
                                onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 border border-indigo-600 text-white rounded-xl text-[12px] font-bold disabled:opacity-30 transition-all shadow-lg shadow-indigo-600/10 active:scale-95"
                            >
                                Next Horizon
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Activity;
