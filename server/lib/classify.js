const Clarifai = require("clarifai");

// instantiate a new Clarifai app passing in your api key.
const app = new Clarifai.App({
    apiKey: "6182d998e9d54bc3aaa8a9f08c727c2f"
});

app.models
    .initModel({
        id: Clarifai.GENERAL_MODEL,
        version: "aa7f35c01e0642fda5cf400f543e7c40"
    })
    .then(generalModel => {
        return generalModel.predict(
            "https://riotfest.org/wp-content/uploads/2017/03/fart-spongebob-698x392.jpg"
        );
    })
    .then(response => {
        var concepts = response["outputs"][0]["data"]["concepts"];
        var clean = concepts.map(e => {
            return {
                name: e.name,
                confidence: e.value * 100 + "%"
            };
        });
        console.log(clean);
    });
