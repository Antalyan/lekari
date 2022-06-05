import {COUNTRIES} from "./Countries";

export function findSpecializationName(id: number) {
    return SPECIALIZATIONS[id - 1]
}

export function findSpecializationIndex(name: string) {
    for (let i = 0; i < SPECIALIZATIONS.length; i++) {
        if (SPECIALIZATIONS[i] == name) {
            return i + 1;
        }
    }
    return -1;
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
