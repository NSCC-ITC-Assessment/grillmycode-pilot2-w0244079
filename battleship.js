/**
 * @file battleship.js
 * @module Battleship
 * @author Darren Martell
 * @date October 29, 2025
 *
 * @description
 * One-player Battleship game implemented for a Node.js CLI environment.
 * Uses synchronous console I/O (readline-sync) to prompt the player, fs to
 * read a map file, and chalk to colorize terminal output. The game loads a
 * map of ship locations from a CSV-style file, allows the user to enter
 * coordinates (e.g., "A1"), keeps track of hits and misses, and renders a
 * simple grid showing discovered hits (X) and misses (O). Prompts the user
 * after a game finishes whether to play again.
 *
 * Exported/top-level behavior:
 * - playGame(): main game loop invoked repeatedly until the user quits.
 *
 * Side effects:
 * - Reads a map file from disk using fs.readFileSync.
 * - Writes to stdout/stderr and prompts the user via readline-sync.
 * - Exits the Node process if the map file cannot be loaded.
 *
 */

/*         Main Code Loop          */

// Imports required ES packages
import fs from 'fs';
import readlineSync from 'readline-sync';
import chalk from 'chalk';

// Creates function alias for console.log()
const log = console.log;

// Do-while loop for repeated game play
do {
    // clear the console before starting the game
    console.clear();
    playGame();
} while (readlineSync.keyInYN('Play again?'));

/*         Functions           */

/**
 * @function playGame
 * @description
 * Starts and runs one full playthrough of the Battleship game. Manages the
 * game loop, tracks missile usage and hits, prompts the user for coordinates,
 * checks strikes against the loaded map, updates the visible target map,
 * and displays the board and messages after each move.
 *
 * @returns {void}
 */
function playGame() {
    const totalMissiles = 30; // total available missiles
    let strikeAttempts = 0; // accumultated number of strike attempts
    let totalStrikes = 0; // accumulated numder of successful strikes
    let firstDisplay; // indicates if this is the first time the target map is displayed
    let missilesRemaining; // number of missiles remaining
    let hitsToWin; // number of hits remaining to win

    // Ititalize both the ship locations map and the empty targets map as well as totalTargets
    const { totalTargets, locationsMap, targetsMap } = initializeMaps();

    // Displays the targets map for the first time
    displayResults(false, totalMissiles, totalTargets, targetsMap, firstDisplay = true);

    // The player turn loop
    do {
        // Player enters the launch coordinates
        let launchCoordinates = getValidCoordinates(targetsMap);
        // Checks if the coordinates hit a ship
        let targetStrike = checkForTargetStrike(launchCoordinates, locationsMap);

        strikeAttempts += 1; // increment the strike attempts

        // Updates the target map with the successful strike
        updateTargetMap(launchCoordinates, targetStrike, targetsMap);

        if (targetStrike) {
            totalStrikes += 1;  // increments the total successful strikes
        }

        // Calculate the number of missiles remaining
        missilesRemaining = totalMissiles - strikeAttempts;
        // Calculate the remaining number of hits required to win the game
        hitsToWin = totalTargets - totalStrikes;

        // Display the target map showing updated hits and misses
        displayResults(targetStrike, missilesRemaining, hitsToWin, targetsMap);

        // If there are hits left to complete and there are missile remaining,
        // then the player turn loop repeats
    } while (hitsToWin !== 0 && missilesRemaining >= hitsToWin);
}

/**
 * @function initializeMaps
 * @description
 * Initializes the populated locations map and the default un-populated targets map (both maps using
 * CSV-like rows separated by CRLF) and the toal number of targets:
 * - locationsMap: 2D array of strings read from the file ('1' indicates a ship)
 * - targetsMap:  2D array initialized with undefined for undiscovered cells,
 *                later set to 'X' for hits and 'O' for misses
 * - totalTargets: number of '1' entries in locationsMap
 *
 * @returns {{ totalTargets: number, locationsMap: string[][], targetsMap: (string|undefined)[][] }}
 *          An object containing the total target count, the parsed locations map,
 *          and the initialized targets map.
 */
function initializeMaps(locationsMapFilename) {
    // Get the locations map
    const locationsMap = getLocationsMap(locationsMapFilename);

    // Calculate the maximum rows and columns in the locations map
    const { maxRows, maxCols } = getMaxRowsAndColumns(locationsMap);

    // Create a new target map of the same size filled with 'undefined'
    const targetsMap = Array.from({ length: maxRows }).map(() => Array(maxCols).fill(undefined));

    // Calculate the total number of target positions
    let totalTargets = 0;
    locationsMap.flat().forEach(value => {
        if (value === '1') { return (totalTargets += 1) }
    });

    return { totalTargets, locationsMap, targetsMap };
}

/**
 * @function getLocationsMap
 * @description
 * Gets the populated locations map from either a pre-defined map or from a randomly generated map.
 *
 * @returns { locationsMap: string[][] }
 *          A 2D-array representing the locations map.
 */
function getLocationsMap() {
    let locationsMap; // declare locations map

    // Select the type of map to use
    let isRandomizedMap = readlineSync.keyInYNStrict('Do you want to use a randomized map instead of the pre-defined one?');

    if (isRandomizedMap) {
        // Define the ship configuration
        let ships = [2, 3, 3, 4, 5]; // i.e. 5 ships each of length 2, 3, 3, 4, & 5 respectively

        // Get the randomized map for a 10 x 10 gameboard grid
        locationsMap = getRandomizedMap(10, 10, ships);

        // Save the randomized map to a file
        writeFileContents('randomizedMap.txt', locationsMap.map(row => row.join(',')).join('\n'));
    } else {
        // Load and parse the pre-loaded ship positions map
        locationsMap = getFileContents('map.txt').split("\r\n").map((line) => line.split(','));
    }

    return locationsMap;
}

/**
 * @function getRandomizedMap
 * @description
 * Create a randomized battleship board and place the requested ships onto it.
 * The function allocates a maxRows x maxCols 2D array initialized with the
 * string '0' for empty cells. The function then iterates the provided ship sizes and
 * delegates placement to the externally defined placeShip function.
 *
 * @param {number} maxRows - Number of rows in the board (positive integer).
 * @param {number} maxCols - Number of columns in the board (positive integer).
 * @param {number[]} ships - Array of ship sizes to place (each a positive integer).
 * @returns {string[][]} A 2D array (rows x columns) representing the board. Empty
 * cells are the string '0'; ship cells are whatever markers placeShip writes.
 */
function getRandomizedMap(maxRows, maxCols, ships) {
    // Create an empty @D array for the locations map with contents filled with '0' by default.
    const locationsMap = Array.from({ length: maxRows }).map(() => new Array(maxCols).fill('0'));

    // Iterate over the ships to be place
    ships.forEach((size) => {
        // Place the ship on the locations map.
        placeShip(size, maxRows, maxCols, locationsMap);
    });

    return locationsMap; // Return the populated locations map
}

/**
 * @function placeShip
 * @description
 * Place a ship of a given size onto a grid by marking occupied cells with the string '1'.
 *
 * The function repeatedly obtains a random starting cell and orientation via getRandomPosition(maxCols, maxRows)
 * and attempts to place the ship either horizontally or vertically. It verifies that each cell of the ship would
 * be within bounds ([0, maxRows) x [0, maxCols)) and not already occupied
 * (locationsMap[row][col] === '1') before committing the placement. Once a valid placement is found, the function
 * mutates locationsMap in-place to mark each ship cell with '1'.
 *
 * Notes:
 * - Orientation returned by getRandomPosition is interpreted as horizontal when truthy and vertical when falsy.
 * - The function does not return a value; it has the side effect of updating locationsMap.
 * - If no valid placement exists (for example, the grid is too full to accommodate the ship), the function
 *   will loop indefinitely attempting to find a placement.
 *
 * @param {number} size - Number of contiguous cells the ship occupies (must be a positive integer).
 * @param {number} maxRows - Total number of rows in locationsMap (valid row indices: 0 .. maxRows - 1).
 * @param {number} maxCols - Total number of columns in locationsMap (valid column indices: 0 .. maxCols - 1).
 * @param {string[][]} locationsMap - 2D array representing the board; occupied cells are represented by the string '1'.
 *                                     This array is mutated to mark the placed ship.
 * @returns {void}
 */
function placeShip(size, maxRows, maxCols, locationsMap) {
    let isValidPlacement;
    let shipCoordinates;

    // Test a random ship placement for fit on the locations map
    do {
        isValidPlacement = true; // defaults to true

        shipCoordinates = [];
        let { rndColumn, rndRow, rndIsHorizontal } = getRandomPosition(maxCols, maxRows);

        // loop to check if the selected ship coordinates overlap an existing ship
        for (let i = 0; i < size; i++) {
            // check if current position is valid
            if (rndRow >= maxRows || rndColumn >= maxCols || locationsMap[rndColumn][rndRow] === '1') {
                // set flag to repeat outer while loop since the current coordinates are invalid
                isValidPlacement = false;
            } else {
                // update ship coordinates if current position is valid
                shipCoordinates.push({ rndColumn, rndRow });
            }

            // Update column or row depending on horizontal or vertical ship orientation
            if (rndIsHorizontal) {
                rndColumn += 1; // increment column if horizontal
            } else {
                rndRow += 1; // increment row if vertical
            }
        }
    } while (!isValidPlacement); // Continue looping until a valid placement is found

    // Update the locations map since the ship placement is valid
    shipCoordinates.forEach((validCoordinates) => {
        locationsMap[validCoordinates.rndColumn][validCoordinates.rndRow] = '1';
    });
}

/**
 * @function getRandomPosition
 * @description
 * Generates random position coordinates and orientation for a ship placement
 *
 * @param {number} maxCols - Maximum number of columns in the game board
 * @param {number} maxRows - Maximum number of rows in the game board
 * @returns {Object} Object containing:
 *   - rndColumn {number} Random column position
 *   - rndRow {number} Random row position
 *   - rndIsHorizontal {boolean} Random orientation (true for horizontal, false for vertical)
 */
function getRandomPosition(maxCols, maxRows) {
    const rndIsHorizontal = Boolean(Math.round(Math.random()));
    const rndColumn = Math.floor(Math.random() * maxCols);
    const rndRow = Math.floor(Math.random() * maxRows);

    return { rndColumn, rndRow, rndIsHorizontal };
}

/**
 * @function getValidCoordinates
 * @description
 * Prompts the player for a coordinate until a syntactically valid value is
 * provided. Valid formats include a letter followed by one or two digits
 * (e.g., "A1", "B10"). This function performs basic input validation
 * (alphabetic column, numeric row, disallowing entries with a leading zero
 * for the row portion) and re-prompts on invalid input.
 *
 * @param {(string|undefined)[][]} targetsMap - The 2D array representing the game board, used to determine valid coordinate bounds.
 * @returns {string} The validated coordinate string entered by the user (e.g., "A1", "B10").
 */
function getValidCoordinates(targetsMap) {
    let coordinates; // define launch coordinates
    let isValidChoice = false; // flag for valid choice

    // Calculate the maximum rows and columns in the targets map
    const { maxRows, maxCols } = getMaxRowsAndColumns(targetsMap);

    do {
        let errorMessages = [];  // Clear the errormessages

        // Prompt for player to enter target coordinates
        coordinates = readlineSync.question(chalk.green(`Choose your target (Ex. A1): `));

        // Build a list of error messages for invalid entries
        try {
            // Only coordinate of length 2 & 3 allowed
            if (!([2, 3].includes(coordinates.length))) {
                errorMessages.push("Coordinates must be only 2 or 3 characters long.");
            }

            // First part of coordinate must be a letter
            if (!(/[a-z]/i.test(coordinates[0]))) {
                errorMessages.push("The first character must be a letter.");
            }

            // Letter must be at least char 65 ('A')
            if (!(coordinates[0].toUpperCase().charCodeAt(0) - 64 > 0)) {
                errorMessages.push("The letter component must at least start with an 'A' or 'a'.");
            }

            // Letter must not be greater than char(max columns)
            if (!(coordinates[0].toUpperCase().charCodeAt(0) - 64 <= maxCols)) {
                errorMessages.push("The letter component must not be greater than the number of columns.");
            }

            // Number part of coordinate cannot begin with '0'
            if (coordinates[1] === '0') {
                errorMessages.push("The number component cannot begin with a '0'.");
            }

            // Number part of coordinate must use only 1 or 2 digits
            if (!(/^[0-9]{1,2}$/.test(coordinates.slice(1, coordinates.length)))) {
                errorMessages.push("The number component must be only 1 or 2 digits.");
            }

            // Number must be greater than 0
            if (!(Number(coordinates.slice(1, coordinates.length)) > 0)) {
                errorMessages.push("The number component must be greater than 0.");
            }

            // Number must be less than or equal to the number of rows in the map
            if (!(Number(coordinates.slice(1, coordinates.length)) <= maxRows)) {
                errorMessages.push("The number component cannot be greater than the number of rows.");
            }
        } catch (error) {  // Catch unexpected errors
            errorMessages.push(error);
        }

        if (errorMessages.length > 0) {
            // Display error messages
            log(chalk.rgb(255, 136, 0)(errorMessages.join('\n')));
            // Prompt player to try again
            log(chalk.rgb(255, 136, 0)('Please Try Again.'));
        } else if (checkForRepeatedStrike(coordinates, targetsMap)) {
            // Display message for player to try again if this is a repeated coordinate entry
            log(chalk.rgb(255, 136, 0)('You already hit this position. Please Try Again.'));
        } else {
            // Set the choice as valid
            isValidChoice = true;
        }
    } while (!isValidChoice); // Exit validation loop

    return coordinates; // return valid coordinates
}

/**
 * @function checkForTargetStrike
 * @description
 * Determines whether a given launch coordinate corresponds to a ship position
 * on the provided locations map. Uses getRowAndColumn internally to convert
 * the coordinate string into row/column indices.
 *
 * @param {string} launchCoordinates - Coordinate string (e.g., "A1").
 * @param {string[][]} locationsMap - 2D array representation of ship locations.
 * @returns {boolean} True if the coordinate hits a ship ('1'); otherwise false.
 */
function checkForTargetStrike(launchCoordinates, locationsMap) {
    // Calculate numeric row and column for coordinates
    const { targetRow, targetColumn } = getRowAndColumn(launchCoordinates);

    // Target strike if the position in the locations map is a '1' otherwise no strike
    if (locationsMap[targetRow][targetColumn] === '1') {
        return true; // a hit
    } else {
        return false;  // a miss
    }
}

/**
 * @function checkForRepeatedStrike
 * @description
 * Determines whether a given launch coordinate corresponds to a position
 * that was already targeted. Uses getRowAndColumn internally to convert
 * the coordinate string into row/column indices.
 *
 * @param {string} launchCoordinates - Coordinate string (e.g., "A1").
 * @param {string[][]} targetsMap - 2D array representation of targets.
 * @returns {boolean} True if the coordinate would repeat a previous strike attempt; otherwise false.
 */
function checkForRepeatedStrike(launchCoordinates, targetsMap) {
    // Calculate numeric row and column for coordinates
    const { targetRow, targetColumn } = getRowAndColumn(launchCoordinates);

    // If the targets map position is already defined, these are repeated coordinates
    if (targetsMap[targetRow][targetColumn] !== undefined) {
        return true;
    } else {
        return false;
    }
}

/**
 * @function updateTargetMap
 * @description
 * Records the result of a launch on the visible targets map. Marks 'X' for
 * hits and 'O' for misses at the computed row/column derived from the
 * launch coordinate.
 *
 * @param {string} launchCoordinates - Coordinate string (e.g., "A1").
 * @param {boolean} targetStrike - True for a hit, false for a miss.
 * @param {(string|undefined)[][]} targetsMap - The player's visible 2D map to update.
 * @returns {void}
 */
function updateTargetMap(launchCoordinates, targetStrike, targetsMap) {
    // Calculate numeric row and column for coordinates
    const { targetRow, targetColumn } = getRowAndColumn(launchCoordinates);

    // Update the targets map with an 'X' or an 'O' for hit and miss respectively
    if (targetStrike === true) {
        targetsMap[targetRow][targetColumn] = 'X'
    } else {
        targetsMap[targetRow][targetColumn] = 'O'
    }
}

/**
 * @function displayResults
 * @description
 * Displays the result message for the most recent shot (HIT/MISS), summary
 * status (missiles remaining and hits required), and renders the current
 * targets map to stdout. When firstDisplay is true, prints a welcome message
 * and initial missile count instead of a HIT/MISS banner.
 *
 * @param {boolean} targetStrike - Whether the most recent shot was a hit.
 * @param {number} missilesRemaining - Number of missiles the player has left.
 * @param {number} hitsToWin - Number of remaining hits required to win.
 * @param {(string|undefined)[][]} targetsMap - The player's visible 2D map to render.
 * @param {boolean} [firstDisplay=false] - If true, renders the initial welcome text.
 * @returns {void}
 */
function displayResults(targetStrike, missilesRemaining, hitsToWin, targetsMap, firstDisplay = false) {
    // clear the console before displaying the results
    console.clear();

    if (firstDisplay) {
        // Display the start game information header if this is the first time the targets map is show
        log(chalk.blue.bold("Let's play Battleship!"));
        log(chalk.green(`You have ${missilesRemaining} missiles to fire to sink all 5 ships`));

    } else {
        // Display hit or miss if this isn't the first time the targets map is shown
        if (targetStrike) {
            log(chalk.red.bold('HIT!!!'));
        } else {
            log(chalk.blue.bold('MISS!!!'));
        }
    }

    // Draw the targets map
    drawMap(targetsMap);

    // Display the turn results
    if (hitsToWin === 0) {
        // Display win message if there are no hits left to win
        log(chalk.grey('YOU WIN! - YOU SANK MY ENTIRE FLEET!'));
    } else if (missilesRemaining < hitsToWin) {
        // Display lose message if there are still hits to win but not enough missiles remain
        log(`YOU LOSE - YOU NEED ${hitsToWin} HITS TO WIN BUT ONLY ${missilesRemaining} MISSILES REMAINING`);
        log(chalk.magenta.bold('BETTER LUCK NEXT TIME!'));
    } else {
        // Display the number of missiles remaining and the number of hits left to win
        log('You have ' + chalk.rgb(150, 75, 0).bold(missilesRemaining) + ' missiles remaining!');
        log('You need ' + chalk.rgb(150, 75, 0).bold(hitsToWin) + ' more hits to win!');
    }
}

/**
 * @function drawMap
 * @description
 * Renders the visible targets map in a human-friendly grid to stdout with
 * column letters and row numbers. Uses colored output to indicate hits (X) and
 * misses (O) and leaves undiscovered cells blank.
 *
 * @param {(string|undefined)[][]} targetsMap - 2D array of target display values.
 * @returns {void}
 */
function drawMap(targetsMap) {
    // Calculate the maximum rows and columns in the targets map
    const { maxRows, maxCols } = getMaxRowsAndColumns(targetsMap);

    // Display column header with appropriate spacing
    process.stdout.write(chalk.white.bold.bgBlack('    '));
    for (let column = 0; column < maxCols; column++) {
        process.stdout.write(chalk.white.bold.bgBlack(`${String.fromCharCode(column + 65)} `));
    }
    process.stdout.write(chalk.white.bold.bgBlack(' \n'));

    // Display rows with row headers and hit/miss indicators
    for (let row = 0; row < maxRows; row++) {
        // Display row number and start of row
        process.stdout.write(chalk.white.bold.bgBlack(`${(row + 1).toString().padStart(2, ' ')} `));
        process.stdout.write(chalk.white.bold.bgWhiteBright(' '));

        //  Display hit/miss indicators for a row
        for (let column = 0; column < maxCols; column++) {
            switch (targetsMap[row][column]) {
                case 'X':
                    process.stdout.write(chalk.red.bold.bgWhiteBright(`X `));
                    break;

                case 'O':
                    process.stdout.write(chalk.blue.bold.bgWhiteBright(`O `));
                    break;

                default:
                    process.stdout.write(chalk.white.bold.bgWhiteBright(`  `));
                    break;
            }
        }

        // Display the end of row
        process.stdout.write(chalk.white.bold.bgBlack(' \n'));
    }

    // Display the bottom row
    process.stdout.write(chalk.bgBlack('    '));
    for (let column = 0; column < maxCols; column++) {
        process.stdout.write(chalk.bgBlack(`  `));
    }
    process.stdout.write(chalk.bgBlack(' \n'));
}

/**
 * @function getRowAndColumn
 * @description
 * Converts a coordinate string like "A1" into zero-based numeric row and
 * column indices appropriate for indexing the internal 2D arrays. Columns
 * are derived from the first character (A=>0, B=>1, ...), rows from the
 * numeric portion (1 => 0, 2 => 1, ...).
 *
 * @param {string} launchCoordinates - Coordinate string (e.g., "A1").
 * @returns {{ targetRow: number, targetColumn: number }} Object with zero-based indices.
 */
function getRowAndColumn(launchCoordinates) {
    // Calculate the target row from the numeric part of the coordinates
    let targetRow = Number(launchCoordinates.slice(1, launchCoordinates.length)) - 1;
    // Calcualte the target column from the letter part of the coordinate
    let targetColumn = launchCoordinates[0].toUpperCase().charCodeAt(0) - 65;

    return { targetRow, targetColumn };
}

/**
 * @function getMaxRowsAndColumns
 * @description
 * Determines the maximum number of rows and columns in a 2D array
 *
 * @param {(string|undefined)[][]} map - A 2D array representing the game board
 * @returns {{maxRows: number, maxCols: number}} An object containing the maximum number of rows and columns
 * @throws {TypeError} Throws if map is not a 2D array
 */
function getMaxRowsAndColumns(map) {
    // Calculate the maximum number of rows as the map length
    let maxRows = map.length;
    // Calculate the maximum number of columns as the length of the first map row
    let maxCols = map[0].length;

    return { maxRows, maxCols };
}

/**
 * @function getFileContents
 * @description
 * Reads a file from disk synchronously and returns its UTF-8 contents as a
 * string. If the file cannot be read, logs an error and terminates the
 * process (process.exit).
 *
 * @param {string} fileName - Path to the file to load.
 * @throws Will call process.exit() on read error (intended behavior for the game).
 * @returns {string} File contents as UTF-8 text.
 */
function getFileContents(fileName) {
    let content;  // defines file content variable

    try {
        // tries to get the file content
        content = fs.readFileSync(fileName, { encoding: 'utf-8' });
    } catch (error) {
        // error is displayed to the user and the program terminates
        console.error(`An error has occurred loading file '${fileName}'. Please try again later.`);
        process.exit()
    }

    return content; // returns the file content
}

/**
 * @function writeFileContents
 * @description
 * Writes a file to disk synchronously using UTF-8 encoding.
 * If the file cannot be created, logs an error and terminates the
 * process (process.exit).
 *
 * @param {string} fileName - Path of the file to write.
 * @param {string} contents - The contents of the file formatted as a string.
 * @throws Will call process.exit() on write error (intended behavior for the game).
 * @returns {void}
 */
function writeFileContents(fileName, contents) {
    try {
        // tries to write the file content using utf-8 encoding and the write flag
        // Note that both encoding and flag values are default here so could be left out
        fs.writeFileSync(fileName, contents, { encoding: 'utf-8', flag: 'w' });
    } catch (error) {
        // error is displayed to the user and the program terminates
        console.error(`An error has occurred writing file '${fileName}'. Please try again later.`);
        process.exit()
    }
}