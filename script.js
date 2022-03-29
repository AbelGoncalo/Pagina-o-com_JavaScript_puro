let data = Array.from({length: 100})
.map((_,i)=>` Item ${(i +1)} `)





// ============================================================


let perPage = 5

const state = {

    page:1,
    perPage,
    totalPage:Math.ceil(data.length/perPage), 
    maxVisibleButtons : 5
}

const html = {

    get(element){
        return document.querySelector(element)
    }
}


const controls = {
    next(){
        state.page ++

        //se passar total de paginas
        const lastPage = state.page > state.totalPage
        if(lastPage){
            
            //volta na ultima página
            state.page --
        }
    },
    prev(){

        //pagina anterior
        state.page--

        //Permanecer na página 1
        if(state.page<1){
            state.page++
        }
    },
    goTo(page){

        // páginas negativa
        if(page<1){
            page=1
        }

        state.page = +page

        //página pretendida não pode ser msior que totalpage
        if(page>state.totalPage){
            state.page = state.totalPage
        }
    },
    createListeneres(){
        html.get('.first').addEventListener('click',()=>{
            controls.goTo(1)
            update()
        })

        html.get('.last').addEventListener('click',()=>{
            controls.goTo(state.totalPage)
            update()
        })

        html.get('.next').addEventListener('click',()=>{
            controls.next()
            update()
        })

        html.get('.prev').addEventListener('click',()=>{
            controls.prev()
            update()
        })
    }
    
}

const list = {
    create(item){

        console.log(item)
        const div = document.createElement('div')
        div.classList.add('item')
        div.innerHTML= item

        html.get('.list').appendChild(div)
    },
    update(){

        // Zerar a lista de  elementos
        html.get('.list').innerHTML = ""

        //index página
        let page = state.page -1;

        let start = page * state.perPage
        let end = start + state.perPage

        // qtd items por paginas
        const paginacaoItems = data.slice(start, end)

        paginacaoItems.forEach(list.create)

        
        
    }
}

function update(){

   list.update()
   buttons.update()
}

const buttons ={

    element : html.get('.pagination .numbers'),

    create(number){

        //criar uma div com elemento
        
        const button = document.createElement('div')

        button.innerHTML= number ;

        if(state.page == number){
            button.classList.add('active')
        }

        button.addEventListener('click', (event) =>{
            const page = event.target.innerText

            controls.goTo(page)
            update()
        })

        buttons.element.appendChild(button)


    },

    update(){

        html.get('.pagination .numbers').innerHTML = "";
        const {maxLeft, maxRight} = buttons.calculateMaxvisible()

        for(let page = maxLeft; page<= maxRight; page++){

            buttons.create(page)
        }
    },
    calculateMaxvisible(){

        const {maxVisibleButtons} = state
        let maxLeft = (state.page - Math.floor(maxVisibleButtons/2))
        let maxRight = (state.page + Math.floor(maxVisibleButtons/2))

        if(maxLeft<1){
            maxLeft= 1
            maxRight = maxVisibleButtons
        }

        if(maxRight>state.totalPage){
            maxLeft =  state.totalPage - (maxVisibleButtons-1)
            maxRight = state.totalPage

            if(maxLeft<1) maxLeft-1
        }

        return {maxLeft, maxRight}
    }
}

function init(){

    update()
    controls.createListeneres()
}

init()


