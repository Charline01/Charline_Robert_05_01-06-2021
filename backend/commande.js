// ------------------------------- COMMANDE.HTML --------------------------//

// const { response } = require("express");

// récupérer les informations du panier et les enregistrer dans le localstorage // 


const sendBtn = document.querySelector('#boutonCommander');
sendBtn.addEventListener('click', (e) =>{
  e.preventDefault()
  validerFormulaire()
})



function envoyerFormulaire(contact) {
    
    var products = JSON.parse(localStorage.getItem("panier"));

                fetch('http://127.0.0.1:3000/api/teddies/order', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                                      },
                                      body:  JSON.stringify({
                                      contact,
                                      products
                                    })
                            }).then((response) => {
                              if (response.ok === true){
                                return response.json()
                              }else{
                                alert("Problème requete")
                              } 
                            })
                              .then((data) => {
                                console.log(data);
                                if (data.orderId){
                                  localStorage.setItem('commande', (data.orderId));
                                  // calcul du montant total
                                  let products = data.products;
                                  let total = 0;
                                  for(product of products){
                                    total = total + product.price/100;
                                  }
                                  localStorage.setItem('total', total);
                                  window.location = "remerciement.html";    
                              }                             
                              })
                              .catch(error => {
                                console.log(error);
                                alert("Une erreur est survenue.")
                               })

                }


//Enregistrer les informations du formulaire dans le localstorage//
function validerFormulaire(){
      var prenom = document.getElementById("firstName").value;
      var nom = document.getElementById("lastName").value;
      var adresse = document.getElementById("address").value;
      var ville = document.getElementById("city").value;
      var email = document.getElementById("email").value;
                
                
      //Vérification des regex du le formulaire
      var regexNomPrenom = /^([a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]{3,20})$/;
      var regexAdresse = /^([0-9a-z'àâéèêôùûçÀÂÉÈÔÙÛÇ\s-]{1,50})$/;
      var regexVille = /([A-Za-z]{3,})/;
      var regexMail = /[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([_\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})/;
      
      
      if (regexNomPrenom.exec(nom) == null) {
          nom = "";
      }
      
      if (regexNomPrenom.exec(prenom) == null) {
          prenom = "";
        
      }
      if (regexAdresse.exec(adresse) == null) {
          adresse = "";
        
      }
      
      if (regexVille.exec(ville) == null) {
          ville = "";
      
      }
      if (regexMail.exec(email) == null) {
          email= "";
        
      }
        
      var prixTotal = prixTotalPeluche();
      // var prixTotal = localStorage.getItem("total");

      alert(prixTotal);

      if (prixTotal !=0 && prenom != "" && nom !="" && adresse!="" && ville !="" && email !=""){
        var contact = {
            firstName: prenom, 
            lastName: nom,
            address: adresse,
            city: ville,
            email: email
            };
  
            localStorage.setItem("contact", contact);
            localStorage.setItem("firstName", prenom);
            localStorage.setItem("lastName", nom);
            localStorage.setItem("address", adresse);
            localStorage.setItem("city", ville);
            localStorage.setItem("email", email);
            
            envoyerFormulaire(contact);
      }

     else alert("Veuillez vérifier tous les champs du formulaire");
 }

  
 function prixPeluche(requestURL) {

  var request = new XMLHttpRequest();

  request.open('GET', requestURL);

  request.responseType = 'json';
  request.send();

  request.onload = function() {
      var teddies = request.response;
      console.log(teddies);
     return teddies.price/100;
      }
}

function prixTotalPeluche(){
  var panier = JSON.parse(localStorage.getItem("panier"));
  var prix = 0;
  panier.forEach(id => {
    prix += prixPeluche("http://127.0.0.1:3000/api/teddies/" + id)
    });
  return prix;
}
