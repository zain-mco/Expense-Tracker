import { useState } from 'react';

function ExpenseForm({ onAddExpense }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim() || !amount) return;

    onAddExpense({
      description: description.trim(),
      amount: parseFloat(amount),
      date: date || new Date().toISOString().split('T')[0]
    });

    setDescription('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-2 font-semibold">Expense Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g., Weekly Groceries"
          required
          className="input-field shadow-inner"
        />
      </div>
      
      <div>
        <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-2 font-semibold">Amount ($)</label>
        <input
          type="number"
          step="0.01"
          min="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          required
          className="input-field shadow-inner font-mono text-lg"
        />
      </div>

      <div>
        <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-2 font-semibold">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="input-field shadow-inner"
        />
      </div>

      <div className="pt-2">
        <button type="submit" className="primary-btn flex justify-center items-center gap-2">
          Add to Tracker
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" />
          </svg>
        </button>
      </div>
    </form>
  );
}

export default ExpenseForm;
