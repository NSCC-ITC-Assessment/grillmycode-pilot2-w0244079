## Grill My Code

> **Generated:** 2026-05-27 15:20:07 UTC


> **Commits reviewed:** `6c9bd79` → `88ca2c2`

> **Code Files Assessed:** `battleship.js`


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

1. What is the purpose of the `checkForRepeatedStrike` function?

   The function determines whether a player has already attempted to strike a specific coordinate by checking if the targetsMap contains a defined value at that position, returning true if the coordinate was previously targeted and false otherwise.

   <!-- Lengths: C=32 | D1=31 | D2=30 | D3=33 -->

---

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

2. What is the difference between how `checkForTargetStrike` and `checkForRepeatedStrike` determine their return values?

   checkForTargetStrike checks the locationsMap for a `'1'` to detect ships, while checkForRepeatedStrike checks targetsMap for any defined value to detect repeated strikes.

   <!-- Lengths: C=21 | D1=24 | D2=25 | D3=27 -->

---

3. What does `checkForTargetStrike` return when the targeted coordinate contains a ship?

   true

   <!-- Lengths: C=1 | D1=1 | D2=1 | D3=1 -->

---

```javascript
function getRowAndColumn(launchCoordinates) {
    let targetRow = Number(launchCoordinates.slice(1, launchCoordinates.length)) - 1;
    let targetColumn = launchCoordinates[0].toUpperCase().charCodeAt(0) - 65;
    return { targetRow, targetColumn };
}
```

4. What does `getRowAndColumn` return when given the input `'B3'`?

   An object with `targetRow` equal to 2 and `targetColumn` equal to 1.

   <!-- Lengths: C=13 | D1=13 | D2=13 | D3=13 -->

---

5. Why is `65` subtracted from the character code in the `getRowAndColumn` function?

   Because 'A' has a character code of 65, so subtracting 65 converts 'A' to 0, 'B' to 1, 'C' to 2, and so on, creating a zero-based column index that matches array indexing.

   <!-- Lengths: C=30 | D1=30 | D2=29 | D3=30 -->

---

```javascript
function getMaxRowsAndColumns(map) {
    let maxRows = map.length;
    let maxCols = map[0].length;
    return { maxRows, maxCols };
}
```

6. What does `getMaxRowsAndColumns` return for a 10x10 grid map?

   An object with `maxRows` equal to 10 and `maxCols` equal to 10.

   <!-- Lengths: C=12 | D1=12 | D2=12 | D3=12 -->

---

7. What is the purpose of the `getMaxRowsAndColumns` function?

   The function extracts the dimensions of a 2D array map by returning the number of rows (from map.length) and the number of columns (from map[0].length).

   <!-- Lengths: C=24 | D1=27 | D2=27 | D3=28 -->

---

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

8. What value is stored in `targetsMap` when a missile misses its target?

   'O'

   <!-- Lengths: C=1 | D1=1 | D2=1 | D3=1 -->

---

9. What value is stored in `targetsMap` when a missile hits a target?

   'X'

   <!-- Lengths: C=1 | D1=1 | D2=1 | D3=1 -->

---

10. Why does `updateTargetMap` use `targetStrike === true` instead of just `targetStrike`?

    The strict equality check `===` ensures that only an actual boolean `true` value triggers a hit, whereas a truthy value like a truthy object would not incorrectly mark a hit.

    <!-- Lengths: C=25 | D1=27 | D2=27 | D3=26 -->

---

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

11. What does `initializeMaps` return when the locationsMap contains exactly 5 ships of sizes 2, 3, 3, 4, and 5?

    An object with `totalTargets` equal to 17 (the sum of all ship segments), `locationsMap` containing the ship positions, and `targetsMap` initialized with all undefined values.

    <!-- Lengths: C=30 | D1=30 | D2=30 | D3=30 -->

---

12. Why is `Array(maxCols).fill(undefined)` used instead of `Array(maxCols).fill(0)` to initialize the targetsMap rows?

    Using `undefined` allows the `checkForRepeatedStrike` function to distinguish between coordinates that have never been targeted (undefined) and coordinates that have been targeted (defined as 'X' or 'O').

    <!-- Lengths: C=27 | D1=27 | D2=27 | D3=27 -->

---

13. What does the expression `locationsMap.flat().forEach(value => { if (value === '1') { return (totalTargets += 1) } })` accomplish?

    It flattens the 2D locationsMap into a 1D array and counts how many cells contain the string '1', which represents ship segments, storing the count in totalTargets.

    <!-- Lengths: C=29 | D1=29 | D2=29 | D3=29 -->

---

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

14. What happens when the player chooses to use a randomized map?

    The function creates a 10x10 grid with ships of sizes 2, 3, 3, 4, and 5 placed randomly, then saves the generated map to 'randomizedMap.txt' before returning it.

    <!-- Lengths: C=29 | D1=29 | D2=29 | D3=29 -->

---

15. How does `getLocationsMap` read the pre-defined map from 'map.txt'?

    It reads the file contents, splits by carriage return and newline to get rows, then splits each row by commas to create a 2D array where each cell is a string.

    <!-- Lengths: C=28 | D1=28 | D2=28 | D3=28 -->

---

```javascript
function getRandomizedMap(maxRows, maxCols, ships) {
    const locationsMap = Array.from({ length: maxRows }).map(() => new Array(maxCols).fill('0'));
    ships.forEach((size) => {
        placeShip(size, maxRows, maxCols, locationsMap);
    });
    return locationsMap; 
}
```

16. What is the initial state of the locationsMap when `getRandomizedMap` begins placing ships?

    A 2D array where every cell contains the string '0', representing an empty grid with no ships placed yet.

    <!-- Lengths: C=24 | D1=24 | D2=24 | D3=24 -->

---

17. Why does `getRandomizedMap` use `new Array(maxCols).fill('0')` instead of `Array(maxCols).fill('0')`?

    Both syntaxes produce equivalent results in this context, as `new Array()` and `Array()` create the same array object when called with a length argument.

    <!-- Lengths: C=26 | D1=27 | D2=27 | D3=27 -->

---

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

18. What causes `placeShip` to reject a placement and retry with new random coordinates?

    The placement is rejected when any coordinate along the ship's length falls outside the grid bounds or overlaps with an existing ship segment marked as '1'.

    <!-- Lengths: C=27 | D1=27 | D2=27 | D3=27 -->

---

19. How does `placeShip` determine whether to extend horizontally or vertically?

    It checks the `rndIsHorizontal` value from `getRandomPosition`; if true, it increments `rndColumn` to extend rightward, otherwise it increments `rndRow` to extend downward.

    <!-- Lengths: C=26 | D1=26 | D2=26 | D3=26 -->

---

20. Why does `placeShip` store coordinates in `shipCoordinates` array before writing to `locationsMap`?

    It stores coordinates temporarily to ensure all positions are valid before modifying `locationsMap`, preventing partial ship placements if validation fails midway through the loop.

    <!-- Lengths: C=26 | D1=26 | D2=26 | D3=26 -->

---

```javascript
function getRandomPosition(maxCols, maxRows) {
    const rndIsHorizontal = Boolean(Math.round(Math.random()));
    const rndColumn = Math.floor(Math.random() * maxCols);
    const rndRow = Math.floor(Math.random() * maxRows);
    return { rndColumn, rndRow, rndIsHorizontal };
}
```

21. What is the probability of `rndIsHorizontal` being true in `getRandomPosition`?

    50%, because `Math.random()` returns a value between 0 and 1, `Math.round()` converts values below 0.5 to 0 and 0.5 and above to 1, and `Boolean()` converts both to false and true respectively.

    <!-- Lengths: C=32 | D1=32 | D2=32 | D3=32 -->

---

22. What range of values can `rndColumn` have in `getRandomPosition` when `maxCols` is 10?

    Integers from 0 to 9 inclusive, because `Math.floor(Math.random() * 10)` produces values from 0 up to but not including 10.

    <!-- Lengths: C=26 | D1=26 | D2=26 | D3=26 -->

---

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
            // ... more validation ...
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

23. What causes `getValidCoordinates` to display the message "You already hit this position. Please Try Again."?

    The message displays when `checkForRepeatedStrike(coordinates, targetsMap)` returns true, meaning the coordinate was previously targeted and already exists in targetsMap with a defined value.

    <!-- Lengths: C=27 | D1=27 | D2=27 | D3=27 -->

---

24. Why does `getValidCoordinates` use a do-while loop instead of a simple while loop?

    The do-while loop guarantees that the user is prompted for input at least once, whereas a while loop might never execute if the condition were initially false.

    <!-- Lengths: C=26 | D1=26 | D2=26 | D3=26 -->

---

25. What is the purpose of the `errorMessages` array in `getValidCoordinates`?

    It collects all validation errors for the current coordinate input, allowing multiple errors to be displayed together instead of one at a time.

    <!-- Lengths: C=24 | D1=24 | D2=24 | D3=24 -->

---

```javascript
if (!([2, 3].includes(coordinates.length))) {
    errorMessages.push("Coordinates must be only 2 or 3 characters long.");
}
```

26. Which of the following coordinate inputs would pass the length validation check in `getValidCoordinates`?

    'A1'

    <!-- Lengths: C=1 | D1=1 | D2=1 | D3=1 -->

---

27. Why does the validation check that coordinates must be 2 or 3 characters long use `[2, 3].includes(coordinates.length)` instead of `coordinates.length === 2 || coordinates.length === 3`?

    Both approaches produce identical results in this case, as `[2, 3].includes()` and the `||` operator both check for the same two valid lengths.

    <!-- Lengths: C=26 | D1=26 | D2=26 | D3=26 -->

---

```javascript
if (coordinates[1] === '0') {
    errorMessages.push("The number component cannot begin with a '0'.");
}
```

28. Why does `getValidCoordinates` reject coordinates like 'A01'?

    Because `coordinates[1]` would be '0', triggering the validation error that prevents coordinates where the numeric portion begins with zero.

    <!-- Lengths: C=26 | D1=26 | D2=26 | D3=26 -->

---

```javascript
if (!(Number(coordinates.slice(1, coordinates.length)) > 0)) {
    errorMessages.push("The number component must be greater than 0.");
}
```

29. What happens when the player enters 'A0' as coordinates?

    The validation catches this input twice: first with the explicit check `coordinates[1] === '0'`, and second with the numeric check `Number(coordinates.slice(1)) > 0`, both adding error messages.

    <!-- Lengths: C=32 | D1=32 | D2=32 | D3=32 -->

---

```javascript
if (!(Number(coordinates.slice(1, coordinates.length)) <= maxRows)) {
    errorMessages.push("The number component cannot be greater than the number of rows.");
}
```

30. For a 10x10 grid, which coordinate would trigger the error about exceeding the number of rows?

    'A11'

    <!-- Lengths: C=1 | D1=1 | D2=1 | D3=1 -->

---

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

31. How many total missiles does the player have in each game?

    30

    <!-- Lengths: C=1 | D1=1 | D2=1 | D3=1 -->

---

32. What is the condition that keeps the game loop running in `playGame`?

    The loop continues while `hitsToWin` is not zero AND `missilesRemaining` is greater than or equal to `hitsToWin`, meaning the player still needs hits and has enough missiles to potentially win.

    <!-- Lengths: C=29 | D1=29 | D2=29 | D3=29 -->

---

33. What happens when `missilesRemaining` becomes less than `hitsToWin`?

    The game loop exits because the condition `missilesRemaining >= hitsToWin` becomes false, and the player loses since they cannot achieve the required number of hits with their remaining missiles.

    <!-- Lengths: C=29 | D1=29 | D2=29 | D3=29 -->

---

34. Why is `totalStrikes` only incremented inside the `if (targetStrike)` block?

    Because `totalStrikes` tracks the number of successful hits on ships, so it should only increase when `targetStrike` is true, indicating a hit rather than a miss.

    <!-- Lengths: C=28 | D1=28 | D2=28 | D3=28 -->

---

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

35. When does `displayResults` show the "YOU WIN" message?

    When `hitsToWin` equals 0, meaning the player has achieved the required number of hits to sink all ships.

    <!-- Lengths: C=22 | D1=22 | D2=22 | D3=22 -->

---

36. What is displayed when `firstDisplay` is true?

    The game title "Let's play Battleship!" and a message showing the initial missile count and the number of ships to sink.

    <!-- Lengths: C=22 | D1=22 | D2=22 | D3=22 -->

---

37. Why does `displayResults` call `console.clear()` at the beginning?

    To clear the screen before displaying updated game information, creating a clean display for each turn without scrolling through previous game states.

    <!-- Lengths: C=25 | D1=25 | D2=25 | D3=25 -->

---

```javascript
function drawMap(targetsMap) {
    const { maxRows, maxCols } = getMaxRowsAndColumns(targetsMap);
    process.stdout.write(chalk.white.bold.bgBlack('    '));
    for (let column = 0; column < maxCols; column++) {
        process.stdout.write(chalk.white.bold.bgBlack(`${String.fromCharCode(column + 65)} `));
    }
    process.stdout.write(chalk.white.bold.bgBlack(' \n'));
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
    process.stdout.write(chalk.bgBlack('    '));
    for (let column = 0; column < maxCols; column++) {
        process.stdout.write(chalk.bgBlack(`  `));
    }
    process.stdout.write(chalk.bgBlack(' \n'));
}
```

38. What character is displayed for a cell that has been hit?

    'X' in red

    <!-- Lengths: C=5 | D1=5 | D2=5 | D3=5 -->

---

39. What character is displayed for a cell that has been missed?

    'O' in blue

    <!-- Lengths: C=5 | D1=5 | D2=5 | D3=5 -->

---

40. What character is displayed for a cell that has not yet been targeted?

    Two blank spaces in white

    <!-- Lengths: C=6 | D1=6 | D2=6 | D3=6 -->

---

41. Why does `drawMap` use `process.stdout.write` instead of `console.log`?

    `process.stdout.write` prints without adding a newline character, allowing precise control over cell-by-cell output for the grid layout.

    <!-- Lengths: C=23 | D1=23 | D2=23 | D3=23 -->

---

42. What is the purpose of `String.fromCharCode(column + 65)` in `drawMap`?

    It converts the column index to a letter label by adding 65 to get the ASCII code for 'A' through 'J' for a 10-column grid.

    <!-- Lengths: C=25 | D1=25 | D2=25 | D3=25 -->

---

43. Why does `drawMap` use `(row + 1).toString().padStart(2, ' ')` for row labels?

    To display row numbers starting at 1 (instead of 0) and pad single-digit numbers with a leading space so columns align properly.

    <!-- Lengths: C=25 | D1=25 | D2=25 | D3=25 -->

---

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

44. What happens if the file 'map.txt' does not exist when `getFileContents` is called?

    The catch block executes, displaying an error message and calling `process.exit()` to terminate the program.

    <!-- Lengths: C=25 | D1=25 | D2=25 | D3=25 -->

---

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

45. What does the flag `'w'` do in `fs.writeFileSync(fileName, contents, { encoding: 'utf-8', flag: 'w' })`?

    The 'w' flag opens the file for writing, creating the file if it doesn't exist or truncating it to zero length if it does exist.

    <!-- Lengths: C=25 | D1=25 | D2=25 | D3=25 -->

---

```javascript
do {
    console.clear();
    playGame();
} while (readlineSync.keyInYN('Play again?'));
```

46. What causes the entire game to restart?

    When the player presses 'Y' or 'y' in response to the "Play again?" prompt, the do-while loop condition evaluates to true and `playGame()` is called again.

    <!-- Lengths: C=29 | D1=29 | D2=29 | D3=29 -->

---

```javascript
function getValidCoordinates(targetsMap) {
    // ... validation code ...
    try {
        if (!([2, 3].includes(coordinates.length))) {
            errorMessages.push("Coordinates must be only 2 or 3 characters long.");
        }
        if (!(/[a-z]/i.test(coordinates[0]))) {
            errorMessages.push("The first character must be a letter.");
        }
        // ... more validation ...
    } catch (error) {  
        errorMessages.push(error);
    }
```

47. Under what circumstances would the catch block in `getValidCoordinates` execute?

    The catch block would execute if any validation operation throws an exception, such as accessing `coordinates[0]` when `coordinates` is null or undefined.

    <!-- Lengths: C=26 | D1=26 | D2=26 | D3=26 -->

---

```javascript
if (!(/[a-z]/i.test(coordinates[0]))) {
    errorMessages.push("The first character must be a letter.");
}
```

48. What does the regular expression `/[a-z]/i` with the 'i' flag check for?

    It checks whether the first character is any letter from A to Z, case-insensitive, by testing if it matches any lowercase or uppercase alphabetic character.

    <!-- Lengths: C=26 | D1=26 | D2=26 | D3=26 -->

---

```javascript
if (!(coordinates[0].toUpperCase().charCodeAt(0) - 64 > 0)) {
    errorMessages.push("The letter component must at least start with an 'A' or 'a'.");
}
```

49. Why is this validation check redundant given the previous check `!/[a-z]/i.test(coordinates[0])`?

    The previous check already ensures `coordinates[0]` is a letter, so `charCodeAt(0) - 64` will always be greater than 0 for any valid input, making this check always pass.

    <!-- Lengths: C=29 | D1=29 | D2=29 | D3=29 -->

---

```javascript
if (!(coordinates[0].toUpperCase().charCodeAt(0) - 64 <= maxCols)) {
    errorMessages.push("The letter component must not be greater than the number of columns.");
}
```

50. For a 10x10 grid, what is the maximum letter that would pass this validation check?

    'J', because 'J' has a character code of 74, and 74 minus 64 equals 10, which is equal to maxCols and therefore passes the `<= maxCols` check.

    <!-- Lengths: C=31 | D1=31 | D2=31 | D3=31 -->

---

<sub>Generated by <b>GrillMyCode</b> · minimax/minimax-m2.7 via openrouter · main</sub>