import {atom, selector} from "recoil";
import {IGlobalProfileInfo} from "../utils/Interfaces";
import {recoilPersist} from "recoil-persist";

const { persistAtom } = recoilPersist()

export const userAtom = atom<IGlobalProfileInfo>({
    key: "user",
    default: {},
    effects_UNSTABLE: [persistAtom],
});

// export const isDoctorState = selector({
//     key: 'isDoctor',
//     get: ({get}) => {
//         const user = get(userAtom);
//         return user.id != null;
//     },
// });
