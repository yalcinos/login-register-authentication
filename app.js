var express=require("express");
var mongoose=require("mongoose");
var passport=require("passport");
var bodyParser=require("body-parser");
var User=require("./models/user");
var LocalStrategy=require("passport-local");
var passportLocalMongoose=require("passport-local-mongoose");

mongoose.connect("mongodb://localhost/aut_db");
var app=express();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(require("express-session")({
    //encode ve decode session
    secret:"Authentication",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
//2 satır session'ı okuyor alınan datayı encode ve decode yapıyor.
//encode edip session içerisine koyuyor
passport.serializeUser(User.serializeUser());
//çözme işini yapıyor
passport.deserializeUser(User.deserializeUser());

app.get("/",function (req,res) {
    res.render("home");
});
//isLoggedIn -middleware
app.get("/main",isLoggedIn,function (req,res) {
    res.render("main");
});

//--------------REGISTER ROUTES--------------------
app.get("/register",function (req,res) {
    res.render("register");
});
app.post("/register",function (req,res) {
    var username=req.body.username;
    var password=req.body.password;
    //Yeni kullanıcı adı ve şifre(encoded) oluşturuldu ve user callback parametresine yollandı.
    User.register(new User({username:username}),password,function (err,user) {
        if(err){
            console.log(err);
            return res.render("register");
        }else{
            //local değişkeni twitter,facebook,github olabilir.Kullanılan metoda göre değişir.
            passport.authenticate("local")(req,res,function () {
                res.redirect("/secret");
            })
        }
    })
});

//------------------LOGIN ROUTES------------------
app.get("/login",function (req,res) {
    res.render("login");
});
//middleware--Databaseden username ve şifreyi karşılaştırıyor. True ise successRedirect değişkeni devreye girip,istenilen sayfaya redirect oluyor.
app.post("/login",passport.authenticate("local",{
    successRedirect:"/main",
    failureRedirect:"/login",
}),function (req,res) {
});
app.get("/logout",function (req,res) {
    //sessiondaki verileri siler.
    req.logout();
    res.redirect("/");
});
//next parametresi get route unun içerisinde tanımlanan middlewareden sonra gelen fonksiyonu çalıştırır yani CallBack fonksiyonunu.
function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
app.listen("3001",function () {
    console.log("Server has started!");
});