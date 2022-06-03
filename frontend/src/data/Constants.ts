export const DAYS: string[] = ["Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota", "Neděle"]
export const LANGUAGES: string[] = ["čeština", "angličtina", "němčina", "ruština", "španělština", "francouzština"].sort()

export enum DataFormType {
    Patient = "PATIENT",
    Doctor = "DOCTOR",
    Reservation = "RESERVATION",
    Invalid = "INVALID"
}

export const RESERVATION_INTERVAL_BOUNDS: number[] = [4, 20]

export const validateNumbers = {pattern: {value: /^[0-9]*$/, message: "Input must be only numeric"}}
export const validateUrl = {
    pattern: {
        value: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$/,
        message: "Input must be valid URL"
    }
}

export const SPECIALIZATIONS = [
    "Akupunktura",
    "Alergolog - imunolog",
    "Alternativní medicína",
    "Anesteziologie a resuscitace",
    "Dentální hygiena",
    "Diabetolog",
    "Endokrinolog",
    "Flebologie - Cévní chirurgie, žilní lékař",
    "Gastroenterolog",
    "Geriatrie",
    "Gynekologie",
    "Hematolog a Transfuziolog",
    "Homeopatie",
    "Chirurg",
    "Infekční, cestovní medicína, očkování",
    "Interní ambulance",
    "Kardiolog",
    "Kožní lékař, dermatovenerolog, dermatolog",
    "Logopedie",
    "Mamografie",
    "Nefrolog",
    "Neurochirurg",
    "Neurolog",
    "Oční lékař - oftalmologie",
    "Odběr krve",
    "Onkolog",
    "Optometrista",
    "ORL - ušní, nosní, krční",
    "Ortodoncie - rovnátka",
    "Ortoped",
    "Patolog",
    "Plastická chirurgie",
    "Plicní ambulance",
    "Praktický lékař pro děti a dorost - Pediatr",
    "Praktický lékař pro dospělé",
    "Psychiatr",
    "Psycholog",
    "Rehabilitace, fyzioterapie",
    "Reprodukční medicína",
    "Revmatolog",
    "Sexuolog",
    "Stomatologie - zubní ambulance, zubař",
    "Traumatolog",
    "Ultrazvuk, Sonografie",
    "Urolog - urologie",
    "Výživové poradenství"
]


