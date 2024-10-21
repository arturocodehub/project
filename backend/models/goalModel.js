const mongoose = require('mongoose')

const goalSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    text: {
      type: String,
      required: [true, 'Please add a text value'],
    },
    recipientName: {
      type: String,
      default: ''  // Usamos una cadena vacía por defecto
    },
    recipientEmail: {
      type: String,
      default: ''  // Usamos una cadena vacía por defecto
    },
    senderEmail: {
      type: String,
      default: ''  // Usamos una cadena vacía por defecto
    },
    amount: {
      type: Number,
      default: null  // Usamos null para números que pueden no estar presentes
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Goal', goalSchema)



