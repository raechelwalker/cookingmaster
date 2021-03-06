/*
 * GET home page.
 */

var recipe_json = require('../recipe.json');
var saved = require('../saved.json');
var data_file = require('../data.json');

exports.view = function(req, res){
	console.log(data);
}
exports.login = function(req, res){
    res.status(200).render('login');
    return;

};

exports.index = function(req, res){

    var name = data_file.user.name;

    res.status(200).render('index', {
        'name': name
        // 'pictureurl': pictureurl
    });
    return;
};

//getting Facebook account name and adding it to data_file json
exports.name = function(req, res){

    var name = req.params.user;
    // var pictureurl = req.params.pictureurl;
    console.log("index Name: " + name);
    // console.log("picture url: " + pictureurl);
    data_file.user.name = name;

    res.status(200).render('index', {
        'name': name
        // 'pictureurl': pictureurl
    });
    return;
};

//renders new recipe page
exports.newrecipe = function(req, res){
    var name = data_file.user.name;

    if (req.query.new == "0") {
        res.status(200).render('newrecipe', {
            'name': name,
            'dish': req.query.dish,
            'serving': req.query.serving,
            'optional': req.query.optional
        });
        return;
    } else {

        res.status(200).render('newrecipe', {
            'name': name,
            'dish': "",
            'serving': "",
            'optional': ""
        }); 
        return;
    }
};

//renders saved recipe page
exports.savedrecipes = function(req, res){
    var name = data_file.user.name;
    // console.log("SAVeD: " + saved.recipes[0].recipeName);
    res.status(200).render('savedrecipes', {
        'name': name,
        recipes: saved.recipes
        // 'recipes': saved.recipes
        // 'pictureurl': pictureurl
    });
    return;

};

//after clicking on x for a specific saved recipe,
//removes it from saved.json file and re renders saved recipes page
exports.removerecipe = function(req, res) {

    // var fs = require('fs');

    var recipeName = req.params.recipeName;
    console.log(recipeName);

    
        // fs.readFile('saved.json', 'utf8', function readFileCallback(err, data){
        //     if (err){
        //         console.log(err);
        //     } else {
    // obj = JSON.parse(data); //now it an object

    var numSaved = saved.recipes.length;
    console.log("Number of saved: " + numSaved);

    for (var i=0; i < numSaved; i++) {
        if (saved.recipes[i] != undefined && saved.recipes[i].recipeName == recipeName) {
            saved.recipes.splice(i, 1);
            console.log("hopefully removing: " + recipeName);
        }
    }

                // json = JSON.stringify(obj); //convert it back to json
                // fs.writeFile('saved.json', data, 'utf8', function(err){
                //     if(err) return console.log(err);
                //     console.log('Note added');
                // });
    var name = data_file.user.name;
    // console.log("SAVeD: " + saved.recipes[0].recipeName);
    res.status(200).render('savedrecipes', {
        'name': name,
        recipes: saved.recipes
        // 'recipes': saved.recipes
        // 'pictureurl': pictureurl
    });    // res.end();
    return;


};

//after clicking on "Save Recipe" saves info to saved.json
//and renders saved recipes page
exports.sendrecipe = function(req, res) {
    var dish = req.query.dish;
    var optional = req.query.optional;
    var recipeName = req.query.recipeName;
    var serving = req.query.serving;
    var ingredients = req.query.ingredients;
    var instructions = req.query.instructions;
    var url = req.query.url;

    var newsavedrecipe = {
        'dish': dish,
        'optional': optional,
        'recipeName': recipeName,
        'serving' : serving,
        'ingredients' : ingredients,
        'instructions' : instructions,
        'url' : url  
    }
    var name = data_file.user.name;
    // var fs = require('fs');
    // fs.readFile('saved.json', 'utf8', function readFileCallback(err, data){
    //     if (err){
    //         console.log(err);
    //     } else {
    //     obj = JSON.parse(data); //now it an object
    //     obj.recipes.push(newsavedrecipe); //add some data
    //     json = JSON.stringify(obj); //convert it back to json
    //     fs.writeFile('saved.json', json, 'utf8', function(err){
    //         if(err) return console.log(err);
    //         console.log('Note added');
    //     });
    // }});

    saved.recipes.push(newsavedrecipe);

    res.status(200).render('savedrecipes', {
        'name': name,
        recipes: saved.recipes
    });
    return;
}

//after clicking on a saved recipe from the saved recipes page,
//goes to view showing recipe info (without Save Recipe button)
exports.displaysavedrecipe = function(req, res) {
    var name = data_file.user.name;
    var dish = req.query.dish;
    var optional = req.query.optional;
    var recipeName = req.query.recipeName;
    var serving = req.query.serving;
    var ingredients = req.query.ingredients;
    var instructions = req.query.instructions;
    var url = req.query.url;

    res.status(200).render('displaysaved', {
        'dish': dish,
        'optional': optional,
        'ingredients': ingredients,
        'instructions': instructions,
        'recipeName': recipeName,
        'url': url,
        'serving': serving,
        'name':name,
    });
    return;
}

//renders account page
exports.account = function(req, res){

    var name = data_file.user.name;
    // var pictureurl = data_file.user.pictureurl;

    console.log("account Name: " + name);
    // console.log("picture url: " + pictureurl);

    res.status(200).render('account', {
        'name': name
        // 'pictureurl': pictureurl
    });
    return;


};

exports.help = function(req, res){
    res.render('help');
};


//calls a python script to scrape allrecipes.com 
//searches for dish + optional ingredients
//gets url of recipe page

exports.findrecipe = function(req, res){ 
    var spawn = require('child_process').spawn;
    var dish = req.params.dish;
    var optional = req.params.optional;


    if (optional == undefined) {
        optional = "none";
        // console.log("optional: " + optional);
    } 

    console.log("dish: " + dish);
    console.log("serving: " + req.params.serving);
    console.log("optional: " + optional);

    // spawn new child process to call the python script
    const python = spawn('python', ['getrecipe.py', dish, optional]);
    // collect data from script
    python.stdout.on('data', function (data) {
        recipeData = data.toString();
        // console.log("Recipe data: " + recipeData);

        var url = "";

        if (recipeData != undefined) {
            url = recipeData;
            // console.log("Scraped URL: " + url);
        }

        var recipe_data = {
            'dish': dish,
            'recipeName': '',
            'url': url,
            'optional': optional,
            'ingredients': '',
            'serving': req.params.serving,
            'instructions': ''
        };

        recipe_json.data = recipe_data;

        // res.redirect('/recipename');

        res.status(200).render('getrecipename', {
            'dish': dish,
            'recipeName': '',
            'url': url,
            'serving':req.params.serving,
            'optional': optional
        });
        return;

    });

};

//gets recipe name from recipe url
exports.findrecipename = function(req, res){ 
    var spawn = require('child_process').spawn;
    var url = recipe_json.data.url;

    var recipeData;

    // spawn new child process to call the python script
    const python = spawn('python', ['recipeName.py', url]);
    // collect data from script
    python.stdout.on('data', function (data) {
        recipeData = data.toString();

        var recipeName = "";

        if (recipeData != undefined) {
            recipeName = recipeData;
            console.log("Scraped recipe name: " + recipeName);
        }

        var recipe_data = {
            'dish': recipe_json.data.dish,
            'recipeName': recipeName,
            'url': url,
            'optional': recipe_json.data.optional,
            'ingredients': '',
            'serving': recipe_json.data.serving,
            'instructions': ''
        };

        recipe_json.data = recipe_data;

        // res.redirect('/getrecipe');

        res.status(200).render('findingrecipe', {
            'dish': recipe_json.data.dish,
            'recipeName': recipeName,
            'url': url,
            'serving':recipe_json.data.serving,
            'optional': recipe_json.data.optional
        });
        return;

    });

};

//gets ingredients
exports.recipe = function(req, res){ 
    var spawn = require('child_process').spawn;
    var url = recipe_json.data.url

    var recipeData;

    // spawn new child process to call the python script
    const python = spawn('python', ['ingredients.py', url]);
    // collect data from script
    python.stdout.on('data', function (data) {
        recipeData = data.toString();

        var ingredients = "";

        if (recipeData != undefined) {
            console.log("Getting ingredients...");
            ingredients = recipeData;
        }

        var recipe_data = {
            'dish': recipe_json.data.dish,
            'recipeName': recipe_json.data.recipeName,
            'url': url,
            'optional': recipe_json.data.optional,
            'ingredients': ingredients,
            'serving': recipe_json.data.serving,
            'instructions': ''
        };

        recipe_json.data = recipe_data;

        // res.redirect('/getinstructions')
        res.status(200).render('loadingrecipe', {
            'dish': recipe_json.data.dish,
            'ingredients': ingredients,
            'recipeName': recipe_json.data.recipeName,
            'url': recipe_json.data.url,
            'serving': recipe_json.data.serving,
            'optional': recipe_json.data.optional
        });
        return;

    });

};

//gets instructions and orig serving size
exports.instructions = function(req, res){ 
    var spawn = require('child_process').spawn;
    var url = recipe_json.data.url

    var recipeData;

    // spawn new child process to call the python script
    const python = spawn('python', ['instructions.py', url]);
    // collect data from script
    python.stdout.on('data', function (data) {
        recipeData = data.toString();

        var instructions = "";
        var orig_serving = "";

        if (recipeData != undefined) {
            console.log("Getting instructions ...");
            instructions = recipeData.split("\n\n\n")[0];
            orig_serving = recipeData.split("\n\n\n")[1];
        }

        var recipe_data = {
            'dish': recipe_json.data.dish,
            'recipeName': recipe_json.data.recipeName,
            'url': url,
            'optional': recipe_json.data.optional,
            'ingredients': recipe_json.data.ingredients,
            'orig_serving': orig_serving,
            'serving': recipe_json.data.serving,
            'instructions': instructions,
        };

        recipe_json.data = recipe_data;

        res.status(200).redirect('/recipe');
        return;
        // var url = require('url');
        // res.redirect(url.format({
        //     pathname: '/recipe', 
        //     query: {
        //         'dish': recipe_json.data.dish,
        //         'recipeName': recipe_json.data.recipeName,
        //         'url': recipe_json.data.url,
        //         'serving': recipe_json.data.serving,
        //         'optional': recipe_json.data.optional,
        //         'ingredients': recipe_json.data.ingredients,
        //         'instructions': instructions,
        //         'orig_serving': orig_serving
        //     }
        // }));

    });

};

//puts original ingredient amount & orig serving/desired serving 
//into converter, scrapes new ingredient amounts
exports.convertrecipe = function(req, res){ 
    var spawn = require('child_process').spawn;
    var ingredients = recipe_json.data.ingredients;
    var orig_serving = recipe_json.data.orig_serving;
    var serving = recipe_json.data.serving;

    var recipeData;

    // spawn new child process to call the python script
    const python = spawn('python', ['conversion.py', ingredients, orig_serving, serving]);
    // collect data from script
    python.stdout.on('data', function (data) {
        recipeData = data.toString();

        var ingredients = "";

        if (recipeData != undefined) {
            ingredients = recipeData;
        }

        var name = data_file.user.name;

        res.status(200).render('recipe', {
            'dish': recipe_json.data.dish,
            'optional': recipe_json.data.optional,
            'ingredients': ingredients,
            'instructions': recipe_json.data.instructions,
            'recipeName': recipe_json.data.recipeName,
            'url': recipe_json.data.url,
            'serving': recipe_json.data.serving,
            'name': name,
        });
        return;

    });

};
