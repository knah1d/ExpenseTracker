import { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ title: '', amount: '', category: '' });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', amount: '', category: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await axios.get('/expenses');
        setExpenses(res.data);
      } catch (err) {
        alert('Failed to fetch expenses');
      }
    };
    fetchExpenses();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleEditChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/expenses', form);
      setExpenses([res.data, ...expenses]);
      setForm({ title: '', amount: '', category: '' });
    } catch (err) {
      alert('Add failed');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/expenses/${id}`);
      setExpenses(expenses.filter(e => e._id !== id));
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleEdit = (expense) => {
    setEditingId(expense._id);
    setEditForm({
      title: expense.title,
      amount: expense.amount,
      category: expense.category
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`/expenses/${editingId}`, editForm);
      setExpenses(expenses.map(e => e._id === editingId ? res.data : e));
      setEditingId(null);
    } catch (err) {
      alert('Update failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Expense Tracker</h2>
        <button onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600">
          Logout
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input name="title" value={form.title} onChange={handleChange}
          className="border px-2 py-1 flex-1 rounded" placeholder="Title" required />
        <input name="amount" value={form.amount} onChange={handleChange} type="number"
          className="border px-2 py-1 w-24 rounded" placeholder="Amount" required />
        <input name="category" value={form.category} onChange={handleChange}
          className="border px-2 py-1 flex-1 rounded" placeholder="Category" required />
        <button type="submit"
          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">
          Add
        </button>
      </form>

      <ul className="space-y-3">
        {expenses.map(exp =>
          editingId === exp._id ? (
            <li key={exp._id} className="bg-gray-100 p-3 rounded">
              <form onSubmit={handleUpdate} className="flex gap-2">
                <input name="title" value={editForm.title} onChange={handleEditChange}
                  className="border px-2 py-1 flex-1 rounded" />
                <input name="amount" value={editForm.amount} onChange={handleEditChange} type="number"
                  className="border px-2 py-1 w-24 rounded" />
                <input name="category" value={editForm.category} onChange={handleEditChange}
                  className="border px-2 py-1 flex-1 rounded" />
                <button type="submit"
                  className="bg-green-500 text-white px-3 rounded hover:bg-green-600">
                  Save
                </button>
              </form>
            </li>
          ) : (
            <li key={exp._id} className="bg-white shadow p-3 rounded flex justify-between items-center">
              <div>
                <p className="font-semibold">{exp.title}</p>
                <p className="text-sm text-gray-600">${exp.amount} - {exp.category}</p>
              </div>
              <div className="space-x-2">
                <button onClick={() => handleEdit(exp)}
                  className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500">
                  Edit
                </button>
                <button onClick={() => handleDelete(exp._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                  Delete
                </button>
              </div>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default Dashboard;
