import type { WordData, PhraseData, ParagraphData } from '../types'
import { combineSeed, createSeed, mulberry32, shuffleInPlace } from '../utils/seededRandom'
import { fnv1a32 } from '../utils/hash'

// ============================================
// ENGLISH WORDS
// ============================================

export const englishWords: Record<number, WordData[]> = {
  1: [
    { word: 'cat', difficulty: 1 }, { word: 'dog', difficulty: 1 }, { word: 'sun', difficulty: 1 }, { word: 'run', difficulty: 1 },
    { word: 'jump', difficulty: 1 }, { word: 'blue', difficulty: 1 }, { word: 'tree', difficulty: 1 }, { word: 'book', difficulty: 1 },
    { word: 'fish', difficulty: 1 }, { word: 'bird', difficulty: 1 }, { word: 'star', difficulty: 1 }, { word: 'moon', difficulty: 1 },
    { word: 'cake', difficulty: 1 }, { word: 'milk', difficulty: 1 }, { word: 'hand', difficulty: 1 }, { word: 'ball', difficulty: 1 },
    { word: 'door', difficulty: 1 }, { word: 'fire', difficulty: 1 }, { word: 'gold', difficulty: 1 }, { word: 'hope', difficulty: 1 },
    { word: 'ice', difficulty: 1 }, { word: 'joy', difficulty: 1 }, { word: 'king', difficulty: 1 }, { word: 'lamp', difficulty: 1 },
    { word: 'map', difficulty: 1 }, { word: 'nest', difficulty: 1 }, { word: 'owl', difficulty: 1 }, { word: 'pen', difficulty: 1 },
    { word: 'queen', difficulty: 1 }, { word: 'rain', difficulty: 1 }, { word: 'ship', difficulty: 1 }, { word: 'tea', difficulty: 1 },
    { word: 'up', difficulty: 1 }, { word: 'van', difficulty: 1 }, { word: 'web', difficulty: 1 }, { word: 'yarn', difficulty: 1 },
    { word: 'zoo', difficulty: 1 }, { word: 'box', difficulty: 1 }, { word: 'cup', difficulty: 1 }, { word: 'hat', difficulty: 1 },
  ],
  2: [
    { word: 'apple', difficulty: 2 }, { word: 'house', difficulty: 2 }, { word: 'water', difficulty: 2 }, { word: 'green', difficulty: 2 },
    { word: 'happy', difficulty: 2 }, { word: 'friend', difficulty: 2 }, { word: 'school', difficulty: 2 }, { word: 'garden', difficulty: 2 },
    { word: 'flower', difficulty: 2 }, { word: 'orange', difficulty: 2 }, { word: 'purple', difficulty: 2 }, { word: 'yellow', difficulty: 2 },
    { word: 'winter', difficulty: 2 }, { word: 'summer', difficulty: 2 }, { word: 'spring', difficulty: 2 }, { word: 'planet', difficulty: 2 },
    { word: 'camera', difficulty: 2 }, { word: 'guitar', difficulty: 2 }, { word: 'island', difficulty: 2 }, { word: 'jungle', difficulty: 2 },
    { word: 'laptop', difficulty: 2 }, { word: 'market', difficulty: 2 }, { word: 'nature', difficulty: 2 }, { word: 'ocean', difficulty: 2 },
    { word: 'pencil', difficulty: 2 }, { word: 'rabbit', difficulty: 2 }, { word: 'silver', difficulty: 2 }, { word: 'ticket', difficulty: 2 },
    { word: 'valley', difficulty: 2 }, { word: 'window', difficulty: 2 }, { word: 'banana', difficulty: 2 }, { word: 'bridge', difficulty: 2 },
    { word: 'coffee', difficulty: 2 }, { word: 'desert', difficulty: 2 }, { word: 'energy', difficulty: 2 }, { word: 'forest', difficulty: 2 },
    { word: 'ground', difficulty: 2 }, { word: 'hammer', difficulty: 2 }, { word: 'insect', difficulty: 2 }, { word: 'jacket', difficulty: 2 },
  ],
  3: [
    { word: 'beautiful', difficulty: 3 }, { word: 'wonderful', difficulty: 3 }, { word: 'adventure', difficulty: 3 }, { word: 'discovery', difficulty: 3 },
    { word: 'elephant', difficulty: 3 }, { word: 'keyboard', difficulty: 3 }, { word: 'mountain', difficulty: 3 }, { word: 'hospital', difficulty: 3 },
    { word: 'library', difficulty: 3 }, { word: 'restaurant', difficulty: 3 }, { word: 'chocolate', difficulty: 3 }, { word: 'butterfly', difficulty: 3 },
    { word: 'helicopter', difficulty: 3 }, { word: 'challenge', difficulty: 3 }, { word: 'calendar', difficulty: 3 }, { word: 'dinosaur', difficulty: 3 },
    { word: 'elevator', difficulty: 3 }, { word: 'festival', difficulty: 3 }, { word: 'gradient', difficulty: 3 }, { word: 'horizon', difficulty: 3 },
    { word: 'internet', difficulty: 3 }, { word: 'journey', difficulty: 3 }, { word: 'kingdom', difficulty: 3 }, { word: 'lightning', difficulty: 3 },
    { word: 'message', difficulty: 3 }, { word: 'notebook', difficulty: 3 }, { word: 'octopus', difficulty: 3 }, { word: 'portrait', difficulty: 3 },
    { word: 'quantity', difficulty: 3 }, { word: 'rainbow', difficulty: 3 }, { word: 'sunlight', difficulty: 3 }, { word: 'triangle', difficulty: 3 },
    { word: 'umbrella', difficulty: 3 }, { word: 'volcano', difficulty: 3 }, { word: 'wildlife', difficulty: 3 }, { word: 'xylophone', difficulty: 3 },
    { word: 'yesterday', difficulty: 3 }, { word: 'alphabet', difficulty: 3 }, { word: 'billiards', difficulty: 3 }, { word: 'cocktail', difficulty: 3 },
  ],
  4: [
    { word: 'programming', difficulty: 4 }, { word: 'technology', difficulty: 4 }, { word: 'information', difficulty: 4 }, { word: 'education', difficulty: 4 },
    { word: 'experience', difficulty: 4 }, { word: 'development', difficulty: 4 }, { word: 'opportunity', difficulty: 4 }, { word: 'environment', difficulty: 4 },
    { word: 'communication', difficulty: 4 }, { word: 'celebration', difficulty: 4 }, { word: 'imagination', difficulty: 4 }, { word: 'determination', difficulty: 4 },
    { word: 'independent', difficulty: 4 }, { word: 'professional', difficulty: 4 }, { word: 'traditional', difficulty: 4 }, { word: 'agriculture', difficulty: 4 },
    { word: 'basketball', difficulty: 4 }, { word: 'collection', difficulty: 4 }, { word: 'definition', difficulty: 4 }, { word: 'engineering', difficulty: 4 },
    { word: 'foundation', difficulty: 4 }, { word: 'generation', difficulty: 4 }, { word: 'historical', difficulty: 4 }, { word: 'investment', difficulty: 4 },
    { word: 'judgmental', difficulty: 4 }, { word: 'knowledge', difficulty: 4 }, { word: 'literature', difficulty: 4 }, { word: 'management', difficulty: 4 },
    { word: 'negotiation', difficulty: 4 }, { word: 'observation', difficulty: 4 }, { word: 'particular', difficulty: 4 }, { word: 'qualitative', difficulty: 4 },
    { word: 'reflection', difficulty: 4 }, { word: 'scientific', difficulty: 4 }, { word: 'television', difficulty: 4 }, { word: 'university', difficulty: 4 },
    { word: 'vocabulary', difficulty: 4 }, { word: 'wilderness', difficulty: 4 }, { word: 'xenophobia', difficulty: 4 }, { word: 'youthfully', difficulty: 4 },
  ],
  5: [
    { word: 'extraordinary', difficulty: 5 }, { word: 'international', difficulty: 5 }, { word: 'responsibility', difficulty: 5 }, { word: 'accomplishment', difficulty: 5 },
    { word: 'characteristics', difficulty: 5 }, { word: 'understanding', difficulty: 5 }, { word: 'photography', difficulty: 5 }, { word: 'architecture', difficulty: 5 },
    { word: 'philosophical', difficulty: 5 }, { word: 'psychological', difficulty: 5 }, { word: 'biotechnology', difficulty: 5 }, { word: 'entrepreneur', difficulty: 5 },
    { word: 'sophisticated', difficulty: 5 }, { word: 'simultaneous', difficulty: 5 }, { word: 'comprehensive', difficulty: 5 }, { word: 'archaeology', difficulty: 5 },
    { word: 'biodiversity', difficulty: 5 }, { word: 'constellation', difficulty: 5 }, { word: 'displacement', difficulty: 5 }, { word: 'eccentricity', difficulty: 5 },
    { word: 'fluctuation', difficulty: 5 }, { word: 'gravitational', difficulty: 5 }, { word: 'hieroglyphic', difficulty: 5 }, { word: 'idiosyncrasy', difficulty: 5 },
    { word: 'jurisdiction', difficulty: 5 }, { word: 'kaleidoscope', difficulty: 5 }, { word: 'luminosity', difficulty: 5 }, { word: 'metamorphosis', difficulty: 5 },
    { word: 'nomenclature', difficulty: 5 }, { word: 'orchestration', difficulty: 5 }, { word: 'parliamentary', difficulty: 5 }, { word: 'questionnaire', difficulty: 5 },
    { word: 'rejuvenation', difficulty: 5 }, { word: 'stratosphere', difficulty: 5 }, { word: 'transformation', difficulty: 5 }, { word: 'unpredictable', difficulty: 5 },
    { word: 'vulnerability', difficulty: 5 }, { word: 'weatherproof', difficulty: 5 }, { word: 'yesteryears', difficulty: 5 }, { word: 'zoological', difficulty: 5 },
  ],
}

// ============================================
// SPANISH WORDS
// ============================================

export const spanishWords: Record<number, WordData[]> = {
  1: [
    { word: 'casa', difficulty: 1 }, { word: 'perro', difficulty: 1 }, { word: 'gato', difficulty: 1 }, { word: 'sol', difficulty: 1 },
    { word: 'luna', difficulty: 1 }, { word: 'azul', difficulty: 1 }, { word: 'rojo', difficulty: 1 }, { word: 'mesa', difficulty: 1 },
    { word: 'silla', difficulty: 1 }, { word: 'libro', difficulty: 1 }, { word: 'flor', difficulty: 1 }, { word: 'pan', difficulty: 1 },
    { word: 'leche', difficulty: 1 }, { word: 'mano', difficulty: 1 }, { word: 'pie', difficulty: 1 }, { word: 'mar', difficulty: 1 },
    { word: 'luz', difficulty: 1 }, { word: 'oro', difficulty: 1 }, { word: 'paz', difficulty: 1 }, { word: 'ojo', difficulty: 1 },
    { word: 'rio', difficulty: 1 }, { word: 'uva', difficulty: 1 }, { word: 'pez', difficulty: 1 }, { word: 'gas', difficulty: 1 },
    { word: 'dos', difficulty: 1 }, { word: 'tres', difficulty: 1 }, { word: 'nube', difficulty: 1 }, { word: 'cielo', difficulty: 1 },
    { word: 'viento', difficulty: 1 }, { word: 'fuego', difficulty: 1 }, { word: 'hoja', difficulty: 1 }, { word: 'niño', difficulty: 1 },
    { word: 'reloj', difficulty: 1 }, { word: 'papel', difficulty: 1 }, { word: 'lapiz', difficulty: 1 }, { word: 'nive', difficulty: 1 },
    { word: 'tren', difficulty: 1 }, { word: 'bote', difficulty: 1 }, { word: 'carro', difficulty: 1 }, { word: 'moto', difficulty: 1 },
  ],
  2: [
    { word: 'manzana', difficulty: 2 }, { word: 'ventana', difficulty: 2 }, { word: 'puerta', difficulty: 2 }, { word: 'verde', difficulty: 2 },
    { word: 'feliz', difficulty: 2 }, { word: 'amigo', difficulty: 2 }, { word: 'escuela', difficulty: 2 }, { word: 'jardín', difficulty: 2 },
    { word: 'naranja', difficulty: 2 }, { word: 'plátano', difficulty: 2 }, { word: 'invierno', difficulty: 2 }, { word: 'verano', difficulty: 2 },
    { word: 'primavera', difficulty: 2 }, { word: 'otoño', difficulty: 2 }, { word: 'mañana', difficulty: 2 }, { word: 'comida', difficulty: 2 },
    { word: 'familia', difficulty: 2 }, { word: 'trabajo', difficulty: 2 }, { word: 'camino', difficulty: 2 }, { word: 'ciudad', difficulty: 2 },
    { word: 'bosque', difficulty: 2 }, { word: 'animal', difficulty: 2 }, { word: 'musica', difficulty: 2 }, { word: 'pintor', difficulty: 2 },
    { word: 'puente', difficulty: 2 }, { word: 'planeta', difficulty: 2 }, { word: 'estelar', difficulty: 2 }, { word: 'medico', difficulty: 2 },
    { word: 'verdad', difficulty: 2 }, { word: 'tiempo', difficulty: 2 }, { word: 'pueblo', difficulty: 2 }, { word: 'espejo', difficulty: 2 },
    { word: 'abrigo', difficulty: 2 }, { word: 'dibujo', difficulty: 2 }, { word: 'cuerpo', difficulty: 2 }, { word: 'iglesia', difficulty: 2 },
    { word: 'cuento', difficulty: 2 }, { word: 'dormir', difficulty: 2 }, { word: 'llave', difficulty: 2 }, { word: 'vuelo', difficulty: 2 },
  ],
  3: [
    { word: 'hermoso', difficulty: 3 }, { word: 'maravilloso', difficulty: 3 }, { word: 'aventura', difficulty: 3 }, { word: 'descubrimiento', difficulty: 3 },
    { word: 'elefante', difficulty: 3 }, { word: 'teclado', difficulty: 3 }, { word: 'montaña', difficulty: 3 }, { word: 'hospital', difficulty: 3 },
    { word: 'biblioteca', difficulty: 3 }, { word: 'restaurante', difficulty: 3 }, { word: 'chocolate', difficulty: 3 }, { word: 'mariposa', difficulty: 3 },
    { word: 'helipuerto', difficulty: 3 }, { word: 'campeonato', difficulty: 3 }, { word: 'desafío', difficulty: 3 }, { word: 'asombroso', difficulty: 3 },
    { word: 'bicicleta', difficulty: 3 }, { word: 'computadora', difficulty: 3 }, { word: 'dinámico', difficulty: 3 }, { word: 'escritura', difficulty: 3 },
    { word: 'fotógrafo', difficulty: 3 }, { word: 'geografía', difficulty: 3 }, { word: 'historia', difficulty: 3 }, { word: 'iluminar', difficulty: 3 },
    { word: 'jerarquía', difficulty: 3 }, { word: 'kilómetro', difficulty: 3 }, { word: 'literatura', difficulty: 3 }, { word: 'mecánico', difficulty: 3 },
    { word: 'naturaleza', difficulty: 3 }, { word: 'oficinista', difficulty: 3 }, { word: 'película', difficulty: 3 }, { word: 'químico', difficulty: 3 },
    { word: 'resplandor', difficulty: 3 }, { word: 'sinfonía', difficulty: 3 }, { word: 'terremoto', difficulty: 3 }, { word: 'universo', difficulty: 3 },
    { word: 'velocidad', difficulty: 3 }, { word: 'waffle', difficulty: 3 }, { word: 'xilófono', difficulty: 3 }, { word: 'yacimiento', difficulty: 3 },
  ],
  4: [
    { word: 'programación', difficulty: 4 }, { word: 'tecnología', difficulty: 4 }, { word: 'información', difficulty: 4 }, { word: 'educación', difficulty: 4 },
    { word: 'experiencia', difficulty: 4 }, { word: 'desarrollo', difficulty: 4 }, { word: 'oportunidad', difficulty: 4 }, { word: 'medioambiente', difficulty: 4 },
    { word: 'comunicación', difficulty: 4 }, { word: 'celebración', difficulty: 4 }, { word: 'imaginación', difficulty: 4 }, { word: 'determinación', difficulty: 4 },
    { word: 'independiente', difficulty: 4 }, { word: 'profesional', difficulty: 4 }, { word: 'tradicional', difficulty: 4 }, { word: 'agricultura', difficulty: 4 },
    { word: 'beneficio', difficulty: 4 }, { word: 'conocimiento', difficulty: 4 }, { word: 'democracia', difficulty: 4 }, { word: 'estabilidad', difficulty: 4 },
    { word: 'facilitador', difficulty: 4 }, { word: 'generación', difficulty: 4 }, { word: 'humanitario', difficulty: 4 }, { word: 'inteligencia', difficulty: 4 },
    { word: 'justificación', difficulty: 4 }, { word: 'laboratorio', difficulty: 4 }, { word: 'metodología', difficulty: 4 }, { word: 'navegación', difficulty: 4 },
    { word: 'observación', difficulty: 4 }, { word: 'participación', difficulty: 4 }, { word: 'racionalidad', difficulty: 4 }, { word: 'satisfacción', difficulty: 4 },
    { word: 'transformar', difficulty: 4 }, { word: 'urbanización', difficulty: 4 }, { word: 'vanguardista', difficulty: 4 }, { word: 'webmaster', difficulty: 4 },
    { word: 'yuxtaposición', difficulty: 4 }, { word: 'zootecnista', difficulty: 4 }, { word: 'bibliografía', difficulty: 4 }, { word: 'curiosidad', difficulty: 4 },
  ],
  5: [
    { word: 'extraordinario', difficulty: 5 }, { word: 'internacional', difficulty: 5 }, { word: 'responsabilidad', difficulty: 5 }, { word: 'acontecimiento', difficulty: 5 },
    { word: 'características', difficulty: 5 }, { word: 'entendimiento', difficulty: 5 }, { word: 'fotografía', difficulty: 5 }, { word: 'arquitectura', difficulty: 5 },
    { word: 'filosófico', difficulty: 5 }, { word: 'psicológico', difficulty: 5 }, { word: 'biotecnología', difficulty: 5 }, { word: 'emprendedor', difficulty: 5 },
    { word: 'sofisticado', difficulty: 5 }, { word: 'simultáneo', difficulty: 5 }, { word: 'comprensivo', difficulty: 5 }, { word: 'biodiversidad', difficulty: 5 },
    { word: 'consecuencia', difficulty: 5 }, { word: 'disciplinado', difficulty: 5 }, { word: 'especialista', difficulty: 5 }, { word: 'fortalecer', difficulty: 5 },
    { word: 'gubernamental', difficulty: 5 }, { word: 'habitual', difficulty: 5 }, { word: 'institución', difficulty: 5 }, { word: 'jerarquizado', difficulty: 5 },
    { word: 'kilogramo', difficulty: 5 }, { word: 'lamentablemente', difficulty: 5 }, { word: 'multicultural', difficulty: 5 }, { word: 'obligatorio', difficulty: 5 },
    { word: 'particularidad', difficulty: 5 }, { word: 'quebradizo', difficulty: 5 }, { word: 'reestructurar', difficulty: 5 }, { word: 'significativo', difficulty: 5 },
    { word: 'transparencia', difficulty: 5 }, { word: 'universalidad', difficulty: 5 }, { word: 'vertebrado', difficulty: 5 }, { word: 'xilografía', difficulty: 5 },
    { word: 'yacimiento', difficulty: 5 }, { word: 'zigzaguear', difficulty: 5 }, { word: 'aproximación', difficulty: 5 }, { word: 'colaboración', difficulty: 5 },
  ],
}

// ============================================
// ENGLISH PHRASES (Levels 3-5)
// ============================================

export const englishPhrases: Record<number, PhraseData[]> = {
  3: [
    { phrase: 'The quick brown fox', difficulty: 3 }, { phrase: 'A journey begins today', difficulty: 3 }, { phrase: 'Practice makes perfect', difficulty: 3 },
    { phrase: 'Time flies quickly', difficulty: 3 }, { phrase: 'Knowledge is power', difficulty: 3 }, { phrase: 'Dreams come true', difficulty: 3 },
    { phrase: 'Stay focused always', difficulty: 3 }, { phrase: 'Never give up hope', difficulty: 3 }, { phrase: 'Innovation is light', difficulty: 3 },
    { phrase: 'Coding is magic art', difficulty: 3 }, { phrase: 'Nature is beautiful', difficulty: 3 }, { phrase: 'Listen to the wind', difficulty: 3 },
    { phrase: 'Stars shine bright', difficulty: 3 }, { phrase: 'Music heals the soul', difficulty: 3 }, { phrase: 'Read every single day', difficulty: 3 },
    { phrase: 'Learn from mistakes', difficulty: 3 }, { phrase: 'Peace begins inside', difficulty: 3 }, { phrase: 'Love wins everything', difficulty: 3 },
    { phrase: 'Work hard play hard', difficulty: 3 }, { phrase: 'Simple is better', difficulty: 3 },
  ],
  4: [
    { phrase: 'The early bird catches the worm', difficulty: 4 }, { phrase: 'Actions speak louder than words', difficulty: 4 }, { phrase: 'Every cloud has a silver lining', difficulty: 4 },
    { phrase: 'Where there is a will there is a way', difficulty: 4 }, { phrase: 'Better late than never at all', difficulty: 4 }, { phrase: 'The pen is mightier than the sword', difficulty: 4 },
    { phrase: 'Look before you leap into action', difficulty: 4 }, { phrase: 'When life gives you lemons make lemonade', difficulty: 4 }, { phrase: 'Practice like you never won', difficulty: 4 },
    { phrase: 'The best way to predict future is create', difficulty: 4 }, { phrase: 'Patience is a very powerful virtue', difficulty: 4 }, { phrase: 'Everything you can imagine is real', difficulty: 4 },
    { phrase: 'Do what you love and love what you do', difficulty: 4 }, { phrase: 'Stay hungry and stay foolish always', difficulty: 4 }, { phrase: 'Happiness depends upon ourselves only', difficulty: 4 },
    { phrase: 'Logic will get you from A to B', difficulty: 4 }, { phrase: 'Change your thoughts and change world', difficulty: 4 }, { phrase: 'The journey is the reward itself', difficulty: 4 },
    { phrase: 'Think big and don\'t listen to experts', difficulty: 4 }, { phrase: 'Quality is not an act it is a habit', difficulty: 4 },
  ],
  5: [
    { phrase: 'Success is not final failure is not fatal it is the courage to continue that counts', difficulty: 5 },
    { phrase: 'The only way to do great work is to love what you do every single day', difficulty: 5 },
    { phrase: 'In the middle of difficulty lies opportunity for growth and learning', difficulty: 5 },
    { phrase: 'Believe you can and you are halfway there to achieving your dreams', difficulty: 5 },
    { phrase: 'The future belongs to those who believe in the beauty of their dreams', difficulty: 5 },
    { phrase: 'What you get by achieving your goals is not as important as what you become', difficulty: 5 },
    { phrase: 'I have not failed I have just found ten thousand ways that will not work', difficulty: 5 },
    { phrase: 'Education is the most powerful weapon which you can use to change the world', difficulty: 5 },
    { phrase: 'Go confidently in the direction of your dreams and live the life you imagined', difficulty: 5 },
    { phrase: 'You must be the change you wish to see in this world said the wise man', difficulty: 5 },
    { phrase: 'Keep your face always toward the sunshine and shadows will fall behind you', difficulty: 5 },
    { phrase: 'Spread love everywhere you go let no one ever come to you without leaving happier', difficulty: 5 },
    { phrase: 'Be the kind of person that you would like to meet in the street one day', difficulty: 5 },
    { phrase: 'The power of imagination makes us infinite and allows us to see the unseen', difficulty: 5 },
    { phrase: 'Do not go where the path may lead go instead where there is no path', difficulty: 5 },
  ],
}

// ============================================
// SPANISH PHRASES (Levels 3-5)
// ============================================

export const spanishPhrases: Record<number, PhraseData[]> = {
  3: [
    { phrase: 'El rápido zorro marrón', difficulty: 3 }, { phrase: 'Un viaje comienza hoy', difficulty: 3 }, { phrase: 'La práctica hace al maestro', difficulty: 3 },
    { phrase: 'El tiempo vuela rápido', difficulty: 3 }, { phrase: 'El conocimiento es poder', difficulty: 3 }, { phrase: 'Los sueños se hacen realidad', difficulty: 3 },
    { phrase: 'Mantente enfocado siempre', difficulty: 3 }, { phrase: 'Nunca pierdas la esperanza', difficulty: 3 }, { phrase: 'La llave de la felicidad', difficulty: 3 },
    { phrase: 'Caminar bajo las estrellas', difficulty: 3 }, { phrase: 'Escucha la música del mar', difficulty: 3 }, { phrase: 'El sol brilla para todos', difficulty: 3 },
    { phrase: 'Vive el momento presente', difficulty: 3 }, { phrase: 'Aprende algo nuevo hoy', difficulty: 3 }, { phrase: 'La paz viene del interior', difficulty: 3 },
    { phrase: 'Sigue tu propio camino', difficulty: 3 }, { phrase: 'Cree en ti mismo siempre', difficulty: 3 }, { phrase: 'El amor todo lo puede', difficulty: 3 },
    { phrase: 'Trabaja con mucha alegría', difficulty: 3 }, { phrase: 'La vida es una aventura', difficulty: 3 },
  ],
  4: [
    { phrase: 'Al que madruga Dios lo ayuda', difficulty: 4 }, { phrase: 'Del dicho al hecho hay mucho trecho', difficulty: 4 }, { phrase: 'No hay mal que por bien no venga', difficulty: 4 },
    { phrase: 'Querer es poder si te lo propones', difficulty: 4 }, { phrase: 'Más vale tarde que nunca llegar', difficulty: 4 }, { phrase: 'La pluma es más fuerte que la espada', difficulty: 4 },
    { phrase: 'Mira antes de saltar al vacío', difficulty: 4 }, { phrase: 'Cuando la vida te dé limones haz limonada', difficulty: 4 }, { phrase: 'No dejes para mañana lo que puedas hacer hoy', difficulty: 4 },
    { phrase: 'El que no arriesga no gana nada en esta vida', difficulty: 4 }, { phrase: 'A caballo regalado no se le mira el diente', difficulty: 4 }, { phrase: 'En boca cerrada no entran moscas se dice', difficulty: 4 },
    { phrase: 'Cada loco con su tema y cada cual con su vida', difficulty: 4 }, { phrase: 'Camarón que se duerme se lo lleva la corriente', difficulty: 4 }, { phrase: 'Dime con quién andas y te diré quién eres', difficulty: 4 },
    { phrase: 'Más vale pájaro en mano que cien volando hoy', difficulty: 4 }, { phrase: 'No por mucho madrugar amanece más temprano', difficulty: 4 }, { phrase: 'Perro que ladra no muerde dice el refrán', difficulty: 4 },
    { phrase: 'Ojos que no ven corazón que no siente nada', difficulty: 4 }, { phrase: 'Haz bien sin mirar a quién dice la sabiduría', difficulty: 4 },
  ],
  5: [
    { phrase: 'El éxito no es final el fracaso no es fatal es el coraje para continuar lo que cuenta', difficulty: 5 },
    { phrase: 'La única forma de hacer un gran trabajo es amar lo que haces cada día', difficulty: 5 },
    { phrase: 'En medio de la dificultad está la oportunidad para crecer y aprender', difficulty: 5 },
    { phrase: 'Cree que puedes y ya estás halfway allí para lograr tus sueños', difficulty: 5 },
    { phrase: 'El futuro pertenece a aquellos que creen en la belleza de sus sueños', difficulty: 5 },
    { phrase: 'Lo que obtienes al lograr tus metas no es tan importante como en lo que te conviertes', difficulty: 5 },
    { phrase: 'No he fallado simplemente he encontrado diez mil formas que no funcionan', difficulty: 5 },
    { phrase: 'La educación es el arma más poderosa que puedes usar para cambiar el mundo entero', difficulty: 5 },
    { phrase: 'Ve con confianza en la dirección de tus sueños y vive la vida que imaginaste', difficulty: 5 },
    { phrase: 'Debes ser el cambio que deseas ver en este mundo dijo el sabio hindú', difficulty: 5 },
    { phrase: 'Mantén tu rostro siempre hacia la luz del sol y las sombras caerán detrás de ti', difficulty: 5 },
    { phrase: 'Difunde amor por donde quiera que vayas que nadie se aleje de ti sin ser más feliz', difficulty: 5 },
    { phrase: 'Sé el tipo de persona que te gustaría conocer un día cualquiera en la calle', difficulty: 5 },
    { phrase: 'El poder de la imaginación nos hace infinitos y nos permite ver lo invisible', difficulty: 5 },
    { phrase: 'No vayas por donde el camino te lleve ve en cambio por donde no hay camino', difficulty: 5 },
  ],
}

// ============================================
// ENGLISH PARAGRAPHS (Level 5)
// ============================================

export const englishParagraphs: ParagraphData[] = [
  {
    paragraph: 'Typing is an essential skill in the modern world. Whether you are writing an email, coding a program, or chatting with friends, the ability to type quickly and accurately can save you time and effort. Practice regularly to improve your speed and precision.',
    difficulty: 5,
  },
  {
    paragraph: 'Learning a new language opens doors to different cultures and perspectives. It challenges your brain, improves memory, and enhances cognitive abilities. English and Spanish are two of the most spoken languages worldwide, making them valuable skills to acquire.',
    difficulty: 5,
  },
  {
    paragraph: 'Technology has transformed the way we communicate, work, and learn. From smartphones to artificial intelligence, innovations continue to shape our daily lives. Staying updated with technological advances helps us adapt and thrive in an ever-changing world.',
    difficulty: 5,
  },
  {
    paragraph: 'Reading is a habit that enriches the mind and expands knowledge. Books transport us to different worlds, introduce us to new ideas, and help us develop empathy. Whether fiction or non-fiction, reading regularly improves vocabulary, comprehension, and critical thinking skills.',
    difficulty: 5,
  },
  {
    paragraph: 'Health is wealth, they say, and it is true. Taking care of your body through exercise, proper nutrition, and adequate rest is essential for a fulfilling life. Mental health is equally important; practicing mindfulness and stress management contributes to overall well-being.',
    difficulty: 5,
  },
  {
    paragraph: 'The exploration of deep space continues to reveal the vast mysteries of our universe. From black holes to distant systems, we seek to understand the fundamental laws that govern existence while reaching for the stars with new specialized technologies and daring curiosity.',
    difficulty: 5,
  },
  {
    paragraph: 'Oceanography is a fascinating field that examines the complex ecosystems hidden beneath the waves. The deep ocean remains a frontier of discovery, where unique life forms thrive in extreme conditions, teaching us about resilience and the interconnectedness of all living things on Earth.',
    difficulty: 5,
  },
  {
    paragraph: 'Sustainability is no longer just a buzzword but a vital requirement for the future of our civilization. Adopting renewable energy, reducing waste, and protecting natural habitats are crucial steps we must take collectively to ensure a healthy planet for future generations to enjoy.',
    difficulty: 5,
  },
]

// ============================================
// SPANISH PARAGRAPHS (Level 5)
// ============================================

export const spanishParagraphs: ParagraphData[] = [
  {
    paragraph: 'Escribir es una habilidad esencial en el mundo moderno. Ya sea que estés escribiendo un correo electrónico, programando un código, o chateando con amigos, la capacidad de escribir rápidamente y con precisión puede ahorrarte tiempo y esfuerzo. Practica regularmente para mejorar tu velocidad.',
    difficulty: 5,
  },
  {
    paragraph: 'Aprender un nuevo idioma abre puertas a diferentes culturas y perspectivas. Desafía tu cerebro, mejora la memoria y mejora las habilidades cognitivas. El inglés y el español son dos de los idiomas más hablados en todo el mundo, lo que los convierte en habilidades valiosas.',
    difficulty: 5,
  },
  {
    paragraph: 'La tecnología ha transformado la forma en que nos comunicamos, trabajamos y aprendemos. Desde teléfonos inteligentes hasta inteligencia artificial, las innovaciones continúan dando forma a nuestras vidas diarias. Mantenerse actualizado nos ayuda a adaptarnos y prosperar siempre.',
    difficulty: 5,
  },
  {
    paragraph: 'Leer es un hábito que enriquece la mente y expande el conocimiento. Los libros nos transportan a diferentes mundos, nos presentan nuevas ideas y nos ayudan a desarrollar empatía. Ya sea ficción o realidad, leer regularmente mejora el vocabulario y la comprensión del entorno.',
    difficulty: 5,
  },
  {
    paragraph: 'La salud es riqueza, dicen, y es cierto. Cuidar tu cuerpo a través del ejercicio, la nutrición adecuada y el descanso es esencial para una vida plena. La salud mental es igualmente importante; practicar la atención plena contribuye al bienestar general de las personas.',
    difficulty: 5,
  },
  {
    paragraph: 'La exploración del espacio profundo continúa revelando los vastos misterios de nuestro universo. Desde agujeros negros hasta sistemas lejanos, buscamos comprender las leyes fundamentales que rigen la existencia mientras alcanzamos las estrellas con nuevas y potentes tecnologías.',
    difficulty: 5,
  },
  {
    paragraph: 'La oceanografía es un campo fascinante que examina los complejos ecosistemas ocultos bajo las olas. El océano profundo sigue siendo una frontera de descubrimiento, donde formas de vida únicas prosperan en condiciones extremas, enseñándonos sobre la resiliencia de la vida misma.',
    difficulty: 5,
  },
  {
    paragraph: 'La sostenibilidad ya no es solo una palabra de moda, sino un requisito vital para el futuro de nuestra civilización. Adoptar energías renovables y proteger los hábitats naturales son pasos cruciales que debemos tomar colectivamente para asegurar un planeta saludable hoy.',
    difficulty: 5,
  },
]

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function getRandomWords(language: 'en' | 'es', level: number, count: number): string[] {
  const words = language === 'en' ? englishWords[level] : spanishWords[level]
  const shuffled = [...words].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count).map(w => w.word)
}

export function getRandomPhrase(language: 'en' | 'es', level: number): string {
  const phrases = language === 'en' ? englishPhrases[level] : spanishPhrases[level]
  const randomIndex = Math.floor(Math.random() * phrases.length)
  return phrases[randomIndex].phrase
}

export function getRandomParagraph(language: 'en' | 'es'): string {
  const paragraphs = language === 'en' ? englishParagraphs : spanishParagraphs
  const randomIndex = Math.floor(Math.random() * paragraphs.length)
  return paragraphs[randomIndex].paragraph
}

// Estado persistente para evitar repeticiones
const recentTexts = new Set<string>()
const MAX_RECENT = 10

/**
 * Obtiene palabras sueltas para un nivel (para modo TapTap)
 */
export function getWordsForLevel(language: 'en' | 'es', level: number): string[] {
  const wordList = language === 'en' ? englishWords : spanishWords
  const words = wordList[level] || wordList[1]
  return words.map(w => w.word)
}

export function getTextForLevel(language: 'en' | 'es', level: number): string {
  let result = ''
  let attempts = 0

  // Intentar obtener un texto que no se haya usado recientemente
  do {
    if (level <= 2) {
      const words = getRandomWords(language, level, 5)
      result = words.join(' ')
    } else if (level <= 4) {
      result = getRandomPhrase(language, level)
    } else {
      result = getRandomParagraph(language)
    }
    attempts++
  } while (recentTexts.has(result) && attempts < 5)

  // Actualizar el cache de textos recientes
  recentTexts.add(result)

  // Convertir a array para manejar el tamaño
  const recentArray = Array.from(recentTexts)
  if (recentArray.length > MAX_RECENT) {
    recentTexts.delete(recentArray[0])
  }

  return result
}

export type ContentMode = 'classic' | 'taptap' | 'multiplayer'

export interface ContentMeta {
  seed: number
  pool: string
  version: string
  key: string
}

export interface TextSelection {
  text: string
  meta: ContentMeta
}

export interface WordSelection {
  words: string[]
  meta: ContentMeta
}

const CONTENT_VERSION = 'v1'

export function selectTextForLevel(
  language: 'en' | 'es',
  level: number,
  mode: ContentMode,
  recentKeys: string[],
  seed?: number,
  category?: string
): TextSelection {
  const baseSeed = seed ?? createSeed()
  
  // Si hay categoría, usar palabras categorizadas
  if (category && category !== 'general' && categorizedWords[category]) {
    const categoryWords = categorizedWords[category][language] || []
    const filteredByLevel = categoryWords.filter(w => w.difficulty <= level)
    
    if (filteredByLevel.length > 0) {
      const pool = `words:${language}:${level}:${category}`
      
      for (let attempt = 0; attempt < 12; attempt++) {
        const s = combineSeed(baseSeed, attempt)
        const rand = mulberry32(s)
        
        const idx = filteredByLevel.map((_, i) => i)
        shuffleInPlace(idx, rand)
        const pickedIdx = idx.slice(0, 5)
        const picked = pickedIdx.map((i) => filteredByLevel[i].word)
        const key = fnv1a32(`${pickedIdx.join(',')}`)
        const composite = `${mode}:${language}:${level}:${pool}:${key}`
        
        if (!recentKeys.includes(composite) || attempt === 11) {
          return {
            text: picked.join(' '),
            meta: { seed: s, pool, version: CONTENT_VERSION, key },
          }
        }
      }
    }
  }
  
  // Fallback a palabras generales (original logic)
  const pool = level <= 2 ? `words:${language}:${level}` : level <= 4 ? `phrases:${language}:${level}` : `paragraphs:${language}:5`

  for (let attempt = 0; attempt < 12; attempt++) {
    const s = combineSeed(baseSeed, attempt)
    const rand = mulberry32(s)

    if (level <= 2) {
      const items = (language === 'en' ? englishWords[level] : spanishWords[level]).map((w) => w.word)
      const idx = items.map((_, i) => i)
      shuffleInPlace(idx, rand)
      const pickedIdx = idx.slice(0, 5)
      const picked = pickedIdx.map((i) => items[i])
      const key = fnv1a32(`${pickedIdx.join(',')}`)
      const composite = `${mode}:${language}:${level}:${pool}:${key}`
      if (!recentKeys.includes(composite) || attempt === 11) {
        return {
          text: picked.join(' '),
          meta: { seed: s, pool, version: CONTENT_VERSION, key },
        }
      }
    } else if (level <= 4) {
      const phrases = (language === 'en' ? englishPhrases[level] : spanishPhrases[level]).map((p) => p.phrase)
      const idx = Math.floor(rand() * phrases.length)
      const key = fnv1a32(`p:${idx}`)
      const composite = `${mode}:${language}:${level}:${pool}:${key}`
      if (!recentKeys.includes(composite) || attempt === 11) {
        return {
          text: phrases[idx],
          meta: { seed: s, pool, version: CONTENT_VERSION, key },
        }
      }
    } else {
      const paragraphs = (language === 'en' ? englishParagraphs : spanishParagraphs).map((p) => p.paragraph)
      const idx = Math.floor(rand() * paragraphs.length)
      const key = fnv1a32(`g:${idx}`)
      const composite = `${mode}:${language}:${level}:${pool}:${key}`
      if (!recentKeys.includes(composite) || attempt === 11) {
        return {
          text: paragraphs[idx],
          meta: { seed: s, pool, version: CONTENT_VERSION, key },
        }
      }
    }
  }

  return {
    text: getTextForLevel(language, level),
    meta: { seed: baseSeed, pool, version: CONTENT_VERSION, key: fnv1a32(`${Date.now()}`) },
  }
}

export function selectTapTapWords(
  language: 'en' | 'es',
  level: number,
  mode: ContentMode,
  recentKeys: string[],
  count = 12,
  seed?: number
): WordSelection {
  const baseSeed = seed ?? createSeed()
  const pool = `words:${language}:${level}`
  const items = getWordsForLevel(language, level)

  for (let attempt = 0; attempt < 12; attempt++) {
    const s = combineSeed(baseSeed, attempt)
    const rand = mulberry32(s)
    const idx = items.map((_, i) => i)
    shuffleInPlace(idx, rand)
    const pickedIdx = idx.slice(0, count)
    const picked = pickedIdx.map((i) => items[i])
    const key = fnv1a32(`${pickedIdx.join(',')}`)
    const composite = `${mode}:${language}:${level}:${pool}:${key}`
    if (!recentKeys.includes(composite) || attempt === 11) {
      return { words: picked, meta: { seed: s, pool, version: CONTENT_VERSION, key } }
    }
  }

  const fallback = [...items].slice(0, count)
  return { words: fallback, meta: { seed: baseSeed, pool, version: CONTENT_VERSION, key: fnv1a32(fallback.join('|')) } }
}

// ============================================
// CATEGORIZED WORDS BY THEME
// ============================================

export const categorizedWords: Record<string, Record<string, WordData[]>> = {
  animals: {
    en: [
      { word: 'elephant', difficulty: 2, category: 'animals' }, { word: 'giraffe', difficulty: 2, category: 'animals' }, { word: 'zebra', difficulty: 2, category: 'animals' },
      { word: 'lion', difficulty: 1, category: 'animals' }, { word: 'tiger', difficulty: 2, category: 'animals' }, { word: 'bear', difficulty: 1, category: 'animals' },
      { word: 'dolphin', difficulty: 2, category: 'animals' }, { word: 'penguin', difficulty: 2, category: 'animals' }, { word: 'eagle', difficulty: 2, category: 'animals' },
      { word: 'butterfly', difficulty: 2, category: 'animals' }, { word: 'snake', difficulty: 2, category: 'animals' }, { word: 'spider', difficulty: 2, category: 'animals' },
      { word: 'crocodile', difficulty: 3, category: 'animals' }, { word: 'hippopotamus', difficulty: 3, category: 'animals' }, { word: 'rhinoceros', difficulty: 3, category: 'animals' },
      { word: 'cheetah', difficulty: 2, category: 'animals' }, { word: 'antelope', difficulty: 3, category: 'animals' }, { word: 'kangaroo', difficulty: 3, category: 'animals' },
      { word: 'panda', difficulty: 2, category: 'animals' }, { word: 'lemur', difficulty: 2, category: 'animals' }, { word: 'wolf', difficulty: 2, category: 'animals' },
      { word: 'peacock', difficulty: 3, category: 'animals' }, { word: 'flamingo', difficulty: 2, category: 'animals' }, { word: 'koala', difficulty: 2, category: 'animals' },
      { word: 'squirrel', difficulty: 2, category: 'animals' }, { word: 'hedgehog', difficulty: 3, category: 'animals' }, { word: 'ferret', difficulty: 2, category: 'animals' },
      { word: 'octopus', difficulty: 2, category: 'animals' }, { word: 'jellyfish', difficulty: 3, category: 'animals' }, { word: 'seahorse', difficulty: 3, category: 'animals' },
    ],
    es: [
      { word: 'elefante', difficulty: 2, category: 'animals' }, { word: 'jirafa', difficulty: 2, category: 'animals' }, { word: 'cebra', difficulty: 2, category: 'animals' },
      { word: 'león', difficulty: 1, category: 'animals' }, { word: 'tigre', difficulty: 2, category: 'animals' }, { word: 'oso', difficulty: 1, category: 'animals' },
      { word: 'delfín', difficulty: 2, category: 'animals' }, { word: 'pingüino', difficulty: 2, category: 'animals' }, { word: 'águila', difficulty: 2, category: 'animals' },
      { word: 'mariposa', difficulty: 2, category: 'animals' }, { word: 'serpiente', difficulty: 2, category: 'animals' }, { word: 'araña', difficulty: 2, category: 'animals' },
      { word: 'cocodrilo', difficulty: 3, category: 'animals' }, { word: 'hipopótamo', difficulty: 3, category: 'animals' }, { word: 'rinoceronte', difficulty: 3, category: 'animals' },
      { word: 'guepardo', difficulty: 2, category: 'animals' }, { word: 'antílope', difficulty: 3, category: 'animals' }, { word: 'canguro', difficulty: 3, category: 'animals' },
      { word: 'panda', difficulty: 2, category: 'animals' }, { word: 'lémur', difficulty: 2, category: 'animals' }, { word: 'lobo', difficulty: 2, category: 'animals' },
      { word: 'pavo real', difficulty: 3, category: 'animals' }, { word: 'flamenco', difficulty: 2, category: 'animals' }, { word: 'coala', difficulty: 2, category: 'animals' },
      { word: 'ardilla', difficulty: 2, category: 'animals' }, { word: 'erizo', difficulty: 2, category: 'animals' }, { word: 'hurón', difficulty: 2, category: 'animals' },
      { word: 'pulpo', difficulty: 2, category: 'animals' }, { word: 'medusa', difficulty: 3, category: 'animals' }, { word: 'caballito', difficulty: 3, category: 'animals' },
    ],
  },
  fruits: {
    en: [
      { word: 'apple', difficulty: 1, category: 'fruits' }, { word: 'banana', difficulty: 1, category: 'fruits' }, { word: 'orange', difficulty: 1, category: 'fruits' },
      { word: 'strawberry', difficulty: 2, category: 'fruits' }, { word: 'blueberry', difficulty: 2, category: 'fruits' }, { word: 'raspberry', difficulty: 2, category: 'fruits' },
      { word: 'watermelon', difficulty: 2, category: 'fruits' }, { word: 'pineapple', difficulty: 2, category: 'fruits' }, { word: 'mango', difficulty: 1, category: 'fruits' },
      { word: 'papaya', difficulty: 2, category: 'fruits' }, { word: 'kiwi', difficulty: 1, category: 'fruits' }, { word: 'lime', difficulty: 1, category: 'fruits' },
      { word: 'lemon', difficulty: 1, category: 'fruits' }, { word: 'grape', difficulty: 1, category: 'fruits' }, { word: 'cherry', difficulty: 2, category: 'fruits' },
      { word: 'peach', difficulty: 2, category: 'fruits' }, { word: 'plum', difficulty: 1, category: 'fruits' }, { word: 'pear', difficulty: 1, category: 'fruits' },
      { word: 'coconut', difficulty: 2, category: 'fruits' }, { word: 'guava', difficulty: 2, category: 'fruits' }, { word: 'dragonfruit', difficulty: 3, category: 'fruits' },
      { word: 'pomegranate', difficulty: 3, category: 'fruits' }, { word: 'cranberry', difficulty: 2, category: 'fruits' }, { word: 'nectarine', difficulty: 3, category: 'fruits' },
      { word: 'tangerine', difficulty: 2, category: 'fruits' }, { word: 'grapefruit', difficulty: 2, category: 'fruits' }, { word: 'clementine', difficulty: 3, category: 'fruits' },
      { word: 'fig', difficulty: 1, category: 'fruits' }, { word: 'date', difficulty: 1, category: 'fruits' }, { word: 'apricot', difficulty: 2, category: 'fruits' },
    ],
    es: [
      { word: 'manzana', difficulty: 1, category: 'fruits' }, { word: 'plátano', difficulty: 1, category: 'fruits' }, { word: 'naranja', difficulty: 1, category: 'fruits' },
      { word: 'fresa', difficulty: 2, category: 'fruits' }, { word: 'arándano', difficulty: 2, category: 'fruits' }, { word: 'frambuesa', difficulty: 2, category: 'fruits' },
      { word: 'sandía', difficulty: 2, category: 'fruits' }, { word: 'piña', difficulty: 2, category: 'fruits' }, { word: 'mango', difficulty: 1, category: 'fruits' },
      { word: 'papaya', difficulty: 2, category: 'fruits' }, { word: 'kiwi', difficulty: 1, category: 'fruits' }, { word: 'lima', difficulty: 1, category: 'fruits' },
      { word: 'limón', difficulty: 1, category: 'fruits' }, { word: 'uva', difficulty: 1, category: 'fruits' }, { word: 'cereza', difficulty: 2, category: 'fruits' },
      { word: 'melocotón', difficulty: 2, category: 'fruits' }, { word: 'ciruela', difficulty: 1, category: 'fruits' }, { word: 'pera', difficulty: 1, category: 'fruits' },
      { word: 'coco', difficulty: 2, category: 'fruits' }, { word: 'guayaba', difficulty: 2, category: 'fruits' }, { word: 'pitahaya', difficulty: 3, category: 'fruits' },
      { word: 'granada', difficulty: 3, category: 'fruits' }, { word: 'arándano rojo', difficulty: 2, category: 'fruits' }, { word: 'nectarina', difficulty: 3, category: 'fruits' },
      { word: 'mandarina', difficulty: 2, category: 'fruits' }, { word: 'pomelo', difficulty: 2, category: 'fruits' }, { word: 'clementina', difficulty: 3, category: 'fruits' },
      { word: 'higo', difficulty: 1, category: 'fruits' }, { word: 'dátil', difficulty: 1, category: 'fruits' }, { word: 'albaricoque', difficulty: 2, category: 'fruits' },
    ],
  },
  nouns: {
    en: [
      { word: 'person', difficulty: 1, category: 'nouns' }, { word: 'place', difficulty: 1, category: 'nouns' }, { word: 'thing', difficulty: 1, category: 'nouns' },
      { word: 'mother', difficulty: 1, category: 'nouns' }, { word: 'father', difficulty: 1, category: 'nouns' }, { word: 'brother', difficulty: 2, category: 'nouns' },
      { word: 'sister', difficulty: 2, category: 'nouns' }, { word: 'friend', difficulty: 1, category: 'nouns' }, { word: 'teacher', difficulty: 2, category: 'nouns' },
      { word: 'student', difficulty: 2, category: 'nouns' }, { word: 'doctor', difficulty: 2, category: 'nouns' }, { word: 'engineer', difficulty: 2, category: 'nouns' },
      { word: 'artist', difficulty: 2, category: 'nouns' }, { word: 'musician', difficulty: 3, category: 'nouns' }, { word: 'architect', difficulty: 3, category: 'nouns' },
      { word: 'house', difficulty: 1, category: 'nouns' }, { word: 'school', difficulty: 2, category: 'nouns' }, { word: 'hospital', difficulty: 2, category: 'nouns' },
      { word: 'building', difficulty: 2, category: 'nouns' }, { word: 'city', difficulty: 1, category: 'nouns' }, { word: 'country', difficulty: 2, category: 'nouns' },
      { word: 'mountain', difficulty: 2, category: 'nouns' }, { word: 'forest', difficulty: 2, category: 'nouns' }, { word: 'ocean', difficulty: 2, category: 'nouns' },
      { word: 'river', difficulty: 2, category: 'nouns' }, { word: 'desert', difficulty: 2, category: 'nouns' }, { word: 'island', difficulty: 2, category: 'nouns' },
      { word: 'technology', difficulty: 3, category: 'nouns' }, { word: 'knowledge', difficulty: 3, category: 'nouns' }, { word: 'learning', difficulty: 2, category: 'nouns' },
    ],
    es: [
      { word: 'persona', difficulty: 1, category: 'nouns' }, { word: 'lugar', difficulty: 1, category: 'nouns' }, { word: 'cosa', difficulty: 1, category: 'nouns' },
      { word: 'madre', difficulty: 1, category: 'nouns' }, { word: 'padre', difficulty: 1, category: 'nouns' }, { word: 'hermano', difficulty: 2, category: 'nouns' },
      { word: 'hermana', difficulty: 2, category: 'nouns' }, { word: 'amigo', difficulty: 1, category: 'nouns' }, { word: 'maestro', difficulty: 2, category: 'nouns' },
      { word: 'estudiante', difficulty: 2, category: 'nouns' }, { word: 'doctor', difficulty: 2, category: 'nouns' }, { word: 'ingeniero', difficulty: 2, category: 'nouns' },
      { word: 'artista', difficulty: 2, category: 'nouns' }, { word: 'músico', difficulty: 3, category: 'nouns' }, { word: 'arquitecto', difficulty: 3, category: 'nouns' },
      { word: 'casa', difficulty: 1, category: 'nouns' }, { word: 'escuela', difficulty: 2, category: 'nouns' }, { word: 'hospital', difficulty: 2, category: 'nouns' },
      { word: 'edificio', difficulty: 2, category: 'nouns' }, { word: 'ciudad', difficulty: 1, category: 'nouns' }, { word: 'país', difficulty: 1, category: 'nouns' },
      { word: 'montaña', difficulty: 2, category: 'nouns' }, { word: 'bosque', difficulty: 2, category: 'nouns' }, { word: 'océano', difficulty: 2, category: 'nouns' },
      { word: 'río', difficulty: 1, category: 'nouns' }, { word: 'desierto', difficulty: 2, category: 'nouns' }, { word: 'isla', difficulty: 1, category: 'nouns' },
      { word: 'tecnología', difficulty: 3, category: 'nouns' }, { word: 'conocimiento', difficulty: 3, category: 'nouns' }, { word: 'aprendizaje', difficulty: 2, category: 'nouns' },
    ],
  },
  verbs: {
    en: [
      { word: 'run', difficulty: 1, category: 'verbs' }, { word: 'walk', difficulty: 1, category: 'verbs' }, { word: 'jump', difficulty: 1, category: 'verbs' },
      { word: 'sit', difficulty: 1, category: 'verbs' }, { word: 'stand', difficulty: 1, category: 'verbs' }, { word: 'eat', difficulty: 1, category: 'verbs' },
      { word: 'drink', difficulty: 1, category: 'verbs' }, { word: 'sleep', difficulty: 1, category: 'verbs' }, { word: 'wake', difficulty: 1, category: 'verbs' },
      { word: 'play', difficulty: 1, category: 'verbs' }, { word: 'work', difficulty: 1, category: 'verbs' }, { word: 'study', difficulty: 2, category: 'verbs' },
      { word: 'learn', difficulty: 2, category: 'verbs' }, { word: 'teach', difficulty: 2, category: 'verbs' }, { word: 'read', difficulty: 1, category: 'verbs' },
      { word: 'write', difficulty: 1, category: 'verbs' }, { word: 'speak', difficulty: 2, category: 'verbs' }, { word: 'listen', difficulty: 2, category: 'verbs' },
      { word: 'create', difficulty: 2, category: 'verbs' }, { word: 'build', difficulty: 2, category: 'verbs' }, { word: 'destroy', difficulty: 2, category: 'verbs' },
      { word: 'understand', difficulty: 2, category: 'verbs' }, { word: 'think', difficulty: 2, category: 'verbs' }, { word: 'believe', difficulty: 2, category: 'verbs' },
      { word: 'know', difficulty: 1, category: 'verbs' }, { word: 'remember', difficulty: 2, category: 'verbs' }, { word: 'forget', difficulty: 2, category: 'verbs' },
      { word: 'improve', difficulty: 3, category: 'verbs' }, { word: 'explore', difficulty: 3, category: 'verbs' }, { word: 'discover', difficulty: 3, category: 'verbs' },
    ],
    es: [
      { word: 'correr', difficulty: 1, category: 'verbs' }, { word: 'caminar', difficulty: 1, category: 'verbs' }, { word: 'saltar', difficulty: 1, category: 'verbs' },
      { word: 'sentarse', difficulty: 2, category: 'verbs' }, { word: 'levantarse', difficulty: 2, category: 'verbs' }, { word: 'comer', difficulty: 1, category: 'verbs' },
      { word: 'beber', difficulty: 1, category: 'verbs' }, { word: 'dormir', difficulty: 1, category: 'verbs' }, { word: 'despertar', difficulty: 2, category: 'verbs' },
      { word: 'jugar', difficulty: 1, category: 'verbs' }, { word: 'trabajar', difficulty: 1, category: 'verbs' }, { word: 'estudiar', difficulty: 2, category: 'verbs' },
      { word: 'aprender', difficulty: 2, category: 'verbs' }, { word: 'enseñar', difficulty: 2, category: 'verbs' }, { word: 'leer', difficulty: 1, category: 'verbs' },
      { word: 'escribir', difficulty: 1, category: 'verbs' }, { word: 'hablar', difficulty: 2, category: 'verbs' }, { word: 'escuchar', difficulty: 2, category: 'verbs' },
      { word: 'crear', difficulty: 2, category: 'verbs' }, { word: 'construir', difficulty: 2, category: 'verbs' }, { word: 'destruir', difficulty: 2, category: 'verbs' },
      { word: 'entender', difficulty: 2, category: 'verbs' }, { word: 'pensar', difficulty: 1, category: 'verbs' }, { word: 'creer', difficulty: 1, category: 'verbs' },
      { word: 'saber', difficulty: 1, category: 'verbs' }, { word: 'recordar', difficulty: 2, category: 'verbs' }, { word: 'olvidar', difficulty: 2, category: 'verbs' },
      { word: 'mejorar', difficulty: 3, category: 'verbs' }, { word: 'explorar', difficulty: 3, category: 'verbs' }, { word: 'descubrir', difficulty: 3, category: 'verbs' },
    ],
  },
  parts_of_speech: {
    en: [
      { word: 'noun', difficulty: 1, category: 'parts_of_speech' }, { word: 'verb', difficulty: 1, category: 'parts_of_speech' }, { word: 'adjective', difficulty: 2, category: 'parts_of_speech' },
      { word: 'adverb', difficulty: 2, category: 'parts_of_speech' }, { word: 'pronoun', difficulty: 2, category: 'parts_of_speech' }, { word: 'preposition', difficulty: 2, category: 'parts_of_speech' },
      { word: 'conjunction', difficulty: 2, category: 'parts_of_speech' }, { word: 'interjection', difficulty: 3, category: 'parts_of_speech' }, { word: 'article', difficulty: 1, category: 'parts_of_speech' },
      { word: 'determiner', difficulty: 3, category: 'parts_of_speech' }, { word: 'gerund', difficulty: 3, category: 'parts_of_speech' }, { word: 'participle', difficulty: 3, category: 'parts_of_speech' },
      { word: 'infinitive', difficulty: 3, category: 'parts_of_speech' }, { word: 'clause', difficulty: 3, category: 'parts_of_speech' }, { word: 'phrase', difficulty: 2, category: 'parts_of_speech' },
      { word: 'subject', difficulty: 2, category: 'parts_of_speech' }, { word: 'object', difficulty: 2, category: 'parts_of_speech' }, { word: 'predicate', difficulty: 3, category: 'parts_of_speech' },
      { word: 'compound', difficulty: 3, category: 'parts_of_speech' }, { word: 'simple', difficulty: 1, category: 'parts_of_speech' }, { word: 'complex', difficulty: 3, category: 'parts_of_speech' },
      { word: 'tense', difficulty: 2, category: 'parts_of_speech' }, { word: 'mood', difficulty: 3, category: 'parts_of_speech' }, { word: 'voice', difficulty: 3, category: 'parts_of_speech' },
      { word: 'person', difficulty: 2, category: 'parts_of_speech' }, { word: 'number', difficulty: 2, category: 'parts_of_speech' }, { word: 'gender', difficulty: 2, category: 'parts_of_speech' },
      { word: 'modifier', difficulty: 3, category: 'parts_of_speech' }, { word: 'complement', difficulty: 3, category: 'parts_of_speech' }, { word: 'attribute', difficulty: 3, category: 'parts_of_speech' },
    ],
    es: [
      { word: 'sustantivo', difficulty: 1, category: 'parts_of_speech' }, { word: 'verbo', difficulty: 1, category: 'parts_of_speech' }, { word: 'adjetivo', difficulty: 2, category: 'parts_of_speech' },
      { word: 'adverbio', difficulty: 2, category: 'parts_of_speech' }, { word: 'pronombre', difficulty: 2, category: 'parts_of_speech' }, { word: 'preposición', difficulty: 2, category: 'parts_of_speech' },
      { word: 'conjunción', difficulty: 2, category: 'parts_of_speech' }, { word: 'interjección', difficulty: 3, category: 'parts_of_speech' }, { word: 'artículo', difficulty: 1, category: 'parts_of_speech' },
      { word: 'determinante', difficulty: 3, category: 'parts_of_speech' }, { word: 'gerundio', difficulty: 3, category: 'parts_of_speech' }, { word: 'participio', difficulty: 3, category: 'parts_of_speech' },
      { word: 'infinitivo', difficulty: 3, category: 'parts_of_speech' }, { word: 'cláusula', difficulty: 3, category: 'parts_of_speech' }, { word: 'frase', difficulty: 2, category: 'parts_of_speech' },
      { word: 'sujeto', difficulty: 2, category: 'parts_of_speech' }, { word: 'objeto', difficulty: 2, category: 'parts_of_speech' }, { word: 'predicado', difficulty: 3, category: 'parts_of_speech' },
      { word: 'compuesto', difficulty: 3, category: 'parts_of_speech' }, { word: 'simple', difficulty: 1, category: 'parts_of_speech' }, { word: 'complejo', difficulty: 3, category: 'parts_of_speech' },
      { word: 'tiempo', difficulty: 2, category: 'parts_of_speech' }, { word: 'modo', difficulty: 3, category: 'parts_of_speech' }, { word: 'voz', difficulty: 3, category: 'parts_of_speech' },
      { word: 'persona', difficulty: 2, category: 'parts_of_speech' }, { word: 'número', difficulty: 2, category: 'parts_of_speech' }, { word: 'género', difficulty: 2, category: 'parts_of_speech' },
      { word: 'modificador', difficulty: 3, category: 'parts_of_speech' }, { word: 'complemento', difficulty: 3, category: 'parts_of_speech' }, { word: 'atributo', difficulty: 3, category: 'parts_of_speech' },
    ],
  },
  tenses: {
    en: [
      { word: 'present', difficulty: 1, category: 'tenses' }, { word: 'past', difficulty: 1, category: 'tenses' }, { word: 'future', difficulty: 1, category: 'tenses' },
      { word: 'simple', difficulty: 2, category: 'tenses' }, { word: 'continuous', difficulty: 2, category: 'tenses' }, { word: 'perfect', difficulty: 2, category: 'tenses' },
      { word: 'present perfect', difficulty: 3, category: 'tenses' }, { word: 'past perfect', difficulty: 3, category: 'tenses' }, { word: 'future perfect', difficulty: 3, category: 'tenses' },
      { word: 'progressive', difficulty: 2, category: 'tenses' }, { word: 'habitual', difficulty: 2, category: 'tenses' }, { word: 'conditional', difficulty: 3, category: 'tenses' },
      { word: 'subjunctive', difficulty: 4, category: 'tenses' }, { word: 'imperative', difficulty: 2, category: 'tenses' }, { word: 'indicative', difficulty: 3, category: 'tenses' },
      { word: 'preterite', difficulty: 3, category: 'tenses' }, { word: 'imperfect', difficulty: 3, category: 'tenses' }, { word: 'pluperfect', difficulty: 4, category: 'tenses' },
      { word: 'sequential', difficulty: 4, category: 'tenses' }, { word: 'momentaneous', difficulty: 4, category: 'tenses' }, { word: 'iterative', difficulty: 4, category: 'tenses' },
      { word: 'instantaneous', difficulty: 4, category: 'tenses' }, { word: 'durative', difficulty: 4, category: 'tenses' }, { word: 'perfective', difficulty: 4, category: 'tenses' },
      { word: 'imperfective', difficulty: 4, category: 'tenses' }, { word: 'aspectual', difficulty: 5, category: 'tenses' }, { word: 'modality', difficulty: 5, category: 'tenses' },
      { word: 'transitivity', difficulty: 5, category: 'tenses' }, { word: 'causative', difficulty: 4, category: 'tenses' }, { word: 'reflexive', difficulty: 4, category: 'tenses' },
    ],
    es: [
      { word: 'presente', difficulty: 1, category: 'tenses' }, { word: 'pasado', difficulty: 1, category: 'tenses' }, { word: 'futuro', difficulty: 1, category: 'tenses' },
      { word: 'simple', difficulty: 2, category: 'tenses' }, { word: 'continuo', difficulty: 2, category: 'tenses' }, { word: 'perfecto', difficulty: 2, category: 'tenses' },
      { word: 'pretérito perfecto', difficulty: 3, category: 'tenses' }, { word: 'pretérito pluscuamperfecto', difficulty: 4, category: 'tenses' }, { word: 'futuro perfecto', difficulty: 3, category: 'tenses' },
      { word: 'progresivo', difficulty: 2, category: 'tenses' }, { word: 'habitual', difficulty: 2, category: 'tenses' }, { word: 'condicional', difficulty: 3, category: 'tenses' },
      { word: 'subjuntivo', difficulty: 4, category: 'tenses' }, { word: 'imperativo', difficulty: 2, category: 'tenses' }, { word: 'indicativo', difficulty: 3, category: 'tenses' },
      { word: 'pretérito indefinido', difficulty: 3, category: 'tenses' }, { word: 'imperfecto', difficulty: 3, category: 'tenses' }, { word: 'plusquamperfecto', difficulty: 4, category: 'tenses' },
      { word: 'secuencial', difficulty: 4, category: 'tenses' }, { word: 'momentáneo', difficulty: 4, category: 'tenses' }, { word: 'iterativo', difficulty: 4, category: 'tenses' },
      { word: 'instantáneo', difficulty: 4, category: 'tenses' }, { word: 'durativo', difficulty: 4, category: 'tenses' }, { word: 'perfectivo', difficulty: 4, category: 'tenses' },
      { word: 'imperfectivo', difficulty: 4, category: 'tenses' }, { word: 'aspectual', difficulty: 5, category: 'tenses' }, { word: 'modalidad', difficulty: 5, category: 'tenses' },
      { word: 'transitividad', difficulty: 5, category: 'tenses' }, { word: 'causativo', difficulty: 4, category: 'tenses' }, { word: 'reflexivo', difficulty: 4, category: 'tenses' },
    ],
  },
  verb_to_be: {
    en: [
      { word: 'am', difficulty: 1, category: 'verb_to_be' }, { word: 'are', difficulty: 1, category: 'verb_to_be' }, { word: 'is', difficulty: 1, category: 'verb_to_be' },
      { word: 'was', difficulty: 1, category: 'verb_to_be' }, { word: 'were', difficulty: 1, category: 'verb_to_be' }, { word: 'be', difficulty: 1, category: 'verb_to_be' },
      { word: 'being', difficulty: 2, category: 'verb_to_be' }, { word: 'been', difficulty: 2, category: 'verb_to_be' }, { word: 'will be', difficulty: 2, category: 'verb_to_be' },
      { word: 'going to be', difficulty: 2, category: 'verb_to_be' }, { word: 'was being', difficulty: 3, category: 'verb_to_be' }, { word: 'have been', difficulty: 2, category: 'verb_to_be' },
      { word: 'has been', difficulty: 2, category: 'verb_to_be' }, { word: 'had been', difficulty: 3, category: 'verb_to_be' }, { word: 'will have been', difficulty: 3, category: 'verb_to_be' },
      { word: 'exists', difficulty: 2, category: 'verb_to_be' }, { word: 'existed', difficulty: 2, category: 'verb_to_be' }, { word: 'presence', difficulty: 2, category: 'verb_to_be' },
      { word: 'being present', difficulty: 3, category: 'verb_to_be' }, { word: 'becoming', difficulty: 3, category: 'verb_to_be' }, { word: 'remaining', difficulty: 3, category: 'verb_to_be' },
      { word: 'are not', difficulty: 2, category: 'verb_to_be' }, { word: 'is not', difficulty: 1, category: 'verb_to_be' }, { word: 'am not', difficulty: 1, category: 'verb_to_be' },
      { word: 'were not', difficulty: 2, category: 'verb_to_be' }, { word: 'was not', difficulty: 1, category: 'verb_to_be' }, { word: 'be not', difficulty: 2, category: 'verb_to_be' },
      { word: 'negation', difficulty: 3, category: 'verb_to_be' }, { word: 'affirmation', difficulty: 3, category: 'verb_to_be' }, { word: 'conditional being', difficulty: 4, category: 'verb_to_be' },
    ],
    es: [
      { word: 'soy', difficulty: 1, category: 'verb_to_be' }, { word: 'eres', difficulty: 1, category: 'verb_to_be' }, { word: 'es', difficulty: 1, category: 'verb_to_be' },
      { word: 'era', difficulty: 1, category: 'verb_to_be' }, { word: 'eras', difficulty: 1, category: 'verb_to_be' }, { word: 'ser', difficulty: 1, category: 'verb_to_be' },
      { word: 'siendo', difficulty: 2, category: 'verb_to_be' }, { word: 'sido', difficulty: 2, category: 'verb_to_be' }, { word: 'seré', difficulty: 2, category: 'verb_to_be' },
      { word: 'voy a ser', difficulty: 2, category: 'verb_to_be' }, { word: 'estaba siendo', difficulty: 3, category: 'verb_to_be' }, { word: 'he sido', difficulty: 2, category: 'verb_to_be' },
      { word: 'ha sido', difficulty: 2, category: 'verb_to_be' }, { word: 'había sido', difficulty: 3, category: 'verb_to_be' }, { word: 'habré sido', difficulty: 3, category: 'verb_to_be' },
      { word: 'existo', difficulty: 2, category: 'verb_to_be' }, { word: 'existía', difficulty: 2, category: 'verb_to_be' }, { word: 'presencia', difficulty: 2, category: 'verb_to_be' },
      { word: 'estoy siendo', difficulty: 3, category: 'verb_to_be' }, { word: 'convirtiéndome', difficulty: 3, category: 'verb_to_be' }, { word: 'permaneciendo', difficulty: 3, category: 'verb_to_be' },
      { word: 'no soy', difficulty: 1, category: 'verb_to_be' }, { word: 'no eres', difficulty: 1, category: 'verb_to_be' }, { word: 'no es', difficulty: 1, category: 'verb_to_be' },
      { word: 'no era', difficulty: 1, category: 'verb_to_be' }, { word: 'no eras', difficulty: 1, category: 'verb_to_be' }, { word: 'no ser', difficulty: 1, category: 'verb_to_be' },
      { word: 'negación', difficulty: 3, category: 'verb_to_be' }, { word: 'afirmación', difficulty: 3, category: 'verb_to_be' }, { word: 'ser condicional', difficulty: 4, category: 'verb_to_be' },
    ],
  },
  abbreviations: {
    en: [
      { word: 'Mr', difficulty: 1, category: 'abbreviations' }, { word: 'Mrs', difficulty: 1, category: 'abbreviations' }, { word: 'Ms', difficulty: 1, category: 'abbreviations' },
      { word: 'Dr', difficulty: 1, category: 'abbreviations' }, { word: 'Prof', difficulty: 2, category: 'abbreviations' }, { word: 'St', difficulty: 1, category: 'abbreviations' },
      { word: 'Ave', difficulty: 2, category: 'abbreviations' }, { word: 'Blvd', difficulty: 2, category: 'abbreviations' }, { word: 'Inc', difficulty: 1, category: 'abbreviations' },
      { word: 'Ltd', difficulty: 1, category: 'abbreviations' }, { word: 'Co', difficulty: 1, category: 'abbreviations' }, { word: 'Corp', difficulty: 2, category: 'abbreviations' },
      { word: 'Jan', difficulty: 1, category: 'abbreviations' }, { word: 'Feb', difficulty: 1, category: 'abbreviations' }, { word: 'Dec', difficulty: 1, category: 'abbreviations' },
      { word: 'Mon', difficulty: 1, category: 'abbreviations' }, { word: 'Tue', difficulty: 1, category: 'abbreviations' }, { word: 'Wed', difficulty: 1, category: 'abbreviations' },
      { word: 'USA', difficulty: 1, category: 'abbreviations' }, { word: 'UK', difficulty: 1, category: 'abbreviations' }, { word: 'UN', difficulty: 1, category: 'abbreviations' },
      { word: 'etc', difficulty: 1, category: 'abbreviations' }, { word: 'eg', difficulty: 1, category: 'abbreviations' }, { word: 'ie', difficulty: 1, category: 'abbreviations' },
      { word: 'vs', difficulty: 1, category: 'abbreviations' }, { word: 'aka', difficulty: 1, category: 'abbreviations' }, { word: 'ASAP', difficulty: 2, category: 'abbreviations' },
      { word: 'FAQ', difficulty: 2, category: 'abbreviations' }, { word: 'CEO', difficulty: 2, category: 'abbreviations' }, { word: 'GPS', difficulty: 2, category: 'abbreviations' },
    ],
    es: [
      { word: 'Sr', difficulty: 1, category: 'abbreviations' }, { word: 'Sra', difficulty: 1, category: 'abbreviations' }, { word: 'Srta', difficulty: 1, category: 'abbreviations' },
      { word: 'Dr', difficulty: 1, category: 'abbreviations' }, { word: 'Prof', difficulty: 2, category: 'abbreviations' }, { word: 'Calle', difficulty: 1, category: 'abbreviations' },
      { word: 'Avenida', difficulty: 2, category: 'abbreviations' }, { word: 'Boulevard', difficulty: 2, category: 'abbreviations' }, { word: 'S.A', difficulty: 1, category: 'abbreviations' },
      { word: 'Ltda', difficulty: 1, category: 'abbreviations' }, { word: 'Compañía', difficulty: 2, category: 'abbreviations' }, { word: 'Corporación', difficulty: 2, category: 'abbreviations' },
      { word: 'Enero', difficulty: 1, category: 'abbreviations' }, { word: 'Febrero', difficulty: 1, category: 'abbreviations' }, { word: 'Diciembre', difficulty: 1, category: 'abbreviations' },
      { word: 'Lunes', difficulty: 1, category: 'abbreviations' }, { word: 'Martes', difficulty: 1, category: 'abbreviations' }, { word: 'Miércoles', difficulty: 1, category: 'abbreviations' },
      { word: 'EE.UU', difficulty: 1, category: 'abbreviations' }, { word: 'RU', difficulty: 1, category: 'abbreviations' }, { word: 'ONU', difficulty: 1, category: 'abbreviations' },
      { word: 'etc', difficulty: 1, category: 'abbreviations' }, { word: 'ej', difficulty: 1, category: 'abbreviations' }, { word: 'es decir', difficulty: 1, category: 'abbreviations' },
      { word: 'vs', difficulty: 1, category: 'abbreviations' }, { word: 'también conocido', difficulty: 2, category: 'abbreviations' }, { word: 'ASAP', difficulty: 2, category: 'abbreviations' },
      { word: 'PF', difficulty: 2, category: 'abbreviations' }, { word: 'CEO', difficulty: 2, category: 'abbreviations' }, { word: 'GPS', difficulty: 2, category: 'abbreviations' },
    ],
  },
  prepositions: {
    en: [
      { word: 'in', difficulty: 1, category: 'prepositions' }, { word: 'on', difficulty: 1, category: 'prepositions' }, { word: 'at', difficulty: 1, category: 'prepositions' },
      { word: 'to', difficulty: 1, category: 'prepositions' }, { word: 'from', difficulty: 1, category: 'prepositions' }, { word: 'with', difficulty: 1, category: 'prepositions' },
      { word: 'without', difficulty: 2, category: 'prepositions' }, { word: 'by', difficulty: 1, category: 'prepositions' }, { word: 'for', difficulty: 1, category: 'prepositions' },
      { word: 'of', difficulty: 1, category: 'prepositions' }, { word: 'about', difficulty: 2, category: 'prepositions' }, { word: 'during', difficulty: 2, category: 'prepositions' },
      { word: 'before', difficulty: 2, category: 'prepositions' }, { word: 'after', difficulty: 2, category: 'prepositions' }, { word: 'between', difficulty: 2, category: 'prepositions' },
      { word: 'among', difficulty: 2, category: 'prepositions' }, { word: 'through', difficulty: 2, category: 'prepositions' }, { word: 'across', difficulty: 2, category: 'prepositions' },
      { word: 'around', difficulty: 2, category: 'prepositions' }, { word: 'near', difficulty: 2, category: 'prepositions' }, { word: 'beside', difficulty: 2, category: 'prepositions' },
      { word: 'above', difficulty: 2, category: 'prepositions' }, { word: 'below', difficulty: 2, category: 'prepositions' }, { word: 'under', difficulty: 1, category: 'prepositions' },
      { word: 'over', difficulty: 2, category: 'prepositions' }, { word: 'inside', difficulty: 2, category: 'prepositions' }, { word: 'outside', difficulty: 2, category: 'prepositions' },
      { word: 'behind', difficulty: 2, category: 'prepositions' }, { word: 'along', difficulty: 3, category: 'prepositions' }, { word: 'throughout', difficulty: 3, category: 'prepositions' },
    ],
    es: [
      { word: 'en', difficulty: 1, category: 'prepositions' }, { word: 'sobre', difficulty: 1, category: 'prepositions' }, { word: 'a', difficulty: 1, category: 'prepositions' },
      { word: 'hacia', difficulty: 1, category: 'prepositions' }, { word: 'desde', difficulty: 1, category: 'prepositions' }, { word: 'con', difficulty: 1, category: 'prepositions' },
      { word: 'sin', difficulty: 2, category: 'prepositions' }, { word: 'por', difficulty: 1, category: 'prepositions' }, { word: 'para', difficulty: 1, category: 'prepositions' },
      { word: 'de', difficulty: 1, category: 'prepositions' }, { word: 'acerca de', difficulty: 2, category: 'prepositions' }, { word: 'durante', difficulty: 2, category: 'prepositions' },
      { word: 'antes de', difficulty: 2, category: 'prepositions' }, { word: 'después de', difficulty: 2, category: 'prepositions' }, { word: 'entre', difficulty: 2, category: 'prepositions' },
      { word: 'entre muchos', difficulty: 2, category: 'prepositions' }, { word: 'a través', difficulty: 2, category: 'prepositions' }, { word: 'cruzando', difficulty: 2, category: 'prepositions' },
      { word: 'alrededor', difficulty: 2, category: 'prepositions' }, { word: 'cerca', difficulty: 2, category: 'prepositions' }, { word: 'al lado', difficulty: 2, category: 'prepositions' },
      { word: 'encima', difficulty: 2, category: 'prepositions' }, { word: 'debajo', difficulty: 2, category: 'prepositions' }, { word: 'bajo', difficulty: 1, category: 'prepositions' },
      { word: 'sobre', difficulty: 2, category: 'prepositions' }, { word: 'dentro', difficulty: 2, category: 'prepositions' }, { word: 'fuera', difficulty: 2, category: 'prepositions' },
      { word: 'detrás', difficulty: 2, category: 'prepositions' }, { word: 'a lo largo', difficulty: 3, category: 'prepositions' }, { word: 'a lo largo de todo', difficulty: 3, category: 'prepositions' },
    ],
  },
}
