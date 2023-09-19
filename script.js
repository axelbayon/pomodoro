document.addEventListener('DOMContentLoaded', function() {
    // Récupération des éléments du DOM
    const affichageMinuteur = document.getElementById('minuteur');
    const boutonLancer = document.getElementById('boutonLancer');
    const boutonSauvegarder = document.getElementById('boutonSauvegarder');
    const travailBox = document.getElementById('travailBox');
    const pauseBox = document.getElementById('pauseBox');
    const parametres_minuteurs = document.getElementById('parametres_minuteur');
    const saisir_duree_travail = document.getElementById('duree_travail');
    const saisir_duree_pause = document.getElementById('duree_pause');
    const main = document.querySelector('main');
  
    function desactivationSaisieDonnees() {
      // Fonction permettant la désactivation de la saisie des durées
        saisir_duree_travail.disabled = true;
        saisir_duree_pause.disabled = true;
    }
  
    function activationSaisieDonnees() {
      // Fonction permettant l'activation de la saisie des durées
        saisir_duree_travail.disabled = false;
        saisir_duree_pause.disabled = false;
    }
  
    function recuperationValeursStockees() {
      // Fonction permettant de récupérer les valeurs stockées dans le localStorage
        const duree_travail_stockee = localStorage.getItem('duree_travail');
        const duree_pause_stockee = localStorage.getItem('duree_pause');
  
        if (duree_travail_stockee) {
            saisir_duree_travail.value = duree_travail_stockee;
        }
        if (duree_pause_stockee) {
            saisir_duree_pause.value = duree_pause_stockee;
        }
    }
  
    function enregistrerSurStockageLocal() {
      // Fonction permettant d'enregistrer les valeurs stockées des durées dans le localStorage
        localStorage.setItem('duree_travail', saisir_duree_travail.value);
        localStorage.setItem('duree_pause', saisir_duree_pause.value);
    }
  
    let timer;
    let duree_travail = parseInt(localStorage.getItem('duree_travail')) * 60 || 25 * 60;
    let duree_pause = parseInt(localStorage.getItem('duree_pause')) * 60 || 5 * 60;
    let minuteur_active = true;
  
    function majAffichageMinuteur() {
      // Fonction permettant de mettre à jour l'affichage du minuteur
        const minutes = Math.floor((minuteur_active ? duree_travail : duree_pause) / 60).toString().padStart(2, '0');
        const secondes = ((minuteur_active ? duree_travail : duree_pause) % 60).toString().padStart(2, '0');
        
        affichageMinuteur.innerHTML = `<span style="font-size: 2em; font-weight: bold">${minutes}:${secondes}</span>`;
        clignotementMinuteur();
    }
  
    function activerCouleurTravail() {
      // Fonction permettant d'afficher la couleur de la période de travail lorsqu'elle est en cours
        travailBox.style.backgroundColor = '#ff0000';
        main.style.backgroundColor = '#fd6565';
    }
  
    function activerCouleurPause() {
      // Fonction permettant d'afficher la couleur de la période de pause lorsqu'elle est en cours
        pauseBox.style.backgroundColor = '#237018';
        main.style.backgroundColor = '#3D8E33';
    }
  
    function desactiverCouleurs() {
      // Fonction permettant de désactiver l'affichage de couleurs lorsqu'aucune période est en cours
        travailBox.style.backgroundColor = 'white';
        pauseBox.style.backgroundColor = 'white';
        main.style.backgroundColor = 'white';
    }
  
    function demarrerMinuteur() {
      // Fonction permettant de lancer le minuteur
        if (!timer) {
            timer = setInterval(function() {
  
                if (minuteur_active) {
                    duree_travail--;
                } 
                else {
                    duree_pause--;
                }
  
                majAffichageMinuteur();
  
                if (duree_travail <= 0 && minuteur_active) { // Vérifie si la période actuelle est terminée
                    // Passer à la période de pause
                    minuteur_active = false;
                    duree_pause = parseInt(saisir_duree_pause.value) * 60 || 5 * 60;
  
                    // Mettre à jour l'interface utilisateur
                    travailBox.classList.remove('active');
                    desactiverCouleurs();
                    activerCouleurPause();
                    pauseBox.classList.add('active');
                } 
                else if (duree_pause <= 0 && !minuteur_active) {
                    // Passer à la période de travail
                    minuteur_active = true;
                    duree_travail = parseInt(saisir_duree_travail.value) * 60 || 25 * 60;
  
                    // Mettre à jour l'interface utilisateur
                    pauseBox.classList.remove('active');
                    travailBox.classList.add('active');
                    desactiverCouleurs();
                    activerCouleurTravail();
                }
  
            }, 1000);
  
            boutonLancer.textContent = 'Réinitialiser le minuteur';
  
            boutonLancer.removeEventListener('click', demarrerMinuteur);
            boutonLancer.addEventListener('click', reinitialiserMinuteur);
  
            boutonSauvegarder.disabled = true;
            desactivationSaisieDonnees();
  
            if (minuteur_active) {
                activerCouleurTravail();
            } 
            else {
                activerCouleurPause();
            }
        }
    }
  
    function reinitialiserMinuteur() {
      // Fonction permettant de réinitialiser le minuteur
  
      // Arrête le minuteur et réinitialise les variables
        clearInterval(timer);
        timer = null;
        minuteur_active = true;
        duree_travail = parseInt(saisir_duree_travail.value) * 60 || 25 * 60;
        duree_pause = parseInt(saisir_duree_pause.value) * 60 || 5 * 60;
  
        // Mettre à jour l'interface utilisateur
        travailBox.classList.add('active');
        pauseBox.classList.remove('active');
        majAffichageMinuteur();
  
        // Rétabli le bouton de démarrage du minuteur
        boutonLancer.textContent = 'Démarrer le minuteur';
        boutonLancer.removeEventListener('click', reinitialiserMinuteur);
        boutonLancer.addEventListener('click', demarrerMinuteur);
  
        boutonSauvegarder.disabled = false;
        activationSaisieDonnees();
  
        desactiverCouleurs();
        enregistrerSurStockageLocal();
    }
  
    function clignotementMinuteur() {
      // Fonction permettant de gérer le clignotement du minuteur
        if (minuteur_active && duree_travail <= 30) {
            affichageMinuteur.classList.add('clignotement');
        } 
        else if (!minuteur_active && duree_pause <= 30) {
            affichageMinuteur.classList.add('clignotement');
        } 
        else {
            affichageMinuteur.classList.remove('clignotement');
        }
    }
  
    parametres_minuteurs.addEventListener('submit', function(e) {
      // Soumission du formulaire
        e.preventDefault();
        reinitialiserMinuteur();
    });
  
    desactiverCouleurs();
    boutonLancer.addEventListener('click', demarrerMinuteur);
    majAffichageMinuteur();
    recuperationValeursStockees();
  });
  