import { useDispatch } from 'react-redux'
import { deleteGoal } from '../features/goals/goalSlice'

function GoalItem({ goal }) {
  const dispatch = useDispatch()

  return (
    <div className='goal'>
      {/* Mostramos la fecha de creación de la transacción */}
      <div>{new Date(goal.createdAt).toLocaleString('en-US')}</div>
      
      {/* Mostramos los detalles de la transacción */}
      <h2>Transaction Details: {goal.text}</h2>
      <h3>Recipient Name: {goal.recipientName ? goal.recipientName : 'N/A'}</h3>
      <h3>Recipient Email: {goal.recipientEmail ? goal.recipientEmail : 'N/A'}</h3>
      <h3>Amount: {goal.amount ? goal.amount : 'N/A'}</h3>
      
      {/* Botón para eliminar la transacción */}
      <button onClick={() => dispatch(deleteGoal(goal._id))} className='close'>
        X
      </button>
    </div>
  )
}

export default GoalItem

