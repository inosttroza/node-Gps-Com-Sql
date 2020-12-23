const sql = require('mssql')

var bdConfig = {
    user: 'sa',
    password: 'sa12345.',
    server: 'NB-PINOSTROZA2\\MSSQLSERVER2016',
    database: 'Pruebas',
    options: {
        encrypt: false // Si usa Windows Azure. Poner "encrypt: true"
    }
};

function insertBd(latitud, longitud) {
    (async function() {
        try {
            let pool = await sql.connect(bdConfig)

            //////////////////////
            /////Querys Crud/////  
            // let result = await pool.request()
            //     //.input('input_parameter', sql.Int, 1)
            //     //.query('select * from personas where id = @input_parameter')              
            // console.dir(result)

            //////////////////////
            ///Stored procedure///            
            let result2 = await pool.request()
                .input('ELE_CDG', sql.Int, 489)
                .input('LATITUD', sql.Float, latitud)
                .input('LONGITUD', sql.Float, longitud)
                //.output('output_parameter', sql.VarChar(50))
                .execute('GPS_SP_PM14002FII_UPDATE_POSICION_EBM')
            console.dir(result2)

        } catch (error) {
            console.log(`Error al insertar: ${error}`);
            sql.close();
        }
        sql.close();
    })()
}

module.exports = {
    insertBd
}