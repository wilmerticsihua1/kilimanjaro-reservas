import { useEffect, useState } from 'react';

const SESION_KEY = 'kilimanjaro-sesion';
const CLIENTES_KEY = 'kilimanjaro-clientes';

// Usuario administrador (dueño del restaurante)
export const ADMIN_EMAIL = 'admin@kilimanjaro.com';
export const ADMIN_PASSWORD = 'admin123';

// Cliente de prueba (para la presentación)
export const CLIENTE_DEMO_EMAIL = 'cliente@kilimanjaro.com';
export const CLIENTE_DEMO_PASSWORD = 'cliente123';

const clientesIniciales = [
  {
    nombre: 'Rosa Quispe',
    email: CLIENTE_DEMO_EMAIL,
    telefono: '944555666',
    password: CLIENTE_DEMO_PASSWORD,
  },
];

const leer = (key, porDefecto) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : porDefecto;
  } catch {
    return porDefecto;
  }
};

const guardar = (key, valor) => {
  try {
    if (valor === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(valor));
  } catch {
    // almacenamiento no disponible: la sesión dura mientras la página esté abierta
  }
};

// Maneja los dos tipos de usuario:
//  - rol "admin": entra al Panel Administrativo
//  - rol "cliente": puede registrar reservas y ver "Mis reservas"
export function useAuth() {
  const [usuario, setUsuario] = useState(() => leer(SESION_KEY, null));
  const [clientes, setClientes] = useState(() => leer(CLIENTES_KEY, clientesIniciales));

  useEffect(() => guardar(SESION_KEY, usuario), [usuario]);
  useEffect(() => guardar(CLIENTES_KEY, clientes), [clientes]);

  const login = (email, password) => {
    const correo = email.trim().toLowerCase();

    if (correo === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const admin = { rol: 'admin', nombre: 'Administrador', email: ADMIN_EMAIL, telefono: '' };
      setUsuario(admin);
      return { ok: true, usuario: admin };
    }

    const cliente = clientes.find((c) => c.email === correo && c.password === password);
    if (cliente) {
      const sesion = { rol: 'cliente', nombre: cliente.nombre, email: cliente.email, telefono: cliente.telefono };
      setUsuario(sesion);
      return { ok: true, usuario: sesion };
    }

    return { ok: false, error: 'Correo o contraseña incorrectos.' };
  };

  const registrar = ({ nombre, email, telefono, password }) => {
    const correo = email.trim().toLowerCase();
    if (correo === ADMIN_EMAIL || clientes.some((c) => c.email === correo)) {
      return { ok: false, error: 'Ya existe una cuenta con ese correo.' };
    }
    const nuevo = { nombre: nombre.trim(), email: correo, telefono: telefono.trim(), password };
    setClientes((prev) => [...prev, nuevo]);
    const sesion = { rol: 'cliente', nombre: nuevo.nombre, email: nuevo.email, telefono: nuevo.telefono };
    setUsuario(sesion);
    return { ok: true, usuario: sesion };
  };

  const logout = () => setUsuario(null);

  return {
    usuario,
    clientes,
    isAdmin: usuario?.rol === 'admin',
    isCliente: usuario?.rol === 'cliente',
    login,
    registrar,
    logout,
  };
}
