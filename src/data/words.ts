import type { WordData, PhraseData, ParagraphData } from '../types'

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
