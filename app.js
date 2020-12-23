var SerialPort = require('serialport');
const bll = require('./bll');


var serialPort = new SerialPort("COM4", {
    baudRate: 4800,
    parser: new SerialPort.parsers.Readline("\n")
});
var readData = "";
serialPort.on('open', function() {
    serialPort.on('data', function(data) {
        //readData += data.toString();
        readData = data.toString().split('\r\n');
        var datos2 = readData[0].split(',');
        if (datos2.length === 12 && datos2[0] === '$GPRMC') {
            var latitud = datos2[3];
            var hemisferioNS = datos2[4];
            var longitud = datos2[5];
            var hemisferioEW = datos2[6];

            var lat = utmToDecimal(latitud, hemisferioNS)
            var long = utmToDecimal(longitud, hemisferioEW)

            // console.log('latitud ' + lat);
            // console.log('longitud ' + long);
            bll.insertBd(lat, long);
        }
    });
});

function utmToDecimal(latLon, hemosferio) {
    var latLong = 0;
    try {
        var split = latLon.toString().split('.');
        var grados;
        var minSeg;
        if (split[0].length >= 5) {
            grados = parseInt(split[0].substring(0, 3));
            minSeg = ((split[0].substring(3, 5)) + "." + split[1]) / 60;
        } else {
            grados = parseInt(split[0].substring(0, 2));
            minSeg = ((split[0].substring(2, 4)) + "." + split[1]) / 60;
        }
        latLong = parseFloat((grados + minSeg));
        latLong = (hemosferio === 'S' || hemosferio === 'W') ? latLong * -1 : latLong * 1;
        return parseFloat(latLong).toFixed(6);
    } catch (error) {
        console.log(`Error en utmToDecimal: ${error}`);
        return latLong;
    }
}



// var bdConfig = {
//     user: 'sa',
//     password: 'sa12345.',
//     server: 'NB-PINOSTROZA2\\MSSQLSERVER2016',
//     database: 'Pruebas',
//     options: {
//         encrypt: false // Si usa Windows Azure. Poner "encrypt: true"
//     }
// };

// function insertBd(latitud, longitud) {
//     (async function() {
//         try {
//             let pool = await sql.connect(bdConfig)
//                 // let result = await pool.request()
//                 //     //.input('input_parameter', sql.Int, 1)
//                 //     //.query('select * from personas where id = @input_parameter')              
//                 // console.dir(result)

//             // Stored procedure            
//             let result2 = await pool.request()
//                 .input('ELE_CDG', sql.Int, 489)
//                 .input('LATITUD', sql.Float, latitud)
//                 .input('LONGITUD', sql.Float, longitud)
//                 //.output('output_parameter', sql.VarChar(50))
//                 .execute('GPS_SP_PM14002FII_UPDATE_POSICION_EBM')
//             console.dir(result2)

//         } catch (error) {
//             console.log(`Error al insertar: ${error}`);
//             sql.close();
//         }
//         sql.close();
//     })()
// }