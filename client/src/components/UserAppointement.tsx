import api from "../services/api";
import { useRevalidator } from "react-router";
export default function UserAppointement({ appointments }: AppointmentProps) {
  const revalidator = useRevalidator();

  if (appointments.length === 0) {
    return (
      <div className="text-center text-gray-500">Aucun rendez-vous trouvé</div>
    );
  }

  const handleDeleteAppointment = async (id: string) => {
    const confirm = window.confirm(
      "Voulez-vous vraiment annuler ce rendez-vous ?",
    );
    if (confirm) {
      await api.deleteAppointment(id);
      revalidator.revalidate();
    }
  };

  return (
    <div className="flex flex-col gap-2 mt-4">
      {appointments.map((appointment) => (
        <div
          className={`p-2 rounded-md flex justify-between ${appointment.status === "En attente" ? "bg-[#ffd9007a]" : appointment.status === "Confirmé" ? "bg-[#00ff007a]" : "bg-[#ff00007a]"}`}
          key={appointment._id}
        >
          <div className="flex flex-col justify-between">
            <div className="text-sm font-bold">{appointment.date}</div>
            <div className="text-sm">{appointment.status}</div>
          </div>
          <button
            type="button"
            className="text-red-600 text-sm hover:opacity-50 cursor-pointer"
            onClick={() => handleDeleteAppointment(appointment._id)}
          >
            Annuler
          </button>
        </div>
      ))}
    </div>
  );
}
