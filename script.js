document.addEventListener('DOMContentLoaded', function() {
    const affichageMinuteur = document.getElementById('minuteur');
    const boutonLancer = document.getElementById('boutonLancer');
    const boutonSauvegarder = document.getElementById('boutonSauvegarder');
    const travailBox = document.getElementById('travailBox');
    const pauseBox = document.getElementById('pauseBox');
    const parametres_minuteurs = document.getElementById('parametres_minuteur');
    const saisir_duree_travail = document.getElementById('duree_travail');
    const saisir_duree_pause = document.getElementById('duree_pause');
  
    function desactivationSaisieDonnees() {
          saisir_duree_travail.disabled = true;
          saisir_duree_pause.disabled = true;
      }
    
      function activationSaisieDonnees() {
          saisir_duree_travail.disabled = false;
          saisir_duree_pause.disabled = false;
      }
    
      function recuperationValeursStockees() {
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
          localStorage.setItem('duree_travail', saisir_duree_travail.value);
          localStorage.setItem('duree_pause', saisir_duree_pause.value);
      }
  

    let timer;
    let duree_travail = parseInt(localStorage.getItem('duree_travail')) * 60 || 25 * 60;
    let duree_pause = parseInt(localStorage.getItem('duree_pause')) * 60 || 5 * 60;
    let minuteur_active = true;

    function majAffichageMinuteur() {
        const minutes = Math.floor((minuteur_active ? duree_travail : duree_pause) / 60).toString().padStart(2, '0');
        const secondes = ((minuteur_active ? duree_travail : duree_pause) % 60).toString().padStart(2, '0');
        affichageMinuteur.innerHTML = `<span style="font-size: 2em; font-weight: bold">${minutes}:${secondes}</span>`;
    }
  
    // Fonction pour démarrer le minuteur
    function demarrerMinuteur() {
        if (!timer) {
            timer = setInterval(function() {
                if (minuteur_active) {
                    duree_travail--;
                } 
                else {
                    duree_pause--;
                }  
                majAffichageMinuteur();
                if (duree_travail <= 0 && minuteur_active) {
                    minuteur_active = false;
                    duree_pause = parseInt(saisir_duree_pause.value) * 60 || 5 * 60;
                    travailBox.classList.remove('active');
                    pauseBox.classList.add('active');
                } else if (duree_pause <= 0 && !minuteur_active) {
                    minuteur_active = true;
                    duree_travail = parseInt(saisir_duree_travail.value) * 60 || 25 * 60;
                    pauseBox.classList.remove('active');
                    travailBox.classList.add('active');
                }
            }, 1000);
        boutonLancer.textContent = 'Réinitialiser le minuteur';
        boutonLancer.removeEventListener('click', demarrerMinuteur);
        boutonLancer.addEventListener('click', reinitialiserMinuteur);
        boutonSauvegarder.disabled = true;
        desactivationSaisieDonnees();
      }
    }
    
    function reinitialiserMinuteur() {
        clearInterval(timer);
        timer = null;
        minuteur_active = true;
        duree_travail = parseInt(saisir_duree_travail.value) * 60 || 25 * 60;
        duree_pause = parseInt(saisir_duree_pause.value) * 60 || 5 * 60;
        travailBox.classList.add('active');
        pauseBox.classList.remove('active');
        majAffichageMinuteur();
        boutonLancer.textContent = 'Démarrer le minuteur';
        boutonLancer.removeEventListener('click', reinitialiserMinuteur);
        boutonLancer.addEventListener('click', demarrerMinuteur);
        boutonSauvegarder.disabled = false;
        activationSaisieDonnees();
        enregistrerSurStockageLocal();
    }
  
    parametres_minuteurs.addEventListener('submit', function(e) {
          e.preventDefault();
          reinitialiserMinuteur();
    });
  
    boutonLancer.addEventListener('click', demarrerMinuteur);
    majAffichageMinuteur();
    recuperationValeursStockees();
});
  