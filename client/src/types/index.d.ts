interface LoginFormData {
  email: string;
  password: string;
}

interface Appointment {
  _id: string;
  clientEmail: string;
  clientFirstName: string;
  clientLastName: string;
  date: string;
  status: string;
}

interface AppointmentProps {
  appointments: Appointment[];
}
