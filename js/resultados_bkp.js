var estilo        = { font: "40px Arial", fill: "#fff", align: "center" };

var Resultados = new Phaser.Class({

	Extends: Phaser.Scene,

	initialize:

	function Resultados ()
	{
		Phaser.Scene.call(this, { key: 'resultados' });
	},

    preload: function ()
    {
		this.load.image('fundo', 'img/background.jpg');
		this.load.image('btVoltar', 'img/bto_voltar.png');
		this.load.image('iHealth', 'img/conquista.png');
    },

    create: function ()
    {

		// --- componentes da tela ---

	    this.fundo = this.add.image(487, 775, 'fundo');
	    const btoVoltar = this.add.image(500, 1300, 'btVoltar', { fill: '#0f0' })
    	  .setInteractive()
	      .on('pointerdown', () => this.doVoltar() );
	      
	    this.grupo    = this.add.group();       
	    //this.cursores = this.input.keyboard.createCursorKeys();

		//--- separa os registros de localização por ocorrências de caminhada ----
	   	var dbData    = localStorage.getItem('Data'); // todos os registros de data
		var dbCoor    = localStorage.getItem('Local');
		var arrDBData = dbData.split('|'); // registros separados por dia
		var arrDBCoor = dbCoor.split('|');

		var x1           = 1;
		var posImg       = 0;
		var posTxt1      = 0;
		var posTxt2      = 0;
		do {
			//--- analisa o percurso e calcula tempo, distância e velocidade média ---
    		var datafim      = '';
    		var coorfim      = '';
    		var distancia    = 0;
    		var tempo        = 0;
    		var velocidade   = 0;

			var x2      = 0;
			var arrData = arrDBData[x1].split(','); // registros individuais de data
			var arrCoor = arrDBCoor[x1].split(','); // registros individuais de localização

  			do {
    			if (arrData[x2] != '' && arrData[x2] != null && arrData[x2] != 'null') {
    				// --- calcula o tempo entre os registros ---
    				var date1 = new Date(arrData[x2]);
					var date2 = new Date(datafim);
					if (date1.getDate() == date2.getDate() && date1.getMonth() == date2.getMonth() && date1.getYear() == date2.getYear()) { }
					else {
						if (!isNaN(date2)) {
							//Titulo.x = Titulo.x + posX;
							// --- início dos registros de um dia específico, mostra os resultados do dia anterior ---
							eval('var Destaque' + x1 + ' = this.add.image(' + posImg + ', 600, "iHealth");');
							eval('var Titulo' + x1 + ' = this.add.text(' + posTxt1 + ', 150, "CONQUISTA DESBLOQUEADA!", estilo);');
							eval('var Texto' + x1 + ' = this.add.text(' + posTxt2 + ', 480, "No dia ' + date1.getDate() + ' \\n\\n voce caminhou por \\n\\n' + parseFloat(distancia).toFixed(2) + ' metros!", estilo);');
							posImg  = posImg  + 500;
							posTxt1 = posTxt1 + 250;
							posTxt2 = posTxt2 + 330;
	    				}
					}
					if (isNaN(date2 - date1) == false) tempo = tempo + (date2 - date1);
					if (tempo < 0) tempo = tempo * (-1);

					// --- calcula a distância entre os regitros ---
					var PI = 3.14159265358979323846;

					if (arrCoor[x2].trim() != '' && coorfim.trim() != '' && (arrCoor[x2].trim() != coorfim.trim())) {

						var lat1 = parseFloat(arrCoor[x2].substr((arrCoor[x2].indexOf('la:')+4),(arrCoor[x2].indexOf('lo:')-6)));
						var lon1 = parseFloat(arrCoor[x2].substr((arrCoor[x2].indexOf('lo:')+4),arrCoor[x2].length));
						var lat2 = parseFloat(coorfim.substr((coorfim.indexOf('la:')+4),(coorfim.indexOf('lo:')-6)));
						var lon2 = parseFloat(coorfim.substr((coorfim.indexOf('lo:')+4),coorfim.length));

						rad = function(x) {return x*Math.PI/180;}
						
  						var R     = 6378.137; //Raio da Terra no km (WGS84)
  						var dLat  = rad( lat2 - lat1 );
  						var dLong = rad( lon2 - lon1 );
						
  						var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLong/2) * Math.sin(dLong/2);
  						var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  						var d = R * c;
						
  						distancia = distancia + (d*1000);
					}
    			}
    	 	   	datafim = arrData[x2];
    	 	   	coorfim = arrCoor[x2];
	    		x2 = x2 + 1;
    		} while (x2 < arrData.length); // cada um dos registros de localização
			// --- mostra os resultados do último dia ---
    		x1 = x1 + 1;
			eval('var Destaque' + x1 + ' = this.add.image(' + posImg + ', 600, "iHealth");');
			eval('var Titulo' + x1 + ' = this.add.text(' + posTxt1 + ', 150, "CONQUISTA DESBLOQUEADA!", estilo);');
			eval('var Texto' + x1 + ' = this.add.text(' + posTxt2 + ', 480, "No dia ' + date1.getDate() + ' \\n\\n voce caminhou por \\n\\n' + parseFloat(distancia).toFixed(2) + ' metros!", estilo);');

 	   		//velocidade = tempo / distancia;    		
    		// apresentar os dados
    		// pode ser um gráfico, pode ser um mapa de conquistas
    		// mostra a projeção
    	} while (x1 < arrDBData.length); // cada uma das caminhadas

    	if (x1 <= 1) var Texto1 = this.add.text(posTxt1,150,'Comece suas caminhadas e veja aqui os resultados',estilo);
    	else {
    		for (x2 = 1; x2 <= x1; x2++) {
    			eval('this.grupo.add(Destaque' + x2 + ')');
    			eval('this.grupo.add(Titulo' + x2 + ')');
    			eval('this.grupo.add(Texto' + x2 + ')');
    		}
    	}
    },
    
    update: function ()
    {
		//if (this.cursores.left.isDown) this.moveEsquerda();
		//if (this.cursores.right.isDown) this.moveDireita();
		
    },
    
    converteMes: function (mes)
    {
    	if (mes == 'Jan') return '01';
    	if (mes == 'Feb') return '02';
    	if (mes == 'Mar') return '03';
    	if (mes == 'Apr') return '04';
    	if (mes == 'May') return '05';
    	if (mes == 'Jun') return '06';
    	if (mes == 'Jul') return '07';
    	if (mes == 'Aug') return '08';
    	if (mes == 'Sep') return '09';
    	if (mes == 'Oct') return '10';
    	if (mes == 'Nov') return '11';
    	if (mes == 'Dec') return '12';
    },

	getDistanceFromLatLonInKm: function (position1, position2) {
    	"use strict";
    	var deg2rad = function (deg) { return deg * (Math.PI / 180); },
        	R = 6371,
        	dLat = deg2rad(position2.lat - position1.lat),
        	dLng = deg2rad(position2.lng - position1.lng),
        	a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
            	+ Math.cos(deg2rad(position1.lat))
            	* Math.cos(deg2rad(position1.lat))
            	* Math.sin(dLng / 2) * Math.sin(dLng / 2),
        	c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    	return ((R * c *1000).toFixed());
	},
	
	mostraTempo: function (tempo) {	
		var difHrs = Math.floor((tempo % 86400000) / 3600000);
		var difMins = Math.round(((tempo % 86400000) % 3600000) / 60000);
		tempo = difHrs + 'h ' + difMins + 'm';
	},
	
    doVoltar: function ()
    {
		this.scene.start('inicio');
    },
    
    moveEsquerda: function ()
    {
		this.moveGrupo('-');
		this.cursores.left.isDown = false;
		
    },
    
    moveDireita: function ()
    {
		this.moveGrupo('+');
		this.cursores.right.isDown = false;
    },
    
    moveGrupo: function (direcao)
    {
    	var veloc = 10;
    	let resultados = this.grupo.getChildren();
    	let qtdResultados = resultados.length;
    	for (let i = 0; i < qtdResultados; i++) {
 
    		if (direcao == '+') resultados[i].x += veloc;
    		else resultados[i].x -= veloc;
 		
    		// faz parar quando sai da tela
    		/*if (resultados[i].x >= this.enemyMaxY && resultados[i].speed > 0) {
      		resultados[i].speed *= -1;
    		} else if (resultados[i].x <= this.enemyMinY && resultados[i].speed < 0) {
      		resultados[i].speed *= -1;*/
  		}
	}
	
});
