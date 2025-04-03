import axios, { AxiosError } from "axios";

const baseURL = import.meta.env.VITE_API_URL;

const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      `${baseURL}/api/users/login`,
      {
        email,
        password,
      },
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to login");
  }
};

const logoutUser = async () => {
  try {
    const response = await axios.get(`${baseURL}/api/users/logout`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to logout");
  }
};

const signupUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
) => {
  try {
    const response = await axios.post(
      `${baseURL}/api/users`,
      {
        firstName,
        lastName,
        email,
        password,
      },
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to signup");
  }
};

const createAppointment = async (date: string) => {
  try {
    const response = await axios.post(
      `${baseURL}/api/appointments`,
      { date },
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error);
    }
    throw new Error("Failed to create appointment");
  }
};

const getAppointmentsByEmail = async (email: string) => {
  try {
    const response = await axios.get(`${baseURL}/api/appointments/${email}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to get appointments");
  }
};

const deleteAppointment = async (id: string) => {
  try {
    const response = await axios.delete(
      `${baseURL}/api/users/appointments/${id}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to delete appointment");
  }
};

// Admin routes

const loginAdmin = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      `${baseURL}/api/auth/login`,
      {
        email,
        password,
      },
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error);
    }
    throw new Error("Failed to login");
  }
};

export default {
  loginUser,
  logoutUser,
  signupUser,
  createAppointment,
  getAppointmentsByEmail,
  deleteAppointment,
  loginAdmin,
};
