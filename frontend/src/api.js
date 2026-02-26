const getBaseURL = () => {
    let url = import.meta.env.VITE_API_URL || '';
    if (!url || url === '/api') return '';
    return url.replace(/\/$/, '');
};

const API_BASE = getBaseURL();

/*
  Helper function for all API requests
*/
const request = async (endpoint, options = {}) => {
    try {
        // Ensure endpoint starts with /api if it doesn't already
        let path = endpoint;
        if (!path.startsWith('/api')) {
            path = path.startsWith('/') ? `/api${path}` : `/api/${path}`;
        }

        const url = `${API_BASE}${path}`;
        console.log('[API Fetch] Calling:', url);

        const res = await fetch(url, {
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