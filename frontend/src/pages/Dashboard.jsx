import React, { useEffect, useState } from 'react';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Bookmark, Star, Archive, Zap, TrendingUp, Filter } from 'lucide-react';
import api from '../services/api';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [analyticsRes, insightsRes] = await Promise.all([
                    api.get('/analytics'),
                    api.get('/analytics/insights')
                ]);
                setData(analyticsRes.data.data);
                setInsights(insightsRes.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="animate-pulse space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-800 rounded-2xl"></div>)}
            </div>
            <div className="h-96 bg-slate-800 rounded-2xl"></div>
        </div>
    );

    if (!data || !data.stats) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-zinc-200 shadow-sm">
                <p className="text-zinc-500 font-bold">Failed to load analytics data.</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 text-indigo-600 font-bold hover:underline"
                >
                    Retry Connection
                </button>
            </div>
        );
    }

    const COLORS = ['#6366f1', '#10b981', '#64748b', '#71717a', '#a1a1aa'];

    const statusData = [
        { name: 'Normal', value: (data.stats.totalBookmarks || 0) - (data.stats.favoritesCount || 0) - (data.stats.archivedCount || 0) },
        { name: 'Favorite', value: data.stats.favoritesCount || 0 },
        { name: 'Archived', value: data.stats.archivedCount || 0 },
    ].filter(d => d.value > 0);

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">Intelligence Overview</h2>
                    <p className="text-zinc-500 text-sm font-medium">Monitoring and analytics for your digital stream.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="bg-white border border-zinc-200 hover:border-zinc-300 text-zinc-600 px-4 py-2 rounded-lg text-xs font-bold flex items-center space-x-2 transition-all shadow-sm">
                        <Filter size={14} />
                        <span>Filter Metrics</span>
                    </button>
                    <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg shadow-indigo-600/10 active:scale-95">
                        Refresh Node
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="saas-card p-6 group">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Total Nodes</p>
                        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 border border-indigo-100 transition-colors">
                            <Bookmark size={17} />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold text-zinc-900 tracking-tight">{data.stats.totalBookmarks}</h3>
                        <span className="text-emerald-600 text-[11px] font-bold">+12%</span>
                    </div>
                    <p className="text-zinc-500 text-[11px] mt-2 font-medium">Growth in the last 7 days</p>
                </div>

                <div className="saas-card p-6 group">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Active Priority</p>
                        <div className="p-2 bg-amber-50 rounded-lg text-amber-600 border border-amber-100 transition-colors">
                            <Star size={17} />
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold text-zinc-900 tracking-tight">{data.stats.favoritesCount}</h3>
                    <p className="text-zinc-500 text-[11px] mt-2 font-medium">Curation rate: {((data.stats.favoritesCount / data.stats.totalBookmarks) * 100).toFixed(0)}%</p>
                </div>

                <div className="saas-card p-6 group">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Vaulted Assets</p>
                        <div className="p-2 bg-zinc-100 rounded-lg text-zinc-600 border border-zinc-200 transition-colors">
                            <Archive size={17} />
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold text-zinc-900 tracking-tight">{data.stats.archivedCount}</h3>
                    <p className="text-zinc-500 text-[11px] mt-2 font-medium">Long-term node storage</p>
                </div>
            </div>

            {/* Main Stats Area */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 saas-card p-6">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                            <TrendingUp size={16} className="text-indigo-600" />
                            Engagement Velocity
                        </h3>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.activityTrend}>
                                <CartesianGrid strokeDasharray="4 4" stroke="#f1f1f1" vertical={false} />
                                <XAxis dataKey="_id" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} dx={-10} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '10px', fontSize: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.03)' }}
                                    itemStyle={{ color: '#18181b', fontWeight: 'bold' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#4f46e5"
                                    strokeWidth={2.5}
                                    dot={{ r: 0 }}
                                    activeDot={{ r: 5, fill: '#4f46e5', stroke: '#fff', strokeWidth: 2 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="saas-card p-6 flex flex-col">
                    <h3 className="text-sm font-bold text-zinc-900 mb-6 flex items-center gap-2">
                        <Zap size={16} className="text-indigo-600" />
                        AI Neural Insights
                    </h3>
                    <div className="space-y-3 flex-1 overflow-y-auto pr-2">
                        {insights.map((insight, idx) => (
                            <div key={idx} className="p-4 bg-zinc-50 rounded-xl border border-zinc-200/50 group hover:border-zinc-300 transition-all">
                                <div className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5"></div>
                                    <p className="text-zinc-600 text-[13px] font-medium leading-relaxed">{insight}</p>
                                </div>
                            </div>
                        ))}
                        {insights.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full py-12 space-y-3">
                                <div className="w-8 h-8 rounded-full border-2 border-zinc-200 border-t-indigo-500 animate-spin" />
                                <p className="text-zinc-500 text-[11px] font-bold">Parsing Data Streams...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="saas-card p-6">
                    <h3 className="text-sm font-bold text-zinc-900 mb-8">Node Distribution</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.categories} layout="vertical" margin={{ left: -20 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="_id" type="category" stroke="#71717a" fontSize={11} width={80} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '10px', fontSize: '12px' }}
                                    cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                                />
                                <Bar dataKey="count" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={18}>
                                    {data.categories.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} opacity={0.8} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="saas-card p-6">
                    <h3 className="text-sm font-bold text-zinc-900 mb-8">Library Composition</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={85}
                                    paddingAngle={6}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} opacity={0.8} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '10px', fontSize: '12px' }}
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#71717a', paddingTop: '10px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
