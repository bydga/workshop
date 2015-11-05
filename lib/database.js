//mongoq module (driver)
var mongoq = require("mongoq")
var escape = require('escape-html')

//funkce pro tvorbu ObjectIDs (primární klíče v mongu)
var ObjectID = mongoq.mongodb.ObjectID

// konkrétní navázané spojení do monga. Žije po celou dobu běhu aplikace (všech 5 connection pool spojení)
var mongo = mongoq("mongodb://nodejs:nodejs@ds039351.mongolab.com:39351/bydga?connectionPool=5&w=1")

// reference na konkrétní kolekci (kolekce = jako tabulka v SQL) do monga.
// kolekce uchovává dokumenty (1 dokument = jako 1 řádek v SQL)
var userCollection = mongo.collection("userlist")

//veřejný interface tohoto modulu
module.exports = {
	/**
	 funkce vracející všchny uživatele z kolekce userlist
	 @param callback: funkce zavolaná při dokončení této operace. Signatura je callback(err, users)
	*/
	getAllUsers: (callback) => {
	    userCollection.find().toArray((err, items) => {
	        if (err) {
	            return callback(err)
	        }
	        callback(null, items)
	    })
	},

	/**
        funkce která uloží nového uživatele do kolekce userlist
        @param user: objekt uživatele, který bude uložen
        @param callback: funkce zavolaná při dokončení této operace. Signatura je callback(err)
    */
    insertUser: (user, callback) => {

    	for (k in user)
    		user[k] = escape(user[k])

        userCollection.insert(user, (err) =>{
            if (err) {
                return callback(err)
            }
            callback(null)
        })
    },

    /**
        funkce která odstraní existujícího uživatele z kolekce userlist
        @param userId: identifikátor uživatele k odsranění
        @param callback: funkce zavolaná při dokončení této operace. Signatura je callback(err)
    */
    deleteUserById: (userId, callback) => {
        userCollection.remove({_id: ObjectID(userId)}, (err) => {
            if (err) {
                return callback(err)
            }
            callback(null)
        })
    }

}