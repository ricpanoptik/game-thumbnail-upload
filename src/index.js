const path = require('path');
const fs = require('fs');
const FormData = require('form-data');

const axiosInstance = require('./axios-instance')

const { CTGAMES, JDBGAMES, MACAWGAMES, MGames, YGTGAMES } = require('./game-thumbnails');

const { GAME_UPLOAD_THUMBNAIL, GAME_UPDATE } = require('./lib/endpoints');

const sleep = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const uploadToAPI = async (gameId, filePath) => {
    // Read the file from filesystem
    const file = fs.createReadStream(path.join(__dirname, '../', filePath))

    // Create a form data
    const formData = new FormData();
    formData.append('image', file);
    formData.append('gameId', gameId);

    try {
        // Send a POST request to the external API
        const response = await axiosInstance.post(GAME_UPLOAD_THUMBNAIL, formData, {
            headers: {
                ...formData.getHeaders(),
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`
            }
        })
        console.log(`Upload Successful: ${filePath}`, response.data);
        return response.data.body;
    } catch (error) {
        console.log(`Error uploading image: ${filePath}`, error.message)
    }
}

const updateGameThumbnail = async (payload) => {
    try {
        const response = await axiosInstance.post(GAME_UPDATE, payload);
        console.log('Game thumbnail updated', response.data);
    } catch (error) {
        console.log('Error updating game thumbnail', error.message);
    }
}

const getByGameTypeID = (gameTypeID, code) => {
    switch (gameTypeID) {
        case 6:
          return CTGAMES[code];
        case 8:
          return YGTGAMES[code];
        case 9:
          return JDBGAMES[code];
        case 10:
          return MACAWGAMES[code];
        default:
          return MGames[code];
      }
}

// continue where it left off
const failedUpdateGames = [
    2229,
    2207,
    1137,
    100026,
    2165,
    1070,
    1068,
    1069,
    2230,
    2167,
    2389,
    1134,
    1025,
    2147,
    2280,
    1089,
    2262,
    2243,
    1077,
    1104,
    2326,
    1031,
    1029,
    1133,
    2496,
    2275,
    2325,
    1061,
    2471,
    2348,
    2222,
    2265,
];

(async () => {
    try {
        const allGames = fs.readFileSync(path.join(__dirname, 'data', 'games.json'), 'utf-8');
        const games = JSON.parse(allGames)
            .filter(g => failedUpdateGames.includes(g.code)); // comment this line to update all games

        // Uncomment the line below to test with a smaller subset of games
        //games.splice(10, games.length);

        for (const game of games) {
            const gameThumbnail = getByGameTypeID(game.gameTypeID, game.code);

            if (gameThumbnail) {
                const uploadRes = await uploadToAPI(game.id, gameThumbnail);
                const publicThumbnalUrl = uploadRes.data.variants[0];

                game.thumbnailPath = publicThumbnalUrl;

                await updateGameThumbnail(game);
            }

            await sleep(2000);
        }

        console.log('Game thumbnails uploaded and thumbnailPath updated successfully!');
    } catch (error) {
        console.error('Error updating game thumbnails:', error.message);
    }
})()