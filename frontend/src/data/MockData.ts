import {IBasicDoctor} from "../components/Interfaces";

export const DOCTORS: IBasicDoctor[] = [
    {
        "name": "MUDr. Adam Ananas",
        "specialization": "Neurolog",
        "location": "Brno",
        "actuality": "Jsem na dovolené",
        "id": 1,
        "rating": 5
    },
    {
        "name": "Beata Boubelatá",
        "specialization": "Kardiolog",
        "location": "Praha",
        "actuality": "",
        "id": 2
    },
    {
        "name": "MVDr. Cecil Cukrový",
        "specialization": "Vlčí zvěrolékař",
        "location": "Nové Město na Moravě",
        "actuality": "Přijímám nové vlky! Dokud mě nesní...",
        "id": 3,
        "rating": 2.5
    }
]

export const RESERVATION_TIMES = [{id: 1, title: "12:00"}, {id: 2, title: "12:30"}, {id: 3, title: "13:00"}, {id: 4, title: "13:45"},
    {id: 5, title: "14:00"}, {id: 6, title: "15:30"}, {id: 7, title: "16:00"}, {id: 8, title: "16:45"}]

export const INTERVALS = [10, 15, 20, 30, 60].map((val, index) => {return {id: index, title: val}})

