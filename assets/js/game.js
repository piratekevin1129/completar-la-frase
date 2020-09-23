var i = 0
var j = 0
var k = 0

function getRand(min, max) { 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function unorderArray(lon){
	while(unorder_array.length<lon){
		var n = getRand(1,lon)
		if(!unorder_array.includes(n)){
			unorder_array.push(n)
		}
	}
}

var game_width = 845
var game_height = 507

var palabra_move = getE('palabra-move')
var palabra_clicked = null
var palabra_clicked_rect = null
var espacios_coll = []
var frases_coll = []
var palabras_coll = []
var palabras_list = []
var palabras_fake = []
var posx_e = 0
var posy_e = 0
var unorder_array = []
var frase_cortada = []
var respuesta_cortada = []
var palabras_correctas = []

function setGame(){
	frase_cortada = global_data.frase.split(" ")
	respuesta_cortada = global_data.respuesta.split(" ")
	palabras_fake = global_data.otros
	//unorderArray(frase_cortada.length)
	//console.log(unorder_array)

	for(i = 0;i<frase_cortada.length;i++){
		var u = i

		var ee = document.createElement('div')
		ee.id = 'espacio'+u
		var h = ''
		if(frase_cortada[i].indexOf('__')!=-1){
			//es un espacio
			ee.setAttribute('onclick','clickEspacio('+i+')')
			ee.className = 'espacio-element espacio-element-empty'
			h+='<div class="espacio-palabra"><p>...</p></div><button class="espacio-eliminar" onclick="quitarPalabra(this)"></button>'
			ee.setAttribute('key','')
			var palabra_txt = respuesta_cortada[i]
			palabras_list.push(palabra_txt)

		}else{
			//no es espacio
			ee.className = 'espacio-element espacio-element-fixed'
			h+='<div class="espacio-palabra">'+'<p>'+frase_cortada[i]+'</p>'+'</div>'
			ee.setAttribute('key',frase_cortada[i])
		}
		ee.setAttribute('ind',u)
		
		ee.setAttribute('value','')
		
		ee.innerHTML = h
		getE('espacios-wrap').appendChild(ee)

		////////////////////////////////////
		
		espacios_coll.push(ee)
	}

	for(i = 0;i<palabras_fake.length;i++){
		palabras_list.push(palabras_fake[i])
	}

	unorderArray(palabras_list.length)
	for(i = 0;i<palabras_list.length;i++){
		var u = unorder_array[i]

		var pe = document.createElement('div')
		pe.className = 'palabra-element palabra_clicked'
		pe.id = 'palabra'+u
		pe.setAttribute('ind',u)
		if(!ismobile){
			pe.setAttribute('onmousedown','downPalabra(this,event)')
		}else{
			pe.setAttribute('onclick','clickPalabra('+u+')')
		}
		pe.setAttribute('key',palabras_list[u-1])
		pe.innerHTML = '<p>'+palabras_list[u-1]+'</p>'
		getE('palabras-wrap').appendChild(pe)

		palabras_coll.push(pe)
	}

	for(i = 0;i<frase_cortada.length;i++){
		if(frase_cortada[i].indexOf('__')!=-1){
			//este es el espacio
			var word = respuesta_cortada[i]
			for(j = 0;j<palabras_coll.length;j++){
				if(palabras_coll[j].getAttribute('key')==word){
					//esta es
					palabras_correctas.push({pe:palabras_coll[j],ee:getE('espacio'+i)})
				}
			}
		}
	}
}

function clickPalabra(idname){
	//console.log("click palabra")
	var palabra_div = getE('palabra'+idname)
	drag_mp3.currentTime = 0
	drag_mp3.play()

	if(palabra_clicked!=null){
		//ya hay una clickeada, pongamola normal
		palabra_clicked.classList.remove('palabra_selected')
		palabra_clicked.classList.add('palabra_sola')
	}

	palabra_clicked = palabra_div
	palabra_clicked_rect = {
		width:palabra_div.offsetWidth,
		height:palabra_div.offsetHeight
	}
	
	palabra_clicked.classList.remove('palabra_sola')
	palabra_clicked.classList.add('palabra_selected')

	//poner espacios alumbrando, menos los ocupados
	for(i = 0;i<espacios_coll.length;i++){
		var clase_actual = espacios_coll[i].className
		if(clase_actual.indexOf('empty')!=-1){
			espacios_coll[i].classList.add('espacio-element-active')
		}
	}
}
function clickEspacio(idname){
	//comprobar que no este ocupado ya
	var toca_espacio = -1
	var clase_actual = espacios_coll[idname].className
	if(clase_actual.indexOf('empty')!=-1){
		toca_espacio = idname
	}

	if(toca_espacio!=-1){
		if(palabra_clicked==null||palabra_clicked==undefined){
			setModal({
				msg:'Selecciona una palabra para ubicar en este espacio',
				close:true,
				autoclose:4000
			})
		}else{
			//quitar alumbraciones
			for(i = 0;i<espacios_coll.length;i++){
				espacios_coll[i].classList.remove('espacio-element-active')
			}

			espacios_coll[toca_espacio].classList.remove('espacio-element-empty')
			espacios_coll[toca_espacio].classList.add('espacio-element-occuped')
			espacios_coll[toca_espacio].setAttribute('key',palabra_clicked.getAttribute('key'))
			espacios_coll[toca_espacio].setAttribute('value',palabra_clicked.getAttribute('ind'))
			//quitar onclick
			espacios_coll[toca_espacio].removeAttribute('onclick')

			var texto = espacios_coll[toca_espacio].getElementsByClassName('espacio-palabra')[0]
			texto.innerHTML = palabra_clicked.innerHTML

			palabra_clicked.classList.remove('palabra_selected')
			palabra_clicked.classList.add('palabra_clicked')
			palabra_clicked = null
			palabra_clicked_rect = null
		}
	}else{
		//ocupado
		console.log("ocupado")
	}
}

function downPalabra(palabra_div,e){
	drag_mp3.currentTime = 0
	drag_mp3.play()
	window.addEventListener('mousemove',movePalabra,false)
	window.addEventListener('mouseup',upPalabra,false)

	palabra_clicked = palabra_div
	palabra_clicked_rect = {
		width:palabra_div.offsetWidth,
		height:palabra_div.offsetHeight
	}
	palabra_move.innerHTML = palabra_clicked.innerHTML
	palabra_clicked.classList.remove('palabra_sola')
	palabra_clicked.classList.add('palabra_clicked')	

	posx_e = e.pageX
	posy_e = e.pageY
	palabra_move.style.left = (posx_e-(palabra_clicked_rect.width/2))+'px'
	palabra_move.style.top = (posy_e-(palabra_clicked_rect.height/2))+'px'
	palabra_move.className = 'palabra-move-on'

	//poner espacios alumbrando, menos los ocupados
	for(i = 0;i<espacios_coll.length;i++){
		var clase_actual = espacios_coll[i].className
		if(clase_actual.indexOf('empty')!=-1){
			espacios_coll[i].classList.add('espacio-element-active')
		}
	}
}
function movePalabra(e){
	posx_e = e.pageX
	posy_e = e.pageY
	palabra_move.style.left = (posx_e-(palabra_clicked_rect.width/2))+'px'
	palabra_move.style.top = (posy_e-(palabra_clicked_rect.height/2))+'px'
}
function upPalabra(e){
	window.removeEventListener('mousemove',movePalabra,false)
	window.removeEventListener('mouseup',upPalabra,false)

	//quitar alumbraciones
	for(i = 0;i<espacios_coll.length;i++){
		espacios_coll[i].classList.remove('espacio-element-active')
	}

	palabra_move.className = 'palabra-move-off'

	var toca_espacio = -1
	//detectar colision con espacios
	for(i = 0;i<espacios_coll.length;i++){
		var rect_espacio = espacios_coll[i].getBoundingClientRect()
		if(
			posx_e>rect_espacio.left&&posx_e<(rect_espacio.left+espacios_coll[i].offsetWidth)&&
			posy_e>rect_espacio.top&&posy_e<(rect_espacio.top+espacios_coll[i].offsetHeight)
		){
			//mirar que no esté ocupado ya
			var clase_actual = espacios_coll[i].className
			if(clase_actual.indexOf('empty')!=-1){
				toca_espacio = i
			}
		}
	}

	if(toca_espacio!=-1){
		espacios_coll[toca_espacio].classList.remove('espacio-element-empty')
		espacios_coll[toca_espacio].classList.add('espacio-element-occuped')
		espacios_coll[toca_espacio].setAttribute('key',palabra_clicked.getAttribute('key'))
		espacios_coll[toca_espacio].setAttribute('value',palabra_clicked.getAttribute('ind'))

		var texto = espacios_coll[toca_espacio].getElementsByClassName('espacio-palabra')[0]
		texto.innerHTML = palabra_clicked.innerHTML
	}else{
		palabra_clicked.classList.remove('palabra_clicked')
		palabra_clicked.classList.add('palabra_sola')
	}
	palabra_clicked = null
	palabra_clicked_rect = null
}

var animacion_quitar_palabra = null //funcion para switchear attribute onclick en responsive
function quitarPalabra(btn,s){
	if(s==null||s==undefined){
		remove_mp3.play()
	}
	
	var padre = btn.parentNode
	var ind = padre.getAttribute('ind')
	var key = padre.getAttribute('key')
	var value = padre.getAttribute('value')

	getE('palabra'+value).classList.remove('palabra_clicked')
	getE('palabra'+value).classList.add('palabra_sola')

	padre.classList.remove('espacio-element-occuped')
	padre.classList.add('espacio-element-empty')
	padre.setAttribute('key','')
	padre.setAttribute('value','')

	if(ismobile){
		if(s==null||s==undefined){
			//quitando manualmente
			animacion_quitar_palabra = setTimeout(function(){
				clearTimeout(animacion_quitar_palabra)
				animacion_quitar_palabra = null

				//poner de nuevo el onclick
				padre.setAttribute('onclick','clickEspacio('+ind+')')
			},50)
		}else{
			//quitando directamete
			//poner de nuevo el onclick
			padre.setAttribute('onclick','clickEspacio('+ind+')')
		}
	}
	var texto = padre.getElementsByClassName('espacio-palabra')[0]
	texto.innerHTML = ''
}

var intentos = 0
var animacion_palabra_correcta = null
var animacion_word_correcta = null

function comprobarJuego(){
	var frase = ""
	
	for(i = 0;i<espacios_coll.length;i++){
		frase+=espacios_coll[i].getAttribute('key')
	}
	
	var esta = false
	//console.log(frase)

	var frase_corta = String(global_data.respuesta).replace(new RegExp(" ","g"), "")
	
	if(frase==frase_corta){
		esta = true
	}

	if(esta){
		//alert("bien, ganaste")
		$("html, body").animate({ scrollTop: $('#tra_body').offset().top }, 500);
		pararReloj()
		getE('espacios-cont').classList.add('frase-wrap-win')
		setModal({
			msg:'<span>'+titulo_final+',</span> '+mensaje_final+'.<br />',
			icon:'success',
			close:false,
			continue:true,
			action:'nextTema',
			label:'Continuar',
			delay:1500
		})
	}else{
		var stars = getE('tra_estrellas').getElementsByClassName('tra_estrella')
		//quitar estrella
		stars[intentos].classList.remove('tra_estrella_off')
		stars[intentos].classList.add('tra_estrella_on')
		incorrect_mp3.currentTime = 0
		incorrect_mp3.play()
		
		intentos++
		$("html, body").animate({ scrollTop: $('#tra_body').offset().top }, 500);
		if(intentos==3){
			//alert("perdiste")
			//mostrar la correcta
			pararReloj()
			getE('comprobar-btn').disabled = true
			//getE('frase-correcta-txt').className = 'frase-correcta-txt-show'

			if(!ismobile){
				acomodarPalabra(0)	
			}else{
				j = 0

				animacion_palabra_correcta = setInterval(function(){
					if(j==palabras_correctas.length){
						setModal({msg:'<span>'+titulo_final_mal+'</span> '+mensaje_final_mal+'<br />Haz clic en el botón <span>Reiniciar</span> para jugar de nuevo',close:false})
					}else{
						var espacio_e = palabras_correctas[j].ee
						var palabra_d = palabras_correctas[j].pe

						palabra_d.classList.remove('palabra_sola')
						palabra_d.classList.add('palabra_clicked')

						over_mp3.currentTime = 0
						over_mp3.play()

						espacio_e.classList.remove('espacio-element-empty')
						espacio_e.classList.add('espacio-element-occuped')
						espacio_e.setAttribute('key',palabra_d.getAttribute('key'))
						espacio_e.setAttribute('value',palabra_d.getAttribute('ind'))

						var texto = espacio_e.getElementsByClassName('espacio-palabra')[0]
						texto.innerHTML = palabra_d.innerHTML
						
						j++
					}	
				},300)
			}
			
		}else{
			//dejar las buenas y quitar las malas
			for(i = 0;i<espacios_coll.length;i++){
				var key = espacios_coll[i].getAttribute('key')
				if(key!=''){
					if(key==respuesta_cortada[i]){
						//este esta bueno
					}else{
						//quitar este
						var btn = espacios_coll[i].getElementsByClassName('espacio-eliminar')[0]
						quitarPalabra(btn,true)
					}
				}
			}
		}
	}
}

function acomodarPalabra(p){
	if(p==palabras_correctas.length){
		setModal({msg:'<span>'+titulo_final_mal+'</span> '+mensaje_final_mal+'<br />Haz clic en el botón <span>Reiniciar</span> para jugar de nuevo',close:false})
	}else{
		var espacio_e = palabras_correctas[p].ee
		var rect_espacio = espacio_e.getBoundingClientRect()
		var palabra_d = palabras_correctas[p].pe
		var rect_palabra = palabra_d.getBoundingClientRect()

		palabra_d.classList.remove('palabra_sola')
		palabra_d.classList.add('palabra_clicked')
		getE('palabra-move').innerHTML = palabra_d.innerHTML
		getE('palabra-move').style.left = rect_palabra.left+'px'
		getE('palabra-move').style.top = rect_palabra.top+'px'
		getE('palabra-move').className = 'palabra-move-on'
		
		animacion_word_correcta = setTimeout(function(){
			clearTimeout(animacion_word_correcta)
			animacion_word_correcta = null

			getE('palabra-move').classList.add('palabra-move-moving')
			getE('palabra-move').style.left = rect_espacio.left+'px'
			getE('palabra-move').style.top = rect_espacio.top+'px'

			over_mp3.currentTime = 0
			over_mp3.play()
			animacion_word_correcta = setTimeout(function(){
				clearTimeout(animacion_word_correcta)
				animacion_word_correcta = null

				espacio_e.classList.remove('espacio-element-empty')
				espacio_e.classList.add('espacio-element-occuped')
				espacio_e.setAttribute('key',palabra_d.getAttribute('key'))
				espacio_e.setAttribute('value',palabra_d.getAttribute('ind'))

				var texto = espacio_e.getElementsByClassName('espacio-palabra')[0]
				texto.innerHTML = palabra_d.innerHTML
				getE('palabra-move').classList.remove('palabra-move-moving')
				getE('palabra-move').className = 'palabra-move-off'

				p = (p+1)
				acomodarPalabra(p)
			},500)
		},50)
	}	
}

/**********MODALES***********/
var animacion_modal_delay = null
var animacion_modal_autoclose = null
function setModal(params){
	var msg = params.msg
	var icon = 'error'
	var close = true
	if(params.icon!=null&&params.icon!=undefined){
		icon = params.icon
	}
	if(params.close!=null&&params.close!=undefined){
		close = params.close
	}

	if(icon=='success'){
		document.getElementById('modal-icon-msg').className = 'modal-icon-msg-success'
	}else{
		document.getElementById('modal-icon-msg').className = 'modal-icon-msg-error'
	}
	if(close){
		document.getElementById('modal-close-msg').style.visibility = 'visible'
	}else{
		document.getElementById('modal-close-msg').style.visibility = 'hidden'
	}

	var continue_btn = ''
	var msg_full = '<p>'+msg+'</p>'
	if(params.continue!=null&&params.continue!=undefined){
		continue_btn+='<button class="modal-continue-btn" onmouseover="overContinue()" onclick="'+params.action+'()">'+params.label+'</button>'
		msg_full+=continue_btn
	}

	document.getElementById('modal-text-msg').innerHTML = msg_full

	
	victoria_mp3.play()

	if(params.delay!=null&&params.delay!=undefined){
		animacion_modal_delay = setTimeout(function(){
			clearTimeout(animacion_modal_delay)
			animacion_modal_delay = null

			document.getElementById('modal').className = 'modal-on'
		},params.delay)
	}else{
		document.getElementById('modal').className = 'modal-on'
	}

	if(params.autoclose!=null&&params.autoclose!=undefined){
		animacion_modal_autoclose = setTimeout(function(){
			clearTimeout(animacion_modal_autoclose)
			animacion_modal_autoclose = null

			unsetModal()
		},params.autoclose)
	}
}

function overContinue(){
	button_mp3.play()
}

function unsetModal(){
	if(animacion_modal_delay!=null){
		clearTimeout(animacion_modal_delay)
		animacion_modal_delay = null
	}
	if(animacion_modal_autoclose!=null){
		clearTimeout(animacion_modal_autoclose)
		animacion_modal_autoclose = null
	}
	document.getElementById('modal').className = 'modal-off'
}

function openInstrucciones(){
	instrucciones.className = 'instrucciones-on'
}

function closeInstrucciones(){
	if(first_instrucciones){
		first_instrucciones = false
		
		underground_mp3.play()
		setTimer()
		j = 0
		animacion_palabra_correcta = setInterval(function(){
			if(j==palabras_coll.length){
				clearInterval(animacion_palabra_correcta)
				animacion_palabra_correcta = null
			}else{
				palabras_coll[j].classList.remove('palabra_clicked')
				palabras_coll[j].classList.add('palabra_sola')
				j++
			}
		},100)
	}
	instrucciones.className = 'instrucciones-off'
}

var first_instrucciones = true

function setTimer(){
	iniciarReloj()
}

function getE(idname){
	return document.getElementById(idname)
}

function reloadGame(){

}

function nextTema(){

}