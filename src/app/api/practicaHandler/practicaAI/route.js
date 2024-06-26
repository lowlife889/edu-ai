import { NextResponse } from "next/server";
import model from "@/libs/ai";

const promptProcess = (lines) => {
  const resFinal = [];
  for (const i of lines) {
    let comienzo = 2;
    let front = "";
    let back = "";
    for (const a of i) {
      if (comienzo == 1 && a != "{" && a != "}" && a != "[" && a != "]") {
        front += a;
      } else if (comienzo == 0 && a != "}" && a != "[" && a != "]") {
        back += a;
      }
      if (a == "{") {
        if (comienzo == 1) {
          comienzo = 0;
        } else {
          comienzo = 1;
        }
      }
    }
    resFinal.push({ front: front, back: back });
  }
  return resFinal;
};

export async function POST(req) {
  const res = await req.json();
  const modalidad = res.modalidad;

  try {
    if (modalidad == "Flash cards") {
      const prompt = `ACLARACIONES: 
        ***IMPORTANTE*** 
        Estas son las aclaraciones de como debes responder:
        Vas a recibir una descripcion sobre los temas que quiero estudiar, y SOLAMENTE PUEDES RESPONDER DE LAS SIGUIENTES DOS FORMAS.
        ***MUY IMPORTANTE***
        Si la descripcion que recibes no expresa algo relacionado a temas que se estudian en el colegio o la universidad, vas a responder con un $.
        En cambio si la descripcion es valida, vas a devolver 10 flash cards relacionadas con los temas proveidos. Por ejemplo con el prompt "analisis matematico, limites" la respuesta deberia tener el siguiente formato:

        [{Nombre del concepto o algo que haga alucion a la respuesta}{Descripcion/explicacion breve del concepto}] 
        o tambien puede ser al reves, de la siguiente forma 
        [{Descripcion/explicacion breve del concepto}{Nombre del concepto o algo que haga alucion a la respuesta}]. 
        Por ejemplo con el prompt "analisis matematico, limites" la respuesta deberia tener el siguiente formato: 
        [{Definición de límite}{El valor que una función se aproxima a medida que la variable independiente se acerca a cierto valor o infinito.}]
        [{Propiedad de suma de límites}{El límite de la suma de dos funciones es la suma de los límites de esas funciones individuales.}]
        [{Propiedad de producto de límites}{El límite del producto de dos funciones es el producto de los límites de esas funciones individuales}]
        
        y asi hasta llegar a 10.

        Descripcion:{${res.descripcion}}
        `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      console.log(text);
      if (text[0] == "$") {
        return NextResponse.json({ error: true });
      } else {
        //console.log(text);
        const lines = text.split("\n");
        //console.log(lines);
        const resFinal = promptProcess(lines);

        console.log(resFinal);
        return NextResponse.json({ respuesta: resFinal, error: false });
      }
    } else if (modalidad == "Preguntas y respuestas") {
      const prompt = `ACLARACIONES: 
      ***IMPORTANTE*** 
      Estas son las aclaraciones de como debes responder:
      Vas a recibir una descripcion sobre los temas que quiero estudiar, y SOLAMENTE PUEDES RESPONDER DE LAS SIGUIENTES DOS FORMAS.
      ***MUY IMPORTANTE***
      Si la descripcion que recibes no expresa algo relacionado a temas que se estudian en el colegio o la universidad, vas a responder con un $.
      En cambio si la descripcion es valida, vas a devolver 10 preguntas o consignas teoricas relacionadas con el tema. El formato es el siguiente:
      1- Pregunta o Consigna
      2- Pregunta o Consigna
      3- Pregunta o Consigna
      4- Pregunta o Consigna
      ...
      
      Por ejemplo con el prompt "analisis matematico, limites" la respuesta deberia tener el siguiente formato: 
      1- ¿Qué es un límite en matemáticas y cómo se denota?
      2- Explica la diferencia entre un límite finito y un límite infinito.
      3- ¿Qué significa que una función tenga un límite en un punto?
      4- ¿Cuál es la importancia de los límites en el cálculo diferencial e integral?
      y asi hasta llegar a 10.

      Descripcion:{${res.descripcion}}
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      console.log(text);
      if (text[0] == "$") {
        return NextResponse.json({ error: true });
      } else {
        //console.log(text);
        const lines = text.split("\n");
        console.log(lines);

        return NextResponse.json({ respuesta: lines, error: false });
      }
    } else if (modalidad == "Multiple choice") {
      const prompt = `ACLARACIONES: 
      ***IMPORTANTE*** 
      Estas son las aclaraciones de como debes responder:
      Vas a recibir una descripcion sobre los temas que quiero estudiar, y SOLAMENTE PUEDES RESPONDER DE LAS SIGUIENTES DOS FORMAS.
      ***MUY IMPORTANTE***
      Si la descripcion que recibes no expresa algo relacionado a temas que se estudian en el colegio o la universidad, vas a responder con un $.
      En cambio si la descripcion es valida, vas a devolver 10 preguntas/consignas que pueden ser respondidas en formato multiple choice, es decir, las respuestas a estas preguntas son cortas y concisas (la pregunta debe estar pensada para que las respuestas puedan tener menos de 60 caracteres). Por ejemplo con el prompt "analisis matematico, limites" la respuesta deberia tener el siguiente formato: 

      ¿Qué representa el concepto de límite en el contexto del análisis matemático?
      ¿Cuál es la definición formal de límite de una función f(x) cuando x tiende a un valor c?
      ¿Cuál es el teorema fundamental utilizado para evaluar límites que involucran funciones racionales?
      ¿Qué enunciado describe el concepto de límite lateral?
      
      y asi hasta llegar a 10

      *********SOLO PUEDE HABER UNA CORRECTA*********

      Descripcion:{${res.descripcion}}
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      console.log(text);
      if (text[0] == "$") {
        return NextResponse.json({ error: true });
      } else {
        //console.log(text);
        const lines = text.split("\n");
        console.log(lines);

        return NextResponse.json({ respuesta: lines, error: false });
      }
    } else if (modalidad == "Verdadero o falso") {
      const prompt = `ACLARACIONES: 
      ***IMPORTANTE*** 
      Estas son las aclaraciones de como debes responder:
      Vas a recibir una descripcion sobre los temas que quiero estudiar, y SOLAMENTE PUEDES RESPONDER DE LAS SIGUIENTES DOS FORMAS.
      ***MUY IMPORTANTE***
      Si la descripcion que recibes no expresa algo relacionado a temas que se estudian en el colegio o la universidad, vas a responder con un $.
      En cambio si la descripcion es valida, vas a devolver 10 afirmaciones que se puedan responder con verdadero o falso sobre el/los temas descriptos, al final de cada afirmacion debes escribir una V o una F dependiendo de si la respuesta es verdadero o falso. Por ejemplo con el prompt "analisis matematico, limites" la respuesta deberia tener el siguiente formato: 

      Si una función tiene un límite finito en un punto, entonces la función debe ser continua en ese punto. V
      Si el límite de una función tiende a infinito, entonces la función debe ser creciente en un intervalo alrededor de ese punto. F
      Si el límite de una función cuando x tiende a cero es cero, entonces la función debe cruzar el eje x en x=0. F
      Si una función tiene un límite en el infinito, entonces la función debe ser acotada. F

      y asi hasta llegar a 10

      Descripcion:{${res.descripcion}}
      `;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      console.log(text);
      if (text[0] == "$") {
        return NextResponse.json({ error: true });
      } else {
        //console.log(text);
        const lines = text.split("\n");
        console.log(lines);
        const resFinal = [];
        for (const i of lines) {
          resFinal.push({
            afirmacion: i.substring(0, i.length - 1),
            vf: i.at(-1),
          });
        }

        return NextResponse.json({ respuesta: resFinal, error: false });
      }
    } else if (modalidad == "Acierta la palabra") {
      const prompt = `ACLARACIONES: 
      ***IMPORTANTE*** 
      Estas son las aclaraciones de como debes responder:
      Vas a recibir una descripcion sobre los temas que quiero estudiar, y SOLAMENTE PUEDES RESPONDER DE LAS SIGUIENTES DOS FORMAS.
      ***MUY IMPORTANTE***
      Si la descripcion tiene coherencia, vas a devolver 10 palabras de no mas de 8 letras cada una, relacionadas al material que se te provee y debajo de cada palabra, un texto relativamente corto que haga referencia a la palabra, el texto debe permitir a la persona que lo lee descifrar la palabra sin conocer la palabra, el texto no debe incluir la palabra.
      Por ejemplo con el prompt "analisis matematico" la respuesta deberia tener el siguiente formato: 

      Limite
      Cuando nos acercamos cada vez más a un valor específico en una función, nos acercamos al concepto de esta herramienta fundamental en el cálculo.
      Deriva
      En el estudio del cambio instantáneo, esta operación nos permite calcular la tasa de cambio de una función en un punto dado.
      Integral
      Al sumar infinitesimalmente pequeñas áreas bajo una curva, llegamos a este concepto central en el cálculo que representa la acumulación de cantidades.
      Funcion
      Una relación matemática que asigna a cada elemento de un conjunto de entrada exactamente uno de un conjunto de salida.

      y asi hasta llegar a 10

      (LAS PALABRAS NO DEBEN ESTAR NUMERADAS Y NO PUEDEN TENER MAS DE 8 LETRAS, NI TAMPOCO DEBEN TENER CARACTERES ACENTUADOS NI SIGNOS DE PUNTUACION Y DEBEN ESTAR TODAS EN MINISCULAS)

      Descripcion:{${res.descripcion}}
      `;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      console.log(text);
      if (text[0] == "$") {
        return NextResponse.json({ error: true });
      } else {
        //console.log(text);
        const lines = text.split("\n");
        console.log(lines);
        const resFinal = [];
        let palabra = null;
        let referencia = null;
        for (const i of lines) {
          if (i != "" || i != " " || i != "\n") {
            if (palabra) {
              referencia = i;
              resFinal.push({ palabra: palabra, referencia: referencia });
              referencia = null;
              palabra = null;
            } else {
              palabra = i;
            }
          }
        }

        return NextResponse.json({ respuesta: resFinal, error: false });
      }
    } else {
      return NextResponse.json({ respuesta: [], error: false });
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: true });
  }
}
