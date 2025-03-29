// chargement des librairies
import Phaser from "phaser";

/***********************************************************************/
/** CONFIGURATION GLOBALE DU JEU ET LANCEMENT 
/***********************************************************************/

// configuration générale du jeu
var config = {
  type: Phaser.AUTO,
  width: 800, // largeur en pixels
  height: 600, // hauteur en pixels
  physics: {
    // définition des parametres physiques
    default: "arcade", // mode arcade : le plus simple : des rectangles pour gérer les collisions. Pas de pentes
    arcade: {
      // parametres du mode arcade
      gravity: {
        y: 300 // gravité verticale : acceleration ddes corps en pixels par seconde
      },
      debug: true // permet de voir les hitbox et les vecteurs d'acceleration quand mis à true
    }
  },
  scene: {
    // une scene est un écran de jeu. Pour fonctionner il lui faut 3 fonctions  : create, preload, update
    preload: preload, // la phase preload est associée à la fonction preload, du meme nom (on aurait pu avoir un autre nom)
    create: create, // la phase create est associée à la fonction create, du meme nom (on aurait pu avoir un autre nom)
    update: update // la phase update est associée à la fonction update, du meme nom (on aurait pu avoir un autre nom)
  }
};

// création et lancement du jeu
new Phaser.Game(config);

/***********************************************************************/
/** VARIABLES GLOBALES 
/***********************************************************************/

var player; // désigne le sprite du joueur
var groupe_plateformes; // contient toutes les plateformes
var clavier; // pour la gestion du clavier

/***********************************************************************/
/** FONCTION PRELOAD 
/***********************************************************************/

/** La fonction preload est appelée une et une seule fois,
 * lors du chargement de la scene dans le jeu.
 * On y trouve surtout le chargement des assets (images, son ..)
 */
function preload() {
  // tous les assets du jeu sont placés dans le sous-répertoire src/assets/
  this.load.image("img_ciel", "src/assets/sky.png");
  this.load.image("img_plateforme", "src/assets/platform.png");
  this.load.spritesheet("img_perso", "src/assets/dude.png", {
    frameWidth: 32,
    frameHeight: 48
  });
}

/***********************************************************************/
/** FONCTION CREATE 
/***********************************************************************/

/* La fonction create est appelée lors du lancement de la scene
 * si on relance la scene, elle sera appelée a nouveau
 * on y trouve toutes les instructions permettant de créer la scene
 * placement des peronnages, des sprites, des platesformes, création des animations
 * ainsi que toutes les instructions permettant de planifier des evenements
 */
function create() {
  /*************************************
   *  CREATION DU MONDE + PLATEFORMES  *
   *************************************/

  // On ajoute une simple image de fond, le ciel, au centre de la zone affichée (400, 300)
  // Par défaut le point d'ancrage d'une image est le centre de cette derniere
  this.add.image(400, 300, "img_ciel");

  // la création d'un groupes permet de gérer simultanément les éléments d'une meme famille
  //  Le groupe groupe_plateformes contiendra le sol et deux platesformes sur lesquelles sauter
  // notez le mot clé "staticGroup" : le static indique que ces élements sont fixes : pas de gravite,
  // ni de possibilité de les pousser.
  groupe_plateformes = this.physics.add.staticGroup();
  // une fois le groupe créé, on va créer les platesformes , le sol, et les ajouter au groupe groupe_plateformes

  // l'image img_plateforme fait 400x32. On en met 2 à coté pour faire le sol
  // la méthode create permet de créer et d'ajouter automatiquement des objets à un groupe
  // on précise 2 parametres : chaque coordonnées et la texture de l'objet, et "voila!"
  groupe_plateformes.create(200, 584, "img_plateforme");
  groupe_plateformes.create(600, 584, "img_plateforme");

  //  on ajoute 3 platesformes flottantes
  groupe_plateformes.create(600, 450, "img_plateforme");
  groupe_plateformes.create(50, 300, "img_plateforme");
  groupe_plateformes.create(750, 270, "img_plateforme");

  /****************************
   *  CREATION DU PERSONNAGE  *
   ****************************/

  // On créée un nouveeau personnage : player
  player = this.physics.add.sprite(100, 450, "img_perso");

  //  propriétées physiqyes de l'objet player :
  player.setBounce(0.2); // on donne un petit coefficient de rebond
  player.setCollideWorldBounds(true); // le player se cognera contre les bords du monde

  /***************************
   *  CREATION DES ANIMATIONS *
   ****************************/
  // dans cette partie, on crée les animations, à partir des spritesheet
  // chaque animation est une succession de frame à vitesse de défilement défini
  // une animation doit avoir un nom. Quand on voudra la jouer sur un sprite, on utilisera la méthode play()
  // creation de l'animation "anim_tourne_gauche" qui sera jouée sur le player lorsque ce dernier tourne à gauche
  this.anims.create({
    key: "anim_tourne_gauche", // key est le nom de l'animation : doit etre unique poru la scene.
    frames: this.anims.generateFrameNumbers("img_perso", { start: 0, end: 3 }), // on prend toutes les frames de img perso numerotées de 0 à 3
    frameRate: 10, // vitesse de défilement des frames
    repeat: -1 // nombre de répétitions de l'animation. -1 = infini
  });

  // creation de l'animation "anim_tourne_face" qui sera jouée sur le player lorsque ce dernier n'avance pas.
  this.anims.create({
    key: "anim_face",
    frames: [{ key: "img_perso", frame: 4 }],
    frameRate: 20
  });

  // creation de l'animation "anim_tourne_droite" qui sera jouée sur le player lorsque ce dernier tourne à droite
  this.anims.create({
    key: "anim_tourne_droite",
    frames: this.anims.generateFrameNumbers("img_perso", { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  });

  /***********************
   *  CREATION DU CLAVIER *
   ************************/
  // ceci permet de creer un clavier et de mapper des touches, connaitre l'état des touches
  clavier = this.input.keyboard.createCursorKeys();

  /*****************************************************
   *  GESTION DES INTERATIONS ENTRE  GROUPES ET ELEMENTS *
   ******************************************************/

  //  Collide the player and the groupe_etoiles with the groupe_plateformes
  this.physics.add.collider(player, groupe_plateformes);
}

/***********************************************************************/
/** FONCTION UPDATE 
/***********************************************************************/

function update() {
  if (clavier.left.isDown) {
    player.setVelocityX(-160);
    player.anims.play("anim_tourne_gauche", true);
  } else if (clavier.right.isDown) {
    player.setVelocityX(160);
    player.anims.play("anim_tourne_droite", true);
  } else {
    player.setVelocityX(0);
    player.anims.play("anim_face");
  }

  if (clavier.up.isDown && player.body.touching.down) {
    player.setVelocityY(-330);
  }
}
