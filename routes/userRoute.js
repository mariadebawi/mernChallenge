const express = require('express');
const {
    GetAllUsers,
    GetUserById,
    DeleteUser,
    UpdateUser,
    UpdateProfile
} = require('../controllers/userCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();


router.get('/allUsers', GetAllUsers)
router.get('/:id', authMiddleware, GetUserById)
router.delete('/:id', authMiddleware, isAdmin, DeleteUser)
router.put('/:id', authMiddleware, isAdmin, UpdateUser)
router.put("/profile/edit-profile", authMiddleware, UpdateProfile);//updateME , updateProfile

module.exports = router