
var Inicio = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Inicio ()
    {
		Phaser.Scene.call(this, {
			key: 'inicio'
			/*, pack: {
				files: [
					{ type: 'image', key: 'fundo', url: 'assets/background.jpg' },
					{ type: 'image', key: 'btoIniciar', url: 'assets/bto_iniciar.png' }
				]
			}*/
		});
    },

    preload: function ()
    {
		this.load.image('fundo', 'img/background.jpg');
		this.load.image('btCaminhar', 'img/bto_caminhar.png');
		this.load.image('btResultados', 'img/bto_resultados.png');
    },

    create: function ()
    {

	    this.fundo = this.add.image(487, 775, 'fundo');

	    const btoCaminhar = this.add.image(500, 400, 'btCaminhar', { fill: '#0f0' })
    	  .setInteractive()
	      .on('pointerdown', () => this.doCaminhada() );


	    const btoResultados = this.add.image(500, 800, 'btResultados', { fill: '#0f0' })
    	  .setInteractive()
	      .on('pointerdown', () => this.doResultados() );

	},

    doCaminhada: function ()
    {
		this.scene.start('jogo');
    },
	
	doResultados: function ()
    {
		this.scene.start('resultados');
    }

});
