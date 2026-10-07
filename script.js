// 1. Configuración de Firebase con tu URL de SmartAir
const firebaseConfig = {
  databaseURL: "https://smartair-f352a-default-rtdb.firebaseio.com"
};

// 2. Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 3. Referencia al nodo /monitor/actual
const monitorRef = db.ref("monitor/actual");

// 4. Elementos del DOM
const elCalidad = document.getElementById("val-calidad");
const elRsRo = document.getElementById("val-rsro");
const elTimestamp = document.getElementById("val-timestamp");
const barCalidad = document.getElementById("bar-calidad");
const barRsRo = document.getElementById("bar-rsro");
const badgeCalidad = document.getElementById("badge-calidad");
const statusDot = document.getElementById("status-dot");
const statusText = document.getElementById("status-text");

// 5. Escuchador en tiempo real
monitorRef.on("value", (snapshot) => {
  const data = snapshot.val();

  if (data) {
    // Extraer valores del objeto de Firebase
    const calidad = data.calidad ?? 0;
    const rsRo = data.rs_ro ?? 0;
    const timestamp = data.timestamp;

    // Actualizar valores numéricos en la vista
    if (elCalidad) elCalidad.textContent = calidad;
    if (elRsRo) elRsRo.textContent = Number(rsRo).toFixed(3);

    // Formatear Timestamp a hora local
    if (elTimestamp && timestamp) {
      const fecha = new Date(timestamp * 1000);
      elTimestamp.textContent = fecha.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
    }

    // Actualizar barra y nivel de calidad del aire
    if (barCalidad && badgeCalidad) {
      barCalidad.style.width = `${Math.min(calidad, 100)}%`;

      if (calidad >= 80) {
        badgeCalidad.textContent = "Excelente";
        badgeCalidad.style.background = "rgba(52, 211, 153, 0.2)";
        badgeCalidad.style.color = "var(--green)";
        barCalidad.style.background = "var(--green)";
      } else if (calidad >= 50) {
        badgeCalidad.textContent = "Aceptable";
        badgeCalidad.style.background = "rgba(251, 191, 36, 0.2)";
        badgeCalidad.style.color = "var(--yellow)";
        barCalidad.style.background = "var(--yellow)";
      } else {
        badgeCalidad.textContent = "Peligro";
        badgeCalidad.style.background = "rgba(244, 63, 94, 0.2)";
        badgeCalidad.style.color = "var(--red)";
        barCalidad.style.background = "var(--red)";
      }
    }

    // Actualizar barra para la métrica RS/RO
    if (barRsRo) {
      const rsRoPercent = Math.min((rsRo / 10) * 100, 100);
      barRsRo.style.width = `${rsRoPercent}%`;
    }

    // Indicador visual de estado
    if (statusDot && statusText) {
      statusDot.className = "dot on";
      statusText.textContent = "En Vivo";
    }
  } else {
    if (statusDot && statusText) {
      statusText.textContent = "Sin Datos";
      statusDot.className = "dot off";
    }
  }
}, (error) => {
  console.error("Error leyendo desde Firebase:", error);
  if (statusDot && statusText) {
    statusText.textContent = "Error de Conexión";
    statusDot.className = "dot off";
  }
});