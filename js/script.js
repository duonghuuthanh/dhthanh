let DOMAIN = ""
if (location.href.indexOf("github") >= 0)
    DOMAIN = "https://duonghuuthanh.github.io/dhthanh"

const spinner = `<div class="spinner-border text-primary"></div>`
const bgcolors = ["bg-primary", "bg-secondary", "bg-info", "bg-success", "bg-danger", "bg-warning", "bg-default"]
const contentId = "#contentId"

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

const loadPublication = (id=contentId) => {
    $(id).html(spinner)
    fetch(`${DOMAIN}/data/publications.json`).then(res => res.json()).then(data => {
        let msg = ""
        
        data.forEach((d, idx) => {
            let animate = idx % 2 == 0 ? 'animate__slideInLeft':'animate__slideInRight'
            msg += `<li class="list-group-item wow ${animate}" title="${d.abstract}">
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

const loadVideo = (videoType, subject, id=contentId) => {
    fetch(`${DOMAIN}/data/video/${videoType}.json`).then(res => res.json()).then(data => {
        let msg = ""
        data.forEach(d => {
            let v = `
                <iframe width="100%" height="315" src="${d.embeded_link}" title="${d.subject}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            `
            msg += `
                <div class="col-md-6 col-xs-12">
                    <div class="card wow animate__zoomIn">
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

const loadLearningResources = (id=contentId) => {
    const loadResource = (resourceFile, resourceId) => {
        fetch(`${DOMAIN}/data/learning/${resourceFile}`).then(res => res.json()).then(data => {
            let msg = ""
            data.forEach(d => {
                msg += `
                    <li class="list-group-item">
                        <a href="${d.link}">${d.subject}</a>
                    </li>
                `
            })

            $(resourceId).html(msg)
        })
    }

    fetch(`${DOMAIN}/data/learning/learning.json`).then(res => res.json()).then(data => {
        let msg = ""
        data.forEach(d => {
            msg += `
                <section>
                    <h1 class="subject line-left text-danger text-uppercase">${d.subject}</h1>
                    <ol id="${d.idHTML}" class="list-group"></ol>
                </section>
            `
        })

        $(id).html(`
            <h1 class="text-center text-info">TÀI NGUYÊN HỌC TẬP</h1>    
            ${msg}
        `)

        data.forEach(d => {
            loadResource(d.file, `#${d.idHTML}`)
        })
    })
}

const loadHomePage = (id=contentId) => {
    fetch(`${DOMAIN}/data/home/note.json`).then(res => res.json()).then(d => {
        let note = ""
        let c = parseInt(Math.random() * bgcolors.length)
        d.data.forEach(v => {
            note += `
            <div class="col-md-4 col-xs-6 note">
                <div class="card wow animate__zoomIn">
                  <div class="card-header ${bgcolors[c++]}">${v.title}</div>
                  <div class="card-body">${v.content}</div>
                </div>
            </div>
            `
            if (c == bgcolors.length)
                c = 0
        })

        $(id).append(`
            <div class="item">
                <h1 class="subject text-center text-uppercase text-danger">${d.subject}</h1>
                <div class="row">
                    ${note}
                </div>
            </div>
        `)
    })

    fetch(`${DOMAIN}/data/home/video.json`).then(res => res.json()).then(d => {
        let video = ""
        d.data.forEach(v => {
            video += `
            <div class="item-video wow animate__slideInUp" data-merge="3">
                <iframe width="100%" height="315" src="${v}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
            `
        })

        $(id).append(`
            <div class="item">
                <h1 class="subject text-center text-uppercase text-danger">${d.subject}</h1>
                <div class="owl-carousel owl-theme">
                    ${video}
                </div>
            </div>
        `)

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
}

$(document).ready(() => {
    loadCategories()
    loadHomePage()
    // loadPublication()
    wow = new WOW({
        boxClass:     'wow',      // default
        animateClass: 'animate__animated', // default
        offset:       0,          // default
        mobile:       true,       // default
        live:         true        // default
    })
    wow.init();

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
                loadLearningResources()
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
            case 'jsf':
                loadVideo('jsf', $(this).text())
                break
            case 'programming-technique-review':
                loadVideo('programming-technique-review', $(this).text())
                break
            default:
                if (t != null)
                    alert('comming soon...')
        }
    })
})