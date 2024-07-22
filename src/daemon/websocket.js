

//!-----------------------------------------------------------------
//!                       Servidor Web Socket
//!-----------------------------------------------------------------
const WebSocket = require("ws");
//!-----------------------[ Web Socket ]------------------------------
var socket = undefined;

//!-----------------------[ Clientes ]------------------------------------------

// const cl_login= require("./ws/login");

//!-------------------------------[ Sccripts Externos ]----------------------------
const native=global.native;

const client=require("./ws/client.js");

//!------------------------------[ Servidor Back-End ]-----------------------------------------------

//TODO-------------------[ Inicia Server Web Socket (SWS) ]--------------------------
function start({
	port = 3000, //*server web
	fnc_error = (error) => {
		console.log(`Error WebSocket: ${error}`);
		return;
	},
	fnc_close = () => {
		console.log("Servidor Web socket cerrado.");
		return;
	},
	fnc_success = (pr) => {
		console.log(`Servidor Web Socket Escuchando por el puerto ${pr}.`);
		return;
	},
}) {
	//?---El Puerto de escucha tiene que ser valido
	if (typeof port != "number" || port < 0 || port > 65535) {
		const error = new Error("No se asigno un puerto correctamente");
		fnc_error(error);
		return;
	}

	//?---Crea el Web Socket Server
	socket = new WebSocket.Server({ port }); //creamos Web Socket

	//?---Ocurrio un Error en el servidor
	socket.on("error", function (error) {
		fnc_error(error);
		return;
	});

	//?---El servidor se cerro
	socket.on("close", function () {
		fnc_close();
		return;
	});

	//?---Un Cliente se conecto
	socket.on("connection", function (ws) {
		// neocliente(ws);
		return;
	});

	//?---El servidor esta escuchando
	socket.on("listening", function () {
		fnc_success(port);
		return;
	});
}


//TODO-------------------[ Detiene Servidor ]--------------------------
function close({
	fnc_error = (error) => {
		console.log(`No fue posible detener el servidor Web Socket: ${error}`);
		return;
	},
}) {
	try {
		//?---Intenta Cerrar el Servidor
		socket.close();
	} catch (e) {
		fnc_error(e);
	}
}

// //TODO---------------------------Cliente conexión-----------------------------------------------------
// function neocliente(ws){
// 	//?---ID unica del cliente conectado
//     const clientId = client.create(ws);

//     //?---Se Agrega al grupo inicial
//     client.addGroup(clientId,'nologin');

//     //?---Cuando se recibe un mensaje del cliente
//     ws.on('message', (message) => {
//         let nS=client.get(clientId);

//         //?---Tiene que existir el cliente
//         if(typeof(nS)!=='object') return;

// 		//?---Mensjae del Cliente
// 		const sms=native.B64toOBJ(message);
// 		//?---Tiene que ser un objeto
// 		if(!native.isObj(sms)) return;
		
// 		//?---Tiene Que tener type, kindData y data
// 		if(typeof(sms.type)!='string'||typeof(sms.kindData)!='string'||typeof(sms.data)=='undefined') return;

// 		let rt=0;
// 		//!-----------------[ Login User ]---------------------------------
// 		if(sms.type=='login') rt=cliente_login(clientId,sms.kindData,sms.data);
// 		else
// 		//!-----------------[ Ctrl interno ]---------------------------------
// 		if(sms.type=='ctrl') rt=cliente_ctrl(clientId,sms.kindData,sms.data);
// 		else
// 		//!-----------------[ Administrador ]---------------------------------
// 		if(sms.type==='admin') rt=cliente_admin(clientId,sms.kindData,sms.data);
// 		else
// 		//!-----------------[ Mensajes ]---------------------------------
// 		if(sms.type==='sms'){
// 			// printLog({title:`Mensaje recibido de ${nameSocket}`,content:`[ ${sms.data} ] {${parseFecha(sms.date)}} `});
// 			// Reenviar el mensaje a todos los clientes conectados
// 			socket.clients.forEach((client) => {
// 				if (client !== ws && client.readyState === WebSocket.OPEN) {
// 					client.send(message);
// 				}
// 			});
// 			return;
// 		}

// 		//!-------------------------[ No se reconocio el mensaje ]---------------------------------
// 		if(rt==0){
// 			let ascii='';
// 			try{
// 				ascii=`<div>ASCII decodificado:</div><div>${atob(message)}</div>`;
// 			}catch(error){
// 				ascii='<div>El mensaje no esta codificado en Base64</div>';
// 			}
// 			// printError({title:`Error Syntaxis Mensaje`,
// 			// 	content:`<div>${message}</div>
// 			// 	${ascii}
// 			// 	<div>Recibido de [ ${nameSocket} ]</div>`,
// 			// 	advance:true
// 			// });
// 		}
//     });

//     //?---Cuando se desconecta el cliente
//     ws.on('close', () => {
//         const nS=clients.get(clientId);
//         const nameSocket=nS.name;
//         // printWarning({title: `Cliente [ ${nameSocket} ] desconectado.`});
//         clients.delete(clientId);
//     });
// }

// function cliente_login(clientId,kindData,data){
// 	let rt=0;
// 	const leclient=client.get(clientId);
// 	//?------------------[ Cliente Quiere Token de sesion ]----------------------
// 	if(kindData=='getToken'&&native.isObj(data)) rt=cl_login.getToken(leclient,data);
// 	else
// 	//?------------------[ Cliente Quiere Actualizar Token de sesion ]----------------------
// 	if(kindData=='updateToken'&&typeof(data)==='string') rt=cl_login.updateToken(leclient,data);
// 	return rt;
// }

// function cliente_ctrl(clientId,kindData,data){
// 	let rt=0;
// 	//?------------------[ Cliente se deslogueo ]----------------------
// 	if(kindData=='logout'&&data===null) rt=noClientId(clientId);
// 		else if(kindData==='FilesOnDir'&&isObj(data)) rt=FilesOnDir(clientId,data);
// 		else if(kindData==='FileUpload'&&isObj(data)) rt=FileUpload(clientId,data);
// 		else if(kindData==='home'&&typeof(data)==='string'){
// 		if(data==='whoexists'){
// 			query({//!-----------------------[ Verificamos que exista un usuario `kind` `clave` ]-----------------------------
// 				vr_query:`SELECT 'Admin' AS valor,EXISTS (SELECT 1 FROM user WHERE kind = 'Admin') AS existe
// 				UNION SELECT 'Service' AS valor,EXISTS (SELECT 1 FROM user WHERE kind = 'Service') AS existe
// 				UNION SELECT 'Kitchen' AS valor,EXISTS (SELECT 1 FROM user WHERE kind = 'Kitchen') AS existe
// 				UNION SELECT 'BarraDrink' AS valor,EXISTS (SELECT 1 FROM user WHERE kind = 'BarraDrink') AS existe
// 				UNION SELECT 'Mantentain' AS valor,EXISTS (SELECT 1 FROM user WHERE kind = 'Mantentain') AS existe
// 				UNION SELECT 'CashRegister' AS valor,EXISTS (SELECT 1 FROM user WHERE kind = 'CashRegister') AS existe
// 				UNION SELECT 'Accountant' AS valor,EXISTS (SELECT 1 FROM user WHERE kind = 'Accountant') AS existe
// 				UNION SELECT 'Store' AS valor,EXISTS (SELECT 1 FROM user WHERE kind = 'Store') AS existe
// 				UNION SELECT 'Parking' AS valor,EXISTS (SELECT 1 FROM user WHERE kind = 'Parking') AS existe;`,
// 				fnc_success:(r)=>{
// 					let obj={};
// 					for(let i in r){
// 						obj[r[i].valor]=r[i].existe;
// 					}
// 					const smsE={
// 						type:'ctrl',
// 						kindData:'home',
// 						data: obj
// 					}
// 					sendSMS({socket:{0: nS.socket},sms: smsE});
// 				},
// 				fnc_error:(e)=>{//!---------------------[ Fallo la DB ]------------------------------
// 					const tk={
// 						type:'ctrl',
// 						kindData:'home',
// 						data: 'noDB'
// 					}
// 					sendSMS({socket:{0: nS.socket},sms: tk});
// 				}
// 			});
// 		}
// 		return;
// 	}
// }

// function cliente_admin(clientId,kindData,data){
// 	let rt=0;
// 	//?------------------[ Cliente quiere cambiar información `user` ]----------------------
// 	if(kindData==='changeDataUser'&&isObj(data)) rt=changeDataUser(clientId,data);
// 	else
// 	//?------------------[ Cliente Quiere Eliminar Usuario ]----------------------
// 	if(kindData==='deleteUser'&&typeof(data)==='number') rt=deleteUser(clientId,data);
// 	else
// 	//?------------------[ Cliente Quiere Crear Usuario ]----------------------
// 	if(kindData==='neoUser'&&isObj(data)) rt=neoUser(clientId,data);
// 	else
// 	//?------------------[ Cliente Quiere Obtener info `user` ]----------------------
// 	if(kindData==='getUsers'&&isObj(data)) rt=getUsers(clientId,data);
// 	else
// 	//?------------------[ Cliente Quiere Obtener info full `user_data` ]----------------------
// 	if(kindData==='setUsersInfo'&&isObj(data)) rt=setUsersInfo(clientId,data);
// 	else
// 	//?------------------[ Cliente Quiere Obtener info full `user_data` ]----------------------
// 	if(kindData==='generateClave'&&isObj(data)) rt=generateClaveNeo(clientId,data);
// 	else
// 	//?------------------[ Cliente Quiere Obtener info full `user_data` ]----------------------
// 	if(kindData==='getUsersInfo'&&typeof(data)==='number') rt=getUsersInfo(clientId,data);
// }

// function errorDB(socket,error){
// 	sendSMS({socket,sms: {
// 		type:'ctrl',
// 		kindData:'db',
// 		data: 'error'
// 	}});
// }
// function deleteUser(clientId,data){
//     let nS=clients.get(clientId);

//     query({//!-----------------------[ Verificamos que exista un usuario `id` ]-----------------------------
//         vr_query:`SELECT kind,user FROM user WHERE id="${data}";`,
//         fnc_success:(r)=>{
//             //TODO-----------[ No existe ]------------------
//             if(r.length===0){
//                 const obj={
//                     type:'admin',
//                     kindData:'deleteUser',
//                     data: 'noUser'
//                 }
//                 sendSMS({socket:{0: nS.socket},sms: obj});
//             }else{//TODO-----------[ Si existe ]------------------
//                 if(r[0].user==='admin'&&r[0].kind==='Admin'){//TODO-----------[ Es `admin` ]------------------
//                     const obj={
//                         type:'admin',
//                         kindData:'deleteUser',
//                         data: 'leAdmin'
//                     }
//                     sendSMS({socket:{0: nS.socket},sms: obj});
//                 }else{//TODO-----------[ Distinto a `admin` ]------------------
//                     //TODO-----------[ Elimina archivos digitales ]------------------
//                     deleteDir({root: `./HTTPServer/DigitalFilesUser/${data}`,errext:false})
//                     .then((mensaje) => {
//                         if(mensaje==='0x000'||mensaje==='0x001'){
//                             query({//!-----------------------[ Borra infor del user ]-----------------------------
//                                 vr_query: `DELETE L, R FROM user AS L LEFT OUTER JOIN user_data AS R ON L.link=R.user WHERE L.link = "${data}" OR R.user="${data}"`,
//                                 fnc_success:(r)=>{
//                                     query({//!-----------------------[ Borra al user ]-----------------------------
//                                         vr_query: `DELETE FROM user WHERE id = "${data}"`,
//                                         fnc_success:(r)=>{
//                                             const obj={
//                                                 type:'admin',
//                                                 kindData:'deleteUser',
//                                                 data: 'success'
//                                             }
//                                             sendSMS({socket:{0: nS.socket},sms: obj});
//                                         },
//                                         fnc_error:(e)=>{//!---------------------[ Fallo la DB ]------------------------------
//                                             const obj={
//                                                 type:'admin',
//                                                 kindData:'deleteUser',
//                                                 data: 'noDB'
//                                             }
//                                             sendSMS({socket:{0: nS.socket},sms: obj});
//                                         }
//                                     });
//                                 },
//                                 fnc_error:(e)=>{//!---------------------[ Fallo la DB ]------------------------------
//                                     const obj={
//                                         type:'admin',
//                                         kindData:'deleteUser',
//                                         data: 'noDB'
//                                     }
//                                     sendSMS({socket:{0: nS.socket},sms: obj});
//                                 }
//                             });
//                         }else{
//                             const obj={
//                                 type:'admin',
//                                 kindData:'deleteUser',
//                                 data: 'noDirDesconc'
//                             }
//                             sendSMS({socket:{0: nS.socket},sms: obj});
//                         }
//                     })
//                     .catch((error) => {
//                         if(error==='0x002'){
//                             const obj={
//                                 type:'admin',
//                                 kindData:'deleteUser',
//                                 data: 'noAccessDir'
//                             }
//                             sendSMS({socket:{0: nS.socket},sms: obj});
//                         }else if(error==='0x003'){
//                             const obj={
//                                 type:'admin',
//                                 kindData:'deleteUser',
//                                 data: 'noDeleteDir'
//                             }
//                             sendSMS({socket:{0: nS.socket},sms: obj});
//                         }else if(error==='0x004'){
//                             const obj={
//                                 type:'admin',
//                                 kindData:'deleteUser',
//                                 data: 'noDeleteFile'
//                             }
//                             sendSMS({socket:{0: nS.socket},sms: obj});
//                         }else if(error==='0x005'){
//                             const obj={
//                                 type:'admin',
//                                 kindData:'deleteUser',
//                                 data: 'noDirIn'
//                             }
//                             sendSMS({socket:{0: nS.socket},sms: obj});
//                         }else if(error==='0x001'){
//                             const obj={
//                                 type:'admin',
//                                 kindData:'deleteUser',
//                                 data: 'noDirExist'
//                             }
//                             sendSMS({socket:{0: nS.socket},sms: obj});
//                         }else{
//                             const obj={
//                                 type:'admin',
//                                 kindData:'deleteUser',
//                                 data: 'noDeleteDirDesconc'
//                             }
//                             sendSMS({socket:{0: nS.socket},sms: obj});
//                         }
//                     });
//                 }
//             }
//         },
//         fnc_error:(e)=>{//!---------------------[ Fallo la DB ]------------------------------
//             const obj={
//                 type:'admin',
//                 kindData:'deleteUser',
//                 data: 'noDB'
//             }
//             sendSMS({socket:{0: nS.socket},sms: obj});
//         }
//     });

// }

// function deleteDir({root='',errext=true}) {
//     return new Promise((resolve, reject)=>{
//         if(root!==''){
//             fs.access(root, (error) => {
//                 if (error) {
//                     if(errext)
//                     reject(`0x001`);//?---El directorio ${root} no existe.
//                     else resolve(`0x001`);//?---El directorio ${root} no existe.
//                     return;
//                 }

//                 fs.readdir(root, (err, archivos) => {
//                     if (err) {
//                         reject(`0x002`);//?---Error al leer el directorio ${root}.
//                         return;
//                     }

//                     const deleteFile = archivos.map((File) => {
//                         const rootF = path.join(root, File);
//                         return fs.promises.lstat(rootF)
//                             .then((stats) => {
//                                 if (stats.isDirectory()){
//                                     return deleteDir(rootF);
//                                 } else {
//                                     return fs.promises.unlink(rootF);
//                                 }
//                             });
//                     });

//                     Promise.all(deleteFile)
//                         .then(() => {
//                             fs.rmdir(root, (error) => {
//                                 if (error) {
//                                     reject(`0x003`);//?---Error al eliminar el directorio ${root}.
//                                     return;
//                                 }
//                                 resolve(`0x000`);//?---Directorio ${root} eliminado correctamente.
//                             });
//                         })
//                         .catch((error) => {
//                             reject(`0x004`);//?---Error al eliminar archivos del directorio ${root}: ${error}
//                         });
//                 });
//             });
//         }else{
//             reject('0x005');//?---No se ingreso un directorio
//             return;
//         }
//     });
// }

// function FilesOnDir(clientId,data){
//     let nS=clients.get(clientId);

//     if(data.dir==='DigitalFilesUser'){
//         const directorio = `./HTTPServer/DigitalFilesUser/${data.id}`;
//         if (fs.existsSync(directorio)){
//             fs.readdir(directorio, (err, archivos) => {
//                 if (err) {
//                     const obj={
//                         type:'ctrl',
//                         kindData:'FilesOnDir',
//                         data: {
//                             response: 'DigitalFilesUser',
//                             request: 'noRead'
//                         }
//                     }
//                     sendSMS({socket:{0: nS.socket},sms: obj});
//                     return;
//                 }
//                 let ls={};
//                 archivos.forEach(archivo => {
//                     ls[Object.keys(ls).length]=archivo;
//                 });
//                 const obj={
//                     type:'ctrl',
//                     kindData:'FilesOnDir',
//                     data: {
//                         response: 'DigitalFilesUser',
//                         request: 'ls',
//                         ls: ls
//                     }
//                 }
//                 sendSMS({socket:{0: nS.socket},sms: obj});
//             });
//         }else{
//             const obj={
//                 type:'ctrl',
//                 kindData:'FilesOnDir',
//                 data: {
//                     response: 'DigitalFilesUser',
//                     request: 'noDir'
//                 }
//             }
//             sendSMS({socket:{0: nS.socket},sms: obj});
//         }
//     }
// }

// function FileUpload(clientId,data){
//     let nS=clients.get(clientId);

//     //primera parte de un archivo
//     const directorio = `./HTTPServer/DigitalFilesUser/${data.id}`;

//     //!------------------------------[ Si es la primera parte o nuevo archivo ]---------------------------------
//     if((data.part===0&&nS.file.uint8Array===null)||nS.file.name!==data.name){

//         const rootFile = `${directorio}/${data.name}`;

//         //!----------------------[ Existe el archivo ]-----------------------
//         fs.access(rootFile, fs.constants.F_OK, (err) => {
//             if(err){//!---------------------[ No existe, se puede guardar ]----------------------
//                 const ext=data.name.split('.').reverse()[0].toLowerCase();
//                 if(ext==='pdf'||ext==='jpg'||ext==='jpeg'||ext==='png'||ext==='webp'){
//                     //!-------------------------[ Extencion permitida ]-------------------------------
//                     nS.file.id=data.id;
//                     nS.file.name=data.name;
//                     nS.file.part=0;
//                     nS.file.parts=data.parts;
//                     nS.file.uint8Array=new Uint8Array(data.size);

//                     //!-----------------------[ Existe el directorio? ]-------------------------------
//                     if(!fs.existsSync(directorio)){
//                         fs.mkdir(directorio, (err)=>{
//                             if(err){//!------------------[ No existe directorio ]------------------------
//                                 const obj={
//                                     type:'ctrl',
//                                     kindData:'FileUpload',
//                                     data: 'noDir'
//                                 }
//                                 sendSMS({socket:{0: nS.socket},sms: obj});
//                                 return;
//                             }
//                             FileUpload_part(clientId,data);
//                         });
//                     }else{
//                         FileUpload_part(clientId,data);
//                     }
//                 }else{//!-------------------[ No es una extencion permitida ]-----------------------------
//                     const obj={
//                         type:'ctrl',
//                         kindData:'FileUpload',
//                         data: 'noExten'
//                     }
//                     sendSMS({socket:{0: nS.socket},sms: obj});
//                 }
//                 return;
//             }

//             //!--------------------------[ Ya existe el archivo ]----------------------------------
//             const obj={
//                 type:'ctrl',
//                 kindData:'FileUpload',
//                 data: 'yaFile'
//             }
//             sendSMS({socket:{0: nS.socket},sms: obj});
//         });
//     }else if (!fs.existsSync(directorio)){
//         //!----------------------------[ No existe el directorio ]---------------------------------------
//         const obj={
//             type:'ctrl',
//             kindData:'FileUpload',
//             data: 'noDir'
//         }
//         sendSMS({socket:{0: nS.socket},sms: obj});
//     }else{
//         FileUpload_part(clientId,data);
//     }
// }

// function FileUpload_part(clientId,data){
//     let nS=clients.get(clientId);

//     nS.file.part=data.part;
//     nS.file.uint8Array.set(Object.values(data.buffer),Object.keys(data.buffer)[0]);
//     let save=false;
//     if(nS.file.part<nS.file.parts){
//         if(nS.file.part===nS.file.parts-1) save=true;
//         else{
//             const obj={
//                 type:'ctrl',
//                 kindData:'FileUpload',
//                 data: 'nextPart'
//             }
//             sendSMS({socket:{0: nS.socket},sms: obj});
//         }
//     }

//     if(save){
//         // const ext=nS.file.name.split('.').reverse()[0];
//         fs.writeFile(`./HTTPServer/DigitalFilesUser/${data.id}/${nS.file.name}`, nS.file.uint8Array, (err) => {
//             if(err){
//                 const obj={
//                     type:'ctrl',
//                     kindData:'FileUpload',
//                     data: 'failSave'
//                 }
//                 sendSMS({socket:{0: nS.socket},sms: obj});
//                 return;
//             }
//             nS.file.uint8Array=null;
//             const obj={
//                 type:'ctrl',
//                 kindData:'FileUpload',
//                 data: 'nextFile'
//             }
//             sendSMS({socket:{0: nS.socket},sms: obj});

//         });
//     }
// }

// /*-----------------------------------------------------------------
// //!                   Funciones envio mensaje
// -----------------------------------------------------------------*/
// //TODO------------------------------[ Enviar mensaje a un socket cliente ]-------------------------------------------------
// function sendSMS({socket={},group={},sms={}}){
//     let sendo=true;
//     let alertNosend='';
//     if(!isObj(socket)||!isObj(group)){ sendo=false;alertNosend='No es un socket correcto el remitente'}
//     if(Object.keys(socket).length<=0&&Object.keys(group).length<=0){ sendo=false;alertNosend='No hay un socket a quien enviar el mensaje'}
//     if(typeof(sms)!=='object'||typeof(sms.type)!=='string'||typeof(sms.kindData)!=='string'||(typeof(sms.data)!=='string'&&typeof(sms.data)!=='object'&&sms.data!==null)){ sendo=false;alertNosend=`<div>El mensaje no tiene la estructura correcta:</div><div>${(typeof(sms)==='object'&&sms!==null)?JSON.stringify(sms):sms}</div>`; }

//     if(sendo){
//         for(let i in socket){
//             try{
//                 socket[i].send(OBJtoB64(sms));
//             }catch(e){
//                 printError({title:`No fue posible enviar un mensaje`,content:`${e}`,advance:true});
//             }
//         }
//         for(let i in group){
//             if(typeof(GranthGroup[group[i]])){
//                 for(let e in GranthGroup[group[i]]){
//                     const c=clients.get(e);
//                     try{
//                         c.socket.send(OBJtoB64(sms));
//                     }catch(er){
//                         printError({title:`No fue posible enviar un mensaje`,content:`${er}`,advance:true});
//                     }
//                 }
//             }
//         }
//     }else printError({title:`El mensaje no se puede enviar`,content:`${alertNosend}`,advance:true});
// }

// /*-----------------------------------------------------------------
// //!                   Funciones control interno server
// -----------------------------------------------------------------*/

// /*-----------------------------------------------------------------
// //!                   Funciones recepcion mensaje
// -----------------------------------------------------------------*/

// //TODO----------------------------------[ El cliente cerro su sesion ]-------------------------------------------------
// function noClientId(clientId){
//     let nS=clients.get(clientId);//*Obtenemos la info del cliente
//     const oldname=nS.name;

//     //?-------------Estructura datos cliente en el server.
//     delete nS.group;

//     clients.set(clientId,{
//         name:`Invitado${clientId}`,//*Nombre del cliente
//         socket: nS.socket, //*Socket para comunicar con el cliente
//         group: {}, //*Grupos a los que pertenece
//         file: nS.file
//     });

//     //?-------------Agregamos el clinete al grupo
//     setInterGroup(clientId,'nologin');

//     nS=clients.get(clientId);
//     printError({title:`[ ${oldname} ] Cerro su sesión volvio a ser: [ ${nS.name} ].`});
// }

// //TODO-----------------------------------------[Cambia Informacion user]---------------------------------------------------------------
// function changeDataUser(clientId,data){
//     const nS=clients.get(clientId);
//     printLog({title:`[ ${nS.name} ] Esta solicitando cambiar datos de usuario`});
//     const valid=validarToken(data.token,clients);
//     const tk=parseToken(data.token);
//     if(valid){
//         if(typeof(data.user)==='undefined'){ //mismo usuario
//             //contraseña
//             let laquery='';
//             if(typeof(data.pass)!=='undefined'&&typeof(data.oldpass)!=='undefined'){
//                 laquery=`pass="${data.pass}", upass="0" `;
//             }

//             if(laquery!==''){
//                 query({
//                     vr_query: `SELECT pass FROM user WHERE id="${tk.id}" LIMIT 1;`,
//                     fnc_success: (r)=>{
//                         if(r.length==1){
//                             if(typeof(data.oldpass)==='undefined'||r[0].pass===data.oldpass){
//                                 query({
//                                     vr_query: `UPDATE user set ${laquery} WHERE id="${tk.id}"`,
//                                     fnc_success: (r)=>{
//                                         var obj={
//                                             type: 'admin',
//                                             kindData: 'changeDataUser',
//                                             data: 'Success'
//                                         };
//                                         sendSMS({socket:{0: nS.socket},sms: obj});
//                                         printLog({title:'Cambio los datos correctamente'});
//                                     }
//                                 });
//                             }else{
//                                 printError({title:'No esta correcta la contraseña'})
//                                 var obj={
//                                     type: 'admin',
//                                     kindData: 'changeDataUser',
//                                     data: 'NoPass'
//                                 };
//                                 sendSMS({socket:{0: nS.socket},sms: obj});
//                             }
//                         }else{
//                             printError({title:'El usuario no existe'})
//                             var obj={
//                                 type: 'admin',
//                                 kindData: 'changeDataUser',
//                                 data: 'NoUser'
//                             };
//                             sendSMS({socket:{0: nS.socket},sms: obj});
//                         }
//                     }
//                 });
//             }else{
//                 printLog({title:'No hay datos que cambiar.'});
//                 var obj={
//                     type: 'admin',
//                     kindData: 'changeDataUser',
//                     data: 'NoData'
//                 };
//                 sendSMS({socket:{0: nS.socket},sms: obj});
//             }
//         }else{//otro usuario

//         }
//     }else{
//         printError({title:'Su token no es valido'});
//         var obj={
//             type: 'admin',
//             kindData: 'changeDataUser',
//             data: 'NoToken'
//         };
//         sendSMS({socket:{0: nS.socket},sms: obj});
//     }
// }

// //TODO----------------------------------[ Crear un nuevo usuario ]-------------------------------------------------
// function neoUser(clientId,data){
//     const nS=clients.get(clientId);//*Obtenemos la info del cliente

//     if(data.ctrl==='link'){
//         query({//!---------------------[ Se obtienen todas las claves de `kind` ]---------------------------
//             vr_query:`SELECT * FROM user WHERE id="${data.user}";`,
//             fnc_success:(r)=>{
//                 if(r.length==1){
//                     query({//!---------------------[ Verificamos que no exista ]---------------------------
//                         vr_query:`SELECT id FROM user WHERE user="${r[0].user}" AND kind="${data.kind}";`,
//                         fnc_success:(r2)=>{
//                             if(r2.length===0){
//                                 const userX=r[0].user.split(' ')[0];
//                                 const nameX=(r[0].name!==null)?r[0].name:'';
//                                 const appX=(r[0].last_name!==null)?`${r[0].last_name.split(' ')[0]} ${r[0].last_name.split(' ')[1]}`:'';
//                                 query({//!---------------------[ Se inserta el nuevo usuario link ]---------------------------
//                                     vr_query: `INSERT INTO user (id,kind,user,name,last_name,pass,upass,permissions,clave,link) VALUES (null,"${data.kind}","${userX}","${nameX}","${appX}","${r[0].pass}",${r[0].upass},"","${r[0].clave}","${data.user}")`,
//                                     fnc_success: (r3)=>{
//                                         const obj={
//                                             type: 'admin',
//                                             kindData: 'neoUser',
//                                             data: {
//                                                 id: r3.insertId,
//                                                 user: r[0].user,
//                                                 link: parseInt(data.user)
//                                             }
//                                         };
//                                         sendSMS({socket:{0: nS.socket},sms: obj});
//                                     },
//                                     fnc_error:(e)=>{//!----------------------------[ Fallo la DB ]---------------------------------------
//                                         const obj={
//                                             type: 'admin',
//                                             kindData: 'neoUser',
//                                             data: 'noDB'
//                                         };
//                                         sendSMS({socket:{0: nS.socket},sms: obj});
//                                     }
//                                 });
//                             }else{
//                                 const obj={
//                                     type: 'admin',
//                                     kindData: 'neoUser',
//                                     data: 'yaUser'
//                                 };
//                                 sendSMS({socket:{0: nS.socket},sms: obj});
//                             }
//                         },
//                         fnc_error:(e)=>{//!----------------------------[ Fallo la DB ]---------------------------------------
//                             const obj={
//                                 type:'login',
//                                 kindData:'neoUser',
//                                 data: 'noDB'
//                             }
//                             sendSMS({socket:{0: nS.socket},sms: obj});
//                         }
//                     });
//                 }else{
//                     const obj={
//                         type:'login',
//                         kindData:'neoUser',
//                         data: 'noUser'
//                     }
//                     sendSMS({socket:{0: nS.socket},sms: obj});
//                 }
//             },
//             fnc_error:(e)=>{//!----------------------------[ Fallo la DB ]---------------------------------------
//                 const obj={
//                     type:'login',
//                     kindData:'neoUser',
//                     data: 'noDB'
//                 }
//                 sendSMS({socket:{0: nS.socket},sms: obj});
//             }
//         });
//     }else if(data.ctrl==='data'){
//         query({//!---------------------[ Verificamos que no exista ]---------------------------
//             vr_query:`SELECT id FROM user WHERE user="${data.user}" AND kind="${data.kind}";`,
//             fnc_success:(r)=>{
//                 if(r.length==0){
//                     query({//!---------------------[ Se obtienen todas las claves de `kind` ]---------------------------
//                         vr_query:`SELECT clave FROM user WHERE kind="${data.kind}" AND link!="0";`,
//                         fnc_success:(r2)=>{
//                             let claves=[];
//                             if(r2.length>0){
//                                 for(let i in r2){
//                                     claves.push(r2[i].clave);
//                                 }
//                             }
//                             //!---------------------[ Generamos una nueva clave ]---------------------------
//                             let clv=generateClave(claves);
//                             const userX=data.user.split(' ')[0];
//                             const nameX=data.name;
//                             const appX=`${data.surnameP.split(' ')[0]} ${data.surnameM.split(' ')[0]}`;
//                             query({//!---------------------[ Se inserta el nuevo usuario ]---------------------------
//                                 vr_query: `INSERT INTO user (id,kind,user,name,last_name,pass,upass,permissions,clave,link) VALUES (null,"${data.kind}","${userX}","${nameX}","${appX}","${data.pass}",1,"","${clv}",0)`,
//                                 fnc_success: (r3)=>{
//                                     const obj={
//                                         type: 'admin',
//                                         kindData: 'neoUser',
//                                         data: {
//                                             id: r3.insertId,
//                                             user: data.user,
//                                             link: 0
//                                         }
//                                     };
//                                     sendSMS({socket:{0: nS.socket},sms: obj});
//                                 },
//                                 fnc_error:(e)=>{//!----------------------------[ Fallo la DB ]---------------------------------------
//                                     const obj={
//                                         type: 'admin',
//                                         kindData: 'neoUser',
//                                         data: 'noDB'
//                                     };
//                                     sendSMS({socket:{0: nS.socket},sms: obj});
//                                 }
//                             });
//                         },
//                         fnc_error:(e)=>{//!----------------------------[ Fallo la DB ]---------------------------------------
//                             const obj={
//                                 type:'login',
//                                 kindData:'neoUser',
//                                 data: 'noDB'
//                             }
//                             sendSMS({socket:{0: nS.socket},sms: obj});
//                         }
//                     });
//                 }else{
//                     const obj={
//                         type: 'admin',
//                         kindData: 'neoUser',
//                         data: 'yaUser'
//                     };
//                     sendSMS({socket:{0: nS.socket},sms: obj});
//                 }
//             },
//             fnc_error:(e)=>{//!----------------------------[ Fallo la DB ]---------------------------------------
//                 const obj={
//                     type:'login',
//                     kindData:'neoUser',
//                     data: 'noDB'
//                 }
//                 sendSMS({socket:{0: nS.socket},sms: obj});
//             }
//         });
//     }
// }

// function getUsers(clientId,data){
//     const nS=clients.get(clientId);
//     let callback='';
//     let where='';
//     if(typeof(data.data)!=='undefined'){
//         let first=true;
//         if(typeof(data.data.id)!=='undefined'){callback=`id`;first=false;}
//         if(typeof(data.data.kind)!=='undefined'){callback=`${callback}${(!first)?',':''}kind`;first=false;}
//         if(typeof(data.data.user)!=='undefined'){callback=`${callback}${(!first)?',':''}user`;first=false;}
//         if(typeof(data.data.name)!=='undefined'){callback=`${callback}${(!first)?',':''}name`;first=false;}
//         if(typeof(data.data.last_name)!=='undefined'){callback=`${callback}${(!first)?',':''}last_name`;first=false;}
//         if(typeof(data.data.pass)!=='undefined'){callback=`${callback}${(!first)?',':''}pass`;first=false;}
//         if(typeof(data.data.upass)!=='undefined'){callback=`${callback}${(!first)?',':''}upass`;first=false;}
//         if(typeof(data.data.permissions)!=='undefined'){callback=`${callback}${(!first)?',':''}permissions`;first=false;}
//         if(typeof(data.data.clave)!=='undefined'){callback=`${callback}${(!first)?',':''}clave`;first=false;}
//     }else{
//         callback='*'
//     }
//     if(isObj(data.w.where)){
//         if(typeof(data.w.where.link)==='number'&&typeof(data.w.where.suche)==='string'&&typeof(data.w.where.filter)==='string'){
//             let first=true;
//             if(data.w.where.link===0){
//                 where=`WHERE link="0" `;
//                 first=false;
//             }
//             if(data.w.where.suche!==''){
//                 where=`${where}${(first)?'WHERE ':'AND '}(name like "%${data.w.where.suche}%" OR user like "%${data.w.where.suche}%" OR last_name like "%${data.w.where.suche}%") `;
//                 first=false;
//             }
//             if(data.w.where.filter!=='alle'&&data.w.where.filter!==''){
//                 where=`${where}${(first)?'WHERE ':'AND '}kind="${data.w.where.filter}" `;
//                 first=false;
//             }
//         }
//     }

//     let orderby=(typeof(data.w.order)==='string'&&data.w.order!=='')?`ORDER BY ${data.w.order} ASC`:``;
//     let lmt=(typeof(data.w.limit)==='number'&&typeof(data.w.offset)==='number'&&data.w.limit>0)?`LIMIT ${data.w.limit} OFFSET ${data.w.offset}`:``;

//     let qry=`SELECT ${callback} FROM user ${where} ${orderby} ${lmt};`;
//     let qryN=`SELECT count(id) AS tam FROM user ${where} ${orderby};`;
//     qry=qry.replace(/[\s]+/g,' ');
//     qryN=qryN.replace(/[\s]+/g,' ');
//     query({
//         vr_query: qryN,
//         fnc_success: (n)=>{
//             if(n[0].tam>0){
//                 query({
//                     vr_query: qry,
//                     fnc_success: (r)=>{
//                         let dts={
//                             count: 0,
//                             length: n[0].tam,
//                             row: {

//                             },
//                             callback: data.callback
//                         }
//                         if(r.length>0){
//                             for(let i in r){
//                                 dts.row[Object.keys(dts.row).length]=copyObj(r[i]);
//                             }
//                         }
//                         query({
//                             vr_query: `SELECT count(id) AS registros FROM user WHERE link="0"`,
//                             fnc_success: (r)=>{
//                                 dts.count=r[0].registros;
//                                 const obj={
//                                     type: 'admin',
//                                     kindData: 'getUsers',
//                                     data: dts
//                                 };
//                                 sendSMS({socket:{0: nS.socket},sms: obj});
//                             },
//                             fnc_error:(e)=>{//!----------------------------[ Fallo la DB ]---------------------------------------
//                                 const obj={
//                                     type:'admin',
//                                     kindData:'getUsers',
//                                     data: 'noDB'
//                                 }
//                                 sendSMS({socket:{0: nS.socket},sms: obj});
//                             }
//                         });
//                     }
//                 });
//             }else{
//                 const obj={
//                     type:'admin',
//                     kindData:'getUsers',
//                     data: 'noResults'
//                 }
//                 sendSMS({socket:{0: nS.socket},sms: obj});
//             }
//         },
//         fnc_error:(e)=>{//!----------------------------[ Fallo la DB ]---------------------------------------
//             const obj={
//                 type:'admin',
//                 kindData:'getUsers',
//                 data: 'noDB'
//             }
//             sendSMS({socket:{0: nS.socket},sms: obj});
//         }
//     });
// }

// function setUsersInfo(clientId,data){
//     const nS=clients.get(clientId);
//     let DataParse={
//         user:(typeof(data.user)!=='number')?0:data.user,
//         AP:(typeof(data.AP)!=='string')?'':data.AP,
//         AM:(typeof(data.AM)!=='string')?'':data.AM,
//         name:(typeof(data.name)!=='string')?'':data.name,
//         edad:(typeof(data.edad)!=='string')?0:data.edad,
//         nation:(typeof(data.nation)!=='string')?'':data.nation,
//         sex:(typeof(data.sex)!=='string')?2:data.sex,
//         stateCivil:(typeof(data.stateCivil)!=='string')?'NonDef':data.stateCivil,
//         address:{
//             lvl1:(typeof(data.address.lvl1)!=='string')?'':data.address.lvl1,
//             lvl2:(typeof(data.address.lvl2)!=='string')?'':data.address.lvl2,
//         },
//         area:{
//             lvl1:(typeof(data.area.lvl1)!=='string')?'':data.area.lvl1,
//             lvl2:(typeof(data.area.lvl2)!=='string')?'':data.area.lvl2,
//             lvl3:(typeof(data.area.lvl3)!=='string')?'':data.area.lvl3,
//         },
//         cp:(typeof(data.cp)!=='string')?'':data.cp,
//         numtel:(typeof(data.numtel)!=='string')?'':data.numtel,
//         mail:(typeof(data.mail)!=='string')?'':data.mail,
//         curp:(typeof(data.curp)!=='string')?'':data.curp,
//         afore:(typeof(data.afore)!=='string')?'':data.afore,
//         RFC:(typeof(data.RFC)!=='string')?'':data.RFC,
//         CM:(typeof(data.CM)!=='string')?'':data.CM,
//         NSS:(typeof(data.NSS)!=='string')?'':data.NSS,
//         LicCon:(typeof(data.LicCon)!=='string')?2:data.LicCon
//     }

//     try{
//         DataParse.edad=parseInt(DataParse.edad);
//         if(isNaN(DataParse.edad)){
//             DataParse.edad=0;
//         }else if(DataParse.edad<0||DataParse.edad>200){
//             DataParse.edad=0;
//         }
//     }catch(error){
//         DataParse.edad=0;
//     }

//     try{
//         DataParse.sex=parseInt(DataParse.sex);
//         if(isNaN(DataParse.sex)){
//             DataParse.sex=2;
//         }else if(DataParse.sex!=0&&DataParse.sex!=1&&DataParse.sex!=2){
//             DataParse.sex=2;
//         }
//     }catch(error){
//         DataParse.sex=2;
//     }

//     try{
//         DataParse.LicCon=parseInt(DataParse.LicCon);
//         if(isNaN(DataParse.LicCon)){
//             DataParse.LicCon=2;
//         }else if(DataParse.LicCon!=0&&DataParse.LicCon!=1&&DataParse.LicCon!=2){
//             DataParse.LicCon=2;
//         }
//     }catch(error){
//         DataParse.LicCon=2;
//     }

//     if(DataParse.stateCivil===''||
//     (DataParse.stateCivil!=='Soltero'&&DataParse.stateCivil!=='Casado'&&DataParse.stateCivil!=='Divorciado'&&DataParse.stateCivil!=='Viudo'&&DataParse.stateCivil!=='UnionLibre')){
//         DataParse.stateCivil='NonDef';
//     }

//     if(DataParse.user>0){
//         query({
//             vr_query: `UPDATE user SET name="${DataParse.name}",last_name="${DataParse.AP} ${DataParse.AM}" WHERE id="${DataParse.user}";`,
//             fnc_success: (r)=>{
//                 if(r.affectedRows>0){
//                     query({
//                         vr_query: `SELECT user FROM user_data WHERE user="${DataParse.user}";`,
//                         fnc_success: (r)=>{
//                             if(r.length>0){ //!---------------------------[ Ya existe una info ]-------------------------------------
//                                 query({
//                                     vr_query: `UPDATE user_data SET
//                                     edad="${DataParse.edad}",dir_lvl1="${DataParse.address.lvl1}",dir_lvl2="${DataParse.address.lvl2}",area_lvl1="${DataParse.area.lvl1}",area_lvl2="${DataParse.area.lvl2}",area_lvl3="${DataParse.area.lvl3}",CP="${DataParse.cp}",num_tel="${DataParse.numtel}",mail="${DataParse.mail}",sexo="${DataParse.sex}",nat="${DataParse.nation}",stCiv="${DataParse.stateCivil}",curp="${DataParse.curp}",AFORE="${DataParse.afore}",RFC="${DataParse.RFC}",licMan="${DataParse.LicCon}",CarSerMil="${DataParse.CM}",SegSoc="${DataParse.NSS}"
//                                     WHERE user="${DataParse.user}";`,
//                                     fnc_success: (r)=>{
//                                         if(r.affectedRows>0){
//                                             const obj={
//                                                 type:'admin',
//                                                 kindData:'setUsersInfo',
//                                                 data: 'success'
//                                             }
//                                             sendSMS({socket:{0: nS.socket},sms: obj});
//                                         }else{
//                                             const obj={
//                                                 type:'admin',
//                                                 kindData:'setUsersInfo',
//                                                 data: 'noUpdate'
//                                             }
//                                             sendSMS({socket:{0: nS.socket},sms: obj});
//                                         }
//                                     },
//                                     fnc_error:(e)=>{//!----------------------------[ Fallo la DB ]---------------------------------------
//                                         const obj={
//                                             type:'admin',
//                                             kindData:'setUsersInfo',
//                                             data: 'noDB'
//                                         }
//                                         sendSMS({socket:{0: nS.socket},sms: obj});
//                                     }
//                                 });
//                             }else{ //!-----------------------------------------[ No existe info ]--------------------------------------------------
//                                 query({
//                                     vr_query: `INSERT INTO user_data
//                                         (user,edad,dir_lvl1,dir_lvl2,area_lvl1,area_lvl2,area_lvl3,CP,num_tel,mail,sexo,nat,stCiv,curp,AFORE,RFC,licMan,CarSerMil,SegSoc)
//                                     VALUES ("${DataParse.user}","${DataParse.edad}","${DataParse.address.lvl1}","${DataParse.address.lvl2}","${DataParse.area.lvl1}","${DataParse.area.lvl2}","${DataParse.area.lvl3}","${DataParse.cp}","${DataParse.numtel}","${DataParse.mail}","${DataParse.sex}","${DataParse.nation}","${DataParse.stateCivil}","${DataParse.curp}","${DataParse.afore}","${DataParse.RFC}","${DataParse.LicCon}","${DataParse.CM}","${DataParse.NSS}");`,
//                                     fnc_success: (r)=>{
//                                         if(r.affectedRows>0){
//                                             const obj={
//                                                 type:'admin',
//                                                 kindData:'setUsersInfo',
//                                                 data: 'success'
//                                             }
//                                             sendSMS({socket:{0: nS.socket},sms: obj});
//                                         }else{
//                                             const obj={
//                                                 type:'admin',
//                                                 kindData:'setUsersInfo',
//                                                 data: 'noUpdate'
//                                             }
//                                             sendSMS({socket:{0: nS.socket},sms: obj});
//                                         }
//                                     },
//                                     fnc_error:(e)=>{//!----------------------------[ Fallo la DB ]---------------------------------------
//                                         const obj={
//                                             type:'admin',
//                                             kindData:'setUsersInfo',
//                                             data: 'noDB'
//                                         }
//                                         sendSMS({socket:{0: nS.socket},sms: obj});
//                                     }
//                                 });
//                             }
//                         },
//                         fnc_error:(e)=>{//!----------------------------[ Fallo la DB ]---------------------------------------
//                             const obj={
//                                 type:'admin',
//                                 kindData:'setUsersInfo',
//                                 data: 'noDB'
//                             }
//                             sendSMS({socket:{0: nS.socket},sms: obj});
//                         }
//                     });

//                 }else{
//                     const obj={
//                         type:'admin',
//                         kindData:'setUsersInfo',
//                         data: 'noUser'
//                     }
//                     sendSMS({socket:{0: nS.socket},sms: obj});
//                 }
//             },
//             fnc_error:(e)=>{//!----------------------------[ Fallo la DB ]---------------------------------------
//                 const obj={
//                     type:'admin',
//                     kindData:'setUsersInfo',
//                     data: 'noDB'
//                 }
//                 sendSMS({socket:{0: nS.socket},sms: obj});
//             }
//         });
//     }else{
//         const obj={
//             type:'admin',
//             kindData:'setUsersInfo',
//             data: 'noUser'
//         }
//         sendSMS({socket:{0: nS.socket},sms: obj});
//     }
// }

// function getUsersInfo(clientId,id){
//     const nS=clients.get(clientId);
//     query({
//         vr_query: `SELECT * FROM user WHERE id="${id}" LIMIT 1;`,
//         fnc_success: (n)=>{
//             if(n.length==1){
//                 let rt={
//                     user: {
//                         name: n[0].name,
//                         last_name: n[0].last_name
//                     },
//                     info: {},
//                     action: ''
//                 }
//                 query({
//                     vr_query: `SELECT * FROM user_data WHERE user="${id}" LIMIT 1;`,
//                     fnc_success: (r)=>{
//                         if(r.length==0){
//                             rt.action='noInfo';
//                             const obj={
//                                 type:'admin',
//                                 kindData:'getUsersInfo',
//                                 data: copyObj(rt)
//                             }
//                             sendSMS({socket:{0: nS.socket},sms: obj});
//                         }else{
//                             rt.info=copyObj(r[0]);
//                             rt.action='siInfo';
//                             const obj={
//                                 type:'admin',
//                                 kindData:'getUsersInfo',
//                                 data: copyObj(rt)
//                             }
//                             sendSMS({socket:{0: nS.socket},sms: obj});
//                         }
//                     },
//                     fnc_error:(e)=>{//!----------------------------[ Fallo la DB ]---------------------------------------
//                         const obj={
//                             type:'admin',
//                             kindData:'getUsersInfo',
//                             data: 'noDB'
//                         }
//                         sendSMS({socket:{0: nS.socket},sms: obj});
//                     }
//                 });
//             }else{
//                 const obj={
//                     type:'admin',
//                     kindData:'getUsersInfo',
//                     data: 'noExist'
//                 }
//                 sendSMS({socket:{0: nS.socket},sms: obj});
//             }
//         },
//         fnc_error:(e)=>{//!----------------------------[ Fallo la DB ]---------------------------------------
//             const obj={
//                 type:'admin',
//                 kindData:'getUsersInfo',
//                 data: 'noDB'
//             }
//             sendSMS({socket:{0: nS.socket},sms: obj});
//         }
//     });
// }

// function disconnectClient(vr_user,vr_info){
//     let data={
//         type:'error',
//         title:'Desconectado',
//         sms:'Fuiste desconectado por el servidor.',
//         time:'10'
//     };
//     if(typeof(vr_info)==='object'){
//         if(typeof(vr_info.type)!=='undefined') data.type=vr_info.type;
//         if(typeof(vr_info.title)!=='undefined') data.title=vr_info.title;
//         if(typeof(vr_info.sms)!=='undefined') data.sms=vr_info.sms;
//         if(typeof(vr_info.time)!=='undefined') data.time=vr_info.time;
//     }
//     if(clients.size>0){
//         if(vr_user==='$alle*'){
//             for (const v of clients.values()) {
//                 printLog({title:`Desconectando: [${v.name}]`});
//                 const tk={
//                     type:'ctrl',
//                     kindData:'DisconnectedByServer',
//                     data: data
//                 }
//                 try{
//                     sendSMS({socket:{0: v.socket},sms: tk});
//                 }catch(e){
//                     printError({title:`No fue posible desconectar: [${v.name}]`});
//                 }
//             }
//         }
//     }
// }

// function logOutClient(vr_user,vr_info){
//     let data={
//         type:'error',
//         title:'Sesión cerrada',
//         sms:'Tu sessión fue cerrada por el servidor.',
//         time:'10'
//     };
//     if(typeof(vr_info)==='object'){
//         if(typeof(vr_info.type)!=='undefined') data.type=vr_info.type;
//         if(typeof(vr_info.title)!=='undefined') data.title=vr_info.title;
//         if(typeof(vr_info.sms)!=='undefined') data.sms=vr_info.sms;
//         if(typeof(vr_info.time)!=='undefined') data.time=vr_info.time;
//     }
//     printLog({title:'Deslogeando Clientes'});
//     if(clients.size>0){
//         if(vr_user==='$alle*'){
//             for (const v of clients.values()) {
//                 printLog({title:`Deslogeando: [${v.name}]`});
//                 const tk={
//                     type:'ctrl',
//                     kindData:'logoutByServer',
//                     data: data
//                 }
//                 try{
//                     sendSMS({socket:{0: v.socket},sms: tk});
//                 }catch(e){
//                     printError({title:`No fue posible deslogear: [${v.name}]`});
//                 }
//             }
//         }
//     }
// }
// function getClients(){
//     return clients;
// }

// function getSocket(){
//     return socket;
// }
module.exports = {
	start,
	close,
	// logOutClient,
	// disconnectClient,
	// getClients,
	// getSocket,
	
	// errorDB
};
