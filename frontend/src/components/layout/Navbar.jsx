import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Briefcase } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl tracking-tight text-primary">Talentify</span>
        </Link>
        
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {user.role === 'applicant' && (
                <>
                  <Link to="/jobs" className="text-sm font-medium hover:text-primary transition-colors">Find Jobs</Link>
                  <Link to="/my-applications" className="text-sm font-medium hover:text-primary transition-colors">My Applications</Link>
                </>
              )}
              {user.role === 'recruiter' && (
                <>
                  <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">Dashboard</Link>
                  <Link to="/recruiter/jobs" className="text-sm font-medium hover:text-primary transition-colors">My Jobs</Link>
                </>
              )}
              <span className="text-sm text-muted-foreground border-l pl-4 border-border ml-2">
                Hi, {user.name}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium hover:text-primary transition-colors">Login</Link>
              <Button asChild size="sm">
                <Link to="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
