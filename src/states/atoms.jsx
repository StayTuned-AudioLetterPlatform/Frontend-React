import {atom} from 'recoil';

export const expireTime = atom({
    key: 'expireTime',
    default: {},
});

export const user = atom({
    key: 'user',
    default: {},
});

export const records = atom({
    key: 'records',
    default: [],
})