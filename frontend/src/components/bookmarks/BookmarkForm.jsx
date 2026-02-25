import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
    title: yup.string().required('Title is required'),
    url: yup.string().url('Invalid URL format').required('URL is required'),
    description: yup.string().max(500, 'Description too long'),
    category: yup.string().required('Category is required'),
    status: yup.string().oneOf(['normal', 'favorite', 'archived']).required('Status is required'),
}).required();

const BookmarkForm = ({ onSubmit, initialData, isLoading, onCancel }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: initialData || {
            status: 'normal',
            category: 'General'
        }
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
                <label className="block text-[11px] font-bold text-zinc-600 uppercase tracking-widest mb-1.5 ml-1">Title</label>
                <input
                    {...register('title')}
                    className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2.5 focus:border-indigo-500/30 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all text-sm text-zinc-700 placeholder:text-zinc-400 font-medium shadow-sm"
                    placeholder="e.g. Cognitive Load Theory in UI"
                />
                {errors.title && <p className="text-rose-500 text-[11px] font-bold mt-1.5 ml-1">{errors.title.message}</p>}
            </div>

            <div>
                <label className="block text-[11px] font-bold text-zinc-600 uppercase tracking-widest mb-1.5 ml-1">Resource URL</label>
                <input
                    {...register('url')}
                    className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2.5 focus:border-indigo-500/30 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all text-sm text-zinc-700 placeholder:text-zinc-400 font-medium shadow-sm"
                    placeholder="https://research.paper/cognitive-load"
                />
                {errors.url && <p className="text-rose-500 text-[11px] font-bold mt-1.5 ml-1">{errors.url.message}</p>}
            </div>

            <div>
                <label className="block text-[11px] font-bold text-zinc-600 uppercase tracking-widest mb-1.5 ml-1">Context / Description</label>
                <textarea
                    {...register('description')}
                    className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2.5 focus:border-indigo-500/30 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all h-28 text-sm text-zinc-700 placeholder:text-zinc-400 font-medium resize-none shadow-sm"
                    placeholder="Notes on why this resource is being tracked..."
                />
                {errors.description && <p className="text-rose-500 text-[11px] font-bold mt-1.5 ml-1">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-5">
                <div>
                    <label className="block text-[11px] font-bold text-zinc-600 uppercase tracking-widest mb-1.5 ml-1">Stream / Category</label>
                    <input
                        {...register('category')}
                        className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2.5 focus:border-indigo-500/30 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all text-sm text-zinc-700 placeholder:text-zinc-400 font-medium shadow-sm"
                        placeholder="Research, Design..."
                    />
                    {errors.category && <p className="text-rose-500 text-[11px] font-bold mt-1.5 ml-1">{errors.category.message}</p>}
                </div>

                <div>
                    <label className="block text-[11px] font-bold text-zinc-600 uppercase tracking-widest mb-1.5 ml-1">Priority State</label>
                    <select
                        {...register('status')}
                        className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-2.5 focus:border-indigo-500/30 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all appearance-none text-sm text-zinc-600 font-bold shadow-sm cursor-pointer"
                    >
                        <option value="normal">Normal Node</option>
                        <option value="favorite">Prioritized</option>
                        <option value="archived">Vaulted</option>
                    </select>
                    {errors.status && <p className="text-rose-500 text-[11px] font-bold mt-1.5 ml-1">{errors.status.message}</p>}
                </div>
            </div>

            <div className="flex justify-end items-center gap-4 pt-6 border-t border-zinc-100 mt-2">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-5 py-2.5 text-zinc-500 hover:text-zinc-900 text-[11px] font-bold uppercase tracking-widest transition-colors"
                    >
                        Abort
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-300 text-white px-7 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/10 active:scale-95"
                >
                    {isLoading ? 'Processing...' : 'Sync Node'}
                </button>
            </div>
        </form>
    );
};

export default BookmarkForm;
