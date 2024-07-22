//!>>>>>>>>>>>>>>>>>>>>>>>>>>[ Lista de Clientes Web Socket ]<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
let list = new Map();//para la id de Clientes conectados

//!>>>>>>>>>>>>>>>>>>>>>>>>>>[ Grups de Clientes Web Socket ]<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
//?------------Puede existir mas de un grupo por cliente
let GranthGroup = new Map();

GranthGroup.set("nologin",{});//*Usuarios aun no logueados
GranthGroup.set("silogin",{});//*Usuarios ya logueados

//!-----------------------------[ Globales Externas ]------------------------------------------------
const native=global.native;


function create(ws){
	const claveID=global.native.generateClientId(list);
	// native.printSuccess({title:`Cliente Conectado`,content:`[ Invitado${claveID} ]`});
	//?-------------Estructura datos cliente en el server.
    list.set(claveID,{
        name:`Invitado${claveID}`,//*Nombre del cliente
		token: '',
        socket: ws, //*Socket para comunicar con el cliente
        group: {}, //*Grupos a los que pertenece
        file: {
            id: -1,
            name: '',
            part: 0,
            uint8Array: null
        }
    });
	return claveID;
}

function get(clientId){
	return list.get(clientId);
}

//TODO---------------------------------------[ Establece un grupo para el cliente ]------------------------------------------------------
function addGroup(clientId,group){
    const c=list.get(clientId);
    let g=c.group;
    g[group]=true;
    if(typeof(GranthGroup.get(group))!=='undefined'){
        const Gg=GranthGroup.get(group);
        Gg[clientId]=true;
    }
}

//TODO----------------------------------[ Remueve el grupo un cliente ]------------------------------------------------------------
function removeGroup(clientId,group){
    const c=list.get(clientId);
    let g=c.group;
    delete g[group];
    if(typeof(GranthGroup.get(group))!=='undefined'){
        const Gg=GranthGroup.get(group);
        delete Gg[clientId];
    }
}

export {
    create,
    get,
    addGroup,
    removeGroup
};