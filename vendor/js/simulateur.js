//Effectue un processus de Poisson en fonction du nombre de periode à simuler, la durée d'une période, et d'un lambda
 function processus_taxi(nb_periode, duree, lambda, mu, nbPlaceFile){
     var tempsTotal = 0;
     var tempsArrivee = 0;
     var tempsChargement = 0;
     var nbTaxiPerdu = 0;
     var nbClientPerdu = 0;
     var tabProcPoisson = new Array();
     var listeTempsArriveeTaxi = new Array();
     var listeTempsDureeChargement = new Array();
     var listeTempsFinChargement = new Array();

/*    function GenerateRandomArrivee(){
        processus_poisson(1, duree, lambda, tabProcPoisson, new Array);
        if (isNaN(tabProcPoisson[0])){
        	tempsArrivee=0;
        }else{
        	tempsArrivee = tabProcPoisson;
        }
        tabProcPoisson = new Array();
    }
    function GenerateRandomService(){
        tempsChargement = loi_expo(mu);
    }*/
    var fileTaxi = new Array();
    var attenteTotal = 0;
    var nbClientsOk = 0;
    tempsArrivee = loi_expo(lambda);
    tempsChargement = 0;
    tempsFinChargement = 100000000;

    //while ((tempsTotal) < (nb_periode * duree)){
    while (tempsArrivee < nb_periode * duree){
    	if (tempsArrivee < tempsFinChargement){
    		if (fileTaxi.length < 1){
    			tempsChargement = loi_expo(mu);
    			tempsFinChargement = tempsArrivee + tempsChargement;
    		}
    		fileTaxi.push(tempsArrivee);
    		listeTempsArriveeTaxi.push(tempsArrivee);
    		tempsArrivee += loi_expo(lambda);
    	}else{
    		var attente = tempsFinChargement - fileTaxi.shift();
    		attenteTotal += attente;
    		listeTempsFinChargement.push(tempsFinChargement);
    		nbClientsOk += 1;
    		if (fileTaxi.length < 1){
    			tempsFinChargement = 10000000;
    		}else{
    		    tempsChargement = loi_expo(mu);
				tempsFinChargement += tempsChargement;
				listeTempsDureeChargement.push(tempsChargement);
    		}
    	}
    }
    console.log(listeTempsArriveeTaxi);
    console.log(listeTempsDureeChargement);
    console.log(listeTempsFinChargement);
    console.log(TAF(listeTempsArriveeTaxi, listeTempsFinChargement, listeTempsDureeChargement));
    return nbClientsOk;
}

function TAF(listeArrivee, listeSortie, listeDuree) {
    var s = 0;
    for (i=0; i<listeSortie.length - 1; i++){
        s += listeSortie[i] - listeDuree[i] - listeArrivee[i];
    }
    return s/listeSortie.length;
}
