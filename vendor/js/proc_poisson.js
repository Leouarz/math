function lancer_processus_poisson(){
     var listeTempsEvent = new Array();
     var classeTab = new Array(); 
     var nb_event = processus_poisson(nb_periode, duree, lambda, listeTempsEvent, classeTab);
     var ddl = nb_periode - 2;
     
     $("#evnt_tot").html(nb_event);
     $("#mEvntPeriode").html(mEvntPeriode(classeTab));
     $("#evntPeriodeTheo").html(evntPeriodeTheo(duree, lambda));
     $("#mTempsInter").html(tempsInterTheo(lambda));
     $("#tempsInterTheo").html(mTempsInter(listeTempsEvent, nb_event));
     $("#khi2").html(khi2Poisson(classeTab, lambda, duree));
     //$("#ddl").html("  avec " + ddl + " degrés de liberté");
     
     // Highchart 
		//Event par periode
		var tab_xaxis = new Array();
		$(classeTab).each(function(id, val){
		    tab_xaxis.push("[" + id*duree + "; " + (id+1)*duree + "]");
		});
		
		var tab_yaxis = new Array();
		$(classeTab).each(function(id, val){
		    tab_yaxis.push(val);
		});
		
// 		//event en fonction du temps
// 		var tab_xaxis2 = new Array();
// 		$(listeTempsEvent).each(function(id, val){
// 		    tab_xaxis.push("[" + id*((duree*nb_periode)/listeTempsEvent.length) + "]");
// 		});
		
// 		var tab_yaxis2 = new Array();
// 		$(listeTempsEvent).each(function(id, val){
// 		    tab_yaxis.push(val);
// 		});
		
        Highcharts.chart('container', {
            chart: {
                type: 'column'
            },
            credits: {
                enabled: false
            },
            title: {
                text: 'Représentation des événement en fonction des périodes'
            },
            subtitle: {
                text: 'Pour des période d\'une durée t=' + duree + ' et une cadence de λ=' + lambda
            },
            xAxis: {
                categories: tab_xaxis,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Événements'
                }
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: [{
                name: 'Apparition de l\'event',
                data: tab_yaxis
            }]
    });
}

//Retourne un nombre expo 
 function loi_expo(lambda){
     return Number (-(1 / lambda) * Math.log(Math.random()));
 }
 
 //Retourne un nombre expo 
 function loi_poi(lambda){
     return Number (-(1 / lambda) * Math.log(Math.random()));
 }

 //Effectue un processus de Poisson en fonction du nombre de periode à simuler, la durée d'une période, et d'un lambda
 function processus_poisson(nb_periode, duree, lambda, listeTempsEvent, classeTab){
     var tempsEvent;
     nb_event = 1;
     var tempsTotal = 0;

    //On simule un event
     tempsEvent = loi_expo(lambda);
     //tant que le moment d'apparition de l'event est inférieur a la durée actuel
     while ((tempsTotal + tempsEvent) < (nb_periode * duree)) {
     //On enregistre le temps
     tempsTotal += tempsEvent;
        listeTempsEvent.push(tempsTotal);
        //On incrémente le nombre d'event
        nb_event += 1;
        //On simule un autre event
        tempsEvent = loi_expo(lambda);
     }
     //Creation du tableau de classes
     createTabClasse(listeTempsEvent, duree, classeTab);
     return nb_event;
 }
 
 //Crée le tableau de classe (trie par periode)
 function createTabClasse(listeTempsEvent, duree, classeTab){
     var indicePeriode = 0;
     for (i=0; i<listeTempsEvent.length; i++){
         if (listeTempsEvent[i] <= duree * (indicePeriode + 1)){
             if (isNaN(classeTab[indicePeriode])){
                 classeTab[indicePeriode] = 1;
             }else{
                 classeTab[indicePeriode] = classeTab[indicePeriode] + 1;
             }
         }else{
            indicePeriode+=1;
         }
     }
     
 }
 
 //Retourne la moyenne d'événements par période
 function mEvntPeriode(classTab){
     var nb = 0;
     var s = 0;
     for (i=0; i<classTab.length; i++){
         s += classTab[i];
     }
     nb = s / classTab.length +1;
     return nb;
 }
 
 //retourne le nombre d'événements par période théorique
  function evntPeriodeTheo(duree, lambda){
     return duree*lambda;
 }
 
 
//Retourn la moyenne d'intervalle de temps entre deux événements de notre simulation 
function mTempsInter(listeTempsEvent, nb_event){
    var s = 0;
    for (i = 0; i < listeTempsEvent.length - 1; i++){
        s += listeTempsEvent[i+1] - listeTempsEvent[i];
    }
    return s/nb_event;
}

//Retourne le temps théorique entre deux événements
function tempsInterTheo(lambda){
    if (lambda>0){
        return 1/lambda;
    }else{
        return 0;
    }
}

function khi2Poisson(classeTab, lambda, duree){
    var s = 0;
    var classeInf5 = 0;
    var theo = evntPeriodeTheo(duree, lambda)
    for (i=0; i<classeTab.length; i++){
        if (classeTab[i] >= 5){
            s+= Math.pow(((classeInf5+classeTab[i])-theo), 2)/theo
            classeInf5 = 0;
        }else{
            classeInf5 = classeTab[i];
        }
    }
    return s;
}


