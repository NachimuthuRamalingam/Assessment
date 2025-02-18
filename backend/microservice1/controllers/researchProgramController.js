// controllers/researchProgramController.js

const ResearchProgram = require('../models/researchProgram');
const Participant = require('../models/participant');

const createResearchProgram = async (req, res) => {
  try {
    const { programName, startDate, endDate, budget } = req.body;
    const loggedInParticipantId = req.user.userId;

    const program = new ResearchProgram({
      programName,
      startDate,
      endDate,
      budget,
      attachment: req.file ? req.file.path : null,
      participants: [loggedInParticipantId], // Store logged-in participant ID
    });

    await program.save();
    res.status(201).json({ message: 'Research Program created', program });
  } catch (error) {
    res.status(500).json({ message: 'Error saving data', error });
  }
};

const getAllResearchPrograms = async (req, res) => {
  try {
    const programs = await ResearchProgram.find().populate('participants');
    res.json(programs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error });
  }
};

module.exports = { createResearchProgram, getAllResearchPrograms };
