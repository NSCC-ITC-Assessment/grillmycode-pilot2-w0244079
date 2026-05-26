## Grill My Code

> **Generated:** 2026-05-26 03:39:54 UTC


> **Commits reviewed:** `6c9bd79` → `852fb28`

> **Code Files Assessed:** `battleship.js`


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

1. When `locationsMap[targetRow][targetColumn]` equals `'1'`, what does `checkForTargetStrike` return?

<!-- Lengths: C=1 | D1=1 | D2=1 | D3=1 -->

---

**`battleship.js`**

```js
function getRowAndColumn(launchCoordinates) {

    let targetRow = Number(launchCoordinates.slice(1, launchCoordinates.length)) - 1;

    let targetColumn = launchCoordinates[0].toUpperCase().charCodeAt(0) - 65;

    return { targetRow, targetColumn };
}
```

2. What are the two properties returned by `getRowAndColumn` when it parses `launchCoordinates`?

<!-- Lengths: C=3 | D1=3 | D2=3 | D3=2 -->

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

3. What boolean value does `checkForRepeatedStrike` return when a cell already contains `'X'` or `'O'`?

<!-- Lengths: C=1 | D1=1 | D2=1 | D3=1 -->

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

            if (!(/[a-z]/i.test(coordinates[0]))) {
                errorMessages.push("The first character must be a letter.");
            }

            if (!(coordinates[0].toUpperCase().charCodeAt(0) - 64 > 0)) {
                errorMessages.push("The letter component must at least start with an 'A' or 'a'.");
            }

            if (!(coordinates[0].toUpperCase().charCodeAt(0) - 64 <= maxCols)) {
                errorMessages.push("The letter component must not be greater than the number of columns.");
            }

            if (coordinates[1] === '0') {
                errorMessages.push("The number component cannot begin with a '0'.");
            }

            if (!(/^[0-9]{1,2}$/.test(coordinates.slice(1, coordinates.length)))) {
                errorMessages.push("The number component must be only 1 or 2 digits.");
            }

            if (!(Number(coordinates.slice(1, coordinates.length)) > 0)) {
                errorMessages.push("The number component must be greater than 0.");
            }

            if (!(Number(coordinates.slice(1, coordinates.length)) <= maxRows)) {
                errorMessages.push("The number component cannot be greater than the number of rows.");
            }
        } catch (error) {  
            errorMessages.push(error);
        }
```

4. Which property of `coordinates` does the code ensure is greater than `0` before accepting the input?

<!-- Lengths: C=4 | D1=6 | D2=5 | D3=3 -->

---

**`battleship.js`**

```js
        if (errorMessages.length > 0) {

            log(chalk.rgb(255, 136, 0)(errorMessages.join('\n')));

            log(chalk.rgb(255, 136, 0)('Please Try Again.'));
        } else if (checkForRepeatedStrike(coordinates, targetsMap)) {

            log(chalk.rgb(255, 136, 0)('You already hit this position. Please Try Again.'));
        } else {

            isValidChoice = true;
        }
    } while (!isValidChoice); 

    return coordinates; 
}
```

5. What message will be displayed if the user attempts to target a cell that was hit previously?

<!-- Lengths: C=28 | D1=21 | D2=30 | D3=18 -->

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

6. After a player misses, what single character is assigned to `targetsMap[targetRow][targetColumn]`?

<!-- Lengths: C=1 | D1=1 | D2=1 | D3=1 -->

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

    drawMap(targetsMap);

    if (hitsToWin === 0) {

        log(chalk.grey('YOU WIN! - YOU SANK MY ENTIRE FLEET!'));
    } else if (missilesRemaining < hitsToWin) {

        log(`YOU LOSE - YOU NEED ${hitsToWin} HITS TO WIN BUT ONLY ${missilesRemaining} MISSILES REMAINING`);
        log(chalk.magenta.bold('BETTER LUCK NEXT TIME!'));
    } else {

        log('You have ' + chalk.rgb(150, 75, 0).bold(missilesRemaining) + ' missiles remaining!');
        log('You need ' + chalk.rgb(150, 75, 0).bold(hitsToWin) + ' more hits to win!');
    }
}
```

7. What text does `displayResults` log when `firstDisplay` is true before drawing the map?

<!-- Lengths: C=28 | D1=3 | D2=3 | D3=5 -->

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
```

8. How does the first row of the display map label its columns?

<!-- Lengths: C=31 | D1=21 | D2=17 | D3=33 -->

---

**`battleship.js`**

```js
    for (let row = 0; row < maxRows; row++) {

        process.stdout.write(chalk.white.bold.bgBlack(`${(row + 1).toString().padStart(2, ' ')} `));
        process.stdout.write(chalk.white.bold.bgWhiteBright(' '));

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

        process.stdout.write(chalk.white.bold.bgBlack(' \n'));
    }
```

9. Which characters are printed in red when the map encounters a hit while rendering?

<!-- Lengths: C=1 | D1=1 | D2=1 | D3=1 -->

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

10. What value does `targetsMap[row][column]` hold immediately after `initializeMaps` creates it?

<!-- Lengths: C=1 | D1=1 | D2=1 | D3=1 -->

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

11. Why is `writeFileContents` invoked when `isRandomizedMap` is true?

<!-- Lengths: C=31 | D1=24 | D2=18 | D3=29 -->

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

12. What initial value fills each cell of `locationsMap` before ships are placed?

<!-- Lengths: C=1 | D1=1 | D2=1 | D3=1 -->

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
```

13. Which array method does `placeShip` use to store validated coordinates before marking the map?

<!-- Lengths: C=10 | D1=6 | D2=6 | D3=16 -->

---

**`battleship.js`**

```js
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

14. What condition causes `rndColumn` to increment inside the placement loop?

<!-- Lengths: C=6 | D1=6 | D2=9 | D3=10 -->

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

15. What type of value does `rndIsHorizontal` hold after it is computed?

<!-- Lengths: C=1 | D1=1 | D2=1 | D3=1 -->

---

**`battleship.js`**

```js
function getMaxRowsAndColumns(map) {

    let maxRows = map.length;

    let maxCols = map[0].length;

    return { maxRows, maxCols };
}
```

16. How does `getMaxRowsAndColumns` determine `maxCols`?

<!-- Lengths: C=15 | D1=17 | D2=4 | D3=7 -->

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

17. What function reads the contents of a file synchronously in this codebase?

<!-- Lengths: C=8 | D1=8 | D2=1 | D3=1 -->

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

18. What flag does `writeFileContents` pass to `fs.writeFileSync` when saving the file?

<!-- Lengths: C=1 | D1=1 | D2=1 | D3=1 -->

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
```

19. Which object destructuring captures `targetsMap` within `playGame`?

<!-- Lengths: C=21 | D1=16 | D2=19 | D3=22 -->

---

**`battleship.js`**

```js
    do {

        let launchCoordinates = getValidCoordinates(targetsMap);

        let targetStrike = checkForTargetStrike(launchCoordinates, locationsMap);

        strikeAttempts += 1; 

        updateTargetMap(launchCoordinates, targetStrike, targetsMap);
```

20. Which function increments `strikeAttempts` each iteration?

<!-- Lengths: C=33 | D1=2 | D2=2 | D3=2 -->

---

**`battleship.js`**

```js
        if (targetStrike) {
            totalStrikes += 1;  
        }

        missilesRemaining = totalMissiles - strikeAttempts;

        hitsToWin = totalTargets - totalStrikes;
```

21. Which arithmetic expression determines how many hits are still needed to win?

<!-- Lengths: C=8 | D1=8 | D2=8 | D3=8 -->

---

**`battleship.js`**

```js
        displayResults(targetStrike, missilesRemaining, hitsToWin, targetsMap);
```

22. What arguments are provided to `displayResults` after each strike?

<!-- Lengths: C=23 | D1=24 | D2=27 | D3=27 -->

---

**`battleship.js`**

```js
} while (hitsToWin !== 0 && missilesRemaining >= hitsToWin);
```

23. Under what condition does the loop inside `playGame` continue for another iteration?

<!-- Lengths: C=33 | D1=5 | D2=4 | D3=5 -->

---

**`battleship.js`**

```js
        log(chalk.blue.bold("Let's play Battleship!"));
        log(chalk.green(`You have ${missilesRemaining} missiles to fire to sink all 5 ships`));
```

24. What color styling is applied to the welcome message text?

<!-- Lengths: C=10 | D1=7 | D2=8 | D3=8 -->

---

**`battleship.js`**

```js
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
```

25. What background color does a miss (`O`) use when drawn on the map?

<!-- Lengths: C=1 | D1=2 | D2=2 | D3=2 -->

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

    drawMap(targetsMap);
```

26. Which function is responsible for clearing the console before showing the updated status?

<!-- Lengths: C=2 | D1=1 | D2=1 | D3=1 -->

---

**`battleship.js`**

```js
    if (hitsToWin === 0) {

        log(chalk.grey('YOU WIN! - YOU SANK MY ENTIRE FLEET!'));
    } else if (missilesRemaining < hitsToWin) {

        log(`YOU LOSE - YOU NEED ${hitsToWin} HITS TO WIN BUT ONLY ${missilesRemaining} MISSILES REMAINING`);
        log(chalk.magenta.bold('BETTER LUCK NEXT TIME!'));
    } else {
```

27. What happens when `missilesRemaining` becomes less than `hitsToWin`?

<!-- Lengths: C=40 | D1=16 | D2=10 | D3=10 -->

---

**`battleship.js`**

```js
    if (hitsToWin === 0) {

        log(chalk.grey('YOU WIN! - YOU SANK MY ENTIRE FLEET!'));
    } else if (missilesRemaining < hitsToWin) {

        ...
    } else {

        log('You have ' + chalk.rgb(150, 75, 0).bold(missilesRemaining) + ' missiles remaining!');
        log('You need ' + chalk.rgb(150, 75, 0).bold(hitsToWin) + ' more hits to win!');
    }
}
```

28. What color styling is used for the remaining missiles and hits summary?

<!-- Lengths: C=14 | D1=10 | D2=10 | D3=9 -->

---

**`battleship.js`**

```js
function getValidCoordinates(targetsMap) {
    let coordinates; 
    let isValidChoice = false; 

    const { maxRows, maxCols } = getMaxRowsAndColumns(targetsMap);
```

29. Which helper function does `getValidCoordinates` call first to know the grid bounds?

<!-- Lengths: C=6 | D1=3 | D2=3 | D3=3 -->

---

**`battleship.js`**

```js
            if (!(Number(coordinates.slice(1, coordinates.length)) <= maxRows)) {
                errorMessages.push("The number component cannot be greater than the number of rows.");
            }
```

30. What does the code compare to `maxRows` before accepting a coordinate?

<!-- Lengths: C=29 | D1=5 | D2=2 | D3=2 -->

---

**`battleship.js`**

```js
    log(chalk.rgb(255, 136, 0)(errorMessages.join('\n')));

    log(chalk.rgb(255, 136, 0)('Please Try Again.'));
```

31. What color is used for the error output when coordinates validation fails?

<!-- Lengths: C=4 | D1=3 | D2=3 | D3=3 -->

---

**`battleship.js`**

```js
    if (errorMessages.length > 0) {

        ...
    } else if (checkForRepeatedStrike(coordinates, targetsMap)) {

        ...
    } else {

        isValidChoice = true;
    }
} while (!isValidChoice); 
```

32. When does `getValidCoordinates` break out of the loop?

<!-- Lengths: C=32 | D1=9 | D2=7 | D3=10 -->

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

33. Which array is iterated over to place each ship on the randomized map?

<!-- Lengths: C=25 | D1=15 | D2=2 | D3=1 -->

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
        ...
    } while (!isValidPlacement); 
```

34. What causes the `do...while` loop inside `placeShip` to repeat?

<!-- Lengths: C=34 | D1=12 | D2=9 | D3=7 -->

---

**`battleship.js`**

```js
        if (rndRow >= maxRows || rndColumn >= maxCols || locationsMap[rndColumn][rndRow] === '1') {

            isValidPlacement = false;
        } else {

            shipCoordinates.push({ rndColumn, rndRow });
        }
```

35. Which coordinate check prevents ships from overlapping?

<!-- Lengths: C=33 | D1=13 | D2=6 | D3=11 -->

---

**`battleship.js`**

```js
    shipCoordinates.forEach((validCoordinates) => {
        locationsMap[validCoordinates.rndColumn][validCoordinates.rndRow] = '1';
    });
```

36. What value is written into the map for each element in `shipCoordinates`?

<!-- Lengths: C=1 | D1=1 | D2=1 | D3=1 -->

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

37. Which random generation method ensures the row index falls within `maxRows`?

<!-- Lengths: C=20 | D1=5 | D2=6 | D3=8 -->

---

**`battleship.js`**

```js
function getMaxRowsAndColumns(map) {

    let maxRows = map.length;

    let maxCols = map[0].length;

    return { maxRows, maxCols };
}
```

38. What assumptions does `getMaxRowsAndColumns` rely on about the incoming `map`?

<!-- Lengths: C=33 | D1=19 | D2=8 | D3=6 -->

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

39. What does `getFileContents` do if `fs.readFileSync` throws an error?

<!-- Lengths: C=20 | D1=3 | D2=5 | D3=4 -->

---

**`battleship.js`**

```js
function getLocationsMap() {
    ...
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

40. When the player chooses not to randomize, how is the predefined map parsed?

<!-- Lengths: C=44 | D1=19 | D2=24 | D3=16 -->

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

41. How many rows and columns does the randomized map use in this implementation?

<!-- Lengths: C=33 | D1=10 | D2=6 | D3=10 -->

---

**`battleship.js`**

```js
function playGame() {
    const totalMissiles = 30; 
    ...
    const { totalTargets, locationsMap, targetsMap } = initializeMaps();

    displayResults(false, totalMissiles, totalTargets, targetsMap, firstDisplay = true);
```

42. What initial value is passed as `targetStrike` in the opening `displayResults` call?

<!-- Lengths: C=1 | D1=1 | D2=1 | D3=1 -->

---

**`battleship.js`**

```js
    do {

        let launchCoordinates = getValidCoordinates(targetsMap);

        let targetStrike = checkForTargetStrike(launchCoordinates, locationsMap);
```

43. Which function supplies the user’s chosen coordinates to the main loop?

<!-- Lengths: C=5 | D1=2 | D2=1 | D3=2 -->

---

**`battleship.js`**

```js
        updateTargetMap(launchCoordinates, targetStrike, targetsMap);

        if (targetStrike) {
            totalStrikes += 1;  
        }

        missilesRemaining = totalMissiles - strikeAttempts;

        hitsToWin = totalTargets - totalStrikes;
```

44. What effect does a successful strike (`targetStrike` true) have on `totalStrikes`?

<!-- Lengths: C=16 | D1=12 | D2=12 | D3=24 -->

---

**`battleship.js`**

```js
        missilesRemaining = totalMissiles - strikeAttempts;

        hitsToWin = totalTargets - totalStrikes;

        displayResults(targetStrike, missilesRemaining, hitsToWin, targetsMap);

    } while (hitsToWin !== 0 && missilesRemaining >= hitsToWin);
}
```

45. Which pair of values determine whether the loop continues or stops?

<!-- Lengths: C=8 | D1=5 | D2=5 | D3=4 -->

---

**`battleship.js`**

```js
function getLocationsMap() {
    ...
    let isRandomizedMap = readlineSync.keyInYNStrict('Do you want to use a randomized map instead of the pre-defined one?');
```

46. What user prompt determines whether a randomized map is used?

<!-- Lengths: C=25 | D1=6 | D2=2 | D3=10 -->

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
```

47. Which variables are declared using `let` to track runtime game progress?

<!-- Lengths: C=34 | D1=2 | D2=4 | D3=1 -->

---

**`battleship.js`**

```js
    const { totalTargets, locationsMap, targetsMap } = initializeMaps();

    displayResults(false, totalMissiles, totalTargets, targetsMap, firstDisplay = true);
```

48. Which variable indicates how many targets need to be hit to win after initialization?

<!-- Lengths: C=1 | D1=1 | D2=1 | D3=1 -->

---

**`battleship.js`**

```js
function placeShip(size, maxRows, maxCols, locationsMap) {
    ...
    shipCoordinates.forEach((validCoordinates) => {
        locationsMap[validCoordinates.rndColumn][validCoordinates.rndRow] = '1';
    });
}
```

49. What single character marks a ship cell on `locationsMap` after ships are placed?

<!-- Lengths: C=1 | D1=1 | D2=1 | D3=1 -->

---

**`battleship.js`**

```js
function playGame() {
    ...
    do {

        let launchCoordinates = getValidCoordinates(targetsMap);

        let targetStrike = checkForTargetStrike(launchCoordinates, locationsMap);

        strikeAttempts += 1; 

        updateTargetMap(launchCoordinates, targetStrike, targetsMap);
```

50. After validating the user input, which functions does the loop call to determine and record the strike outcome?

<!-- Lengths: C=25 | D1=14 | D2=15 | D3=25 -->

---

<sub>Generated by <b>GrillMyCode</b> · openai/gpt-5.1-codex-mini via openrouter · main</sub>