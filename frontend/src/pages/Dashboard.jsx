import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import GoalForm from '../components/GoalForm'
import Spinner from '../components/Spinner'
import { getGoals, deleteGoal, reset, createGoal } from '../features/goals/goalSlice'

function Dashboard() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)
  const { isLoading, isError, message } = useSelector(
    (state) => state.goals
  )

  const [allTransactions, setAllTransactions] = useState([])

  useEffect(() => {
    if (isError) {
      console.log(message)
    }

    if (!user) {
      navigate('/login')
    }

    dispatch(getGoals()).then((action) => {
      if (Array.isArray(action.payload)) {
        setAllTransactions(action.payload)
      } else {
        console.error('El formato de los datos no es el esperado')
      }
    })

    return () => {
      dispatch(reset())
    }
  }, [user, navigate, isError, message, dispatch])

  if (isLoading) {
    return <Spinner />
  }

  // Función para manejar la eliminación de la transacción
  const handleDelete = (id) => {
    dispatch(deleteGoal(id)).then((action) => {
      if (action.meta.requestStatus === 'fulfilled') {
        // Actualizar el estado eliminando la transacción borrada
        setAllTransactions((prev) => prev.filter((goal) => goal._id !== id))
      }
    })
  }

  // Función para manejar la adición de una transacción
  const handleAddTransaction = (transaction) => {
    dispatch(createGoal(transaction)).then((action) => {
      if (action.meta.requestStatus === 'fulfilled') {
        // Después de agregar la nueva transacción, forzar la actualización de las transacciones
        dispatch(getGoals()).then((action) => {
          if (Array.isArray(action.payload)) {
            setAllTransactions(action.payload)
          }
        })
      } else {
        console.error('Error al agregar la transacción', action.payload)
      }
    })
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f4f4', padding: '20px' }}>
      {/* Header con título */}
      <header style={{ backgroundColor: '#333', padding: '20px', textAlign: 'center', color: '#fff', borderRadius: '10px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>Cryptocurrency Dashboard</h1>
      </header>

      {/* Bienvenida al usuario */}
      <section style={{ textAlign: 'center', marginTop: '20px' }}>
        <h2 style={{ fontSize: '1.5rem' }}>Welcome {user && user.name}</h2>
      </section>

      {/* Formulario para añadir transacciones */}
      <section style={{ backgroundColor: '#e9e9e9', padding: '20px', borderRadius: '10px', marginTop: '20px' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Add Transaction</h3>
        <GoalForm onSubmit={handleAddTransaction} />
        </section>

{/* Listado de transacciones */}
<section style={{ marginTop: '30px' }}>
  <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Transactions</h3>

  <h4 style={{ textAlign: 'center', marginBottom: '10px' }}>Sent Transactions</h4>
  {allTransactions.length > 0 && user ? (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
      {allTransactions
        .filter((goal) => goal.senderEmail === user.email)
        .map((goal) => (
          <div key={goal._id} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>{new Date(goal.createdAt).toLocaleString()}</div>
            <h2 style={{ fontSize: '1.2rem', margin: '10px 0' }}>Received Name: <span style={{ fontSize: '1.0rem' }}>{goal.recipientName || 'N/A'}</span></h2>
            <h2 style={{ fontSize: '1.2rem', margin: '10px 0' }}>Received Email: <span style={{ fontSize: '1.0rem' }}>{goal.recipientEmail || 'N/A'}</span></h2>
            <h2 style={{ fontSize: '1.2rem', margin: '10px 0' }}>Amount: <span style={{ fontSize: '1.0rem' }}>{goal.amount || 'Amount: N/A'}</span></h2>
            <h2 style={{ fontSize: '1.2rem', margin: '10px 0' }}>Transaction Details: <span style={{ fontSize: '1.0rem' }}>{goal.text || 'Details: N/A'}</span></h2>
            <button onClick={() => handleDelete(goal._id)} style={{ backgroundColor: '#ff5c5c', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>
              Delete
            </button>
          </div>
        ))}
    </div>
  ) : (
    <h4 style={{ textAlign: 'center', color: '#666' }}>You have not made any transactions</h4>
  )}

  <h4 style={{ textAlign: 'center', marginBottom: '10px', marginTop: '40px' }}>Received Transactions</h4>
  {allTransactions.length > 0 && user ? (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
      {allTransactions
        .filter((goal) => goal.senderEmail !== user.email)
        .map((goal) => (
          <div key={goal._id} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>{new Date(goal.createdAt).toLocaleString()}</div>
            <h2 style={{ fontSize: '1.2rem', margin: '10px 0' }}>Sender Name: <span style={{ fontSize: '1.0rem' }}>{goal.recipientName || 'N/A'}</span></h2>
            <h2 style={{ fontSize: '1.2rem', margin: '10px 0' }}>Sender Email: <span style={{ fontSize: '1.0rem' }}>{goal.senderEmail || 'N/A'}</span></h2>
            <h2 style={{ fontSize: '1.2rem', margin: '10px 0' }}>Amount: <span style={{ fontSize: '1.0rem' }}>{goal.amount || 'Amount: N/A'}</span></h2>
            <h2 style={{ fontSize: '1.2rem', margin: '10px 0' }}>Transaction Details: <span style={{ fontSize: '1.0rem' }}>{goal.text || 'Details: N/A'}</span></h2>
            <button onClick={() => handleDelete(goal._id)} style={{ backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>
             Delete
            </button>

          </div>
        ))}
    </div>
  ) : (
    <h4 style={{ textAlign: 'center', color: '#666' }}>No received transactions</h4>
  )}
</section>



    </div>
  )
}

export default Dashboard






         