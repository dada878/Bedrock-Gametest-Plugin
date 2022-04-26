import { world } from "mojang-minecraft";
import * as ui from 'mojang-minecraft-ui';
import { cmd, logfor } from '../lib/GameLibrary.js';
import { WorldDB } from "../lib/WorldDB.js";

var db = new WorldDB("plugin_database");


/**
 * 
 * @param {Minecraft.Player} player 
 * @returns 
 */
export function HomeSystem(player) {
    if (db.getData("home") == 1) { return logfor(player, ">> §c無法使用，此功能已被禁用") };

    let tags = player.getTags()

    let fm = new ui.ActionFormData();
    fm.title("Home家園系統")
    fm.body("設定Home，並且快速傳送回家吧")
    fm.button('§l§5新增Home', 'textures/ui/color_plus.png')
    fm.button('§l§4刪除Home', 'textures/ui/icon_trash.png')

    for (let i in tags) {
        if (tags[i].startsWith('{"Home":{')) {
            let homeData = JSON.parse(tags[i])
            let homeName = homeData['Home']['Name']
            let homePos = homeData['Home']['Pos']
            fm.button(`§1${homeName}\n§r§9${homePos}`)
        }
    }

    fm.show(player).then(response => {
        if (!response) { return }
        if (response.selection == 0) {
            if (player.dimension != world.getDimension("overworld")) {
                cmd(`playsound note.pling "${player.nameTag}"`)
                logfor(player.nameTag, `>> §c你只能在主世界創建Home`)
                return
            }
            else {

                let fm = new ui.ModalFormData()

                fm.title("Home家園系統");
                fm.textField("輸入Home名稱", "MyHome")

                fm.show(player).then(response => {
                    if (!response) { return }
                    let homes = getHomes(player)
                    if (response.formValues[0] == "") {
                        cmd(`playsound note.pling "${player.nameTag}"`)
                        logfor(player.nameTag, `>> §c請輸入Home名稱`)
                        return
                    }
                    if (homes["Homes"].includes(response.formValues[0])) {
                        cmd(`playsound note.pling "${player.nameTag}"`)
                        logfor(player.nameTag, `>> §c你已經創過名為 §e${response.formValues[0]} §c的Home了`)
                        return
                    }
                    let pos = player.location
                    let jsonDB = {
                        'Home': {
                            'Name': response.formValues[0],
                            'Pos': `${Math.trunc(pos.x)} ${Math.trunc(pos.y)} ${Math.trunc(pos.z)}`
                        }
                    }
                    player.addTag(JSON.stringify(jsonDB))
                    cmd(`playsound random.orb "${player.nameTag}"`)
                    logfor(player.nameTag, `>> §a成功設定家園點 §b${response.formValues[0]}`)

                })

            }
        }
        else if (response.selection == 1) {
            let fm = new ui.ModalFormData()

            let homes = getHomes(player)

            fm.title("Home家園系統");
            fm.dropdown("選擇要刪除的Home", homes['Homes'])

            if (!homes['Homes'].length) {
                logfor(player.nameTag, `>> §c你沒有設定任何的Home`)
                return
            }

            fm.show(player).then(response => {
                if (!response) { return }
                let findJsonDB = {
                    'Home': {
                        'Name': homes['Homes'][response.formValues[0]],
                        'Pos': homes['Pos'][response.formValues[0]]
                    }
                }
                player.removeTag(JSON.stringify(findJsonDB))
                cmd(`playsound random.orb "${player.nameTag}"`)
                logfor(player.nameTag, `>> §e成功移除家園點 §b${homes['Homes'][response.formValues[0]]}`)

            })
        }
        else {
            let homes = getHomes(player)

            cmd(`tp "${player.nameTag}" ${homes['Pos'][response.selection - 2]}`)
            cmd(`playsound random.orb "${player.nameTag}"`)
            logfor(player.nameTag, `>> §a已傳送到Home點 §b${homes['Homes'][response.selection - 2]}`)
        }
    });
}

function getHomes(player) {
    let tags = player.getTags()
    let homes = { "Homes": [], "Pos": [] }
    for (let i in tags) {
        if (tags[i].startsWith('{"Home":{')) {
            let homeData = JSON.parse(tags[i])
            homes["Homes"].push(homeData['Home']['Name'])
            homes["Pos"].push(homeData['Home']['Pos'])
        }
    }
    return homes
}