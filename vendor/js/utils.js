    //************ Génération de nombres aléatoires
    /**
	*	Générer un certain nombre de nombre alléatoires suivant la loi uniforme
	*	Ici on se contentera de la formule Math.random de javascript
	*/
	function generer_nombre_uni(nb_number, nb_min, nb_max) {
		// Tableau contenant les numéros générés
		var nombre_tab = new Array();
		var min = nb_min;       
  		var max = nb_max;

		// Génération des nombres
		var i = 0;
		while (i < nb_number) {
			nombre_tab[i++] = Math.random() * (max - min) + min;
		}

		return nombre_tab;
	}

	/**
	*	Générer un certain nombre de nombre alléatoires suivant la loi exponentielle
	*/
	function generer_nombre_exp(nb_number, lambda) {
		// Tableau contenant les numéros générés
		var nombre_tab = new Array();

		// Génération des nombres
		var i = 0;
		while (i < nb_number) {
			var x = Math.random();
			nombre_tab[i++] = -(1 / lambda) * Math.log(1-x);
		}

		return nombre_tab;
	}

	/**
	*	Générer un certain nombre de nombre alléatoires suivant la loi normale
	*	(Box Muller)
	*/
	function generer_nombre_norm(nb_number, esperance, ecart_type) {

		// Transformation de Box-Muller -> retourne un nombre gaussien suivant une loi centrée réduite
		function gauss_by_BM() {
		    var u = 0, v = 0;
		    while(u === 0) u = Math.random(); // Nombre différent de 0
		    while(v === 0) v = Math.random();
		    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
		}

		// Tableau contenant les numéros générés
		var nombre_tab = new Array();

		// Génération des nombres
		var i = 0;
		while (i < nb_number) {
			var x = gauss_by_BM();
			nombre_tab[i++] = Number(esperance) + Number(x) * Number(ecart_type);
		}

		return nombre_tab;
	}

	/**
	*	Générer un certain nombre de nombre alléatoires suivant la loi de poisson
	*   source en annexe
	*/
	function generer_nombre_poi(nb_number, lambda) {
		// Tableau contenant les numéros générés
		var nombre_tab = new Array();

		function genPoisson(l) {
		    var l = Math.exp(-lambda);
		    var k = 0;
		    var p = 1;
		    do{
		        k++;
		        x = Math.random()
		        p = p * x;
		    }while(p > l);
		    return k-1;
		}

		// Génération des nombres
		var i = 0;
		while (i < nb_number) {
			nombre_tab[i] = genPoisson(lambda);
			i++;
		}

		return nombre_tab;
	}

	/**
	*	Générer un certain nombre de nombre alléatoires suivant la loi de Weibull
	*	https://www.taygeta.com/random/weibull.html (ne fonctionne pas)
	*/
	function generer_nombre_wei(nb_number, lambda, forme) {
		// Tableau contenant les numéros générés
		var nombre_tab = new Array();
  		var max = Math.floor(nb_max);

		// Génération des nombres
		var i = 0;
		while (i < nb_number) {
			var x = Math.random();
			//nombre_tab[i++] = 1 - Math.exp(-(Math.pow(lambda * x,forme)));
			nombre_tab[i++] = (forme/lambda) * (Math.pow(x/lambda, forme-1)) * (Math.exp(-(Math.pow(x/lambda,forme))));
		}

		return nombre_tab;
	}
	
	
	//************ Khi2
	/**
	*	Test du Khi2
	*/
	function khi2(loi, nombre_tab) {
	    // format: {borne_min, borne_max, nb_nombre, proba)
		var classe_tab = new Array(); 
        var d = 0;
        
        // loi discrete
        if (loi == "poi") {
            var nb_classe = maxTab(nombre_tab) - minTab(nombre_tab);
        } else {
            var nb_classe = 10;
        }
        //Tableau des classes contenant les informations de chaque classe au format {borne_min, borne_max, nb_nombre, proba)
        for (var i = 0; i < nb_classe; i++) {
            classe_tab[i] = new Array();
            classe_tab[i]["borne_min"] = getBorneMin(loi, i, nombre_tab);
            classe_tab[i]["borne_max"] = getBorneMax(loi, i, nombre_tab);
            classe_tab[i]["nb_nombre"]  = getProportion(nombre_tab, classe_tab[i]["borne_min"], classe_tab[i]["borne_max"]);
            classe_tab[i]["proba"] = get_proba(loi, classe_tab[i]["borne_min"], classe_tab[i]["borne_max"]);
            classe_tab[i]["effObs"] = getEffectif(nombre_tab, classe_tab[i]["borne_min"], classe_tab[i]["borne_max"]);
            classe_tab[i]["effTheo"] = getEffectifTheorique(nombre_tab, classe_tab[i]["borne_min"], classe_tab[i]["borne_max"]);
        }
        //CALCUL DU KHI2
        for (var i = 0; i < nb_classe; i++){
            d = d + Math.pow(classe_tab[i]["effObs"]-classe_tab[i]["effTheo"],2)/classe_tab[i]["effTheo"];
        }
        //Affichage HTML
        $("#d").html(precisionRound(d, 3));
       return classe_tab 
	}
	
	
//************ Fonctions probabilités

    function getBorneMin(loi, i, nombre_tab) {
	    if (loi == "poi"){
	        return minTab(nombre_tab)+i;
	    } else {
	        return minTab(nombre_tab) + (((maxTab(nombre_tab) - minTab(nombre_tab))/10)*i);
	    }
	}

    function getBorneMax(loi, i, nombre_tab) {
	    if (loi == "poi"){
	        return minTab(nombre_tab)+i;
	    } else {
	        return minTab(nombre_tab) + (((maxTab(nombre_tab) - minTab(nombre_tab))/10)*(i+1));
	    }
	}

    function get_proba(loi, min, max) {
        switch(loi){
            case "uni" : 
                return uni();
                break;
            case "poi" : 
                return poisson(min, max, lambda);
                break;
            case "exp" : 
                return exp(min, max, lambda);
                break;
            case "norm" : 
                return norm(min, max, esperance, ecart_type);
                break;
            case "wei" :
                return weibull(min, max, lambda, forme);
                break;
        }
    }
    
    //Loi UNIFORME
    function uni() {
        return 0.1;
    }
    
    //Loi de POISSON
    function poisson(min,max, lambda){
        var poisson = 0;
        for (i = Math.ceil(min); i<=Math.floor(max); i++){
            poisson +=  Math.pow(lambda, i)/fact(i)*Math.exp(-lambda);
        }
        return poisson;
    }
    
    //Loi EXPONENTIELLE
    function exp(min,max, lambda){
        var infMin = 0;
        var infMax = 0;
        
        //proba inférieur à min
        infMin =  1 - Math.exp(-lambda*min);
        //proba supérieur a min
        infMax =  1 - Math.exp(-lambda*max);
        //on retourne proba max - proba min pour avoir l'intervalle
        return infMax-infMin;
    }
    
    //Loi NORMALE
     function norm(min, max, esperance, ecart_type){
        var borneMin = Number((min-esperance)/ecart_type);
        var borneMax = Number((max-esperance)/ecart_type);
        return Pi(borneMax) - Pi(borneMin);
    }
    
    //Loi WEIBULLL
     function weibull(min, max, lambda, forme){
        var borneMin = 1 - Math.exp(-(Math.pow(min/lambda, forme)))
        var borneMax = 1 - Math.exp(-(Math.pow(max/lambda, forme)))
        return borneMax - borneMin;
    }
    
//************ Utils

        //******Fonction pour loi normalle
        function erf(x){
        	var t=1/(1+0.3275911*x);
        	var ye=1.061405429;
        	ye=ye*t-1.453152027;
        	ye=ye*t+1.421413741;
        	ye=ye*t-0.284496736;
        	ye=ye*t+0.254829592;
        	ye*=t;
        	ye*=Math.exp(-x*x);
        	return (1-ye);
        }
        
        function Pi(x){
        	if(x<0){return(1-Pi(-x));} else {
        		if(x<100){
        		return((1+erf(x/Math.SQRT2))/2);
        		} else {
        			return(1);
        		}
        	}
        }
        //********//

        function minTab(tab) {
            var min = 1e+10;
		    for (var i = 0; i < tab.length - 1; i++) {
                if (tab[i] < min){
                    min = Number(tab[i]);
                }
            }
            return min;
		}
		function maxTab(tab) {
		    var max = 0;
		    for (var i = 0; i < tab.length - 1; i++) {
                if (tab[i] > max){
                    max = Number(tab[i]);
                }
            }
            return max;
		}
		
		
		function getProportion(tab, min, max) {
		    if (loi == "poi"){
		        return getEffectifDiscret(tab, min, max)/tab.length;
		    } else {
		        return getEffectifContinu(tab, min, max)/tab.length;
		    }
		}

		
		function getEffectif(tab, min, max){
		    if (loi === "poi"){
		        return getEffectifDiscret(tab, min, max);
		    } else {
		        return getEffectifContinu(tab, min, max);
		    }
		}
		
		function getEffectifDiscret(tab, min, max) {
		    var count = 0;
		    for (var i = 0; i < tab.length - 1; i++) {
                if (tab[i] == min){
                    count++;
                }
            }
            return count;
		}
		
		function getEffectifContinu(tab, min, max) {
		    var count = 0;
		    for (var i = 0; i < tab.length - 1; i++) {
                if (tab[i] >= min && tab[i] < max){
                    count++;
                }
            }
            return count;
		}
		
		function getEffectifTheorique(tab, min, max){
		    if (loi === "poi"){
		        return tab.length * get_proba(loi, min, max);
		    }else{
		        return tab.length * get_proba(loi, min, max);
		    }
		}
		
		function fact(x){
		  var nb = 1;
		  for (var i=1 ; i<=x ; i++){
                nb=nb*i;
		  }
		  return nb;
		}

		
		
		
		
