import React from 'react';
import { X, ExternalLink } from 'lucide-react';

const ReaderModal = ({ bookmark, onClose }) => {
    if (!bookmark) return null;

    return (
        <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-[150] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
            <div className="bg-white border border-zinc-200 w-full max-w-4xl h-full max-h-[90vh] rounded-2xl overflow-hidden flex flex-col shadow-2xl shadow-zinc-900/20">
                {/* Header */}
                <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                    <div className="flex-1 min-w-0 pr-6">
                        <h2 className="text-lg font-extrabold text-zinc-900 truncate tracking-tight">{bookmark.title}</h2>
                        <a
                            href={bookmark.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 text-[11px] font-bold hover:text-indigo-500 flex items-center gap-1.5 mt-0.5 transition-colors"
                        >
                            Sync with Source <ExternalLink size={10} />
                        </a>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-zinc-100 border border-transparent hover:border-zinc-200 rounded-xl text-zinc-400 hover:text-zinc-900 transition-all shadow-sm"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 md:p-16 selection:bg-indigo-500/10">
                    <div
                        className="prose prose-zinc max-w-none 
                        prose-headings:text-zinc-900 prose-headings:font-black prose-headings:tracking-tighter
                        prose-p:text-zinc-600 prose-p:leading-relaxed prose-p:text-base
                        prose-strong:text-zinc-900 prose-strong:font-bold
                        prose-a:text-indigo-600 hover:prose-a:text-indigo-500 prose-a:font-bold prose-a:no-underline hover:prose-a:underline
                        prose-img:rounded-2xl prose-img:border prose-img:border-zinc-200 prose-img:shadow-lg
                        prose-code:text-indigo-600 prose-code:bg-indigo-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none"
                        dangerouslySetInnerHTML={{ __html: bookmark.content }}
                    />
                </div>

                {/* Footer / Context */}
                <div className="px-6 py-4 border-t border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Reader Terminal v1.0</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReaderModal;
