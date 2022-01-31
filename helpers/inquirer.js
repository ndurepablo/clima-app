const inquirer = require('inquirer');
require('colors');
// Menu principal
const preguntas = [
    {
        type: 'list',
        name: 'Opcion',
        message: 'qué desea hacer?',
        choices: [
            {
                value: 1,
                name: `${'1.'.green} Buscar ciudad`,
            },
            {
                value: 2,
                name: `${'2.'.green} Historial`,
            },
            {
                value: 0,
                name: `${'0.'.green} Salir`,
            },
            
        ],
    }
]
// Encabezado
 const inquireMenu = async()=>{
        console.clear();
        console.log('============================'.green);
        console.log('   Seleccione una opción    '.green);
        console.log('============================\n'.green);
       const {Opcion} = await inquirer.prompt(preguntas);
       return Opcion;
 }

//  Prompt de confirmación para continuar
 const pausa = async()=>{
     const question = [{
         type: 'input',
         name: 'enter',
         message: `Presione ${'ENTER'.green} para continuar`
     }]
    await inquirer.prompt(question);
 }
// Buscar ciudad
 const leerInput = async (message)=>{
     const question = [{
         type: 'input',
         name: 'desc',
         message,
         validate(value){
             if(value.length === 0){
                 return 'Por favor ingrese un valor';
             }
             return true;
         }
     }];
     const {desc} = await inquirer.prompt(question)
     return desc;
 }
// Listado de lugares
 const listarLugares = async (lugares = []) =>{
     const choices = lugares.map((lugar, i) =>{
         const idx = `${i+1}.`.green;
         return{
             value: lugar.id,
             name: `${idx} ${lugar.nombre}`,
         }
     });
    //  Cancelar
     choices.unshift({
         value: '0',
         name: '0.'.green + 'Cancelar',
     });
    //  Borrar tarea
     const preguntas = [{
         type: 'list',
         name: 'id',
         message: 'Seleccionar lugar:',
         choices,
     }]
     const {id} = await inquirer.prompt(preguntas);
     return id;
 }
// Confirmar borrado
 const confirmar = async (message)=>{
    const question = [{
        type: 'confirm',
        name: 'ok',
        message,
    }]
    const {ok} = await inquirer.prompt(question);
    return ok;
 }
// Check tareas completadas
 const mostrarListadoChecklist = async (tareas = []) =>{
    const choices = tareas.map((tarea, i) =>{
        const idx = `${i+1}.`.green;
        return{
            value: tarea.id,
            name: `${idx} ${tarea.desc}`,
            checked: (tarea.completadoEn) ? true : false,
        }
    });
// Interface seleccionadas tareas para marcar
    const preguntas = [{
        type: 'checkbox',
        name: 'ids',
        message: 'Selecciones',
        choices,
    }]
    const {ids} = await inquirer.prompt(preguntas);
    return ids;
}


 module.exports = {
     inquireMenu,
     pausa,
     leerInput,
     listarLugares,
     confirmar,
     mostrarListadoChecklist
 }