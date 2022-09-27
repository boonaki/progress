function hideProfileSettings(){
    // document.querySelector('body').classList.remove('stop-scroll')
    document.querySelector('.profile-settings').classList.remove('hide')
}

function showProfileSettings(){
    // document.querySelector('body').classList.add('stop-scroll')
    document.querySelector('.profile-settings').classList.add('hide')
}

function showCreator(){
    
    document.querySelector("#reel-form-container").style.display = "flex"
}

function hideCreator(){
    document.querySelector("#reel-form-container").style.display = "none"
}

function showCaptureForm(id){
    let btns = document.getElementsByClassName('entry-choice')
    for(let j = 0; j < btns.length; j++){
        btns[j].classList.remove('enabled')
    }
    document.getElementById(id).classList.add('enabled')

    id = id.split('-')[2]
    let forms = document.getElementsByClassName("capture-form-container")
    for(let i = 0 ; i < forms.length; i++){
        forms[i].classList.add('hidden')
    }
    document.getElementById(`add-capture-${id}`).classList.remove('hidden')
}