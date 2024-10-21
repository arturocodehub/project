import { useState } from 'react'
import { useSelector } from 'react-redux'

function GoalForm({ onSubmit }) {
  const [text, setText] = useState('')
  const [recipientName, setRecipientName] = useState('')
  const [recipientEmail, setRecipientEmail] = useState('')
  const [amount, setAmount] = useState('')

  const [lastTransaction, setLastTransaction] = useState(null)

  const user = useSelector((state) => state.auth.user)

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!text || !recipientName || !recipientEmail || !amount || !user) {
      alert('Please fill out all fields')
      return
    }

    const transaction = {
      text,
      recipientName,
      recipientEmail,
      senderEmail: user.email, // El email del remitente al momento de la transacción
      amount,
    }

    if (
      lastTransaction &&
      lastTransaction.text === transaction.text &&
      lastTransaction.recipientName === transaction.recipientName &&
      lastTransaction.recipientEmail === transaction.recipientEmail &&
      lastTransaction.amount === transaction.amount &&
      lastTransaction.senderEmail === transaction.senderEmail
    ) {
      alert('You have already submitted this transaction')
      return
    }

    onSubmit(transaction)

    setLastTransaction(transaction)

    setText('')
    setRecipientName('')
    setRecipientEmail('')
    setAmount('')
  }

  return (
    <section className='form'>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='recipientName'>Recipient Name</label>
          <input
            type='text'
            name='recipientName'
            id='recipientName'
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            placeholder="Enter recipient's name"
          />
        </div>
        <div className='form-group'>
          <label htmlFor='recipientEmail'>Recipient Email</label>
          <input
            type='email'
            name='recipientEmail'
            id='recipientEmail'
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            placeholder="Enter recipient's email"
          />
        </div>
        <div className='form-group'>
          <label htmlFor='amount'>Amount</label>
          <input
            type='number'
            name='amount'
            id='amount'
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount to send"
          />
        </div>

        <div className='form-group'>
          <label htmlFor='text'>Details</label>
          <input
            type='text'
            name='text'
            id='text'
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter transaction details"
          />
        </div>

        <div className='form-group'>
          <button className='btn btn-block' type='submit'>
            Send Money
          </button>
        </div>
      </form>
    </section>
  )
}

export default GoalForm














