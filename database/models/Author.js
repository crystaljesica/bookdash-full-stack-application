const createFirstName = (user, options) => {
  const { firstName, middleInitial, lastName } = user 
  let fullName
  
  if (middleInitial) {
    fullName = `${firstName} ${middleInitial}. ${lastName}`
  } else {
    fullName = `${firstName} ${lastName}`
  }

  return user.setDataValue('fullName', fullName)
}

module.exports = (sequelize, DataTypes) => {
  const Author = sequelize.define('Author', {
    fullName: DataTypes.STRING,
    firstName: DataTypes.STRING,
    middleInitial: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    lastName: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate: createFirstName,
      beforeUpdate: createFirstName
    }
  })

  return Author
}