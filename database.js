const { Sequelize } = require('sequelize');
const {chkHtmlTags} = require('./commentcleaner.js');

const db = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
  });

  const Comment = db.define(
    'Comment',
    {
      Id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      parentId: {
        type: Sequelize.STRING(36),
        defaultValue: "root"
      },
      userName: {
        type: Sequelize.STRING(64),
        allowNull: false,
        validate: { is: ["^[a-z0-9]{1,64}$",'i']}
      },
      email: {
        type: Sequelize.STRING(128),
        allowNull: false,
        validate: {
          isEmail: true
        }
      },
      homePage: {
        type: Sequelize.STRING(128),
        validate: {isUrl: true}
      },
      savedFile: {
        type: Sequelize.STRING(64),
      },
      mimeFile: {
        type: Sequelize.STRING(16),
      },
      originalFile: {
        type: Sequelize.STRING(64),
      },
      content: {
        type: Sequelize.TEXT,
        defaultValue: "",
        validate: {
        customValidator(value) {

          if ( chkHtmlTags(value).length>0 ) { throw new Error('Tags validate error' )}


        }
      }
      },
    },
    {
      // Здесь определяются другие настройки модели
    }
  )

async function connectBase()  {
  try {
    await db.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

async function syncBase()  {
    try {
        await db.sync();
      console.log('Database created successfull');
    } catch (error) {
      console.error('Unable to create the database:', error);
    }
  }
/*
;(async () => {
    // Пересоздаем таблицу в БД
  //  await sequelize.sync({ force: true })
    // дальнейший код
  })()
*/

module.exports = Comment, connectBase(), syncBase()  ;
