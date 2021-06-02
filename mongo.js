const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log("Too few arguments, please give password")
    process.exit(1)
}

const password = process.argv[2]

const url = 
    `mongodb+srv://joonasfs:${password}@cluster0.tm1cz.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, 
                        useUnifiedTopology: true, 
                        useFindAndModify: false, 
                        useCreateIndex: true 
                      })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    console.log("phonebook:")
    Person
    .find({})
    .then(result => {
        result.forEach(element => {
            console.log(element.name, element.number)
        });
        mongoose.connection.close()
  })
} else {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    }) 

    person.save().then(result => {
        console.log(`added ${person.name} ${person.number} to phonebook`)
        mongoose.connection.close()
    }) 
}

 

/* Note.find({ important: true }).then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
  })
 */
 