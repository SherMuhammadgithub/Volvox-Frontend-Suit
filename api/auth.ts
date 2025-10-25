import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export async function loginApi(email: string, password: string) {
  const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
  return res.data;
}

export async function signupApi(email: string, password: string) {
  const res = await axios.post(`${API_BASE}/auth/signup`, { email, password });
  return res.data;
}
