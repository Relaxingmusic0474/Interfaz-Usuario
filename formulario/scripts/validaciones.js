/* ------------------------------------------- FUNCIONES DE BLOQUEO ------------------------------------------- */
function bloquearYSalir(mensaje)  // Funciona como castigo para el usuario que miente en el RUT o la edad
{
    alert(mensaje);

    localStorage.setItem("bloqueadoINE", "true");

    // Elimina el contenido de la página
    document.body.innerHTML = 
    `
        <h1>Acceso denegado</h1>
        <p>Se detectó inconsistencia en los datos colocados.  El formulario le ha sido bloqueado.</p>
        <p>Si cree que se trata de un error, contáctese al teléfono <strong><i>+56 9 7547 6159</i></strong> o al correo <strong><i>andywalls.s17@gmail.com.</i></strong></p>
    `;

    // Evita interacción
    document.body.style.pointerEvents = "none";

    // Impide volver atrás
    history.pushState(null, "", location.href);
    window.addEventListener("popstate", function () {
        history.pushState(null, "", location.href);
    });

    // Impede recargar la página original del formulario 
    history.replaceState(null, "", "acceso_denegado.html");

    return false;
}

// Si el usuario estaba bloqueado, se reemplaza toda la página por la pantalla de bloqueo
window.onload = function() 
{
    localStorage.setItem("bloqueadoINE", "false");   // IMPORTANTE: PARA USARLO EN LA VIDA REAL Y EVITAR CONTRATAR GENTE QUE MIENTE, COMENTAR ESTO

    if (localStorage.getItem("bloqueadoINE") === "true") 
    {
        document.body.innerHTML = `
            <h1>Acceso denegado</h1>
            <p>Se detectó inconsistencia en los datos colocados. El formulario le ha sido bloqueado.</p>
            <p>Si cree que se trata de un error, contáctese al teléfono 
            <b><i>+56 9 7547 6159</i></b> o al correo <b><i>andywalls.s17@gmail.com</i></b>.</p>
        `;
    }
}

/* ---------------------------------------- FUNCIONES PARA VALIDAR RUT ---------------------------------------- */
function normalizarRut(rut)
{
    // Convierte el RUT a una cadena de texto
    rut = String(rut);

    // Elimina puntos y guiones, y convierte a mayúsculas (k != K)
    rut = rut.replace(/\./g, "");
    rut = rut.toUpperCase();

    // Quita posibles espacios en blanco al inicio y al final
    rut = rut.trim();

    return rut;
}

function validarRutChileno(rut)
{
    rut = normalizarRut(rut);

    // Verifica el formato básico
    if (!/^\d{1,8}-[\dK]$/.test(rut)) 
    {
        return false;
    }

    // Separa el cuerpo y el dígito verificador
    const numero = rut.slice(0, -2);
    const dv_teorico = rut.slice(-1);

    // Calcula el dígito verificador
    let multiplicadores = [2, 3, 4, 5, 6, 7];
    let suma = 0;

    for (let i=numero.length - 1, j = 0; i >= 0; i--, j++) {
        suma += parseInt(numero.charAt(i)) * multiplicadores[j % multiplicadores.length];
    }

    let dv_experimental = 11 - (suma % 11);

    if (dv_experimental === 11) 
    {
        dv_experimental = '0';
    }

    else if (dv_experimental === 10) 
    {
        dv_experimental = 'K';
    }

    else 
    {
        dv_experimental = dv_experimental.toString();
    }

    // Valida el dígito verificador
    return dv_experimental === dv_teorico;
}

function validarRutIngresado()
{
    const rut = document.getElementById("rut").value;
    const resultado = validarRutChileno(rut);
    
    if (!resultado) 
    {
        return false; // Evita el envío del formulario
    }

    return true; // Permite el envío del formulario
}

function validarRUToSegfault() 
{
    if (!validarRutIngresado()) 
    {
        return bloquearYSalir('RUT inválido. Se le bloqueará el acceso al formulario por mentiroso.');
    }

    return true;
}


/* ------------------------ FUNCIONES PARA VALIDAR CONSISTENCIA ENTRE FECHA DE NACIMIENTO Y EDAD ------------------------- */
function calcularEdad(fechaNacimiento) 
{
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);

    let edad = hoy.getFullYear() - nacimiento.getFullYear();  // Calcula la diferencia de años
    const mes = hoy.getMonth() - nacimiento.getMonth();  // Calcula la diferencia de meses

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate()))  // Considera caso especial de cumpleaños no cumplido
    {
        edad--;
    }
    
    return edad;
}

function validarConsistenciaEdadFecha()
{
    const fechaNacimiento = document.getElementById("fecha_nacimiento").value;
    const edadIngresada = parseInt(document.getElementById("edad").value, 10);
    const edadCalculada = calcularEdad(fechaNacimiento);

    if (!isFinite(edadCalculada) || edadCalculada !== edadIngresada)
    {
        return bloquearYSalir(`Según la fecha de nacimiento que ingresó, su edad es ${edadCalculada} años.  Se le bloqueará el acceso al formulario por mentiroso.`);
    }

    return true; // Permite el envío del formulario
}

function validacionCheckboxGrupo(name, mensaje) 
{
    const checkboxes = document.querySelectorAll(`input[name="${name}"]`);
    const algunoMarcado = [...checkboxes].some(ch => ch.checked);

    if (!algunoMarcado) 
    {
        alert(mensaje);
        return false;
    }

    return true;
}


/* ---------------------------------------- FUNCIONES PARA VALIDAR TODO ---------------------------------------- */
function validarTodoSeccion1()
{
    // Valida campos HTML5 de la sección 1
    const seccion1 = document.getElementById("seccion1");
    const campos = seccion1.querySelectorAll("input, select, textarea");

    for (const campo of campos) 
    {
        if (!campo.checkValidity()) 
        {
            campo.reportValidity();   // Muestra el mensaje del navegador
            return false;
        }
    }

    if (!validarRUToSegfault())
    {
        return false;
    }

    if (!validarConsistenciaEdadFecha())
    {
        return false;
    }

    return true;
}

function validarTodoSeccion2()
{
    // 1) Valida campos HTML5 de la sección 2
    const seccion2 = document.getElementById("seccion2");
    const campos = seccion2.querySelectorAll("input, select, textarea");

    for (const campo of campos) 
    {
        if (!campo.checkValidity()) 
        {
            campo.reportValidity();   // Muestra el mensaje del navegador
            return false;
        }
    }

    if (!validacionCheckboxGrupo("horario", "Debe seleccionar al menos un horario"))
    {
        return false;
    }

    return true;
}

function validarMotivacion() 
{
    const texto = document.getElementById("motivacion").value.trim().toLowerCase();
    
    const ofensivas = [
        "que te importa", "a vo que te importa", "wtf", "callate", 
        "chupalo", "anda a la chucha", "me vale", "me importa una raja"
    ];

    for (let palabra of ofensivas) 
    {
        // Si incluye alguna palabra ofensiva -> Chao
        if (texto.includes(palabra))
        {
            return "Muy pobre";
        }
    }

    const garabatos = [
        "wea", "weón", "weon", "culiao", "ql", "ctm", "huea",
        "conchetumare", "perra", "maraco", "maraca", "saco wea", "wn"
    ];

    for (let g of garabatos) 
    {
        // Si incluye algún insulto -> Chao
        if (texto.includes(g)) 
        {
            return "Muy pobre";
        }
    }
    
    // Texto incoherente: secuencias largas de consonantes
    if (/[bcdfghjklmnpqrstvwxyz]{6,}/.test(texto)) 
    {
        return "Muy pobre";
    }

    // Texto incoherente: palabras muy largas sin vocales
    if (/\b[b-df-hj-np-tv-z]{5,}\b/.test(texto)) 
    {
        return "Muy pobre";
    }

    // Spam (repetición excesiva de la misma letra)
    if (/(.)\1{5,}/.test(texto)) 
    {
        return "Muy pobre";
    }
    
    if (texto.length < 15)  // Muy corto -> Motivación pobre
    {
        return "Pobre";
    }
    
    if (texto.includes("nose") || texto.includes("no sé"))  // Dubitativo -> Motivación no clara 
    {
        return "Pobre";
    }

    if (texto.includes("porque sí") || texto.includes("porque si"))  // Porque sí no es buena respuesta
    {
        return "Pobre";
    }
    
    if (texto.includes("plata") || texto.includes("dinero"))  // Mucho interés en el dinero, y no tanto en el trabajo en sí
    {
        return "Pobre";
    }

    if (texto.includes("hola") && texto.length < 20)  // Corto, solo que con saludo incluido   
    {
        return "Aceptable";
    }    

    return "Buena";
}

function calcularPuntajeQuiz() 
{
    let puntaje = 0;
    const preguntas = {};

    // Se agrupan las alternativas por nombre (q1, q2, ...)
    document.querySelectorAll("input[data-correct]").forEach(input => 
    {
        const name = input.name;
        
        if (!preguntas[name]) 
        {
            preguntas[name] = [];
        }
        
        preguntas[name].push(input);
    });

    // Se recorre cada pregunta
    Object.values(preguntas).forEach(grupo => 
    {
        const tipo = grupo[0].type;

        // Caso radio (1 sola alternativa correcta)
        if (tipo === "radio") 
        {
            const correcta = grupo.find(inp => inp.dataset.correct === "true");
            
            if (correcta && correcta.checked) 
            {
                puntaje += 1;
            }
        } 
        
        // Caso checkbox: Sistema proporcional
        else if (tipo === "checkbox") 
        {
            const correctas = grupo.filter(inp => inp.dataset.correct === "true");
            const incorrectas = grupo.filter(inp => inp.dataset.correct === "false");

            const totalCorrectas = correctas.length;
            let correctasMarcadas = 0;
            let incorrectaMarcada = false;

            // Contamos
            grupo.forEach(inp => 
            {
                if (inp.checked) 
                {
                    if (inp.dataset.correct === "true") 
                    {
                        correctasMarcadas++;
                    } 
                    
                    else 
                    {
                        incorrectaMarcada = true;
                    }
                }
            });

            // Si marcó una incorrecta → 0 puntos
            if (incorrectaMarcada) 
            {
                return; 
            }

            // Si no marcó incorrectas → Puntaje proporcional
            if (correctasMarcadas > 0) 
            {
                puntaje += (correctasMarcadas / totalCorrectas);
            }
        }
    });

    return puntaje;
}

function evaluarPostulacion() 
{
    const puntaje = calcularPuntajeQuiz();
    const motivacion = validarMotivacion();

    let mensajeHTML = "";
    let aprobado = false;

    const nombreInput = document.getElementById("nombre");

    let nombre = "";

    if (nombreInput)
    {
        nombre = nombreInput.value.trim();
    }

    const nombreMayusc = nombre ? nombre.toUpperCase() : "POSTULANTE";

    if (puntaje >= 6 && (motivacion === "Buena" || motivacion === "Aceptable")) 
    {
        aprobado = true;
        mensajeHTML = `
            <h3>🎉 FELICIDADES ${nombreMayusc}🎉</h3>
            <p>Ha logrado postular exitosamente al INE.</p>
            <ul>
                <li><strong>Puntaje del quiz:</strong> ${puntaje.toFixed(1)}/10.0</li>
                <li><strong>Motivación:</strong> ${motivacion}</li>
            </ul>
            <p>Pronto será contactado por el equipo de reclutamiento.</p>
        `;
    }

    else 
    {
        mensajeHTML = `
            <h3>❌ LO SENTIMOS ${nombreMayusc} ❌</h3>
            <p>No ha sido posible aprobar su postulación.</p>
            <ul>
                <li><strong>Puntaje del quiz:</strong> ${puntaje.toFixed(1)}/10.0</li>
                <li><strong>Motivación:</strong> ${motivacion}</li>
            </ul>
            <p>Puede intentar mejorar su motivación o estudiar más estadística antes de postular nuevamente.</p>
        `;
    }

    // Insertar el resultado en la sección de resultados
    const contenedor = document.getElementById("resultadoPostulacion");

    if (contenedor) 
    {
        contenedor.innerHTML = mensajeHTML;
    }

    // Ir a la sección 4 (pantalla de resultados)
    irA(4);

    // Evitar que el formulario se envíe y recargue la página
    return false;
}
