import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  MarkerType,
  useReactFlow,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { MATERIAS_INIT, ESTADOS, ANIOS } from './data/materias';
import { calcularEstados, siguienteEstado } from './utils/logica';
import Leyenda from './components/Leyenda';
import MateriaNode from './components/MateriaNode';
import './App.css';

const STORAGE_KEY = 'utn-isi-frd-estados-v1';
const nodeTypes = { materia: MateriaNode };

const COLUMNA_X = { 1: 0, 2: 260, 3: 520, 4: 780, 5: 1040 };
const CARD_H = 105;
const GAP_Y = 24;

function buildPositions(materias) {
  const contador = {};
  const pos = {};
  materias.forEach((m) => {
    const col = contador[m.anio] ?? 0;
    contador[m.anio] = col + 1;
    pos[m.id] = { x: COLUMNA_X[m.anio], y: col * (CARD_H + GAP_Y) };
  });
  return pos;
}

function cargarEstados() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function guardarEstados(materias) {
  const mapa = {};
  materias.forEach((m) => { mapa[m.id] = m.estado; });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mapa));
}

function aplicarGuardado(materias, guardado) {
  if (!guardado) return materias;
  return materias.map((m) => guardado[m.id] ? { ...m, estado: guardado[m.id] } : m);
}

const posicionesIniciales = buildPositions(MATERIAS_INIT);

// ── Componente interno (necesita estar dentro de ReactFlowProvider) ──────────
function FlowApp() {
  const { fitView } = useReactFlow();

  const [materias, setMaterias] = useState(() => {
    const guardado = cargarEstados();
    return calcularEstados(aplicarGuardado(MATERIAS_INIT, guardado));
  });

  const [filtroAnio, setFiltroAnio]       = useState(null);
  const [soloDisponibles, setSoloDisponibles] = useState(false);
  const resaltadaRef = useRef(null);

  // Historial de posiciones para undo/redo
  // Cada entrada es un mapa { [id]: {x, y} }
  const historialPos = useRef([{ ...posicionesIniciales }]);
  const historialIdx = useRef(0);
  const [historialLen, setHistorialLen] = useState(1); // para forzar re-render de botones
  const [historialCursor, setHistorialCursor] = useState(0);

  useEffect(() => { guardarEstados(materias); }, [materias]);

  const cambiarEstado = useCallback((id) => {
    setMaterias((prev) => {
      const next = prev.map((m) =>
        m.id === id ? { ...m, estado: siguienteEstado(m.estado) } : m
      );
      return calcularEstados(next);
    });
  }, []);

  const resetear = () => {
    if (!confirm('¿Resetear todo el progreso?')) return;
    localStorage.removeItem(STORAGE_KEY);
    setMaterias(calcularEstados(MATERIAS_INIT));
  };

  // Resetear solo posiciones al layout original
  const resetearPosiciones = useCallback(() => {
    setNodes((prev) =>
      prev.map((n) => ({
        ...n,
        position: posicionesIniciales[parseInt(n.id)] ?? n.position,
      }))
    );
    // Guardar en historial
    const nuevo = { ...posicionesIniciales };
    const base = historialPos.current.slice(0, historialIdx.current + 1);
    historialPos.current = [...base, nuevo];
    historialIdx.current = historialPos.current.length - 1;
    setHistorialLen(historialPos.current.length);
    setHistorialCursor(historialIdx.current);
    setTimeout(() => fitView({ padding: 0.15, duration: 400 }), 50);
  }, []);

  const undo = useCallback(() => {
    if (historialIdx.current <= 0) return;
    historialIdx.current -= 1;
    const snap = historialPos.current[historialIdx.current];
    setNodes((prev) =>
      prev.map((n) => ({ ...n, position: snap[parseInt(n.id)] ?? n.position }))
    );
    setHistorialCursor(historialIdx.current);
  }, []);

  const redo = useCallback(() => {
    if (historialIdx.current >= historialPos.current.length - 1) return;
    historialIdx.current += 1;
    const snap = historialPos.current[historialIdx.current];
    setNodes((prev) =>
      prev.map((n) => ({ ...n, position: snap[parseInt(n.id)] ?? n.position }))
    );
    setHistorialCursor(historialIdx.current);
  }, []);

  // Hover DOM directo
  const hoverTimer = useRef(null);

const handleHover = useCallback((id, allIds) => {
  clearTimeout(hoverTimer.current);
  hoverTimer.current = setTimeout(() => {
    resaltadaRef.current = id;
    if (id === null) return;
    const relacionados = new Set(allIds);
    relacionados.add(id);
    document.querySelectorAll('.react-flow__node').forEach((el) => {
      const nodeId = parseInt(el.getAttribute('data-id'));
      el.style.opacity = relacionados.has(nodeId) ? '1' : '0.15';
    });
    document.querySelectorAll('.react-flow__edge').forEach((el) => {
      const edgeId = el.getAttribute('id') || '';
      const parts = edgeId.replace(/^[ca]-/, '').split('-');
      const src = parseInt(parts[0]);
      const tgt = parseInt(parts[1]);
      el.style.opacity = (src === id || tgt === id) ? '1' : '0.05';
    });
  }, 600);
}, []);

  const handleHoverLeave = useCallback(() => {
    clearTimeout(hoverTimer.current);
    resaltadaRef.current = null;
    document.querySelectorAll('.react-flow__node').forEach((el) => { el.style.opacity = ''; });
    document.querySelectorAll('.react-flow__edge').forEach((el) => { el.style.opacity = ''; });
  }, []);

  const materiasVisibles = useMemo(() => materias.filter((m) => {
    if (filtroAnio && m.anio !== filtroAnio) return false;
    if (soloDisponibles && m.estado !== 'disponible' && m.estado !== 'cursando') return false;
    return true;
  }), [materias, filtroAnio, soloDisponibles]);

  const relacionadosPorId = useMemo(() => {
    const mapa = {};
    materias.forEach((m) => {
      mapa[m.id] = [
        ...m.correlativasCursar,
        ...m.correlativasAprobar,
        ...materias.filter((x) =>
          x.correlativasCursar.includes(m.id) || x.correlativasAprobar.includes(m.id)
        ).map((x) => x.id),
      ];
    });
    return mapa;
  }, [materias]);

  const rfNodes = useMemo(() =>
    materiasVisibles.map((m) => ({
      id: String(m.id),
      type: 'materia',
      position: posicionesIniciales[m.id] ?? { x: 0, y: 0 },
      data: {
        materia: m,
        onCambiar: cambiarEstado,
        onHover: handleHover,
        onHoverLeave: handleHoverLeave,
        relacionados: relacionadosPorId[m.id] ?? [],
      },
    })),
    [materiasVisibles, cambiarEstado, handleHover, handleHoverLeave, relacionadosPorId]
  );

  const rfEdges = useMemo(() => {
    const edges = [];
    materiasVisibles.forEach((m) => {
      m.correlativasCursar.forEach((srcId) => {
        edges.push({
          id: `c-${srcId}-${m.id}`,
          source: String(srcId), target: String(m.id), type: 'smoothstep',
          style: { stroke: 'rgba(79,124,255,0.3)', strokeWidth: 1.5 },
          markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(79,124,255,0.4)', width: 12, height: 12 },
        });
      });
      m.correlativasAprobar.forEach((srcId) => {
        edges.push({
          id: `a-${srcId}-${m.id}`,
          source: String(srcId), target: String(m.id), type: 'smoothstep',
          style: { stroke: 'rgba(255,159,79,0.3)', strokeWidth: 1.5 },
          markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(255,159,79,0.4)', width: 12, height: 12 },
        });
      });
    });
    return edges;
  }, [materiasVisibles]);

  const [nodes, setNodes, onNodesChange] = useNodesState(rfNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(rfEdges);

  // Sync nodos cuando cambia estado/filtro, preservando posiciones actuales
  useEffect(() => {
    setNodes((prev) => {
      const posMap = {};
      prev.forEach((n) => { posMap[n.id] = n.position; });
      return rfNodes.map((n) => ({ ...n, position: posMap[n.id] ?? n.position }));
    });
  }, [rfNodes, setNodes]);

  useEffect(() => { setEdges(rfEdges); }, [rfEdges, setEdges]);

  // Guardar snapshot en historial cuando el usuario termina de arrastrar un nodo
  const onNodeDragStop = useCallback((_event, _node, allNodes) => {
    const snap = {};
    allNodes.forEach((n) => { snap[parseInt(n.id)] = { ...n.position }; });
    // Descartar futuros si estamos en medio del historial
    const base = historialPos.current.slice(0, historialIdx.current + 1);
    historialPos.current = [...base, snap];
    // Limitar a 50 pasos
    if (historialPos.current.length > 50) historialPos.current.shift();
    historialIdx.current = historialPos.current.length - 1;
    setHistorialLen(historialPos.current.length);
    setHistorialCursor(historialIdx.current);
  }, []);

  const canUndo = historialCursor > 0;
  const canRedo = historialCursor < historialLen - 1;

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <div className="header-logo">ISI</div>
          <div>
            <div className="header-title">Plan de Estudios 2023</div>
            <div className="header-sub">Ingeniería en Sistemas de Información · UTN FRD</div>
          </div>
        </div>
        <div className="header-controls">
          <div className="filtros-anio">
            <button className={`btn-anio ${filtroAnio === null ? 'activo' : ''}`} onClick={() => setFiltroAnio(null)}>Todos</button>
            {Object.entries(ANIOS).map(([anio, cfg]) => (
              <button key={anio}
                className={`btn-anio ${filtroAnio === Number(anio) ? 'activo' : ''}`}
                style={{ '--anio-color': cfg.color }}
                onClick={() => setFiltroAnio(filtroAnio === Number(anio) ? null : Number(anio))}
              >{cfg.label}</button>
            ))}
          </div>

          <div className="btn-group">
            <button className="btn-icon" onClick={undo} disabled={!canUndo} title="Deshacer movimiento">↩</button>
            <button className="btn-icon" onClick={redo} disabled={!canRedo} title="Rehacer movimiento">↪</button>
            <button className="btn-icon" onClick={resetearPosiciones} title="Resetear posiciones al layout original">⊞</button>
          </div>

          <button className={`btn-toggle ${soloDisponibles ? 'activo' : ''}`} onClick={() => setSoloDisponibles(v => !v)}>Solo disponibles</button>
          <button className="btn-reset" onClick={resetear}>Resetear progreso</button>
        </div>
      </header>

      <div className="main">
        <Leyenda materias={materias} />
        <div className="canvas-wrap">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeDragStop={onNodeDragStop}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.15 }}
            minZoom={0.3}
            maxZoom={1.5}
            onPaneClick={handleHoverLeave}
            proOptions={{ hideAttribution: true }}
          >
            <Background color="#1a2035" gap={32} size={1} />
            <Controls style={{ background: '#111520', border: '1px solid #1e2740', borderRadius: 8 }} />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <FlowApp />
    </ReactFlowProvider>
  );
}
