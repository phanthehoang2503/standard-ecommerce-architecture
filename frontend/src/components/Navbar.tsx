import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-14">
          <Link to="/" className="text-xl font-bold text-primary-700 tracking-tight flex items-center gap-2">
            E-Shop
          </Link>

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
                  className="text-sm font-medium text-slate-600 hover:text-red-600 transition-colors"
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
      </div>
    </nav>
  );
}
