const getBaseURL = () => {
    const url = import.meta.env.VITE_API_URL || '';
    // If it's empty or already just /api, return /api for relative routing
    if (!url || url === '/api') return '/api';
    // Ensure we don't double up or miss the /api prefix if pointing to a full domain
    return url.endsWith('/api') ? url : `${url.replace(/\/$/, '')}/api`;
};

const API_URL = getBaseURL();

/*
  Helper function for all API requests
*/
const request = async (endpoint, options = {}) => {
    try {
        // endpoint usually starts with /auth or /bookmarks
        const res = await fetch(`${API_URL}${endpoint}`, {
            headers: {
                "Content-Type": "application/json",
                ...(localStorage.getItem("token") && {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }),
            },
            ...options,
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Something went wrong");
        }

        return data;
    } catch (error) {
        console.error("API Error:", error.message);
        throw error;
    }
};

/* ===========================
   AUTH APIs
=========================== */

export const registerUser = (userData) =>
    request("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
    });

export const loginUser = (userData) =>
    request("/auth/login", {
        method: "POST",
        body: JSON.stringify(userData),
    });

/* ===========================
   BOOKMARK APIs
=========================== */

export const getBookmarks = () =>
    request("/bookmarks");

export const createBookmark = (bookmarkData) =>
    request("/bookmarks", {
        method: "POST",
        body: JSON.stringify(bookmarkData),
    });

export const deleteBookmark = (id) =>
    request(`/bookmarks/${id}`, {
        method: "DELETE",
    });

export const updateBookmark = (id, bookmarkData) =>
    request(`/bookmarks/${id}`, {
        method: "PUT",
        body: JSON.stringify(bookmarkData),
    });