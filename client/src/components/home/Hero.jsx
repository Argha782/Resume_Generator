import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Dashboard from "../../pages/Dashboard";

const Hero = () => {

  const { user } = useSelector(state=> state.auth)
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <section
      className="flex flex-col items-center text-sm bg-[url('https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/bg-with-grid.png')] bg-cover bg-center bg-no-repeat font-[Poppins]"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Top Offer Banner */}
      {/* <div className="w-full py-2.5 font-medium text-sm text-white text-center bg-gradient-to-r from-[#4F39F6] to-[#FDFEFF]">
        <p>
          <span className="px-3 py-1 rounded-md text-indigo-600 bg-white mr-2">
            Launch offer
          </span>
          Try prebuiltui today and get $50 free credits
        </p>
      </div> */}

      {/* Navbar */}
      <nav className="z-50 flex items-center justify-between w-full py-4 px-6 md:px-16 lg:px-24 xl:px-32 backdrop-blur text-slate-800 text-sm">
        {/* Logo */}
        <a href="https://prebuiltui.com">
          <img src="/logo.svg" alt="logo" className='w-40 h-16' />
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 transition duration-500">
          <a href="#" className="hover:text-slate-500 transition">
            Home
          </a>
          <a href="#features" className="hover:text-slate-500 transition">
            Features
          </a>
          <a href="#testimonials" className="hover:text-slate-500 transition">
            Testimonials
          </a>
          <a href="#contact" className="hover:text-slate-500 transition">
            Contact
          </a>
        </div>

        {/* Buttons */}
        <div className="hidden md:block space-x-3">
          {!user && (
            <>
              <Link to='/app?state=register' className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-md">
                Get started
              </Link>
              <Link to='/app?state=login' className="hover:bg-slate-100 transition px-6 py-2 border border-indigo-600 rounded-md">
                Login
              </Link>
            </>
          )}

          {user && (
            <Link to='/app' className="hidden md:block px-8 py-2 bg-indigo-600 hover:bg-green-700 active:scale-95 transition-all rounded-full text-white">
              Dashboard
            </Link>
          )}

        </div>

        {/* Mobile Menu Button */}
        <button
          id="open-menu"
          className="md:hidden active:scale-90 transition"
          onClick={() => setMenuOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-menu"
          >
            <path d="M4 5h16" />
            <path d="M4 12h16" />
            <path d="M4 19h16" />
          </svg>
        </button>
      </nav>

      {/* Mobile Nav Links */}
      <div
        id="mobile-navLinks"
        className={`fixed inset-0 z-[100] bg-white/60 text-slate-800 backdrop-blur flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <a href="#">Home</a>
        <a href="#features">Features</a>
        <a href="#testimonials">Testimonials</a>
        <a href="#contact">Contact</a>
        <button
          id="close-menu"
          onClick={() => setMenuOpen(false)}
          className="active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-slate-100 hover:bg-slate-200 transition text-black rounded-md flex"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-x"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>

      {/* Main Hero Content */}
      <main className="flex flex-col items-center max-md:px-2">
        <a
          href="https://prebuiltui.com"
          className="mt-32 flex items-center gap-2 border border-indigo-200 rounded-full p-1 pr-3 text-sm font-medium text-indigo-500 bg-indigo-200/20"
        >
          <span className="bg-indigo-600 text-white text-xs px-3 py-1 rounded-full">
            NEW
          </span>
          <p className="flex items-center gap-1">
            <span>Try 7 days free trial option</span>
            <svg
              className="mt-1"
              width="6"
              height="9"
              viewBox="0 0 6 9"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m1 1 4 3.5L1 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </p>
        </a>

        <h1 className="text-center text-5xl leading-[68px] md:text-6xl md:leading-[80px] font-semibold max-w-4xl text-slate-900">
          Land your dream job with AI-powered resumes
        </h1>
        <p className="text-center text-base text-slate-700 max-w-lg mt-2">
          Create edit and download stunning resumes that get you hired faster
          using AI.
        </p>

        <div to='/app' className="flex items-center gap-4 mt-8">
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95 rounded-lg px-7 h-11">
            Get started
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.166 10h11.667m0 0L9.999 4.165m5.834 5.833-5.834 5.834"
                stroke="#fff"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          {/* <button className="border border-slate-600 active:scale-95 hover:bg-white/10 transition text-slate-600 rounded-lg px-8 h-11">
            Pricing
          </button> */}
        </div>

        {/* <img
          src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/dashboard-image-1.png"
          className="w-full rounded-[15px] max-w-4xl mt-16"
          alt="hero section showcase"
        /> */}
      </main>
    </section>
  );
};

export default Hero;
