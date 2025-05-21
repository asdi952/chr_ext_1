


//starget == scrollable_target
class Scroll{
    constructor(){
        this.scrollTarget = undefined

        this.dist = 200
        this.dist_period = 154
        this.sprint_mult = 2
        this.page_margin = 0.1

        this.scrolling_interval = undefined

        this.all_stargets = []
        this.all_stargets_timeout = undefined
        this.all_stargets_timeout_time = 2000

        this.inputYAxis = new KkeyAxis()
    }

    calcScrollDist(dir){
        let dist = this.dist
        if(isKkeyDown("ShiftLeft")){
            dist *= this.sprint_mult
        }else
        if(isKkeyDown("AltLeft")){
            dist = window.screen.height * (1 - this.page_margin)
        }
        return dist * dir
    }

    startScroling(dir){
        if(this.scrolling_interval != undefined){return}
        
        const dist = this.calcScrollDist(dir)
        this.scrollTarget.scrollBy(0, dist)
        this.scrolling_interval = setInterval(()=>{ this.scrollTarget.scrollBy(0, dist)}, this.dist_period)
    }

    stopScrolling(){
        if(this.scrolling_interval == undefined){return}
        clearInterval(this.scrolling_interval)
        this.scrolling_interval = undefined
    }

    static isScrollableTarget(el){
        const elstyle = getComputedStyle(el)
        return (["auto", "scroll"].includes(elstyle) && el.scrollHeight > el.clientHeight && el.clientHeight > 100)
    }

    try_update_scrolling_targets(){
        if(this.all_stargets_timeout != undefined){return 1}

        const all = document.body.querySelectorAll("*")
        this.all_stargets = Array.from(all).filter(el => Scroll.isScrollableTarget(el))

        if(document.scrollingElement && document.scrollingElement.scrollHeight 
            && document.scrollingElement.scrollHeight > document.scrollingElement.clientHeight && document.scrollingElement.clientHeight > 100){
            this.all_stargets.push(document.scrollingElement)
        }

        if(this.all_stargets.length == 0){return 1}

        this.all_stargets_timeout = setTimeout(()=>{
            this.all_stargets_timeout = undefined
        },this.all_stargets_timeout_time)

        return 0
    }
    
    find_closest_starget(point){

        function get_starget_centerpoint(starget){
            const rect = starget.getBoundingClientRect()
            return Vec2.Defined(rect.x + rect.width/2, rect.y + rect.height/2)
        }

        let best = {
            dist:0,
            starget: undefined,
        }

        for(let starget of this.all_stargets){
            const dist = get_starget_centerpoint(starget).sub_vec2(point).magnitude()
            console.log(dist)
            if(dist > best.dist){
                best.dist = dist
                best.starget = starget
            }
        }
        return best.starget
    }

    try_first_search(){
        if(this.scrollTarget == undefined){
            this.try_update_scrolling_targets()
            this.scrollTarget = this.find_closest_starget(Vec2.Defined(window.screen.width/2, window.screen.height/2))
        }
    }

    keydown(kevent){
        if(kevent.code === "ArrowDown"){
            kevent.preventDefault()
            this.try_first_search()
            this.startScroling(1)
            console.log("stargets length", this.all_stargets.length)
        }else
        if(kevent.code === "ArrowUp"){
            kevent.preventDefault()
            this.try_first_search()
            this.startScroling(-1)
            console.log("stargets length", this.all_stargets.length)
        }
    }
    keydown_all_time(kevent){
        if(kevent.code === "ArrowDown" || kevent.code === "ArrowUp"){
            kevent.preventDefault()
        }
    }

    keyup(kevent){
        if(kevent.code === "ArrowDown" || kevent.code === "ArrowUp"){
            kevent.preventDefault()
            this.stopScrolling()
        }
    }

}

const scroll = new Scroll()
