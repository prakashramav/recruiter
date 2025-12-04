import { NavLink } from "react-router-dom";
import "./navbar.css";

const navItems = [
  { label: "Dashboard", path: "/recruiter" },
  { label: "Post Job", path: "/recruiter/create-jobs" },
  { label: "Interviews", path: "/recruiter/interview" },
];

const RecruiterNavbarPage = () => {
  return (
    <nav className="recruiter-sidebar">
      <div className="recruiter-sidebar-links">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) =>
              isActive ? "recruiter-sidebar-link active" : "recruiter-sidebar-link"
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default RecruiterNavbarPage;
