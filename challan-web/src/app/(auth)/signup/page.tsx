import { ArrowRight, Eye } from "lucide-react";

const Signup = () => {
  return (
    <div className="min-h-screen w-full bg-neutral-50 flex items-center justify-center">
      <div className="w-full max-w-100 bg-white rounded-xl shadow-lg border border-neutral-200 overflow-hidden">
        
        <div className="p-8 pb-6">
          <h2 className="text-2xl font-bold text-neutral-900 text-center">
            Create your account
          </h2>
          <p className="text-neutral-500 text-sm text-center mt-2 mb-8">
            Welcome to Challan Maker! Please enter your details to create your account.
          </p>

          <div className="flex gap-4 mb-6">
            <button 
              className="flex-1 flex items-center justify-center gap-2 py-2 px-4 border border-neutral-300 rounded-lg font-medium text-neutral-700 hover:bg-neutral-50 transition"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Google
            </button>
          </div>

          <div className="relative flex py-4 items-center">
            <div className="grow border-t border-neutral-200"/>
            <span className=" mx-4 text-neutral-400 text-sm">
              or
            </span>
            <div className="grow border-t border-neutral-200"/>
          </div>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1">
                Name
              </label>
              <input 
                type="name" 
                placeholder="Enter your name"
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue focus:outline-none placeholder-neutral-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1">
                Email address
              </label>
              <input 
                type="email" 
                placeholder="Enter your email address"
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue focus:outline-none placeholder-neutral-400"
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-semibold text-neutral-700 mb-1">
                Password
              </label>
              <input 
                type="password" 
                placeholder="Enter your password" 
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue focus:outline-none placeholder-neutral-400"
              />
              
              <button type="button" className="absolute right-3 top-9 text-neutral-400 hover:text-neutral-600">
                <Eye/>
              </button>
            </div>

            <button type="submit" className="w-full py-3 bg-blue hover:bg-dark-blue text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2">
              Continue
              <ArrowRight/>
            </button>
          </form>
        </div>

        <div className="bg-neutral-50 p-6 border-t border-neutral-100 text-center">
          <p className="text-neutral-600 text-sm">
            Already have an account? <a href="/login" className="text-[#496989] font-semibold hover:underline">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup