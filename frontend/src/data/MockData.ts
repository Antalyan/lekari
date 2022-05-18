import {IBasicDoctor, IReview} from "../components/Interfaces";

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
    },
]

export const REVIEWS: IReview[] = [
    {
        "name": "Dáda Dloubavá",
        "date": new Date("2019-01-16"),
        "rating": 3,
        "text": "Komora usiluje o to, aby zákonná úprava podmínek pro poskytování daňového poradenství umožňovala výkon činnosti daňového poradce způsobem, který jim vyhovuje a který si sami zvolí. Komora usiluje o zachování takového znění zákona o daňovém poradenství, které umožní fyzickým i právnickým osobám v rámci KDP podnikat bez dalších omezení a zasazuje se o poskytování daňového poradenství pouze oprávněnými subjekty. Komora sleduje vývoj v postavení daňových poradců v České republice i v zahraničí a usiluje o přenos pozitivních zkušeností ze zahraničí do organizace činnosti daňového poradenství v České republice.",
        "id": 1,
    },
    {
        "name": "Emil Eben",
        "date": new Date("2020-01-31"),
        "rating": 1.5,
        "text": "Nedodán :/",
        "id": 2,
    }
]

export const RESERVATION_TIMES = [{id: 1, title: "12:00"}, {id: 2, title: "12:30"}, {id: 3, title: "13:00"}, {
    id: 4,
    title: "13:45"
},
    {id: 5, title: "14:00"}, {id: 6, title: "15:30"}, {id: 7, title: "16:00"}, {id: 8, title: "16:45"}]

export const INTERVALS = [10, 15, 20, 30, 60].map((val, index) => {
    return {id: index, title: val}
})

export const specializations = ["Chirurg", "Praktik", "Zvěrolékař specializovaný na vlky"];
export const cities = ["Praha", "Brno", "Ostrava", "Žďár nad Sázavou"]
