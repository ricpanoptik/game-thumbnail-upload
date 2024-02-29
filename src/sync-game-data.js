const fs = require('fs');

const axiosInstance = require('./axios-instance');

const { GAMES_LIST } = require('./lib/endpoints');

const createGameDataJSON = (gameData) => {
    const targetDir = './src/data';
    const targetOutpu = 'games.json';

    try {
        if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir);
        fs.writeFileSync(`${targetDir}/${targetOutpu}`, JSON.stringify(gameData, null, 2), 'utf8');
        console.log('Game data written to file');
    } catch (error) {
        console.log(`Error writing to file`, error.message);
    }
}

const getAllGames = async () => {
    try {
        const response = await axiosInstance.get(GAMES_LIST)
        createGameDataJSON(response.data);
    } catch (error) {
        console.log(`Error fetching games`, error.message)
    }
}

getAllGames();
// createGameDataJSON([{ id: 1, name: 'Candy Dreams', thumbnail: 'CandyDreams.jpg' }]);