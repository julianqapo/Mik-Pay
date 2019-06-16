const express = require("express")
const app = express()
const path = require("path")
const fs = require("fs")
const users = require("./users")
const lookPretty = require("js-beautify")

const port = process.env.PORT || 8080

app.set("view engine", "ejs")

//handle post request
app.use(express.urlencoded({extended : false}))

//change views location
app.set("views",path.join(__dirname, "vie") )
app.get("/", (req,res)=> res.render("years", {users : users}))
app.get("/:id", (req,res)=> {
    
    Object.keys(users).filter(e=>{
        if (req.params.id.trim() == e){
            res.render("index",{users : users[e],
            year : e,
            url : req.params.id} )
            console.log(e)
        }
    })
    
})

//adding new year

app.post("/addyear", (req,res)=>{
    //from
    let year = req.body.year
    let x = Object.keys(users)
    let last = x[x.length -1]
    if (year == Number(last) +1){
        users[year] = users[last]
    let z = JSON.stringify(users)
    fs.writeFileSync("users.json", lookPretty(z))
    res.render("years", {users : users})
    } else{
        res.send("you have added incorrect year")
    }   
})



//adding user

app.get("/:id/adduser", (req,res)=>{
    res.render("addUser", {url : req.params.id})
    res.end
})

app.post("/:id/adduser", (req,res)=>{
        let user = {
        name : req.body.name,
        number : req.body.number,
        username : req.body.username,
        password : req.body.password,
        type : req.body.type,
        jan : "",
        feb : "",
        march : "",
        april:"",
        may : "",
        jun: "",
        July : "",
        augest :"",
        sep : "",
        oct : "",
        nov : "",
        dec : ""
        }
        let year = req.params.id.trim()
        users[year].push(user)
        let finalusers = JSON.stringify(users)
        res.render("addedsuc", {user : user,
                                url : req.params.id.trim()})
        fs.writeFileSync("users.json", lookPretty(finalusers))
    })

    //edit user month payment
    app.post("/:id/edituser",(req,res)=>{
        let url = req.params.id.trim()
        let month = req.body.month
        let user = req.body.name
        let amoun = req.body.amount
        console.log("im url :"+url)
        console.log("im amount :"+amoun)
       // console.log(users[2019])
        let z = users[url].filter(e=>e.name ==user.trim())
       // console.log("im user :"+z[0].name)
       // console.log(month)
       // console.log(user)
        z[0][month] = amoun
        let finalusers = JSON.stringify(users)
        fs.writeFileSync("users.json", lookPretty(finalusers))

        //console.log(z[0].month)
        res.render("index",{url : url, users : users[url]})
        console.log(url)
    })
    //to here

    /*
    users.push(user)
    console.log(user)
    let finalusers = JSON.stringify(users)
    res.render("addedsuc", {user : user})
    fs.writeFileSync("users.json", finalusers)
    */

    //rename name, number, user and pass
    app.get("/:id/:iu/", (req,res)=>{
        let year = req.params.id
        let user = req.params.iu
        let userTaget = users[year].filter(e=>e.name == user.trim())
        let userTaget2 = userTaget[0]
        if (userTaget2){
            res.render("rename", {year : year,
                                user : user,
                                number : userTaget2.number,
                                username : userTaget2.username,
                                password : userTaget2.password,
                                type : userTaget2.type})
        }
    })

    app.post("/:id/:iu/", (req,res)=>{
        let year = req.params.id
        let year2 = year
        let name = req.body.name
        let number = req.body.number
        let username = req.body.username
        let password = req.body.password
        let type = req.body.type
        let userTaget = users[year].filter(e=>e.name == name.trim())
        //console.log(userTaget)
        userTaget[0].name = name
        userTaget[0].number = number
        userTaget[0].password = password
        userTaget[0].type = type
        userTaget[0].username = username
        let finalusers = JSON.stringify(users)
        fs.writeFileSync("users.json", lookPretty(finalusers))
        console.log(userTaget[0].type)
        console.log(year)
        var dt = new Date();
        let yyy = dt.getYear() 
        console.log(yyy)
        res.render("renameDone",{yyy : yyy,
                            name : name,
                            number : number,
                            type : type,
                            password : password,
                            username : username})
    })


app.listen(port, ()=> console.log(`listening to port : ${port}`))

