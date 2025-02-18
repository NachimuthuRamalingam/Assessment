// controllers/researchProgramController.js

const ResearchProgram = require('../models/researchProgram');
const Participant = require('../models/participant');
const { getChannel } = require('../config/rabbitmq');

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
      participants: [loggedInParticipantId],
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

const getResearchProgramById = async (req, res) => {
  try {
    const { id } = req.params;
    const program = await ResearchProgram.findById(id).populate('participants');

    if (!program) {
      return res.status(404).json({ message: 'Research Program not found' });
    }

    res.json(program);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error });
  }
};
const updateResearchProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedProgram = await ResearchProgram.findByIdAndUpdate(
      id,
      updatedData,
      {
        new: true,
      }
    );

    if (!updatedProgram) {
      return res.status(404).json({ message: 'Research Program not found' });
    }

    res.json({ message: 'Research Program updated', updatedProgram });
  } catch (error) {
    res.status(500).json({ message: 'Error updating data', error });
  }
};

const deleteResearchProgram = async (req, res) => {
  try {
    const { id } = req.params;
    //const channel = getChannel();

    if (!channel) {
      return res
        .status(500)
        .json({ message: 'RabbitMQ channel not available' });
    }

    const deletedProgram = await ResearchProgram.findByIdAndDelete(id);
    if (!deletedProgram) {
      return res.status(404).json({ message: 'Research Program not found' });
    }

    // channel.sendToQueue(
    //   'auditQueue',
    //   Buffer.from(JSON.stringify(deletedProgram))
    // );

    res.json({
      message: 'Research Program deleted and request sent to RabbitMQ',
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting data', error });
  }
};

module.exports = {
  createResearchProgram,
  getAllResearchPrograms,
  getResearchProgramById,
  updateResearchProgram,
  deleteResearchProgram,
};
