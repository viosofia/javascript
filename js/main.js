//Datos

const especialidades = ["Clínica Médica", "Pediatría", "Urología", "Dermatología", "Ginecología", "Endocrinología"];

const turnosClinica = ["Lunes 10:00", "Martes 11:30", "Miercoles 17:00", "Jueves 15:00"];
const turnosPediatria = ["Lunes 8:00", "Miercoles 12:00", "Jueves 17:00", "Viernes 10:00"];
const turnosUrologia = ["Martes 8:00", "Miercoles 13:00", "Jueves 9:30", "Viernes 16:30"];
const turnosDermatologia = ["Lunes 9:00", "Martes 10:30", "Jueves 11:00", "Viernes 8:00"];
const turnosGinecologia = ["Lunes 14:00", "Martes 13:30", "Miercoles 9:00", "Viernes 16:00"];
const turnosEndocrinologia = ["Lunes 13:00", "Miercoles 10:00", "Viernes 17:00"];

//Funciones

function seleccionarEspecialidad() {
    let lista = "Especialidades disponibles:\n";
    for (let i = 0; i < especialidades.length; i++) {
        lista = lista + (i + 1) + "-" + especialidades[i] + " \n";
    }
    alert(lista);
}

function obtenerTurnos(especialidad) {
    switch (especialidad) {
        case 1:
            return turnosClinica;
        case 2:
            return turnosPediatria;
        case 3:
            return turnosUrologia;
        case 4:
            return turnosDermatologia;
        case 5:
            return turnosGinecologia;
        case 6:
            return turnosEndocrinologia;
        default:
            return [];
        }
}

function mostrarTurnos(turnos) {
    if (turnos.length === 0) {
        alert("No hay turnos disponibles para la especialidad ingresada.");
    } else {
        let mensaje = "Turnos disponibles:\n";
        for (const turno of turnos) {
            mensaje += turno + "\n";
        }
        alert(mensaje);
    }
}

//Simulador
function iniciarSimulador() {
    seleccionarEspecialidad();
    let opcion = prompt("Ingrese el número de la especialidad deseada:");

    if (opcion === null) {
        alert("No se ingresó ninguna especialidad.");
    } else if (!isNaN(opcion) && parseInt(opcion) >= 1 && parseInt(opcion) <= 6) {
        let numero = parseInt(opcion);
        let turnosDisponibles = obtenerTurnos(numero);
        mostrarTurnos(turnosDisponibles);
    } else {
        alert("Número inválido. Ingrese un número del 1 al 6.");
    }
}

// Uso del Simulador
iniciarSimulador();