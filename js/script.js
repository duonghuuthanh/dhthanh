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
            // load for home
            if (d.id == 1 && 'sub' in d)
                loadLessonsHome(contentId, d['sub'])

             // loaf category
            if ('sub' in d) {
                let temp = ""
                d['sub'].forEach(s => {
                    temp += `<a class="dropdown-item" href="#${s.rel}" rel=${s.rel}>${s.name}</a>`
                })

                msg += `
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#${d.rel}" data-toggle="dropdown"><i class="${d.icon}"></i> ${d.name}</a>
                        <div class="dropdown-menu">${temp}</div>
                    </li>
                `
            }
            else {
                msg += `
                    <li class="nav-item">
                        <a class="nav-link" href="#${d.rel}" rel="${d.rel}"><i class="${d.icon}"></i> ${d.name}</a>
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
            msg += `<li class="list-group-item wow ${animate}" title="${d.abstract}" rel="${d.authors}">
                        <a href="javascript:;" rel="${d.doi}" class="paper">${d.subject} - ${d.year}</a>
                        
                        (<a class="text-danger" href="${d.doi}">${d.doi}</a>)
                        <p>${d.ref}</p>
                    </li>`
        })

        $(id).html(`
            <h1 class="text-center text-success">CÁC CÔNG TRÌNH KHOA HỌC ĐÃ CÔNG BỐ</h1>
            <ul class="list-group list-group-flush publication">${msg}</ul>
        `)
    })
}

const loadPost = (postType, id=contentId) => {
    fetch(`${DOMAIN}/data/posts/${postType}.json`).then(res => res.json()).then(data => {
        let lessons = ""
        data.forEach(d => {
            lessons += `
                <li class='list-group-item'><a class="post" href="javascript:;" rel="${d.file}">${d.subject}</a></li>
            `
        })
        $("#popupId").html(`
            <ul class="list-group">
                ${lessons}
            </ul>
        `)
        $("#popupId").show("slow")
        $("#popupId li:first-child > a").click()
    }).catch(() => alert("Comming soon..."))
}

const loadVideo = (videoType, subject, id=contentId) => {
   
    fetch(`${DOMAIN}/data/video/${videoType}.json`).then(res => res.json()).then(data => {
        $(id).html(`
            <h1 class="text-center text-danger text-uppercase">${subject}</h1>
            <div class="row" id="video"></div>
        `)
        
        data.forEach(d => {
            let v = `
                <iframe width="100%" height="315" src="${d.embeded_link}" title="${d.subject}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            `
            let msg = `
                <div class="col-md-6 col-xs-12">
                    <div class="card wow animate__zoomIn">
                        <div class="card-header bg-info">${d.subject}</div>
                        <div class="card-content">${v}</div>
                    </div>
                </div>
            `

            $("#video").append(msg)
        })
    }).catch(() => alert("Comming soon..."))
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
                <div class="card wow animate__zoomIn note">
                  <div class="card-header ${bgcolors[c++]}">${v.title}</div>
                  <div class="card-body">${v.content}</div>
                </div>
            `
            if (c == bgcolors.length)
                c = 0
        })

        $(id).append(`
            <div class="item">
                <h1 class="subject text-center text-uppercase text-danger">${d.subject}</h1>
                <div class="card-columns">${note}</div>
            </div>
        `)
    })

    fetch(`${DOMAIN}/data/home/video.json`).then(res => res.json()).then(d => {
        $(id).append(`
            <div class="item wow animate__slideInUp">
                <h1 class="subject text-center text-uppercase text-danger">${d.subject}</h1>
                <div class="owl-carousel owl-theme" id="myVideo">
                </div>
            </div>
        `)

        d.data.forEach(v => {
            $("#myVideo").append(`
                <div class="item-video" data-merge="3">
                    <iframe width="100%" height="315" data-src="${v}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
            `)
        })

        let owl = $('.owl-carousel').owlCarousel({
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

        owl.on('changed.owl.carousel', function(event) {
            var current = event.item.index;
            var currentVideo = $(event.target).find('.owl-item').eq(current).find('iframe');
           
            if ( currentVideo.length ) {
              var currentVideoSrc = currentVideo.attr('data-src');
              currentVideo.attr('src', currentVideoSrc);
            }
          });
    })
}

const loadLessonsHome = (id=contentId, lessons) => {
    let msg = ""
    lessons.forEach(lesson => {
        msg += `
            <div class="col-md-4 col-xs-12 lesson-card">
                <div class="card wow animate__flip">
                    <div class="card-header"><h5>${lesson.name}</h5></div>
                    <div class="card-content">
                        <a class="dropdown-item lesson" href="#${lesson.rel}" rel="${lesson.rel}">
                            <img src="${lesson.image}" class="img-fluid" alt="${lesson.name}" />
                        </a>
                    </div>
                </div>
            </div>
        `
    })

    $(id).append(`
        <div class="item wow animate__slideInUp">
            <h1 class="subject text-center text-uppercase text-danger">CÁC CHỦ ĐỀ BÀI VIẾT</h1>
            <div class="row">
                ${msg}
            </div>
        </div>
    `)
}

const loadCarousel = (id="#myBanner", path="images/home/friends/", num=22) => {
    let indicators = ""
    let items = ""
    for (let i = 0; i < num; i++) {
        let cls = i == 0 ? 'active': ''

        indicators += `
            <li data-target="#myBanner" data-slide-to="${i}" class="${cls}"></li>
        `

        items += `
            <div class="carousel-item ${cls}">
                <img class="img-fluid" src="${path}${i + 1}.png" alt="friends">
            </div>
        `
    }

    $(id + " > .carousel-indicators").html(indicators)
    $(id + " > .carousel-inner").html(items)
}

$(document).ready(() => {
    loadCategories()
    $("#popupId").hide()
    
    if (location.hash.startsWith("#post"))
        loadPost(location.hash.substring(1))
    else
        switch (location.hash) {
            case "#publication":
                loadPublication()
                break
            case "#resource":
                loadLearningResources()
                break
            default: 
                loadHomePage()
                loadCarousel()
        }

    wow = new WOW({
        boxClass:     'wow',      
        animateClass: 'animate__animated', 
        offset:       0,          
        mobile:       true,      
        live:         true        
    })
    wow.init();

    $("#categoryId").on("click", "li a", function(event) {
        $("#popupId").hide()
        $("#categoryId > li").removeClass("active")
        $(this).parent().addClass("active")

        let t = $(this).attr("rel")
        
        $(contentId).removeClass("text-justify")
        if (t !== undefined && t.startsWith("video"))
            loadVideo(t, $(this).text())
        else if (t != undefined && t.startsWith("post")) {
            loadPost(t)
            $(contentId).addClass("text-justify")
        } else
            switch (t) {
                case 'course':
                    break
                case 'publication':
                    loadPublication()
                    break
                case 'resource':
                    loadLearningResources()
                    break
                default:
                    if (t != null)
                        alert('comming soon...')
            }
    })

    $("#contentId").on("click", "a.lesson", function() {
        let t = $(this).attr("rel")
        loadPost(t)
    })

    $("#contentId").on("click", ".publication li a.paper", function() {
        $("#myModal").modal('show')
        $("#myModal .modal-title").html(`
            <a href="${$(this).attr('rel')}">${$(this).text()}</a>
            <br>
            <em>${$(this).parent().attr('rel')}</em>
        `)
        $("#myModal .modal-body").text($(this).parent().attr('title'))
    })

    $("#popupId").on("click", "a.post", function() {
        $("#popupId li").removeClass('bg-warning')
        $(this).parent().addClass('bg-warning')
        fetch(`${DOMAIN}/${$(this).attr("rel")}`).then(res => res.text()).then((data) => {
            $(contentId).html(data)
        })
    })
})