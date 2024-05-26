"use client";

import { signOut, useUser } from "@/lib/own-auth/react/client";

export default function Home() {
  const user = useUser();
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
    <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-black">Hello, {user?.email}!</h1>
        <button
          onClick={signOut}
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition ease-in-out duration-150"
        >
          Logout
        </button>
      </div>
      <p className="text-lg text-gray-700 mb-8">Welcome back! Here’s a quick overview of your account.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-black mb-2">Profile</h2>
          <p className="text-gray-700">View and update your personal details.</p>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-black mb-2">Settings</h2>
          <p className="text-gray-700">Manage your account settings and preferences.</p>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-black mb-2">Notifications</h2>
          <p className="text-gray-700">Check your latest notifications and updates.</p>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-black mb-2">Support</h2>
          <p className="text-gray-700">Need help? Get in touch with our support team.</p>
        </div>
      </div>
    </div>
  </div>
  );
}
