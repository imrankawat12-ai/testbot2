import Head from "next/head";
import ChatUI from "@/components/ChatUI";

export default function Home() {
  return (
    <>
      <Head>
        <title>Demo AI Chatbot</title>
        <meta name="description" content="AI Chatbot Demo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4 sm:p-8 font-sans">
        
        {/* Background Decorative Blobs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="relative w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 z-10">
          
          {/* Left Side: Hero Info */}
          <div className="flex-1 text-center lg:text-left text-white space-y-6">
            <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-sm font-semibold tracking-wide backdrop-blur-sm">
              ✨ Gpt-4o-mini Integration
            </div>
            <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200">
              Next-Gen Customer Support
            </h1>
            <p className="text-lg text-indigo-200/80 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              This demo showcases how we build powerful, domain-specific AI chatbots. 
              The assistant relies on a simple Google Doc as its brain—enabling instant, scalable knowledge delivery.
            </p>
            
            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <div className="flex items-center gap-2 text-sm text-indigo-100/70 bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Google Docs Knowledge Base
              </div>
              <div className="flex items-center gap-2 text-sm text-indigo-100/70 bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                OpenAI Powered
              </div>
            </div>
          </div>

          {/* Right Side: Chat Component */}
          <div className="w-full lg:w-[500px] xl:w-[550px] shrink-0 transform hover:scale-[1.01] transition-transform duration-300">
            <ChatUI />
          </div>

        </div>
      </main>
    </>
  );
}
