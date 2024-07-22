const native=global.native;
const ws=global.ws;
const db=global.db;

//TODO---------------------------------------[ Usuario Obtiene un token ]--------------------------------------------------------
function getToken(nS,sms){

    native.printLog({title:`[ ${nS.name} ] Esta pidiendo un Token de sesión.`});
    /*
    ? Tiene que tener la siguiente Estructura:
    ? user:string
    ? tipo:string
    ? pass:string
    ? clave:string
    */
   //!--------------------------------------Enviamos al cliente que no envio bien las credenciales
    if(typeof(sms.user)!='string'||typeof(sms.tipo)!='string'||typeof(sms.pass)!='string'&&typeof(sms.clave)!='string'){
        ws.sendSMS({socket:{0: nS.socket},sms: {
            type:'login',
            kindData: 'getToken',
            data:'noData'
        }});
        native.printError({title:`[ ${nS.name} ] No recibio correctamente las credenciales.`});
		return;
    }

	//?-----------------------[ Inicia sesion con clave ]---------------------------
	if(sms.user==''&&sms.pass==''&&sms.clave!=''){
		db.select({
			table: "user",
			columns: "*",
			where: {
				kind: {
					d: `${sms.tipo}`
				},
				clave: {
					d: `${sms.clave}`
				}
			},
			limit: 1
		}).then(r=>{
			if(r.length==1){//!---------------------[ Enviamos token ]------------------------------
				
				//!---------------------[ Creamos token ]------------------------------
				let [token,secretKey]=native.createToken({
					id: r[0].id,
					user: r[0].user,
					name: r[0].name,
					upass: r[0].upass,
					kind: r[0].kind,
					permis: r[0].permissions,
					idws: clientId
				},86400);
				let oldName=nS.name;
				//!---------------------[ Actualizamos Cliente info en server ]------------------------------
				nS.name=r[0].user,//*Nombre del cliente logueado
				nS.token=secretKey,//*Token Sesion

				nS.removeGroup('nologin');
				nS.addGroup('silogin');

				native.printLog({title:`[ ${oldName} ] inicio sesion como: [ ${nS.name} ].`});
				ws.sendSMS({socket:{0: nS.socket},sms: {
					type:'login',
					kindData:'getToken',
					data: token
				}});
			}else{//!---------------------[ No existe un usario `kind` `clave` ]------------------------------
				ws.sendSMS({socket:{0: nS.socket},sms: {
					type:'login',
					kindData:'getToken',
					data: 'noUser'
				}});
			}
		}).catch(e=>{
			ws.errorDB({0: nS.socket},e);
		});
		
	}else 
	//?-----------------------[ inicia sesion con credenciales ]---------------------------
	if(sms.user!=''&&sms.pass!=''&&sms.clave==''){
		db.select({
			table: "user",
			columns: "*",
			where: {
				user: {
					d: `${sms.user}`
				},
				kind: {
					d: `${sms.tipo}`
				}
			},
			limit: 1
		}).then(r=>{
			if(r.length==0){//!---------------------[ No existe Usuario ]-----------------------------
				//!---------------------[ Verificamos si es admin@admin¬Admin ]------------------------------
				if(sms.user=='admin'&&sms.pass=='8C6976E5B5410415BDE908BD4DEE15DFB167A9C873FC4BB8A81F6F2AB448A918'&&sms.tipo=='Admin'){
					const permissklo='111111.1111';//*permisos del usuario admin "full permisos"
					query({//!---------------------[ Obtenemos todas las claves existentes `kind` ]------------------------------
						vr_query:`SELECT clave FROM user WHERE kind="${sms.tipo}" AND link!="0";`,
						fnc_success:(r)=>{
							let claves=[];
							if(r.length>0){
								for(let i in r){
									claves.push(r[i].clave);
								}
							}
							//!---------------------[ Generamos una sin que se repita ]------------------------------
							let clv=generateClave(claves);
							query({//!---------------------[ Creamos el primer user admin@admin¬Admin ]------------------------------
								vr_query:`INSERT INTO user(id,kind,user,name,pass,upass,permissions,clave,link) VALUES (NULL,"Admin","admin","Administrador","${sms.pass}",${true},"${permissklo}","${clv}",'0');`,
								fnc_success:(rs)=>{//!---------------------[ Enviamos token ]------------------------------
									let token={//!---------------------[ Creamos token ]------------------------------
										id: rs.insertId,
										user: 'admin',
										name: "Administrador",
										upass: 1,
										kind: "Admin",
										permis: permissklo,
										idws: clientId
									};
									let oldName=nS.name;

									//!---------------------[ Actualizamos Cliente info en server ]------------------------------

									clients.set(clientId,{
										name: token.user,//*Nombre del cliente logueado
										socket: nS.socket,//*socket del cliente
										token: btoa(JSON.stringify(token,null,2)),//*Token Sesion
										group: nS.group,//*Grupos a los que pertenece
										file: nS.file
									});

									removeInterGroup(clientId,'nologin');
									setInterGroup(clientId,'silogin');

									nS=clients.get(clientId);
									printLog({title:`[ ${oldName} ] inicio sesion como: [ ${nS.name} ].`});
									token=btoa(JSON.stringify(token,null,2));
									const tk={
										type:'login',
										kindData:'getToken',
										data: token
									}
									sendSMS({socket:{0: nS.socket},sms: tk});
								},
								fnc_error:(e)=>{//!---------------------[ Fallo la DB ]------------------------------
									const tk={
										type:'login',
										kindData:'getToken',
										data: 'noDB'
									}
									sendSMS({socket:{0: nS.socket},sms: tk});
								}
							});
						},
						fnc_error:(e)=>{//!---------------------[ Fallo la DB ]------------------------------
							const tk={
								type:'login',
								kindData:'getToken',
								data: 'noDB'
							}
							sendSMS({socket:{0: nS.socket},sms: tk});
						}
					});
				}else{//!---------------------[ No existe el usuario y no es admin ]------------------------------
					const tk={
						type:'login',
						kindData:'getToken',
						data: 'noUser'
					}
					sendSMS({socket:{0: nS.socket},sms: tk});
				}
			}else{//!---------------------[ Existe usuario ]------------------------------
				if(r[0].pass==sms.pass){//!---------------------[ La contraseña es correcta ]------------------------------
					//!---------------------[ Enviamos Token ]------------------------------
					let token={//!---------------------[ Creamos token ]------------------------------
						id: r[0].id,
						user: r[0].user,
						name: r[0].name,
						upass: r[0].upass,
						kind: r[0].kind,
						permis: r[0].permissions,
						idws: clientId
					};
					let oldName=nS.name;
					
					//!---------------------[ Actualizamos Cliente info en server ]------------------------------

					clients.set(clientId,{
						name: token.user,//*Nombre del cliente logueado
						socket: nS.socket,//*socket del cliente
						token: btoa(JSON.stringify(token,null,2)),//*Token Sesion
						group: nS.group,//*Grupos a los que pertenece
						file: nS.file
					});

					removeInterGroup(clientId,'nologin');
					setInterGroup(clientId,'silogin');

					nS=clients.get(clientId);
					printLog({title:`[ ${oldName} ] inicio sesion como: [ ${nS.name} ].`});
					token=btoa(JSON.stringify(token,null,2));
					const tk={
						type:'login',
						kindData:'getToken',
						data: token
					}
					sendSMS({socket:{0: nS.socket},sms: tk});
				}else{//!---------------------[ La contraseña no es correcta ]------------------------------
					const tk={
						type:'login',
						kindData:'getToken',
						data: 'noPass'
					}
					sendSMS({socket:{0: nS.socket},sms: tk});
				}
			}
		}).catch(e=>{
			ws.errorDB({0: nS.socket},e);
		});
	}else{//!--------------------------------------Enviamos al cliente que no envio bien las credenciales
		const tk={
			type:'login',
			kindData: 'getToken',
			data:'noData'
		}
		sendSMS({socket:{0: nS.socket},sms: tk});
		printError({title:`[ ${nS.name} ] No recibio correctamente las credenciales.`});
	}
}

//TODO------------------------------------[ Cliente actualiza su token de sesion ]--------------------------------------------------------------------
function updateToken(clientId,tokenData){
    let nS=clients.get(clientId);//*Obtenemos la info del cliente

    printLog({title:`[ ${nS.name} ] Solicita una actualización de token.`});

    //?-----------------------[ Parseamos el token ]--------------------------------
    const tk=parseToken(tokenData);

    query({//!--------------------------[ Tiene que coincidir el token con `id` `user` `kind` ]--------------------------------
        vr_query:`SELECT * FROM user WHERE id="${tk.id}" AND user="${tk.user}" AND kind="${tk.kind}" LIMIT 1;`,
        fnc_success:(r)=>{
            if(r.length==1){//!-------------------------------[ Si Coincide Token ]-----------------------------------------------
                //!-------------------------------[ Enviamos el token ]------------------------------------------
                let token={//!-------------------------------[ creamos el token ]------------------------------------------
                    id: r[0].id,
                    user: r[0].user,
                    name: r[0].name,
                    upass: r[0].upass,
                    kind: r[0].kind,
                    permis: r[0].permissions,
                    idws: clientId
                };
                let oldName=nS.name;

                //!---------------------[ Actualizamos Cliente info en server ]------------------------------

                clients.set(clientId,{
                    name: token.user,//*Nombre del cliente logueado
                    socket: nS.socket,//*socket del cliente
                    token: btoa(JSON.stringify(token,null,2)),//*Token Sesion
                    group: nS.group,//*Grupos a los que pertenece
                    file: nS.file
                });

                removeInterGroup(clientId,'nologin');
                setInterGroup(clientId,'silogin');

                nS=clients.get(clientId);
                printLog({title:`[ ${oldName} ] inicio sesion como: [ ${nS.name} ].`});
                token=btoa(JSON.stringify(token,null,2));
                const tkn={
                    type:'login',
                    kindData:'updateToken',
                    data: token
                }
                printLog({title:`Enviando actualización de token a [ ${nS.name} ].`});
                sendSMS({socket:{0: nS.socket},sms: tkn});
            }else{//!-------------------------------[ No coincide ]-----------------------------------------------
                printLog({title:`No tiene token valido [ ${nS.name} ].`});
                let data={
                    type:'error',
                    title:'Sesión cerrada',
                    sms:'Tu token de sesión no es valido.',
                    time:'10'
                };
                const tk={
                    type:'ctrl',
                    kindData:'logoutByServer',
                    data: data
                }
                
                sendSMS({socket:{0: nS.socket},sms: tk});
            }
        },
        fnc_error:(e)=>{//!---------------------[ Fallo la DB ]------------------------------
            const tk={
                type:'login',
                kindData:'updateToken',
                data: 'noDB'
            }
            sendSMS({socket:{0: nS.socket},sms: tk});
        }
    });
}

module.exports={
	getToken,
	updateToken
};