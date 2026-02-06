const USER_TYPES = {
    ESTUDIANTE: 'estudiante',
    PADRE: 'padre',
    ADMIN: 'admin'
};

const GAME_TYPES = {
    FACE_MATCH: 'face-match',
    SITUATION: 'situation',
    DRAG_DROP: 'drag-drop',
    STORY: 'story'
};

const EMOTIONS = {
    JOY: 'joy',
    SADNESS: 'sadness',
    ANGER: 'anger',
    FEAR: 'fear',
    SURPRISE: 'surprise'
};

const GAME_CONFIG = {
    ROUNDS_PER_GAME: {
        'face-match': 5,
        'situation': 5,
        'drag-drop': 3,
        'story': 5
    },
    STARS_PER_CORRECT: 1
};

module.exports = {
    USER_TYPES,
    GAME_TYPES,
    EMOTIONS,
    GAME_CONFIG
};
