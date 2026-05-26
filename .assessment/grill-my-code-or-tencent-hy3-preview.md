## Grill My Code

> **Generated:** 2026-05-26 03:56:13 UTC


> **Commits reviewed:** `6c9bd79` → `e9552f5`

> **Code Files Assessed:** `battleship.js`


---

**`battleship.js`**

```js
import fs from 'fs';
import readlineSync from 'readline-sync';
import chalk from 'chalk';

const log = console.log;

do {

    console.clear();
    playGame();
} while (readlineSync.keyInYN('Play again?'));
```

1. What is the value of `log` in this code snippet?

---

**`battleship.js`**

```js
function playGame() {
    const totalMissiles = 30; 
    let strikeAttempts = 0; 
    let totalStrikes = 0; 
    let firstDisplay; 
    let missilesRemaining; 
    let hitsToWin; 

    const { totalTargets, locationsMap, targetsMap } = initializeMaps();

    displayResults(false, totalMissiles, totalTargets, targetsMap, firstDisplay = true);

    do {

        let launchCoordinates = getValidCoordinates(targetsMap);

        let targetStrike = checkForTargetStrike(launchCoordinates, locationsMap);

        strikeAttempts += 1; 

        updateTargetMap(launchCoordinates, targetStrike, targetsMap);

        if (targetStrike) {
            totalStrikes += 1;  
        }

        missilesRemaining = totalMissiles - strikeAttempts;

        hitsToWin = totalTargets - totalStrikes;

        displayResults(targetStrike, missilesRemaining, hitsToWin, targetsMap);

    } while (hitsToWin !== 0 && missilesRemaining >= hitsToWin);
}
```

2. What is the initial value of `totalMissiles` in `playGame`?

---

**`battleship.js`**

```js
function playGame() {
    // ... variable declarations

    do {

        // ... game loop logic

    } while (hitsToWin !== 0 && missilesRemaining >= hitsToWin);
}
```

3. When does the inner game loop in `playGame` terminate?

<!-- Lengths: C=13 | D1=14 | D2=13 | D3=12 -->

---

**`battleship.js`**

```js
function initializeMaps(locationsMapFilename) {

    const locationsMap = getLocationsMap(locationsMapFilename);

    const { maxRows, maxCols } = getMaxRowsAndColumns(locationsMap);

    const targetsMap = Array.from({ length: maxRows }).map(() => Array(maxCols).fill(undefined));

    let totalTargets = 0;
    locationsMap.flat().forEach(value => {
        if (value === '1') { return (totalTargets += 1) }
    });

    return { totalTargets, locationsMap, targetsMap };
}
```

4. What value fills each cell of `targetsMap` when it is first created in `initializeMaps`?

---

**`battleship.js`**

```js
function getLocationsMap() {
    let locationsMap; 

    let isRandomizedMap = readlineSync.keyInYNStrict('Do you want to use a randomized map instead of the pre-defined one?');

    if (isRandomizedMap) {

        let ships = [2, 3, 3, 4, 5]; 

        locationsMap = getRandomizedMap(10, 10, ships);

        writeFileContents('randomizedMap.txt', locationsMap.map(row => row.join(',')).join('\n'));
    } else {

        locationsMap = getFileContents('map.txt').split("\r\n").map((line) => line.split(','));
    }

    return locationsMap;
}
```

5. What is the filename of the pre-defined map loaded when `isRandomizedMap` is false?

---

**`battleship.js`**

```js
function getRandomizedMap(maxRows, maxCols, ships) {

    const locationsMap = Array.from({ length: maxRows }).map(() => new Array(maxCols).fill('0'));

    ships.forEach((size) => {

        placeShip(size, maxRows, maxCols, locationsMap);
    });

    return locationsMap; 
}
```

6. What initial value fills every cell of `locationsMap` in `getRandomizedMap`?

---

**`battleship.js`**

```js
function placeShip(size, maxRows, maxCols, locationsMap) {
    let isValidPlacement;
    let shipCoordinates;

    do {
        isValidPlacement = true; 

        shipCoordinates = [];
        let { rndColumn, rndRow, rndIsHorizontal } = getRandomPosition(maxCols, maxRows);

        for (let i = 0; i < size; i++) {

            if (rndRow >= maxRows || rndColumn >= maxCols || locationsMap[rndColumn][rndRow] === '1') {

                isValidPlacement = false;
            } else {

                shipCoordinates.push({ rndColumn, rndRow });
            }

            if (rndIsHorizontal) {
                rndColumn += 1; 
            } else {
                rndRow += 1; 
            }
        }
    } while (!isValidPlacement); 

    shipCoordinates.forEach((validCoordinates) => {
        locationsMap[validCoordinates.rndColumn][validCoordinates.rndRow] = '1';
    });
}
```

7. Which property of the `shipCoordinates` objects represents the column index in `placeShip`?

---

**`battleship.js`**

```js
function getRandomPosition(maxCols, maxRows) {
    const rndIsHorizontal = Boolean(Math.round(Math.random()));
    const rndColumn = Math.floor(Math.random() * maxCols);
    const rndRow = Math.floor(Math.random() * maxRows);

    return { rndColumn, rndRow, rndIsHorizontal };
}
```

8. What is the value type of `rndIsHorizontal` returned by `getRandomPosition`?

---

**`battleship.js`**

```js
function getValidCoordinates(targetsMap) {
    let coordinates; 
    let isValidChoice = false; 

    const { maxRows, maxCols } = getMaxRowsAndColumns(targetsMap);

    do {
        let errorMessages = [];  

        coordinates = readlineSync.question(chalk.green(`Choose your target (Ex. A1): `));

        try {

            if (!([2, 3].includes(coordinates.length))) {
                errorMessages.push("Coordinates must be only 2 or 3 characters long.");
            }

            // ... other validation checks

        } catch (error) {  
            errorMessages.push(error);
        }

        // ... error handling logic
    } while (!isValidChoice); 

    return coordinates; 
}
```

9. What is the allowed length of `coordinates` in `getValidCoordinates`?

---

**`battleship.js`**

```js
function checkForTargetStrike(launchCoordinates, locationsMap) {

    const { targetRow, targetColumn } = getRowAndColumn(launchCoordinates);

    if (locationsMap[targetRow][targetColumn] === '1') {
        return true; 
    } else {
        return false;  
    }
}
```

10. What does `checkForTargetStrike` return if the target cell contains '1'?

---

**`battleship.js`**

```js
function checkForRepeatedStrike(launchCoordinates, targetsMap) {

    const { targetRow, targetColumn } = getRowAndColumn(launchCoordinates);

    if (targetsMap[targetRow][targetColumn] !== undefined) {
        return true;
    } else {
        return false;
    }
}
```

11. What does `checkForRepeatedStrike` return if the target cell is undefined?

---

**`battleship.js`**

```js
function updateTargetMap(launchCoordinates, targetStrike, targetsMap) {

    const { targetRow, targetColumn } = getRowAndColumn(launchCoordinates);

    if (targetStrike === true) {
        targetsMap[targetRow][targetColumn] = 'X'
    } else {
        targetsMap[targetRow][targetColumn] = 'O'
    }
}
```

12. What character is placed in `targetsMap` when `targetStrike` is true in `updateTargetMap`?

---

**`battleship.js`**

```js
function displayResults(targetStrike, missilesRemaining, hitsToWin, targetsMap, firstDisplay = false) {

    console.clear();

    if (firstDisplay) {

        log(chalk.blue.bold("Let's play Battleship!"));
        log(chalk.green(`You have ${missilesRemaining} missiles to fire to sink all 5 ships`));

    } else {

        if (targetStrike) {
            log(chalk.red.bold('HIT!!!'));
        } else {
            log(chalk.blue.bold('MISS!!!'));
        }
    }

    // ... win/lose logic
}
```

13. What is the default value of `firstDisplay` in `displayResults`?

---

**`battleship.js`**

```js
function displayResults(targetStrike, missilesRemaining, hitsToWin, targetsMap, firstDisplay = false) {

    // ... initial display logic

    if (hitsToWin === 0) {

        log(chalk.grey('YOU WIN! - YOU SANK MY ENTIRE FLEET!'));
    } else if (missilesRemaining < hitsToWin) {

        log(`YOU LOSE - YOU NEED ${hitsToWin} HITS TO WIN BUT ONLY ${missilesRemaining} MISSILES REMAINING`);
        log(chalk.magenta.bold('BETTER LUCK NEXT TIME!'));
    } else {

        // ... remaining game status
    }
}
```

14. When does the "YOU WIN" message display in `displayResults`?

<!-- Lengths: C=4 | D1=5 | D2=5 | D3=5 -->

---

**`battleship.js`**

```js
function drawMap(targetsMap) {

    const { maxRows, maxCols } = getMaxRowsAndColumns(targetsMap);

    process.stdout.write(chalk.white.bold.bgBlack('    '));
    for (let column = 0; column < maxCols; column++) {
        process.stdout.write(chalk.white.bold.bgBlack(`${String.fromCharCode(column + 65)} `));
    }
    process.stdout.write(chalk.white.bold.bgBlack(' \n'));

    // ... row drawing logic
}
```

15. What character is used as the starting letter for column headers in `drawMap`?

---

**`battleship.js`**

```js
function getRowAndColumn(launchCoordinates) {

    let targetRow = Number(launchCoordinates.slice(1, launchCoordinates.length)) - 1;

    let targetColumn = launchCoordinates[0].toUpperCase().charCodeAt(0) - 65;

    return { targetRow, targetColumn };
}
```

16. What is the value of `targetColumn` for launchCoordinates "A1" in `getRowAndColumn`?

---

**`battleship.js`**

```js
function getRowAndColumn(launchCoordinates) {

    let targetRow = Number(launchCoordinates.slice(1, launchCoordinates.length)) - 1;

    let targetColumn = launchCoordinates[0].toUpperCase().charCodeAt(0) - 65;

    return { targetRow, targetColumn };
}
```

17. What is the value of `targetRow` for launchCoordinates "A1" in `getRowAndColumn`?

---

**`battleship.js`**

```js
function getMaxRowsAndColumns(map) {

    let maxRows = map.length;

    let maxCols = map[0].length;

    return { maxRows, maxCols };
}
```

18. What does `maxRows` represent in `getMaxRowsAndColumns`?

<!-- Lengths: C=7 | D1=7 | D2=7 | D3=7 -->

---

**`battleship.js`**

```js
function getFileContents(fileName) {
    let content;  

    try {

        content = fs.readFileSync(fileName, { encoding: 'utf-8' });
    } catch (error) {

        console.error(`An error has occurred loading file '${fileName}'. Please try again later.`);
        process.exit()
    }

    return content; 
}
```

19. What encoding is used to read files in `getFileContents`?

---

**`battleship.js`**

```js
function writeFileContents(fileName, contents) {
    try {

        fs.writeFileSync(fileName, contents, { encoding: 'utf-8', flag: 'w' });
    } catch (error) {

        console.error(`An error has occurred writing file '${fileName}'. Please try again later.`);
        process.exit()
    }
}
```

20. What file writing flag is used in `writeFileContents`?

---

**`battleship.js`**

```js
function placeShip(size, maxRows, maxCols, locationsMap) {
    let isValidPlacement;
    let shipCoordinates;

    do {
        isValidPlacement = true; 

        shipCoordinates = [];
        // ... position generation

        for (let i = 0; i < size; i++) {

            if (rndRow >= maxRows || rndColumn >= maxCols || locationsMap[rndColumn][rndRow] === '1') {

                isValidPlacement = false;
            } else {

                shipCoordinates.push({ rndColumn, rndRow });
            }

            // ... position increment
        }
    } while (!isValidPlacement); 

    // ... placement logic
}
```

21. What causes the do-while loop in `placeShip` to repeat?

<!-- Lengths: C=5 | D1=5 | D2=5 | D3=5 -->

---

**`battleship.js`**

```js
function getLocationsMap() {
    // ... isRandomizedMap check

    if (isRandomizedMap) {

        let ships = [2, 3, 3, 4, 5]; 

        locationsMap = getRandomizedMap(10, 10, ships);

        // ... write file logic
    } else {

        // ... load pre-defined map
    }

    return locationsMap;
}
```

22. What is the total size of all ships in the default randomized map?

---

**`battleship.js`**

```js
function playGame() {
    const totalMissiles = 30; 
    let strikeAttempts = 0; 
    // ... other variables

    do {

        // ... game loop logic

        strikeAttempts += 1; 

        // ... update logic
    } while (hitsToWin !== 0 && missilesRemaining >= hitsToWin);
}
```

23. What is the value of `strikeAttempts` after 5 valid missile launches in `playGame`?

---

**`battleship.js`**

```js
function displayResults(targetStrike, missilesRemaining, hitsToWin, targetsMap, firstDisplay = false) {

    // ... initial display logic

    if (hitsToWin === 0) {

        log(chalk.grey('YOU WIN! - YOU SANK MY ENTIRE FLEET!'));
    } else if (missilesRemaining < hitsToWin) {

        log(`YOU LOSE - YOU NEED ${hitsToWin} HITS TO WIN BUT ONLY ${missilesRemaining} MISSILES REMAINING`);
        log(chalk.magenta.bold('BETTER LUCK NEXT TIME!'));
    } else {

        // ... remaining game status
    }
}
```

24. When does the "YOU LOSE" message display in `displayResults`?

<!-- Lengths: C=7 | D1=7 | D2=7 | D3=7 -->

---

**`battleship.js`**

```js
function drawMap(targetsMap) {

    // ... column header logic

    for (let row = 0; row < maxRows; row++) {

        // ... row number logic

        for (let column = 0; column < maxCols; column++) {
            switch (targetsMap[row][column]) {
                case 'X':
                    // ... display X
                    break;

                case 'O':
                    // ... display O
                    break;

                default:
                    process.stdout.write(chalk.white.bold.bgWhiteBright(`  `));
                    break;
            }
        }

        // ... row end logic
    }

    // ... bottom border logic
}
```

25. What is displayed for unstruck, unmissed cells in `drawMap`?

<!-- Lengths: C=4 | D1=4 | D2=4 | D3=4 -->

---

**`battleship.js`**

```js
function getValidCoordinates(targetsMap) {
    // ... setup logic

    do {
        let errorMessages = [];  

        coordinates = readlineSync.question(chalk.green(`Choose your target (Ex. A1): `));

        try {

            // ... length, first character checks

            if (checkForRepeatedStrike(coordinates, targetsMap)) {

                log(chalk.rgb(255, 136, 0)('You already hit this position. Please Try Again.'));
            }

            // ... other checks
        } catch (error) {  
            errorMessages.push(error);
        }

        // ... error handling
    } while (!isValidChoice); 

    return coordinates; 
}
```

26. What message displays when `checkForRepeatedStrike` returns true in `getValidCoordinates`?

<!-- Lengths: C=7 | D1=7 | D2=8 | D3=7 -->

---

**`battleship.js`**

```js
function initializeMaps(locationsMapFilename) {

    const locationsMap = getLocationsMap(locationsMapFilename);

    const { maxRows, maxCols } = getMaxRowsAndColumns(locationsMap);

    const targetsMap = Array.from({ length: maxRows }).map(() => Array(maxCols).fill(undefined));

    let totalTargets = 0;
    locationsMap.flat().forEach(value => {
        if (value === '1') { return (totalTargets += 1) }
    });

    return { totalTargets, locationsMap, targetsMap };
}
```

27. What does `totalTargets` count in `initializeMaps`?

<!-- Lengths: C=8 | D1=8 | D2=8 | D3=8 -->

---

**`battleship.js`**

```js
function playGame() {
    // ... variable declarations

    const { totalTargets, locationsMap, targetsMap } = initializeMaps();

    // ... initial display

    do {

        // ... game loop logic
    } while (hitsToWin !== 0 && missilesRemaining >= hitsToWin);
}
```

28. What argument is passed to `initializeMaps` in `playGame`?

---

**`battleship.js`**

```js
function getLocationsMap() {
    // ... isRandomizedMap check

    if (isRandomizedMap) {

        let ships = [2, 3, 3, 4, 5]; 

        locationsMap = getRandomizedMap(10, 10, ships);

        writeFileContents('randomizedMap.txt', locationsMap.map(row => row.join(',')).join('\n'));
    } else {

        // ... load pre-defined map
    }

    return locationsMap;
}
```

29. What is the filename passed to `writeFileContents` when using a randomized map?

---

**`battleship.js`**

```js
function placeShip(size, maxRows, maxCols, locationsMap) {
    // ... setup logic

    do {
        // ... reset logic

        let { rndColumn, rndRow, rndIsHorizontal } = getRandomPosition(maxCols, maxRows);

        // ... placement loop
    } while (!isValidPlacement); 

    // ... final placement logic
}
```

30. What arguments are passed to `getRandomPosition` in `placeShip`?

<!-- Lengths: C=4 | D1=4 | D2=4 | D3=4 -->

---

**`battleship.js`**

```js
function checkForTargetStrike(launchCoordinates, locationsMap) {

    const { targetRow, targetColumn } = getRowAndColumn(launchCoordinates);

    if (locationsMap[targetRow][targetColumn] === '1') {
        return true; 
    } else {
        return false;  
    }
}
```

31. What is the order of indices when accessing `locationsMap` in `checkForTargetStrike`?

<!-- Lengths: C=5 | D1=5 | D2=5 | D3=5 -->

---

**`battleship.js`**

```js
function updateTargetMap(launchCoordinates, targetStrike, targetsMap) {

    const { targetRow, targetColumn } = getRowAndColumn(launchCoordinates);

    if (targetStrike === true) {
        targetsMap[targetRow][targetColumn] = 'X'
    } else {
        targetsMap[targetRow][targetColumn] = 'O'
    }
}
```

32. What character is placed in `targetsMap` when `targetStrike` is false in `updateTargetMap`?

---

**`battleship.js`**

```js
function displayResults(targetStrike, missilesRemaining, hitsToWin, targetsMap, firstDisplay = false) {

    // ... initial display logic

    if (targetStrike) {
        log(chalk.red.bold('HIT!!!'));
    } else {
        log(chalk.blue.bold('MISS!!!'));
    }

    // ... map drawing and win/lose logic
}
```

33. What color is the "HIT!!!" message in `displayResults`?

---

**`battleship.js`**

```js
function displayResults(targetStrike, missilesRemaining, hitsToWin, targetsMap, firstDisplay = false) {

    // ... initial display logic

    if (targetStrike) {
        log(chalk.red.bold('HIT!!!'));
    } else {
        log(chalk.blue.bold('MISS!!!'));
    }

    // ... map drawing and win/lose logic
}
```

34. What color is the "MISS!!!" message in `displayResults`?

---

**`battleship.js`**

```js
function drawMap(targetsMap) {

    // ... column header logic

    for (let row = 0; row < maxRows; row++) {

        process.stdout.write(chalk.white.bold.bgBlack(`${(row + 1).toString().padStart(2, ' ')} `));
        // ... cell drawing logic
    }

    // ... bottom border logic
}
```

35. What padding is applied to row numbers in `drawMap`?

<!-- Lengths: C=6 | D1=6 | D2=6 | D3=6 -->

---

**`battleship.js`**

```js
function getValidCoordinates(targetsMap) {
    // ... setup logic

    do {
        let errorMessages = [];  

        coordinates = readlineSync.question(chalk.green(`Choose your target (Ex. A1): `));

        try {

            if (!(/[a-z]/i.test(coordinates[0]))) {
                errorMessages.push("The first character must be a letter.");
            }

            // ... other checks
        } catch (error) {  
            errorMessages.push(error);
        }

        // ... error handling
    } while (!isValidChoice); 

    return coordinates; 
}
```

36. What is the error message when the first character of `coordinates` is not a letter?

<!-- Lengths: C=7 | D1=7 | D2=7 | D3=7 -->

---

**`battleship.js`**

```js
function getValidCoordinates(targetsMap) {
    // ... setup logic

    do {
        let errorMessages = [];  

        coordinates = readlineSync.question(chalk.green(`Choose your target (Ex. A1): `));

        try {

            if (coordinates[1] === '0') {
                errorMessages.push("The number component cannot begin with a '0'.");
            }

            // ... other checks
        } catch (error) {  
            errorMessages.push(error);
        }

        // ... error handling
    } while (!isValidChoice); 

    return coordinates; 
}
```

37. What is the error message when the second character of `coordinates` is '0'?

<!-- Lengths: C=8 | D1=8 | D2=8 | D3=8 -->

---

**`battleship.js`**

```js
function playGame() {
    const totalMissiles = 30; 
    let strikeAttempts = 0; 
    let totalStrikes = 0; 
    // ... other variables

    const { totalTargets, locationsMap, targetsMap } = initializeMaps();

    // ... initial display

    do {

        // ... game loop logic

        hitsToWin = totalTargets - totalStrikes;

        // ... update display
    } while (hitsToWin !== 0 && missilesRemaining >= hitsToWin);
}
```

38. What is the initial value of `hitsToWin` in `playGame`?

---

**`battleship.js`**

```js
function getRandomPosition(maxCols, maxRows) {
    const rndIsHorizontal = Boolean(Math.round(Math.random()));
    const rndColumn = Math.floor(Math.random() * maxCols);
    const rndRow = Math.floor(Math.random() * maxRows);

    return { rndColumn, rndRow, rndIsHorizontal };
}
```

39. What is the approximate probability of `rndIsHorizontal` being true in `getRandomPosition`?

---

**`battleship.js`**

```js
function getFileContents(fileName) {
    let content;  

    try {

        content = fs.readFileSync(fileName, { encoding: 'utf-8' });
    } catch (error) {

        console.error(`An error has occurred loading file '${fileName}'. Please try again later.`);
        process.exit()
    }

    return content; 
}
```

40. What happens if `getFileContents` fails to read a file?

<!-- Lengths: C=5 | D1=5 | D2=5 | D3=5 -->

---

**`battleship.js`**

```js
function writeFileContents(fileName, contents) {
    try {

        fs.writeFileSync(fileName, contents, { encoding: 'utf-8', flag: 'w' });
    } catch (error) {

        console.error(`An error has occurred writing file '${fileName}'. Please try again later.`);
        process.exit()
    }
}
```

41. What happens if `writeFileContents` fails to write a file?

<!-- Lengths: C=5 | D1=5 | D2=5 | D3=5 -->

---

**`battleship.js`**

```js
function playGame() {
    // ... variable declarations

    displayResults(false, totalMissiles, totalTargets, targetsMap, firstDisplay = true);

    do {

        // ... game loop logic
    } while (hitsToWin !== 0 && missilesRemaining >= hitsToWin);
}
```

42. What is the value of `targetStrike` passed to the first `displayResults` call in `playGame`?

---

**`battleship.js`**

```js
function drawMap(targetsMap) {

    // ... column header logic
    for (let column = 0; column < maxCols; column++) {
        process.stdout.write(chalk.white.bold.bgBlack(`${String.fromCharCode(column + 65)} `));
    }
    // ... row drawing logic
}
```

43. What is the character code offset used to generate column letters in `drawMap`?

---

**`battleship.js`**

```js
function getRowAndColumn(launchCoordinates) {

    let targetRow = Number(launchCoordinates.slice(1, launchCoordinates.length)) - 1;

    let targetColumn = launchCoordinates[0].toUpperCase().charCodeAt(0) - 65;

    return { targetRow, targetColumn };
}
```

44. What is the `targetColumn` value for launchCoordinates "B1"?

---

**`battleship.js`**

```js
function placeShip(size, maxRows, maxCols, locationsMap) {
    // ... setup logic

    do {
        // ... reset logic

        shipCoordinates = [];

        // ... position generation

        for (let i = 0; i < size; i++) {

            // ... validity check

            } else {

                shipCoordinates.push({ rndColumn, rndRow });
            }

            // ... position increment
        }
    } while (!isValidPlacement); 

    // ... final placement logic
}
```

45. What is the name of the column property in `shipCoordinates` objects?

---

**`battleship.js`**

```js
import fs from 'fs';
import readlineSync from 'readline-sync';
import chalk from 'chalk';

const log = console.log;

do {

    console.clear();
    playGame();
} while (readlineSync.keyInYN('Play again?'));
```

46. What prompt is shown to the player after a game ends?

---

**`battleship.js`**

```js
import fs from 'fs';
import readlineSync from 'readline-sync';
import chalk from 'chalk';

const log = console.log;

// ... main game loop
```

47. What is the purpose of the `log` constant?

<!-- Lengths: C=5 | D1=5 | D2=5 | D3=5 -->

---

**`battleship.js`**

```js
function getValidCoordinates(targetsMap) {
    // ... setup logic

    do {
        let errorMessages = [];  

        coordinates = readlineSync.question(chalk.green(`Choose your target (Ex. A1): `));

        // ... validation logic
    } while (!isValidChoice); 

    return coordinates; 
}
```

48. What is the example target format shown to the player in `getValidCoordinates`?

---

**`battleship.js`**

```js
function initializeMaps(locationsMapFilename) {

    const locationsMap = getLocationsMap(locationsMapFilename);

    const { maxRows, maxCols } = getMaxRowsAndColumns(locationsMap);

    const targetsMap = Array.from({ length: maxRows }).map(() => Array(maxCols).fill(undefined));

    let totalTargets = 0;
    // ... count targets

    return { totalTargets, locationsMap, targetsMap };
}
```

49. Which of these is NOT returned by `initializeMaps`?

---

**`battleship.js`**

```js
function placeShip(size, maxRows, maxCols, locationsMap) {
    // ... setup logic

    do {
        // ... reset logic

        let { rndColumn, rndRow, rndIsHorizontal } = getRandomPosition(maxCols, maxRows);

        for (let i = 0; i < size; i++) {

            // ... validity check

            if (rndIsHorizontal) {
                rndColumn += 1; 
            } else {
                rndRow += 1; 
            }
        }
    } while (!isValidPlacement); 

    // ... final placement logic
}
```

50. What increments when `rndIsHorizontal` is true in `placeShip`'s ship placement loop?

---

---

<sub>Generated by <b>GrillMyCode</b> · tencent/hy3-preview via openrouter · main</sub>