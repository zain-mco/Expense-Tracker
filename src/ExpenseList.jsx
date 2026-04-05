function ExpenseList({ expenses, onDelete }) {
  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] text-slate-500 bg-slate-800/20 rounded-2xl border border-dashed border-slate-700/50">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="font-medium text-slate-400">No expenses logged yet.</p>
        <p className="text-sm mt-1 text-slate-500">Your transactions will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
      {expenses.map((expense) => (
        <div 
          key={expense.id} 
          className="flex items-center justify-between p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-slate-500 hover:bg-slate-800/80 transition-all duration-300 group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center text-blue-400 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h4 className="text-slate-200 font-medium tracking-wide">{expense.description}</h4>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {new Date(expense.date || parseInt(expense.id)).toLocaleDateString(undefined, { 
                    year: 'numeric', month: 'short', day: 'numeric'
                })}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-5">
            <span className="text-lg font-bold text-white tracking-wide font-mono">
              ${Number(expense.amount).toFixed(2)}
            </span>
            <button 
              onClick={() => onDelete(expense.id)}
              className="danger-btn lg:opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 transform active:scale-95"
              title="Delete Expense"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ExpenseList;
