import { Navigate, useLoaderData, useNavigate } from "react-router";
import TakeAppointment from "../components/TakeAppointment";
import useAuth from "../services/AuthContext";
import api from "../services/api";
import UserAppointement from "../components/UserAppointement";
import { useState, useEffect } from "react";
export default function DashboardUser() {
  const { currentUser, setCurrentUser } = useAuth();
  const appointments = useLoaderData();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (appointments) {
      setIsLoading(false);
    }
  }, [appointments]);

  if (currentUser.id === 0) {
    return <Navigate to="/login" />;
  }

  if (isLoading) {
    return <div>Loading...</div>;
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
          Vous pouvez prendre ou gérer vos rendez-vous ici
        </p>
        <button
          type="button"
          className="text-red-500 hover:text-red-600 cursor-pointer text-sm"
          onClick={() => handleLogout()}
        >
          Se déconnecter
        </button>
      </div>
      <div className="flex justify-center items-center gap-4 mt-10">
        <article className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-center">
            Prendre un rendez-vous
          </h2>
          <TakeAppointment />
        </article>
        <article className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-center">Vos rendez-vous</h2>
          <UserAppointement appointments={appointments} />
        </article>
      </div>
    </section>
  );
}
