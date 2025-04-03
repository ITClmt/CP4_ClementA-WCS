import TakeAppointment from "../components/TakeAppointment";

export default function DashboardUser() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-indigo-100 to-white">
      <div className="flex flex-col justify-center items-center pt-10">
        <h1 className="text-4xl font-bold text-center">
          Bienvenue sur votre dashboard ICI NOM DE L'UTILISATEUR
        </h1>
        <p className="text-center text-gray-500 mt-4">
          Vous pouvez gérer vos rendez-vous ici
        </p>
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
        </article>
      </div>
    </section>
  );
}
