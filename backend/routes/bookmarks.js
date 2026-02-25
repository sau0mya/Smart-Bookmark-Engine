const express = require('express');
const {
    getBookmarks,
    getBookmark,
    createBookmark,
    updateBookmark,
    deleteBookmark,
    getBookmarkRead,
    bulkDelete,
    bulkUpdateStatus
} = require('../controllers/bookmarks');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
    .get(getBookmarks)
    .post(createBookmark);

router.post('/bulk-delete', bulkDelete);
router.post('/bulk-update-status', bulkUpdateStatus);
router.get('/:id/read', getBookmarkRead);

router.route('/:id')
    .get(getBookmark)
    .put(updateBookmark)
    .delete(deleteBookmark);

module.exports = router;
