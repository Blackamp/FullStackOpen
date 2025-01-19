const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}


const password = process.argv[2]

const url =
  `mongodb+srv://fso:${password}@cluster0.ihuxa.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  id: Number,
  name: String,
  phone: String
})

const Person = mongoose.model('Person', personSchema)

console.log("Process argv length",process.argv.length)


if(process.argv.length === 3){

    Person.find({}).then(result => {
        console.log("Phonebook:")
        result.forEach(person => {
          console.log("- ",person.name," ", person.phone)
        })
        mongoose.connection.close()
      })

} else if(process.argv.length === 5) {

    const newContact = new Person({
        id: Math.floor(Math.random()* (9999999 - 1) + 1),
        name: process.argv[3],
        phone: process.argv[4]
      })

      console.log(newContact)
      
      newContact.save().then(result => {
        console.log('newContact saved!')
        mongoose.connection.close()
      })
}

