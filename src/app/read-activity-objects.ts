import { R2WActivity, RaceInfo, WorkoutSet } from './r2w-activity';

export function readActivitiesFromR2WFile(fileData: string): R2WActivity[] {
    const domparser = new DOMParser();
    const document = domparser.parseFromString(fileData, 'text/html');

    const activities: R2WActivity[] = [];

    let nullsInARow = 0;
    for (let i = 0; nullsInARow < 20; i++) {
        let result = document.querySelector(`body > div.container > form > table:nth-child(${i}) > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(2) > td:nth-child(2) > strong > span`);
        if (result == null) {
            nullsInARow += 1;
        } else {
            nullsInARow = 0;

            let notRunningMiles = document.querySelector(`body > div.container > form > table:nth-child(${i}) > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(2) > td:nth-child(2) > i > span`);
            if (notRunningMiles && notRunningMiles.textContent.includes('Not running miles') || result.textContent.includes('--')) {
                continue;
            }

            const tokens = result.textContent.trim().split(" ");
            let stringDistance = tokens[0] + " " + tokens[1]

            let meterDistance: number;
            if (tokens[1] === "Meters") {
                meterDistance = +tokens[0];
            } else if (tokens[1] === "Kilometers") {
                meterDistance = +tokens[0] * 1000
            } else {
                meterDistance = +tokens[0] * 1609.34
            }

            let stringTime = tokens[3]
            
            const timeTokens = tokens[3].split(":");
            let secondsTime: number;
            if (timeTokens.length === 2) {
                // if activity is less than 1 minute (e.g. 400m race), r2w would represent as seconds:00 for some reason.
                // just going to ignore that for now...
                secondsTime = +timeTokens[1] + (+timeTokens[0] * 60);
            } else if (timeTokens.length === 3) {
                secondsTime = +timeTokens[2] + (+timeTokens[1] * 60) + (+timeTokens[0] * 60 * 60);
            }

            let r2wDate = document.querySelector(`body > div.container > form > table:nth-child(${i}) > tbody > tr > td > table > tbody > tr > td > a`).textContent;
            
            let timeOfDay = document.querySelector(`body > div.container > form > table:nth-child(${i}) > tbody > tr > td > table:nth-child(1) > tbody > tr > td:nth-child(2) > span`).textContent;

            // turn "Friday, 2/1/2019" into ['2', '1', '2019'], then into 2019-02-01
            let dateTokens = r2wDate.split(' ')[1].split('/');
            let isoDateTime = dateTokens[2] + '-' + dateTokens[0].padStart(2, '0') + '-' + dateTokens[1].padStart(2, '0');
            if (timeOfDay === 'Morning') {
                isoDateTime += 'T09:00'
            } else if (timeOfDay === 'Afternoon') {
                isoDateTime += 'T15:00'
            } else if (timeOfDay === 'Evening') {
                isoDateTime += 'T18:00'
            } else if (timeOfDay === 'Night') {
                isoDateTime += 'T21:00'
            } else {
                isoDateTime += 'T12:00'
            }
            
            let description = document.querySelector(`body > div.container > form > table:nth-child(${i}) > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(3) > td:nth-child(2)`).textContent;

            let activityType = document.querySelector(`body > div.container > form > table:nth-child(${i}) > tbody > tr > td > table:nth-child(1) > tbody > tr > td:nth-child(3) > span`).textContent;

            let intervalSection = document.querySelector(`body > div.container > form > table:nth-child(${i}) > tbody > tr > td > table:nth-child(3) > tbody > tr:nth-child(1) > td`);
            let workoutSets: WorkoutSet[];
            if (intervalSection) {
                workoutSets = [];
                let setRow = 2;

                // keep iterating through the table while there are still rows
                while (document.querySelector(`body > div.container > form > table:nth-child(${i}) > tbody > tr > td > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr:nth-child(${setRow}) > td:nth-child(1)`)) {
                    let setInfo = <WorkoutSet>{};
                    setInfo['setNum'] = document.querySelector(`body > div.container > form > table:nth-child(${i}) > tbody > tr > td > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr:nth-child(${setRow}) > td:nth-child(1)`).textContent.trim();
                    setInfo['numReps'] = document.querySelector(`body > div.container > form > table:nth-child(${i}) > tbody > tr > td > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr:nth-child(${setRow}) > td:nth-child(2)`).textContent.trim();
                    setInfo['distance'] = document.querySelector(`body > div.container > form > table:nth-child(${i}) > tbody > tr > td > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr:nth-child(${setRow}) > td:nth-child(3)`).textContent.trim().replace('\n', '');
                    setInfo['goal'] = document.querySelector(`body > div.container > form > table:nth-child(${i}) > tbody > tr > td > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr:nth-child(${setRow}) > td:nth-child(4)`).textContent.trim();
                    setInfo['actual'] = document.querySelector(`body > div.container > form > table:nth-child(${i}) > tbody > tr > td > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr:nth-child(${setRow}) > td:nth-child(5)`).textContent.trim();
                    setInfo['repRest'] = document.querySelector(`body > div.container > form > table:nth-child(${i}) > tbody > tr > td > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr:nth-child(${setRow}) > td:nth-child(6)`).textContent.trim();
                    setInfo['setRest'] = document.querySelector(`body > div.container > form > table:nth-child(${i}) > tbody > tr > td > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr:nth-child(${setRow}) > td:nth-child(7)`).textContent.trim();
                    workoutSets.push(setInfo);
                    setRow += 1;
                }
            } else {
                workoutSets = null
            }

            let raceSection = document.querySelector(`body > div.container > form > table:nth-child(${i}) > tbody > tr > td > table:nth-child(3) > tbody > tr:nth-child(1) > td > strong`);
            let raceInfo: RaceInfo;
            if (raceSection) {
                raceInfo = <RaceInfo>{};
                raceInfo['raceName'] = document.querySelector(`body > div.container > form > table:nth-child(${i}) > tbody > tr > td > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(2)`).textContent.trim();
                raceInfo['distance'] = document.querySelector(`body > div.container > form > table:nth-child(${i}) > tbody > tr > td > table:nth-child(3) > tbody > tr:nth-child(5) > td:nth-child(2) > strong`).textContent.trim();
                raceInfo['time'] = document.querySelector(`body > div.container > form > table:nth-child(${i}) > tbody > tr > td > table:nth-child(3) > tbody > tr:nth-child(6) > td:nth-child(2) > strong`).textContent.trim();
                raceInfo['splits'] = document.querySelector(`body > div.container > form > table:nth-child(${i}) > tbody > tr > td > table:nth-child(3) > tbody > tr:nth-child(7) > td:nth-child(2)`).textContent.trim();
                raceInfo['place'] = document.querySelector(`body > div.container > form > table:nth-child(${i}) > tbody > tr > td > table:nth-child(3) > tbody > tr:nth-child(11) > td:nth-child(2)`).textContent.trim();
                if (document.querySelector(`body > div.container > form > table:nth-child(${i}) > tbody > tr > td > table:nth-child(3) > tbody > tr:nth-child(13) > td:nth-child(2)`)) {
                    raceInfo['comments'] = document.querySelector(`body > div.container > form > table:nth-child(${i}) > tbody > tr > td > table:nth-child(3) > tbody > tr:nth-child(13) > td:nth-child(2)`).textContent.trim();
                } else {
                    raceInfo['comments'] = document.querySelector(`body > div.container > form > table:nth-child(${i}) > tbody > tr > td > table:nth-child(3) > tbody > tr:nth-child(12) > td:nth-child(2)`).textContent.trim();
                }
            } else {
                raceInfo = null;
            }
            
            const activity: R2WActivity = {
                'stringDistance': stringDistance,
                'meterDistance': meterDistance,
                'stringTime': stringTime,
                'secondsTime': secondsTime,
                'r2wDate': r2wDate,
                'dateTime': isoDateTime,
                'timeOfDay': timeOfDay,
                'description': description,
                'activityType': activityType,
                'workoutSets': workoutSets,
                'raceInfo': raceInfo
            };

            activities.push(activity);
        }
    }

    return activities;
}

export function makeWorkoutString(workoutSets: WorkoutSet[]): string {
    let workoutString = 'Workout:\n\n';
    workoutSets.forEach(set => {
        workoutString += `Set ${set.setNum}: ${set.numReps} x ${set.distance} @ ${set.goal}\n${set.actual}\nRep rest ${set.repRest}${set.setRest ? ', Set rest ' + set.setRest : '' } \n\n`;
    });
    return workoutString;
}

export function makeRaceInfoString(raceInfo: RaceInfo): string {
    return `Race: ${raceInfo.raceName}\nDistance: ${raceInfo.distance}\nTime: ${raceInfo.time}\nSplits: ${raceInfo.splits}\nPlace: ${raceInfo.place}\nRace Description: ${raceInfo.comments}`;
}
