const express = require('express');
const multer = require('multer');
const {
  createResearchProgram,
  getAllResearchPrograms,
  getResearchProgramById,
  updateResearchProgram,
  deleteResearchProgram,
} = require('../controllers/researchProgramController');
const authenticateToken = require('../middleware/authMiddleware');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

router.post(
  '/programs',
  authenticateToken,
  upload.single('attachment'),
  createResearchProgram
);

router.get('/programs', authenticateToken, getAllResearchPrograms);
router.post('/', authenticateToken, createResearchProgram);
router.get('/', authenticateToken, getAllResearchPrograms);
//router.get('/:id', authenticateToken, getResearchProgramById);
router.put('/:id', authenticateToken, updateResearchProgram);
router.delete('/:id', authenticateToken, deleteResearchProgram);

module.exports = router;
