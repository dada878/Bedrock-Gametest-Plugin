import * as base64 from "./base64"
import { log } from "./GameLibrary";

var SCORES_DECODE_CHAR = {
    'A': '01', 'B': '02', 'C': '03', 'D': '04', 'E': '05', 'F': '06', 'G': '07', 'H': '08', 'I': '09',
    'J': '10', 'K': '11', 'L': '12', 'M': '13', 'N': '14', 'O': '15', 'P': '16', 'Q': '17',
    'R': '18', 'S': '19', 'T': '20', 'U': '21', 'V': '22', 'W': '23', 'X': '24', 'Y': '25',
    'Z': '26', 'a': '27', 'b': '28', 'c': '29', 'd': '30', 'e': '31', 'f': '32', 'g': '33',
    'h': '34', 'i': '35', 'j': '36', 'k': '37', 'l': '38', 'm': '39', 'n': '40', 'o': '41',
    'p': '42', 'q': '43', 'r': '44', 's': '45', 't': '46', 'u': '47', 'v': '48', 'w': '49',
    'x': '50', 'y': '51', 'z': '52', '0': '53', '1': '54', '2': '55', '3': '56', '4': '57',
    '5': '58', '6': '59', '7': '60', '8': '61', '9': '62', '+': '63', '/': '64', '=': '65',
};

var REVERSE_SCORES_DECODE_CHAR = {};
for (let i in SCORES_DECODE_CHAR) {
    const key = SCORES_DECODE_CHAR[i];

    REVERSE_SCORES_DECODE_CHAR[key] = i;
};

export function encode(string) {

    const origin = base64.encode(string);

    let result = "";

    for (let i in origin) {
        let char = SCORES_DECODE_CHAR[origin[i]];
        result += char;
    }

    return result;
};

export function decode(string) {

    let twoChars = [];
    let result = "";

    for (let i in string) {
        const listIndex = Math.trunc(i / 2);
        if (!twoChars[listIndex]) {
            twoChars[listIndex] = string[i];
        } else {
            twoChars[listIndex] += string[i];
        }
    }

    for (let i of twoChars) {
        result += REVERSE_SCORES_DECODE_CHAR[i];
    }

    return base64.decode(result);
}