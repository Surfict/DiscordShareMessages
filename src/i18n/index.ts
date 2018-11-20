export const translation = {
  fromBot: {
    help:
      "!help : Liste des différentes commandes \n!infos : Liste les informations du bot sur ce serveur (liste des discords associés, activation du here) \n!discords : Liste des discords associés \n!here : Etat d'activation du here\n!partenaires : Liste de tous les discords associés au scanner des 4\n!rappel: Message de rappel non transmis aux autres  sur les règles à suivre dans le channel des 100.\n!nofollow ou !n: Cette commande permet de poster dans un channel de 100 sans que le message sois transmis ailleurs.\n\n",
    helpAdmin:
      "*****Administration*****\n\n!hereLocalActivé: Permet d'activer ou de désactiver le here automatique quand un utilisateur de votre discord poste un message sur le channel des 100. Prends la valeur true ou false, par exemple : !hereLocalActivé true.\n\n!hereGlobalActivé: Permet d'activer un here automatique pour les messages venant d'un autre discord sur votre channel. Prends la valeur true ou false, par exemple : !hereGlobalActivé true\n\n!updateChannel100: permet de changer votre channel de 100. Prend comme valeur le nouvel ID de votre channel de 100, par exemple : !updateChannel100 507150227556532236\n\n!messagesExterieurs: Permet d'activer la réception sur votre channel de 100 des messages venant des autres discords. Prend la valeur true ou false, par exemple : !messagesExterieurs: true\n\n!ajouterDiscordPartenaire: permet d'ajouter un discord dont vous voulez recevoir les notifications. Prends comme valeur le nom (et pas l'id) du discord dont vous voulez recevoir les notifications. Pour avoir la liste des discords gérés par le bot, tappez !partenaires. Vous pouvez ajouter tous les discords disponibles dans cette liste. Exemple : !ajouterDiscordPartenaire Discord du 15\n\n!enleverDiscordPartenaire: permet d'enlever un discord pour lequel vous recevez actuellement les notifications. La valeur prends le nom du discord (et non pas l'id). Pour avoir la liste des discords dont vous recevez actuellement les notifications, tappez !discords. Exemple: !enleverDiscordPartenaire Discord du 15\n",
    rappel:
      "Pour rappel, tous les messages postés dans cette channel sont communiqués à d'autres discord. Merci donc de ne pas flooder et de poster des messages relatifs à des pops de 100 %.",
    nouveau100: "@here : Nouveau 100 détecté !",
    commandeIntrouvable:
      "Commande inconnue. Pour la liste des commandes, tapez !help"
  }
};
