export const DAYS: string[] = ["Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota", "Neděle"]
export const LANGUAGES: string[] = ["čeština", "angličtina", "němčina", "ruština", "španělština", "francouzština"].sort()

export enum DataFormType {
    Patient = "PATIENT",
    Doctor = "DOCTOR",
    Reservation = "RESERVATION",
    Invalid = "INVALID"
}

export const RESERVATION_INTERVAL_BOUNDS: number[] = [5, 20]

export const validateNumbers = {pattern: {value:/^\d+$|^$/, message: "Input must be only numeric"}}
export const validateUrl = {
    pattern: {
        value: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$/,
        message: "Input must be valid URL"
    }
}

// key for choosing values: value | 60 (to avoid hours overflows) && value >= 10 (sufficiently big)
export const INTERVALS = [10, 15, 20, 30, 60].map((val) => {
    return {id: val, title: val}
})
