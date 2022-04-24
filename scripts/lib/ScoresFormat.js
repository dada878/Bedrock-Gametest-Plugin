import * as base64 from "./base64"
import { log } from "./GameLibrary";

var SCORES_DECODE_CHAR = {
    'A': '11', 'B': '12', 'C': '13', 'D': '14', 'E': '15', 'F': '16', 'G': '17', 'H': '18', 'I': '19',
    'J': '20', 'K': '21', 'L': '22', 'M': '23', 'N': '24', 'O': '25', 'P': '26', 'Q': '27',
    'R': '28', 'S': '29', 'T': '30', 'U': '31', 'V': '32', 'W': '33', 'X': '34', 'Y': '35',
    'Z': '36', 'a': '37', 'b': '38', 'c': '39', 'd': '40', 'e': '41', 'f': '42', 'g': '43',
    'h': '44', 'i': '45', 'j': '46', 'k': '47', 'l': '48', 'm': '49', 'n': '50', 'o': '51',
    'p': '52', 'q': '53', 'r': '54', 's': '55', 't': '56', 'u': '57', 'v': '58', 'w': '59',
    'x': '60', 'y': '61', 'z': '62', '0': '63', '1': '64', '2': '65', '3': '66', '4': '67',
    '5': '68', '6': '69', '7': '70', '8': '71', '9': '72', '+': '73', '/': '74', '=': '75',
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
    };

    return result;
};

export function decode(string) {

    string = string.toString();

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