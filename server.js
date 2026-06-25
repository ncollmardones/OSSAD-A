import ee from "@google/earthengine";
import fs from "fs";
import express from "express";
import cors from "cors";


const app = express();


// ======================================================
// CORS
// ======================================================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://monitoreo-salares-ossada.netlify.app",
  "https://ossad-a.netlify.app"
];


app.use(cors({
  origin: (origin, callback)=>{

    if(!origin || allowedOrigins.includes(origin)){
      callback(null,true);
    }else{
      callback(new Error("CORS bloqueado"));
    }

  }
}));


app.use(express.json());



// ======================================================
// AUTH EARTH ENGINE
// ======================================================


function initEarthEngine(){

 return new Promise((resolve,reject)=>{


  let key;


  try{


    if(process.env.GEE_KEY){

      key = JSON.parse(process.env.GEE_KEY);


    }else{


      key = JSON.parse(
        fs.readFileSync("./key.json","utf8")
      );


    }


  }catch(e){

    reject(
      new Error(
        "No se pudo leer la clave GEE: "+e.message
      )
    );

  }



  ee.data.authenticateViaPrivateKey(

    key,


    ()=>{


      console.log("✅ Earth Engine autenticado");


      ee.initialize(
        null,
        null,
        resolve,
        reject
      );


    },


    reject

  );

 });


}





// ======================================================
// ASSETS
// ======================================================


const COLECCION = ee.ImageCollection(
 "projects/appossada/assets/COLECCION_SALARES"
);


const ENVOLVENTES = ee.FeatureCollection(
 "projects/appossada/assets/SALARES_FINAL"
);




// ======================================================
// LISTAR SALARES
// ======================================================


app.get("/api/salares", async(req,res)=>{


try{


 const nombres = await COLECCION
    .aggregate_array("salar_name")
    .distinct()
    .sort()
    .getInfo();



 res.json({
    salares:nombres
 });


}catch(e){


 res.status(500).json({
    error:e.message
 });


}


});





// ======================================================
// LISTAR AÑOS DE UN SALAR
// ======================================================


app.get("/api/salar/:nombre/anios", async(req,res)=>{


try{


 const nombre = req.params.nombre;


 const anios = await COLECCION

    .filter(
      ee.Filter.eq(
        "salar_name",
        nombre
      )
    )

    .aggregate_array("year")

    .distinct()

    .sort()

    .getInfo();



 res.json({
    salar:nombre,
    anios
 });



}catch(e){


 res.status(500).json({
   error:e.message
 });


}


});





// ======================================================
// OBTENER IMAGEN
// ======================================================


app.post("/api/imagen", async(req,res)=>{


try{


const {
  salar,
  year,
  indice
}=req.body;



if(!salar || !year){

 return res.status(400).json({
   error:"Falta salar o año"
 });

}




let imagen = COLECCION

.filter(
 ee.Filter.eq(
  "salar_name",
  salar
 )
)

.filter(
 ee.Filter.eq(
  "year",
  Number(year)
 )
)

.first();



let bandas;



if(indice){

 bandas = imagen.select(indice);

}else{

 bandas = imagen.select(
 [
 "NDVI",
 "NDWI",
 "NDSI",
 "BSI",
 "Albedo"
 ]
);

}



// ======================================================
// VISUALIZACION
// ======================================================


let vis;


if(indice==="NDVI"){


vis={
 min:-1,
 max:1,
 palette:[
  "brown",
  "yellow",
  "green"
 ]
};


}else if(indice==="NDWI"){


vis={
 min:-1,
 max:1,
 palette:[
  "brown",
  "white",
  "blue"
 ]
};


}else{


vis={
 min:0,
 max:1
};


}




const mapa = await bandas.getMap(vis);




const propiedades =
 await imagen.toDictionary().getInfo();



res.json({

 mapUrl: mapa.urlFormat,

 propiedades

});




}catch(e){


console.error(e);


res.status(500).json({
 error:e.message
});


}


});






// ======================================================
// HEALTH
// ======================================================


app.get("/health",(req,res)=>{


res.json({
 status:"ok"
});


});






// ======================================================
// START
// ======================================================


const PORT =
process.env.PORT || 3000;



initEarthEngine()

.then(()=>{


app.listen(PORT,()=>{


console.log(
`🚀 Backend funcionando puerto ${PORT}`
);


});


})


.catch(e=>{


console.error(
"Error iniciando EE",
e
);


process.exit(1);


});
