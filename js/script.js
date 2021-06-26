const DOMAIN = 'https://duonghuuthanh.github.io/dhthanh'

const loadCategories = (id="#categoryId") => {
    fetch(`${DOMAIN}/data/category.json`).then(res => res.json()).then(data => {
        let msg = ""
        for (let i = 0; i < data.length; i++)
            msg += `
                <li class="nav-item">
                    <a class="nav-link" href="javascript:;" rel="${data[i].rel}">${data[i].name}</a>
                </li>
            `
        $(id).append(msg)
    })
}

const loadPublication = (id="#contentId") => {
    fetch(`${DOMAIN}/data/publications.json`).then(res => res.json()).then(data => {
        let msg = ""
        for (let i = 0; i < data.length; i++) 
            msg += `<li class="list-group-item" title="${data[i].abstract}">
                <a href="${data[i].doi}">${data[i].subject}</a>
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

$(document).ready(() => {
    loadCategories()
    loadPublication()

    $("#categoryId").on("click", "li > a", () => {
        $("#categoryId > li").removeClass("active")
        $(this).parent().addClass("active")

        
    })
})