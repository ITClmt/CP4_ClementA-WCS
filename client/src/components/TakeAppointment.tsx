import { useState } from "react";
import api from "../services/api";
import { useRevalidator } from "react-router";

export default function TakeAppointment() {
  const revalidator = useRevalidator();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState<{
    date: string;
    time: string;
  } | null>(null);

  // Générer la date du jour formatée en YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0];

  // Fonction pour vérifier si une date correspond à un jour de semaine (lundi-vendredi)
  const isWeekday = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDay();
    return day > 0 && day < 6; // 0 est dimanche, 6 est samedi
  };

  // Créneaux horaires disponibles (toutes les 30 minutes)
  const morningSlots = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"];

  const afternoonSlots = ["14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];

  // Gérer le changement de date
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    if (isWeekday(date)) {
      setSelectedDate(date);
    } else {
      alert("Veuillez sélectionner un jour de semaine (lundi à vendredi)");
      e.target.value = "";
    }
  };

  // Convertir la date et l'heure au format UTC+2
  const formatDateTimeUTC2 = (date: string, time: string) => {
    const [year, month, day] = date.split("-");
    const [hours, minutes] = time.split(":");

    const dateObj = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00`);

    return dateObj.toISOString();
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedDate && selectedTime) {
      try {
        setIsSubmitting(true);

        // Formatage de la date+heure au format UTC+2
        const dateTimeUTC2 = formatDateTimeUTC2(selectedDate, selectedTime);

        // Appel API pour créer le rendez-vous
        await api.createAppointment(dateTimeUTC2);

        setAppointmentDetails({
          date: selectedDate,
          time: selectedTime,
        });
        setBookingConfirmed(true);
        revalidator.revalidate();
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
        } else {
          alert("Une erreur est survenue lors de la prise de rendez-vous");
        }
      } finally {
        setIsSubmitting(false);
      }
    } else {
      alert("Veuillez sélectionner une date et un horaire");
    }
  };

  const resetForm = () => {
    setSelectedDate("");
    setSelectedTime("");
    setBookingConfirmed(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-6 text-gray-800">
        Prise de rendez-vous
      </h2>

      {!bookingConfirmed ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="date">
              Date (Lundi-Vendredi uniquement)
            </label>
            <input
              type="date"
              min={today}
              onChange={handleDateChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          {selectedDate && (
            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="time">
                Heure du rendez-vous
              </label>

              <div className="mb-2">
                <h3 className="text-sm font-medium text-gray-600 mb-1">
                  Matin
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {morningSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      className={`p-2 text-sm rounded ${
                        selectedTime === time
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">
                  Après-midi
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {afternoonSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      className={`p-2 text-sm rounded ${
                        selectedTime === time
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full p-2 rounded ${
              isSubmitting
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {isSubmitting
              ? "Traitement en cours..."
              : "Confirmer le rendez-vous"}
          </button>
        </form>
      ) : (
        <div className="text-center">
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            <p className="font-medium">Rendez-vous confirmé!</p>
            {appointmentDetails && (
              <>
                <p>Date: {appointmentDetails.date}</p>
                <p>Heure: {appointmentDetails.time}</p>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-200 text-gray-800 p-2 rounded hover:bg-gray-300"
          >
            Prendre un nouveau rendez-vous
          </button>
        </div>
      )}
    </div>
  );
}
