import { cmd, log, logfor } from './lib/GameLibrary.js';
import { expdb, leveldb } from "./system/level.js";

function exp_define(level){
    return level ** 2 * 5
}

export const level_difine = [
    {
        level : 0,
        exp : 0,
        msg : ""
    },
    {
        level : 1,
        exp : exp_define(1),
        msg : "恭喜!您升到了§aLv.1"
    },
    {
        level : 2,
        exp : exp_define(2),
        msg : "恭喜!您升到了§aLv.2"
    },
    {
        level : 3,
        exp : exp_define(3),
        msg : "恭喜!您升到了§aLv.3"
    },
    {
        level : 4,
        exp : exp_define(4),
        msg : "恭喜!您升到了§aLv.4"
    },
    {
        level : 5,
        exp : exp_define(5),
        msg : "恭喜!您升到了§aLv.5"
    },
    {
        level : 6,
        exp : exp_define(6),
        msg : "恭喜!您升到了§aLv.6"
    },
    {
        level : 7,
        exp : exp_define(7),
        msg : "恭喜!您升到了§aLv.7"
    },
    {
        level : 8,
        exp : exp_define(8),
        msg : "恭喜!您升到了§aLv.8"
    },
    {
        level : 9,
        exp : exp_define(9),
        msg : "恭喜!您升到了§aLv.9"
    },
    {
        level : 10,
        exp : exp_define(10),
        msg : "恭喜!您升到了§aLv.10"
    },
    {
        level : 11,
        exp : exp_define(11),
        msg : "恭喜!您升到了§aLv.11"
    },
    {
        level : 12,
        exp : exp_define(12),
        msg : "恭喜!您升到了§aLv.12"
    },
    {
        level : 13,
        exp : exp_define(13),
        msg : "恭喜!您升到了§aLv.13"
    },
    {
        level : 14,
        exp : exp_define(14),
        msg : "恭喜!您升到了§aLv.14"
    },
    {
        level : 15,
        exp : exp_define(15),
        msg : "恭喜!您升到了§aLv.15"
    },
    {
        level : 16,
        exp : exp_define(16),
        msg : "恭喜!您升到了§aLv.16"
    },
    {
        level : 17,
        exp : exp_define(17),
        msg : "恭喜!您升到了§aLv.17"
    },
    {
        level : 18,
        exp : exp_define(18),
        msg : "恭喜!您升到了§aLv.18"
    },
    {
        level : 19,
        exp : exp_define(19),
        msg : "恭喜!您升到了§aLv.19"
    },
    {
        level : 20,
        exp : exp_define(20),
        msg : "恭喜!您升到了§aLv.20"
    },
    {
        level : 21,
        exp : exp_define(21),
        msg : "恭喜!您升到了§aLv.21"
    },
    {
        level : 22,
        exp : exp_define(22),
        msg : "恭喜!您升到了§aLv.22"
    },
    {
        level : 23,
        exp : exp_define(23),
        msg : "恭喜!您升到了§aLv.23"
    },
    {
        level : 24,
        exp : exp_define(24),
        msg : "恭喜!您升到了§aLv.24"
    },
    {
        level : 25,
        exp : exp_define(25),
        msg : "恭喜!您升到了§aLv.25"
    },
    {
        level : 26,
        exp : exp_define(26),
        msg : "恭喜!您升到了§aLv.26"
    },
    {
        level : 27,
        exp : exp_define(27),
        msg : "恭喜!您升到了§aLv.27"
    },
    {
        level : 28,
        exp : exp_define(28),
        msg : "恭喜!您升到了§aLv.28"
    },
    {
        level : 29,
        exp : exp_define(29),
        msg : "恭喜!您升到了§aLv.29"
    },
    {
        level : 30,
        exp : exp_define(29),
        msg : "恭喜!您升到了§aLv.28"
    },
    {
        level : 31,
        exp : exp_define(31),
        msg : "恭喜!您升到了§aLv.31"
    },
    {
        level : 32,
        exp : exp_define(32),
        msg : "恭喜!您升到了§aLv.32"
    },
    {
        level : 33,
        exp : exp_define(33),
        msg : "恭喜!您升到了§aLv.33"
    },
    {
        level : 34,
        exp : exp_define(34),
        msg : "恭喜!您升到了§aLv.34"
    },
    {
        level : 35,
        exp : exp_define(35),
        msg : "恭喜!您升到了§aLv.35"
    },
    {
        level : 36,
        exp : exp_define(36),
        msg : "恭喜!您升到了§aLv.36"
    },
    {
        level : 37,
        exp : exp_define(37),
        msg : "恭喜!您升到了§aLv.37"
    },
    {
        level : 38,
        exp : exp_define(38),
        msg : "恭喜!您升到了§aLv.38"
    },
    {
        level : 39,
        exp : exp_define(39),
        msg : "恭喜!您升到了§aLv.39"
    },
    {
        level : 40,
        exp : exp_define(40),
        msg : "恭喜!您升到了§aLv.40"
    },
    {
        level : 41,
        exp : exp_define(41),
        msg : "恭喜!您升到了§aLv.41"
    },
    {
        level : 42,
        exp : exp_define(42),
        msg : "恭喜!您升到了§aLv.42"
    },
    {
        level : 43,
        exp : exp_define(43),
        msg : "恭喜!您升到了§aLv.43"
    },
    {
        level : 44,
        exp : exp_define(44),
        msg : "恭喜!您升到了§aLv.44"
    },
    {
        level : 45,
        exp : exp_define(45),
        msg : "恭喜!您升到了§aLv.45"
    },
    {
        level : 46,
        exp : exp_define(46),
        msg : "恭喜!您升到了§aLv.46"
    },
    {
        level : 47,
        exp : exp_define(47),
        msg : "恭喜!您升到了§aLv.47"
    },
    {
        level : 48,
        exp : exp_define(49),
        msg : "恭喜!您升到了§aLv.1"
    },
    {
        level : 49,
        exp : exp_define(49),
        msg : "恭喜!您升到了§aLv.49"
    },
    {
        level : 50,
        exp : exp_define(50),
        msg : "恭喜!您升到了§aLv.50"
    },
]
