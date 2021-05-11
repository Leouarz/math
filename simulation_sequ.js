function loi_expo(lambda){
     return Number (-(1 / lambda) * Math.log(Math.random()));
 }

function getChart(simul_poisson, tabx, taby1, taby2, taby3, nb_periode, duree, pas){
    var insereD = false, insereF = false, insereC = false;
    if (isNaN(pas)){ 
        pas = 60;
    }
    for (i=0; i<(nb_periode*duree*pas) - 1; i++){
            var isD = 0, isF = 0, isC = 0;
		    tabx.push(i);
		    $.each(simul_poisson.tab, function(id, val){
    		    // val de la forme : [entree, sortie, tps_chargement]
    		    if ((val[0] * pas > i) && (val[0] * pas < (i+1)) && (insereD == false)){
                    isD = 1;
                    insereD = true;
    		    }
    		    if ((val[1] * pas > i) && (val[1] * pas < (i+1)) && (insereF == false)){
                    isF = 1;
                    insereF = true;
    		    }
    		    if (((val[1]-val[2]) * pas > i) && ((val[1]-val[2]) * pas < (i+1)) && (insereC == false)){
                    isC = 1;
                    insereC = true;
    		    }
		    });
		    taby1.push(isD);
		    taby2.push(isC);
		    taby3.push(isF)
		    insereD = false; insereF = false; insereC = false;
	}
}

function processus_taxi(nb_periode, duree, lambda, mu, nbPlaceFile){
    var temps_sortie = 0; // Fin de tout les chargements
    var tab_taxi = new Array();
    var tabProcPoisson;
    var nb_taxi_perdu = 0;
    var moy_taille_file = 0;
    var moy_taille_syst = 0;
    
    // boucler jusqu'a la fin de la simulation
    for(var i = 0; i < nb_periode; i++) {
        // nombre de taxi arrivant dans la période
        tabProcPoisson = new Array();
        var proc_poisson = processus_poisson(1, duree, lambda, tabProcPoisson, new Array);
        // traiter chaque taxis
        for(var j = 0; j < tabProcPoisson.length; j++) {
            // arrivée
            var temps_arrivee = (i * duree) + tabProcPoisson[j];
            // Pour le calcul de la moyenne taille de fille (en nb taxis)
            moy_taille_file += taille_file(tab_taxi, temps_arrivee);
            // Pour le calcul de la moyenne taille du système (en nb de taxis)
            moy_taille_syst += taille_syst(tab_taxi, temps_arrivee);
            // SI il reste de la place dans la file
            if (taille_file(tab_taxi, temps_arrivee) < nbPlaceFile) {
                // On génère un temps de chargement
                var tps_chargement = loi_expo(mu);
                // calcul du temps de sortie (début au plus tot + temps de chargement)
                temps_sortie = Math.max(temps_sortie, temps_arrivee) + tps_chargement;
                // ajout du taxi dans la liste
                tab_taxi.push(new Array(
                    temps_arrivee, 
                    temps_sortie, 
                    (tps_chargement), 
                    taille_file(tab_taxi, temps_arrivee)
                ));
            } else {
                nb_taxi_perdu++;
            }
        }
    }
    return {"taxi_perdu" : nb_taxi_perdu, "tab" : tab_taxi, 
    "moy_taille_file": moy_taille_file/tab_taxi.length, "moy_taille_syst": moy_taille_syst/tab_taxi.length} ;
}

function loi_uniforme(p) { return 1/p; }

function processus_taxi_noMarkov(nb_periode, duree, p, mu, nbPlaceFile){
    var temps_sortie = 0; // Fin de tout les chargements
    var tab_taxi = new Array();
    var tabProcPoisson;
    var nb_taxi_perdu = 0;
    var moy_taille_file = 0;
    var moy_taille_syst = 0;
    
    var temps_arrivee = 0;
    
    while(temps_sortie < nb_periode * duree) {
        temps_arrivee += loi_uniforme(p);
        
        // Pour le calcul de la moyenne taille de fille (en nb taxis)
        moy_taille_file += taille_file(tab_taxi, temps_arrivee);
        // Pour le calcul de la moyenne taille du système (en nb de taxis)
        moy_taille_syst += taille_syst(tab_taxi, temps_arrivee);
        
        if (taille_file(tab_taxi, temps_arrivee) < nbPlaceFile) {
            // On génère un temps de chargement
            var tps_chargement = loi_expo(mu);
                
            // calcul du temps de sortie (début au plus tot + temps de chargement)
            temps_sortie = Math.max(temps_sortie, temps_arrivee) + tps_chargement;
            
            // ajout du taxi dans la liste
            tab_taxi.push(new Array(
                temps_arrivee, 
                temps_sortie, 
                (tps_chargement), 
                taille_file(tab_taxi, temps_arrivee)
            ));
        } else {
            nb_taxi_perdu++;
        }
    }
    
    return {"taxi_perdu" : nb_taxi_perdu, "tab" : tab_taxi, 
    "moy_taille_file": moy_taille_file/tab_taxi.length, "moy_taille_syst": moy_taille_syst/tab_taxi.length} ;
}

function taille_file(liste, temps) {
    var taille = 0;
    $.each(liste, function(id, val){
        if(val[0] < temps && val[1]-val[2] > temps) {
            taille++;
        }
    });
    return taille;
}

//Taille de la file à un moment donné
//Taxi dont le temps d'arrivée est inférieur au temps
//et dont le temps de sortie < temps
function taille_syst(liste, temps) {
    var taille = 0;
    $.each(liste, function(id, val){
        if(val[0] < temps && val[1] > temps) {
            taille++;
        }
    });
    return taille;
}

//Nombre moyen de clients dans le système
function ENBS(lambda, mu){
    var psi = Number (lambda/(mu));
    return psi/(1-psi);
}


//temps moyen de clients dans le système
function ETAS(lambda, mu){
    var psi = Number (lambda/(mu));
    return psi/(lambda*(1-psi));
}

//Nombre moyen de clients dans la file
function ENBF(lambda, mu){
    var psi = Number (lambda/(mu));
    return (psi*psi)/(1-psi);
}

//temps moyen des clients dans la file
function ETAF(lambda, mu){
    var psi = Number (lambda/(mu));
    return (psi*psi)/(lambda*(1-psi));
}

//Fraction d'inocupation de la station de chargement
function ENBSI(lambda, mu){
    var psi = Number (lambda, (mu));
    return 1-psi;
}
