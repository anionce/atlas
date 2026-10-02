import type { MethodSection } from "@/components/ToolIntro";

/**
 * Cómo calcula cada herramienta, con supuestos, un ejemplo y límites.
 * Las cifras de los ejemplos salen de ejecutar los propios motores de
 * cálculo (packages/formula-engine), no de estimaciones a ojo: si cambia una
 * fórmula o un tramo fiscal, hay que volver a calcularlas.
 */

export const FIRE_METHOD: MethodSection[] = [
  {
    heading: "Del gasto al número",
    paragraphs: [
      "Partimos de lo que gastas al mes, lo multiplicamos por 12 y dividimos entre 0,04. Es la regla del 4 %: si cada año retiras el 4 % de tu cartera, históricamente ese dinero ha aguantado 30 años en la gran mayoría de los casos. Con 2.000 € de gasto mensual son 24.000 € al año y un número de 600.000 €.",
      "Esa cifra es solo el punto de partida. Le falta lo que se queda Hacienda y lo que cobrarás de pensión, y las dos cosas cambian bastante el resultado.",
    ],
  },
  {
    heading: "Lo que se queda Hacienda",
    paragraphs: [
      "La regla del 4 % da por hecho que todo lo que retiras es tuyo. En España no: de cada retirada, la parte que es ganancia (no lo que tú pusiste) tributa en la base del ahorro del IRPF, por tramos. En 2026 son el 19 % hasta 6.000 €, el 21 % hasta 50.000 €, el 23 % hasta 200.000 €, el 27 % hasta 300.000 € y el 30 % a partir de ahí.",
      "Para saber cuánta parte de tu cartera será ganancia, simulamos tu acumulación con tu capital, tu aportación y la rentabilidad que indicas. Un ejemplo: con 20.000 € de partida, 1.000 € al mes y un 6 % anual, llegarías a los 600.000 € en unos 21 años y 7 meses, y alrededor del 54 % de esa cartera sería ganancia. Para que te queden limpios 24.000 € al año hay que retirar más en bruto, y el número sube a unos 672.600 €, un 12 % más.",
      "Es una aproximación. Asumimos que esa proporción de ganancia se mantiene durante toda la retirada y no sabemos en qué orden venderías tus participaciones. Y si vives en País Vasco o Navarra, la escala es otra y las cifras cambian.",
    ],
  },
  {
    heading: "La pensión pública",
    paragraphs: [
      "Si cuentas con una pensión, el cálculo se parte en dos tramos. Desde que llegas a tu número hasta los 67 años (la edad que usamos de referencia) la cartera tiene que pagarte el gasto entero. A partir de ahí la pensión cubre una parte y la cartera solo sostiene el hueco que queda.",
      "Si tienes la cifra del simulador oficial de la Seguridad Social, úsala: es mucho más fiable que cualquier estimación nuestra. Si no, calculamos una con tu sueldo bruto actual y los años que llevas cotizados, con las reglas de la reforma de 2013: hacen falta al menos 15 años cotizados, con 15 se cobra el 50 % de la base reguladora y se llega al 100 % con 36 años y 6 meses. Aplicamos también el tope de la pensión máxima de 2026 (3.359,60 € al mes en 14 pagas).",
      "Un detalle que casi nadie tiene en cuenta: si te retiras antes, dejas de cotizar, y eso baja tu pensión futura. Lo descontamos.",
    ],
  },
  {
    heading: "Cuánto tardas, Coast FIRE y las tres tallas",
    paragraphs: [
      "El tiempo hasta tu número sale del interés compuesto mensual con tu capital actual y tu aportación, a una rentabilidad constante. La edad FIRE es tu edad más ese plazo.",
      "Coast FIRE responde a otra pregunta: cuánto tendrías que tener hoy para dejar de aportar y llegar igualmente a tu número a los 67 solo con el crecimiento. Es el número FIRE descontado hacia atrás por los años que quedan.",
      "Lean, Pleno y Fat son tu gasto al 70 %, al 100 % y al 150 %. No son una definición oficial de nadie, solo tres tallas para que veas cuánto se mueve el resultado según cuánto necesites gastar.",
    ],
  },
  {
    heading: "Dónde se queda corto",
    paragraphs: [],
    bullets: [
      "Una rentabilidad constante no existe: los mercados no suben un 6 % cada año. Para ver qué pasa si las malas rachas llegan justo al empezar la jubilación, usa el simulador histórico.",
      "No descontamos la inflación por separado. Si metes una rentabilidad nominal, tu gasto futuro quedará infravalorado; con una rentabilidad ya descontada de inflación, las cifras salen más prudentes.",
      "Es una estimación, no asesoramiento financiero ni fiscal. Tu situación concreta (comunidad, otras rentas, orden de venta) puede cambiar los impuestos reales.",
    ],
  },
];

export const BUY_HOME_METHOD: MethodSection[] = [
  {
    heading: "Dos límites, y nos quedamos con el más bajo",
    paragraphs: [
      "Calculamos dos precios máximos y te damos el menor de los dos.",
      "El primero lo marcan tus ingresos. El banco suele querer que la cuota no pase del 35 % de lo que cobras al mes, restando antes lo que ya pagas por otras deudas. Con esa cuota máxima, el tipo de interés y el plazo, calculamos cuánto capital te financiarían, y de ahí el precio.",
      "El segundo lo marca tu ahorro. Tienes que pagar la entrada (por defecto, un 20 % del precio) y además los gastos de compra, que estimamos en otro 10 %. Con 60.000 € ahorrados, 60.000 ÷ 0,30 = 200.000 € de tope.",
    ],
  },
  {
    heading: "Un ejemplo con números",
    paragraphs: [
      "Imagina 3.000 € netos al mes, sin otras deudas, un tipo del 3,5 % y 30 años. Con 60.000 € ahorrados, el precio máximo es de 200.000 €, y lo que manda es el ahorro: entrada de 40.000 €, hipoteca de 160.000 € y cuota de 718 €, un 24 % de tus ingresos. Te sobra margen de cuota, pero no de entrada.",
      "Con 150.000 € ahorrados cambia el límite. Ya no frena el ahorro sino los ingresos: el precio sube a unos 292.300 € y la cuota llega a 1.050 €, justo el 35 %. A partir de ahí, tener más dinero guardado no te da una casa más cara. Lo que ayudaría es cobrar más o endeudarte menos.",
    ],
  },
  {
    heading: "Cómo sale la cuota",
    paragraphs: [
      "Usamos amortización francesa, la habitual en España: la cuota es la misma todos los meses, pero al principio casi todo son intereses y con los años va pesando más el capital. Los 160.000 € del ejemplo, al 3,5 % durante 30 años, te costarían unos 98.650 € solo en intereses.",
    ],
  },
  {
    heading: "Qué no tiene en cuenta",
    paragraphs: [],
    bullets: [
      "Tipo fijo durante todo el plazo. Con una hipoteca variable la cuota se mueve con el Euríbor.",
      "El 35 % es una referencia. Cada banco decide con tu perfil completo: estabilidad laboral, historial, otras deudas.",
      "Los gastos de compra reales dependen de la comunidad y de si es nueva o usada. Para afinarlos, está la calculadora de gastos de compra.",
      "Quedan fuera el seguro, la comunidad de vecinos, el IBI y el mantenimiento, que también salen de tu presupuesto cada mes.",
    ],
  },
];

export const PURCHASE_COSTS_METHOD: MethodSection[] = [
  {
    heading: "El impuesto, que es la parte gorda",
    paragraphs: [
      "Si compras una vivienda de segunda mano, pagas ITP, y cada comunidad autónoma fija su tipo. Si compras obra nueva, pagas IVA (aplicamos el 10 %) más el impuesto de Actos Jurídicos Documentados, para el que usamos un 1,5 % como media orientativa porque también varía según la comunidad.",
    ],
  },
  {
    heading: "Cinco comunidades, tramos progresivos",
    paragraphs: [
      "Cataluña, Baleares, Asturias, Extremadura y la Comunidad Valenciana no tienen un tipo único: aplican tramos según el precio, y cada tramo tributa solo por la parte del precio que le toca, igual que el IRPF.",
      "En Cataluña, por ejemplo, los primeros 600.000 € van al 10 % y el tramo siguiente, hasta 900.000 €, al 11 %. Una vivienda de 800.000 € paga 60.000 € por el primer tramo y 22.000 € por los 200.000 € restantes: 82.000 € en total, un 10,25 % efectivo. Si se aplicara el 11 % a todo el precio, serían 88.000 €.",
    ],
  },
  {
    heading: "Notaría, registro y tasación",
    paragraphs: [
      "Estos tres los estimamos de forma simplificada: un 0,3 % del precio para la notaría (mínimo 300 €), un 0,2 % para el registro (mínimo 200 €) y 350 € de tasación. Los aranceles reales siguen tablas oficiales y dependen de detalles como el número de folios, así que son aproximaciones. El margen de error aquí es pequeño al lado del impuesto, que es lo que de verdad mueve el total.",
    ],
  },
  {
    heading: "Tres compras para comparar",
    paragraphs: [
      "Con una vivienda de 250.000 €, comprada de segunda mano en Madrid, el ITP es del 6 % (15.000 €) y el total de gastos llega a 16.600 €, un 6,6 % del precio. La misma vivienda en Cataluña tiene un ITP de 25.000 € y un total de 26.600 €, un 10,6 %. Y si fuera obra nueva, serían 25.000 € de IVA más 3.750 € de AJD, para un total de 30.350 €, un 12,1 %.",
      "La misma casa, el mismo precio y 10.000 € de diferencia solo por dónde está.",
    ],
  },
  {
    heading: "Lo que no está incluido",
    paragraphs: [],
    bullets: [
      "Los tipos reducidos para jóvenes, familias numerosas, personas con discapacidad o vivienda protegida. Usamos el tipo general de cada comunidad.",
      "El IGIC de Canarias y el IPSI de Ceuta y Melilla para obra nueva, que sustituyen al IVA.",
      "Gestoría (si la contratas) y comisión de la agencia inmobiliaria.",
    ],
  },
];

export const COMPOUND_INTEREST_METHOD: MethodSection[] = [
  {
    heading: "La fórmula, sin vueltas",
    paragraphs: [
      "Cada mes, tu capital crece según la rentabilidad anual dividida entre 12, y le sumas tu aportación. En la práctica son dos piezas: lo que crece el capital con el que empiezas, y lo que crece cada aportación desde el mes en que la haces.",
      "Con 10.000 € de partida, 200 € al mes y un 5 % anual durante 20 años, llegas a unos 109.300 €. De eso, 58.000 € los has puesto tú (10.000 € más 200 € por 240 meses) y unos 51.300 € son rentabilidad: casi la mitad. A un 0 % el resultado sería exactamente 58.000 €.",
    ],
  },
  {
    heading: "Cuánto tardas en llegar a un objetivo",
    paragraphs: [
      "Para el plazo hacemos la cuenta al revés: cuántos meses necesitas, con tu aportación y la rentabilidad que indicas, para alcanzar la cifra que buscas. Si con esos datos nunca llegarías (por ejemplo, sin aportar y sin que el capital crezca lo suficiente), te lo decimos en vez de inventarnos un plazo.",
    ],
  },
  {
    heading: "Lo que conviene saber antes de fiarte del resultado",
    paragraphs: [],
    bullets: [
      "La rentabilidad es constante. Un fondo real sube y baja, y el orden de los años importa. Para verlo, el simulador histórico usa rentabilidades reales.",
      "No descontamos impuestos. Cuando vendas, las ganancias tributan entre el 19 % y el 30 % en 2026.",
      "Tampoco comisiones. Un fondo con una comisión anual del 1 % rinde bastante menos a 20 años que uno del 0,2 %.",
      "Las cifras son nominales, en euros del futuro, sin ajustar por inflación. Si quieres ver poder adquisitivo de hoy, introduce una rentabilidad ya descontada de inflación.",
    ],
  },
];

export const SAVINGS_RATE_METHOD: MethodSection[] = [
  {
    heading: "La cuenta es sencilla",
    paragraphs: [
      "Tu tasa de ahorro es lo que te sobra cada mes dividido entre lo que ingresas. Con 2.500 € de ingresos netos y 1.750 € de gasto, ahorras 750 €, un 30 %.",
    ],
  },
  {
    heading: "Por qué importa más que el sueldo",
    paragraphs: [
      "Para ese mismo gasto de 1.750 € al mes, el número FIRE (regla del 4 %) es de 525.000 €. Ahorrando 750 € al mes y partiendo de cero, con un 5 % anual, tardarías unos 27 años y 5 meses.",
      "Ahora imagina a la misma persona con el mismo sueldo gastando 1.250 €. Ahorra 1.250 € al mes (un 50 %), su número baja a 375.000 € y llega en unos 16 años y 4 meses. Recortar 500 € de gasto mensual le ahorra más de 11 años.",
      "Hay un doble efecto: gastar menos te deja más para invertir y, a la vez, reduce el capital que necesitas para vivir de las rentas. Por eso la tasa pesa más que el sueldo.",
    ],
  },
  {
    heading: "Qué suponemos y qué no",
    paragraphs: [],
    bullets: [
      "Los ingresos son netos, lo que realmente te llega al banco.",
      "Los gastos son una media mensual. Mete también lo que pagas una vez al año (seguros, vacaciones, el coche) repartido entre 12, o la tasa te saldrá más alta de lo real.",
      "El plazo usa la rentabilidad que indiques, constante todos los años, y la regla del 4 % para el número objetivo.",
      "No incluye impuestos sobre las retiradas ni pensión pública. Para eso está la calculadora FIRE, que es más completa.",
    ],
  },
];

export const HISTORICAL_BACKTEST_METHOD: MethodSection[] = [
  {
    heading: "Qué hace distinto a una proyección normal",
    paragraphs: [
      "Una proyección típica supone una rentabilidad media cada año, por ejemplo un 6 %, y te dice si el dinero llega. El problema es que los mercados no funcionan así: lo que decide si tu plan sobrevive es el orden en que llegan las malas rachas.",
      "Aquí no se supone nada. Replicamos tu plan empezando la jubilación en cada año posible entre 1928 y 2025, con las rentabilidades y la inflación reales de cada año. Para una jubilación de 30 años hay 69 ventanas distintas. En cada una, primero se retira el dinero del año y lo que queda crece con la rentabilidad de ese año, según tu mezcla de acciones (el S&P 500 con dividendos) y bonos (Tesoro de EE. UU. a 10 años). Cada año se reajusta a esa mezcla. Si la cartera se agota antes del final, esa ventana cuenta como fracaso.",
    ],
  },
  {
    heading: "Un ejemplo",
    paragraphs: [
      "Con 600.000 € invertidos, retirando 24.000 € al año (un 4 %), con un 60 % en acciones y 30 años de jubilación, la estrategia clásica aguanta en 65 de las 69 ventanas: un 94,2 %. Las cuatro que fallan son las que empiezan en 1965, 1966, 1968 y 1969, justo antes de los años 70, con una inflación alta y una bolsa que no despegó durante años.",
      "Si en vez de 24.000 € retiras 30.000 € (un 5 %), el éxito baja a 51 de 69, un 73,9 %. Subir la retirada un punto porcentual cuesta más de veinte puntos de seguridad.",
    ],
  },
  {
    heading: "Las cinco estrategias de retirada",
    paragraphs: [],
    bullets: [
      "Dólar constante: la regla del 4 % de toda la vida. Retiras lo mismo cada año, ajustado por la inflación. Es predecible, pero no reacciona a lo que pase con la cartera.",
      "Porcentaje de la cartera: retiras cada año un porcentaje fijo de lo que tengas. Nunca se agota, pero tu gasto sube y baja con el mercado.",
      "1/N: divides lo que tienes entre los años que quedan. La cartera se vacía justo al final.",
      "VPW (retirada porcentual variable): como 1/N, pero contando con que lo que queda sigue creciendo, así que retira algo más al principio.",
      "Guyton-Klinger: parte del dólar constante y añade dos frenos. Si el año anterior la cartera perdió valor, no subes la retirada por inflación. Y si la tasa de retirada se dispara más de un 20 % sobre la inicial, recortas un 10 %; si cae más de un 20 %, la subes un 10 %.",
    ],
  },
  {
    heading: "Ojo con los 100 %",
    paragraphs: [
      "Que 1/N, VPW o Guyton-Klinger den un 100 % no significa que sean mejores. Significa que ajustan lo que gastas para no quedarse sin dinero. Si en una mala racha tu gasto tuviera que bajar a la mitad, la cartera no se agota, pero quizá tampoco puedes vivir con eso. Antes de quedarte con el porcentaje, pregúntate cuánto podrías recortar de verdad en el peor momento.",
    ],
  },
  {
    heading: "Los límites",
    paragraphs: [],
    bullets: [
      "Los datos son de EE. UU. No existe un dataset español o europeo igual de largo y limpio. Las fuentes son Aswath Damodaran (NYU Stern) para las rentabilidades y la Reserva Federal de Minneapolis para la inflación.",
      "Las ventanas se solapan. Las de 1965 y 1966 comparten 29 de sus 30 años, así que 69 ventanas no son 69 experimentos independientes.",
      "No incluye impuestos, comisiones ni pensión pública. Es la cartera en bruto.",
      "Que algo haya funcionado en el pasado no garantiza que funcione en el futuro. Es una forma de estresar tu plan contra lo que ya ocurrió, no una predicción.",
    ],
  },
];
