
function revisionViga() {
    let d_dou = parseFloat(document.getElementById("d").value);
    let bf_dou = parseFloat(document.getElementById("bf").value);
    let tf_dou = parseFloat(document.getElementById("tf").value);
    let tw_dou = parseFloat(document.getElementById("tw").value);
    let Iy_dou = parseFloat(document.getElementById("Iy").value);
    let Sx_dou = parseFloat(document.getElementById("Sx").value);
    let Zx_dou = parseFloat(document.getElementById("Zx").value);
    let J_dou = parseFloat(document.getElementById("J").value);
    let Ca_dou = parseFloat(document.getElementById("Ca").value);
    let G_dou = parseFloat(document.getElementById("G").value);
    let fy_dou = parseFloat(document.getElementById("fy").value);
    let cb_dou = parseFloat(document.getElementById("cb").value);
    let longitud_dou = (parseFloat(document.getElementById("L").value)) * 100;
    let muMax_dou = parseFloat(document.getElementById("muMas").value);
    let muMin_dou = parseFloat(document.getElementById("muMenos").value);

    if (isNaN(G_dou)) {
        G_dou = 784000;
    }

    if (isNaN(cb_dou)) {
        cb_dou = 1;
    } else {
        let Cb_Revision_dou = 1 / (0.6 - (0.4 * (muMin_dou / muMax_dou)));
        if (Cb_Revision_dou <= 2.5) {
            cb_dou = Cb_Revision_dou;
        } if (Cb_Revision_dou > 2.5) {
            cb_dou = 2.5;
        }
    }

    let vigaSeccion_int = 0;
    let patinSeccion_int = revisionPatin(fy_dou, bf_dou, tf_dou);
    let almaSeccion_int = revisionAlma(fy_dou, d_dou, tf_dou, tw_dou);
    //Revision seccion viga
    if (patinSeccion_int == almaSeccion_int) {
        vigaSeccion_int = patinSeccion_int;
    } if (patinSeccion_int > almaSeccion_int) {
        vigaSeccion_int = patinSeccion_int;
    } if (patinSeccion_int < almaSeccion_int) {
        vigaSeccion_int = almaSeccion_int;
    }


    //if tipo de seccion
    if (vigaSeccion_int <= 3) {

    } if (vigaSeccion_int == 4) {
        alert("La seccion de la viga es 4, es una viga esbelta, " +
            "se recomienda cambiar la seccion o acortar la longitud");
    }

    //calculo de Xr, Xu, Lr, Lu
    let Xr_dou = (1.33333) * ((Zx_dou * fy_dou) / (cb_dou * G_dou * J_dou)) * Math.sqrt(Ca_dou / Iy_dou);

    let Xu_dou = 3.22 * Xr_dou;

    let sqrt1 = Math.sqrt((2000000 * Ca_dou) / (G_dou * J_dou));
    let Lr_dou =
        ((1.414213562 * Math.PI) / Xr_dou) * sqrt1
        * Math.sqrt(1 + Math.sqrt(1 + (Xr_dou * Xr_dou)));


    let Lu_dou =
        ((1.414213562 * Math.PI) / Xu_dou) * sqrt1
        * Math.sqrt(1 + Math.sqrt(1 + (Xu_dou * Xu_dou)));

    let Me_dou = ((cb_dou * Math.PI * 2000000) / longitud_dou)
        * Math.sqrt(Iy_dou * ((J_dou / 2.6) +
            ((Math.PI / longitud_dou) * (Math.PI / longitud_dou) * Ca_dou)));
    let Mp_dou = Zx_dou * fy_dou;
    let My_dou = Sx_dou * fy_dou;
    let L_dou = longitud_dou;
    let Mn_dou = 0;
    let tipoDeTrabajoFlexion_str = "";
    if (L_dou >= Lr_dou) {
        Mn_dou = Me_dou;
        tipoDeTrabajoFlexion_str = "Flexión con pandeo lateral elastico";

    } if (Lu_dou < L_dou && L_dou < Lr_dou) {
        tipoDeTrabajoFlexion_str = "Flexión con pandeo lateral inelastico";
        if (vigaSeccion_int <= 2) {
            Mn_dou = 1.15 * Mp_dou * (1 - (0.28 * (Mp_dou / Me_dou)));
        } if (vigaSeccion_int <= 4 && vigaSeccion_int > 2) {
            Mn_dou = 1.15 * My_dou * (1 - (0.28 * (My_dou / Me_dou)));
        }
    } if (L_dou < Lu_dou) {
        tipoDeTrabajoFlexion_str = "Flexion sin pandeo lateral";
        if (vigaSeccion_int <= 2) {
            Mn_dou = Mp_dou;
        } if (vigaSeccion_int <= 4 && vigaSeccion_int > 2) {
            Mn_dou = My_dou;
        }
    }


    Mn_dou = Mn_dou / (1000 * 100);
    let Mr_dou = 0.9 * Mn_dou;
    let porcentajeTrabajo_dou = (muMax_dou / Mr_dou) * 100;

    document.getElementById("labelResultado").innerHTML = "";
    document.getElementById("labelResultado2").innerHTML = "";
    document.getElementById("labelResultadoCortante").innerHTML = "";

    let resultadoLabel = document.getElementById("labelResultado")
    resultadoLabel.innerHTML =
    "Xu="+Xu_dou.toFixed(2)+"<br>"+
    "Lu="+Lu_dou.toFixed(2)+" cm <br>";
        


    let resultadolabel2 = document.getElementById("labelResultado2")
    resultadolabel2.innerHTML =
    "Xr="+Xr_dou.toFixed(2)+"<br>"+
    "Lr="+Lr_dou.toFixed(2)+" cm<br>";

     let resultadolabel3 = document.getElementById("labelResultadoCortante")
    resultadolabel3.innerHTML =  
    tipoDeTrabajoFlexion_str+"<br><br>"+
    "La viga trabaja al "+porcentajeTrabajo_dou.toFixed(2)+"% de su capacidad ";




}


function revisionPatin(fy, bf, tf) {
    let seccion = 1;
    let facModFy = Math.sqrt(2000000 / fy);
    let relacionAE = (bf / 2) / tf;

    if (relacionAE > (1 * facModFy)) {
        seccion = 4;
    }
    if ((1 * facModFy) > relacionAE) {
        seccion = 3;
    } if ((0.38 * facModFy) > relacionAE) {
        seccion = 2;
    } if ((0.30 * facModFy) > relacionAE) {
        seccion = 1;
    }
    return seccion;
}

function revisionAlma(fy, d, tf, tw) {
    let seccion = 1;
    let facModFy = Math.sqrt(2000000 / fy);
    let relacionAE = (d - tf - tf) / tw;

    if (relacionAE > (5.7 * facModFy)) {
        seccion = 4;
    } if ((5.7 * facModFy) > relacionAE) {
        seccion = 3;
    } if ((3.76 * facModFy) > relacionAE) {
        seccion = 2;
    } if ((2.45 * facModFy) > relacionAE) {
        seccion = 1;
    }
    return seccion;

}