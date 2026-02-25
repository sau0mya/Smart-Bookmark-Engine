import api from './api';

export const getCollections = async () => {
    const response = await api.get('/collections');
    return response.data;
};

export const getCollection = async (id) => {
    const response = await api.get(`/collections/${id}`);
    return response.data;
};

export const createCollection = async (collectionData) => {
    const response = await api.post('/collections', collectionData);
    return response.data;
};

export const updateCollection = async (id, collectionData) => {
    const response = await api.put(`/collections/${id}`, collectionData);
    return response.data;
};

export const deleteCollection = async (id) => {
    const response = await api.delete(`/collections/${id}`);
    return response.data;
};

export const addBookmarksToCollection = async (id, bookmarkIds) => {
    const response = await api.put(`/collections/${id}/add-bookmarks`, { bookmarkIds });
    return response.data;
};

export const removeBookmarksFromCollection = async (id, bookmarkIds) => {
    const response = await api.put(`/collections/${id}/remove-bookmarks`, { bookmarkIds });
    return response.data;
};
