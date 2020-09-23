var instrucciones_inst_txt = 'Arrastra cada palabra al espacio que consideres adecuado para descubrir la frase oculta'
var instrucciones_gif_txt = '<div class="demo-row2"><div class="demo-col-4"></div><div class="demo-col-5"></div><div class="demo-col-6"></div></div><div class="demo-row1"><div class="demo-col-1">xxx</div><div class="demo-col-2">xxx</div><div class="demo-col-3">xxx</div></div><div class="demo-cursor"></div>'

var ismobile = false
var isresponsive = false
var actual_dimension = 1
var tra_contenedor = document.getElementById('tra_contenedor')

function prepareWindow(){
    ismobile = isMobileDevice()
    
    if(window.innerWidth>=845){
        actual_dimension = 1
        
        window.top.postMessage({'completado': false, 'alto': game_height}, '*' );
    }else if(window.innerWidth>=710&&window.innerWidth<845){
        actual_dimension = 2
        game_width = 710
        game_height = 426
        
        window.top.postMessage({'completado': false, 'alto': game_height}, '*' );
    }else if(window.innerWidth>=530&&window.innerWidth<710){
        actual_dimension = 3
        game_width = 530
        game_height = 600
        ismobile = true
        isresponsive = true
       
        window.top.postMessage({'completado': false, 'alto': game_height}, '*' );
    }else{
        actual_dimension = 4
        game_width = window.innerWidth
        game_height = 700
        ismobile = true
        isresponsive = true

        window.top.postMessage({'completado': false, 'alto': game_height}, '*' );
    }

    if(ismobile){
    	instrucciones_inst_txt = 'Toca una palabra y luego toca el espacio que consideres correcto para descubrir la frase oculta'
    	instrucciones_gif_txt = '<div class="demo-row2"><div class="mobi-col-4"></div><div class="mobi-col-5"></div><div class="mobi-col-6"></div></div><div class="demo-row1"><div class="mobi-col-1">xxx</div><div class="mobi-col-2">xxx</div><div class="mobi-col-3">xxx</div></div><div class="demo-finger"></div>'
    }

    getE('instrucciones_inst').innerHTML = instrucciones_inst_txt
    getE('instrucciones-gif').innerHTML = instrucciones_gif_txt
}


function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};