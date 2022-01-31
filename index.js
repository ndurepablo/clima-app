require('dotenv').config();
require('colors');
const {
    inquireMenu,
    pausa,
    leerInput,
    listarLugares
} = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

const main = async () => {
    const busquedas = new Busquedas();
    let opt = '';
    do {
        opt = await inquireMenu()
        switch (opt) {
            case 1:
                // Mostrar mensaje
                const terminos = await leerInput('Ciudad:');
                // Buscar los lugar
                const lugares = await busquedas.ciudad(terminos);
                // Seleccionar el lugar
                const id = await listarLugares(lugares);
                if(id==='0') continue;
                const lugarSel = lugares.find(l => l.id === id);
                // Guardar en db
                busquedas.agregarHistorial(lugarSel.nombre);
                // Clima enviar coordenadas
                const lat = lugarSel.lat;
                const lon = lugarSel.lng;
                const clima = await busquedas.climaLugar(lat, lon);
                // Mostrar resultados
                console.clear();
                console.log('\nInformación del lugar\n'.green);
                console.log('ciudad:', lugarSel.nombre);
                console.log(`temperatura: ${clima.temp}°C` );
                console.log(`minima: ${clima.min}°C`);
                console.log(`máxima: ${clima.max}°C`);
                console.log(`humedad: ${clima.hum}%`);
                console.log('¿Cómo está el clima?:', clima.desc);
                break;
                case 2: 
                busquedas.historialCapitalizado.forEach((lugar, i)=>{
                    const idx=`${i+1}.`.green
                    console.log(`${idx} ${lugar}`);
                })
                break;
        }


        if (opt !== 0) await pausa()
    } while (opt !== 0);
}
main();