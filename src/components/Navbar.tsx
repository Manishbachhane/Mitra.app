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
    <nav className="fixed w-full z-50 bg-black/30 backdrop-blur-lg border-b border-white/10 shadow-md">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="font-mono text-2xl font-bold text-white tracking-wide">
            Mitram<span className="text-purple-500">.app</span>
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-300 hover:text-purple-400 transition-colors">Home</Link>
          <Link to="/create" className="text-gray-300 hover:text-purple-400 transition-colors">Create Post</Link>
          <Link to="/community" className="text-gray-300 hover:text-purple-400 transition-colors">Community</Link>
          <Link to="/community/create" className="text-gray-300 hover:text-purple-400 transition-colors">Create Community</Link>

          {/* GitHub / User Info */}
          {user ? (
            <div className="flex items-center space-x-3 bg-gray-900/70 px-4 py-1.5 rounded-full border border-gray-700">
              <img 
                src={avatar} 
                alt="profile" 
                className="w-8 h-8 rounded-full border border-gray-600"
              />
              <span className="text-gray-200 text-sm">{displayName}</span>
              <button 
                onClick={signOut} 
                className="ml-2 text-sm text-red-400 hover:text-white transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <button 
              onClick={signInWithGitHub} 
              className="flex items-center gap-2 text-white bg-gray-800 px-3 py-1.5 rounded-md hover:bg-purple-600 transition-colors"
            >
              <FaGithub className="w-5 h-5" /> <span>Sign in</span>
            </button>
          )}
        </div>

        {/* Mobile Burger Button */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <svg
              className="w-7 h-7 text-white"
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
        <div className="md:hidden bg-black/90 backdrop-blur-lg border border-white/10 shadow-xl absolute top-16 right-4 w-60 rounded-xl overflow-hidden animate-fadeIn">
          <div className="px-2 pt-3 pb-4 space-y-2 flex flex-col">
            <Link to="/" onClick={() => setMenuOpen(false)} className="px-4 py-2 rounded-md text-gray-200 hover:bg-purple-600 hover:text-white transition-colors">Home</Link>
            <Link to="/create" onClick={() => setMenuOpen(false)} className="px-4 py-2 rounded-md text-gray-200 hover:bg-purple-600 hover:text-white transition-colors">Create Post</Link>
            <Link to="/community" onClick={() => setMenuOpen(false)} className="px-4 py-2 rounded-md text-gray-200 hover:bg-purple-600 hover:text-white transition-colors">Community</Link>
            <Link to="/community/create" onClick={() => setMenuOpen(false)} className="px-4 py-2 rounded-md text-gray-200 hover:bg-purple-600 hover:text-white transition-colors">Create Community</Link>

            {/* Auth Buttons in Mobile */}
            {user ? (
              <div className="flex items-center gap-2 px-4 py-2 border-t border-gray-700">
                <img 
                  src={avatar} 
                  alt="profile" 
                  className="w-8 h-8 rounded-full border border-gray-600"
                />
                <span className="text-gray-200 text-sm">{displayName}</span>
                <button
                  onClick={() => { setMenuOpen(false); signOut(); }}
                  className="ml-auto text-red-400 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setMenuOpen(false); signInWithGitHub(); }}
                className="w-full text-left px-4 py-2 rounded-md text-gray-200 hover:bg-purple-600 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FaGithub className="w-5 h-5" /> Sign in with GitHub
                </div>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
