import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [search, setSearch] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/?keyword=${encodeURIComponent(search.trim())}`);
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-14">
          <Link to="/" className="text-xl font-bold text-primary-700 tracking-tight flex items-center gap-2">
            E-Shop
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-l px-3 py-1.5 text-sm focus:outline-none focus:bg-white focus:border-primary-400 focus:ring-1 focus:ring-primary-400 transition-colors"
            />
            <button
              type="submit"
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-1.5 text-sm font-medium rounded-r transition-colors"
            >
              Search
            </button>
          </form>

          <div className="flex gap-5 items-center">
            <Link to="/cart" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">
              Cart
            </Link>

            {token ? (
              <>
                <Link to="/profile" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-slate-600 hover:text-red-600 transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="text-sm font-medium bg-primary-600 text-white px-3 py-1.5 rounded hover:bg-primary-700 transition-colors shadow-sm">
                Log In
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-l px-3 py-1.5 text-sm focus:outline-none focus:bg-white focus:border-primary-400"
            />
            <button
              type="submit"
              className="bg-primary-600 text-white px-3 py-1.5 text-sm font-medium rounded-r"
            >
              Go
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}
