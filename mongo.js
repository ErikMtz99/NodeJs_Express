const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

// When command node mongo.js password executes, Mongo creates a new document in the database.
const password = process.argv[2]
const name_arg = process.argv[3] //Name provided as argument by user/dev
const number_arg = process.argv[4] //Number provided as argument by user/dev

const url = `mongodb+srv://ferikmtz_db_user:${password}@cluster0.rzuwde4.mongodb.net/phonebook?retryWrites=true&w=majority`
mongoose.set('strictQuery',false)
mongoose.connect(url)


const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})
const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: `${name_arg}`,
  number: `${number_arg}`,
})


if (process.argv.length>4){
    person.save().then(result => {
      console.log(`added ${name_arg}, number: ${number_arg} to the phonebook.`)
      mongoose.connection.close()
    })
}
else {
    console.log('Printing all entries on agenda: \n')
    Person.find({}).then(result => {
        result.forEach(p => {
            console.log(p)
        })
        mongoose.connection.close()
        })  
}

// If user only provides password and not person entry:
