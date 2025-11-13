function irA(paso)
{
    // 1) Mostrar SOLO la sección correspondiente
    const secciones = document.querySelectorAll(".form-seccion");
    secciones.forEach((sec, indice) =>
    {
        if (indice === paso - 1) {
            sec.classList.add("activa");   // la mostramos
        } else {
            sec.classList.remove("activa"); // la ocultamos
        }
    });

    // 2) Se actualizan los botones del menú superior
    const botones = document.querySelectorAll("nav button");
    botones.forEach((btn, indice) =>
    {
        if (indice === paso - 1) {
            btn.classList.add("activo");
        } else {
            btn.classList.remove("activo");
        }
    });

    // 3) Se actualizan las migas de pan
    const bc = [
        document.getElementById("bc1"),
        document.getElementById("bc2"),
        document.getElementById("bc3")
    ];

    bc.forEach((link, i) =>
    {
        if (link) {
            if (i === paso - 1) {
                link.classList.add("activo");
            } else {
                link.classList.remove("activo");
            }
        }
    });

    // 4) (Opcional) Subir un poco la página
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}
