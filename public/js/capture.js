let textArea = document.getElementById('cap-text-area')

if (textArea) {
    function getScrollHeight(elm){
        var savedValue = elm.value
        elm.value = ''
        elm._baseScrollHeight = elm.scrollHeight
        elm.value = savedValue
    }
    function onExpandableTextareaInput({ target:elm }){
        // make sure the input event originated from a textarea and it's desired to be auto-expandable
        if( !elm.classList.contains('autoExpand') || !elm.nodeName == 'TEXTAREA' ) return
        
        var minRows = elm.getAttribute('data-min-rows')|0, rows;
        !elm._baseScrollHeight && getScrollHeight(elm)
      
        elm.rows = minRows
        rows = Math.ceil((elm.scrollHeight - elm._baseScrollHeight) / 16)
        elm.rows = minRows + rows
    }
    textArea.addEventListener('input', onExpandableTextareaInput)
}

function profileSettings(){
    let menu = document.getElementById('side-bar')
    //if menu is showing
    if(menu.classList.contains('translate-x-0')){
        menu.classList.remove('translate-x-0')
        menu.classList.add('translate-x-[100%]')
    }else{ //if menus is not showing
        menu.classList.remove('translate-x-[100%]')
        menu.classList.add('translate-x-0')
    }
}

// function editCaptureMenu(){
//     let cap = document.getElementById('single-cap')
//     let capEdit = document.getElementById('post-edit')
//     //if closed
//     if(capEdit.classList.contains('hidden')){
//         capEdit.classList.remove('hidden')
//         cap.classList.add('hidden')
//         viewSettings('p-0')
//     }else{ //if open
//         cap.classList.remove('hidden')
//         capEdit.classList.add('hidden')
//     }
// }

function commentForm(){
    let container = document.querySelector('#create-comment')
    if(container.classList.contains('hidden')){
        container.classList.remove('hidden')
    }else{
        container.classList.add('hidden')
    }
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
