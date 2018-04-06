// Random number [1,5], 1 being rarest, 5 most common
// Then get all types based on the rarity, and choose a random one to return
const getType = (types) =>{
    const rarity = Math.round(Math.log10(Math.pow(Math.random()*99+1,2)))+1
    types = types.filter(type => type.rarity===rarity)
    return(types[Math.round(Math.random()*(types.length-1))])
}

// Use all exp the poro has to level it up. Only returns stats; change the values themselves elsewhere!
const getLevel = (exp, level) => {
    while(exp>level*10){
        exp-=level*10
        level++
    }
    return({exp, level})
}


// Gets list of all types, and user who should receive the poro
// Returns (a random poro) object using getType function 
const getPoro = (types, user_id) => {
    const type = getType(types)
    return({
        name: type.name,
        type: type,
        owner: user_id,
        date: Date(),
        experience: 0,
        level: 1,
        healthIV: Math.round(Math.random()*10),
        attackIV: Math.round(Math.random()*10),
        defenseIV: Math.round(Math.random()*10),
        staminaIV: Math.round(Math.random()*10),
        speedIV: Math.round(Math.random()*10)
    })
}

module.exports = {getPoro, getLevel, getType}