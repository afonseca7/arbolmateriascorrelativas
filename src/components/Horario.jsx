import { useMemo } from 'react';
import { ANIOS } from '../data/materias';
import './Horario.css';

const DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const BLOQUE_H = 20; // px por cada bloque de 15 min

function timeToMinutes(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function minutesToTime(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
}

export default function Horario({ materias, onVolver }) {
  const cursando = materias.filter(m => m.estado === 'cursando');

  const { minMin, maxMin, diasVisibles, bloques } = useMemo(() => {
    let minMin = Infinity;
    let maxMin = -Infinity;
    let tieneSabado = false;

    cursando.forEach(m => {
      if (!m.horarios) return;
      m.horarios.forEach(h => {
        if (h.dia === 'Sáb') { tieneSabado = true; }
        const ini = timeToMinutes(h.inicio);
        const fin = timeToMinutes(h.fin);
        if (ini < minMin) minMin = ini;
        if (fin > maxMin) maxMin = fin;
      });
    });

    if (minMin === Infinity) { minMin = timeToMinutes('17:00'); maxMin = timeToMinutes('23:15'); }
    minMin = Math.floor(minMin / 15) * 15;
    maxMin = Math.ceil(maxMin / 15) * 15;

    const diasVisibles = tieneSabado ? DIAS : DIAS.filter(d => d !== 'Sáb');

    // Construir bloques: { dia, top, height, materia, inicio, fin, color }
    const bloques = [];
    cursando.forEach(m => {
      if (!m.horarios) return;
      const color = ANIOS[m.anio].color;
      m.horarios.forEach(h => {
        const ini = timeToMinutes(h.inicio);
        const fin = timeToMinutes(h.fin);
        const top    = ((ini - minMin) / 15) * BLOQUE_H;
        const height = ((fin - ini)    / 15) * BLOQUE_H;
        bloques.push({ dia: h.dia, top, height, materia: m, inicio: h.inicio, fin: h.fin, color });
      });
    });

    return { minMin, maxMin, diasVisibles, bloques };
  }, [cursando]);

  const totalMinutos = maxMin - minMin;
  const totalH = (totalMinutos / 15) * BLOQUE_H;

  // Líneas de hora (cada 30 min)
  const lineas = [];
  for (let t = minMin; t <= maxMin; t += 30) {
    lineas.push({ mins: t, top: ((t - minMin) / 15) * BLOQUE_H });
  }

  if (cursando.length === 0) {
    return (
      <div className="horario-wrap">
        <div className="horario-header">
          <button className="btn-volver" onClick={onVolver}>← Volver al árbol</button>
          <div className="horario-title">Mi Horario</div>
        </div>
        <div className="horario-empty">
          No tenés materias en estado <span>Cursando</span> todavía.<br/>
          Marcá una materia como cursando en el árbol para verla acá.
        </div>
      </div>
    );
  }

  return (
    <div className="horario-wrap">
      <div className="horario-header">
        <button className="btn-volver" onClick={onVolver}>← Volver al árbol</button>
        <div>
          <div className="horario-title">Mi Horario</div>
          <div className="horario-sub">{cursando.length} materia{cursando.length !== 1 ? 's' : ''} cursando</div>
        </div>
      </div>

      <div className="horario-scroll">
        <div className="horario-grilla">

          {/* Columna de horas */}
          <div className="col-horas" style={{ height: totalH }}>
            {lineas.map(l => (
              <div key={l.mins} className="hora-label" style={{ top: l.top }}>
                {minutesToTime(l.mins)}
              </div>
            ))}
          </div>

          {/* Columnas de días */}
          {diasVisibles.map(dia => (
            <div key={dia} className="col-dia" style={{ height: totalH }}>
              <div className="col-dia-header">{dia}</div>

              {/* Líneas de fondo */}
              {lineas.map(l => (
                <div
                  key={l.mins}
                  className={`linea-fondo ${l.mins % 60 === 0 ? 'linea-hora' : 'linea-media'}`}
                  style={{ top: l.top + 32 }} // +32 por el header del día
                />
              ))}

              {/* Bloques de materias */}
              {bloques
                .filter(b => b.dia === dia)
                .map((b, i) => (
                  <div
                    key={i}
                    className="bloque-materia"
                    style={{
                      '--mc': b.color,
                      top: b.top + 32, // +32 por el header
                      height: b.height - 4,
                    }}
                  >
                    <div className="bloque-nombre">{b.materia.nombre}</div>
                    <div className="bloque-hora">{b.inicio} – {b.fin}</div>
                  </div>
                ))
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
