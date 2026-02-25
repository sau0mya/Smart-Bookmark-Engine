const express = require('express');
const {
    getCollections,
    getCollection,
    createCollection,
    updateCollection,
    deleteCollection,
    addBookmarksToCollection,
    removeBookmarksFromCollection
} = require('../controllers/collections');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
    .get(getCollections)
    .post(createCollection);

router.route('/:id')
    .get(getCollection)
    .put(updateCollection)
    .delete(deleteCollection);

router.put('/:id/add-bookmarks', addBookmarksToCollection);
router.put('/:id/remove-bookmarks', removeBookmarksFromCollection);

module.exports = router;
