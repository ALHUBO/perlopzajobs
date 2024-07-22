/*-----------------------------------------------------------------
|                       Servidor UDP discover server
-----------------------------------------------------------------*/
const dgram = require('dgram');

var server=undefined;

function start({
    port= 12345,
    fnc_receives=(message, rinfo)=>{
        console.log(`Recibio un mensaje UDP: ${message}`);
        return;
    },
    fnc_listen=()=>{
        console.log('Servidor UDP escuchando.');
        return;
    },
    fnc_error=(error)=>{
        console.log(`Ocurrio un error con el servidor UDP: ${error}`);
        return;
    },
    fnc_close=()=>{
        console.log('El servidor UDP se ha cerrado.');
        return;
    }
}){
    server = dgram.createSocket('udp4');

    server.on('message', function(message, rinfo){
        fnc_receives(message, rinfo);
    });

    server.on('listening', function(){
        const address = server.address();
        fnc_listen(address);
    });

    server.on('error', function(error){
        fnc_error(error);
        return;
    });

    server.on('close', function(){
        fnc_close();
        return;
    });

    server.bind(port);
};


function close({
    fnc_error=(error)=>{
        console.log(`No fue posible detener el servidor UDP: ${error}`)
    }
}){
    try{
        server.close();
    }catch(e){
        fnc_error(e);
    }
};

function ShowMe({
    port=12346 // El puerto que utilizarás para el broadcast
}){
    const serverUDP = dgram.createSocket('udp4');

    // Crear un mensaje para anunciar la sala
    const serverInfo = {
        IP: configServ.Server.IP,
        port: configServ.Server.port
    };

    const message = JSON.stringify(serverInfo);

    serverUDP.bind(() => {
        serverUDP.setBroadcast(true);

        // Enviar el mensaje de anuncio como un broadcast
        serverUDP.send(message, 0, message.length, port, '255.255.255.255', (err) => {
            if(err) global.native.printError({title:'Error al enviar el mensaje de anuncio', content:`${err}`,advance:true});
            else global.native.printSuccess({title:`Mensaje de anuncio enviado con éxito`,content:`<div>IP: ${serverInfo.IP}</div><div>Puerto: ${serverInfo.port}</div>`});
            serverUDP.close();
        });
    });
}

module.exports={
    start,
    close,
    ShowMe
};