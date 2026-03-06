import { ESTADOS } from '../data/materias';
import './Leyenda.css';

export default function Leyenda({ materias }) {
  const conteo = Object.keys(ESTADOS).reduce((acc, key) => {
    acc[key] = materias.filter((m) => m.estado === key).length;
    return acc;
  }, {});

  const total = materias.length;
  const aprobadas = conteo.aprobada || 0;
  const progreso = Math.round((aprobadas / total) * 100);

  return (
    <div className="leyenda">
      <div className="leyenda-titulo">PROGRESO</div>

      <div className="progreso-barra-wrap">
        <div className="progreso-barra">
          <div
            className="progreso-fill"
            style={{ width: `${progreso}%` }}
          />
        </div>
        <span className="progreso-label">{aprobadas}/{total} — {progreso}%</span>
      </div>

      <div className="leyenda-titulo" style={{ marginTop: 20 }}>ESTADOS</div>
      <div className="leyenda-items">
        {Object.entries(ESTADOS).map(([key, val]) => (
          <div key={key} className="leyenda-item">
            <span className="leyenda-dot" style={{ background: val.color }} />
            <span className="leyenda-nombre">{val.label}</span>
            <span className="leyenda-count" style={{ color: val.color }}>
              {conteo[key] || 0}
            </span>
          </div>
        ))}
      </div>

      <div className="leyenda-titulo" style={{ marginTop: 20 }}>CORRELATIVAS</div>
      <div className="leyenda-items">
        <div className="leyenda-item">
          <svg width="30" height="10" style={{ flexShrink: 0 }}>
            <line x1="0" y1="5" x2="22" y2="5" stroke="rgba(79,124,255,0.8)" strokeWidth="1.5" markerEnd="url(#al)" />
            <defs>
              <marker id="al" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="rgba(79,124,255,0.8)" />
              </marker>
            </defs>
          </svg>
          <span className="leyenda-nombre">Para cursar</span>
        </div>
        <div className="leyenda-item">
          <svg width="30" height="10" style={{ flexShrink: 0 }}>
            <line x1="0" y1="5" x2="22" y2="5" stroke="rgba(255,159,79,0.8)" strokeWidth="1.5" markerEnd="url(#al2)" />
            <defs>
              <marker id="al2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="rgba(255,159,79,0.8)" />
              </marker>
            </defs>
          </svg>
          <span className="leyenda-nombre">Para aprobar</span>
        </div>
      </div>

      <div className="leyenda-hint">
        Hacé click en una materia disponible para cambiar su estado
      </div>
    </div>
  );
}
