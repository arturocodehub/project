const asyncHandler = require('express-async-handler');
const Goal = require('../models/goalModel');
const User = require('../models/userModel');

// @desc    Get goals (fetch all transactions for the logged-in user)
// @route   GET /api/goals
// @access  Private
const getGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ user: req.user.id });

  if (!goals) {
    res.status(404);
    throw new Error('No goals found');
  }

  res.status(200).json(goals);
});

// @desc    Set goal (create a new transaction)
// @route   POST /api/goals
// @access  Private
const setGoal = asyncHandler(async (req, res) => {
  const { text, recipientName, recipientEmail, amount } = req.body;

  if (!text || !recipientName || !recipientEmail || !amount) {
    res.status(400);
    throw new Error('Please add all required fields');
  }

  const recipientUser = await User.findOne({ email: recipientEmail });

  if (!recipientUser) {
    res.status(404);
    throw new Error('Recipient not found');
  }

  const goal = await Goal.create({
    text,
    recipientName,
    recipientEmail,
    senderEmail: req.user.email,  // Guardar el email del remitente
    amount,
    user: req.user.id,  // Relacionar la transacción con el usuario que la creó (remitente)
  });

  const receivedTransaction = await Goal.create({
    text,
    recipientName: req.user.name,  // El nombre del remitente
    recipientEmail: req.user.email,  // El correo del remitente
    senderEmail: req.user.email,  // Guardar correctamente el email del remitente
    amount,
    user: recipientUser._id,  // Relacionar la transacción con el destinatario
  });

  res.status(201).json({
    sentTransaction: goal,
    receivedTransaction: receivedTransaction
  });
});

// @desc    Update goal (update an existing transaction)
// @route   PUT /api/goals/:id
// @access  Private
const updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);

  if (!goal) {
    res.status(404);
    throw new Error('Transaction not found');
  }

  if (!req.user) {
    res.status(401);
    throw new Error('User not found');
  }

  if (goal.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedGoal);
});

// @desc    Delete goal (delete an existing transaction)
// @route   DELETE /api/goals/:id
// @access  Private
const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);

  if (!goal) {
    res.status(404);
    throw new Error('Transaction not found');
  }

  if (!req.user) {
    res.status(401);
    throw new Error('User not found');
  }

  if (goal.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await goal.remove();

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getGoals,
  setGoal,
  updateGoal,
  deleteGoal,
};







