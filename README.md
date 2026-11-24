<img width="1917" height="982" alt="Screenshot 2026-11-24 014604" src="https://github.com/user-attachments/assets/cf686b90-788c-424d-9653-f1d3ad764a37" /># Árbol de Materias Correlativas — UTN FRD (Plan 2023)

**Demo en vivo:** [arbolmateriascorrelativasvercel.vercel.app](https://arbolmateriascorrelativasvercel.vercel.app/)

Herramienta web interactiva para planificar el cursado de Ingeniería en Sistemas de Información en la UTN Facultad Regional Delta (Plan 2023). Permite visualizar las 36 materias distribuidas en 5 años, ver en tiempo real qué materias quedan habilitadas según tu avance y organizar la grilla semanal sin choques horarios.

## Capturas

<!-- Reemplazá estas dos líneas arrastrando tus 2 capturas directo acá adentro en el editor de GitHub -->
![Grafo interactivo de correlatividades](<img width="1917" height="982" alt="Screenshot 2026-11-24 014604" src="https://github.com/user-attachments/assets/f2ed312f-c5f1-42f1-8638-b6473868d255" />)
![Grilla horaria semanal](<img width="1917" height="968" alt="Screenshot 2026-11-24 014706" src="https://github.com/user-attachments/assets/ac9c7d2c-ecc9-4562-a0ca-1df610bfe4f6" />)

## Funcionalidades principales

- **Grafo dinámico de correlatividades:** Cálculo automático de materias habilitadas para cursar y aprobar en base al estado marcado por el estudiante.
- **Plan 2023 completo:** Modelado de las 36 materias de la carrera organizadas por año.
- **Grilla horaria semanal:** Vista de calendario para armar la cursada y detectar superposiciones rápidamente.
- **Persistencia local:** Guardado automático del progreso y horarios en el navegador mediante `localStorage`, sin necesidad de crear cuenta.

## Stack técnico

- **Frontend:** React 18, Vite, CSS
- **Visualización de grafos:** ReactFlow
- **Persistencia:** `localStorage`
- **Despliegue:** Vercel

## Cómo ejecutarlo en local
```bash
git clone [https://github.com/afonseca7/arbolmateriascorrelativas.git](https://github.com/afonseca7/arbolmateriascorrelativas.git)
cd arbolmateriascorrelativas
npm install
npm run dev
```

## Contexto y enfoque de desarrollo

Proyecto propio nacido de una necesidad real como estudiante de Ingeniería en Sistemas (UTN FRD). Definí el modelado de reglas de correlatividad del Plan 2023, la estructura de pantallas y las iteraciones de UX/UI a partir del uso real, implementando el código mediante un flujo de prototipado asistido por IA (Claude) y validando manualmente cada regla de negocio y vista.

```bash
git clone [https://github.com/afonseca7/arbolmateriascorrelativas.git](https://github.com/afonseca7/arbolmateriascorrelativas.git)
cd arbolmateriascorrelativas
npm install
npm run dev
