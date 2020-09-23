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