var estilo     = { font: "40px Arial", fill: "#fff", align: "center" };
var longitude  = 0;
var latitude   = 0;
var local;
var msg;
var timer = 300;

var Jogo = new Phaser.Class({

	Extends: Phaser.Scene,

	initialize:

	function Jogo()
	{
		// note: the pack:{files[]} acts like a pre-preloader
		// this eliminates the need for an extra "boot" scene just to preload the loadingbar images
		Phaser.Scene.call(this, {
			key: 'jogo'
			//pack: {
			//	files: [
			//		{ type: 'image', key: 'loadingbar_bg', url: 'img/loadingbar_bg.png' },
			//		{ type: 'image', key: 'loadingbar_fill', url: 'img/loadingbar_fill.png' }
			//	]
			//}
		});
	},

    preload: function ()
    {
		this.load.image('fundo', 'img/background.jpg');
		this.load.image('btEncerrar', 'img/bto_encerrar.png');
		this.load.image('paisagem', 'img/3840.jpg');
    },

    create: function ()
    {
	    this.fundo = this.add.image(487, 775, 'fundo');
	    this.paisagem = this.add.image(490, 650, 'paisagem');
	    this.btoEncerrar = this.add.image(500, 400, 'btEncerrar', { fill: '#0f0' })
    	  .setInteractive()
	      .on('pointerdown', () => this.doVoltar() );

		local = this.add.text(300,1250,local,estilo);
		msg   = this.add.text(200,950,local,estilo);
		msg.setText('Inicie sua caminhada!\n\nNão esqueça de apertar o botão\n\nEncerrar quando terminar.');
		
		this.verificaPermissao();
        //this.limpaDados();
		this.registraInicio();
		//this.insereTeste();

    },

    update: function ()
    {
    	if (timer >= 250) {
    		timer = 0;
			mudouPosicao = navigator.geolocation.watchPosition(this.mostraLocalizacao, this.simulaLocalizacao);
    	} else timer++;
    },
    
    handleOrientation: function (e) {
		// Device Orientation API
		var x = e.gamma; // range [-90,90], left-right
		var y = e.beta;  // range [-180,180], top-bottom
		var z = e.alpha; // range [0,360], up-down
	},
	
    verificaPermissao: function() {
        if (navigator.permissions) {
            navigator.permissions.query({name:'geolocation'}).then(result => {
               if (result.state != 'granted') {
                  navigator.geolocation.getCurrentPosition();
               } 
         });
       } else alert('O seu navegador não oferece geolocalização');
    },
    
    mostraLocalizacao: function (position) {
    	latitude  = position.coords.latitude;
    	longitude = position.coords.longitude;
    	local.setText('la: ' + latitude + '\nlo: ' + longitude + ', ');

    	var data = localStorage.getItem('Data');
		if (data == null) data = '';
		var hoje = new Date();       	
    	localStorage.setItem('Data', data + ', ' + hoje);
    	
    	data = localStorage.getItem('Local');
		if (data == null) data = '';
    	localStorage.setItem('Local', data + 'la: ' + latitude + ' lo: ' + longitude + ', ');    	
    },

    simulaLocalizacao: function (error) {
    	local.setText(error.message + '\nsimulando localização');
    	
    	var data = localStorage.getItem('Data');
		if (data == null) data = '';
		var hoje = new Date();       	
    	localStorage.setItem('Data', data + hoje + ', ');
    	
    	data = localStorage.getItem('Local');
		if (data == null) data = '';
    	localStorage.setItem('Local', data + 'SIMULAR DADOS, ');
   	},
    
	registraInicio: function () {
    	var marca = localStorage.getItem('Data');
	    localStorage.setItem('Data', marca + '| ');
	    marca = localStorage.getItem('Local');
	    localStorage.setItem('Local', marca + '| ');
    },

	limpaDados: function () {
    	var strNome = '';
    	do {
    		strNome = localStorage.key(0);
    		localStorage.removeItem(strNome);
    	} while (localStorage.length > 0);
		localStorage.setItem('MetaDeHoje', '200'); //--- precisa ser criado uma scena individual para a definição de metas
	},
	
    doVoltar: function ()
    {
		this.scene.start('inicio');
    },
	
	insereTeste: function () {
		// --- insere dados de teste ---
    	localStorage.setItem('Data', '200|Thu May 16 2019 13:05:39 GMT-0300 (Horário Padrão de Brasília), Thu May 16 2019 13:07:41 GMT-0300 (Horário Padrão de Brasília), Thu May 16 2019 13:08:00 GMT-0300 (Horário Padrão de Brasília)');
    	localStorage.setItem('Local', '|la: -23.580767 lo: -46.774423, la: -23.581152 lo: -46.773000, la: -23.580916 lo: -46.772764');
    	//-------------------------------
    	//alert(localStorage.getItem('Data'));

	}
});
