import React, { useState, useEffect } from 'react';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [currentSkill, setCurrentSkill] = useState(0);

  const skills = [
    "Mathematics",
    "Science",
    "Creative Writing",
    "Problem Solving",
    "Leadership",
    "Communication",
    "Critical Thinking",
    "Teamwork"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSkill((prev) => (prev + 1) % skills.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Username:', username);
    console.log('Password:', password);
    // Here you would typically send the username and password to a server for authentication
  };

  return (
    <div className="min-h-screen flex text-slate-800">
      {/* Left Side - Animated Showcase */}
      <div className="hidden lg:flex lg:w-3/5 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-16 w-12 h-12 bg-white/20 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-white/15 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute bottom-40 left-20 w-8 h-8 bg-white/25 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-60 right-16 w-10 h-10 bg-white/20 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
          <div className="absolute top-32 right-1/3 w-14 h-14 bg-white/10 rounded-full animate-bounce" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-32 right-1/4 w-18 h-18 bg-white/15 rounded-full animate-pulse" style={{animationDelay: '0.8s'}}></div>
          <div className="absolute top-1/2 left-12 w-6 h-6 bg-white/30 rounded-full animate-ping" style={{animationDelay: '1.8s'}}></div>
          <div className="absolute bottom-1/3 right-12 w-12 h-12 bg-white/20 rounded-full animate-bounce" style={{animationDelay: '2.5s'}}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 py-12 text-white h-full">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">MySkillDB</h1>
            <p className="text-lg text-white/90 leading-relaxed mb-6">
              Celebrate every student's unique journey. Track skills, build narratives, and create futures.
            </p>
            <div className="w-16 h-1 bg-white/60 rounded-full"></div>
          </div>

          {/* Skill Showcase */}
          <div className="space-y-6">
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-6 border border-white/30">
              <h3 className="text-lg font-semibold mb-4">Today we celebrate:</h3>
              <div className="h-12 flex items-center justify-center">
                <span 
                  key={currentSkill}
                  className="text-2xl font-bold animate-fade-in"
                  style={{
                    animation: 'fadeIn 0.5s ease-in-out'
                  }}
                >
                  {skills[currentSkill]}
                </span>
              </div>
              <div className="flex justify-center mt-3">
                {skills.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full mx-1 transition-colors duration-300 ${
                      index === currentSkill ? 'bg-white' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/15 backdrop-blur-sm rounded-lg p-4 border border-white/30 hover:bg-white/20 transition-all duration-300">
                <div className="w-8 h-8 mb-3 text-white">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="text-sm font-semibold">Academic Skills</div>
                <div className="text-xs text-white/80 mt-1">Math, Science, Literature</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-lg p-4 border border-white/30 hover:bg-white/20 transition-all duration-300">
                <div className="w-8 h-8 mb-3 text-white">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                  </svg>
                </div>
                <div className="text-sm font-semibold">Creative Talents</div>
                <div className="text-xs text-white/80 mt-1">Art, Music, Writing</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-lg p-4 border border-white/30 hover:bg-white/20 transition-all duration-300">
                <div className="w-8 h-8 mb-3 text-white">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="text-sm font-semibold">Leadership</div>
                <div className="text-xs text-white/80 mt-1">Teamwork, Communication</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-lg p-4 border border-white/30 hover:bg-white/20 transition-all duration-300">
                <div className="w-8 h-8 mb-3 text-white">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="text-sm font-semibold">Problem Solving</div>
                <div className="text-xs text-white/80 mt-1">Critical Thinking, Innovation</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-2/5 flex flex-col bg-white">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-slate-200">
          <div className="px-4 py-3">
            <h1 className="text-2xl font-bold text-slate-900">MySkillDB</h1>
          </div>
        </header>

        {/* Login Form Container */}
        <main className="flex-grow flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">Welcome Back</h2>
              <p className="text-lg text-slate-600">Sign in to continue your skill journey</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full border-2 border-slate-300 rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all duration-200 hover:border-slate-400"
                  placeholder="Username or email"
                />
              </div>

              <div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border-2 border-slate-300 rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all duration-200 hover:border-slate-400"
                  placeholder="Password"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg text-base transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
              >
                Sign In
              </button>
            </form>

            <div className="mt-6 text-center">
              <a href="#" className="text-indigo-600 hover:text-indigo-700 font-semibold text-base">
                Forgot your password?
              </a>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="text-center">
                <p className="text-base text-slate-600 mb-4">Don't have an account?</p>
                <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-lg text-base transition-all duration-200 border-2 border-slate-200 hover:border-slate-300">
                  Create New Account
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Login;