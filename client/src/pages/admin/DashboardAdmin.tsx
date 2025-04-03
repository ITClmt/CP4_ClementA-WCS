import { Navigate, useLoaderData, useNavigate } from "react-router";
import useAuth from "../../services/AuthContext";
import api from "../../services/api";
import AppointmentsAdmin from "../../components/admin/AppointmentsAdmin";
export default function DashboardAdmin() {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();
  const appointments = useLoaderData();

  if (!currentUser || !currentUser.isAdmin) {
    return <Navigate to="/login/admin" />;
  }

  const handleLogout = async () => {
    await api.logoutUser();
    setCurrentUser({
      id: 0,
      email: "",
      firstName: "",
      lastName: "",
      isAdmin: false,
    });
    localStorage.removeItem("CP4user");
    navigate("/login");
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-indigo-100 to-white">
      <div className="flex flex-col justify-center items-center pt-10">
        <h1 className="text-4xl font-bold text-center">
          Bienvenue sur votre dashboard {currentUser.firstName}
        </h1>
        <p className="text-center text-gray-500 mt-4">
          Vous pouvez gérer les rendez-vous ici
        </p>
        <button
          type="button"
          className="text-red-500 hover:text-red-600 cursor-pointer text-sm"
          onClick={() => handleLogout()}
        >
          Se déconnecter
        </button>
      </div>
      <AppointmentsAdmin appointments={appointments} />
    </section>
  );
}
