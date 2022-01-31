const fs = require('fs');
const axios = require('axios');
class Busquedas {
    historial = [];
    dbPath='./db/database.json';
    constructor() {
        // TODO: leer db si existe
        this.leerDB();
    }
    // primera letra en mayus
    get historialCapitalizado(){    
        return this.historial.map(lugar =>{
            let palabras = lugar.split(' ');
            palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1));
            return palabras.join('')
        });
    }
    // 
    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }
    // Buscar ciudad
    async ciudad(lugar = '') {
        try {
            // Petición http
            const instance = await axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox,
            });

            const resp = await instance.get();
            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }))
        } catch (error) {
            throw error;
        }
    }
    get paramsWeather() {
        return {
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es',
        }
    }
    async climaLugar(lat, lon) {
        try {
            // Instance axios.create()
            const instance = axios.create({
                baseURL: 'https://api.openweathermap.org/data/2.5/weather',
                params: {...this.paramsWeather, lat, lon}
            })
            // resp.data
            const resp = await instance.get();
            const {weather, main} = resp.data
            return {
                desc: weather[0].description,
                min: Math.trunc(main.temp_min),
                max: Math.trunc(main.temp_max),
                temp:Math.trunc(main.temp),
                hum: main.humidity
            }
        } catch (error) {
            throw error
        }
    }
    agregarHistorial(lugar= ''){
        // TODO: prevenir duplicados
        if (this.historial.includes(lugar.toLocaleLowerCase())){
            return;
        }
        // guarda las ultimas 5
        this.historial = this.historial.splice(0,4)
        this.historial.unshift(lugar.toLocaleLowerCase());

        // grabar en db
        this.guardarDB();
        
    }
    // gyardar en db
    guardarDB(){
        const payLoad = {
            historial: this.historial
        };
        fs.writeFileSync(this.dbPath, JSON.stringify(payLoad));
    }
    leerDB() {
        // leer db

        if( !fs.existsSync( this.dbPath ) ) return;
        
        const info = fs.readFileSync( this.dbPath, { encoding: 'utf-8' });
        const data = JSON.parse( info );
        this.historial = data.historial;
    }
}

module.exports = Busquedas;