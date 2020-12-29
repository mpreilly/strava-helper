export interface R2WActivity {
    "stringDistance": string,
    "meterDistance": number,
    "stringTime": string,
    "secondsTime": number,
    "r2wDate": string,
    "dateTime": string,
    "timeOfDay": string,
    "description": string,
    "activityType": string,
    "workoutSets": WorkoutSet[],
    "raceInfo": RaceInfo
}

// these will all just be used as part of description, so we'll keep them as strings.
export interface WorkoutSet {
    "setNum": string,
    "numReps": string,
    "distance": string,
    "goal": string,
    "actual": string,
    "repRest": string,
    "setRest": string
}

// also used only for description, thus kept as strings.
export interface RaceInfo {
    "raceName": string,
    "distance": string,
    "time": string,
    "splits": string,
    "place": string,
    "comments": string
}