function loadImage(data){
    var img = new Image()
    img.onload = function(){
        img.onerror = null
        img.onload = null
        data.callBack()
    }
    img.onerror = function(){
        console.log("error cargando la imagen "+img.url)
        img.onerror = null
        img.onload = null
        data.callBack()
    }
    img.src = data.url
}

/////////////////////////////AUDIO/////////////////////////
function loadAudio(data){
    var url = data.src

    var audio_fx = null
    audio_fx = document.createElement('audio')
    audio_fx.setAttribute('src',url)
    audio_fx.load()
    audio_fx.addEventListener('loadeddata',function(){
        //alert("cargo")
        data.callBack(audio_fx)
    })
    audio_fx.addEventListener('error',function(){
        data.callBack(null)
    })
}

///////////////////////////TIMER///////////////////////////
function getTimeText(secs,flag){
    var minutos = 0
    var horas = 0
    var seconds = 0

    var segundos_txt = ""
    var horas_txt = ""
    var minutos_txt = ""

    if(secs<60){
        horas = 0
        minutos = 0
        seconds = secs
    }else{
        minutos = parseInt(secs/60)
        seconds = secs-(minutos*60)

        if(minutos>=60){
            horas = parseInt(minutos/60)
            minutos = minutos-(horas*60)
        }
    }

    if(horas>=0&&horas<=9){
        horas_txt = "0"+horas
    }else{
        horas_txt = horas
    }
    if(minutos>=0&&minutos<=9){
        minutos_txt = "0"+minutos
    }else{
        minutos_txt = minutos
    }
    if(seconds>=0&&seconds<=9){
        segundos_txt = "0"+seconds
    }else{
        segundos_txt = seconds
    }

    if(flag!=null&&flag!=undefined){
        if(flag){
            return minutos_txt+':'+segundos_txt
        }else{
            return horas_txt+':'+minutos_txt+':'+segundos_txt
        }
    }else{
        return horas_txt+':'+minutos_txt+':'+segundos_txt
    }    
}

var time_scorm = 0
var animacion_reloj = null
function iniciarReloj(){
    time_scorm = 0
    document.getElementById('tra_tiempo_txt').innerHTML = '00:00'
    animacion_reloj = setInterval(animacionReloj,1000)
}
function pararReloj(){
    clearInterval(animacion_reloj)
}
function animacionReloj(){
    time_scorm+=1
    document.getElementById('tra_tiempo_txt').innerHTML = getTimeText(time_scorm,true)
}
function getRelojTime(){
    return time_scorm
}