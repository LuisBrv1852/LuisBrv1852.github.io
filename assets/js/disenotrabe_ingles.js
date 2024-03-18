
function calcularAS() {
    // Inicializar un array para almacenar los resultados
    let a = new Array(47);

    // Obtener valores de los elementos de entrada
    let nombreProy_str = document.getElementById("nombreProy").value;
    a[0] = nombreProy_str;

    let numTrabe_str = document.getElementById("numTrabe").value;
    a[1] = numTrabe_str;

    // Declarar variables para cálculos preliminares
    let h_str = document.getElementById("h").value;
    a[2] = h_str;
    let h_dou = parseFloat(h_str);

    let r_str = document.getElementById("r").value;
    a[3] = r_str;
    let r_dou = parseFloat(r_str);

    let b_str = document.getElementById("b").value;
    a[4] = b_str;
    let b_dou = parseFloat(b_str);

    let f1c_str = document.getElementById("f1c").value;
    a[6] = f1c_str;
    let f1c_dou = parseFloat(f1c_str);

    let fy_str = document.getElementById("fy").value;
    a[8] = fy_str;
    let fy_dou = parseFloat(fy_str);

    let muMas_str = document.getElementById("muMas").value;
    a[9] = muMas_str;
    let muMas_dou = parseFloat(muMas_str);

    let muMenos_str = document.getElementById("muMenos").value;
    a[10] = muMenos_str;
    let muMenos_dou = parseFloat(muMenos_str);

    //***Acero Positivo

    let nvarPos = document.getElementById("cantNumVarPos").value;
    a[21] = nvarPos;
    let nvarPos_dou = parseFloat(nvarPos);

    /*let nvarPos2=document.getElementById("cantNumVarPos2").value;
    a[25] = nvarPos2;
    let nvarPos2_dou=parseFloat(nvarPos2);*/

    let diamvarPos = document.getElementById("diamVarPos").value;
    a[22] = diamvarPos;
    let diamvarPos_dou = parseFloat(diamvarPos);

    /*let diamvarPos2=document.getElementById("diamNumVarPos2").value;
    a[25] = diamvarPos2;
    let diamvarPos2_dou=parseFloat(diamvarPos2);*/

    //***Acero Negativo

    let nvarNeg = document.getElementById("cantNumVarNeg").value;
    a[23] = nvarNeg;
    let nvarNeg_dou = parseFloat(nvarNeg);

    /*let nvarPos2=document.getElementById("cantNumVarPos2").value;
    a[27] = nvarPos2;
    let nvarPos2_dou=parseFloat(nvarPos2);*/

    let diamvarNeg = document.getElementById("diamVarNeg").value;
    a[24] = diamvarNeg;
    let diamvarNeg_dou = parseFloat(diamvarNeg);

    /*let diamvarPos2=document.getElementById("diamNumVarPos2").value;
    a[28] = diamvarPos2;
    let diamvarPos2_dou=parseFloat(diamvarPos2);*/

    //***VU
    let Vu_str = document.getElementById("vu").value;
    a[11] = Vu_str;
    let Vu_dou = parseFloat(Vu_str);

    //***Acero por cortante

    let dVarEst_str = document.getElementById("diamVarEst").value;
    a[39] = dVarEst_str;
    let dVarEst_dou = parseFloat(dVarEst_str);
    let NRamal_str = document.getElementById("numRamales").value;
    a[40] = NRamal_str;
    let NRamal_dou = parseFloat(NRamal_str);
    let diamEst = dVarEst_dou * 2.54 / 8;

    //***Calculos preliminares
    let d_dou = h_dou - r_dou;
    let d_str = d_dou.toString();
    a[5] = d_str;

    let f2c_dou = 0.85 * f1c_dou;
    let f2c_str = f2c_dou.toString();
    a[7] = f2c_str;

    let roMin_dou = 0.7 * Math.sqrt(f1c_dou) / fy_dou;
    let roMin_str = roMin_dou.toString();
    a[12] = roMin_str;

    let B1_dou = 0;

    if (f1c_dou <= 280) {
        B1_dou = 0.85;
    } if (f1c_dou > 280) {
        B1_dou = 1.05 - (f1c_dou / 1400);
    }

    let B1_str = B1_dou.toString();
    a[14] = B1_str;

    let roMax_dou = 0.9 * (f2c_dou / fy_dou) * ((6000 * B1_dou) / (6000 + fy_dou));
    let roMax_str = roMax_dou.toString();
    a[13] = roMax_str;

    //** Calculos por Flexion
    let b = calcularFelexion(d_dou, b_dou, fy_dou, roMin_dou, roMax_dou, muMas_dou, f2c_dou)
    let c = calcularFelexion(d_dou, b_dou, fy_dou, roMin_dou, roMax_dou, muMenos_dou, f2c_dou)

    a[15] = b[0];//q
    let qpos = parseFloat(b[0]);
    a[16] = c[0];
    let qneg = parseFloat(c[0]);
    a[45] = b[1];//ro
    let ropos = parseFloat(b[1]);
    a[46] = c[1];
    let roneg = parseFloat(c[1]);
    a[17] = b[2];//routil,
    let routilpos = parseFloat(b[2]);
    a[18] = c[2];
    let routilneg = parseFloat(c[2]);
    a[19] = b[3];//AS
    let AceroPos = parseFloat(a[19]);
    a[20] = c[3];
    let AceroNeg = parseFloat(a[20]);
    let mensajeRoPos = b[4];//mensaje
    let mensajeRoNeg = c[4];

    //***Acero positivo a flexion
    let diam1 = diamvarPos_dou * 2.54 / 8;
    //let diam2=diamvarPos2_dou*2.54/8;

    let AceroPos_dou = nvarPos_dou * (Math.PI * diam1 * diam1 / 4);

    let mensaje1 = "";
    if (AceroPos_dou >= AceroPos) {
        mensaje1 = "Correct, the proposed steel is larger";
    }
    if (AceroPos_dou < AceroPos) {
        mensaje1 = "Increase Steel";
    }

    mensaje1 = mensaje1 + "  " + mensajeRoPos;
    a[29] = mensaje1;

    //***Acero negativo a flexion
    let diam1_neg = diamvarNeg_dou * 2.54 / 8;
    //let diam2_neg=diamvarNeg2_dou*2.54/8;

    let AceroNeg_dou = nvarNeg_dou * (Math.PI * diam1_neg * diam1_neg / 4);

    let mensaje2 = "";
    if (AceroNeg_dou >= AceroNeg) {
        mensaje2 = "Correct, the proposed steel is larger";
    }
    if (AceroNeg_dou < AceroNeg) {
        mensaje2 = "Increase Steel";
    }

    mensaje2 = mensaje2 + "  " + mensajeRoNeg;
    a[30] = mensaje2;

    //***Revision por cortante */
    let rev_por_cortante = (2.5 * 0.75 * b_dou * d_dou * Math.sqrt(f1c_dou)) / 1000;
    let rev_por_cortante_str = rev_por_cortante.toString();
    a[31] = rev_por_cortante_str;

    let mensaje3 = "";
    if (rev_por_cortante >= Vu_dou) {
        mensaje3 = "Ok, Correct Section"
    } if (rev_por_cortante < Vu_dou) {
        mensaje3 = "Does not comply, Increase section";
    }
    a[32] = mensaje3;

    //Resistencia del concreto a cortante
    let roNegNuevo_dou = AceroNeg_dou / (b_dou * d_dou);
    let roNegNuevo_str = roNegNuevo_dou.toString();
    a[33] = roNegNuevo_str;

    let Vrc_dou = recsistenciaConcretoCortante(roNegNuevo_dou, b_dou, d_dou, f1c_dou)/1000;
    let Vrc_str = Vrc_dou.toString();
    let mensajeResistCon = "";
    if (roNegNuevo_dou <= 0.015) {
        mensajeResistCon = "ρ<=0.015; VRC= Fr(0.2+(20ρ))bd(f'c^0.5)";
    }
    if (roNegNuevo_dou > 0.015) {
        mensajeResistCon = "ρ>0.015; VRC= Fr0.5bd(f'c^0.5)";
    }
    let resistenciaConcreto="";
    if(Vrc_dou>=Vu_dou){
        resistenciaConcreto="VRC>=Vu, Concrete resists shear, requires stirrups for maximum separation";
    }if(Vu_dou>Vrc_dou){
        resistenciaConcreto="Vu>=VRC, Requires stirrups for resistance"
    }
    a[34] = mensajeResistCon;
    a[33] = roNegNuevo_str;
    a[35] = Vrc_str;

    //***Separacion maxima
    let resistencia_por_cortante = (1.5 * 0.75 * b_dou * d_dou * Math.sqrt(f1c_dou)) / 1000;
    let resistencia_por_cortante_str = resistencia_por_cortante.toString();
    a[35] = resistencia_por_cortante_str;
    let sMax_dou = 0;
    let sMax_str = "";
    let sMaxformula="";
    if (resistencia_por_cortante <= Vu_dou) {
        sMaxformula="<VU, Smax=d/4";
        sMax_dou = d_dou / 4;
    }
    if (resistencia_por_cortante > Vu_dou) {
        sMaxformula=">=VU, Smax=d/2";
        sMax_dou = d_dou / 2;
    }
    sMax_str = sMax_dou.toString();
    a[37] = sMax_str;
    //** AV min */
    let AvMin_dou = 0.3 * Math.sqrt(f1c_dou) * b_dou * sMax_dou / fy_dou;
    let AvMin_str = AvMin_dou.toString();
    a[38] = AvMin_str;
    let asResultado_dou = NRamal_dou * (Math.PI * diamEst * diamEst / 4);
    let asResultado_str = asResultado_dou.toString();
    a[41] = asResultado_str;
    let mensaje4 = "";
    if (asResultado_dou >= AvMin_dou) {
        mensaje4 = "Ok as>Avmin";
    }
    if (asResultado_dou < AvMin_dou) {
        mensaje4 = "Increase diameter or stirrup branches";
    }

    //separacion por Vu
    let sepPorVu_dou = (0.75 * asResultado_dou * fy_dou * d_dou) / ((Vu_dou * 1000) - (Vrc_dou * 1000));
    let sepPorVu_str = sepPorVu_dou.toString();
    a[43] = sepPorVu_str;
    let mensaje5 = "";
    if (sepPorVu_dou <= 0) {
        sepPorVu_dou = 0;
    }
    if (sepPorVu_dou < sMax_dou) {
        mensaje5 = "Rige separacion por Vu";
    }
    if (sMax_dou < sepPorVu_dou) {
        mensaje5 = "Rige separacion maxima";
    }
    a[44] = mensaje5;

    document.getElementById("labelResultado").innerHTML = "";
    document.getElementById("labelResultado2").innerHTML = "";
    document.getElementById("labelResultadoCortante").innerHTML = "";

    let resultadoLabel = document.getElementById("labelResultado")
    resultadoLabel.innerHTML =
        "d= " + d_str + " cm <br>" +
        "ρmin= " + roMin_dou.toFixed(4) + "<br>" +
        "ρmax= " + roMax_dou.toFixed(4) + "<br>" +
        "<br>" +
        "<h4>Flexion check(+)</h4> <br><br>" +
        "q(+)=" + qpos.toFixed(3) + "<br>" +
        "ρ(+)=" + ropos.toFixed(4) + "<br>" +
        "AS(+)=" + AceroPos.toFixed(2) + " cm2<br>" +
        "" + mensaje1 + "<br>" ;
        


    let resultadolabel2 = document.getElementById("labelResultado2")
    resultadolabel2.innerHTML =
        "f''c=" + f2c_dou + " kg/cm2 <br>" +
        "β1=" + B1_dou + "<br> " +
        "<br><br>" +
        "<h4>Flexion check(-)</h4> <br><br>" +
        "q(-)=" + qneg.toFixed(3) + "<br>" +
        "ρ(-)=" + roneg.toFixed(4) + "<br>" +
        "AS(-)=" + AceroNeg.toFixed(2) + " cm2<br>" +
        "" + mensaje2 + "<br>";

     let resultadolabel3 = document.getElementById("labelResultadoCortante")
    resultadolabel3.innerHTML =  "<br><br>"+      
        "<h4>Shear inspection</h4> <br><br>" +
        "<br>" +        
        "<h5>Section Review</h5> <br><br>" +
        "2.5Frb(d^2)*(f'c)^0.5>=VU<br>" +
        "" + rev_por_cortante.toFixed(2) + "ton >= " + Vu_dou.toFixed(2) + "ton <br>" +
        "" + mensaje3 + "<br>" +
        "<br><br>"+    
        "<h5>Concrete shear strength</h5> <br><br>" +
        "ρ=As/bd= "+roNegNuevo_dou.toFixed(4)+"<br>"+
        mensajeResistCon+"<br>"+
        "Vrc= "+Vrc_dou.toFixed(2)+" ton "+resistenciaConcreto+"<br>"+
        "<br><br>"+    
        "<h5>Maximum separation</h5> <br><br>" +
        "1.5Frb(d^2)*(f'c)^0.5= "+resistencia_por_cortante.toFixed(3)+" ton <br>"+
        ""+sMaxformula+"<br>"+
        "Smax="+sMax_dou.toFixed(2)+"cm <br>"+
        "<br><br>"+    
        "<h5>AvMin</h5> <br><br>" +
        "Avmin=0.3(f'c^0.5)*b*s/fy="+AvMin_dou.toFixed(2)+" cm2 <br>"+
        "With the proposed number of rod and number of branches Av="+asResultado_dou.toFixed(2)+"cm2<br>"+
        mensaje4+"<br>"+
        "<br><br>"+    
        "<h5>Separation by Vu</h5> <br><br>" +
        "S=Fr*AV*Fy*d/(Vu-Vrc)="+sepPorVu_dou.toFixed(2)+"cm <br>"+
        mensaje5;

    return a;

}

function miFuncion() {
    let nvarPos = document.getElementById("cantNumVarPos").value;
    let nvarPos_dou = parseFloat(nvarPos);

    let diamvarPos = document.getElementById("diamVarPos").value;
    let diamvarPos_dou = parseFloat(diamvarPos);

    let prueba = nvarPos_dou + diamvarPos_dou;
    let pruebaString = prueba.toString();
    let resultadoLabel = document.getElementById("labelResultado")
    resultadoLabel.innerHTML = "Resultado: " + pruebaString;
}

function calcularFelexion(d_dou, b_dou, fy_dou, roMin_dou, roMax_dou, mu_dou, f2c_dou) {
    let a = new Array(20);
    let mensajeRo = "";
    let q_dou = 1 - Math.sqrt(1 - ((2 * mu_dou * 100 * 1000) / (0.9 * b_dou * d_dou * d_dou * f2c_dou)));
    let q_str = q_dou.toString();
    a[0] = q_str;

    let ro_dou = q_dou * f2c_dou / fy_dou;
    let ro_str = ro_dou.toString();
    a[1] = ro_str;

    let roUtil_dou = ro_dou;
    let roUtil_str = ro_dou.toString();
    if (ro_dou < roMin_dou) {
        roUtil_dou = roMin_dou;
        roUtil_str = roUtil_dou.toString();
    } if (roMax_dou < ro_dou) {
        roUtil_dou = roMax_dou;
        mensajeRo = "Aumentar Sección";
    }

    a[2] = roUtil_str;

    let As_dou = roUtil_dou * b_dou * d_dou;
    let As_str = As_dou.toString();
    a[3] = As_str;
    a[4] = mensajeRo;

    return a;
}

function recsistenciaConcretoCortante(roNegNuevo_dou, b_dou, d_dou, f1c_dou) {

    let Vrc = 0;
    if (roNegNuevo_dou <= 0.015) {
        Vrc = 0.75 * (0.2 + (20 * roNegNuevo_dou)) * b_dou * d_dou * Math.sqrt(f1c_dou);
    }
    if (roNegNuevo_dou > 0.015) {
        Vrc = 0.75 * 0.5 * b_dou * d_dou * Math.sqrt(f1c_dou);
    }


    return Vrc;
}