import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FaGithub } from "react-icons/fa";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, signInWithGitHub, signOut } = useAuth();
  const displayName = user?.user_metadata?.user_name || user?.email;
  const avatar = user?.user_metadata?.avatar_url;

  return (
    <nav className="fixed w-full z-50">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center h-16">
          <Link to="/" className="font-mono text-xl font-bold text-white">
            Mitram<span className="text-purple-500">.app</span>
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/" className="text-gray-400 hover:text-white">Home</Link>
          <Link to="/create" className="text-gray-400 hover:text-white">Create Post</Link>
          <Link to="/community" className="text-gray-400 hover:text-white">Community</Link>
          <Link to="/community/create" className="text-gray-400 hover:text-white">Create Community</Link>

          {/* GitHub / User Info */}
          {user ? (
            <div className="flex items-center space-x-2 bg-gray-800 px-3 py-1 rounded-md">
              <img 
                src={avatar} 
                alt="profile" 
                className="w-8 h-8 rounded-full border border-gray-600"
              />
              <span className="text-gray-300">{displayName}</span>
              <button 
                onClick={signOut} 
                className="text-sm text-purple-400 hover:text-white ml-2"
              >
                Logout
              </button>
            </div>
          ) : (
            <button onClick={signInWithGitHub} className="text-white hover:text-purple-400">
              <FaGithub className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Mobile Burger Button */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[rgba(10,10,10,0.95)] backdrop-blur-lg border border-white/10 shadow-lg absolute top-16 right-4 w-56 rounded-md">
          <div className="px-2 pt-2 pb-3 space-y-1 flex flex-col">
            <Link to="/" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-purple-700">Home</Link>
            <Link to="/create" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-purple-700">Create Post</Link>
            <Link to="/community" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-purple-700">Community</Link>
            <Link to="/community/create" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-purple-700">Create Community</Link>

            {/* Auth Buttons in Mobile */}
            {user ? (
              <div className="flex items-center space-x-2 px-3 py-2">
                <img 
                  src={avatar} 
                  alt="profile" 
                  className="w-8 h-8 rounded-full border border-gray-600"
                />
                <span className="text-gray-300">{displayName}</span>
                <button
                  onClick={() => { setMenuOpen(false); signOut(); }}
                  className="ml-auto text-red-400 hover:text-white"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setMenuOpen(false); signInWithGitHub(); }}
                className="block text-left px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-purple-700"
              >
                Sign in with GitHub
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
