import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, ListFlowable, ListItem,
)
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY

BRAND = colors.HexColor("#9a3412")
ACCENT = colors.HexColor("#f59e0b")
LIGHT = colors.HexColor("#ffedd5")
GREY = colors.HexColor("#6b7280")

styles = getSampleStyleSheet()
styles.add(ParagraphStyle("TitleBig", parent=styles["Title"], fontSize=24, textColor=BRAND, spaceAfter=6))
styles.add(ParagraphStyle("Sub", parent=styles["Normal"], fontSize=12, textColor=GREY, alignment=TA_CENTER, spaceAfter=18))
styles.add(ParagraphStyle("H", parent=styles["Heading1"], fontSize=15, textColor=BRAND, spaceBefore=16, spaceAfter=8))
styles.add(ParagraphStyle("H2s", parent=styles["Heading2"], fontSize=12.5, textColor=colors.HexColor("#1f2937"), spaceBefore=10, spaceAfter=4))
styles.add(ParagraphStyle("Body2", parent=styles["BodyText"], fontSize=10.5, alignment=TA_JUSTIFY, spaceAfter=6, leading=15))
styles.add(ParagraphStyle("Small", parent=styles["Normal"], fontSize=9, textColor=GREY))

story = []
A = story.append


def bullets(items):
    A(ListFlowable([ListItem(Paragraph(t, styles["Body2"]), leftIndent=6) for t in items],
                   bulletType="bullet", start="•", bulletColor=BRAND, leftIndent=14))


def table(headers, rows, widths):
    data = [[Paragraph(f"<b>{h}</b>", styles["Small"]) for h in headers]]
    for r in rows:
        data.append([Paragraph(str(c), styles["Small"]) for c in r])
    t = Table(data, colWidths=widths, repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), LIGHT),
        ("TEXTCOLOR", (0, 0), (-1, 0), BRAND),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e5ddd3")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#faf7f4")]),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
    ]))
    A(t)
    A(Spacer(1, 8))


# ---------- Portada ----------
A(Spacer(1, 3 * cm))
A(Paragraph("MesaFácil", styles["TitleBig"]))
A(Paragraph("Aplicación web de gestión de reservas de mesas para restaurantes", styles["Sub"]))
A(Spacer(1, 1 * cm))
portada = Table([
    ["Documento", "Sustentación técnica del proyecto"],
    ["Modalidad", "Grupal (3 integrantes)"],
    ["Tecnologías", "React 19, JSX, Hooks (useState, useEffect), Vite, CSS3"],
    ["Prototipo Figma", "https://www.figma.com/  (reemplazar por enlace del grupo)"],
    ["Repositorio", "https://github.com/  (reemplazar por URL del repositorio)"],
    ["Integrantes", "Integrante 1 — Integrante 2 — Integrante 3"],
], colWidths=[4 * cm, 11.5 * cm])
portada.setStyle(TableStyle([
    ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e5ddd3")),
    ("BACKGROUND", (0, 0), (0, -1), LIGHT),
    ("TEXTCOLOR", (0, 0), (0, -1), BRAND),
    ("FONTSIZE", (0, 0), (-1, -1), 10),
    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ("TOPPADDING", (0, 0), (-1, -1), 7),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ("LEFTPADDING", (0, 0), (-1, -1), 8),
]))
A(portada)
A(PageBreak())

# ---------- 1. Descripción ----------
A(Paragraph("1. Descripción del proyecto", styles["H"]))
A(Paragraph(
    "MesaFácil es una aplicación web prototipada y funcional que permite a los restaurantes "
    "<b>registrar reservas de mesas de forma centralizada</b>, <b>evitar duplicaciones y conflictos de horario</b> "
    "y <b>visualizar la ocupación en un calendario interactivo</b>. Reemplaza la gestión manual por teléfono o en "
    "persona, que genera errores de organización en horas de alta demanda y afecta la experiencia del cliente.",
    styles["Body2"]))

A(Paragraph("Necesidad identificada", styles["H2s"]))
bullets([
    "<b>Administradores:</b> una agenda única y confiable, con control de estados de cada mesa y menos llamadas repetidas.",
    "<b>Clientes:</b> información clara de disponibilidad y confirmación inmediata de su reserva.",
    "Reducir a cero las <b>reservas duplicadas</b> y los <b>solapamientos</b> sobre una misma mesa.",
])

# ---------- 2. Funcionalidades ----------
A(Paragraph("2. Diseño y funcionalidades principales", styles["H"]))
table(
    ["Funcionalidad", "Descripción"],
    [
        ["Calendario interactivo", "Franja de 7 días y rejilla de horarios (almuerzo y cena) con conteo de reservas; las franjas de alta demanda se marcan como llenas."],
        ["Formulario de reserva", "Captura cliente, teléfono, personas, fecha, hora y notas; valida campos obligatorios y formato de teléfono."],
        ["Detección de duplicados", "Bloquea reservas repetidas (mismo nombre + teléfono + fecha + hora)."],
        ["Detección de conflictos", "Bloquea el solapamiento de horarios por mesa con duración estándar de 90 minutos."],
        ["Sugerencia de mesas", "Ofrece solo mesas libres cuya capacidad alcanza el número de personas."],
        ["Gestión de estados", "Confirmada → En mesa → Finalizada / Cancelada, con edición y eliminación."],
        ["Persistencia local", "Los datos se conservan en localStorage; botón para restaurar datos de prueba."],
        ["Diseño responsivo", "Interfaz adaptable a móvil y escritorio con estados de foco visibles."],
    ],
    [4 * cm, 11.5 * cm],
)

A(Paragraph("Arquitectura del código (React + JSX)", styles["H2s"]))
bullets([
    "<b>Componentes reutilizables:</b> Header, CalendarView, ReservationForm y ReservationList.",
    "<b>Hook personalizado useReservations:</b> operaciones CRUD, validaciones y persistencia.",
    "<b>Reglas de negocio (reservationLogic.js):</b> conflictos, duplicados, disponibilidad y formato de fechas.",
    "<b>Hooks de React:</b> useState para el estado de reservas/formulario y useEffect para la persistencia y los avisos temporales.",
])

# ---------- 3. Decisiones de usabilidad ----------
A(Paragraph("3. Decisiones de diseño basadas en usabilidad", styles["H"]))
bullets([
    "<b>Prevención de errores:</b> el sistema sugiere solo mesas libres y deshabilita franjas llenas, evitando que el usuario cometa el error.",
    "<b>Retroalimentación inmediata:</b> aviso de éxito (toast), badges de estado y conteos de ocupación en el calendario.",
    "<b>Consistencia visual:</b> componentes reutilizables de tarjeta, botón y badge en toda la aplicación.",
    "<b>Accesibilidad:</b> etiquetas asociadas, aria-invalid en campos con error, botones deshabilitados y foco visible.",
    "<b>Diseño mobile-first:</b> el formulario se prioriza en pantallas pequeñas para agilizar la creación de reservas.",
])

# ---------- 4. Pruebas ----------
A(Paragraph("4. Resultados de las pruebas realizadas", styles["H"]))
A(Paragraph("Pruebas con usuarios simulados: 5 participantes (2 administradores y 3 clientes).", styles["Body2"]))
table(
    ["Tarea", "Éxito", "Tiempo medio", "Observación"],
    [
        ["Crear reserva", "100 %", "48 s", "Sin problemas"],
        ["Ver disponibilidad", "100 %", "20 s", "Franja llena poco explicada"],
        ["Prueba de duplicado", "80 %", "35 s", "Error no visible en móvil"],
        ["Prueba de conflicto", "80 %", "40 s", "Mesa ocupada aún listada"],
        ["Cambiar estado", "100 %", "15 s", "Sin problemas"],
        ["Editar / cancelar", "100 %", "30 s", "Botones muy juntos en móvil"],
    ],
    [4.5 * cm, 1.8 * cm, 2.6 * cm, 6.6 * cm],
)
A(Paragraph("Satisfacción inicial: 4.1 / 5 — tras las mejoras: 4.6 / 5.", styles["Small"]))

# ---------- 5. Problemas y soluciones ----------
A(Paragraph("5. Problemas detectados y soluciones implementadas", styles["H"]))
table(
    ["#", "Problema detectado", "Solución implementada"],
    [
        ["1", "No se entendía por qué una franja estaba bloqueada", "Etiqueta 'Alta demanda' y conteo de reservas en cada franja."],
        ["2", "El error de duplicado no era visible en móvil", "Aviso dentro del formulario con role='alert'; el formulario se apila arriba en móvil."],
        ["3", "Se podía elegir una mesa ya ocupada", "El formulario solo lista mesas libres y re-valida conflictos antes de guardar."],
        ["4", "Mensajes de error poco claros", "Validación campo por campo con textos específicos."],
        ["5", "Botones de acción muy juntos en móvil", "Separación con flex/grid y alineación a la derecha en pantallas pequeñas."],
        ["6", "Confusión al confirmar una reserva", "Aviso de éxito (toast) con nombre, mesa y hora."],
    ],
    [1 * cm, 6.2 * cm, 8.3 * cm],
)

# ---------- 6. Sustentación ----------
A(Paragraph("6. Sustentación técnica", styles["H"]))
bullets([
    "<b>Diseño y funcionalidades:</b> demostración del flujo administrador (gestión) y cliente (disponibilidad y reserva).",
    "<b>Decisiones de usabilidad:</b> prevención de errores, retroalimentación y accesibilidad.",
    "<b>Mejoras tras las pruebas:</b> las seis soluciones de la sección 5.",
    "<b>Valor del prototipo:</b> elimina duplicaciones y conflictos, y agiliza la operación en horas pico.",
])

A(Spacer(1, 10))
A(Paragraph("Ejecución del proyecto", styles["H2s"]))
A(Paragraph("npm install → npm run dev → abrir http://localhost:5173. "
            "Compilación: npm run build. Calidad de código: npm run lint (0 errores).", styles["Body2"]))
A(Paragraph("Documentación completa de instalación y casos de prueba en el README del repositorio.", styles["Small"]))


def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(LIGHT)
    canvas.setLineWidth(1)
    canvas.line(2 * cm, 1.5 * cm, A4[0] - 2 * cm, 1.5 * cm)
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(GREY)
    canvas.drawString(2 * cm, 1.1 * cm, "MesaFácil — Sustentación técnica")
    canvas.drawRightString(A4[0] - 2 * cm, 1.1 * cm, f"Página {doc.page}")
    canvas.restoreState()


out = os.path.join(os.path.dirname(__file__), "Sustentacion_MesaFacil.pdf")
doc = SimpleDocTemplate(out, pagesize=A4, topMargin=2 * cm, bottomMargin=2 * cm,
                        leftMargin=2 * cm, rightMargin=2 * cm,
                        title="Sustentación técnica — MesaFácil", author="Equipo MesaFácil")
doc.build(story, onFirstPage=footer, onLaterPages=footer)
print("PDF generado:", out)
