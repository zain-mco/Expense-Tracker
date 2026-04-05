import { useState } from 'react';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (email === 'admin@zain.com' && password === 'Admin123') {
      const rememberMe = window.confirm("Do you want us to remember your login on this device?");
      onLoginSuccess(rememberMe);
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none" />
      
      <div className="glass-panel p-8 w-full max-w-md relative z-10 animate-fade-in-up md:p-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 mb-6 shadow-lg shadow-blue-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
          <p className="text-slate-400 mt-2 text-sm">Sign in securely to manage your expenses</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className="input-field"
              placeholder="admin@zain.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="primary-btn mt-6">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
