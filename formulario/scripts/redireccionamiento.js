function irA(paso)
{
    // 1) Se muestra solo la información correspondiente
    const secciones = document.querySelectorAll(".form-seccion");
    secciones.forEach((sec, indice) =>
    {
        if (indice === paso - 1) 
        {
            sec.classList.add("activa");  // Se muestra
        } 
        
        else 
        {
            sec.classList.remove("activa");  // Se oculta
        }
    });

    // 2) Se actualizan los botones del menú superior
    const botones = document.querySelectorAll("nav button");
    botones.forEach((btn, indice) =>
    {
        if (indice === paso - 1) 
        {
            btn.classList.add("activo");
        } 
    
        else 
        {
            btn.classList.remove("activo");
        }
    });

    // 3) Se actualizan las migas de pan
    const bc = [
        document.getElementById("bc1"),
        document.getElementById("bc2"),
        document.getElementById("bc3"),
        document.getElementById("bc4")
    ];

    bc.forEach((link, i) =>
    {
        if (link) 
        {
            if (i === paso - 1) 
            {
                link.classList.add("activo");
            } 
            
            else 
            {
                link.classList.remove("activo");
            }
        }
    });

    // 4) Se sube un poco la página
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function siguiente(seccionActual) 
{
    switch (seccionActual) 
    {
        case 1:
            if (!validarTodoSeccion1())
            {
                return false;
            }
            break;
    
        case 2:
            if (!validarTodoSeccion2())
            {
                return false;
            }
            break;
        
        case 3:
            break;

        default:
            break;
    }

    irA(seccionActual+1);  // Si todo está OK, ahora sí se pasa a la otra sección
    return true;
}

function reiniciarFormulario() 
{
    // 1) Se limpian TODOS los formularios del documento
    document.querySelectorAll("form").forEach(form => form.reset());

    // 2) Se vuelve a la sección 1
    irA(1);

    // 3) Se sube al tope
    window.scrollTo({ top: 0, behavior: "smooth" });
}
