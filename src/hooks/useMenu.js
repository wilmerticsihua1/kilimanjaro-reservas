import { useEffect, useState } from 'react';

const MENU_KEY = 'kilimanjaro-menu-v4';

export const CATEGORIAS = ['Entradas', 'Platos de fondo', 'Postres', 'Bebidas'];

// Fotos libres de Wikimedia Commons (se cargan desde internet).
// Para cada archivo: [foto de 500 px (tamaño estándar de Wikimedia), foto original].
// Si ninguna carga (sin internet), la web muestra una foto local de respaldo.
const COMMONS = 'https://commons.wikimedia.org/wiki/';
const FOTOS = {
  'Ceviche peruano.jpg': ['https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Ceviche_peruano.jpg/500px-Ceviche_peruano.jpg', 'https://upload.wikimedia.org/wikipedia/commons/6/68/Ceviche_peruano.jpg'],
  'Causa limeña.JPG': ['https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Causa_lime%C3%B1a.JPG/500px-Causa_lime%C3%B1a.JPG', 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Causa_lime%C3%B1a.JPG'],
  'Papa a la huancaina.jpg': ['https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Papa_a_la_huancaina.jpg/500px-Papa_a_la_huancaina.jpg', 'https://upload.wikimedia.org/wikipedia/commons/7/74/Papa_a_la_huancaina.jpg'],
  'Anticuchos de Corazon.jpg': ['https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Anticuchos_de_Corazon.jpg/500px-Anticuchos_de_Corazon.jpg', 'https://upload.wikimedia.org/wikipedia/commons/8/83/Anticuchos_de_Corazon.jpg'],
  'Tiradito.jpg': ['https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Tiradito.jpg/500px-Tiradito.jpg', 'https://upload.wikimedia.org/wikipedia/commons/1/18/Tiradito.jpg'],
  'Rocoto relleno arequipeño.jpg': ['https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Rocoto_relleno_arequipe%C3%B1o.jpg/500px-Rocoto_relleno_arequipe%C3%B1o.jpg', 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Rocoto_relleno_arequipe%C3%B1o.jpg'],
  'Lomo saltado peruano.jpg': ['https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Lomo_saltado_peruano.jpg/500px-Lomo_saltado_peruano.jpg', 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Lomo_saltado_peruano.jpg'],
  'Ají de gallina - Tradicional.jpg': ['https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Aj%C3%AD_de_gallina_-_Tradicional.jpg/500px-Aj%C3%AD_de_gallina_-_Tradicional.jpg', 'https://upload.wikimedia.org/wikipedia/commons/4/44/Aj%C3%AD_de_gallina_-_Tradicional.jpg'],
  'Arroz con mariscos.jpg': ['https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Arroz_con_mariscos.jpg/500px-Arroz_con_mariscos.jpg', 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Arroz_con_mariscos.jpg'],
  'Pollo a la brasa peruano.jpg': ['https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Pollo_a_la_brasa_peruano.jpg/500px-Pollo_a_la_brasa_peruano.jpg', 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Pollo_a_la_brasa_peruano.jpg'],
  'Arroz chaufa.JPG': ['https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Arroz_chaufa.JPG/500px-Arroz_chaufa.JPG', 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Arroz_chaufa.JPG'],
  'Seco de cabrito con frijoles.JPG': ['https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Seco_de_cabrito_con_frijoles.JPG/500px-Seco_de_cabrito_con_frijoles.JPG', 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Seco_de_cabrito_con_frijoles.JPG'],
  'Tacu tacu con lomo al jugo. La Olla de Juanita, Ica.jpg': ['https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Tacu_tacu_con_lomo_al_jugo._La_Olla_de_Juanita%2C_Ica.jpg/500px-Tacu_tacu_con_lomo_al_jugo._La_Olla_de_Juanita%2C_Ica.jpg', 'https://upload.wikimedia.org/wikipedia/commons/e/e2/Tacu_tacu_con_lomo_al_jugo._La_Olla_de_Juanita%2C_Ica.jpg'],
  'Jalea mixta.JPG': ['https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Jalea_mixta.JPG/500px-Jalea_mixta.JPG', 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Jalea_mixta.JPG'],
  'Arroz con pato a la chiclayana.JPG': ['https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Arroz_con_pato_a_la_chiclayana.JPG/500px-Arroz_con_pato_a_la_chiclayana.JPG', 'https://upload.wikimedia.org/wikipedia/commons/8/85/Arroz_con_pato_a_la_chiclayana.JPG'],
  'Tallarines verdes huancaina.jpg': ['https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Tallarines_verdes_huancaina.jpg/500px-Tallarines_verdes_huancaina.jpg', 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Tallarines_verdes_huancaina.jpg'],
  'Suspiro limeño.jpg': ['https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Suspiro_lime%C3%B1o.jpg/500px-Suspiro_lime%C3%B1o.jpg', 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Suspiro_lime%C3%B1o.jpg'],
  'Picarones.jpg': ['https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Picarones.jpg/500px-Picarones.jpg', 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Picarones.jpg'],
  'Arroz con leche estilo peruano.jpg': ['https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Arroz_con_leche_estilo_peruano.jpg/500px-Arroz_con_leche_estilo_peruano.jpg', 'https://upload.wikimedia.org/wikipedia/commons/5/59/Arroz_con_leche_estilo_peruano.jpg'],
  'Alfajores.JPG': ['https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Alfajores.JPG/500px-Alfajores.JPG', 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Alfajores.JPG'],
  'Chicha Morada 2017.jpg': ['https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Chicha_Morada_2017.jpg/500px-Chicha_Morada_2017.jpg', 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Chicha_Morada_2017.jpg'],
  'Pisco sour.jpg': ['https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Pisco_sour.jpg/500px-Pisco_sour.jpg', 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Pisco_sour.jpg'],
  'Mug of Lemonade.jpg': ['https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Mug_of_Lemonade.jpg/500px-Mug_of_Lemonade.jpg', 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Mug_of_Lemonade.jpg'],
};
export const fuente = (archivo) => `${COMMONS}File:${encodeURIComponent(archivo.replace(/ /g, '_'))}`;

// Fotos locales (carpeta public/img) por si no hay internet
export const FOTOS_RESPALDO = {
  Entradas: '/img/plato2.jpg',
  'Platos de fondo': '/img/plato1.jpg',
  Postres: '/img/plato2.jpg',
  Bebidas: '/img/plato1.jpg',
};

const plato = (id, nombre, categoria, precio, descripcion, archivo) => ({
  id, nombre, categoria, precio, descripcion, disponible: true,
  imagen: archivo ? FOTOS[archivo][0] : '',
  imagenOriginal: archivo ? FOTOS[archivo][1] : '',
  credito: archivo ? fuente(archivo) : '',
});

export const platosIniciales = [
  // Entradas
  plato('p-1', 'Ceviche clásico', 'Entradas', 38, 'Pescado del día marinado en limón, ají limo, cebolla morada, camote y choclo.', 'Ceviche peruano.jpg'),
  plato('p-2', 'Causa limeña', 'Entradas', 24, 'Papa amarilla con ají amarillo, rellena de pollo y palta.', 'Causa limeña.JPG'),
  plato('p-3', 'Papa a la huancaína', 'Entradas', 18, 'Papa sancochada bañada en crema de ají amarillo y queso fresco.', 'Papa a la huancaina.jpg'),
  plato('p-11', 'Anticuchos de corazón', 'Entradas', 28, 'Brochetas de corazón de res a la parrilla con papas doradas y choclo.', 'Anticuchos de Corazon.jpg'),
  plato('p-12', 'Tiradito', 'Entradas', 34, 'Láminas de pescado fresco en crema de ají amarillo y limón.', 'Tiradito.jpg'),
  plato('p-13', 'Rocoto relleno', 'Entradas', 30, 'Rocoto arequipeño relleno de carne, gratinado con queso y pastel de papa.', 'Rocoto relleno arequipeño.jpg'),
  // Platos de fondo
  plato('p-4', 'Lomo saltado', 'Platos de fondo', 45, 'Trozos de lomo salteados al wok con cebolla, tomate, papas fritas y arroz.', 'Lomo saltado peruano.jpg'),
  plato('p-5', 'Ají de gallina', 'Platos de fondo', 32, 'Gallina deshilachada en crema de ají amarillo, con arroz y papa.', 'Ají de gallina - Tradicional.jpg'),
  plato('p-6', 'Arroz con mariscos', 'Platos de fondo', 42, 'Arroz norteño con mariscos frescos y salsa criolla.', 'Arroz con mariscos.jpg'),
  plato('p-14', 'Pollo a la brasa (1/4)', 'Platos de fondo', 29, 'Cuarto de pollo a la brasa con papas fritas, ensalada y cremas.', 'Pollo a la brasa peruano.jpg'),
  plato('p-15', 'Arroz chaufa', 'Platos de fondo', 30, 'Arroz salteado al wok con pollo, huevo, cebollita china y sillao.', 'Arroz chaufa.JPG'),
  plato('p-16', 'Seco de cabrito', 'Platos de fondo', 48, 'Cabrito guisado en culantro y chicha de jora, con frejoles y arroz.', 'Seco de cabrito con frijoles.JPG'),
  plato('p-17', 'Tacu tacu con lomo', 'Platos de fondo', 46, 'Tacu tacu crocante de frejoles y arroz con lomo al jugo.', 'Tacu tacu con lomo al jugo. La Olla de Juanita, Ica.jpg'),
  plato('p-18', 'Jalea mixta', 'Platos de fondo', 52, 'Pescado y mariscos fritos con yuca, salsa criolla y tártara.', 'Jalea mixta.JPG'),
  plato('p-19', 'Arroz con pato', 'Platos de fondo', 49, 'Arroz verde al culantro con pato tierno, al estilo chiclayano.', 'Arroz con pato a la chiclayana.JPG'),
  plato('p-20', 'Tallarines verdes', 'Platos de fondo', 33, 'Tallarines en salsa de albahaca y espinaca con papa a la huancaína.', 'Tallarines verdes huancaina.jpg'),
  // Postres
  plato('p-7', 'Suspiro limeño', 'Postres', 16, 'Manjar blanco con merengue al oporto.', 'Suspiro limeño.jpg'),
  plato('p-8', 'Picarones', 'Postres', 15, 'Buñuelos de zapallo y camote con miel de chancaca.', 'Picarones.jpg'),
  plato('p-21', 'Arroz con leche', 'Postres', 12, 'Arroz cremoso con leche, canela y clavo de olor.', 'Arroz con leche estilo peruano.jpg'),
  plato('p-22', 'Alfajores', 'Postres', 10, 'Alfajores de maicena rellenos de manjar blanco (3 unidades).', 'Alfajores.JPG'),
  // Bebidas
  plato('p-9', 'Chicha morada (jarra)', 'Bebidas', 18, 'Preparada en casa con maíz morado, piña y canela.', 'Chicha Morada 2017.jpg'),
  plato('p-23', 'Pisco sour', 'Bebidas', 22, 'Pisco quebranta, limón, jarabe y clara de huevo.', 'Pisco sour.jpg'),
  plato('p-10', 'Limonada frozen', 'Bebidas', 12, 'Limonada helada con hierbabuena.', 'Mug of Lemonade.jpg'),
];

const cargarMenu = () => {
  try {
    const raw = localStorage.getItem(MENU_KEY);
    if (raw) {
      const datos = JSON.parse(raw);
      if (Array.isArray(datos)) return datos;
    }
  } catch {
    // datos dañados o almacenamiento bloqueado: se usan los platos de ejemplo
  }
  return platosIniciales;
};

const nuevoId = () => `p-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`;

export function useMenu() {
  const [platos, setPlatos] = useState(cargarMenu);

  useEffect(() => {
    try {
      localStorage.setItem(MENU_KEY, JSON.stringify(platos));
    } catch {
      // almacenamiento no disponible
    }
  }, [platos]);

  const existeNombre = (nombre, excluirId = null) =>
    platos.some(
      (p) => p.id !== excluirId && p.nombre.trim().toLowerCase() === nombre.trim().toLowerCase()
    );

  const agregarPlato = (datos) => {
    if (existeNombre(datos.nombre)) {
      return { ok: false, error: 'Ya existe un plato con ese nombre.' };
    }
    const plato = { ...datos, id: nuevoId() };
    setPlatos((prev) => [...prev, plato]);
    return { ok: true, plato };
  };

  const actualizarPlato = (id, datos) => {
    if (existeNombre(datos.nombre, id)) {
      return { ok: false, error: 'Ya existe otro plato con ese nombre.' };
    }
    setPlatos((prev) => prev.map((p) => (p.id === id ? { ...p, ...datos, id } : p)));
    return { ok: true };
  };

  const eliminarPlato = (id) => setPlatos((prev) => prev.filter((p) => p.id !== id));

  const cambiarDisponible = (id) =>
    setPlatos((prev) => prev.map((p) => (p.id === id ? { ...p, disponible: !p.disponible } : p)));

  const restaurarMenu = () => setPlatos(platosIniciales);

  return { platos, agregarPlato, actualizarPlato, eliminarPlato, cambiarDisponible, restaurarMenu };
}
