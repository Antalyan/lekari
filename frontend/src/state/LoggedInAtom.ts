import { atom } from "recoil";
import {IGlobalProfileInfo} from "../components/Interfaces";
import {recoilPersist} from "recoil-persist";

const { persistAtom } = recoilPersist()

export const userAtom = atom<IGlobalProfileInfo>({
    key: "user",
    default: {},
    effects_UNSTABLE: [persistAtom],
});
