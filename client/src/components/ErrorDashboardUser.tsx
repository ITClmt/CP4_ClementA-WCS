import { Navigate } from "react-router";

export default function ErrorDashboardUser() {
  if (localStorage.getItem("CP4user") === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">
          Veuillez nous excuser, une erreur est survenue
        </h1>
      </div>
    );
  }
  return <Navigate to="/dashboard/user" />;
}
