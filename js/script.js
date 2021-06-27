let DOMAIN = ""
if (location.href.indexOf("github") >= 0)
    DOMAIN = "https://duonghuuthanh.github.io/dhthanh"

const spinner = `<div class="spinner-border text-primary"></div>`
const bgcolors = ["bg-muted", "bg-primary", "bg-secondary", "bg-info", "bg-success", "bg-danger", "bg-warning", "bg-default"]

const loadCategories = (id="#categoryId") => {
    fetch(`${DOMAIN}/data/category.json`).then(res => res.json()).then(data => {
        let msg = ""
        data.forEach(d => {
            if ('sub' in d) {
                let temp = ""
                for (let j = 0; j < d['sub'].length; j++)
                    temp += `<a class="dropdown-item" href="javascript:;" rel=${d['sub'][j].rel}>${d['sub'][j].name}</a>`

                msg += `
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="javascript:;" data-toggle="dropdown"><i class="${d.icon}"></i> ${d.name}</a>
                        <div class="dropdown-menu">${temp}</div>
                    </li>
                `
            }
            else {
                msg += `
                    <li class="nav-item">
                        <a class="nav-link" href="javascript:;" rel="${d.rel}"><i class="${d.icon}"></i> ${d.name}</a>
                    </li>
                `
            }
        })
        $(id).append(msg)
    })
}

const loadPublication = (id="#contentId") => {
    $(id).html(spinner)
    fetch(`${DOMAIN}/data/publications.json`).then(res => res.json()).then(data => {
        let msg = ""
        
        data.forEach(d => {
            msg += `<li class="list-group-item" title="${d.abstract}">
                        <a href="${d.doi}">${d.subject} - ${d.year}</a>
                        <p>${d.ref}</p>
                    </li>`
        })
            

        $(id).html(`
            <h1 class="text-center text-success">CÁC CÔNG TRÌNH KHOA HỌC ĐÃ CÔNG BỐ</h1>
            <ul class="list-group list-group-flush">${msg}</ul>
        `)
    })
}

const loadResource = (id="#contentId") => {
    $(id).html(`
        <h1 class="text-center text-info">TÀI NGUYÊN HỌC TẬP</h1>
    `)
}

const loadVideo = (videoType, subject, id="#contentId") => {
    fetch(`${DOMAIN}/data/video/${videoType}.json`).then(res => res.json()).then(data => {
        let msg = ""
        data.forEach(d => {
            let v = `
                <iframe width="100%" height="315" src="${d.embeded_link}" title="${d.subject}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            `
            msg += `
                <div class="col-md-6 col-xs-12">
                    <div class="card">
                        <div class="card-header bg-info">${d.subject}</div>
                        <div class="card-content">${v}</div>
                    </div>
                </div>
            `
        })

        $(id).html(`
            <h1 class="text-center text-danger text-uppercase">${subject}</h1>
            <div class="row">${msg}</div>
        `)
    })
}

const loadHomePage = (id="#contentId") => {
    fetch(`${DOMAIN}/data/home.json`).then(res => res.json()).then(data => {
       
        // Load note
        data.filter(data => data.type==="note").forEach(d => {

        })
        // Load video
        data.forEach(d => {
            let video = ""
            let note = ""
            switch (d.type) {
                case "note":
                    d.data.forEach(v => {
                        note += `
                        <div class="col-md-4 col-xs-6">
                            <div class="card">
                              <div class="card-header ${bgcolors[parseInt(Math.random()*bgcolors.length)]}">${v.title}</div>
                              <div class="card-body">${v.content}</div>
                            </div>
                        </div>
                        `
                    })

                    $(id).append(`
                        <div class="item">
                            <h1>${d.subject}</h1>
                            <div class="row">
                                ${note}
                            </div>
                        </div>
                    `)
                    
                    break
                case "video":
                    d.data.forEach(v => {
                        video += `
                        <div class="item-video" data-merge="3">
                            <iframe width="100%" height="315" src="${v}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                        </div>
                        `
                    })

                    $(id).append(`
                        <div class="item">
                            <h1>${d.subject}</h1>
                            <div class="owl-carousel owl-theme">
                                ${video}
                            </div>
                        </div>
                    `)
                    break
            }
            
            $('.owl-carousel').owlCarousel({
                items:1,
                merge:true,
                loop:true,
                margin:10,
                video:true,
                lazyLoad:true,
                center:true,
                autoplay:true,
                autoplayTimeout:3000,
                autoplayHoverPause:true,
                responsive:{
                    480:{
                        items:2
                    },
                    600:{
                        items:4
                    }
                }
            })
        })
    })
}

$(document).ready(() => {
    loadCategories()
    loadHomePage()
    // loadPublication()

    $("#categoryId").on("click", "li a", function() {
        $("#categoryId > li").removeClass("active")
        $(this).parent().addClass("active")

        let t = $(this).attr("rel")
        switch (t) {
            case 'course':
                break
            case 'publication':
                loadPublication()
                break
            case 'resource':
                loadResource()
                break
            case 'java-oop':
                loadVideo('java-oop', $(this).text())
                break
            case 'java-programming':
                loadVideo('java-programming', $(this).text())
                break
            case 'web-design':
                loadVideo('web-design', $(this).text())
                break
            case 'python-flask':
                loadVideo('python-flask', $(this).text())
                break
            default:
                if (t != null)
                    alert('comming soon...')
        }
    })
})