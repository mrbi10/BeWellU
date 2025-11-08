import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';

export default function Login() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const validUsers = {
      mrbi: { name: 'Mrbi', password: 'mrbi@123' },
      nilaaaa: { name: 'Nilaaaa', password: 'nilaaaa@123' },
    };

    const username = name.toLowerCase().trim();
    const user = validUsers[username];

    if (user && password === user.password) {
      const userData = {
        name: user.name,
        email: `${user.name.toLowerCase()}@local.app`,
      };
      localStorage.setItem('user', JSON.stringify(userData));
      toast.success(`Welcome ${user.name} 💖`);
      navigate('/home');
      window.location.reload();
    } else {
      toast.error('Invalid name or password 😢');
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-rose-50 to-blue-100 relative overflow-hidden">
      {/* floating hearts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-300 opacity-30"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, -60],
              opacity: [0.3, 0.8, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            💞
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-xl w-full max-w-sm relative z-10 text-center border border-pink-200"
      >
        <div className="flex justify-center mb-4">
          <Heart className="text-rose-500" size={40} />
        </div>
        <h1 className="text-2xl font-semibold text-rose-600 mb-1">Welcome 💖</h1>
        <p className="text-sm text-rose-400 mb-6">Login as Mrbi or Nilaaa 💞</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            className="w-full px-4 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-rose-400 outline-none"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full px-4 py-2 border border-pink-200 rounded-lg focus:ring-2 focus:ring-rose-400 outline-none"
            required
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-300 to-blue-300 text-rose-700 drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)] py-2 rounded-xl hover:scale-[1.03] transition-transform font-medium shadow-md"
          >
            Login 💕
          </button>
        </form>
      </motion.div>
    </div>
  );
}
