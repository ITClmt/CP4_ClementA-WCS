import EditAppointmentModal from "./EditAppointmentModal";

export default function AppointmentsAdmin({ appointments }: AppointmentProps) {
  return (
    <div className="flex flex-col gap-2 mt-4 container mx-auto shadow-lg p-4 rounded-md">
      {appointments.map((appointment) => (
        <div
          className={`p-2 rounded-md flex justify-between ${appointment.status === "En attente" ? "bg-[#ffd9007a]" : appointment.status === "Confirmé" ? "bg-[#00ff007a]" : "bg-[#ff00007a]"}`}
          key={appointment._id}
        >
          <div className="flex flex-col">
            <div className="text-sm font-bold">
              {appointment.clientFirstName}
            </div>
            <div className="text-sm">{appointment.clientLastName}</div>
            <div className="text-sm">{appointment.clientEmail}</div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-sm font-bold">{appointment.date}</div>
            <div className="text-sm">{appointment.status}</div>
            <button
              type="button"
              className="text-red-500 hover:text-red-600 cursor-pointer text-sm"
              onClick={() => {
                const modal = document.getElementById(
                  `edit-appointment-modal-${appointment._id}`,
                ) as HTMLDialogElement;
                modal?.showModal();
              }}
            >
              Modifier
            </button>
            <EditAppointmentModal appointment={appointment} />
          </div>
        </div>
      ))}
    </div>
  );
}
