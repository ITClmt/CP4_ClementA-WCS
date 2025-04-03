import { useState } from "react";
import api from "../../services/api";
import { useRevalidator } from "react-router";

export default function EditAppointmentModal({
  appointment,
}: { appointment: Appointment }) {
  const [status, setStatus] = useState(appointment.status);
  const [date, setDate] = useState(() => {
    // Format initial date
    const dateStr = appointment.date;
    if (typeof dateStr === "string") {
      // Si la date est au format "mercredi 21 mai 2025 à 11:30"
      const [, day, month, year, time] =
        dateStr.match(/(\d+)\s+(\w+)\s+(\d{4})\s+à\s+(\d{2}:\d{2})/) || [];
      if (day && month && year && time) {
        const months: { [key: string]: string } = {
          janvier: "01",
          février: "02",
          mars: "03",
          avril: "04",
          mai: "05",
          juin: "06",
          juillet: "07",
          août: "08",
          septembre: "09",
          octobre: "10",
          novembre: "11",
          décembre: "12",
        };
        const monthNum = months[month.toLowerCase()];
        const formattedDay = day.padStart(2, "0");
        return `${year}-${monthNum}-${formattedDay}T${time}`;
      }
    }
    return "";
  });
  const revalidate = useRevalidator();

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStatus = e.currentTarget.value;
    setStatus(selectedStatus);
  };

  const handleDelete = async () => {
    try {
      await api.deleteAppointmentAdmin(appointment._id);
      const modal = document.getElementById(
        `edit-appointment-modal-${appointment._id}`,
      ) as HTMLDialogElement;
      modal?.close();
      revalidate.revalidate();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api.updateAppointment(appointment._id, status, date);
      const modal = document.getElementById(
        `edit-appointment-modal-${appointment._id}`,
      ) as HTMLDialogElement;
      modal?.close();
      revalidate.revalidate();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <dialog
      id={`edit-appointment-modal-${appointment._id}`}
      className="modal backdrop:bg-gray-800/50 p-6 rounded-lg shadow-xl border border-gray-200 min-w-[320px] mx-auto mt-10"
    >
      <div className="relative">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Modifier le statut
        </h3>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700"
            >
              Statut du rendez-vous {appointment.clientEmail}
            </label>
            <select
              name="status"
              id="status"
              onChange={handleStatusChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="En attente">En attente</option>
              <option value="Confirmé">Confirmé</option>
              <option value="Annulé">Annulé</option>
            </select>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700"
            >
              Date du rendez-vous
            </label>
            <input
              type="datetime-local"
              name="date"
              value={date}
              onChange={(e) => setDate(e.currentTarget.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              className="text-red-500 hover:text-red-600 cursor-pointer text-sm"
              onClick={handleDelete}
            >
              Supprimer
            </button>
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => {
                const modal = document.getElementById(
                  `edit-appointment-modal-${appointment._id}`,
                ) as HTMLDialogElement;
                modal?.close();
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
