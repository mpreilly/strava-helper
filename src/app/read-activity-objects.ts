export function readActivitiesFromR2WFile(fileData: string): any {
    const domparser = new DOMParser();
    const document = domparser.parseFromString(fileData, 'text/html');

    const distances = [];
    const meterDistances = [];
    const times = [];
    const secondsTimes = [];
    const dates = [];
    const timeOfDays = [];
    const descriptions = [];
    const activityTypes = [];
    const workoutObjects = [];
    const raceSections = [];

    let nullsInARow = 0;
    for (let i = 0; nullsInARow < 20; i++) {
        let result = document.querySelector(`body > div.container > form > table:nth-child(${i}) > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(2) > td:nth-child(2) > strong > span`);
        if (result == null) {
            nullsInARow += 1;
        } else {
            // console.log(result.textContent);
            nullsInARow = 0;

            const tokens = result.textContent.trim().split(" ");
            distances.push(tokens[0] + " " + tokens[1]);
            if (tokens[1] === "Meters") {
                meterDistances.push(+tokens[0]);   // + operator parses number from string
            } else {
                meterDistances.push(+tokens[0] * 1609.34);
            }

            times.push(tokens[3])
            
            const timeTokens = tokens[3].split(":");
            if (timeTokens.length === 2) {
                // if activity is less than 1 minute (e.g. 400m race), r2w would represent as seconds:00 for some reason.
                // just going to ignore that for now...
                secondsTimes.push(+timeTokens[1] + (+timeTokens[0] * 60));
            } else if (timeTokens.length === 3) {
                secondsTimes.push(+timeTokens[2] + (+timeTokens[1] * 60) + (+timeTokens[0] * 60 * 60));
            }

            let date = document.querySelector(`body > div.container > form > table:nth-child(${i}) > tbody > tr > td > table > tbody > tr > td > a`).textContent;
            dates.push(date.trim());
            
            let desc = document.querySelector(`body > div.container > form > table:nth-child(${i}) > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(3) > td:nth-child(2)`).textContent;
            descriptions.push(desc.trim());

            let tod = document.querySelector(`body > div.container > form > table:nth-child(${i}) > tbody > tr > td > table:nth-child(1) > tbody > tr > td:nth-child(2) > span`).textContent;
            timeOfDays.push(tod.trim());

            let activityType = document.querySelector(`body > div.container > form > table:nth-child(${i}) > tbody > tr > td > table:nth-child(1) > tbody > tr > td:nth-child(3) > span`).textContent;
            activityTypes.push(activityType.trim());

            let intervalSection = document.querySelector(`body > div.container > form > table:nth-child(${i}) > tbody > tr > td > table:nth-child(3) > tbody > tr:nth-child(1) > td`);
            if (intervalSection) {
                let workoutSets = [];
                let setRow = 2;

                // keep iterating through the table while there are still rows
                while (document.querySelector(`body > div.container > form > table:nth-child(${i}) > tbody > tr > td > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr:nth-child(${setRow}) > td:nth-child(1)`)) {
                    let setInfo = {};
                    setInfo['set_num'] = document.querySelector(`body > div.container > form > table:nth-child(${i}) > tbody > tr > td > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr:nth-child(${setRow}) > td:nth-child(1)`).textContent.trim();
                    setInfo['num_reps'] = document.querySelector(`body > div.container > form > table:nth-child(${i}) > tbody > tr > td > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr:nth-child(${setRow}) > td:nth-child(2)`).textContent.trim();
                    setInfo['distance'] = document.querySelector(`body > div.container > form > table:nth-child(${i}) > tbody > tr > td > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr:nth-child(${setRow}) > td:nth-child(3)`).textContent.trim().replace('\n', '');
                    setInfo['goal'] = document.querySelector(`body > div.container > form > table:nth-child(${i}) > tbody > tr > td > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr:nth-child(${setRow}) > td:nth-child(4)`).textContent.trim();
                    setInfo['actual'] = document.querySelector(`body > div.container > form > table:nth-child(${i}) > tbody > tr > td > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr:nth-child(${setRow}) > td:nth-child(5)`).textContent.trim();
                    setInfo['rep_rest'] = document.querySelector(`body > div.container > form > table:nth-child(${i}) > tbody > tr > td > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr:nth-child(${setRow}) > td:nth-child(6)`).textContent.trim();
                    setInfo['set_rest'] = document.querySelector(`body > div.container > form > table:nth-child(${i}) > tbody > tr > td > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr:nth-child(${setRow}) > td:nth-child(7)`).textContent.trim();
                    workoutSets.push(setInfo);
                    setRow += 1;
                }
                workoutObjects.push(workoutSets);
            } else {
                workoutObjects.push(null);
            }

            let raceSection = document.querySelector(`body > div.container > form > table:nth-child(${i}) > tbody > tr > td > table:nth-child(3) > tbody > tr:nth-child(1) > td > strong`);
            if (raceSection) {
                let raceInfoString = "";
                try {
                    raceInfoString += "Race Name: " + document.querySelector(`body > div.container > form > table:nth-child(${i}) > tbody > tr > td > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(2)`).textContent.trim() + "\n";
                } catch {}
                try {
                    raceInfoString += "Distance: " + document.querySelector(`body > div.container > form > table:nth-child(${i}) > tbody > tr > td > table:nth-child(3) > tbody > tr:nth-child(5) > td:nth-child(2) > strong`).textContent.trim() + "\n";
                } catch {}
                try {
                    raceInfoString += "Time: " + document.querySelector(`body > div.container > form > table:nth-child(${i}) > tbody > tr > td > table:nth-child(3) > tbody > tr:nth-child(6) > td:nth-child(2) > strong`).textContent.trim() + "\n";
                } catch {}
                try {
                    raceInfoString += "Race Splits: " + document.querySelector(`body > div.container > form > table:nth-child(${i}) > tbody > tr > td > table:nth-child(3) > tbody > tr:nth-child(7) > td:nth-child(2)`).textContent.trim() + "\n";
                } catch {}
                try {
                    raceInfoString += "Overall Place: " + document.querySelector(`body > div.container > form > table:nth-child(${i}) > tbody > tr > td > table:nth-child(3) > tbody > tr:nth-child(11) > td:nth-child(2)`).textContent.trim() + "\n";
                } catch {}
                try {
                    if (document.querySelector(`body > div.container > form > table:nth-child(${i}) > tbody > tr > td > table:nth-child(3) > tbody > tr:nth-child(13) > td:nth-child(2)`)) {
                        raceInfoString += "Comments: " + document.querySelector(`body > div.container > form > table:nth-child(${i}) > tbody > tr > td > table:nth-child(3) > tbody > tr:nth-child(13) > td:nth-child(2)`).textContent.trim() + "\n";
                    } else {
                        raceInfoString += "Comments: " + document.querySelector(`body > div.container > form > table:nth-child(${i}) > tbody > tr > td > table:nth-child(3) > tbody > tr:nth-child(12) > td:nth-child(2)`).textContent.trim() + "\n";
                    }
                } catch {}
                raceSections.push(raceInfoString);
            } else {
                raceSections.push("");
            }
            
        }
    }

    for (let i = 0; i < distances.length; i++) {
        console.log(dates[i] + " " + timeOfDays[i] + " " + activityTypes[i] + ":\n" + distances[i] + " in " + times[i] + "\n" + meterDistances[i] + " in " + secondsTimes[i] + "\n" + descriptions[i] + "\n" + raceSections[i]);
        if (workoutObjects[i]) {
            for (let setNum = 0; setNum < workoutObjects[i].length; setNum++) {
                let set = workoutObjects[i][setNum];
                let setString = `set ${set['set_num']}:
                    ${set['num_reps']} x ${set['distance']} @ ${set['goal']}
                    ${set['actual']}
                    rep rest ${set['rep_rest']}, set rest ${set['set_rest']}
                `;
                console.log(setString);
            }
        }
        console.log('\n');
    }
}