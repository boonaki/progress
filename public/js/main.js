let search = document.querySelector('#all-search')
// search.addEventListener('change', changeSearch())

async function changeSearch(){
    console.log(search.value, 'search')
    let currentResults = await fetch(`/search?query=${search.value}`)
        .then(results => results.json())
        .then(results => {
            console.log(results)
            return {
                label: results.userName,
                value: results.profilePic,
                id: results._id
            }
        })
        .catch(err => console.log(err))
    console.log(currentResults)
}




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

function viewSettings(id){
    id = id.split('-')[1]
    console.log(id)
    let boxes = document.getElementsByClassName('post-settings-box')
    let selectBox = document.getElementById(`postsettingsbox-${id}`)
    if(selectBox.classList.contains('hidden')){
        for(let i = 0; i < boxes.length; i++){
            boxes[i].classList.add('hidden')
        }
        selectBox.classList.remove('hidden')
    }else{
        selectBox.classList.add('hidden')
    }
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

function showDelete(){
    let reels = document.getElementsByClassName('delete-reel')
    if(reels[0].classList.contains('hidden')){
        document.querySelector('#edit-reel-btn').innerHTML = 'cancel'
        for(let i = 0; i < reels.length; i++){
            reels[i].classList.remove('hidden')
        }
    }else{
        document.querySelector('#edit-reel-btn').innerHTML = 'edit reels'
        for(let i = 0; i < reels.length; i++){
            reels[i].classList.add('hidden')
        }
    }
}

function moveSelector(){
    let selector = document.querySelector('.selector')
    if(selector.classList.contains('foll-select')){
        selector.classList.remove('foll-select')
        if(document.querySelector('.feed-all').classList.contains('feed-select')){
            document.querySelector('.feed-all').classList.remove('feed-select')
            document.querySelector('.feed-inner').classList.add('feed-select')
        }
    }else{
        selector.classList.add('foll-select')
        if(document.querySelector('.feed-inner').classList.contains('feed-select')){
            document.querySelector('.feed-inner').classList.remove('feed-select')
            document.querySelector('.feed-all').classList.add('feed-select')
        }
    }
}

function commentForm(){
    let container = document.querySelector('#create-comment')
    if(container.classList.contains('hidden')){
        container.classList.remove('hidden')
    }else{
        container.classList.add('hidden')
    }
}

function wrapCaptures(id){
    let btn = document.getElementById(id)
    let capture = document.getElementById(`capture-${id.split('-')[1]}`)
    if(capture.classList.contains('cap-wrap')){
        capture.classList.remove('cap-wrap')
        btn.innerHTML = 'view more'
    }else{
        capture.classList.add('cap-wrap')
        btn.innerHTML = 'view less'
    }
}

function editCapture(){
    document.querySelector('#single-cap').classList.add('hidden')
    document.querySelector('.form-post-edit').classList.remove('hidden')
}