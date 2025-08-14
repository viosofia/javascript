// Datos
const especialidades = ["Clínica Médica", "Pediatría", "Urología", "Dermatología", "Ginecología", "Endocrinología"];

// DOM
const contenedorEspecialidades = document.getElementById("lista-especialidades");
const contenedorTurnos = document.getElementById("lista-turnos");
const inputFecha = document.getElementById("fecha");
const mensaje = document.createElement("p");
contenedorTurnos.appendChild(mensaje);

// Funciones
function generarHorarios(inicio = "08:00", fin = "17:00", intervaloMin = 30) {
    const horarios = [];
    let [hora, minuto] = inicio.split(":").map(Number);
    const [horaFin, minutoFin] = fin.split(":").map(Number);

    while (hora < horaFin || (hora === horaFin && minuto <= minutoFin)) {
        horarios.push(`${hora.toString().padStart(2, "0")}:${minuto.toString().padStart(2, "0")}`);
        minuto += intervaloMin;
        if (minuto >= 60) {
            hora += 1;
            minuto -= 60;
        }
    }

    return horarios;
}


const turnosPorEspecialidad = especialidades.map(() => generarHorarios());


function mostrarEspecialidades() {
    especialidades.forEach((esp, index) => {
        const boton = document.createElement("button");
        boton.textContent = esp;
        boton.addEventListener("click", () => mostrarTurnos(index));
        contenedorEspecialidades.appendChild(boton);
    });
}


function mostrarTurnos(indiceEspecialidad) {
    contenedorTurnos.innerHTML = "";

    const fechaSeleccionada = inputFecha.value;
    if (!fechaSeleccionada) {
        mensaje.textContent = "Por favor, selecciona una fecha.";
        contenedorTurnos.appendChild(mensaje);
        return;
    }

    const turnos = turnosPorEspecialidad[indiceEspecialidad];
    const turnosGuardados = JSON.parse(localStorage.getItem("turnosReservados")) || [];

    const turnosDisponibles = turnos.filter(t => 
        !turnosGuardados.find(r => r.especialidad === especialidades[indiceEspecialidad] && r.fecha === fechaSeleccionada && r.hora === t)
    );

    if (turnosDisponibles.length === 0) {
        mensaje.textContent = "No hay turnos disponibles para esta especialidad y fecha.";
        contenedorTurnos.appendChild(mensaje);
        return;
    }

    const info = document.createElement("p");
    info.textContent = `${especialidades[indiceEspecialidad]}`;
    contenedorTurnos.appendChild(info);

    turnosDisponibles.forEach((turno) => {
        const div = document.createElement("div");
        div.textContent = turno;
        const btnReservar = document.createElement("button");
        btnReservar.textContent = "Reservar";
        btnReservar.addEventListener("click", () => reservarTurno(indiceEspecialidad, fechaSeleccionada, turno));
        div.appendChild(btnReservar);
        contenedorTurnos.appendChild(div);
    });
}


function reservarTurno(indiceEspecialidad, fecha, turno) {
    const turnoReservado = {
        especialidad: especialidades[indiceEspecialidad],
        fecha: fecha,
        hora: turno
    };

    const turnosGuardados = JSON.parse(localStorage.getItem("turnosReservados")) || [];
    turnosGuardados.push(turnoReservado);
    localStorage.setItem("turnosReservados", JSON.stringify(turnosGuardados));

    mostrarTurnos(indiceEspecialidad);
}


// Inicializar
mostrarEspecialidades();