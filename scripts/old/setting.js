//-----------設定區-------------

//簡易防刷系統
var SET_COOLTIME = 40 //設定發訊息冷卻時間(遊戲刻)
var SET_MSGLONG = 60 //設定最大訊息字數

//稱號系統
var OpenNameTagCommand = true //是否開啟稱號系統指令，若不開則以下皆失效
var SET_CANHASTAGS = 1 //設定最大可擁有稱號數量，手動 /tag add api-tag-稱號 不會記入計算
var SET_ISLIMIT = false //設定是否開啟限制模式(true,false)，開啟後需要nametager標籤才能使用-addtag和-removetag指令

//玩家互傳tpa系統
var OpenTpaCommand = false //開啟或關閉

//------------------------------

export {SET_COOLTIME,SET_MSGLONG,OpenNameTagCommand,SET_CANHASTAGS,SET_ISLIMIT,OpenTpaCommand}