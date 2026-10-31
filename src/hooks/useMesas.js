import { useEffect, useState } from 'react';

const MESAS_KEY = 'kilimanjaro-mesas-v1';

export const UBICACIONES = ['Interior', 'Ventana', 'Terraza', 'Salón privado'];
export const TIPOS = ['Redonda', 'Cuadrada', 'Rectangular', 'Barra', 'Sofá'];

// Mesas de ejemplo (las mismas que tenía el local)
export const mesasIniciales = [
  { id: 1, ubicacion: 'Interior', tipo: 'Cuadrada', sillas: 2, operativa: true },
  { id: 2, ubicacion: 'Ventana', tipo: 'Cuadrada', sillas: 2, operativa: true },
  { id: 3, ubicacion: 'Interior', tipo: 'Redonda', sillas: 4, operativa: true },
  { id: 4, ubicacion: 'Ventana', tipo: 'Rectangular', sillas: 4, operativa: true },
  { id: 5, ubicacion: 'Terraza', tipo: 'Redonda', sillas: 4, operativa: true },
  { id: 6, ubicacion: 'Terraza', tipo: 'Rectangular', sillas: 6, operativa: true },
  { id: 7, ubicacion: 'Interior', tipo: 'Rectangular', sillas: 6, operativa: true },
  { id: 8, ubicacion: 'Salón privado', tipo: 'Rectangular', sillas: 8, operativa: true },
];

const cargarMesas = () => {
  try {
    const raw = localStorage.getItem(MESAS_KEY);
    if (raw) {
      const datos = JSON.parse(raw);
      if (Array.isArray(datos)) return datos;
    }
  } catch {
    try { localStorage.removeItem(MESAS_KEY); } catch { /* sin almacenamiento */ }
  }
  return mesasIniciales;
};

// Convierte una mesa al formato que usan las pantallas de reservas
export const aFormatoReserva = (m) => ({
  id: m.id,
  capacity: m.sillas,
  zone: m.ubicacion,
  tipo: m.tipo,
});

export function useMesas() {
  const [mesas, setMesas] = useState(cargarMesas);

  useEffect(() => {
    try {
      localStorage.setItem(MESAS_KEY, JSON.stringify(mesas));
    } catch {
      // almacenamiento no disponible
    }
  }, [mesas]);

  const siguienteNumero = () => (mesas.length ? Math.max(...mesas.map((m) => m.id)) + 1 : 1);

  const existeNumero = (id, excluirId = null) =>
    mesas.some((m) => m.id === id && m.id !== excluirId);

  const agregarMesa = (datos) => {
    if (existeNumero(datos.id)) {
      return { ok: false, error: `Ya existe la mesa N.º ${datos.id}.` };
    }
    setMesas((prev) => [...prev, datos].sort((a, b) => a.id - b.id));
    return { ok: true };
  };

  const actualizarMesa = (idOriginal, datos) => {
    if (existeNumero(datos.id, idOriginal)) {
      return { ok: false, error: `Ya existe la mesa N.º ${datos.id}.` };
    }
    setMesas((prev) =>
      prev.map((m) => (m.id === idOriginal ? datos : m)).sort((a, b) => a.id - b.id)
    );
    return { ok: true };
  };

  const eliminarMesa = (id) => setMesas((prev) => prev.filter((m) => m.id !== id));

  const cambiarOperativa = (id) =>
    setMesas((prev) => prev.map((m) => (m.id === id ? { ...m, operativa: !m.operativa } : m)));

  const restaurarMesas = () => setMesas(mesasIniciales);

  // Solo las mesas operativas se pueden reservar
  const mesasReservables = mesas.filter((m) => m.operativa).map(aFormatoReserva);

  return {
    mesas,
    mesasReservables,
    siguienteNumero,
    agregarMesa,
    actualizarMesa,
    eliminarMesa,
    cambiarOperativa,
    restaurarMesas,
  };
}
