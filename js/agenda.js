// Turnos reservados en agenda
const contenedorAgenda = document.getElementById("lista-turnos");

function mostrarAgenda() {
    const turnosGuardados = JSON.parse(localStorage.getItem("turnosReservados")) || [];

    contenedorAgenda.innerHTML = "";

    if (turnosGuardados.length === 0) {
        const mensaje = document.createElement("p");
        mensaje.textContent = "No hay turnos reservados.";
        contenedorAgenda.appendChild(mensaje);
        return;
    }

    // Ordenar por fecha y hora
    const turnosOrdenados = turnosGuardados.sort((a, b) => {
        const fechaA = new Date(`${a.fecha}T${a.hora}`);
        const fechaB = new Date(`${b.fecha}T${b.hora}`);
        return fechaA - fechaB;
    });

    turnosOrdenados.forEach(turno => {
        const div = document.createElement("div");

        const fecha = new Date(turno.fecha);
        const fechaFormateada = `${fecha.getDate().toString().padStart(2,'0')}/${(fecha.getMonth()+1).toString().padStart(2,'0')}/${fecha.getFullYear()}`;

        // Mostrar especialidad, fecha, hora y datos del paciente
        div.innerHTML = `
            <strong>${turno.especialidad}</strong> - ${fechaFormateada} - ${turno.hora}<br>
            Paciente: ${turno.paciente.nombre} | DNI: ${turno.paciente.dni} | Tel: ${turno.paciente.telefono}
        `;

        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.addEventListener("click", () => eliminarTurno(turno));
        div.appendChild(btnEliminar);

        contenedorAgenda.appendChild(div);
    });
}

function eliminarTurno(turno) {
    let turnosGuardados = JSON.parse(localStorage.getItem("turnosReservados")) || [];
    turnosGuardados = turnosGuardados.filter(t => 
        !(t.especialidad === turno.especialidad && t.fecha === turno.fecha && t.hora === turno.hora)
    );
    localStorage.setItem("turnosReservados", JSON.stringify(turnosGuardados));
    mostrarAgenda();
}

// Inicializar agenda
mostrarAgenda();
