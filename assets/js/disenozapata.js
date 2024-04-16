function revisarZapata() {
    let a = new Array(80);
    let fc_dou = parseFloat(document.getElementById("FC").value);
    let h_dou = parseFloat(document.getElementById("h").value);
    let r_dou = parseFloat(document.getElementById("r").value);
    let B_dou = parseFloat(document.getElementById("B").value);
    let L_dou = parseFloat(document.getElementById("L").value);
    let Dadox_dou = parseFloat(document.getElementById("dadoX").value);
    let Dadoy_dou = parseFloat(document.getElementById("dadoY").value);
    let Msx_dou = parseFloat(document.getElementById("msx").value);
    let Msy_dou = parseFloat(document.getElementById("msy").value);
    let Ps_dou = parseFloat(document.getElementById("ps").value);
    let f1c_dou = parseFloat(document.getElementById("f1c").value);
    let fy_dou = parseFloat(document.getElementById("fy").value);
    let Df_dou = parseFloat(document.getElementById("Df").value);
    let qu_dou = parseFloat(document.getElementById("qu").value);
    let densidadSuelo_dou = parseFloat(document.getElementById("densidadSuelo").value);
    let varillaFlexion_dou = parseFloat(document.getElementById("varillaFlexion").value);
    let varillaTemperatura_dou = parseFloat(document.getElementById("varillaTemperatura").value);
    let opcionZapata = parseInt(document.getElementById('tipoZapata').value);

    if (opcionZapata === 0) {
        alert('Por favor, selecciona un tipo de zapata.');
        return a;
    }



    //-------Carga nominal

    let qn_dou = qu_dou - (2.4 * h_dou) - (densidadSuelo_dou * Df_dou - h_dou);

    //-------excentricidad

    let exCarga_dou = Msy_dou / Ps_dou;
    let eyCarga_dou = Msx_dou / Ps_dou;
    let exmin_dou = 0.05 * B_dou;
    let eymin_dou = 0.05 * L_dou;
    let ex = exCarga_dou, ey = eyCarga_dou;

    if (ex < exmin_dou) { ex = exmin_dou; }
    if (ey < eymin_dou) { ey = eymin_dou; }

    let Bp1_dou = B_dou - (2 * ex);
    let Lp1_dou = L_dou - (2 * ey);
    let q_dou = Ps_dou / (Bp1_dou * Lp1_dou);

    let mensaje1 = "";
    if (q_dou <= qn_dou) {
        mensaje1 = "q es menor qn, por lo tanto las dimensiones son correctas";
    } if (q_dou > qn_dou) {
        mensaje1 = "q es mayor qn, por lo tanto Aumentar dimensiones";
    }

    //----------Volteo

    let mensaje2 = "";
    let mensaje3 = "";
    if ((B_dou / 6) >= ex) {
        mensaje2 = "Pasa el volteo en X";
    } if ((B_dou / 6) < ex) {
        mensaje2 = "Aumentar B";
    }
    if ((L_dou / 6) >= ey) {
        mensaje3 = "Pasa el volteo en Y";
    } if ((L_dou / 6) < ey) {
        mensaje3 = "Aumentar L";
    }

    //------------Penetracion

    let d_dou = h_dou - r_dou;


    let Ru_dou = (fc_dou * Ps_dou) / (B_dou * L_dou);


    let penetracion = new Array(11);

    if (opcionZapata === 1) {
        penetracion = PenetracionZapataCentral(Dadox_dou, Dadoy_dou, d_dou, Ps_dou, Ru_dou,
            Msx_dou, Msy_dou, fc_dou);
    } if (opcionZapata === 2) {
        penetracion = PenetracionZapataBorde(Dadox_dou, Dadoy_dou, d_dou, Ps_dou, Ru_dou,
            Msx_dou, Msy_dou, fc_dou);
    } if (opcionZapata === 3) {
        penetracion = PenetracionZapataEsquina(Dadox_dou, Dadoy_dou, d_dou, Ps_dou, Ru_dou,
            Msx_dou, Msy_dou, fc_dou);
    }
    a[34] = penetracion[0];
    a[35] = penetracion[1];
    a[36] = penetracion[2];
    a[37] = penetracion[3]; let VuSuelo_dou = parseFloat(penetracion[3]);
    a[38] = penetracion[4];
    a[39] = penetracion[5];
    a[40] = penetracion[6];
    a[41] = penetracion[7];
    a[42] = penetracion[8];
    a[43] = penetracion[9];
    a[44] = penetracion[10];
    a[45] = penetracion[11];

    let VuPenetracion_dou = parseFloat(a[44]);
    let yi_dou = parseFloat(a[45]);

    //revision si aplican o no momentos
    let aplicaMux = aplicaMuPenetracion(VuSuelo_dou, d_dou, fc_dou, Msx_dou);
    let aplicaMuy = aplicaMuPenetracion(VuSuelo_dou, d_dou, fc_dou, Msy_dou);
    let aplicaMux_str = "";
    let aplicaMuy_str = "";

    if (aplicaMux === false) {
        aplicaMux_str = "Mux menor a 0.2Vud, Por lo tanto no aporta al esfuerzo por penetración.";
    }
    if (aplicaMuy === false) {
        aplicaMuy_str = "Muy menor a 0.2Vud, Por lo tanto no aporta al esfuerzo por penetración.";
    }

    let VrcPenetracion_dou = 0.75 * yi_dou * Math.sqrt(f1c_dou) * 10;
    let VrcPenetracion_str = VrcPenetracion_dou.toString(); a[78] = VrcPenetracion_str;


    let mensaje4 = "";

    if (VuPenetracion_dou <= VrcPenetracion_dou) {
        if (opcionZapata === 1) {
            mensaje4 = aplicaMux_str + aplicaMuy_str + "  La sección resiste el esfuerzo por penetracion";
        } else {
            mensaje4 = aplicaMux_str + aplicaMuy_str + " La sección resiste el esfuerzo por penetracion, " +
                "para un diseño conservador  " +
                "se ignoran los factores ''g'' que reducen los momentos";
        }
    } if (VuPenetracion_dou > VrcPenetracion_dou) {
        mensaje4 = "La seccion no soporta el esfuerzo, aumentar h o dado";
    }


    //--------------flexion

    let longitudX_dou = 0, longitudY_dou = 0;

    if (opcionZapata === 1) {
        longitudX_dou = (B_dou - Dadox_dou) / 2;
        longitudY_dou = (L_dou - Dadoy_dou) / 2;
    }
    if (opcionZapata === 2) {
        longitudX_dou = B_dou - Dadox_dou;
        longitudY_dou = (L_dou - Dadoy_dou) / 2;
    }
    if (opcionZapata === 3) {
        longitudX_dou = B_dou - Dadox_dou;
        longitudY_dou = L_dou - Dadoy_dou;
    }

    let longitudX_str = longitudX_dou.toString(); a[47] = longitudX_str;
    let longitudY_str = longitudY_dou.toString(); a[48] = longitudY_str;

    let momentoX_dou = Ru_dou * longitudX_dou * longitudX_dou / 2;
    let momentoX_str = momentoX_dou.toString(); a[49] = momentoX_str;
    let momentoY_dou = Ru_dou * longitudY_dou * longitudY_dou / 2;
    let momentoY_str = momentoY_dou.toString(); a[50] = momentoY_str;

    let aceroX = DisenoPorFlexion((d_dou * 100), f1c_dou, fy_dou, momentoX_dou, varillaFlexion_dou);
    let aceroY = DisenoPorFlexion((d_dou * 100), f1c_dou, fy_dou, momentoY_dou, varillaFlexion_dou);

    a[51] = aceroX[0];
    a[52] = aceroX[1];
    a[53] = aceroX[2];
    a[54] = aceroX[3];
    a[55] = aceroX[4];
    a[56] = aceroX[5];
    a[57] = aceroX[6];
    let ro1 = parseFloat(aceroX[6]);
    a[58] = aceroX[7];
    a[59] = aceroX[8];
    a[60] = aceroX[9];
    a[61] = aceroX[10];
    let separacionFlexionX = parseFloat(a[61]);

    a[62] = aceroY[4];
    a[63] = aceroY[5];
    a[64] = aceroY[6];
    let ro2 = parseFloat(aceroY[6]);
    a[65] = aceroY[7];
    a[66] = aceroY[9];
    a[67] = aceroY[10];
    let separacionFlexionY = parseFloat(a[67]);

    //-----Diseño por cortante

    let VuX_dou = Ru_dou * (longitudX_dou - d_dou);
    let VuX_str = VuX_dou.toString(); a[68] = VuX_str;
    let VuY_dou = Ru_dou * (longitudY_dou - d_dou);
    let VuY_str = VuY_dou.toString(); a[69] = VuY_str;

    let VuMax_dou = VuX_dou;
    if (VuMax_dou <= VuY_dou) {
        VuMax_dou = VuY_dou;
    }



    let mensaje5 = "";
    let RevElementoAncho1 = "", RevElementoAncho2 = "", RevElementoAncho3 = "",
        RevElementoAncho4 = "", RevElementoAncho5 = "";
    let elementoAncho = true;

    let interaccionMUx = ((momentoX_dou) / (Ru_dou * longitudX_dou * d_dou));
    let interaccionMuy = ((momentoY_dou) / (Ru_dou * longitudY_dou * d_dou));

    if (B_dou < (4 * d_dou)) {
        RevElementoAncho1 = "Aumentar B.";
        elementoAncho = false;
    } if (L_dou < (4 * d_dou)) {
        RevElementoAncho2 = "Aumentar L.";
        elementoAncho = false;
    } if (h_dou > 0.6) {
        RevElementoAncho3 = "Disminuir h menor a 0.6 m.";
        elementoAncho = false;
    } if (interaccionMUx > 2) {
        RevElementoAncho4 = "Aumentar dado en x o aumentar h.";
        elementoAncho = false;
    }
    if (interaccionMuy > 2) {
        RevElementoAncho5 = "Aumentar dado en y o aumentar h.";
        elementoAncho = false;
    }
    let VrcCortante_dou = 0;
    if (elementoAncho) {
        VrcCortante_dou = 0.5 * 0.75 * 100 * (d_dou * 100) * Math.sqrt(f1c_dou) / 1000;
        mensaje5 = "Trabaja como elemento ancho";
    } else {
        let roVc = ro1;
        if (ro2 > roVc) {
            roVc = ro2;
        }
        roVc=roVc.toFixed(4);
        let roVc_let = roVc.toString();

        if (roVc <= 0.015) {
            VrcCortante_dou = 0.75 * (0.2 + (20 * roVc)) * 100 * (100 * d_dou) * Math.sqrt(f1c_dou) / 1000;
        } if (roVc > 0.015) {
            VrcCortante_dou = 0.5 * 0.75 * 100 * (d_dou * 100) * Math.sqrt(f1c_dou) / 1000;
        }
        mensaje5 = "Trabaja en cortante como trabe de concreto, se considera ρ="
            + roVc_let + ". Para que trabaje como elemento ancho se recomienda: "
            + RevElementoAncho1 + RevElementoAncho2 +
            RevElementoAncho3 + RevElementoAncho4 + RevElementoAncho5 + "";
    }




    let mensaje6 = "";

    if (VrcCortante_dou >= VuMax_dou) {
        mensaje6 = "Resiste el cortante";
    } else {
        mensaje6 = "No resiste el cortante, auemntar h o dado ";
    }


    //-----Acero por temperatura

    let mensaje7 = "", mensaje8 = "";
    let factorAstMayorA15 = 0;
    if (h_dou >= 0.15) {
        mensaje7 = "Se colocará el acero en 2 capas";
        factorAstMayorA15 = 0.5;
    } else {
        mensaje7 = "Se colocará el acero en una sola capa";
        factorAstMayorA15 = 1;
    }
    a[73] = mensaje7;


    let AceroX_dou = parseFloat(a[58]);
    let AceroY_dou = parseFloat(a[65]);
    let AceroMax_dou = AceroX_dou;
    if (AceroMax_dou <= AceroY_dou) {
        AceroMax_dou = AceroY_dou;
    }

    let Ast_dou = 1.5 * factorAstMayorA15 * ((66000 * h_dou * 100) / (fy_dou * (100 + (h_dou * 100))));
    let Ast_str = Ast_dou.toString(); a[74] = Ast_str;

    if (Ast_dou <= AceroMax_dou) {
        mensaje8 = "En lecho inferior rige el acero por flexión";
    } else {
        mensaje8 = "En lecho inferior rige el acero por temperatura";
    }

    a[75] = mensaje8;

    let DiamVarillaTem_dou = (varillaTemperatura_dou * 2.54 / 8);
    let AsVarillaTem_dou = DiamVarillaTem_dou * DiamVarillaTem_dou * Math.PI / 4;
    let numeroVarTem_int = Ast_dou / AsVarillaTem_dou;
    let numeroVarTem_str = numeroVarTem_int.toString();
    a[76] = numeroVarTem_str;

    let separacionTemperatura_int = 100 / numeroVarTem_int;
    separacionTemperatura_int = separacionTemperatura_int = redondear(separacionTemperatura_int);
    let separacionTemperatura_str = separacionTemperatura_int.toString();
    a[77] = separacionTemperatura_str;

    document.getElementById("labelResultados").innerHTML = "";

    let resultadoLabel = document.getElementById("labelResultados")
    resultadoLabel.innerHTML =
        "<h4>Revisión por capacidad de carga</h4> <br>" +
        "" + mensaje1 + " <br>" +
        "<br><br><h4>Revisión por volteo</h4> <br>" +
        "" + mensaje2 + " <br>" +
        "" + mensaje3 + " <br>" +
        "<br><br><h4>Revisión por penetración</h4> <br>" +
        "Vu=" + VuPenetracion_dou.toFixed(2) + " ton <br>" +
        "Vrc=" + VrcPenetracion_dou.toFixed(2) + "  ton<br>" + // <- Aquí había un punto y coma que interrumpía la cadena
        "" + mensaje4 + "<br>" +
        "<br><br><h4>Diseño por Flexión</h4> <br>" +
        "La varilla tendrá las siguientes separaciones <br>" +
        "En X a cada " + separacionFlexionX.toFixed(2) + " cm <br>" + // <- Aquí había un punto y coma que interrumpía la cadena
        "En Y a cada " + separacionFlexionY.toFixed(2) + " cm <br>" + // <- Aquí había un punto y coma que interrumpía la cadena
        "<br><br><h4>Diseño por Cortante</h4> <br>" +
        "Vu=" + VuMax_dou.toFixed(2) + " ton<br>" +
        "" + mensaje5 + "<br>" +
        "Vrc=" + VrcCortante_dou.toFixed(2) + " ton <br>" +
        "" + mensaje6 + "<br>" +
        "<br><br><h4>Diseño por Temperatura</h4> <br>" +
        "" + mensaje7 + "<br>" +
        "" + mensaje8 + "<br>" +
        "Se colocará la varilla a cada " + separacionTemperatura_int + " cm en ambas direcciones";
    



}




function aplicaMuPenetracion(vuSuelo_dou, d_dou, fc_dou, ms_dou) {
    let regresar = true;
    if ((fc_dou * ms_dou) < (0.2 * vuSuelo_dou * d_dou)) {
        regresar = false;
    }
    return regresar;
}

function PenetracionZapataCentral(dadox_dou, dadoy_dou,
    d_dou, ps_dou, ru_dou, msx_dou, msy_dou, fc_dou) {
    let a = new Array(12);
    let c1_dou = dadox_dou;
    let c2_dou = dadoy_dou;
    let cx_dou = dadox_dou + d_dou;
    let cy_dou = dadoy_dou + d_dou;

    let Acr_dou = (2 * d_dou * (c1_dou + c2_dou + (2 * d_dou)));
    let Acr_str = Acr_dou.toString(); a[0] = Acr_str;

    let CAB_dou = (c1_dou + d_dou) / 2;
    let CAB_str = CAB_dou.toString(); a[1] = CAB_str;

    let CBD_dou = (c2_dou + d_dou) / 2;
    let CBD_str = CBD_dou.toString(); a[2] = CBD_str;

    let VuSuelo_dou = (fc_dou * ps_dou) - (ru_dou * cx_dou * cy_dou);
    let VuSuelo_str = VuSuelo_dou.toString(); a[3] = VuSuelo_str;

    let alfaX_dou = 1 - (1 / (1 + (0.67 * Math.sqrt((cy_dou) / (cx_dou)))));
    let alfaX_str = alfaX_dou.toString(); a[4] = alfaX_str;

    let alfaY_dou = 1 - (1 / (1 + (0.67 * Math.sqrt((cx_dou) / (cy_dou)))));
    let alfaY_str = alfaY_dou.toString(); a[5] = alfaY_str;



    let Jy_dou = (d_dou * cx_dou * cx_dou * cx_dou / 6) + (cx_dou * d_dou * d_dou * d_dou / 6) +
        ((d_dou * cy_dou * cx_dou * cx_dou) / 2);
    let Jy_str = Jy_dou.toString(); a[6] = Jy_str;
    let Jx_dou = (d_dou * cy_dou * cy_dou * cy_dou / 6) + (cy_dou * d_dou * d_dou * d_dou / 6) +
        ((d_dou * cx_dou * cy_dou * cy_dou) / 2);
    let Jx_str = Jx_dou.toString(); a[7] = Jx_str;

    let gx_dou = 0;
    let gx_str = gx_dou.toString(); a[8] = gx_str;
    let gy_dou = 0;
    let gy_str = gy_dou.toString(); a[9] = gy_str;

    //revision si aplican o no momentos
    let aplicaMux = aplicaMuPenetracion(VuSuelo_dou, d_dou, fc_dou, msx_dou);
    let aplicaMuy = aplicaMuPenetracion(VuSuelo_dou, d_dou, fc_dou, msy_dou);

    if (aplicaMux == false) {
        msx_dou = 0;
    }
    if (aplicaMuy == false) {
        msy_dou = 0;
    }

    //revision por penetracion

    let Vu1Penetracion_dou = (VuSuelo_dou / Acr_dou)
        + (alfaX_dou * fc_dou * msx_dou * CBD_dou / Jx_dou)
        + (alfaY_dou * fc_dou * msy_dou * CAB_dou / Jy_dou);
    let Vu2Penetracion_dou = (VuSuelo_dou / Acr_dou)
        + (alfaX_dou * fc_dou * msx_dou * CBD_dou / Jx_dou)
        + (alfaY_dou * fc_dou * msy_dou * CAB_dou / Jy_dou);
    let VuPenetracion_dou = Vu1Penetracion_dou;
    if (VuPenetracion_dou <= Vu2Penetracion_dou) {
        VuPenetracion_dou = Vu2Penetracion_dou;
    }
    let VuPenetracion_str = Vu1Penetracion_dou.toString();
    a[10] = VuPenetracion_str;

    let yi_dou = 0;
    if ((0.5 + (cy_dou / cx_dou)) > 1) {
        yi_dou = 1;
    } else {
        yi_dou = (0.5 + (cy_dou / cx_dou));
    }
    let yi_str = yi_dou.toString(); a[11] = yi_str;

    return a;
}

function PenetracionZapataEsquina(dadox_dou, dadoy_dou,
    d_dou, ps_dou, ru_dou, msx_dou, msy_dou, fc_dou) {
    let a = new Array(12);
    let c1_dou = dadox_dou;
    let c2_dou = dadoy_dou;

    let cx_dou = dadox_dou + (d_dou / 2);
    let cy_dou = dadoy_dou + (d_dou / 2);

    let Acr_dou = d_dou * (c1_dou + c2_dou + d_dou);
    let Acr_str = Acr_dou.toString(); a[0] = Acr_str;

    let CAB_dou = ((cx_dou * cx_dou * d_dou) / (2 * Acr_dou));
    let CAB_str = CAB_dou.toString(); a[1] = CAB_str;

    let CBD_dou = ((cy_dou * cy_dou * d_dou) / (2 * Acr_dou));
    let CBD_str = CBD_dou.toString(); a[2] = CBD_str;

    let VuSuelo_dou = (fc_dou * ps_dou) - (ru_dou * cx_dou * cy_dou);
    let VuSuelo_str = VuSuelo_dou.toString(); a[3] = VuSuelo_str;

    let alfaX_dou = 1 - (1 / (1 + (0.67 * Math.sqrt((cy_dou / cx_dou)))));
    let alfaX_str = alfaX_dou.toString(); a[4] = alfaX_str;

    let alfaY_dou = 1 - (1 / (1 + (0.67 * Math.sqrt(cx_dou / cy_dou))));
    let alfaY_str = alfaY_dou.toString(); a[5] = alfaY_str;


    let Jy_dou = (d_dou * cx_dou * cx_dou * cx_dou / 12) + (cx_dou * d_dou * d_dou * d_dou / 12) +
        ((cy_dou) * d_dou * CAB_dou * CAB_dou) +
        (cx_dou * d_dou * ((cx_dou / 2) - CAB_dou) * ((cx_dou / 2) - CAB_dou));
    let Jy_str = Jy_dou.toString(); a[6] = Jy_str;

    let Jx_dou = (d_dou * cy_dou * cy_dou * cy_dou / 12) + (cy_dou * d_dou * d_dou * d_dou / 12) +
        ((cx_dou) * d_dou * CBD_dou * CBD_dou) +
        (cy_dou * d_dou * ((cy_dou / 2) - CBD_dou) * ((cy_dou / 2) - CBD_dou));
    let Jx_str = Jx_dou.toString(); a[7] = Jx_str;

    let gx_dou = 0;//((c1_dou+d_dou)/2)-CAB_dou;
    let gx_str = gx_dou.toString(); a[8] = gx_str;
    let gy_dou = 0;//((c2_dou+d_dou)/2)-CBD_dou;
    let gy_str = gy_dou.toString(); a[9] = gy_str;

    //revision si aplican o no momentos
    let aplicaMux = aplicaMuPenetracion(VuSuelo_dou, d_dou, fc_dou, msx_dou);
    let aplicaMuy = aplicaMuPenetracion(VuSuelo_dou, d_dou, fc_dou, msy_dou);

    if (aplicaMux = false) {
        msx_dou = 0;
    }
    if (aplicaMuy = false) {
        msy_dou = 0;
    }

    //revision por penetracion
    let Vu1Penetracion_dou = (VuSuelo_dou / Acr_dou)
        + (alfaX_dou * ((fc_dou * msx_dou) - (VuSuelo_dou * gy_dou)) * CBD_dou / Jx_dou)
        + (alfaY_dou * ((fc_dou * msy_dou) - (VuSuelo_dou * gx_dou)) * CAB_dou / Jy_dou);
    let VuPenetracion_dou = Vu1Penetracion_dou;
    let VuPenetracion_str = VuPenetracion_dou.toString();
    a[10] = VuPenetracion_str;

    let yi_dou = 0;
    if ((0.5 + (cy_dou / cx_dou)) > 1) {
        yi_dou = 1;
    } else {
        yi_dou = (0.5 + (cy_dou / cx_dou));
    }
    let yi_str = yi_dou.toString(); a[11] = yi_str;



    return a;
}

function PenetracionZapataBorde(dadox_dou, dadoy_dou,
    d_dou, ps_dou, ru_dou, msx_dou, msy_dou, fc_dou) {
    let a = new Array(12);
    let c1_dou = dadox_dou;
    let c2_dou = dadoy_dou;
    let cx_dou = dadox_dou + (d_dou / 2);
    let cy_dou = dadoy_dou + d_dou;

    let Acr_dou = d_dou * ((2 * c1_dou) + (c2_dou) + (2 * d_dou));   //((2*cx_dou)+cy_dou)*d_dou;
    let Acr_str = Acr_dou.toString(); a[0] = Acr_str;

    let CAB_dou = (cx_dou * cx_dou * d_dou / Acr_dou);
    let CAB_str = CAB_dou.toString(); a[1] = CAB_str;

    let CBD_dou = cy_dou / 2;
    let CBD_str = CBD_dou.toString(); a[2] = CBD_str;

    let VuSuelo_dou = (fc_dou * ps_dou) - (ru_dou * cx_dou * cy_dou);
    let VuSuelo_str = VuSuelo_dou.toString(); a[3] = VuSuelo_str;

    let alfaX_dou = 1 - (1 / (1 + (0.67 * Math.sqrt((cy_dou / cx_dou)))));
    let alfaX_str = alfaX_dou.toString(); a[4] = alfaX_str;

    let alfaY_dou = 1 - (1 / (1 + (0.67 * Math.sqrt((cx_dou / cy_dou)))));
    let alfaY_str = alfaY_dou.toString(); a[5] = alfaY_str;


    let Jy_dou = (d_dou * cx_dou * cx_dou * cx_dou / 6) + (cx_dou * d_dou * d_dou * d_dou / 6) +
        (cy_dou * d_dou * CAB_dou * CAB_dou) +
        (2 * cx_dou * d_dou * ((cx_dou / 2) - CAB_dou) * ((cx_dou / 2) - CAB_dou));
    let Jy_str = Jy_dou.toString(); a[6] = Jy_str;

    let Jx_dou = (cy_dou * d_dou * d_dou * d_dou / 12) + (cy_dou * cy_dou * cy_dou * d_dou / 12) +
        ((2 * cx_dou * d_dou) * (cy_dou / 2) * (cy_dou / 2));
    let Jx_str = Jx_dou.toString(); a[7] = Jx_str;

    let gx_dou = 0;//((c1_dou+d_dou)/2)-CAB_dou;
    let gx_str = gx_dou.toString(); a[8] = gx_str;
    let gy_dou = 0;//((c2_dou+d_dou)/2)-CBD_dou;
    let gy_str = gy_dou.toString(); a[9] = gy_str;

    //revision si aplican o no momentos
    let aplicaMux = aplicaMuPenetracion(VuSuelo_dou, d_dou, fc_dou, msx_dou);
    let aplicaMuy = aplicaMuPenetracion(VuSuelo_dou, d_dou, fc_dou, msy_dou);

    if (aplicaMux = false) {
        msx_dou = 0;
    }
    if (aplicaMuy = false) {
        msy_dou = 0;
    }

    //revision por penetracion

    let Vu1Penetracion_dou = (VuSuelo_dou / Acr_dou)
        + (alfaX_dou * ((fc_dou * msx_dou) * CBD_dou / Jx_dou))
        + (alfaY_dou * ((fc_dou * msy_dou) * CAB_dou / Jy_dou));
    let Vu2Penetracion_dou = (VuSuelo_dou / Acr_dou)
        + (alfaX_dou * ((fc_dou * msx_dou) * CBD_dou / Jx_dou))
        + (alfaY_dou * ((fc_dou * msy_dou) * CAB_dou / Jy_dou));
    let VuPenetracion_dou = Vu1Penetracion_dou;
    if (VuPenetracion_dou <= Vu2Penetracion_dou) {
        VuPenetracion_dou = Vu2Penetracion_dou;
    }
    let VuPenetracion_str = VuPenetracion_dou.toString();
    a[10] = VuPenetracion_str;

    let yi_dou = 0;
    if ((0.5 + (cy_dou / cx_dou)) > 1) {
        yi_dou = 1;
    } else {
        yi_dou = (0.5 + (cy_dou / cx_dou));
    }
    let yi_str = yi_dou.toString(); a[11] = yi_str;

    return a;
}

function DisenoPorFlexion(d_dou, f1c_dou, fy_dou, Mu_dou,
    dVarPos1_dou) {
    let a = new Array(11);
    //Calculos preliminares

    let f2c_dou = 0.85 * f1c_dou;
    let f2c_str = f2c_dou.toString(); a[0] = f2c_str;


    let roMin_dou = 0.7 * Math.sqrt(f1c_dou) / fy_dou;
    let roMin_str = roMin_dou.toString(); a[1] = roMin_str;

    let B1_dou = 0;
    if (f1c_dou <= 280) {
        B1_dou = 0.85;
    }
    if (f1c_dou > 280) {
        B1_dou = 1.05 - (f1c_dou / 1400);
    }
    let B1_str = B1_dou.toString(); a[2] = B1_str;

    let roMax_dou = 0.9 * (f1c_dou / fy_dou) * ((6000 * B1_dou) / (6000 + fy_dou));
    let roMax_str = roMax_dou.toString(); a[3] = roMax_str;


    let qpos_dou = 1 - Math.sqrt(1 - ((2 * 100 * 1000 * Mu_dou) / (0.9 * 100 * d_dou
        * d_dou * f2c_dou)));
    let qpos_str = qpos_dou.toString(); a[4] = qpos_str;

    let roCal_dou = qpos_dou * f2c_dou / fy_dou;
    let roCal_str = roCal_dou.toString(); a[5] = roCal_str;

    let roUtil_dou = 0;
    if (roCal_dou < roMin_dou) {
        roUtil_dou = roMin_dou;
    }
    if (roMin_dou < roCal_dou && roCal_dou < roMax_dou) {
        roUtil_dou = roCal_dou;
    }
    let roUtilPos_str = roUtil_dou.toString(); a[6] = roUtilPos_str;

    let As_dou = roUtil_dou * 100 * d_dou;
    let As_str = As_dou.toString(); a[7] = As_str;

    let diam1 = dVarPos1_dou * 2.54 / 8;

    let AceroVar_dou = (Math.PI * diam1 * diam1 / 4);
    let AceroVar_str = AceroVar_dou.toString(); a[8] = AceroVar_str;

    let numVarillas_int = As_dou / AceroVar_dou;
    let numVarillas_str = numVarillas_int.toString(); a[9] = numVarillas_str;

    let separacion_int = 100 / numVarillas_int;
    separacion_int = redondear(separacion_int);
    let separacion_str = separacion_int.toString(); a[10] = separacion_str;


    return a;
}
function redondear(separacion_int) {
    if (separacion_int > 5) {
        let residuo = (separacion_int % 5);
        return separacion_int - residuo;
    }
    return separacion_int;
}

