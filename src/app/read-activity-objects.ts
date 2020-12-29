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

            const tokens = result.textContent.trim().split(" ");
            let stringDistance = tokens[0] + " " + tokens[1]

            let meterDistance: number;
            if (tokens[1] === "Meters") {
                meterDistance = +tokens[0];
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
                'dateTime': '',
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