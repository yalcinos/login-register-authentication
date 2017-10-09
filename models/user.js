var mongoose=require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose");

var userSchema=mongoose.Schema({
    username:String,
    password:String
});

//Schema ya plugin ekler.
//passportLocalMongoose paketi şifreyi hash şeklinde kayıt eder ve birde salt ekler. Salt "hash" lenmiş şifreyi çözmek için lazımdır.
userSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("User",userSchema);