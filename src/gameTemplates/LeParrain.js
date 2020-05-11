import GameTemplate from './gameTemplate';
import { GameObject } from '../gameElements/gameObject';
import { Place } from '../gameElements/place';
import { Role } from '../gameElements/role';
import { Player } from '../gameElements/player';
import { Mission } from '../gameElements/modules/mission';
import { Action } from '../gameElements/action';

const currentGame = new GameTemplate('basicMurder');

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// Objects
// El Sampico
const PoemeAmour = {
  name: 'Poème d\'amour',
  description: 'Un long poème dans lequel El Sampico a mis son don pour l’écriture au service de sa plume afin d’y déverser toute l’intensité de son amour pour Carla, la femme du boss.',
  clue: true,
};
const NoteHotel = {
  name: 'Note de l\'hôtel',
  description: 'Une note de l’hôtel où il a passé la nuit avec Carla le soir du meurtre. Elle aurait été l’alibi parfait si elle ne révélait pas en même temps sa relation secrète et incriminante avec sa dulcinée.',
  clue: true,
};
const PaquetCigarettes1 = {
  name: 'Paquet de cigarettes',
  description: 'Un paquet presque vide de cigarettes italiennes sans filtre au goût amer. El Sampico ne sait pas quoi faire de ses mains tant qu’elles ne sont pas occupées à tenir une clope. ',
  clue: false,
};
const FlasqueTequila = {
  name: 'Flasque de Tequila',
  description: 'Un petit remontant pour se donner du courage.',
  clue: false,
};
const Flingue1 = {
  name: 'Flingue',
  description: 'Pour El Sampico, cette arme est une extension de sa volonté.',
  clue: false,
};
const SouFetiche = {
  name: 'Sou fétiche',
  description: 'Un peso brillant lui rappelant sa terre natale, le Mexique.',
  clue: false,
};
const basicObjectsSampico = [PoemeAmour, NoteHotel, PaquetCigarettes1, FlasqueTequila, Flingue1,
  SouFetiche];
// Petro Francesco
const PaquetCigarettes2 = {
  name: 'Paquet de cigarettes',
  description: 'Déjà à moitié vide en début de soirée, de la marque italienne Fortuna.',
  clue: false,
};
const Briquet = {
  name: 'Briquet',
  descritpion: 'Un vieux briquet en acier noir, lourdement usé par l’utilisation quotidienne de son propriétaire.',
  clue: false,
};
const LunettesSoleil = {
  name: 'Paire de lunettes de soleil de rechange',
  description: 'Une paire de lunettes rondes et sombres',
  clue: false,
};
const BlocNote = {
  name: 'Bloc-note',
  description: 'Un bloc notes avec plein de notes griffonnées incompréhensibles, à part pour les noms de toutes les personnes de la soirée !',
  clue: false,
};
const Menottes = {
  name: 'Paire de menottes',
  description: 'Une simple paire de menottes',
  clue: true,
};
const basicObjectsFrancesco = [PaquetCigarettes2, Briquet, LunettesSoleil, BlocNote, Menottes];
// Vito Falcaninio
const LettreParrain = {
  name: 'La lettre du parrain',
  description: 'Cette lettre signée du parrain exprime ses doutes sur son entourage direct. C’est elle qui pousse Vito a réunir tout ce beau monde ce soir',
  clue: true,
};
const Cigare = {
  name: 'Un cigare allumé',
  description: '“Jamais sans mon cubain. J’en ai besoin pour réfléchir, et réfléchir je fais que ça.”',
  clue: false,
};
const Flingue2 = {
  name: 'Flingue',
  description: 'Comme le couteau du boucher ou la plume de l’écrivain : l’outil de travail.',
  clue: false,
};
const basicObjectsFalcaninio = [LettreParrain, Cigare, Flingue2];
// Tommaso-Giorgio
const Addition = {
  name: 'Addition de restaurant',
  description: 'Ce petit bout de papier indique que Tomasso était au restaurant au moment où le parrain a été assassiné. D’après le prix et le menu, il semble qu’il y soit allé tout seul.',
  clue: true,
};
const MontreGousset = {
  name: 'Montre à gousset',
  description: 'Une jolie montre gravée qui vaut sûrement une fortune.',
  clue: false,
};
const Chevaliere = {
  name: 'Une chevalière en argent',
  description: 'Une imposante bague en argent sous la forme d’un serpent qui se mord la queue.',
  clue: false,
};
const basicObjectsTommaso = [Addition, MontreGousset, Chevaliere];
// Carla Gurzio
const Photographie = {
  name: 'Photographie de El Sampico',
  description: 'Dans le portefeuille de Carla se trouve une magnifique photographie noir et blanc du tueur à gages Mexicain. Sa moustache foisonnante rayonne de par son sourire chaleureux. La photographie semble usée par le temps mais reste malgré tout en bon état.',
  clue: true,
};
const FlasqueParfum = {
  name: 'Flasque de parfum',
  description: 'Une petite fiole de parfum à la rose de couleur vive.',
  clue: 'false',
};
const Peigne = {
  name: 'Peigne en or',
  description: 'Magnifique pièce en or gravé en forme de petit peigne. Semble avoir été utilisé à de nombreuse reprise.',
  clue: 'false',
};
const Carnet = {
  name: 'Carnet',
  description: 'Un carnet de note à la couverture en cuir de crocodile et coloré rouge vif. Il est presque vide et on peut y lire quelques date importante et rendez-vous sans grand intérêt avec des personnalités qui ne vous disent rien… On y trouve aussi quelques numéros de téléphone.',
  clue: false,
};
const basicObjectsCarla = [Photographie, FlasqueParfum, Peigne, Carnet];
// Sebastiano Pechetto
const RapportMorgue = {
  name: 'Rapport de la morgue',
  description: 'Ce rapport indique que la parrain a été empoisonné.',
  clue: true,
};
const GantsLatex = {
  name: 'Une paire de gants en latex',
  description: 'Une vieille paire de gants tachés.',
  clue: false,
};
const Cocaine = {
  name: 'Cocaïne',
  description: 'Une petit sachet transparent de 2 grammes de cocaïne. De quoi se donner un bon  coup de fouet.',
  clue: false,
};
const basicObjectsSebastiano = [RapportMorgue, GantsLatex, Cocaine];

// Places
const ChambreParrain = {
  name: 'La chambre du parrain',
  description: '',
  objects: [],
};
const Labo = {
  name: 'Le laboratoire du chimiste',
  description: '',
  objects: [],
};
const Piece = {
  name: 'La pièce d\'à côté',
  description: '',
  objects: [],
};

// Actions
/**
 * 
 * @param {*} _ 
 * @param {*} place prend en argument l'objet Place qui correspond à la pièce voulant être fouillée
 */
const fouillerPiece = (_, place) => {
  const a = getRandomInt(2);
  let object;
  let findableObjects;
  if (a == 0 && place.getClues.length > 0) {
    findableObjects = place.getClues();
    object = findableObjects[Math.floor(Math.random() * findableObjects.length)];
    const index = place.objects.indexOf(object);
    place.objects.splice(index, 1);
  } else if (place.getNotClues.length > 0) {
    findableObjects = place.getNotClues();
    object = findableObjects[Math.floor(Math.random() * findableObjects.length)];
    const index = place.objects.indexOf(object);
    place.objects.splice(index, 1);
  } else {
    object = null;
  }
  return object;
};
const pickpocket = (_, others) => {
  if (others[0].protected == true) {
    others[0].setProtected(false);
  } else {
    const a = getRandomInt(3);
    if (a == 0) {
      // TODO
    }
    if (a == 1) {
      // TODO
    }
    if (a == 2) {
      others[0].announce('Someone tried to steal you');
    }
  }
};
const espionnage = (_, others) => {
  if (others[0].protected == true) {
    others[0].setProtected(false);
  } else {
    others[0].setSpied(true);
    others[0].announce('You have been killed');
  }
};
const potins = (_, others) => {
  if (others[0].protected == true) {
    others[0].setProtected(false);
  } else {
    const a = getRandomInt(2);
    if (a == 0) {
      switch (others[0]) {
        case '':
          break;
        default:
          break;
      }
    } else {
      switch (others) {
        case '':
          break;
        default:
          break;
      }
    }
  }
};
const refroidir = (_, others) => {
  if (others[0].protected == true) {
    others[0].setProtected(false);
  } else {
    others[0].setAlive(false);
    others[0].announce('You have been killed');
  }
};
const empoisonner = (_, others) => {
  if (others[0].protected == true) {
    others[0].setProtected(false);
  } else {
    others[0].setAlive(false);
    others[0].announce('You have been killed');
  }
};
const seProteger = (you) => {
  you.setProtected(true);
  you.announce('You are protected');
};

// Missions
const missionVito = new Mission(
  'Objectif de Vito Falcaninio',
  currentGame.addAction('Tuer', fouillerPiece, false, 1),
  'Il voit la mort du parrain comme l’opportunité qu’il attendait depuis trop longtemps. Son objectif est le même que celui de Tomasso, son plus grand rival : hériter de la fortune et du pouvoir de son défunt patron.',
);
const missionCarla = new Mission(
  'Objectif de Carla Gurzio',
  currentGame.addAction('Tuer', fouillerPiece, false, 1),
  '20 ans plus jeune que son défunt mari, Carla joue bien la comédie en prétendant être dévastée et furieuse par l’événement tragique. Son réel objectif est de ressortir de cette affaire avec les poches les plus pleines possible. Son amour secret pour le fameux tueur à gage El Sampico la pousse à vouloir le placer comme nouveau parrain. Entre quête de pouvoir et amour coupable, Carla cherche à faire accuser n’importe qui du moment qu’elle et son bien aimé en sortent gagnants ! Malgré tout ça, elle n’a rien à voir dans l’assassinat de son mari et n’est au courant de rien...',
);
const missionPetro = new Mission(
  'Objectif de Petro Francesco',
  currentGame.addAction('Tuer', fouillerPiece, false, 1),
  'Il est devenu un ami proche de Tomasso Giorgio au fil des années dans l’objectif de pouvoir garder un oeil sur toutes les activités de la mafia. Don Giorgio commença peu à peu à avoir des doutes sur lui, et le meurtre lui permettra de placer Tomasso Giorgio au pouvoir et de finir de démanteler tout le réseau grâce à toutes les nouvelles informations qu’il pourra obtenir avec la confiance que le nouveau chef aura en lui… C’est lui qui, en suivant le plan machiavélique de Tomasso, a empoisonné la soupe du parrain en utilisant une des drogues volée dans le laboratoire la veille. Il a caché le flacon restant dans le tiroir de la table de chevet de Carla pour la faire accuser. L’argent n’a que peu d\'intérêt à ses yeux, seul le bon déroulement du plan compte et pour cela Tomasso doit devenir le nouveau chef et (bien évidemment) ne pas se faire découvrir.',
);
const missionSebastiano = new Mission(
  'Objectif de Sebastiano Pechetto',
  currentGame.addAction('Tuer', fouillerPiece, false, 1),
  'Sauver sa peau ! Il n’a pas tué le parrain, mais il sait que c’est l’un des produits de son laboratoire qui a servi à l’empoisonner. Il ne sait pas qui a pu lui subtiliser cet ingrédient.',
);
const missionTommaso = new Mission(
  'Objectif de Tommaso Giorgio',
  currentGame.addAction('Tuer', fouillerPiece, false, 1),
  'L’objectif de Tommaso est simple : prendre la place de son défunt père. L’héritage se faisait trop attendre, Tomasso a préféré accélérer les choses en demandant à son acolyte Petro Francesco de tuer son père et de cacher l’arme du crime.',
);
const missionSampico = new Mission(
  'Objectif de El Sampico',
  currentGame.addAction('Tuer', fouillerPiece, false, 1),
  'La mort du parrain s’annonce pour El Sampico comme une double opportunité : la place du boss est libre et sa femme est enfin seule ! Éperdument amoureux de Carla Gurzio, il va lui déclarer sa flamme pendant la soirée à l’aide d’un poème. Il ne sait pas si Carla est impliqué dans la mort de son mari, mais la protège à tout prix si elle vient à être l’objet de suspicions. Sachant que sa relation avec la veuve pourrait le rendre suspect du crime, il saura rester discret.',
);

// Create roles in the game
currentGame.addRole('Vito Falcaninio', 'le bras droit', missionVito, basicObjectsFalcaninio);
currentGame.addRole('Carla Gurzio', 'la femme du parrain', missionCarla, basicObjectsCarla);
currentGame.addRole('Petro Francesco', 'l\'infiltré de la police locale', missionPetro, basicObjectsFrancesco);
currentGame.addRole('Sebastiano Pechetto', 'dit le “Chimiste”, responsable des labos de synthèse de drogue', missionSebastiano, basicObjectsSebastiano);
currentGame.addRole('Tommaso-Giorgio', 'fils du parrain', missionTommaso, basicObjectsTommaso);
currentGame.addRole('"El Sampico"', 'le meilleur tueur à gage', missionSampico, basicObjectsSampico);

export default currentGame;
