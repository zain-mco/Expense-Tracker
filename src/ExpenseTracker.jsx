import { useState, useEffect } from 'react';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';

function ExpenseTracker({ onLogout }) {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Determine API URL based on environment and current hostname so phone access works natively
  const getApiUrl = () => {
    if (import.meta.env.DEV) {
      return `http://${window.location.hostname}/Expense Tracker/api.php`;
    }
    // In production (served from XAMPP), assume api.php is in the same directory
    const pathname = window.location.pathname;
    const base = pathname.substring(0, pathname.lastIndexOf('/'));
    return `${window.location.origin}${base}/api.php`;
  };

  const API_URL = getApiUrl();

  useEffect(() => {
    // Fetch data from API on mount
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Auto-prune by 1 year logic
          const oneYearAgo = new Date();
          oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
          
          let loaded = data.filter(exp => {
            const d = new Date(exp.date || parseInt(exp.id));
            return d >= oneYearAgo;
          });
          setExpenses(loaded);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch expenses:", err);
        setIsLoading(false);
      });
  }, []);

  const handleAddExpense = (expense) => {
    const newExpense = {
      id: Date.now().toString(),
      ...expense
    };
    
    // Optimistic UI update
    setExpenses([newExpense, ...expenses]);

    // Send to database
    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newExpense)
    }).catch(err => {
      console.error("Failed to save expense:", err);
      // Optional: rollback on error
    });
  };

  const handleDeleteExpense = (id) => {
    // Optimistic UI update
    setExpenses(expenses.filter(e => e.id !== id));

    // Delete from database
    fetch(`${API_URL}?id=${id}`, {
      method: 'DELETE'
    }).catch(err => {
      console.error("Failed to delete expense:", err);
      // Optional: rollback on error
    });
  };

  const totalSpent = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);

  // Grouping by Month for the Comparison View
  const monthlyTotals = expenses.reduce((acc, curr) => {
    const d = new Date(curr.date || parseInt(curr.id));
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    acc[key] = (acc[key] || 0) + Number(curr.amount);
    return acc;
  }, {});

  const sortedMonths = Object.keys(monthlyTotals).sort((a,b) => b.localeCompare(a)); // Descending sort

  return (
    <div className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-8 flex flex-col gap-6 relative">
      <header className="flex items-center justify-between glass-panel p-4 px-6 rounded-2xl z-10 w-full sticky top-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white hidden sm:block">ExpenseTracker</h1>
        </div>
        <button onClick={onLogout} className="secondary-btn text-sm">
          Logout
        </button>
      </header>

      <div className="glass-panel p-8 text-center relative overflow-hidden group rounded-3xl mt-2">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 group-hover:opacity-100 opacity-50 transition-opacity duration-500" />
        <h2 className="text-slate-400 font-medium mb-3 relative z-10 text-sm uppercase tracking-wider">Total Spent (Yearly)</h2>
        <div className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 relative z-10 drop-shadow-sm">
          ${totalSpent.toFixed(2)}
        </div>
      </div>

      {sortedMonths.length > 0 && (
        <div className="glass-panel p-6 mt-2">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
             </svg>
             Monthly Comparison
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sortedMonths.map(month => {
              const [y, m] = month.split('-');
              const dateObj = new Date(y, m - 1);
              const monthName = dateObj.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
              return (
                <div key={month} className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50 flex flex-col justify-center items-center hover:bg-slate-800/80 transition-colors">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">{monthName}</span>
                  <span className="text-2xl font-bold tracking-tight text-blue-400 font-mono">${monthlyTotals[month].toFixed(2)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-2">
        <div className="md:col-span-4">
          <div className="glass-panel p-6 sm:sticky sm:top-[120px]">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
               </svg>
               Add Expense
            </h3>
            <ExpenseForm onAddExpense={handleAddExpense} />
          </div>
        </div>
        
        <div className="md:col-span-8">
          <div className="glass-panel p-6 min-h-[400px]">
             <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700/50">
               <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
               <span className="text-xs font-semibold bg-slate-800 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full shadow-inner">
                 {expenses.length} Records
               </span>
             </div>
             <ExpenseList expenses={expenses} onDelete={handleDeleteExpense} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExpenseTracker;
