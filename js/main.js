let especialidades = [];
let turnosPorEspecialidad = [];
let paciente = null; 

// DOM
const contenedorPaciente = document.getElementById("form-paciente");
const contenedorEspecialidades = document.getElementById("lista-especialidades");
const contenedorTurnos = document.getElementById("lista-turnos");
const inputFecha = document.getElementById("fecha");
const tituloTurnos = document.getElementById("titulo-turnos");
const mensaje = document.createElement("p");

function generarHorarios(inicio = "08:00", fin = "17:00", intervaloMin = 30) {
    const horarios = [];
    let [hora, minuto] = inicio.split(":").map(Number);
    const [horaFin, minutoFin] = fin.split(":").map(Number);

    while (hora < horaFin || (hora === horaFin && minuto <= minutoFin)) {
        horarios.push(`${hora.toString().padStart(2,"0")}:${minuto.toString().padStart(2,"0")}`);
        minuto += intervaloMin;
        if (minuto >= 60) { hora += 1; minuto -= 60; }
    }
    return horarios;
}

function mostrarFormularioPaciente() {
    contenedorPaciente.innerHTML = `
        <h2>Datos del Paciente</h2>
        <input type="text" id="nombre" placeholder="Nombre" />
        <input type="text" id="apellido" placeholder="Apellido" />
        <input type="text" id="dni" placeholder="DNI" />
        <input type="text" id="contacto" placeholder="Teléfono o Mail" />
        <button id="btnGuardarPaciente">Continuar</button>
    `;

    document.getElementById("btnGuardarPaciente").addEventListener("click", () => {
        const nombre = document.getElementById("nombre").value.trim();
        const apellido = document.getElementById("apellido").value.trim();
        const dni = document.getElementById("dni").value.trim();
        const contacto = document.getElementById("contacto").value.trim();

        if (!nombre || !apellido || !dni || !contacto) {
            Swal.fire({ title: "Error", text: "Completa todos los campos del paciente.", icon: "error", confirmButtonText: "Aceptar" });
            return;
        }

        paciente = { nombre, apellido, dni, contacto };
        Swal.fire({ title: "Paciente registrado", text: `Bienvenido ${nombre} ${apellido}`, icon: "success", confirmButtonText: "Aceptar" });
        
        contenedorPaciente.style.display = "none";
        mostrarEspecialidades();
    });
}


function mostrarEspecialidades() {
    contenedorEspecialidades.innerHTML = "";
    if (!paciente) {
        mensaje.textContent = "Completa los datos del paciente primero.";
        contenedorTurnos.innerHTML = "";
        contenedorTurnos.appendChild(mensaje);
        return;
    }

    if (!inputFecha.value) {
        mensaje.textContent = "Selecciona primero una fecha.";
        contenedorTurnos.innerHTML = "";
        contenedorTurnos.appendChild(mensaje);
        return;
    }

    especialidades.forEach((esp, index) => {
        const boton = document.createElement("button");
        boton.textContent = esp;
        boton.addEventListener("click", () => mostrarTurnos(index));
        contenedorEspecialidades.appendChild(boton);
    });
}


function mostrarTurnos(indiceEspecialidad) {
    contenedorTurnos.innerHTML = "";
    tituloTurnos.textContent = "";

    const fechaSeleccionada = inputFecha.value;
    if (!fechaSeleccionada) {
        mensaje.textContent = "Selecciona una fecha.";
        contenedorTurnos.appendChild(mensaje);
        return;
    }

    const turnos = turnosPorEspecialidad[indiceEspecialidad];
    const turnosGuardados = JSON.parse(localStorage.getItem("turnosReservados")) || [];

    const turnosDisponibles = turnos.filter(t =>
        !turnosGuardados.find(r =>
            r.especialidad === especialidades[indiceEspecialidad] &&
            r.fecha === fechaSeleccionada &&
            r.hora === t
        )
    );

    if (turnosDisponibles.length === 0) {
        mensaje.textContent = "No hay turnos disponibles para esta especialidad y fecha.";
        contenedorTurnos.appendChild(mensaje);
        return;
    }

    const fecha = new Date(fechaSeleccionada);
    const fechaFormateada = `${fecha.getDate().toString().padStart(2,'0')}/${(fecha.getMonth()+1).toString().padStart(2,'0')}/${fecha.getFullYear()}`;

    tituloTurnos.textContent = `Turnos disponibles de "${especialidades[indiceEspecialidad]}" para el ${fechaFormateada}`;

    turnosDisponibles.forEach(turno => {
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
    if (!paciente) return; 

    const turnoReservado = {
        especialidad: especialidades[indiceEspecialidad],
        fecha: fecha,
        hora: turno,
        paciente: paciente 
    };

    const turnosGuardados = JSON.parse(localStorage.getItem("turnosReservados")) || [];
        turnosGuardados.push(turnoReservado);
        localStorage.setItem("turnosReservados", JSON.stringify(turnosGuardados));

        Swal.fire({
            title: "¡Turno reservado!",
            text: `Has reservado ${especialidades[indiceEspecialidad]} el ${fecha} a las ${turno}`,
            icon: "success",
            confirmButtonText: "Aceptar"
        });

        mostrarTurnos(indiceEspecialidad);
}


inputFecha.addEventListener("change", mostrarEspecialidades);

fetch("./data/especialidades.json")
    .then(res => res.json())
    .then(data => {
        especialidades = data.especialidades;
        turnosPorEspecialidad = especialidades.map(() => generarHorarios());
        mostrarFormularioPaciente();
    })
    .catch(() => {
        Swal.fire({
            title: "Error",
            text: "No se pudieron cargar las especialidades.",
            icon: "error",
            confirmButtonText: "Aceptar"
        });
    });
