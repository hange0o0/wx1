class WXDB{
    public static updata(dbName,data,fun?){
        DEBUG && console.log('update-'+dbName,data)
        var wx = window['wx'];
        const db = wx.cloud.database();
        db.collection(dbName).doc(UM.dbid).update({
            data: data,
            success: (res)=>{
                DEBUG && console.log(res)
                fun && fun();
            },
        })
    }
}