import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import ProductDetail from './pages/ProductDetail';
import OrderDetail from './pages/OrderDetail';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/order/:id" element={<OrderDetail />} />
        </Routes>
      </main>
      <footer className="bg-white border-t border-slate-200 mt-auto py-6 text-center text-slate-500">
        <p>&copy; {new Date().getFullYear()} E-Shop Intern Project. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
