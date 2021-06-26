const DOMAIN = '..' //'https://duonghuuthanh.github.io/dhthanh'

const loadCategories = (id="#categoryId") => {
    fetch(`${DOMAIN}/data/category.json`).then(res => res.json()).then(data => {
        let msg = ""
        for (let i = 0; i < data.length; i++) {
            let d = data[i]
            if ('sub' in d) {
                let temp = ""
                for (let j = 0; j < d['sub'].length; j++)
                    temp += `<a class="dropdown-item" href="javascript:;" rel=${d['sub'][j].rel}>${d['sub'][j].name}</a>`

                msg += `
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="javascript:;" data-toggle="dropdown">${d.name}</a>
                        <div class="dropdown-menu">
                            ${temp}
                        </div>
                    </li>
                `
            }
            else {
                msg += `
                    <li class="nav-item">
                        <a class="nav-link" href="javascript:;" rel="${d.rel}">${d.name}</a>
                    </li>
                `
            }
        }
        $(id).append(msg)
    })
}

const loadPublication = (id="#contentId") => {
    fetch(`${DOMAIN}/data/publications.json`).then(res => res.json()).then(data => {
        let msg = ""
        for (let i = 0; i < data.length; i++) 
            msg += `<li class="list-group-item" title="${data[i].abstract}">
                <a href="${data[i].doi}">${data[i].subject} - ${data[i].year}</a>
                <p>${data[i].ref}</p>
            </li>`

        $(id).html(`
            <h1 class="text-center text-success">CÁC CÔNG TRÌNH KHOA HỌC ĐÃ CÔNG BỐ</h1>
            <ul class="list-group list-group-flush">
                ${msg}
            </ul>
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

$(document).ready(() => {
    loadCategories()

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