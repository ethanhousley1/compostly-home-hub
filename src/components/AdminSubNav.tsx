import { Link, useLocation } from "react-router-dom";

const AdminSubNav = () => {
  const location = useLocation();

  const linkClass = (path: string) =>
    `inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors ${
      location.pathname === path
        ? "bg-muted text-foreground"
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    }`;

  return (
    <div className="mb-6 flex gap-2">
      <Link to="/users" className={linkClass("/users")}>
        Users
      </Link>
      <Link to="/map" className={linkClass("/map")}>
        Admin Map
      </Link>
    </div>
  );
};

export default AdminSubNav;