import { NavLink } from "react-router-dom";
import './index.css'

const navItems = [
  { label: "Dashboard", path: "/applicant" },
  { label: "Applied", path: "/applicant/applied-jobs" },
  { label: "Interviews", path: "/applicant/interview" },
];

const ApplicantNavbarPage = () => {
    return (
    <nav className="applicant-sidebar">
      <div className="applicant-sidebar-links">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) =>
              isActive ? "applicant-sidebar-link active" : "applicant-sidebar-link"
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}


export default ApplicantNavbarPage