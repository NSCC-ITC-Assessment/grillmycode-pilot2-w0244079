## Grill My Code

> **Generated:** 2026-05-26 03:47:26 UTC


> **Commits reviewed:** `6c9bd79` → `8f84417`

> **Code Files Assessed:** `battleship.js`


---

**`battleship.js`**

```javascript
do {
    console.clear();
    playGame();
} while (readlineSync.keyInYN('Play again?'));
```

1. What causes this loop to execute another `playGame()` session?

**Answer:**
- The loop repeats whenever `readlineSync.keyInYN('Play again?')` returns true after the player selects Yes.

**Incorrect Options for Quiz:**
- The loop repeats when `readlineSync.keyInYN('Play again?')` returns false even on No response.
- The loop repeats because `console.clear()` resets the terminal before every `playGame()` call.
- The loop repeats only when `log` retains state between iterations externally.
<!-- Lengths: C=13 | D1=12 | D2=12 | D3=12 -->

---

**`battleship.js`**

```javascript
function playGame() {
    const totalMissiles = 30; 
    let strikeAttempts = 0; 
    let totalStrikes = 0; 
    let firstDisplay; 
    let missilesRemaining; 
    let hitsToWin; 

    const { totalTargets, locationsMap, targetsMap } = initializeMaps();

    displayResults(false, totalMissiles, totalTargets, targetsMap, firstDisplay = true);

    // ...
    do {
        // ...
        hitsToWin = totalTargets - totalStrikes;

        displayResults(targetStrike, missilesRemaining, hitsToWin, targetsMap);

    } while (hitsToWin !== 0 && missilesRemaining >= hitsToWin);
}
```

2. Why does this `playGame` function declare `hitsToWin` before entering the loop?

**Answer:**
- Because the do-while condition uses `hitsToWin` to decide when to stop, so declaring it before the loop ensures it is in scope for that condition.

**Incorrect Options for Quiz:**
- Because `hitsToWin` is only set once before the loop and never changes, so it needs top-level scope throughout gameplay execution.
- Because `hitsToWin` is referenced by helper functions outside the loop, so it must exist globally throughout the round execution.
- Because `hitsToWin` tracks missile count for display, so it sits near other display variables throughout rendering logic right now.
<!-- Lengths: C=24 | D1=20 | D2=19 | D3=19 -->

---

**`battleship.js`**

```javascript
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

3. Why does the first call to `displayResults` pass `firstDisplay = true`?

**Answer:**
- To trigger the `firstDisplay` branch so the introductory text and missile count appear before any strikes.

**Incorrect Options for Quiz:**
- To ensure the map drawing omits hit indicators until the player takes a shot.
- To skip the `else` branch and avoid printing MISS/HIT messages on the initial screen.
- Because `firstDisplay` toggles file writing, so true saves the initial view state permanently.
<!-- Lengths: C=16 | D1=14 | D2=14 | D3=13 -->

---

**`battleship.js`**

```javascript
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

4. How does `initializeMaps` count the total number of target cells?

**Answer:**
- It flattens `locationsMap` and increments `totalTargets` for each `'1'` entry.

**Incorrect Options for Quiz:**
- It increments `totalTargets` by `maxCols` when a row is fully `'1'`.
- It counts `'0'` entries and subtracts from total cells to derive targets.
- It randomly generates targets on demand rather than counting map entries.
<!-- Lengths: C=10 | D1=11 | D2=12 | D3=11 -->

---

**`battleship.js`**

```javascript
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

5. What does `getLocationsMap` do differently when `isRandomizedMap` is true?

**Answer:**
- It calls `getRandomizedMap`, writes the result to `randomizedMap.txt`, and uses that map.

**Incorrect Options for Quiz:**
- It loads the pre-defined map from `map.txt` but caches it for reuse.
- It asks the user for ship sizes before generating a deterministic layout.
- It skips map creation entirely and returns an empty `locationsMap`.
<!-- Lengths: C=12 | D1=12 | D2=12 | D3=10 -->

---

**`battleship.js`**

```javascript
function getRandomizedMap(maxRows, maxCols, ships) {

    const locationsMap = Array.from({ length: maxRows }).map(() => new Array(maxCols).fill('0'));

    ships.forEach((size) => {

        placeShip(size, maxRows, maxCols, locationsMap);
    });

    return locationsMap; 
}
```

6. How does `getRandomizedMap` initialize `locationsMap` before placing ships?

**Answer:**
- It creates a 2D array of size `maxRows`×`maxCols` filled with `'0'` strings.

**Incorrect Options for Quiz:**
- It clones the existing map from disk and resets every cell to `'1'`.
- It builds a jagged array with `maxRows` rows of varying lengths.
- It doubles `maxRows` before creating the map to add buffer rows.
<!-- Lengths: C=12 | D1=13 | D2=11 | D3=11 -->

---

**`battleship.js`**

```javascript
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

7. What condition causes `placeShip` to retry generating coordinates inside the do-while loop?

**Answer:**
- Whenever a coordinate exceeds the grid bounds or hits an existing `'1'`, `isValidPlacement` becomes false, so the loop repeats.

**Incorrect Options for Quiz:**
- If the random position generator returns vertical orientation, the loop restarts to enforce horizontal placement only.
- When `shipCoordinates` already contains enough points, the loop keeps trying to expand unnecessarily thereby.
- It retries whenever the clock-based seed changes between iterations randomly again.
<!-- Lengths: C=19 | D1=16 | D2=15 | D3=15 -->

---

**`battleship.js`**

```javascript
function getRandomPosition(maxCols, maxRows) {
    const rndIsHorizontal = Boolean(Math.round(Math.random()));
    const rndColumn = Math.floor(Math.random() * maxCols);
    const rndRow = Math.floor(Math.random() * maxRows);

    return { rndColumn, rndRow, rndIsHorizontal };
}
```

8. What values does `getRandomPosition` return for ship placement?

**Answer:**
- It returns random column and row indices plus a boolean `rndIsHorizontal` indicating orientation.

**Incorrect Options for Quiz:**
- It returns deterministic center coordinates with `rndIsHorizontal` always false bypassing randomness.
- It returns random row and column but omits any orientation flag.
- It returns a callback that later supplies `rndIsHorizontal` and values again.
<!-- Lengths: C=13 | D1=11 | D2=11 | D3=11 -->

---

**`battleship.js`**

```javascript
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

9. Why does `getValidCoordinates` push multiple strings into `errorMessages` before printing them?

**Answer:**
- To collect all validation failures and display them at once before asking again.

**Incorrect Options for Quiz:**
- To log a separate warning for each repeated coordinate so players know history.
- To ensure only the first error is preserved while later ones are ignored.
- To limit the number of validation attempts per turn to three.
<!-- Lengths: C=13 | D1=13 | D2=13 | D3=11 -->

---

**`battleship.js`**

```javascript
            if (coordinates[1] === '0') {
                errorMessages.push("The number component cannot begin with a '0'.");
            }
```

10. What validation is enforced by checking `coordinates[1] === '0'`?

**Answer:**
- It makes the number component invalid when it starts with zero so entries like `A01` get rejected.

**Incorrect Options for Quiz:**
- It makes the coordinate always two characters long because zeros mark padding.
- It prevents columns from being labeled '0' by rejecting zeros in position one.
- It ensures uppercase letters remain while lowercase ones are promoted consistently today.
<!-- Lengths: C=33 | D1=12 | D2=13 | D3=12 -->

---

**`battleship.js`**

```javascript
        } else if (checkForRepeatedStrike(coordinates, targetsMap)) {

            log(chalk.rgb(255, 136, 0)('You already hit this position. Please Try Again.'));
        } else {

            isValidChoice = true;
        }
```

11. When does `getValidCoordinates` set `isValidChoice` to true?

**Answer:**
- Only when no validation errors exist and `checkForRepeatedStrike` returns false for the coordinates.

**Incorrect Options for Quiz:**
- Only after `errorMessages` logs at least one entry and the map clears.
- While `checkForRepeatedStrike` is true, `isValidChoice` flips randomly per loop iteration still.
- Whenever `targetsMap` contains undefined entries so the player sees blanks now.
<!-- Lengths: C=13 | D1=12 | D2=11 | D3=11 -->

---

**`battleship.js`**

```javascript
function checkForTargetStrike(launchCoordinates, locationsMap) {

    const { targetRow, targetColumn } = getRowAndColumn(launchCoordinates);

    if (locationsMap[targetRow][targetColumn] === '1') {
        return true; 
    } else {
        return false;  
    }
}
```

12. What does `checkForTargetStrike` return when the targeted cell contains `'1'`?

**Answer:**
- true

**Incorrect Options for Quiz:**
- false
- undefined
- 0
<!-- Lengths: C=1 | D1=1 | D2=1 | D3=1 -->

---

**`battleship.js`**

```javascript
function checkForRepeatedStrike(launchCoordinates, targetsMap) {

    const { targetRow, targetColumn } = getRowAndColumn(launchCoordinates);

    if (targetsMap[targetRow][targetColumn] !== undefined) {
        return true;
    } else {
        return false;
    }
}
```

13. What does `checkForRepeatedStrike` return when the target cell already contains a marker?

**Answer:**
- true

**Incorrect Options for Quiz:**
- false
- undefined
- 0
<!-- Lengths: C=1 | D1=1 | D2=1 | D3=1 -->

---

**`battleship.js`**

```javascript
function updateTargetMap(launchCoordinates, targetStrike, targetsMap) {

    const { targetRow, targetColumn } = getRowAndColumn(launchCoordinates);

    if (targetStrike === true) {
        targetsMap[targetRow][targetColumn] = 'X'
    } else {
        targetsMap[targetRow][targetColumn] = 'O'
    }
}
```

14. What character does `updateTargetMap` store when `targetStrike` is false?

**Answer:**
- 'O'

**Incorrect Options for Quiz:**
- 'X'
- '?'
- 'U'
<!-- Lengths: C=1 | D1=1 | D2=1 | D3=1 -->

---

**`battleship.js`**

```javascript
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
```

15. When `targetStrike` is false and `firstDisplay` is false, what message does `displayResults` log?

**Answer:**
- It logs `MISS!!!` through `chalk.blue.bold`.

**Incorrect Options for Quiz:**
- It logs `HIT!!!` through `chalk.red.bold`.
- It logs `MISS!!!` via `chalk.green.bold`.
- It logs the map header again.
<!-- Lengths: C=5 | D1=5 | D2=5 | D3=6 -->

---

**`battleship.js`**

```javascript
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

16. Under what circumstance does `displayResults` print the “YOU LOSE” message?

**Answer:**
- When `missilesRemaining < hitsToWin` so not enough missiles left.

**Incorrect Options for Quiz:**
- When `hitsToWin === 0` and it should declare a win.
- When `missilesRemaining` exceeds `hitsToWin` causing extra missiles notice.
- When `targetsMap` still has undefined cells left on the map now.
<!-- Lengths: C=9 | D1=10 | D2=8 | D3=10 -->

---

**`battleship.js`**

```javascript
function drawMap(targetsMap) {

    const { maxRows, maxCols } = getMaxRowsAndColumns(targetsMap);

    process.stdout.write(chalk.white.bold.bgBlack('    '));
    for (let column = 0; column < maxCols; column++) {
        process.stdout.write(chalk.white.bold.bgBlack(`${String.fromCharCode(column + 65)} `));
    }
    process.stdout.write(chalk.white.bold.bgBlack(' \n'));
```

17. How does `drawMap` label the columns at the top of the grid?

**Answer:**
- It writes spaces then iterates columns, converting `column + 65` to letters A, B, etc.

**Incorrect Options for Quiz:**
- It uses row indices instead, printing numbers across the top for each column.
- It leaves the top blank and labels columns only along the sides.
- It prints ship sizes before drawing the grid again now.
<!-- Lengths: C=15 | D1=13 | D2=12 | D3=12 -->

---

**`battleship.js`**

```javascript
    for (let row = 0; row < maxRows; row++) {

        process.stdout.write(chalk.white.bold.bgBlack(`${(row + 1).toString().padStart(2, ' ')} `));
        process.stdout.write(chalk.white.bold.bgWhiteBright(' '));
```

18. Why does `drawMap` use `padStart(2, ' ')` when printing row numbers?

**Answer:**
- To ensure single-digit rows align with double-digit ones by padding with a space.

**Incorrect Options for Quiz:**
- To ensure row numbers never exceed two digits even for larger boards.
- To pad column headers rather than the row numbers themselves.
- To convert indexes into letters before printing overhead anyway today.
<!-- Lengths: C=13 | D1=12 | D2=10 | D3=10 -->

---

**`battleship.js`**

```javascript
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
```

19. What does `drawMap` render when `targetsMap[row][column]` is undefined?

**Answer:**
- It writes two spaces using `chalk.white.bold.bgWhiteBright`, leaving the cell blank.

**Incorrect Options for Quiz:**
- It prints `X` but in green to indicate unknown.
- It draws `O` somehow.
- It throws an error because undefined cases are unhandled.
<!-- Lengths: C=10 | D1=9 | D2=8 | D3=9 -->

---

**`battleship.js`**

```javascript
function getRowAndColumn(launchCoordinates) {

    let targetRow = Number(launchCoordinates.slice(1, launchCoordinates.length)) - 1;

    let targetColumn = launchCoordinates[0].toUpperCase().charCodeAt(0) - 65;

    return { targetRow, targetColumn };
}
```

20. What column index does `getRowAndColumn` derive from the coordinates `'A1'`?

**Answer:**
- 0

**Incorrect Options for Quiz:**
- 1
- undefined
- NaN
<!-- Lengths: C=1 | D1=1 | D2=1 | D3=1 -->

---

**`battleship.js`**

```javascript
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

21. What file name does `getLocationsMap` pass to `getFileContents` when the user declines a randomized map?

**Answer:**
- map.txt

**Incorrect Options for Quiz:**
- randomizedMap.txt
- config.json
- saveState.txt
<!-- Lengths: C=1 | D1=1 | D2=1 | D3=1 -->

---

**`battleship.js`**

```javascript
        writeFileContents('randomizedMap.txt', locationsMap.map(row => row.join(',')).join('\n'));
```

22. What file does `getLocationsMap` save the randomized layout to?

**Answer:**
- randomizedMap.txt

**Incorrect Options for Quiz:**
- map.txt
- layout.txt
- ships.csv
<!-- Lengths: C=1 | D1=1 | D2=1 | D3=1 -->

---

**`battleship.js`**

```javascript
    if (targetStrike === true) {
        targetsMap[targetRow][targetColumn] = 'X'
    } else {
        targetsMap[targetRow][targetColumn] = 'O'
    }
```

23. What value marks a successful hit inside `targetsMap`?

**Answer:**
- X

**Incorrect Options for Quiz:**
- O
- undefined
- ?
<!-- Lengths: C=1 | D1=1 | D2=1 | D3=1 -->

---

**`battleship.js`**

```javascript
function getValidCoordinates(targetsMap) {
    let coordinates; 
    let isValidChoice = false; 

    const { maxRows, maxCols } = getMaxRowsAndColumns(targetsMap);
```

24. Which property does `getMaxRowsAndColumns` provide as `maxRows` for `targetsMap`?

**Answer:**
- map.length

**Incorrect Options for Quiz:**
- map[0].length
- maxCols
- map.flat().length
<!-- Lengths: C=2 | D1=2 | D2=1 | D3=3 -->

---

**`battleship.js`**

```javascript
const { maxRows, maxCols } = getMaxRowsAndColumns(locationsMap);
```

25. Which `getMaxRowsAndColumns` result is assigned to `maxCols` when called with `locationsMap`?

**Answer:**
- locationsMap[0].length

**Incorrect Options for Quiz:**
- locationsMap.length
- targetsMap.length
- rows * cols
<!-- Lengths: C=2 | D1=2 | D2=2 | D3=2 -->

---

**`battleship.js`**

```javascript
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

26. What does `getFileContents` return when file reading succeeds?

**Answer:**
- content

**Incorrect Options for Quiz:**
- undefined
- fileName
- error
<!-- Lengths: C=1 | D1=1 | D2=1 | D3=1 -->

---

**`battleship.js`**

```javascript
function writeFileContents(fileName, contents) {
    try {

        fs.writeFileSync(fileName, contents, { encoding: 'utf-8', flag: 'w' });
    } catch (error) {

        console.error(`An error has occurred writing file '${fileName}'. Please try again later.`);
        process.exit()
    }
}
```

27. What flag does `writeFileContents` use when calling `fs.writeFileSync`?

**Answer:**
- w

**Incorrect Options for Quiz:**
- r
- a
- x
<!-- Lengths: C=1 | D1=1 | D2=1 | D3=1 -->

---

**`battleship.js`**

```javascript
    const { totalTargets, locationsMap, targetsMap } = initializeMaps();

    displayResults(false, totalMissiles, totalTargets, targetsMap, firstDisplay = true);
```

28. What boolean value is passed for `targetStrike` in the introductory `displayResults` call?

**Answer:**
- false

**Incorrect Options for Quiz:**
- true
- undefined
- null
<!-- Lengths: C=1 | D1=1 | D2=1 | D3=1 -->

---

**`battleship.js`**

```
        if (targetStrike) {
            log(chalk.red.bold('HIT!!!'));
        } else {
            log(chalk.blue.bold('MISS!!!'));
        }
```

29. Which color does `displayResults` use for a hit message?

**Answer:**
- red

**Incorrect Options for Quiz:**
- blue
- green
- yellow
<!-- Lengths: C=1 | D1=1 | D2=1 | D3=1 -->

---

**`battleship.js`**

```javascript
        let ships = [2, 3, 3, 4, 5]; 

        locationsMap = getRandomizedMap(10, 10, ships);
```

30. How many ships are defined in the `ships` array before generating a randomized map?

**Answer:**
- 5

**Incorrect Options for Quiz:**
- 4
- 6
- 3
<!-- Lengths: C=1 | D1=1 | D2=1 | D3=1 -->

---

**`battleship.js`**

```javascript
        if (rndIsHorizontal) {
            rndColumn += 1; 
        } else {
            rndRow += 1; 
        }
```

31. What happens to `rndColumn` when `rndIsHorizontal` is true?

**Answer:**
- It increments by 1.

**Incorrect Options for Quiz:**
- It decrements by 1.
- It resets to 0.
- It stays constant.
<!-- Lengths: C=4 | D1=5 | D2=5 | D3=3 -->

---

**`battleship.js`**

```javascript
        if (rndRow >= maxRows || rndColumn >= maxCols || locationsMap[rndColumn][rndRow] === '1') {

            isValidPlacement = false;
        } else {

            shipCoordinates.push({ rndColumn, rndRow });
        }
```

32. What causes `isValidPlacement` to be set to false inside `placeShip`?

**Answer:**
- When the coordinate is out of bounds or already contains `'1'`.

**Incorrect Options for Quiz:**
- When the ship size is zero.
- When `rndIsHorizontal` is false.
- When `shipCoordinates` length equals `maxRows`.
<!-- Lengths: C=26 | D1=12 | D2=11 | D3=16 -->

---

**`battleship.js`**

```javascript
    const { targetRow, targetColumn } = getRowAndColumn(launchCoordinates);

    if (targetsMap[targetRow][targetColumn] !== undefined) {
        return true;
    } else {
        return false;
    }
```

33. What does `checkForRepeatedStrike` return if the player hits the same cell twice?

**Answer:**
- true

**Incorrect Options for Quiz:**
- false
- undefined
- 0
<!-- Lengths: C=1 | D1=1 | D2=1 | D3=1 -->

---

**`battleship.js`**

```javascript
    if (targetStrike === true) {
        targetsMap[targetRow][targetColumn] = 'X'
    } else {
        targetsMap[targetRow][targetColumn] = 'O'
    }
```

34. Which value does `targetsMap` receive when `targetStrike` is true?

**Answer:**
- X

**Incorrect Options for Quiz:**
- O
- undefined
- ?
<!-- Lengths: C=1 | D1=1 | D2=1 | D3=1 -->

---

**`battleship.js`**

```javascript
    log(chalk.rgb(255, 136, 0)(errorMessages.join('\n')));

    log(chalk.rgb(255, 136, 0)('Please Try Again.'));
```

35. When validation fails, what color is used to log the error messages?

**Answer:**
- rgb(255, 136, 0)

**Incorrect Options for Quiz:**
- rgb(0, 255, 0)
- rgb(0, 0, 255)
- rgb(255, 0, 0)
<!-- Lengths: C=1 | D1=1 | D2=1 | D3=1 -->

---

**`battleship.js`**

```javascript
        if (!(coordinates[0].toUpperCase().charCodeAt(0) - 64 <= maxCols)) {
            errorMessages.push("The letter component must not be greater than the number of columns.");
        }
```

36. What triggers this conditional that adds a column-bound error message?

**Answer:**
- When the letter index exceeds `maxCols`.

**Incorrect Options for Quiz:**
- When the row number is zero.
- When the player inputs a lowercase letter.
- When the map is empty.
<!-- Lengths: C=13 | D1=12 | D2=12 | D3=8 -->

---

**`battleship.js`**

```javascript
        if (!(Number(coordinates.slice(1, coordinates.length)) <= maxRows)) {
            errorMessages.push("The number component cannot be greater than the number of rows.");
        }
```

37. What validation failure pushes this specific numeric error message?

**Answer:**
- When the numeric part exceeds `maxRows`.

**Incorrect Options for Quiz:**
- When the numeric part is zero.
- When the numeric part uses letters.
- When the number contains three digits.
<!-- Lengths: C=13 | D1=13 | D2=12 | D3=11 -->

---

**`battleship.js`**

```javascript
        if (!(/^[0-9]{1,2}$/.test(coordinates.slice(1, coordinates.length)))) {
            errorMessages.push("The number component must be only 1 or 2 digits.");
        }
```

38. What does this regex check enforce for the coordinate digits?

**Answer:**
- That the number component is one or two digits long.

**Incorrect Options for Quiz:**
- That the number component includes at least one letter.
- That the number component always has three digits.
- That the letter component has two characters.
<!-- Lengths: C=26 | D1=20 | D2=19 | D3=18 -->

---

**`battleship.js`**

```javascript
    } while (hitsToWin !== 0 && missilesRemaining >= hitsToWin);
```

39. Which condition must hold for the main loop to continue after a strike?

**Answer:**
- `hitsToWin !== 0 && missilesRemaining >= hitsToWin`

**Incorrect Options for Quiz:**
- `hitsToWin === 0 && missilesRemaining <= hitsToWin`
- `hitsToWin !== 0 || missilesRemaining < hitsToWin`
- `missilesRemaining === 0`
<!-- Lengths: C=6 | D1=6 | D2=8 | D3=2 -->

---

**`battleship.js`**

```javascript
        missilesRemaining = totalMissiles - strikeAttempts;

        hitsToWin = totalTargets - totalStrikes;
```

40. How is `missilesRemaining` calculated inside the loop?

**Answer:**
- totalMissiles minus strikeAttempts

**Incorrect Options for Quiz:**
- totalStrikes minus totalTargets
- totalMissiles plus totalStrikes
- strikeAttempts times totalTargets
<!-- Lengths: C=4 | D1=5 | D2=4 | D3=5 -->

---

**`battleship.js`**

```javascript
        if (targetStrike) {
            totalStrikes += 1;  
        }

        missilesRemaining = totalMissiles - strikeAttempts;

        hitsToWin = totalTargets - totalStrikes;
```

41. When is `totalStrikes` incremented?

**Answer:**
- immediately after a hit (`targetStrike` true)

**Incorrect Options for Quiz:**
- after every `missilesRemaining` update
- when there are no more ships
- when `strikeAttempts` resets
<!-- Lengths: C=8 | D1=7 | D2=7 | D3=4 -->

---

**`battleship.js`**

```javascript
    drawMap(targetsMap);
```

42. What function is responsible for rendering the player’s known hits and misses after each shot?

**Answer:**
- drawMap

**Incorrect Options for Quiz:**
- displayResults
- updateTargetMap
- getValidCoordinates
<!-- Lengths: C=1 | D1=2 | D2=2 | D3=2 -->

---

**`battleship.js`**

```javascript
    } else if (missilesRemaining < hitsToWin) {

        log(`YOU LOSE - YOU NEED ${hitsToWin} HITS TO WIN BUT ONLY ${missilesRemaining} MISSILES REMAINING`);
        log(chalk.magenta.bold('BETTER LUCK NEXT TIME!'));
    }
```

43. What message does the code log inside `displayResults` when the player runs out of missiles before getting enough hits?

**Answer:**
- `YOU LOSE - YOU NEED ${hitsToWin} HITS TO WIN BUT ONLY ${missilesRemaining} MISSILES REMAINING`

**Incorrect Options for Quiz:**
- `YOU WIN! - YOU SANK MY ENTIRE FLEET!`
- `You have X missiles remaining!`
- `You need X more hits to win!`
<!-- Lengths: C=52 | D1=11 | D2=9 | D3=11 -->

---

**`battleship.js`**

```javascript
    process.stdout.write(chalk.white.bold.bgBlack('    '));
    for (let column = 0; column < maxCols; column++) {
        process.stdout.write(chalk.white.bold.bgBlack(`${String.fromCharCode(column + 65)} `));
    }
    process.stdout.write(chalk.white.bold.bgBlack(' \n'));
```

44. What ANSI styling does `drawMap` use when printing the column letters?

**Answer:**
- `chalk.white.bold.bgBlack`

**Incorrect Options for Quiz:**
- `chalk.red.bold.bgWhite`
- `chalk.green.bold`
- `chalk.blue.bgWhite`
<!-- Lengths: C=1 | D1=3 | D2=2 | D3=2 -->

---

**`battleship.js`**

```javascript
        log(chalk.blue.bold(`MISS!!!`));
```

45. Which color does the code use when logging a miss?

**Answer:**
- blue

**Incorrect Options for Quiz:**
- red
- green
- magenta
<!-- Lengths: C=1 | D1=1 | D2=1 | D3=1 -->

---

**`battleship.js`**

```javascript
        log(chalk.red.bold('HIT!!!'));
```

46. Which color is used for a hit message?

**Answer:**
- red

**Incorrect Options for Quiz:**
- blue
- magenta
- yellow
<!-- Lengths: C=1 | D1=1 | D2=1 | D3=1 -->

---

**`battleship.js`**

```javascript
        process.stdout.write(chalk.white.bold.bgWhiteBright(' '));
```

47. What background color does `drawMap` apply to the separator after each row number?

**Answer:**
- bgWhiteBright

**Incorrect Options for Quiz:**
- bgBlack
- bgGreen
- bgRed
<!-- Lengths: C=1 | D1=1 | D2=1 | D3=1 -->

---

**`battleship.js`**

```javascript
    process.stdout.write(chalk.bgBlack('    '));
    for (let column = 0; column < maxCols; column++) {
        process.stdout.write(chalk.bgBlack(`  `));
    }
    process.stdout.write(chalk.bgBlack(' \n'));
```

48. What does the final block of `drawMap` produce after all rows are printed?

**Answer:**
- a black background footer aligning with the grid width

**Incorrect Options for Quiz:**
- column headers repeated
- another set of letters
- a bright white line
<!-- Lengths: C=22 | D1=7 | D2=5 | D3=5 -->

---

**`battleship.js`**

```javascript
const { totalTargets, locationsMap, targetsMap } = initializeMaps();
```

49. What three components does `initializeMaps` return?

**Answer:**
- totalTargets, locationsMap, targetsMap

**Incorrect Options for Quiz:**
- totalMissiles, targetsMap, hitsToWin
- totalStrikes, locationsMap, missilesRemaining
- totalShips, randomMap, hitMap
<!-- Lengths: C=3 | D1=4 | D2=4 | D3=4 -->

---

**`battleship.js`**

```javascript
function getMaxRowsAndColumns(map) {

    let maxRows = map.length;

    let maxCols = map[0].length;

    return { maxRows, maxCols };
}
```

50. What does `maxCols` represent when returned by `getMaxRowsAndColumns`?

**Answer:**
- map[0].length

**Incorrect Options for Quiz:**
- map.length
- totalRows
- maxRows
<!-- Lengths: C=2 | D1=2 | D2=2 | D3=1 -->

---

---

<sub>Generated by <b>GrillMyCode</b> · openai/gpt-5.1-codex-mini via openrouter · main</sub>