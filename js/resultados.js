// --- variáveis de estilo ---
var estilo        = { font: "40px Arial", fill: "#fff", align: "center" };
var educativo     = { font: "40px Arial", fill: "#000", align: "justify" };
var infos         = { font: "40px Arial", fill: "#fff", align: "justify" };
var titulo        = { font: "50px Arial", fill: "#000", align: "justify" };

// --- variáveis para posicionamento na tela ---
var pagina       = 975;
var posImg       = 285;
var posTxt       = 450;
var posPorc      = 420;
var posCoracao   = 285;
var posPulmao    = 485;
var posBalanca   = 685;
var ponteiro     = 1;

// --- variáveis de tratamento de dados ---
var qtdCaminhadas = 0;
var arrResultados = new Array();
var meta          = 200;

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
		this.load.image('btFrente', 'img/bto_frente.png');
		this.load.image('btTras', 'img/bto_tras.png');
		this.load.image('iHealth', 'img/iHealth.png');
		this.load.image('coracao', 'img/ico_coracao.png');
		this.load.image('pulmao', 'img/ico_pulmao.png');
		this.load.image('balanca', 'img/ico_balanca.png');
    },

    create: function ()
    {
		// --- componentes da tela ---
	    this.fundo = this.add.image(487, 775, 'fundo');
	    const btoVoltar = this.add.image(500, 1300, 'btVoltar', { fill: '#0f0' }).setInteractive().on('pointerdown', () => this.doVoltar() );
	    this.grpCaminhadas = this.add.group();       
	    this.grpEducativo  = this.add.group();
	    //this.cursores = this.input.keyboard.createCursorKeys();

		//--------- INÍCIO DO TRATAMENTO DOS DADOS -------------------------------
		//--- separa os registros de localização por ocorrências de caminhada ----
	   	var dbData        = localStorage.getItem('Data'); // todos os registros de data
		var dbCoor        = localStorage.getItem('Local');
		var arrDBData     = dbData.split('|'); // registros separados por dia
		var arrDBCoor     = dbCoor.split('|');

		var x1        = 1;
	    ponteiro      = 1;
	    qtdCaminhadas = 0;
		do {
			//--- analisa o percurso e calcula tempo, distância e velocidade média ---
    		var datafim      = '';
    		var coorfim      = '';
    		var distancia    = 0;
    		var tempo        = 0; 
    		var velocidade   = 0;
    		var calorias     = 0;
			var x2           = 0;

			var arrData = arrDBData[x1].split(','); // registros individuais de data
			var arrCoor = arrDBCoor[x1].split(','); // registros individuais de localização
  			do {
    			if (arrData[x2] != '' && arrData[x2] != null && arrData[x2] != 'null') {
    				var date1 = new Date(arrData[x2]);
					var date2 = new Date(datafim);
					if (date1.getDate() == date2.getDate() && date1.getMonth() == date2.getMonth() && date1.getYear() == date2.getYear()) { 
	
	    				// --- calcula o tempo entre os registros ---
	    				var t = Math.abs(date1 - date2) / 3600000; // tempo total em horas incluindo os minutos
						if (t < 0) t = t * (-1);
	
						// --- calcula a distância em metros entre os regitros ---
						if (arrCoor[x2].trim() == 'SIMULAR DADOS') {
							// --- Considera o tempo em que o jogo ficou aberto na caminhada e multiplica por 5 ( velocidade média em uma caminhada em k/h )
							var d = (tempo * 5);
						} else {
							// --- Calcula a distância em kilometros ---
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
								
  							}
						}
			
		    			// ----- calcula a velocidade -------
		    			var v = d / t;

						// --- acumula os dados
						tempo = tempo + t; // horas
		    			velocidade = velocidade + v; // k/h
		    			distancia = distancia + d; // quilometros
    				}
    			}

    	 	   	datafim = arrData[x2];
    	 	   	coorfim = arrCoor[x2];
				x2 = x2 + 1;

    		} while (x2 < arrData.length); // cada um dos registros de localização

			if (distancia > 0) {
				arrResultados = [];
				var arrTemp = new Array;
				
				// --- organiza os resultados do último dia ---				
				var horas = parseInt(tempo); // apenas as horas
				var minutos    = Math.round((tempo - parseInt(tempo)) * 60); // apenas os minutos

				distancia = distancia * 1000; // converte para metros
				calorias = ((horas * 60) + minutos) * 5; // calcula o gasto energético
				
				velocidade = parseFloat(velocidade/(x2-1)).toFixed(2);
				
				var arrTemp = [
					date2,
					distancia,
					horas,
					minutos,
					velocidade,
					calorias
				];
				arrResultados.push(arrTemp);

				qtdCaminhadas++; // --- registra esta caminhada no contador
			}
			x1 = x1 + 1;
	
    	} while (x1 < arrDBData.length); // cada uma das caminhadas
    	if (qtdCaminhadas < 1) var Texto1 = this.add.text(250,500,'Comece suas caminhadas\ne veja aqui os resultados',estilo);
	    const btoTras = this.add.image(246, 1150, 'btTras', { fill: '#0f0' })
    	.setInteractive()
	    .on('pointerdown', () => this.moveCaminhadas('-') );
	    const btoFrente = this.add.image(728, 1150, 'btFrente', { fill: '#0f0' })
    	.setInteractive()
	    .on('pointerdown', () => this.moveCaminhadas('+') );
    
    	this.mostraResultados();
    	this.mostraProjecao();
    	this.poeConteudo();
    },
    
    update: function ()
    {
		
    },
    
    mostraResultados: function ()
    {
		// --- variáveis para posicionamento na tela ---
		//var pagina       = 975;
		posImg       = 285;
		posTxt       = 450;
		posPorc      = 420;
		posCoracao   = 285;
		posPulmao    = 485;
		posBalanca   = 685;
		
    	// --- mostra os resultados na tela separados por data, finalizando com as projeções ---
		for (y = 0; y < arrResultados.length; y++ ) {
			var mesAjustado = arrResultados[y][0].getMonth()+1;
			eval('var Destaque' + y + ' = this.add.image(' + posImg + ', 650, "iHealth");');
			eval('var Texto' + y + ' = this.add.text(' + posTxt + ', 450, "Data: ' + arrResultados[y][0].getDate() + '/' + mesAjustado + '/' + arrResultados[y][0].getFullYear() + ' \\n\\nDistância: ' + parseFloat(arrResultados[y][1]).toFixed(2) + ' m\\n\\nTempo: ' + arrResultados[y][2] + ' h ' + arrResultados[y][3] +' m\\n\\nVelocidade: ' + arrResultados[y][4] + ' k/h\\n\\nGasto calórico: ' + arrResultados[y][5] + '", infos);');
			eval('var Coracao' + y + ' = this.add.image(' + posCoracao + ', 950, "coracao");');
			eval('var Pulmao' + y + ' = this.add.image(' + posPulmao + ', 950, "pulmao");');
			eval('var Balanca' + y + ' = this.add.image(' + posBalanca + ', 950, "balanca");');
			
    		eval('this.grpCaminhadas.add(Destaque' + y + ');');
    		eval('this.grpCaminhadas.add(Texto' + y + ');');
    		eval('this.grpCaminhadas.add(Coracao' + y + ');');
    		eval('this.grpCaminhadas.add(Pulmao' + y + ');');
    		eval('this.grpCaminhadas.add(Balanca' + y + ');');

			this.mostraBarra(meta, arrResultados[y][1], posPorc);
			
			// --- ajusta a posição para mostrar os dados da próxima caminhada ---
			posImg     = posImg  - pagina;
			posTxt     = posTxt - pagina;
			posPorc    = posPorc - pagina;
			posCoracao = posCoracao  - pagina;
			posPulmao  = posPulmao  - pagina;
			posBalanca = posBalanca  - pagina;
		}
    },
    
    mostraProjecao: function ()
    {
    	var y = arrResultados.length;

		// --- tira a média ---
		var medDistancia  = 0;
		var medHoras      = 0;
		var medMinutos    = 0;
		var medVelocidade = 0;
		var medCalorias   = 0;
		for (x3 = 0; x3 < arrResultados.length; x3++) {
			medDistancia  = medDistancia + arrResultados[x3][1];
			medHoras      = medHoras + arrResultados[x3][2];
			medMinutos    = medMinutos + arrResultados[x3][3];
			medVelocidade = medVelocidade + arrResultados[x3][4];
			medCalorias   = medCalorias + arrResultados[x3][5];
		}
		
		medDistancia  = (medDistancia / x3) * 3;
		medHoras      = (medHoras / x3) * 3;
		medMinutos    = (medMinutos / x3) * 3;
		medVelocidade = (medVelocidade / x3);
		medCalorias   = (medCalorias / x3) * 3;
	
		eval('var Destaque' + y + ' = this.add.image(1260, 650, "iHealth");');
		eval('var Texto' + y + ' = this.add.text(1425, 450, "Data: daqui 3 meses \\n\\nDistância: ' + parseFloat(medDistancia).toFixed(2) + ' m\\n\\nTempo: ' + medHoras + ' h ' + medMinutos +' m\\n\\nVelocidade: ' + parseFloat(medVelocidade).toFixed(2) + ' k/h\\n\\nGasto calórico: ' + medCalorias + '", infos);');
    	eval('this.grpCaminhadas.add(Destaque' + y + ');');
    	eval('this.grpCaminhadas.add(Texto' + y + ');');

		this.mostraBarra(meta, -1, 1395);
    },
    
    poeConteudo: function ()
    {
		/*
    	//var boxFechar    = this.add.graphics();
    	var boxConteudo1 = this.add.graphics();
    	
    	//boxFechar.fillStyle(0xffffff, 1);
		//boxFechar.fillCirc(120, 150, 740);
	    //const btoFechar = this.add.text(500, 200, 'X', { fill: '#0f0' })
    	//  .setInteractive()
	    //  .on('pointerdown', () => boxConteudo1.visible = false; boxCoracao1.visible = false; boxConteudo1.visible = false; );
    	
    	boxConteudo1.fillStyle(0xffffff, 1);
		boxConteudo1.fillRect(120, 150, 740, 1000);
		eval('var boxCoracao' + qtdCaminhadas + ' = this.add.image(240, 250, "coracao");');
		eval('var boxTitCoracao' + qtdCaminhadas + ' = this.add.text(350, 220,"Saúde Cardíaca", titulo);');
		eval('var boxTxtCoracao' + qtdCaminhadas + ' = this.add.text(180, 350,"As caminhadas que você fez\\naceleraram seu coração aumentando\\no fluxo sanguíneo em seu sistema\\ncirculatório.\\n\\nEntre outros benefícios, isso fortalece\\nseu coração e acelera a troca de\\nnutrientes e de gases entre as células,\\npromovendo maior consumo de\\nenergia, ou seja, emagrecimento\\nsaudável. ", educativo);');
		
		
		boxConteudo1.visible = false;
		boxCoracao1.visible = false;
		boxTitCoracao1.visible = false;
		boxTxtCoracao1.visible = false;		
		
    	var boxConteudo2 = this.add.graphics();
    	
    	boxConteudo2.fillStyle(0xffffff, 1);
		boxConteudo2.fillRect(120, 150, 740, 1000);
		boxConteudo2.visible = false;
		
    	var boxConteudo3 = this.add.graphics();
    	
    	boxConteudo3.fillStyle(0xffffff, 1);
		boxConteudo3.fillRect(120, 150, 740, 1000);
		boxConteudo3.visible = false;*/
    
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
	
    doVoltar: function ()
    {
		this.scene.start('inicio');
    },
    
    /*moveEsquerda: function ()
    {
		this.cursores.left.isDown = false;
		
    },
    
    moveDireita: function ()
    {
		this.cursores.right.isDown = false;
    },*/
    
    moveCaminhadas: function (direcao)
    {
    	if ((ponteiro < qtdCaminhadas && direcao == '-') || (ponteiro == 1 && direcao == '+')) {
	    	if (direcao == '+') ponteiro--;
    		else ponteiro++;
    		var grpMovel = this.grpCaminhadas.getChildren();
	    	for (var i = 0; i < grpMovel.length; i++) {
    			//alert(grpMovel[i].x + ' -> ' +grpMovel[i].text) ;
    			if (direcao == '+') grpMovel[i].x -= pagina;
    			else grpMovel[i].x += pagina;
	  		}
	  	}
	},
	
	mostraBarra: function (meta, distancia, posPorc)
	{
		//--- barra de progressão da caminhada ---
		if (distancia > 0) {
			eval('var progressBox' + qtdCaminhadas + ' = this.add.graphics();');
			var porcentagem = (distancia*100)/meta;
			var compBarra   = (parseInt(porcentagem*330)/100) + 200;
			if (compBarra > 530) compBarra = 530;
	
			eval('progressBox' + qtdCaminhadas + '.fillStyle(0xffffff, 0.8);');
			eval('progressBox' + qtdCaminhadas + '.fillRect(210, 320, compBarra, 50);');
	
			eval('progressBox' + qtdCaminhadas + '.fillStyle(0xcccccc, 0.8);');
			eval('progressBox' + qtdCaminhadas + '.fillRect(200, 310, 550, 70);	');
		}
	
		if (distancia > 0) {
			var txtTopo = '';
			if (porcentagem <= 30) txtTopo = "DÁ PRA MELHORAR!";
			if (porcentagem > 30 && porcentagem <= 60) txtTopo = "JÁ FOI UM COMEÇO!";
			if (porcentagem > 60 && porcentagem < 100) txtTopo = "MUITO BEM, CONTINUE!";
			if (porcentagem == 100) txtTopo = "CONQUISTA DESBLOQUEADA!";
			
			txtTopo = txtTopo + '\\n\\nmeta: ' + meta + ' metros';
			eval('var txtTopo' + qtdCaminhadas + ' = this.add.text(260, 150, "' + txtTopo + '", estilo);');
			eval('var Porcentagem' + qtdCaminhadas + ' = this.add.text(' + posPorc + ',325, parseFloat(' + porcentagem + ').toFixed(2) + "%",{ font: "40px Arial", fill: "#CD5C5C", align: "justify" });');

			eval('this.grpCaminhadas.add(progressBox' + qtdCaminhadas + ');');
			eval('this.grpCaminhadas.add(txtTopo' + qtdCaminhadas + ');');
			eval('this.grpCaminhadas.add(Porcentagem' + qtdCaminhadas + ');');
		} else {
			eval('var txtTopo' + qtdCaminhadas + ' = this.add.text(1200, 150, "PROJEÇÃO PARA 3 MESES!", estilo);');
			eval('this.grpCaminhadas.add(txtTopo' + qtdCaminhadas + ');');
		}
	}
	
});
