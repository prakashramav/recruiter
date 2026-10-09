import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export const RootLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
};
