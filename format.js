const fs = require('fs');

// Fonction pour créer le format spécifié à partir d'un objet JSON
function createFormattedJSON(jsonData) {
    const formattedData = [];

    jsonData.forEach(question => {
        question.answers.forEach(answer => {
            const formattedAnswer = {
                fields: {
                    id: {
                        stringValue: answer.id
                    },
                    text: {
                        stringValue: answer.text
                    },
                    valid: {
                        booleanValue: answer.valid
                    }
                }
            };
            formattedData.push(formattedAnswer);
        });
    });

    return formattedData;
}

// Données JSON d'entrée
const jsonData = [

  {
  "id": "q36",
  "question": "Combien de pleines mers et de basses mers se produisent généralement chaque jour à cause de l'attraction lunaire ?",
  "img": "",
  "answers": [
    {
      "id": "q36a1",
      "text": "Une pleine mer et une basse mer.",
      "valid": false
    },
    {
      "id": "q36a2",
      "text": "Deux pleines mers et deux basses mers.",
      "valid": true
    },
    {
      "id": "q36a3",
      "text": "Trois pleines mers et trois basses mers.",
      "valid": false
    },
    {
      "id": "q36a4",
      "text": "Quatre pleines mers et quatre basses mers.",
      "valid": false
    }
  ],
  "explain": "Chaque jour, il y a généralement deux pleines mers et deux basses mers dues à l'attraction lunaire."
},
{
  "id": "q37",
  "question": "Quand se produisent les marées de vive eau ?",
  "img": "",
  "answers": [
    {
      "id": "q37a1",
      "text": "Nouvelle Lune et Pleine Lune.",
      "valid": true
    },
    {
      "id": "q37a2",
      "text": "Premier et dernier quartier de la Lune.",
      "valid": false
    },
    {
      "id": "q37a3",
      "text": "Chaque équinoxe.",
      "valid": false
    },
    {
      "id": "q37a4",
      "text": "Chaque solstice.",
      "valid": false
    }
  ],
  "explain": "Les marées de vive eau se produisent lors de la nouvelle lune et de la pleine lune, avec un écart maximal entre pleine mer et basse mer."
}
,{
  "id": "q38",
  "question": "Que signifie un coefficient de marée de 120 ?",
  "img": "",
  "answers": [
    {
      "id": "q38a1",
      "text": "Petites marées avec faible variation de niveau.",
      "valid": false
    },
    {
      "id": "q38a2",
      "text": "Marées intermédiaires.",
      "valid": false
    },
    {
      "id": "q38a3",
      "text": "Grandes marées avec forte variation de niveau.",
      "valid": true
    },
    {
      "id": "q38a4",
      "text": "Absence de marées.",
      "valid": false
    }
  ],
  "explain": "Un coefficient de marée de 120 indique de grandes marées avec une forte variation de niveau entre la pleine mer et la basse mer."
},
{
  "id": "q39",
  "question": "Quel signal est utilisé pour indiquer une marée montante de jour ?",
  "img": "",
  "answers": [
    {
      "id": "q39a1",
      "text": "Flamme bleue.",
      "valid": false
    },
    {
      "id": "q39a2",
      "text": "Cône noir avec la pointe vers le haut.",
      "valid": true
    },
    {
      "id": "q39a3",
      "text": "Pavillon blanc et croix de Saint-André noire.",
      "valid": false
    },
    {
      "id": "q39a4",
      "text": "Deux feux verts horizontaux.",
      "valid": false
    }
  ],
  "explain": "Durant le jour, un cône noir avec la pointe vers le haut indique une marée montante."
}
,{
  "id": "q40",
  "question": "Que représente un cylindre noir dans les signaux de profondeur des eaux portuaires ?",
  "img": "",
  "answers": [
    {
      "id": "q40a1",
      "text": "20 centimètres d'eau.",
      "valid": false
    },
    {
      "id": "q40a2",
      "text": "1 mètre d'eau.",
      "valid": true
    },
    {
      "id": "q40a3",
      "text": "5 mètres d'eau.",
      "valid": false
    },
    {
      "id": "q40a4",
      "text": "10 mètres d'eau.",
      "valid": false
    }
  ],
  "explain": "Un cylindre noir placé au centre représente une profondeur d'eau de 1 mètre."
}
,
{
  "id": "q41",
  "question": "Que désigne le terme 'marnage' ?",
  "img": "",
  "answers": [
    {
      "id": "q41a1",
      "text": "Le temps entre deux marées hautes.",
      "valid": false
    },
    {
      "id": "q41a2",
      "text": "L'écart de hauteur entre pleine mer et basse mer.",
      "valid": true
    },
    {
      "id": "q41a3",
      "text": "La durée d'une marée montante.",
      "valid": false
    },
    {
      "id": "q41a4",
      "text": "La vitesse de montée des eaux.",
      "valid": false
    }
  ],
  "explain": "Le marnage est l'écart de hauteur entre la pleine mer et la basse mer."
}
,

{
  "id": "q42",
  "question": "Que mesure la sonde en matière de marées ?",
  "img": "",
  "answers": [
    {
      "id": "q42a1",
      "text": "La température de l'eau.",
      "valid": false
    },
    {
      "id": "q42a2",
      "text": "La salinité de l'eau.",
      "valid": false
    },
    {
      "id": "q42a3",
      "text": "La mesure verticale du fond marin au niveau zéro.",
      "valid": true
    },
    {
      "id": "q42a4",
      "text": "La vitesse du courant marin.",
      "valid": false
    }
  ],
  "explain": "La sonde est utilisée pour mesurer verticalement du fond marin au niveau zéro, crucial pour déterminer la profondeur des marées."
}
,
{
  "id": "q43",
  "question": "Pourquoi est-il important de vérifier la profondeur et la hauteur d'eau au mouillage ?",
  "img": "",
  "answers": [
    {
      "id": "q43a1",
      "text": "Pour prévenir l'échouage à basse mer.",
      "valid": true
    },
    {
      "id": "q43a2",
      "text": "Pour calculer la vitesse du bateau.",
      "valid": false
    },
    {
      "id": "q43a3",
      "text": "Pour déterminer la direction du vent.",
      "valid": false
    },
    {
  "id": "q43a4",
  "text": "Pour ajuster les voiles.",
  "valid": false
}]
}

];

// Création du format spécifié à partir des données JSON
const formattedData = createFormattedJSON(jsonData);

// Écriture des données formatées dans un fichier JSON
fs.writeFile('formatted_data.json', JSON.stringify(formattedData, null, 2), (err) => {
    if (err) throw err;
    console.log('Les données formatées ont été écrites dans formatted_data.json');
});
